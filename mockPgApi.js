const PAYOUT_DATA = {
  2: { 3: 10, 4: 25, 5: 50 }, // GREEN
  3: { 3: 8, 4: 20, 5: 40 },  // RED
  4: { 3: 6, 4: 15, 5: 30 },  // WHITE
  5: { 3: 5, 4: 10, 5: 15 },  // CHAR8
  6: { 3: 3, 4: 5, 5: 12 },   // BALL5
  7: { 3: 3, 4: 5, 5: 12 },   // BAMBOO5
  8: { 3: 2, 4: 4, 5: 10 },   // BALL3
  9: { 3: 1, 4: 3, 5: 6 },    // BALL2
  10: { 3: 1, 4: 3, 5: 6 }    // BAMBOO2
};

const VISIBLE_ROWS_BY_COL = [
  [1, 2, 3, 4],
  [8, 9, 10, 11, 12],
  [15, 16, 17, 18, 19],
  [22, 23, 24, 25, 26],
  [29, 30, 31, 32]
];

const ALL_VISIBLE_INDICES = new Set(VISIBLE_ROWS_BY_COL.flat());

const NORMAL_MULTIPLIERS = [1, 2, 3, 5];
const FREE_SPIN_MULTIPLIERS = [2, 4, 6, 10];

const sessions = new Map();

function round2(n) {
  return Math.round(n * 100) / 100;
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomBaseSymbol(allowScatter, scatterChance = 0.06) {
  if (allowScatter && Math.random() < scatterChance) return 1;
  // Weighted slightly toward lower/mid tiles for realistic hit frequency
  const pool = [2, 3, 4, 5, 5, 6, 6, 7, 7, 8, 8, 8, 9, 9, 9, 10, 10, 10];
  return pool[Math.floor(Math.random() * pool.length)];
}

function generateInitialGrid(isFreeSpin = false) {
  const reels = new Array(35).fill(0);
  const goldPositions = new Set();

  for (let col = 0; col < 5; col++) {
    let hasScatterInCol = false;
    for (let row = 0; row < 7; row++) {
      const idx = col * 7 + row;
      const isVisible = ALL_VISIBLE_INDICES.has(idx);
      const sym = randomBaseSymbol(isVisible && !hasScatterInCol, isFreeSpin ? 0.04 : 0.06);
      if (sym === 1) hasScatterInCol = true;
      reels[idx] = sym;

      if (isVisible && sym >= 2 && sym <= 10 && col >= 1 && col <= 3) {
        if ((isFreeSpin && col === 2) || Math.random() < 0.18) {
          goldPositions.add(idx);
        }
      }
    }
  }

  return { reels, goldPositions };
}

function goldSetToMap(goldPositions) {
  const map = {};
  let i = 0;
  for (const pos of Array.from(goldPositions).sort((a, b) => a - b)) {
    map[String(i++)] = pos;
  }
  return map;
}

function evaluateGrid(reels, goldPositions, cs, ml, multiplier) {
  const wp = {};
  const lw = {};
  const snww = {};
  const rwsp = {};
  let totalWin = 0;
  const allWinPos = new Set();

  // Check symbols 2..10 starting from col 0
  for (let sym = 2; sym <= 10; sym++) {
    const colMatches = [];
    for (let col = 0; col < 5; col++) {
      const matches = [];
      for (const pos of VISIBLE_ROWS_BY_COL[col]) {
        const s = reels[pos];
        if (s === sym || s === 0) {
          matches.push(pos);
        }
      }
      if (matches.length === 0) break;
      colMatches.push(matches);
    }

    const len = colMatches.length;
    if (len >= 3) {
      const ways = colMatches.reduce((acc, arr) => acc * arr.length, 1);
      const basePay = PAYOUT_DATA[sym][len];
      const winAmt = round2(basePay * cs * ml * ways * multiplier);
      const positions = colMatches.flat();

      wp[String(sym)] = positions;
      lw[String(sym)] = winAmt;
      snww[String(sym)] = ways;
      rwsp[String(sym)] = basePay;
      totalWin = round2(totalWin + winAmt);
      for (const p of positions) allWinPos.add(p);
    }
  }

  let scatterCount = 0;
  for (const pos of ALL_VISIBLE_INDICES) {
    if (reels[pos] === 1) scatterCount++;
  }

  // Partition winning positions into gold->wild transforms vs removed positions (ptbr)
  const ptbr = [];
  const transformedToWild = new Set();
  for (const pos of Array.from(allWinPos).sort((a, b) => a - b)) {
    if (goldPositions.has(pos)) {
      transformedToWild.add(pos);
    } else {
      ptbr.push(pos);
    }
  }

  return {
    hasWin: totalWin > 0,
    totalWin,
    wp: totalWin > 0 ? wp : null,
    lw: totalWin > 0 ? lw : null,
    snww: totalWin > 0 ? snww : null,
    rwsp: totalWin > 0 ? rwsp : null,
    ptbr: ptbr.length > 0 ? ptbr : null,
    allWinPos,
    transformedToWild,
    scatterCount
  };
}

function applyCascade(reels, goldPositions, ptbrList, transformedToWild, isFreeSpin) {
  const nextReels = reels.slice();
  const nextGold = new Set(goldPositions);

  // Gold winning tiles become WILD (0) and lose gold status
  for (const pos of transformedToWild) {
    nextReels[pos] = 0;
    nextGold.delete(pos);
  }

  const removedSet = new Set(ptbrList || []);
  const rns = [[], [], [], [], []];
  const rnss = [[], [], [], [], []];

  for (let col = 0; col < 5; col++) {
    const colVisible = VISIBLE_ROWS_BY_COL[col];
    const survivors = [];

    // Collect surviving symbols from bottom to top
    for (let i = colVisible.length - 1; i >= 0; i--) {
      const pos = colVisible[i];
      if (!removedSet.has(pos)) {
        survivors.push({
          sym: nextReels[pos],
          isGold: nextGold.has(pos)
        });
      }
      nextGold.delete(pos);
    }

    const needed = colVisible.length - survivors.length;
    const newSymbols = [];
    const newGoldIndices = [];

    for (let k = 0; k < needed; k++) {
      const sym = randomBaseSymbol(false);
      const isGold = sym >= 2 && sym <= 10 && col >= 1 && col <= 3 && ((isFreeSpin && col === 2) || Math.random() < 0.16);
      newSymbols.push(sym);
      if (isGold) newGoldIndices.push(k);
    }

    rns[col] = newSymbols;
    rnss[col] = newGoldIndices;

    // Place back into colVisible from top to bottom: newSymbols then survivors (reversed back to top->bottom)
    const topToBottom = [
      ...newSymbols.map((sym, idx) => ({ sym, isGold: newGoldIndices.includes(idx) })),
      ...survivors.reverse()
    ];

    for (let i = 0; i < colVisible.length; i++) {
      const pos = colVisible[i];
      nextReels[pos] = topToBottom[i].sym;
      if (topToBottom[i].isGold) nextGold.add(pos);
    }

    // Refresh buffer rows for clean visual continuity
    nextReels[col * 7] = randomBaseSymbol(false);
    nextReels[col * 7 + 6] = randomBaseSymbol(false);
    if (col === 0 || col === 4) nextReels[col * 7 + 5] = randomBaseSymbol(false);
  }

  return {
    nextReels,
    nextGold,
    respinInfo: {
      sspt: {},
      rns,
      rnss,
      bsb: []
    }
  };
}

function getGameWinType(winAmt, betAmt) {
  if (winAmt <= 0) return -1;
  const ratio = betAmt > 0 ? winAmt / betAmt : 0;
  if (ratio >= 50) return 4;
  if (ratio >= 35) return 3;
  if (ratio >= 15) return 2;
  if (ratio >= 5) return 1;
  return 1;
}

function getOrCreateSession(token) {
  const key = token || 'default';
  if (!sessions.has(key)) {
    const { reels, goldPositions } = generateInitialGrid(false);
    const ssb = goldSetToMap(goldPositions);
    const initialSid = String(Date.now()) + '000';
    const initialState = {
      wp: null,
      lw: null,
      snww: null,
      ssb,
      ss: ssb,
      fs: null,
      rs: null,
      ssaw: 0,
      ptbr: null,
      sc: 0,
      mi: 0,
      wm: 1,
      orl: reels,
      rl: reels,
      gwt: -1,
      fb: null,
      ctw: 0,
      pmt: null,
      cwc: 0,
      fstc: null,
      pcwc: 0,
      rwsp: null,
      hashr: '0:0#MV#0#MT#0#MG#0#',
      ml: 1,
      cs: 200,
      sid: initialSid,
      psid: initialSid,
      st: 1,
      nst: 1,
      pf: 1,
      aw: 0,
      wid: 0,
      wt: 'C',
      wk: '0_C',
      wbn: null,
      wfg: null,
      blb: 10000000,
      blab: 10000000,
      bl: 10000000,
      tb: 0,
      tbb: 0,
      tw: 0,
      np: 0,
      ocr: null,
      mr: null,
      ge: [1, 11]
    };

    sessions.set(key, {
      balance: 10000000,
      cs: 200,
      ml: 1,
      sidCounter: 1,
      lastState: initialState,
      pendingRespin: null,
      freeSpin: null,
      parentSid: initialSid,
      ssaw: 0,
      aw: 0,
      cwc: 0,
      pcwc: 0
    });
  }
  return sessions.get(key);
}

function nextSid(session) {
  session.sidCounter += 1;
  return String(Date.now()) + String(session.sidCounter).padStart(4, '0');
}

function handleSpin(session, params) {
  const cs = Number(params.cs) > 0 ? Number(params.cs) : session.cs;
  const ml = Number(params.ml) > 0 ? Number(params.ml) : session.ml;
  session.cs = cs;
  session.ml = ml;

  const betAmount = round2(cs * ml * 20);
  const sid = nextSid(session);

  let reels;
  let goldPositions;
  let st = 1;
  let mi = 0;
  let respinData = null;
  let isFreeSpinMode = false;

  if (session.pendingRespin) {
    // Cascade / Respin step
    reels = session.pendingRespin.nextReels;
    goldPositions = session.pendingRespin.nextGold;
    respinData = session.pendingRespin.respinInfo;
    isFreeSpinMode = session.pendingRespin.isFreeSpinMode;
    st = isFreeSpinMode ? 22 : 4;
    mi = session.pendingRespin.mi;
    session.pendingRespin = null;
  } else if (session.freeSpin && session.freeSpin.remaining > 0) {
    // Free Spin step
    isFreeSpinMode = true;
    st = 21;
    mi = 0;
    session.freeSpin.step += 1;
    session.freeSpin.remaining -= 1;
    session.freeSpin.nosa = 0;
    session.ssaw = 0;
    session.cwc = 0;
    session.parentSid = sid;
    const gen = generateInitialGrid(true);
    reels = gen.reels;
    goldPositions = gen.goldPositions;
  } else {
    // Normal Spin step
    if (session.balance < betAmount) {
      // Auto-replenish demo credits if depleted so demo remains playable
      session.balance = 10000000;
    }
    st = 1;
    mi = 0;
    session.ssaw = 0;
    session.aw = 0;
    session.cwc = 0;
    session.pcwc = 0;
    session.freeSpin = null;
    session.parentSid = sid;
    const gen = generateInitialGrid(false);
    reels = gen.reels;
    goldPositions = gen.goldPositions;
  }

  const blb = session.balance;
  const isPaidSpin = st === 1;
  const blab = isPaidSpin ? round2(blb - betAmount) : blb;
  session.balance = blab;

  const multipliers = isFreeSpinMode ? FREE_SPIN_MULTIPLIERS : NORMAL_MULTIPLIERS;
  const wm = multipliers[Math.min(mi, multipliers.length - 1)];

  const evalRes = evaluateGrid(reels, goldPositions, cs, ml, wm);
  const ssb = goldSetToMap(goldPositions);

  let bl = blab;
  let ctw = 0;
  let tw = 0;
  let nst = isFreeSpinMode && session.freeSpin && session.freeSpin.remaining > 0 ? 21 : 1;
  let ss = ssb;

  if (evalRes.hasWin) {
    ctw = evalRes.totalWin;
    tw = evalRes.totalWin;
    session.ssaw = round2(session.ssaw + ctw);
    session.aw = round2(session.aw + ctw);
    session.cwc += 1;
    if (st === 1 || st === 4) session.pcwc += 1;
    if (session.freeSpin) {
      session.freeSpin.aw = round2(session.freeSpin.aw + ctw);
    }
    bl = round2(blab + ctw);
    session.balance = bl;

    // Prepare cascade state for the next request
    const cascade = applyCascade(
      reels,
      goldPositions,
      evalRes.ptbr,
      evalRes.transformedToWild,
      isFreeSpinMode
    );
    ss = goldSetToMap(cascade.nextGold);
    nst = isFreeSpinMode ? 22 : 4;
    session.pendingRespin = {
      nextReels: cascade.nextReels,
      nextGold: cascade.nextGold,
      respinInfo: cascade.respinInfo,
      isFreeSpinMode,
      mi: Math.min(mi + 1, 3)
    };
  } else if (evalRes.scatterCount >= 3) {
    const awarded = 12 + (evalRes.scatterCount - 3) * 2;
    if (!session.freeSpin) {
      session.freeSpin = {
        aw: 0,
        step: 0,
        total: awarded,
        remaining: awarded,
        nosa: awarded
      };
    } else {
      session.freeSpin.total += awarded;
      session.freeSpin.remaining += awarded;
      session.freeSpin.nosa = awarded;
    }
    nst = 21;
  } else if (isFreeSpinMode && session.freeSpin && session.freeSpin.remaining === 0) {
    nst = 1;
  }

  const fsObj = session.freeSpin
    ? {
        aw: session.freeSpin.aw,
        s: session.freeSpin.remaining,
        ts: session.freeSpin.total,
        nosa: session.freeSpin.nosa
      }
    : null;

  const tb = isPaidSpin ? betAmount : 0;
  const np = round2(ctw - tb);
  const gwt = getGameWinType(ctw, betAmount);

  const state = {
    wp: evalRes.wp,
    lw: evalRes.lw,
    snww: evalRes.snww,
    ssb,
    ss,
    fs: fsObj,
    rs: respinData,
    ssaw: session.ssaw,
    ptbr: evalRes.ptbr,
    sc: evalRes.scatterCount,
    mi,
    wm,
    orl: reels,
    rl: reels,
    gwt,
    fb: null,
    ctw,
    pmt: null,
    cwc: session.cwc,
    fstc: isFreeSpinMode ? { 21: session.freeSpin ? session.freeSpin.step : 1 } : null,
    pcwc: session.pcwc,
    rwsp: evalRes.rwsp,
    hashr: `0:${sid}#MV#${betAmount}#MT#${wm}#MG#${ctw}#`,
    ml,
    cs,
    sid,
    psid: session.parentSid,
    st,
    nst,
    pf: Number(params.pf) || 1,
    aw: session.aw,
    wid: 0,
    wt: 'C',
    wk: params.wk || '0_C',
    wbn: null,
    wfg: null,
    blb,
    blab,
    bl,
    tb,
    tbb: tb,
    tw,
    np,
    ocr: null,
    mr: null,
    ge: nst === 21 || nst === 22 ? [2, 11] : [1, 11]
  };

  session.lastState = state;
  if (nst === 1 && !session.pendingRespin) {
    session.freeSpin = null;
  }

  return { dt: { si: state }, err: null };
}

function parseBodyParams(req) {
  const out = {};
  if (req.query) {
    for (const [k, v] of Object.entries(req.query)) out[k] = v;
  }
  if (req.body && Buffer.isBuffer(req.body) && req.body.length > 0) {
    const raw = req.body.toString('utf8').trim();
    if (raw.startsWith('{')) {
      try {
        Object.assign(out, JSON.parse(raw));
      } catch {}
    } else {
      const sp = new URLSearchParams(raw);
      for (const [k, v] of sp.entries()) out[k] = v;
    }
  }
  return out;
}

function handleMockApi(req, res) {
  const apiPath = req.path;
  const params = parseBodyParams(req);
  const token = params.otk || params.atk || params.os || 'default';
  const session = getOrCreateSession(token);

  if (process.env.DEBUG_API === '1') {
    console.log(`[MockPG] ${req.method} ${apiPath}`, params);
  }

  // 1. Session verification endpoints
  if (apiPath.includes('/auth/session/') && (apiPath.includes('verifySession') || apiPath.includes('verifyOperatorPlayerSession'))) {
    return res.json({
      dt: {
        oj: { jid: 1 },
        pid: 'demo_mw2_01',
        pcd: 'DemoPlayer',
        tk: token,
        st: 1,
        geu: 'game-api/mahjong-ways2/',
        lau: 'game-api/lobby/',
        bau: 'web-api/game-proxy/',
        cc: 'IDR',
        cs: 'Rp',
        nkn: 'DemoPlayer',
        gm: [
          {
            gid: 74,
            msdt: 1577836800000,
            medt: 1577836800000,
            st: 1,
            amsg: '',
            rtp: { df: { min: 96.95, max: 96.95 } },
            mxe: 100000,
            mxehr: 50000000
          }
        ],
        uiogc: {
          bb: 1, grtp: 1, gec: 1, cbu: 0, cl: 0, bf: 0, mr: 0, phtr: 0,
          vc: 0, bfbsi: 1, bfbli: 2, il: 0, rp: 0, gc: 0, ign: 0, tsn: 0,
          we: 0, gsc: 0, bu: 0, pwr: 0, hd: 0, et: 0, np: 0, igv: 0, as: 0,
          asc: 0, std: 0, hnp: 0, ts: 0, smpo: 0, grt: 0, ivs: 1, ir: 0, hn: 1
        },
        ec: [],
        occ: { rurl: '', tcm: '', tsc: 0, ttp: 0, tlb: '', trb: '' },
        ioph: '8e45b61a14a44d7e',
        sdn: 'https://api.u45owu68o.com',
        eat: 0
      },
      err: null
    });
  }

  // 2. Game Name
  if (apiPath.includes('/GameName/')) {
    return res.json({
      dt: {
        '74': 'Mahjong Ways 2',
        General: { GameName: 'Mahjong Ways 2' }
      },
      err: null
    });
  }

  // 3. Resources
  if (apiPath.includes('/Resources/')) {
    return res.json({ dt: [], err: null });
  }

  // 4. GameRule
  if (apiPath.includes('/GameRule/')) {
    return res.json({
      dt: {
        rtp: { default: { min: 96.95, max: 96.95 } },
        ows: { j: 0, m: 0 },
        j: null
      },
      err: null
    });
  }

  // 5. GameWallet
  if (apiPath.includes('/GameWallet/')) {
    return res.json({
      dt: {
        cc: 'IDR',
        cb: session.balance,
        tb: session.balance,
        tc: 0,
        bb: 0,
        wl: [
          {
            id: 0,
            cc: 'IDR',
            cb: session.balance,
            tb: session.balance,
            wt: 'C'
          }
        ]
      },
      err: null
    });
  }

  // 6. Bet History / Summary
  if (apiPath.includes('/BetHistory/')) {
    return res.json({ dt: { bh: [] }, err: null });
  }
  if (apiPath.includes('/BetSummary/')) {
    return res.json({
      dt: {
        bs: { bc: 0, btba: 0, btwla: 0, lbid: 0 },
        lut: 0
      },
      err: null
    });
  }

  // 7. GameInfo/Get
  if (apiPath.includes('/GameInfo/Get')) {
    return res.json({
      dt: {
        fb: null,
        wt: { mw: 5, bw: 15, mgw: 35, smgw: 50 },
        maxwm: 100000,
        cs: [50, 200, 1000, 5000],
        ml: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        mxl: 20,
        bl: session.balance,
        inwe: false,
        iuwe: false,
        ls: {
          si: session.lastState
        },
        cc: 'IDR'
      },
      err: null
    });
  }

  // 8. Spin
  if (apiPath.includes('/Spin')) {
    return res.json(handleSpin(session, params));
  }

  // 9. Fallback for any remaining proxy/social/tournament/ping endpoints
  return res.json({ dt: {}, err: null });
}

module.exports = { handleMockApi, getOrCreateSession, handleSpin };
