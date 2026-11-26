const protobuf = require("protobufjs");

// Setup protobufjs root and types for SlotCommonResponse and GameInfo
const root = new protobuf.Root();

const FreeSpinType = new protobuf.Type("MahjongWays2FreeSpin")
  .add(new protobuf.Field("aw", 1, "double"))
  .add(new protobuf.Field("s", 2, "int32"))
  .add(new protobuf.Field("ts", 3, "int32"))
  .add(new protobuf.Field("nosa", 4, "int32"));

const RespinType = new protobuf.Type("MahjongWays2Respin")
  .add(new protobuf.Field("sspt", 1, "int32", "repeated"))
  .add(new protobuf.Field("rns", 2, "int32", "repeated"))
  .add(new protobuf.Field("rnss", 3, "int32", "repeated"))
  .add(new protobuf.Field("bsb", 4, "int32", "repeated"));

const SlotCommonResponse = new protobuf.Type("SlotCommonResponse")
  .add(new protobuf.Field("sid", 1, "string"))
  .add(new protobuf.Field("psid", 2, "string"))
  .add(new protobuf.Field("st", 3, "int32"))
  .add(new protobuf.Field("nst", 4, "int32"))
  .add(new protobuf.Field("pf", 5, "int32"))
  .add(new protobuf.Field("aw", 6, "double"))
  .add(new protobuf.Field("wid", 7, "uint32"))
  .add(new protobuf.Field("wt", 8, "string"))
  .add(new protobuf.Field("wk", 9, "string"))
  .add(new protobuf.Field("blb", 12, "double"))
  .add(new protobuf.Field("blab", 13, "double"))
  .add(new protobuf.Field("bl", 14, "double"))
  .add(new protobuf.Field("ml", 51, "int32"))
  .add(new protobuf.Field("cs", 52, "double"))
  .add(new protobuf.Field("rl", 53, "int32", "repeated"))
  .add(new protobuf.Field("ctw", 54, "double"))
  .add(new protobuf.Field("cwc", 55, "int32"))
  .add(new protobuf.Field("fstc", 56, "int32", "repeated"))
  .add(new protobuf.Field("pcwc", 57, "int32"))
  .add(new protobuf.Field("rwsp", 58, "string"))
  .add(new protobuf.Field("hashr", 59, "string"))
  .add(new protobuf.Field("fb", 60, "int32"))
  .add(new protobuf.Field("gwt", 71, "int32"))
  .add(new protobuf.Field("wp", 101, "int32", "repeated"))
  .add(new protobuf.Field("lw", 102, "double", "repeated"))
  .add(new protobuf.Field("orl", 103, "int32", "repeated"))
  .add(new protobuf.Field("snww", 104, "int32", "repeated"))
  .add(new protobuf.Field("ssb", 105, "int32", "repeated"))
  .add(new protobuf.Field("ss", 106, "int32", "repeated"))
  .add(new protobuf.Field("fs", 107, "MahjongWays2FreeSpin"))
  .add(new protobuf.Field("rs", 108, "MahjongWays2Respin"))
  .add(new protobuf.Field("ssaw", 109, "double"))
  .add(new protobuf.Field("ptbr", 110, "int32", "repeated"))
  .add(new protobuf.Field("sc", 111, "int32"))
  .add(new protobuf.Field("mi", 112, "int32"))
  .add(new protobuf.Field("wm", 113, "int32"));

const StateInfoWrapper = new protobuf.Type("StateInfoWrapper")
  .add(new protobuf.Field("si", 1, "SlotCommonResponse"));

const DataWrapper = new protobuf.Type("DataWrapper")
  .add(new protobuf.Field("dt", 1, "StateInfoWrapper"));

const GameInfoResponse = new protobuf.Type("GameInfoResponse")
  .add(new protobuf.Field("bl", 1, "double"))
  .add(new protobuf.Field("inwe", 2, "bool"))
  .add(new protobuf.Field("iuwe", 3, "bool"))
  .add(new protobuf.Field("cc", 4, "string"))
  .add(new protobuf.Field("mxl", 5, "int32"))
  .add(new protobuf.Field("maxwm", 6, "int32"))
  .add(new protobuf.Field("ls", 7, "StateInfoWrapper"))
  .add(new protobuf.Field("cs", 51, "double", "repeated"))
  .add(new protobuf.Field("ml", 52, "int32", "repeated"));

const GameInfoWrapper = new protobuf.Type("GameInfoWrapper")
  .add(new protobuf.Field("gi", 1, "GameInfoResponse"));

const GameInfoDataWrapper = new protobuf.Type("GameInfoDataWrapper")
  .add(new protobuf.Field("dt", 1, "GameInfoWrapper"));

root.add(FreeSpinType);
root.add(RespinType);
root.add(SlotCommonResponse);
root.add(StateInfoWrapper);
root.add(DataWrapper);
root.add(GameInfoResponse);
root.add(GameInfoWrapper);
root.add(GameInfoDataWrapper);

// Xorshift128+ Cipher
class Xorshift128Plus {
  constructor(seed) {
    this.setSeed(seed);
  }
  setSeed(seed) {
    let s0 = BigInt(seed);
    let s1 = s0 ^ 0x9e3779b97f4a7c15n;
    this.s = [s0, s1];
  }
  next() {
    let s1 = this.s[0];
    let s0 = this.s[1];
    this.s[0] = s0;
    s1 ^= s1 << 23n;
    s1 ^= s1 >> 17n;
    s1 ^= s0;
    s1 ^= s0 >> 26n;
    this.s[1] = s1;
    return (s0 + s1) & 0xffffffffffffffffn;
  }
  nextInt(max) {
    let n = this.next();
    return Number(n % BigInt(max));
  }
  shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      let j = this.nextInt(i + 1);
      let temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
  }
  deshuffle(arr) {
    let n = arr.length;
    let indices = new Int32Array(n - 1);
    for (let i = n - 1; i > 0; --i) {
      indices[i - 1] = this.nextInt(i + 1);
    }
    for (let i = 1; i < n; ++i) {
      let j = indices[i - 1];
      let temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
  }
}

function n5(gameIndex) {
  let sum = 0;
  while (gameIndex > 0) {
    sum += gameIndex % 10;
    gameIndex = Math.floor(gameIndex / 10);
  }
  return sum;
}

function encryptPayload(buf, gameIndex = 74, b0S6 = 42) {
  let arr = Array.from(buf);
  let n5val = n5(gameIndex);
  let seed = b0S6 + n5val;
  let prng = new Xorshift128Plus(seed);
  prng.shuffle(arr);
  let pos = n5val % (arr.length + 1);
  arr.splice(pos, 0, b0S6);
  return Buffer.from(arr);
}

function decryptPayload(reqBuf, gameIndex = 74) {
  let arr = Array.from(reqBuf);
  let n5val = n5(gameIndex);
  let pos = n5val % (arr.length - 1);
  let b0S6 = arr[pos];
  arr.splice(pos, 1);
  let seed = b0S6 + n5val;
  let prng = new Xorshift128Plus(seed);
  prng.deshuffle(arr);
  return { buf: Buffer.from(arr), b0S6 };
}

// Mahjong Ways 2 Game Logic
const PAYOUT_DATA = {
  2: { 3: 10, 4: 25, 5: 50 },
  3: { 3: 8, 4: 20, 5: 40 },
  4: { 3: 6, 4: 15, 5: 30 },
  5: { 3: 5, 4: 10, 5: 15 },
  6: { 3: 3, 4: 5, 5: 12 },
  7: { 3: 3, 4: 5, 5: 12 },
  8: { 3: 2, 4: 4, 5: 10 },
  9: { 3: 1, 4: 3, 5: 6 },
  10: { 3: 1, 4: 3, 5: 6 }
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

function randomBaseSymbol(allowScatter, scatterChance = 0.06) {
  if (allowScatter && Math.random() < scatterChance) return 1;
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
  let totalWin = 0;
  const allWinPos = new Set();
  for (let sym = 2; sym <= 10; sym++) {
    const colMatches = [];
    for (let col = 0; col < 5; col++) {
      const matches = [];
      for (const pos of VISIBLE_ROWS_BY_COL[col]) {
        const s = reels[pos];
        if (s === sym || s === 0) matches.push(pos);
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
      totalWin = round2(totalWin + winAmt);
      for (const p of positions) allWinPos.add(p);
    }
  }

  let scatterCount = 0;
  for (const pos of ALL_VISIBLE_INDICES) {
    if (reels[pos] === 1) scatterCount++;
  }

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
    ptbr: ptbr.length > 0 ? ptbr : null,
    allWinPos,
    transformedToWild,
    scatterCount
  };
}

function applyCascade(reels, goldPositions, ptbrList, transformedToWild, isFreeSpin) {
  const nextReels = reels.slice();
  const nextGold = new Set(goldPositions);
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
    for (let i = colVisible.length - 1; i >= 0; i--) {
      const pos = colVisible[i];
      if (!removedSet.has(pos)) {
        survivors.push({ sym: nextReels[pos], isGold: nextGold.has(pos) });
      }
      nextGold.delete(pos);
    }
    const needed = colVisible.length - survivors.length;
    const newSymbols = [];
    for (let k = 0; k < needed; k++) {
      const sym = randomBaseSymbol(false);
      const isGold = sym >= 2 && sym <= 10 && col >= 1 && col <= 3 && ((isFreeSpin && col === 2) || Math.random() < 0.16);
      newSymbols.push(sym);
    }
    const topToBottom = [
      ...newSymbols.map((sym) => ({ sym, isGold: false })),
      ...survivors.reverse()
    ];
    for (let i = 0; i < colVisible.length; i++) {
      const pos = colVisible[i];
      nextReels[pos] = topToBottom[i].sym;
      if (topToBottom[i].isGold) nextGold.add(pos);
    }
    nextReels[col * 7] = randomBaseSymbol(false);
    nextReels[col * 7 + 6] = randomBaseSymbol(false);
    if (col === 0 || col === 4) nextReels[col * 7 + 5] = randomBaseSymbol(false);
  }

  return { nextReels, nextGold };
}

function getGameWinType(winAmt, betAmt) {
  if (winAmt <= 0) return -1;
  const ratio = betAmt > 0 ? winAmt / betAmt : 0;
  if (ratio >= 50) return 4;
  if (ratio >= 35) return 3;
  if (ratio >= 15) return 2;
  return 1;
}

function getOrCreateSession(token) {
  const key = token || 'default';
  if (!sessions.has(key)) {
    const { reels, goldPositions } = generateInitialGrid(false);
    const initialSid = String(Date.now()) + '000';
    const initialState = {
      sid: initialSid,
      psid: initialSid,
      st: 1,
      nst: 1,
      pf: 1,
      aw: 0,
      wid: 0,
      wt: 'C',
      wk: '0_C',
      blb: 10000000,
      blab: 10000000,
      bl: 10000000,
      ml: 1,
      cs: 200,
      rl: reels,
      orl: reels,
      ctw: 0,
      cwc: 0,
      pcwc: 0,
      mi: 0,
      wm: 1,
      gwt: -1,
      hashr: `0:${initialSid}#MV#0#MT#1#MG#0#`
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
  let isFreeSpinMode = false;

  if (session.pendingRespin) {
    reels = session.pendingRespin.nextReels;
    goldPositions = session.pendingRespin.nextGold;
    isFreeSpinMode = session.pendingRespin.isFreeSpinMode;
    st = isFreeSpinMode ? 22 : 4;
    mi = session.pendingRespin.mi;
    session.pendingRespin = null;
  } else if (session.freeSpin && session.freeSpin.remaining > 0) {
    isFreeSpinMode = true;
    st = 21;
    mi = 0;
    session.freeSpin.step += 1;
    session.freeSpin.remaining -= 1;
    session.parentSid = sid;
    const gen = generateInitialGrid(true);
    reels = gen.reels;
    goldPositions = gen.goldPositions;
  } else {
    if (session.balance < betAmount) session.balance = 10000000;
    st = 1;
    mi = 0;
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

  let bl = blab;
  let ctw = 0;
  let tw = 0;
  let nst = isFreeSpinMode && session.freeSpin && session.freeSpin.remaining > 0 ? 21 : 1;

  if (evalRes.hasWin) {
    ctw = evalRes.totalWin;
    tw = evalRes.totalWin;
    session.aw = round2(session.aw + ctw);
    session.cwc += 1;
    if (st === 1 || st === 4) session.pcwc += 1;
    if (session.freeSpin) {
      session.freeSpin.aw = round2(session.freeSpin.aw + ctw);
    }
    bl = round2(blab + ctw);
    session.balance = bl;

    const cascade = applyCascade(reels, goldPositions, evalRes.ptbr, evalRes.transformedToWild, isFreeSpinMode);
    nst = isFreeSpinMode ? 22 : 4;
    session.pendingRespin = {
      nextReels: cascade.nextReels,
      nextGold: cascade.nextGold,
      isFreeSpinMode,
      mi: Math.min(mi + 1, 3)
    };
  } else if (evalRes.scatterCount >= 3) {
    const awarded = 12 + (evalRes.scatterCount - 3) * 2;
    if (!session.freeSpin) {
      session.freeSpin = { aw: 0, step: 0, total: awarded, remaining: awarded, nosa: awarded };
    } else {
      session.freeSpin.total += awarded;
      session.freeSpin.remaining += awarded;
      session.freeSpin.nosa = awarded;
    }
    nst = 21;
  }

  const fsObj = session.freeSpin
    ? { aw: session.freeSpin.aw, s: session.freeSpin.remaining, ts: session.freeSpin.total, nosa: session.freeSpin.nosa }
    : undefined;

  const gwt = getGameWinType(ctw, betAmount);

  const state = {
    sid,
    psid: session.parentSid,
    st,
    nst,
    pf: 1,
    aw: session.aw,
    wid: 0,
    wt: 'C',
    wk: '0_C',
    blb,
    blab,
    bl,
    ml,
    cs,
    rl: reels,
    orl: reels,
    ctw,
    cwc: session.cwc,
    pcwc: session.pcwc,
    mi,
    wm,
    gwt,
    hashr: `0:${sid}#MV#${betAmount}#MT#${wm}#MG#${ctw}#`,
    fs: fsObj
  };

  session.lastState = state;
  if (nst === 1 && !session.pendingRespin) {
    session.freeSpin = null;
  }

  return state;
}

function parseBodyParams(req) {
  const out = {};
  if (req.query) {
    for (const [k, v] of Object.entries(req.query)) out[k] = v;
  }
  if (req.body && Buffer.isBuffer(req.body) && req.body.length > 0) {
    try {
      const raw = req.body.toString('utf8').trim();
      if (raw.startsWith('{')) {
        Object.assign(out, JSON.parse(raw));
      } else {
        const sp = new URLSearchParams(raw);
        for (const [k, v] of sp.entries()) out[k] = v;
      }
    } catch {}
  }
  return out;
}

function handleMockApi(req, res) {
  const apiPath = req.path;
  const isV4Binary = apiPath.includes('/v4/');
  let b0S6 = 42;
  let params = parseBodyParams(req);

  if (isV4Binary && req.body && Buffer.isBuffer(req.body) && req.body.length > 0) {
    try {
      const dec = decryptPayload(req.body, 74);
      b0S6 = dec.b0S6;
      // If request has protobuf body or query params, merge them
    } catch (e) {
      console.log("[MockPG] Binary decrypt error:", e);
    }
  }

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
        sdn: 'api',
        eat: 0
      },
      err: null
    });
  }

  // 2. Game Name
  if (apiPath.includes('/GameName/')) {
    return res.json({
      dt: { '74': 'Mahjong Ways 2', General: { GameName: 'Mahjong Ways 2' } },
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
      dt: { rtp: { default: { min: 96.95, max: 96.95 } }, ows: { j: 0, m: 0 }, j: null },
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
        wl: [{ id: 0, cc: 'IDR', cb: session.balance, tb: session.balance, wt: 'C' }]
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
      dt: { bs: { bc: 0, btba: 0, btwla: 0, lbid: 0 }, lut: 0 },
      err: null
    });
  }

  // Helper for binary responses
  const sendBinaryResponse = (dataObj) => {
    try {
      const msg = DataWrapper.create({ dt: { si: dataObj } });
      const encoded = DataWrapper.encode(msg).finish();
      const encrypted = encryptPayload(encoded, 74, b0S6);
      res.setHeader('Content-Type', 'application/octet-stream');
      return res.send(encrypted);
    } catch (err) {
      console.log("[MockPG] Protobuf encode error:", err);
      return res.status(500).json({ error: err.message });
    }
  };

  const sendGameInfoBinaryResponse = (session) => {
    try {
      const infoObj = {
        bl: session.balance,
        inwe: false,
        iuwe: false,
        cc: 'IDR',
        mxl: 20,
        maxwm: 100000,
        ls: { si: session.lastState },
        cs: [50, 200, 1000, 5000],
        ml: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      };
      const msg = GameInfoDataWrapper.create({ dt: { gi: infoObj } });
      const encoded = GameInfoDataWrapper.encode(msg).finish();
      const encrypted = encryptPayload(encoded, 74, b0S6);
      res.setHeader('Content-Type', 'application/octet-stream');
      return res.send(encrypted);
    } catch (err) {
      console.log("[MockPG] GameInfo binary encode error:", err);
      return res.status(500).json({ error: err.message });
    }
  };

  // 7. GameInfo/Get
  if (apiPath.includes('/GameInfo/Get') || apiPath.includes('/GameInfo/Update')) {
    if (isV4Binary) {
      return sendGameInfoBinaryResponse(session);
    }
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
        ls: { si: session.lastState },
        cc: 'IDR'
      },
      err: null
    });
  }

  // 8. Spin
  if (apiPath.includes('/Spin')) {
    const state = handleSpin(session, params);
    if (isV4Binary) {
      return sendBinaryResponse(state);
    }
    return res.json({ dt: { si: state }, err: null });
  }

  // 9. MarkRead
  if (apiPath.includes('/MarkRead')) {
    if (isV4Binary) {
      return sendBinaryResponse(session.lastState);
    }
    return res.json({ dt: {}, err: null });
  }

  // Fallback
  return res.json({ dt: {}, err: null });
}

module.exports = { handleMockApi, getOrCreateSession, handleSpin };
