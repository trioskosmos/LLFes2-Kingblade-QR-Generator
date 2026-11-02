/* app.js — King Blade KBX5 QR builder (multi-group) */
(function () {
  'use strict';

  var DATA = window.KB_DATA;
  var first = DATA.groups[0];
  var state = {
    gids: [first.id],   // groups currently shown, in click order
    sel: [],            // ordered member objects
    label: first.label,
    labelDirty: false   // once the user types, stop auto-naming
  };

  // King Blade colour capacity. X10 V and one1R hold 15 colours per BLADE
  // (the blog's codes top out at 14); some models are reported to hold more.
  var LIMIT = 15, LIMIT_MAX = 30;

  var $ = function (id) { return document.getElementById(id); };
  var qrEl = $('qr'), payloadEl = $('payload'), statusEl = $('status'), qrMetaEl = $('qrMeta');

  function byId(id) {
    return DATA.groups.filter(function (g) { return g.id === id; })[0];
  }
  function activeGroups() {
    return state.gids.map(byId);
  }
  function allMembers() {
    var out = [];
    activeGroups().forEach(function (g) { out = out.concat(g.members); });
    return out;
  }

  function autoLabel() {
    var gs = activeGroups();
    if (gs.length === 1) return gs[0].label;
    return gs.map(function (g) { return g.short || g.name; }).join(' + ').slice(0, 40);
  }

  function payload() {
    var lines = ['Copyright RUIFAN:KBX5', state.label || autoLabel()];
    state.sel.forEach(function (m) {
      lines.push(m.hex.replace('#', '').toLowerCase() + '0000');
    });
    return lines.join('\n');
  }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  // ---------------------------------------------------------------- rows
  function makeRow(m) {
    var pos = state.sel.indexOf(m);
    var li = document.createElement('li');
    li.className = 'row' + (pos >= 0 ? ' on' : '');

    li.innerHTML =
      '<span class="idx">' + (pos >= 0 ? (pos + 1) : '') + '</span>' +
      '<span class="sw" style="background:' + m.hex + '"></span>' +
      '<span class="nm"><b>' + esc(m.name) +
        (m.fes ? '<span class="fes">15th</span>' : '') + '</b>' +
        '<em>' + esc(m.colorName) + '</em></span>' +
      '<span class="hx">' + m.hex + '</span>';

    if (pos >= 0) {
      var mv = document.createElement('span');
      mv.className = 'mv';
      mv.innerHTML = '<button type="button" data-d="-1" aria-label="move up">▲</button>' +
                     '<button type="button" data-d="1" aria-label="move down">▼</button>';
      mv.addEventListener('click', function (e) {
        e.stopPropagation();
        var d = +e.target.getAttribute('data-d');
        if (!d) return;
        var to = pos + d;
        if (to < 0 || to >= state.sel.length) return;
        state.sel.splice(to, 0, state.sel.splice(pos, 1)[0]);
        render();
      });
      li.appendChild(mv);
    }

    li.onclick = function () {
      var i = state.sel.indexOf(m);
      if (i >= 0) state.sel.splice(i, 1); else state.sel.push(m);
      render();
    };
    return li;
  }

  function renderMembers() {
    var ul = $('members');
    ul.innerHTML = '';
    activeGroups().forEach(function (g) {
      var head = document.createElement('li');
      head.className = 'ghead';
      head.innerHTML = '<b>' + esc(g.name) + '</b><span>' +
        g.members.length + ' members</span>';
      ul.appendChild(head);
      g.members.forEach(function (m) { ul.appendChild(makeRow(m)); });
    });
  }

  // ---------------------------------------------------------------- preview
  function renderCapacity() {
    var n = state.sel.length;
    var cap = $('capacity'), warn = $('limit');
    cap.textContent = '15 colours per BLADE on X10 V ・ one1R';
    if (n > LIMIT_MAX) {
      warn.hidden = false;
      warn.className = 'limit hard';
      warn.innerHTML = '<b>' + n + ' colours — far past the 15-colour limit.</b> ' +
        'X10 V and one1R store 15 per BLADE. Some models are reported to hold more, ' +
        'but check yours before relying on this code.';
    } else if (n > LIMIT) {
      warn.hidden = false;
      warn.className = 'limit';
      warn.innerHTML = '<b>' + n + ' colours — over the 15-colour limit.</b> ' +
        'Trim to 15 unless your penlight stores more.';
    } else {
      warn.hidden = true;
      warn.textContent = '';
    }
  }

  function renderPreview() {
    var text = payload(), meta = '';
    try {
      var res = window.QRKit.qrEncode(text, 'L');
      qrEl.innerHTML = window.QRKit.toSVG(res, { scale: 6, border: 3 });
      meta = 'v' + res.version + ' ・ ' + res.size + '×' + res.size + ' ・ ' + state.sel.length + ' colours';
      statusEl.textContent = '';
      statusEl.className = 'status';
      $('dlPng').disabled = $('dlSvg').disabled = false;
    } catch (err) {
      qrEl.innerHTML = '';
      meta = 'too large';
      statusEl.textContent = 'Too many colours for one QR — remove a few.';
      statusEl.className = 'status err';
      $('dlPng').disabled = $('dlSvg').disabled = true;
    }
    payloadEl.textContent = text;
    qrMetaEl.textContent = meta;
    renderCapacity();
  }

  function renderGroups() {
    var box = $('groups');
    box.innerHTML = '';
    DATA.groups.forEach(function (g) {
      var on = state.gids.indexOf(g.id) >= 0;
      var b = document.createElement('button');
      b.className = 'pill';
      b.type = 'button';
      b.textContent = g.short || g.name;
      b.title = (on ? 'Remove ' : 'Add ') + g.name + ' ・ ' + g.members.length + ' members';
      b.setAttribute('aria-pressed', String(on));
      b.onclick = function () {
        var i = state.gids.indexOf(g.id);
        if (i >= 0) {
          if (state.gids.length === 1) return;      // keep at least one group
          state.gids.splice(i, 1);
          state.sel = state.sel.filter(function (m) {
            return g.members.indexOf(m) < 0;
          });
        } else {
          state.gids.push(g.id);
          // keep the "15th Fes only" default when a group is added
          g.members.forEach(function (m) {
            if (m.fes && state.sel.indexOf(m) < 0) state.sel.push(m);
          });
        }
        if (!state.labelDirty) {
          state.label = autoLabel();
          $('labelInput').value = state.label;
        }
        render();
      };
      box.appendChild(b);
    });
    $('grpCount').textContent = state.gids.length + (state.gids.length === 1 ? ' group' : ' groups') +
      ' ・ ' + allMembers().length + ' members';
  }

  function render() {
    renderGroups();
    renderMembers();
    renderPreview();
    $('selCount').textContent = state.sel.length + ' selected';
  }

  // ---------------------------------------------------------------- controls
  $('pFull').onclick = function () { state.sel = allMembers(); render(); };
  $('pFes').onclick = function () {
    state.sel = allMembers().filter(function (m) { return m.fes; });
    render();
  };
  $('pClear').onclick = function () { state.sel = []; render(); };

  $('labelInput').addEventListener('input', function () {
    state.label = this.value;
    state.labelDirty = this.value.trim() !== '';
    renderPreview();
  });

  // ---------------------------------------------------------------- output
  function download(blob, name) {
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
  }

  function safeName() {
    var n = (state.label || autoLabel()).replace(/[\\/:*?"<>|\s]+/g, '_');
    return 'KBX5_' + n + '.png';
  }

  function drawCanvas(scale) {
    var res = window.QRKit.qrEncode(payload(), 'L');
    var border = 4, n = res.size, dim = (n + border * 2) * scale;
    var cv = document.createElement('canvas');
    cv.width = cv.height = dim;
    var ctx = cv.getContext('2d');
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, dim, dim);
    ctx.fillStyle = '#000';
    for (var r = 0; r < n; r++)
      for (var c = 0; c < n; c++)
        if (res.modules[r][c]) ctx.fillRect((c + border) * scale, (r + border) * scale, scale, scale);
    return cv;
  }

  $('dlPng').onclick = function () {
    drawCanvas(12).toBlob(function (b) { download(b, safeName()); });
  };

  $('dlSvg').onclick = function () {
    var res = window.QRKit.qrEncode(payload(), 'L');
    var svg = window.QRKit.toSVG(res, { scale: 12, border: 4 });
    download(new Blob([svg], { type: 'image/svg+xml' }), safeName().replace(/\.png$/, '.svg'));
  };

  $('copyBtn').onclick = function () {
    var text = payload();
    function done() {
      statusEl.textContent = 'Payload copied.';
      statusEl.className = 'status ok';
      setTimeout(function () { statusEl.textContent = ''; }, 1800);
    }
    function fallback() {
      var ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); done(); } catch (e) {}
      ta.remove();
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, fallback);
    } else { fallback(); }
  };

  // ---------------------------------------------------------------- boot
  state.sel = first.members.filter(function (m) { return m.fes; });
  $('labelInput').value = state.label;
  render();
})();
