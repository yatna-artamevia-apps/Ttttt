const protobuf = require("protobufjs");

// Setup protobufjs root and types matching bvframework & Mahjong Ways 2 runtime schemas
const root = new protobuf.Root();

const Int32Nullable = new protobuf.Type("Int32Nullable")
  .add(new protobuf.Field("__value", 1, "int32"));

const Int32List = new protobuf.Type("Int32List")
  .add(new protobuf.Field("__value", 1, "int32", "repeated"));

const WinThreshold = new protobuf.Type("WinThreshold")
  .add(new protobuf.Field("mw", 1, "double"))
  .add(new protobuf.Field("bw", 2, "double"))
  .add(new protobuf.Field("mgw", 3, "double"))
  .add(new protobuf.Field("smgw", 4, "double"));

const FeatureBuy = new protobuf.Type("FeatureBuy")
  .add(new protobuf.Field("is", 1, "bool"))
  .add(new protobuf.Field("bm", 2, "int32"))
  .add(new protobuf.Field("t", 3, "double"))
  .add(new protobuf.Field("bms", 4, "double", "repeated"));

const GameConfigurationSetting = new protobuf.Type("GameConfigurationSetting")
  .add(new protobuf.Field("is", 1, "bool"))
  .add(new protobuf.Field("bm", 2, "int32"))
  .add(new protobuf.Field("t", 3, "double"))
  .add(new protobuf.Field("bms", 4, "double", "repeated"));

const SlotGameInfoResponse = new protobuf.Type("SlotGameInfoResponse")
  .add(new protobuf.Field("bl", 1, "double"))
  .add(new protobuf.Field("inwe", 2, "bool"))
  .add(new protobuf.Field("iuwe", 3, "bool"))
  .add(new protobuf.Field("cc", 4, "string"))
  .add(new protobuf.Field("cs", 11, "double", "repeated"))
  .add(new protobuf.Field("ml", 12, "int32", "repeated"))
  .add(new protobuf.Field("mxl", 13, "int32"))
  .add(new protobuf.Field("fb", 21, "FeatureBuy"))
  .add(new protobuf.Field("wt", 22, "bytes"))
  .add(new protobuf.Field("maxwm", 23, "Int32Nullable"))
  .add(new protobuf.MapField("gcs", 24, "string", "GameConfigurationSetting"));

const CommonMarkRead = new protobuf.Type("CommonMarkRead")
  .add(new protobuf.Field("ts", 1, "int32"));

const FreeSpinType = new protobuf.Type("MahjongWays2FreeSpin")
  .add(new protobuf.Field("aw", 1, "double"))
  .add(new protobuf.Field("s", 2, "int32"))
  .add(new protobuf.Field("ts", 3, "int32"))
  .add(new protobuf.Field("nosa", 4, "int32"));

const RespinType = new protobuf.Type("MahjongWays2Respin")
  .add(new protobuf.MapField("sspt", 1, "int32", "bytes"))
  .add(new protobuf.Field("rns", 2, "Int32List", "repeated"))
  .add(new protobuf.Field("rnss", 3, "Int32List", "repeated"))
  .add(new protobuf.Field("bsb", 4, "int32", "repeated"));

const V4RootResponse = new protobuf.Type("V4RootResponse")
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
  .add(new protobuf.Field("tb", 15, "double"))
  .add(new protobuf.Field("tbb", 16, "double"))
  .add(new protobuf.Field("tw", 17, "double"))
  .add(new protobuf.Field("np", 18, "double"))
  .add(new protobuf.Field("ocr", 19, "string"))
  .add(new protobuf.Field("mr", 20, "CommonMarkRead"))
  .add(new protobuf.Field("ge", 21, "int32", "repeated"))
  .add(new protobuf.Field("ml", 51, "int32"))
  .add(new protobuf.Field("cs", 52, "double"))
  .add(new protobuf.Field("rl", 53, "int32", "repeated"))
  .add(new protobuf.Field("ctw", 54, "double"))
  .add(new protobuf.Field("cwc", 55, "int32"))
  .add(new protobuf.MapField("fstc", 56, "int32", "int32"))
  .add(new protobuf.Field("pcwc", 57, "int32"))
  .add(new protobuf.Field("rwsp", 58, "string"))
  .add(new protobuf.Field("hashr", 59, "string"))
  .add(new protobuf.Field("fb", 60, "Int32Nullable"))
  .add(new protobuf.Field("gwt", 71, "int32"))
  .add(new protobuf.Field("pmt", 72, "bytes"))
  .add(new protobuf.MapField("wp", 101, "int32", "Int32List"))
  .add(new protobuf.MapField("lw", 102, "int32", "double"))
  .add(new protobuf.Field("orl", 103, "int32", "repeated"))
  .add(new protobuf.MapField("snww", 104, "int32", "int32"))
  .add(new protobuf.MapField("ssb", 105, "int32", "int32"))
  .add(new protobuf.MapField("ss", 106, "int32", "int32"))
  .add(new protobuf.Field("fs", 107, "MahjongWays2FreeSpin"))
  .add(new protobuf.Field("rs", 108, "MahjongWays2Respin"))
  .add(new protobuf.Field("ssaw", 109, "double"))
  .add(new protobuf.Field("ptbr", 110, "int32", "repeated"))
  .add(new protobuf.Field("sc", 111, "int32"))
  .add(new protobuf.Field("mi", 112, "int32"))
  .add(new protobuf.Field("wm", 113, "int32"))
  .add(new protobuf.Field("ci", 900, "bytes"));

const V4GameInfoRequest = new protobuf.Type("V4GameInfoRequest")
  .add(new protobuf.Field("atk", 1, "string"))
  .add(new protobuf.Field("btt", 2, "int32"))
  .add(new protobuf.Field("pf", 3, "uint32"))
  .add(new protobuf.Field("eatk", 4, "string"))
  .add(new protobuf.Field("wid", 11, "uint32"))
  .add(new protobuf.Field("wk", 12, "string"))
  .add(new protobuf.Field("ocr", 13, "string"))
  .add(new protobuf.Field("cs", 21, "double"))
  .add(new protobuf.Field("ml", 22, "int32"));

const V4SpinRequest = new protobuf.Type("V4SpinRequest")
  .add(new protobuf.Field("atk", 1, "string"))
  .add(new protobuf.Field("btt", 2, "int32"))
  .add(new protobuf.Field("pf", 3, "uint32"))
  .add(new protobuf.Field("id", 5, "string"))
  .add(new protobuf.Field("wk", 12, "string"))
  .add(new protobuf.Field("cs", 21, "double"))
  .add(new protobuf.Field("ml", 22, "int32"))
  .add(new protobuf.Field("fb", 24, "int32"))
  .add(new protobuf.Field("ab", 31, "int32"));

const V4MarkReadRequest = new protobuf.Type("V4MarkReadRequest")
  .add(new protobuf.Field("atk", 1, "string"))
  .add(new protobuf.Field("btt", 2, "int32"))
  .add(new protobuf.Field("pf", 3, "uint32"))
  .add(new protobuf.Field("ts", 11, "int32"))
  .add(new protobuf.Field("wk", 12, "string"))
  .add(new protobuf.Field("id", 21, "string"));

root.add(Int32Nullable);
root.add(Int32List);
root.add(WinThreshold);
root.add(FeatureBuy);
root.add(GameConfigurationSetting);
root.add(SlotGameInfoResponse);
root.add(CommonMarkRead);
root.add(FreeSpinType);
root.add(RespinType);
root.add(V4RootResponse);
root.add(V4GameInfoRequest);
root.add(V4SpinRequest);
root.add(V4MarkReadRequest);
root.resolveAll();

// Xorshift128+ Cipher (exact match to bvframework client implementation)
class Xorshift128Plus {
  constructor(seed) {
    this.setSeed(seed);
  }
  setSeed(seed) {
    let s0 = BigInt(seed);
    this.s = [s0, s0 + 1n];
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
    return s0 + s1;
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
    if (n <= 1) return;
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
  if (arr.length === 0) return Buffer.from([b0S6]);
  let n5val = n5(gameIndex);
  let seed = b0S6 + n5val;
  let prng = new Xorshift128Plus(seed);
  prng.shuffle(arr);
  let pos = n5val % arr.length;
  arr.splice(pos, 0, b0S6);
  return Buffer.from(arr);
}

function decryptPayload(reqBuf, gameIndex = 74) {
  let arr = Array.from(reqBuf);
  if (arr.length <= 1) {
    return { buf: Buffer.alloc(0), b0S6: arr[0] !== undefined ? arr[0] : 42 };
  }
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
  const wp = {};
  const lw = {};
  const snww = {};
  const rwspObj = {};

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
      wp[String(sym)] = positions;
      lw[String(sym)] = winAmt;
      snww[String(sym)] = ways;
      rwspObj[String(sym)] = round2(basePay * cs * ml * ways);
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
    wp: Object.keys(wp).length > 0 ? wp : null,
    lw: Object.keys(lw).length > 0 ? lw : null,
    snww: Object.keys(snww).length > 0 ? snww : null,
    rwsp: Object.keys(rwspObj).length > 0 ? JSON.stringify(rwspObj) : undefined,
    ptbr: ptbr.length > 0 ? ptbr : [],
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
  const rns = [];
  const rnss = [];

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
    const newItems = [];
    const colRns = [];
    const colRnss = [];
    for (let k = 0; k < needed; k++) {
      const sym = randomBaseSymbol(false);
      const isGold = sym >= 2 && sym <= 10 && col >= 1 && col <= 3 && ((isFreeSpin && col === 2) || Math.random() < 0.16);
      newItems.push({ sym, isGold });
      colRns.push(sym);
      if (isGold) colRnss.push(k);
    }
    rns.push(colRns);
    rnss.push(colRnss);

    const topToBottom = [
      ...newItems,
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

  return { nextReels, nextGold, rns, rnss };
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
    const ssbMap = goldSetToMap(goldPositions);
    const initialSid = String(Date.now()) + '000';
    const initialState = {
      sid: initialSid,
      psid: initialSid,
      st: 1,
      nst: 1,
      pf: 5,
      aw: 0,
      wid: 0,
      wt: 'C',
      wk: '0_C',
      blb: 10000000,
      blab: 10000000,
      bl: 10000000,
      tb: 0,
      tbb: 0,
      tw: 0,
      np: 0,
      ge: [1, 11],
      ml: 1,
      cs: 200,
      rl: reels,
      orl: reels,
      ctw: 0,
      cwc: 0,
      fstc: {},
      pcwc: 0,
      ssb: ssbMap,
      ss: ssbMap,
      ssaw: 0,
      sc: 0,
      mi: 0,
      wm: 1,
      gwt: -1,
      fb: 0,
      hashr: `0:${initialSid}#MV#0#MT#1#MG#0#`
    };

    sessions.set(key, {
      balance: 10000000,
      cs: 200,
      ml: 1,
      pf: 5,
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
  const pf = Number(params.pf) > 0 ? Number(params.pf) : (session.pf || 5);
  session.cs = cs;
  session.ml = ml;
  session.pf = pf;

  const betAmount = round2(cs * ml * 20);
  const sid = nextSid(session);

  let reels;
  let goldPositions;
  let st = 1;
  let mi = 0;
  let isFreeSpinMode = false;
  let rsObj;

  if (session.pendingRespin) {
    reels = session.pendingRespin.nextReels;
    goldPositions = session.pendingRespin.nextGold;
    isFreeSpinMode = session.pendingRespin.isFreeSpinMode;
    st = isFreeSpinMode ? 22 : 4;
    mi = session.pendingRespin.mi;
    rsObj = {
      sspt: {},
      rns: session.pendingRespin.rns,
      rnss: session.pendingRespin.rnss,
      bsb: []
    };
    session.pendingRespin = null;
  } else if (session.freeSpin && session.freeSpin.remaining > 0) {
    isFreeSpinMode = true;
    st = 21;
    mi = 0;
    session.freeSpin.step += 1;
    session.freeSpin.remaining -= 1;
    session.freeSpin.nosa = 0;
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
  const ssbMap = goldSetToMap(goldPositions);

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
      rns: cascade.rns,
      rnss: cascade.rnss,
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

  const tb = isPaidSpin ? betAmount : 0;
  const np = round2(tw - tb);
  const gwt = getGameWinType(ctw, betAmount);

  const ge = [];
  if (isFreeSpinMode) {
    ge.push(2, 11);
  } else {
    ge.push(1, 11);
  }
  if (session.freeSpin && nst === 21 && evalRes.scatterCount >= 3) {
    ge.push(3);
  }

  const state = {
    sid,
    psid: session.parentSid,
    st,
    nst,
    pf,
    aw: session.aw,
    wid: 0,
    wt: 'C',
    wk: params.wk || '0_C',
    blb,
    blab,
    bl,
    tb,
    tbb: tb,
    tw,
    np,
    ge,
    ml,
    cs,
    rl: reels,
    orl: reels,
    ctw,
    cwc: session.cwc,
    fstc: st === 4 ? { "4": session.cwc } : {},
    pcwc: session.pcwc,
    rwsp: evalRes.rwsp,
    wp: evalRes.wp || undefined,
    lw: evalRes.lw || undefined,
    snww: evalRes.snww || undefined,
    ssb: ssbMap,
    ss: ssbMap,
    ptbr: evalRes.ptbr.length > 0 ? evalRes.ptbr : undefined,
    ssaw: session.aw,
    sc: evalRes.scatterCount,
    mi,
    wm,
    gwt,
    fb: Number(params.fb) || 0,
    hashr: `0:${sid}#MV#${betAmount}#MT#${wm}#MG#${ctw}#`,
    fs: fsObj,
    rs: rsObj
  };

  session.lastState = state;
  if (nst === 1 && !session.pendingRespin) {
    session.freeSpin = null;
  }

  return state;
}

function toV4StateFields(state, includeMarkRead = true) {
  const payload = {
    sid: state.sid,
    psid: state.psid,
    st: state.st,
    nst: state.nst,
    pf: state.pf || 5,
    aw: state.aw,
    wid: state.wid || 0,
    wt: state.wt || 'C',
    wk: state.wk || '0_C',
    blb: state.blb,
    blab: state.blab,
    bl: state.bl,
    tb: state.tb || 0,
    tbb: state.tbb || 0,
    tw: state.tw || 0,
    np: state.np || 0,
    ocr: state.ocr || '',
    ge: state.ge || [1, 11],
    ml: state.ml,
    cs: state.cs,
    rl: state.rl,
    orl: state.orl,
    ctw: state.ctw,
    cwc: state.cwc,
    fstc: state.fstc || {},
    pcwc: state.pcwc,
    hashr: state.hashr,
    gwt: state.gwt,
    ssb: state.ssb || {},
    ss: state.ss || {},
    ssaw: state.ssaw || 0,
    sc: state.sc || 0,
    mi: state.mi || 0,
    wm: state.wm || 1
  };

  if (includeMarkRead) {
    payload.mr = { ts: 1 };
  }
  if (state.fb) {
    payload.fb = { __value: state.fb };
  }
  if (state.rwsp) {
    payload.rwsp = state.rwsp;
  }
  if (state.wp) {
    const wpEncoded = {};
    for (const [k, arr] of Object.entries(state.wp)) {
      wpEncoded[k] = { __value: arr };
    }
    payload.wp = wpEncoded;
  }
  if (state.lw) {
    payload.lw = state.lw;
  }
  if (state.snww) {
    payload.snww = state.snww;
  }
  if (state.ptbr && state.ptbr.length > 0) {
    payload.ptbr = state.ptbr;
  }
  if (state.fs) {
    payload.fs = state.fs;
  }
  if (state.rs) {
    payload.rs = {
      sspt: state.rs.sspt || {},
      rns: (state.rs.rns || []).map((col) => ({ __value: col })),
      rnss: (state.rs.rnss || []).map((col) => ({ __value: col })),
      bsb: state.rs.bsb || []
    };
  }
  return payload;
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
      } else if (!req.path.includes('/v4/') && raw.includes('=')) {
        const sp = new URLSearchParams(raw);
        for (const [k, v] of sp.entries()) out[k] = v;
      }
    } catch {}
  }
  return out;
}

function decodeV4Request(apiPath, buf, outParams) {
  if (!buf || buf.length === 0) return;
  let ReqType = V4GameInfoRequest;
  if (apiPath.includes('/Spin')) ReqType = V4SpinRequest;
  else if (apiPath.includes('/MarkRead')) ReqType = V4MarkReadRequest;

  const decoded = ReqType.decode(buf);
  const obj = ReqType.toObject(decoded, { defaults: false });
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined && v !== null) outParams[k] = v;
  }
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
      decodeV4Request(apiPath, dec.buf, params);
    } catch (e) {
      console.log("[MockPG] Binary decrypt/decode error:", e.message);
    }
  }

  const token = params.otk || params.atk || params.os || 'default';
  const session = getOrCreateSession(token);
  if (params.pf) session.pf = Number(params.pf) || session.pf;

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

  // Helper for binary responses (root protobuf directly, no DataWrapper)
  const sendV4RootResponse = (rootPayload) => {
    try {
      const msg = V4RootResponse.create(rootPayload);
      const encoded = V4RootResponse.encode(msg).finish();
      const encrypted = encryptPayload(encoded, 74, b0S6);
      res.setHeader('Content-Type', 'application/octet-stream');
      return res.send(encrypted);
    } catch (err) {
      console.log("[MockPG] Protobuf encode error:", err);
      return res.status(500).json({ error: err.message });
    }
  };

  // 7. GameInfo/Get & GameInfo/Update
  if (apiPath.includes('/GameInfo/Get') || apiPath.includes('/GameInfo/Update')) {
    if (Number(params.cs) > 0) {
      session.cs = Number(params.cs);
      session.lastState.cs = session.cs;
    }
    if (Number(params.ml) > 0) {
      session.ml = Number(params.ml);
      session.lastState.ml = session.ml;
    }
    if (isV4Binary) {
      const wtBytes = WinThreshold.encode(
        WinThreshold.create({ mw: 5, bw: 15, mgw: 35, smgw: 50 })
      ).finish();
      const ciBytes = SlotGameInfoResponse.encode(
        SlotGameInfoResponse.create({
          bl: session.balance,
          inwe: false,
          iuwe: false,
          cc: 'IDR',
          cs: [50, 200, 1000, 5000],
          ml: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
          mxl: 20,
          wt: wtBytes,
          maxwm: { __value: 100000 }
        })
      ).finish();

      const rootPayload = toV4StateFields(session.lastState, false);
      rootPayload.ci = ciBytes;
      return sendV4RootResponse(rootPayload);
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
      return sendV4RootResponse(toV4StateFields(state, true));
    }
    return res.json({ dt: { si: state }, err: null });
  }

  // 9. MarkRead
  if (apiPath.includes('/MarkRead')) {
    if (isV4Binary) {
      return sendV4RootResponse(toV4StateFields(session.lastState, true));
    }
    return res.json({ dt: {}, err: null });
  }

  // Fallback
  return res.json({ dt: {}, err: null });
}

module.exports = { handleMockApi, getOrCreateSession, handleSpin };

