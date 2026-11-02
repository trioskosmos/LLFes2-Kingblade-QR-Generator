/* qr.js — minimal QR Code encoder (byte mode, UTF-8), ISO/IEC 18004.
   No dependencies. Exposes qrEncode(text, ecLevel) -> {size, modules}.
   EC block tables are standards data (versions 1-40 x L/M/Q/H). */
(function (root) {
  'use strict';

  // [version-1][ecIndex] = [[blockCount, totalCodewords, dataCodewords], ...]
  // ecIndex: 0=L 1=M 2=Q 3=H
  var RS = [[[[1,26,19]],[[1,26,16]],[[1,26,13]],[[1,26,9]]],[[[1,44,34]],[[1,44,28]],[[1,44,22]],[[1,44,16]]],[[[1,70,55]],[[1,70,44]],[[2,35,17]],[[2,35,13]]],[[[1,100,80]],[[2,50,32]],[[2,50,24]],[[4,25,9]]],[[[1,134,108]],[[2,67,43]],[[2,33,15],[2,34,16]],[[2,33,11],[2,34,12]]],[[[2,86,68]],[[4,43,27]],[[4,43,19]],[[4,43,15]]],[[[2,98,78]],[[4,49,31]],[[2,32,14],[4,33,15]],[[4,39,13],[1,40,14]]],[[[2,121,97]],[[2,60,38],[2,61,39]],[[4,40,18],[2,41,19]],[[4,40,14],[2,41,15]]],[[[2,146,116]],[[3,58,36],[2,59,37]],[[4,36,16],[4,37,17]],[[4,36,12],[4,37,13]]],[[[2,86,68],[2,87,69]],[[4,69,43],[1,70,44]],[[6,43,19],[2,44,20]],[[6,43,15],[2,44,16]]],[[[4,101,81]],[[1,80,50],[4,81,51]],[[4,50,22],[4,51,23]],[[3,36,12],[8,37,13]]],[[[2,116,92],[2,117,93]],[[6,58,36],[2,59,37]],[[4,46,20],[6,47,21]],[[7,42,14],[4,43,15]]],[[[4,133,107]],[[8,59,37],[1,60,38]],[[8,44,20],[4,45,21]],[[12,33,11],[4,34,12]]],[[[3,145,115],[1,146,116]],[[4,64,40],[5,65,41]],[[11,36,16],[5,37,17]],[[11,36,12],[5,37,13]]],[[[5,109,87],[1,110,88]],[[5,65,41],[5,66,42]],[[5,54,24],[7,55,25]],[[11,36,12],[7,37,13]]],[[[5,122,98],[1,123,99]],[[7,73,45],[3,74,46]],[[15,43,19],[2,44,20]],[[3,45,15],[13,46,16]]],[[[1,135,107],[5,136,108]],[[10,74,46],[1,75,47]],[[1,50,22],[15,51,23]],[[2,42,14],[17,43,15]]],[[[5,150,120],[1,151,121]],[[9,69,43],[4,70,44]],[[17,50,22],[1,51,23]],[[2,42,14],[19,43,15]]],[[[3,141,113],[4,142,114]],[[3,70,44],[11,71,45]],[[17,47,21],[4,48,22]],[[9,39,13],[16,40,14]]],[[[3,135,107],[5,136,108]],[[3,67,41],[13,68,42]],[[15,54,24],[5,55,25]],[[15,43,15],[10,44,16]]],[[[4,144,116],[4,145,117]],[[17,68,42]],[[17,50,22],[6,51,23]],[[19,46,16],[6,47,17]]],[[[2,139,111],[7,140,112]],[[17,74,46]],[[7,54,24],[16,55,25]],[[34,37,13]]],[[[4,151,121],[5,152,122]],[[4,75,47],[14,76,48]],[[11,54,24],[14,55,25]],[[16,45,15],[14,46,16]]],[[[6,147,117],[4,148,118]],[[6,73,45],[14,74,46]],[[11,54,24],[16,55,25]],[[30,46,16],[2,47,17]]],[[[8,132,106],[4,133,107]],[[8,75,47],[13,76,48]],[[7,54,24],[22,55,25]],[[22,45,15],[13,46,16]]],[[[10,142,114],[2,143,115]],[[19,74,46],[4,75,47]],[[28,50,22],[6,51,23]],[[33,46,16],[4,47,17]]],[[[8,152,122],[4,153,123]],[[22,73,45],[3,74,46]],[[8,53,23],[26,54,24]],[[12,45,15],[28,46,16]]],[[[3,147,117],[10,148,118]],[[3,73,45],[23,74,46]],[[4,54,24],[31,55,25]],[[11,45,15],[31,46,16]]],[[[7,146,116],[7,147,117]],[[21,73,45],[7,74,46]],[[1,53,23],[37,54,24]],[[19,45,15],[26,46,16]]],[[[5,145,115],[10,146,116]],[[19,75,47],[10,76,48]],[[15,54,24],[25,55,25]],[[23,45,15],[25,46,16]]],[[[13,145,115],[3,146,116]],[[2,74,46],[29,75,47]],[[42,54,24],[1,55,25]],[[23,45,15],[28,46,16]]],[[[17,145,115]],[[10,74,46],[23,75,47]],[[10,54,24],[35,55,25]],[[19,45,15],[35,46,16]]],[[[17,145,115],[1,146,116]],[[14,74,46],[21,75,47]],[[29,54,24],[19,55,25]],[[11,45,15],[46,46,16]]],[[[13,145,115],[6,146,116]],[[14,74,46],[23,75,47]],[[44,54,24],[7,55,25]],[[59,46,16],[1,47,17]]],[[[12,151,121],[7,152,122]],[[12,75,47],[26,76,48]],[[39,54,24],[14,55,25]],[[22,45,15],[41,46,16]]],[[[6,151,121],[14,152,122]],[[6,75,47],[34,76,48]],[[46,54,24],[10,55,25]],[[2,45,15],[64,46,16]]],[[[17,152,122],[4,153,123]],[[29,74,46],[14,75,47]],[[49,54,24],[10,55,25]],[[24,45,15],[46,46,16]]],[[[4,152,122],[18,153,123]],[[13,74,46],[32,75,47]],[[48,54,24],[14,55,25]],[[42,45,15],[32,46,16]]],[[[20,147,117],[4,148,118]],[[40,75,47],[7,76,48]],[[43,54,24],[22,55,25]],[[10,45,15],[67,46,16]]],[[[19,148,118],[6,149,119]],[[18,75,47],[31,76,48]],[[34,54,24],[34,55,25]],[[20,45,15],[61,46,16]]]];

  var EC_INDEX = { L: 0, M: 1, Q: 2, H: 3 };
  var EC_FORMAT = { L: 1, M: 0, Q: 3, H: 2 };   // 2-bit indicator used in format info

  var G15 = 0x537, G15_MASK = 0x5412, G18 = 0x1F25;

  // ---- GF(256) ------------------------------------------------------------
  var EXP = new Uint8Array(512), LOG = new Uint8Array(256);
  (function () {
    var x = 1;
    for (var i = 0; i < 255; i++) {
      EXP[i] = x; LOG[x] = i;
      x <<= 1;
      if (x & 0x100) x ^= 0x11D;
    }
    for (var j = 255; j < 512; j++) EXP[j] = EXP[j - 255];
  })();

  function gfMul(a, b) { return (a === 0 || b === 0) ? 0 : EXP[LOG[a] + LOG[b]]; }

  function rsGenerator(deg) {
    var poly = [1];
    for (var i = 0; i < deg; i++) {
      var next = new Array(poly.length + 1).fill(0);
      for (var j = 0; j < poly.length; j++) {
        next[j] ^= poly[j];                  // * 1
        next[j + 1] ^= gfMul(poly[j], EXP[i]); // * a
      }
      poly = next;
    }
    return poly;
  }

  function rsEncode(data, ecCount) {
    var gen = rsGenerator(ecCount);
    var res = new Array(ecCount).fill(0);
    for (var i = 0; i < data.length; i++) {
      var factor = data[i] ^ res[0];
      res.shift(); res.push(0);
      if (factor !== 0) {
        for (var j = 0; j < ecCount; j++) res[j] ^= gfMul(gen[j + 1], factor);
      }
    }
    return res;
  }

  // ---- bit helpers --------------------------------------------------------
  function utf8Bytes(str) {
    var out = [], s = unescape(encodeURIComponent(str));
    for (var i = 0; i < s.length; i++) out.push(s.charCodeAt(i));
    return out;
  }

  function charCountBits(version) { return version < 10 ? 8 : 16; }

  function dataCodewords(version, ec) {
    var blocks = RS[version - 1][EC_INDEX[ec]], total = 0;
    for (var i = 0; i < blocks.length; i++) total += blocks[i][0] * blocks[i][2];
    return total;
  }

  function pickVersion(byteLen, ec) {
    for (var v = 1; v <= 40; v++) {
      var need = 4 + charCountBits(v) + byteLen * 8;
      if (need <= dataCodewords(v, ec) * 8) return v;
    }
    throw new Error('payload too large for a QR code (' + byteLen + ' bytes)');
  }

  // ---- BCH ----------------------------------------------------------------
  function bchDigit(n) { var d = 0; while (n !== 0) { d++; n >>>= 1; } return d; }

  function bchTypeInfo(data) {
    var d = data << 10;
    while (bchDigit(d) - bchDigit(G15) >= 0) d ^= (G15 << (bchDigit(d) - bchDigit(G15)));
    return ((data << 10) | d) ^ G15_MASK;
  }

  function bchTypeNumber(version) {
    var d = version << 12;
    while (bchDigit(d) - bchDigit(G18) >= 0) d ^= (G18 << (bchDigit(d) - bchDigit(G18)));
    return (version << 12) | d;
  }

  // ---- masks --------------------------------------------------------------
  function maskAt(pattern, i, j) {
    switch (pattern) {
      case 0: return (i + j) % 2 === 0;
      case 1: return i % 2 === 0;
      case 2: return j % 3 === 0;
      case 3: return (i + j) % 3 === 0;
      case 4: return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 === 0;
      case 5: return (i * j) % 2 + (i * j) % 3 === 0;
      case 6: return ((i * j) % 2 + (i * j) % 3) % 2 === 0;
      case 7: return ((i * j) % 3 + (i + j) % 2) % 2 === 0;
    }
    return false;
  }

  // ---- alignment patterns -------------------------------------------------
  var ALIGN = [
    [], [6, 18], [6, 22], [6, 26], [6, 30], [6, 34],
    [6, 22, 38], [6, 24, 42], [6, 26, 46], [6, 28, 50], [6, 30, 54],
    [6, 32, 58], [6, 34, 62], [6, 26, 46, 66], [6, 26, 48, 70], [6, 26, 50, 74],
    [6, 30, 54, 78], [6, 30, 56, 82], [6, 30, 58, 86], [6, 34, 62, 90], [6, 28, 50, 72, 94],
    [6, 26, 50, 74, 98], [6, 30, 54, 78, 102], [6, 28, 54, 80, 106], [6, 32, 58, 84, 110], [6, 30, 58, 86, 114],
    [6, 34, 62, 90, 118], [6, 26, 50, 74, 98, 122], [6, 30, 54, 78, 102, 126], [6, 26, 52, 78, 104, 130], [6, 30, 56, 82, 108, 134],
    [6, 34, 60, 86, 112, 138], [6, 30, 58, 86, 114, 142], [6, 34, 62, 90, 118, 146], [6, 30, 54, 78, 102, 126, 150], [6, 24, 50, 76, 102, 128, 154],
    [6, 28, 54, 80, 106, 132, 158], [6, 32, 58, 84, 110, 136, 162], [6, 26, 54, 82, 110, 138, 166], [6, 30, 58, 86, 114, 142, 170]
  ];

  // ---- codeword assembly --------------------------------------------------
  function buildCodewords(bytes, version, ec) {
    var total = dataCodewords(version, ec);
    var bits = [];
    function push(val, len) { for (var i = len - 1; i >= 0; i--) bits.push((val >>> i) & 1); }

    push(4, 4);                       // byte mode
    push(bytes.length, charCountBits(version));
    for (var i = 0; i < bytes.length; i++) push(bytes[i], 8);

    var cap = total * 8;
    var term = Math.min(4, cap - bits.length);
    for (var t = 0; t < term; t++) bits.push(0);
    while (bits.length % 8 !== 0) bits.push(0);

    var data = [];
    for (var b = 0; b < bits.length; b += 8) {
      var v = 0;
      for (var k = 0; k < 8; k++) v = (v << 1) | bits[b + k];
      data.push(v);
    }
    var pad = [0xEC, 0x11], pi = 0;
    while (data.length < total) data.push(pad[pi++ % 2]);

    // split into blocks, compute EC, interleave
    var spec = RS[version - 1][EC_INDEX[ec]];
    var blocks = [], offset = 0, maxData = 0, ecLen = 0;
    for (var s = 0; s < spec.length; s++) {
      for (var n = 0; n < spec[s][0]; n++) {
        var dLen = spec[s][2], eLen = spec[s][1] - spec[s][2];
        var chunk = data.slice(offset, offset + dLen);
        offset += dLen;
        blocks.push({ data: chunk, ec: rsEncode(chunk, eLen) });
        if (dLen > maxData) maxData = dLen;
        ecLen = eLen;
      }
    }
    var out = [];
    for (var c = 0; c < maxData; c++)
      for (var bi = 0; bi < blocks.length; bi++)
        if (c < blocks[bi].data.length) out.push(blocks[bi].data[c]);
    for (var e = 0; e < ecLen; e++)
      for (var bj = 0; bj < blocks.length; bj++) out.push(blocks[bj].ec[e]);
    return out;
  }

  // ---- matrix -------------------------------------------------------------
  function buildMatrix(codewords, version, ec, maskPattern) {
    var size = version * 4 + 17;
    var m = [], reserved = [];
    for (var r = 0; r < size; r++) {
      m.push(new Array(size).fill(false));
      reserved.push(new Array(size).fill(false));
    }
    function set(r, c, dark) { m[r][c] = dark; reserved[r][c] = true; }

    // finder patterns + separators
    function finder(row, col) {
      for (var dr = -1; dr <= 7; dr++) {
        for (var dc = -1; dc <= 7; dc++) {
          var rr = row + dr, cc = col + dc;
          if (rr < 0 || rr >= size || cc < 0 || cc >= size) continue;
          var inside = dr >= 0 && dr <= 6 && dc >= 0 && dc <= 6;
          var dark = inside && (dr === 0 || dr === 6 || dc === 0 || dc === 6 ||
            (dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4));
          set(rr, cc, dark);
        }
      }
    }
    finder(0, 0); finder(0, size - 7); finder(size - 7, 0);

    // timing patterns
    for (var i = 8; i < size - 8; i++) {
      if (!reserved[6][i]) set(6, i, i % 2 === 0);
      if (!reserved[i][6]) set(i, 6, i % 2 === 0);
    }

    // alignment patterns
    var pos = ALIGN[version - 1];
    for (var a = 0; a < pos.length; a++) {
      for (var b = 0; b < pos.length; b++) {
        var ar = pos[a], ac = pos[b];
        if ((ar <= 8 && ac <= 8) || (ar <= 8 && ac >= size - 9) || (ar >= size - 9 && ac <= 8)) continue;
        for (var dr2 = -2; dr2 <= 2; dr2++)
          for (var dc2 = -2; dc2 <= 2; dc2++)
            set(ar + dr2, ac + dc2, Math.max(Math.abs(dr2), Math.abs(dc2)) !== 1);
      }
    }

    // reserve format areas
    for (var f = 0; f < 9; f++) {
      if (!reserved[8][f]) set(8, f, false);
      if (!reserved[f][8]) set(f, 8, false);
    }
    for (var g = 0; g < 8; g++) {
      if (!reserved[8][size - 1 - g]) set(8, size - 1 - g, false);
      if (!reserved[size - 1 - g][8]) set(size - 1 - g, 8, false);
    }
    set(size - 8, 8, true);   // dark module

    // version info
    if (version >= 7) {
      var vbits = bchTypeNumber(version);
      for (var v1 = 0; v1 < 18; v1++) {
        var bit = ((vbits >> v1) & 1) === 1;
        set(Math.floor(v1 / 3), v1 % 3 + size - 11, bit);
        set(v1 % 3 + size - 11, Math.floor(v1 / 3), bit);
      }
    }

    // data placement
    var inc = -1, row = size - 1, bitIndex = 7, byteIndex = 0;
    for (var col = size - 1; col > 0; col -= 2) {
      if (col === 6) col--;
      while (true) {
        for (var cc2 = 0; cc2 < 2; cc2++) {
          var c2 = col - cc2;
          if (!reserved[row][c2]) {
            var dark = false;
            if (byteIndex < codewords.length)
              dark = ((codewords[byteIndex] >>> bitIndex) & 1) === 1;
            if (maskAt(maskPattern, row, c2)) dark = !dark;
            m[row][c2] = dark;
            bitIndex--;
            if (bitIndex === -1) { byteIndex++; bitIndex = 7; }
          }
        }
        row += inc;
        if (row < 0 || row >= size) { row -= inc; inc = -inc; break; }
      }
    }

    // format info
    var data = (EC_FORMAT[ec] << 3) | maskPattern;
    var fmt = bchTypeInfo(data);
    for (var i2 = 0; i2 < 15; i2++) {
      var bit2 = ((fmt >> i2) & 1) === 1;
      if (i2 < 6) m[i2][8] = bit2;
      else if (i2 < 8) m[i2 + 1][8] = bit2;
      else m[size - 15 + i2][8] = bit2;

      if (i2 < 8) m[8][size - i2 - 1] = bit2;
      else if (i2 < 9) m[8][15 - i2 - 1 + 1] = bit2;
      else m[8][15 - i2 - 1] = bit2;
    }
    m[size - 8][8] = true;

    return m;
  }

  function penalty(m) {
    var size = m.length, score = 0;

    // rule 1: runs of 5+
    for (var r = 0; r < size; r++) {
      var runC = 1, runR = 1;
      for (var c = 1; c < size; c++) {
        if (m[r][c] === m[r][c - 1]) { runC++; } else { if (runC >= 5) score += runC - 2; runC = 1; }
        if (m[c][r] === m[c - 1][r]) { runR++; } else { if (runR >= 5) score += runR - 2; runR = 1; }
      }
      if (runC >= 5) score += runC - 2;
      if (runR >= 5) score += runR - 2;
    }

    // rule 2: 2x2 blocks
    for (var r2 = 0; r2 < size - 1; r2++)
      for (var c2 = 0; c2 < size - 1; c2++) {
        var v = m[r2][c2];
        if (v === m[r2][c2 + 1] && v === m[r2 + 1][c2] && v === m[r2 + 1][c2 + 1]) score += 3;
      }

    // rule 3: finder-like 1:1:3:1:1 with 4 light modules
    var pat1 = [true, false, true, true, true, false, true, false, false, false, false];
    var pat2 = pat1.slice().reverse();
    function matches(arr, i, pat) {
      for (var k = 0; k < pat.length; k++) if (arr[i + k] !== pat[k]) return false;
      return true;
    }
    for (var r3 = 0; r3 < size; r3++) {
      var rowArr = m[r3], colArr = [];
      for (var q = 0; q < size; q++) colArr.push(m[q][r3]);
      for (var i3 = 0; i3 + 11 <= size; i3++) {
        if (matches(rowArr, i3, pat1) || matches(rowArr, i3, pat2)) score += 40;
        if (matches(colArr, i3, pat1) || matches(colArr, i3, pat2)) score += 40;
      }
    }

    // rule 4: dark ratio
    var dark = 0;
    for (var r4 = 0; r4 < size; r4++) for (var c4 = 0; c4 < size; c4++) if (m[r4][c4]) dark++;
    var pct = dark * 100 / (size * size);
    score += Math.floor(Math.abs(pct - 50) / 5) * 10;

    return score;
  }

  function qrEncode(text, ecLevel) {
    ecLevel = ecLevel || 'L';
    var bytes = utf8Bytes(text);
    var version = pickVersion(bytes.length, ecLevel);
    var codewords = buildCodewords(bytes, version, ecLevel);

    var best = null, bestScore = Infinity, bestMask = 0;
    for (var mask = 0; mask < 8; mask++) {
      var mat = buildMatrix(codewords, version, ecLevel, mask);
      var s = penalty(mat);
      if (s < bestScore) { bestScore = s; best = mat; bestMask = mask; }
    }
    return { size: version * 4 + 17, modules: best, version: version, mask: bestMask, ec: ecLevel };
  }

  function toSVG(res, opts) {
    opts = opts || {};
    var scale = opts.scale || 4, border = opts.border == null ? 4 : opts.border;
    var n = res.size, dim = (n + border * 2) * scale;
    var d = '';
    for (var r = 0; r < n; r++)
      for (var c = 0; c < n; c++)
        if (res.modules[r][c]) d += 'M' + ((c + border) * scale) + ' ' + ((r + border) * scale) + 'h' + scale + 'v' + scale + 'h-' + scale + 'z';
    return '<svg xmlns="http://www.w3.org/2000/svg" width="' + dim + '" height="' + dim +
      '" viewBox="0 0 ' + dim + ' ' + dim + '" shape-rendering="crispEdges">' +
      '<rect width="' + dim + '" height="' + dim + '" fill="#fff"/>' +
      '<path d="' + d + '" fill="#000"/></svg>';
  }

  var api = { qrEncode: qrEncode, toSVG: toSVG, _rs: RS };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.QRKit = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
