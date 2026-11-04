/* Klipper Öğren — uygulama mantığı (tek dosya, kütüphanesiz) */
(function () {
  'use strict';

  // ---------- Durum (önce yüklenir; dil seçimi buna bağlı) ----------
  var KEY = 'klipper-ogren-v1';
  var NATIVE = !!(window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.native);
  function fresh() {
    return { v: 2, lang: 'tr', xp: 0, streak: 0, best: 0, lastDay: null, daily: { day: null, xp: 0 }, goal: 50, done: {}, srs: {},
      stats: { answered: 0, correct: 0, lessons: 0, reviews: 0, reviewQs: 0, typed: 0, perfect: 0 },
      news: { seen: null, cache: null }, spools: 0, freezes: 0, quests: null, badges: {}, sound: true, chests: {}, bestCombo: 0, savedAt: 0 };
  }
  function parse(raw) { try { return raw ? JSON.parse(raw) : null; } catch (e) { return null; } }
  function load() {
    var a = null, b = null;
    try { if (typeof window.__NATIVE_STATE__ === 'string') a = parse(window.__NATIVE_STATE__); } catch (e) {}
    try { b = parse(localStorage.getItem(KEY)); } catch (e) {}
    var p = (a && b) ? ((a.savedAt || 0) >= (b.savedAt || 0) ? a : b) : (a || b);
    var s = fresh();
    if (p) { for (var k in p) if (k !== 'stats') s[k] = p[k]; if (p.stats) for (var j in p.stats) s.stats[j] = p.stats[j]; }
    return s;
  }
  var S = load();
  var LANG = S.lang === 'en' ? 'en' : 'tr';
  var I18N = window.I18N_EN || {};
  function pct(n) { return LANG === 'en' ? n + '%' : '%' + n; }
  function T(s) { return LANG === 'en' && I18N[s] != null ? I18N[s] : s; }
  try { document.documentElement.lang = LANG; document.title = LANG === 'en' ? 'Klipper Learn' : 'Klipper Öğren'; } catch (e) {}

  // ---------- Veri ----------
  var UNITS = (LANG === 'en' && window.KLIPPER_UNITS_EN) ? window.KLIPPER_UNITS_EN : (window.KLIPPER_UNITS || []);
  var REF = window.KLIPPER_REF || [];
  if (LANG === 'en' && window.KLIPPER_REF_EN) {
    var RE = window.KLIPPER_REF_EN;
    REF = REF.map(function (r) {
      return { c: r.c, l: r.l, d: RE.d[r.c] || r.d, k: RE.cats[r.k] || r.k,
        s: r.s.replace(/<ad>/g, '<name>').replace(/<sn>/g, '<sec>').replace(/<değer/g, '<value') };
    });
  }
  var SNAP = window.KLIPPER_SNAPSHOT || { date: '', commands: [] };
  var DOC = 'https://www.klipper3d.org/';
  var RAW = 'https://raw.githubusercontent.com/Klipper3d/klipper/master/docs/';
  var DAY = 86400000;
  var INTERVALS = [0, 1, 3, 7, 16, 35, 90];

  var LESSONS = [], QIDX = {}, LIDX = {};
  UNITS.forEach(function (u, ui) {
    u.ui = ui; u.dark = shade(u.color, -0.3);
    u.lessons.forEach(function (l, li) {
      l.unit = u; l.li = li; l.gi = LESSONS.length; LESSONS.push(l); LIDX[l.id] = l;
      l.questions.forEach(function (q, qi) { q.id = l.id + 'q' + qi; q.lesson = l; QIDX[q.id] = q; });
    });
  });
  var REF_BY_CMD = {}; REF.forEach(function (r) { REF_BY_CMD[r.c] = r; });

  // ---------- Yerel köprü ----------
  function post(m) { try { if (NATIVE) window.webkit.messageHandlers.native.postMessage(m); } catch (e) {} }
  function haptic(s) { if (NATIVE) post({ type: 'haptic', style: s }); else if (navigator.vibrate) { try { navigator.vibrate(s === 'error' ? [30, 40, 30] : 10); } catch (e) {} } }
  function openUrl(u) { if (NATIVE) post({ type: 'open', url: u }); else window.open(u, '_blank', 'noopener'); }

  // ---------- Kayıt ----------
  function save() { S.savedAt = Date.now(); var str = JSON.stringify(S); try { localStorage.setItem(KEY, str); } catch (e) {} post({ type: 'save', data: str }); }

  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function dayKey(t) { var d = t ? new Date(t) : new Date(); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function daysBetween(a, b) { return Math.round((new Date(b + 'T12:00:00') - new Date(a + 'T12:00:00')) / DAY); }
  function curStreak() {
    if (!S.lastDay) return 0;
    var d = daysBetween(S.lastDay, dayKey());
    return (d <= 1 || d - 1 <= S.freezes) ? S.streak : 0;
  }
  function todayXp() { return S.daily.day === dayKey() ? S.daily.xp : 0; }
  function addXp(n) {
    var t = dayKey(), grew = false;
    if (S.lastDay !== t) {
      var gap = S.lastDay ? daysBetween(S.lastDay, t) : 99;
      if (gap === 1) S.streak++;
      else if (gap > 1 && gap - 1 <= S.freezes && S.streak > 0) { S.freezes -= gap - 1; S.streak++; toast('🧊', T('Seri koruyucu serini kurtardı!')); }
      else S.streak = 1;
      S.lastDay = t; grew = true;
    }
    if (S.daily.day !== t) S.daily = { day: t, xp: 0 };
    S.daily.xp += n; S.xp += n;
    if (S.streak > S.best) S.best = S.streak;
    return grew;
  }
  function lvl(xp) {
    var L = 1; while (50 * (L + 1) * L <= xp) L++;
    var lo = 50 * L * (L - 1), hi = 50 * (L + 1) * L;
    return { L: L, p: (xp - lo) / (hi - lo), need: hi - xp };
  }
  var TITLES = [T('Çırak'), T('Çırak'), T('Kurulumcu'), T('Kalibratör'), T('Teknisyen'), T('Teknisyen'), T('Makro Ustası'), T('Ayar Ustası'), T('Klipper Ustası')];

  // ---------- Aralıklı tekrar ----------
  function grade(id, ok) {
    var r = S.srs[id] || { box: 0, due: 0, seen: 0, wrong: 0 };
    r.seen++;
    if (ok) { r.box = Math.min(r.box + 1, INTERVALS.length - 1); r.due = Date.now() + INTERVALS[r.box] * DAY - 3 * 3600000; }
    else { r.box = 0; r.due = Date.now(); r.wrong++; }
    S.srs[id] = r;
  }
  function dueIds() {
    var now = Date.now();
    return Object.keys(S.srs).filter(function (id) { return QIDX[id] && S.srs[id].due <= now; })
      .sort(function (a, b) { return (S.srs[a].box - S.srs[b].box) || (S.srs[a].due - S.srs[b].due); });
  }
  function weakIds() {
    return Object.keys(S.srs).filter(function (id) { return QIDX[id] && S.srs[id].wrong > 0; })
      .sort(function (a, b) { return (S.srs[b].wrong - S.srs[a].wrong) || (S.srs[a].box - S.srs[b].box); });
  }
  function strength(lid) { var l = LIDX[lid], t = 0; l.questions.forEach(function (q) { var r = S.srs[q.id]; t += r ? Math.min(r.box, 4) / 4 : 0; }); return t / l.questions.length; }

  // ---------- Günlük görevler ----------
  var QPOOL = {
    xp: { ic: '⚡', t: function (g) { return LANG === 'en' ? 'Earn ' + g + ' XP' : g + ' XP kazan'; } },
    lesson: { ic: '📘', g: 2, t: function (g) { return LANG === 'en' ? 'Finish ' + g + ' lessons' : g + ' ders bitir'; } },
    combo: { ic: '🔥', g: 5, t: function (g) { return LANG === 'en' ? 'Get ' + g + ' right in a row' : g + ' soruyu üst üste doğru bil'; } },
    review: { ic: '🧠', g: 8, t: function (g) { return LANG === 'en' ? 'Answer ' + g + ' review questions' : g + ' tekrar sorusu çöz'; } },
    perfect: { ic: '🏆', g: 1, t: function () { return T('Bir dersi hatasız bitir'); } },
    typed: { ic: '⌨️', g: 2, t: function (g) { return LANG === 'en' ? 'Type ' + g + ' answers correctly' : g + ' yazma sorusunu doğru yaz'; } }
  };
  function hash(s) { var h = 0; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h); }
  function ensureQuests() {
    var d = dayKey(); if (S.quests && S.quests.day === d) return;
    var keys = ['lesson', 'combo', 'review', 'perfect', 'typed'], h = hash(d), a = keys[h % 5], b = keys[(h % 5 + 1 + (Math.floor(h / 5) % 4)) % 5];
    S.quests = { day: d, list: [{ k: 'xp', g: S.goal, p: 0, c: false }, { k: a, g: QPOOL[a].g, p: 0, c: false }, { k: b, g: QPOOL[b].g, p: 0, c: false }] };
  }
  function qProg(q) { return q.k === 'xp' ? todayXp() : q.p; }
  function qEvent(k, v, asMax) { ensureQuests(); S.quests.list.forEach(function (q) { if (q.k === k) q.p = asMax ? Math.max(q.p, v) : q.p + v; }); }
  function readyQuests() { ensureQuests(); return S.quests.list.filter(function (q) { return !q.c && qProg(q) >= q.g; }).length; }

  // ---------- Rozetler ----------
  var BADGES = [
    { id: 'first', ic: '🥇', c: '#ffc53d', n: T('İlk katman'), d: T('İlk dersi bitir'), ok: function () { return S.stats.lessons >= 1; } },
    { id: 'perfect', ic: '💎', c: '#4ea1ff', n: T('Kusursuz'), d: T('Bir dersi hatasız bitir'), ok: function () { return S.stats.perfect >= 1; } },
    { id: 's3', ic: '🔥', c: '#ff8a3d', n: T('Isınıyor'), d: T('3 günlük seri'), ok: function () { return S.best >= 3; } },
    { id: 's7', ic: '☄️', c: '#ff5a5f', n: T('Bir hafta'), d: T('7 günlük seri'), ok: function () { return S.best >= 7; } },
    { id: 's30', ic: '🌋', c: '#dc2626', n: T('Durdurulamaz'), d: T('30 günlük seri'), ok: function () { return S.best >= 30; } },
    { id: 'combo10', ic: '⚡', c: '#a78bfa', n: T('Zincir'), d: T('10 soruyu üst üste bil'), ok: function () { return S.bestCombo >= 10; } },
    { id: 'unit', ic: '🧱', c: '#3ddc84', n: T('İlk baskı'), d: T('Bir üniteyi bitir'), ok: function () { return UNITS.some(unitDone); } },
    { id: 'memory', ic: '🧠', c: '#ff6fb1', n: T('Hafıza'), d: T('50 tekrar sorusu çöz'), ok: function () { return S.stats.reviewQs >= 50; } },
    { id: 'macro', ic: '🧩', c: '#eab308', n: T('Makrocu'), d: T('Makrolar ünitesini bitir'), ok: function () { return unitDone(UNITS[6]); } },
    { id: 'tech', ic: '🚨', c: '#ef4444', n: T('Teknisyen'), d: T('Arıza Vakaları ünitesini bitir'), ok: function () { return unitDone(UNITS[UNITS.length - 1]); } },
    { id: 'xp1000', ic: '🏅', c: '#14b8a6', n: '1000 XP', d: T('Toplam 1000 XP topla'), ok: function () { return S.xp >= 1000; } },
    { id: 'master', ic: '👑', c: '#ffc53d', n: T('Klipper Ustası'), d: T('Bütün dersleri bitir'), ok: function () { return LESSONS.every(function (l) { return S.done[l.id]; }); } }
  ];
  function checkBadges() {
    var got = [];
    BADGES.forEach(function (b) { if (!S.badges[b.id] && b.ok()) { S.badges[b.id] = dayKey(); got.push(b); } });
    return got;
  }

  // ---------- Ses ----------
  var AC = null;
  function audio() {
    if (!S.sound) return null;
    try { if (!AC) { var C = window.AudioContext || window.webkitAudioContext; if (!C) return null; AC = new C(); } if (AC.state === 'suspended') AC.resume(); } catch (e) { return null; }
    return AC;
  }
  function tone(f, d, type, vol, at, f2) {
    var a = audio(); if (!a) return;
    try {
      var t = a.currentTime + (at || 0), o = a.createOscillator(), g = a.createGain();
      o.type = type || 'sine'; o.frequency.setValueAtTime(f, t); if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + d);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol || 0.15, t + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
      o.connect(g); g.connect(a.destination); o.start(t); o.stop(t + d + 0.03);
    } catch (e) {}
  }
  var SFX = {
    tap: function () { tone(1100, 0.035, 'triangle', 0.04); },
    ok: function () { tone(784, 0.11, 'triangle', 0.16); tone(1175, 0.2, 'triangle', 0.16, 0.08); },
    no: function () { tone(240, 0.24, 'sawtooth', 0.06, 0, 140); },
    combo: function () { tone(988, 0.08, 'square', 0.05); tone(1319, 0.14, 'square', 0.05, 0.07); },
    done: function () { [523, 659, 784, 1047, 1319].forEach(function (f, i) { tone(f, 0.24, 'triangle', 0.14, i * 0.1); }); },
    chest: function () { [880, 1109, 1319, 1760, 2217].forEach(function (f, i) { tone(f, 0.14, 'sine', 0.11, i * 0.06); }); }
  };

  // ---------- Yardımcılar ----------
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function shade(hex, p) {
    var n = parseInt(hex.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    function f(c) { return Math.max(0, Math.min(255, Math.round(c + (p < 0 ? c * p : (255 - c) * p)))); }
    return '#' + ((1 << 24) + (f(r) << 16) + (f(g) << 8) + f(b)).toString(16).slice(1);
  }
  function md(s) { return esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>'); }
  function isCode(o) { o = o.trim(); return o.length < 60 && /^([A-Z][A-Z0-9_]{2,}|[GM]\d|\[|\{|[\^!~#]|[a-z_]+:|[a-z_]+\.cfg|~\/|\/|ls |make|sudo|cd )/.test(o) && !/\s[a-zçğıöşü]{3,}/.test(o.replace(/\{.*?\}/g, '').replace(/\/[\w\/.*-]+/g, '')); }
  function hlLine(line) {
    var ci = -1, m = line.match(/(^|\s)([#;])/);
    if (/^\s*[#;]/.test(line)) ci = line.search(/[#;]/); else if (m && line.indexOf('{') < 0) ci = m.index + m[1].length;
    var code = ci >= 0 ? line.slice(0, ci) : line, com = ci >= 0 ? line.slice(ci) : '';
    var h = esc(code);
    if (/^\s*\[.*\]\s*$/.test(code)) h = '<span class="s">' + h + '</span>';
    else {
      h = h.replace(/(\{%.*?%\}|\{[^{}]*\})/g, '<span class="j">$1</span>');
      h = h.replace(/^(\s*)([GM]\d+(?:\.\d+)?|[A-Z][A-Z0-9_]{2,})(?=\s|$)/, '$1<span class="g">$2</span>');
      h = h.replace(/^(\s*)([a-z_][a-z0-9_]*)(:)/, '$1<span class="k">$2</span>$3');
    }
    return h + (com ? '<span class="c">' + esc(com) + '</span>' : '');
  }
  function codeLabel(code) {
    if (/\{%|\{ /.test(code) && /gcode_macro|params|printer\./.test(code)) return T('🧩 Makro');
    if (/^\s*\[[a-z_]/m.test(code) || /^[a-z_]+:\s/m.test(code)) return '📄 printer.cfg';
    if (/^(cd |make|sudo|ls |~\/|git |#\s*\/etc)/m.test(code)) return '💻 Terminal (SSH)';
    if (/^;/m.test(code)) return T('🔪 Dilimleyici');
    return T('⌨️ Konsol');
  }
  function codeHtml(code, blankHtml) {
    var lines = code.split('\n').map(function (ln) {
      if (blankHtml != null && ln.indexOf('___') >= 0) { var p = ln.split('___'); return hlLine(p[0]) + blankHtml + esc(p.slice(1).join('___')); }
      return hlLine(ln);
    });
    return '<div class="code"><div class="ch"><i style="background:#ff5f57"></i><i style="background:#febc2e"></i><i style="background:#28c840"></i>&nbsp;' + codeLabel(code) + '</div><pre>' + lines.join('\n') + '</pre></div>';
  }
  function logHtml(log) {
    var lines = log.split('\n').map(function (l) {
      var c = /^!!/.test(l) ? 'err' : /^\/\//.test(l) ? 'info' : /^>/.test(l) ? 'cmd' : '';
      return c ? '<span class="' + c + '">' + esc(l) + '</span>' : esc(l);
    });
    return T('<div class="code console"><div class="ch"><i style="background:#ff5f57"></i><i style="background:#febc2e"></i><i style="background:#28c840"></i>&nbsp;🖥️ Mainsail konsolu</div><pre>') + lines.join('\n') + '</pre></div>';
  }
  function inlineMd(s) { return esc(s).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1'); }
  function fmtDate8(d) { return d.slice(6, 8) + '.' + d.slice(4, 6) + '.' + d.slice(0, 4); }
  function ago(ts) { var m = Math.round((Date.now() - ts) / 60000); if (m < 1) return T('az önce'); if (m < 60) return m + T(' dk önce'); var h = Math.round(m / 60); if (h < 24) return h + T(' sa önce'); return Math.round(h / 24) + T(' gün önce'); }
  function isUnlocked(l) { return l.gi === 0 || !!S.done[LESSONS[l.gi - 1].id] || !!S.done[l.id]; }
  function stars(lid) { var d = S.done[lid]; if (!d) return 0; return d.best >= 0.95 ? 3 : d.best >= 0.75 ? 2 : 1; }
  function unitDone(u) { return u && u.lessons.every(function (l) { return S.done[l.id]; }); }

  // ---------- Nozi (maskot) ----------
  function nozi(mood, extra) {
    mood = mood || 'idle';
    var D = '#1b1f2a', eyes, mouth, more = '';
    var whites = '<circle cx="38" cy="41" r="10.5" fill="#fff"/><circle cx="62" cy="41" r="10.5" fill="#fff"/>';
    if (mood === 'happy' || mood === 'cheer') {
      eyes = '<path d="M30 43 Q38 32 46 43" stroke="' + D + '" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M54 43 Q62 32 70 43" stroke="' + D + '" stroke-width="5" fill="none" stroke-linecap="round"/>';
      mouth = '<path d="M41 53 Q50 67 59 53 Z" fill="#7a1f2e"/><path d="M45 59 Q50 63 55 59" fill="#ff6f8a"/>';
    } else if (mood === 'sad') {
      eyes = '<g class="eyes">' + whites + '<circle cx="37" cy="45" r="5.5" fill="' + D + '"/><circle cx="61" cy="45" r="5.5" fill="' + D + '"/><circle cx="39" cy="43" r="1.8" fill="#fff"/><circle cx="63" cy="43" r="1.8" fill="#fff"/></g>' +
        '<path d="M28 29 L44 33" stroke="' + D + '" stroke-width="3.5" stroke-linecap="round"/><path d="M72 29 L56 33" stroke="' + D + '" stroke-width="3.5" stroke-linecap="round"/>';
      mouth = '<path d="M43 61 Q50 54 57 61" stroke="' + D + '" stroke-width="3.5" fill="none" stroke-linecap="round"/>';
      more = '<path d="M83 24 Q87 32 83 35 Q79 32 83 24 Z" fill="#7cc4ff"/>';
    } else {
      var dx = mood === 'think' ? 3 : 1, dy = mood === 'think' ? -3 : 1;
      eyes = '<g class="eyes">' + whites + '<circle cx="' + (38 + dx) + '" cy="' + (41 + dy) + '" r="5.5" fill="' + D + '"/><circle cx="' + (62 + dx) + '" cy="' + (41 + dy) + '" r="5.5" fill="' + D + '"/><circle cx="' + (40 + dx) + '" cy="' + (39 + dy) + '" r="1.8" fill="#fff"/><circle cx="' + (64 + dx) + '" cy="' + (39 + dy) + '" r="1.8" fill="#fff"/></g>';
      mouth = mood === 'think' ? '<circle cx="53" cy="58" r="3.2" fill="' + D + '"/>' : '<path d="M43 56 Q50 62 57 56" stroke="' + D + '" stroke-width="3.5" fill="none" stroke-linecap="round"/>';
    }
    if (mood === 'cheer') more = '<g class="spark"><path d="M8 22 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3z" fill="#ffc53d"/></g><g class="spark" style="animation-delay:.4s"><path d="M92 14 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2z" fill="#ff6fb1"/></g><g class="spark" style="animation-delay:.8s"><path d="M94 66 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2z" fill="#4ea1ff"/></g>';
    return '<svg class="nozi ' + mood + ' ' + (extra || '') + '" viewBox="0 0 100 112" aria-hidden="true"><g class="body">' +
      '<rect x="44" y="0" width="12" height="22" rx="6" fill="#3ddc84"/><rect x="47" y="2" width="3" height="16" rx="1.5" fill="#a6f5c8"/>' +
      '<rect x="24" y="12" width="52" height="9" rx="4.5" fill="#c3cde0"/><rect x="24" y="12" width="52" height="4" rx="2" fill="#e3e9f5"/>' +
      '<rect x="14" y="18" width="72" height="52" rx="18" fill="#ff8a3d"/><rect x="14" y="52" width="72" height="18" rx="9" fill="#e86a1f"/><rect x="20" y="22" width="22" height="6" rx="3" fill="#ffb47d" opacity=".8"/>' +
      eyes + '<ellipse cx="25" cy="55" rx="5.5" ry="3.4" fill="#ff5a87" opacity=".55"/><ellipse cx="75" cy="55" rx="5.5" ry="3.4" fill="#ff5a87" opacity=".55"/>' + mouth +
      '<path d="M34 69 L66 69 L57 91 L43 91 Z" fill="#ffc53d"/><path d="M34 69 L66 69 L64 74 L36 74 Z" fill="#e0a21f"/><rect x="45" y="90" width="10" height="7" rx="2.5" fill="#d4931a"/>' +
      (mood === 'happy' || mood === 'cheer' ? '<rect x="47.5" y="97" width="5" height="12" rx="2.5" fill="#3ddc84"/>' : '') +
      '</g>' + more + '</svg>';
  }

  // Ünitenin "baskısı": dersler bittikçe katman katman basılan parça
  var PROFILES = [
    function (t) { return 0.5 + 0.32 * Math.sin(t * Math.PI * 1.1); },
    function () { return 0.78; },
    function (t) { return 0.95 - t * 0.72; },
    function (t) { return 0.42 + 0.45 * Math.abs(t - 0.5) * 2; },
    function (t) { return 0.4 + 0.35 * Math.sin(t * Math.PI); },
    function (t) { return t < 0.55 ? 0.9 : 0.45; }
  ];
  function printObj(u, frac) {
    var N = 13, f = PROFILES[u.ui % PROFILES.length], filled = Math.round(frac * N), h = 6, gap = 0.6, base = 92, s = '';
    s += '<rect x="2" y="' + (base + 1) + '" width="80" height="5" rx="2.5" fill="rgba(0,0,0,.28)"/>';
    for (var i = 0; i < N; i++) {
      var w = Math.max(10, f(i / (N - 1)) * 74), x = 42 - w / 2, y = base - (i + 1) * (h + gap);
      if (i < filled) s += '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="2.6" fill="#fff" opacity="' + (0.82 + 0.18 * (i % 2)) + '"/>';
      else s += '<rect x="' + (x + 0.75) + '" y="' + (y + 0.75) + '" width="' + (w - 1.5) + '" height="' + (h - 1.5) + '" rx="2.4" fill="none" stroke="#fff" stroke-opacity=".38" stroke-width="1.3" stroke-dasharray="3 2.5"/>';
    }
    if (filled < N) {
      var ty = base - filled * (h + gap) - 15;
      s += '<g transform="translate(34 ' + ty + ')"><rect x="2" y="0" width="12" height="8" rx="2.5" fill="#ffc53d"/><path d="M4 8 L12 8 L9.5 13 L6.5 13 Z" fill="#e0a21f"/></g>';
    } else {
      s += '<path d="M70 8 l2.5 6 6 2.5 -6 2.5 -2.5 6 -2.5 -6 -6 -2.5 6 -2.5z" fill="#fff"/>';
    }
    return '<svg class="printobj" viewBox="0 0 84 100" aria-hidden="true">' + s + '</svg>';
  }
  function headSvg(color) {
    return '<svg class="l-head-svg" viewBox="0 0 26 34" width="26" height="34"><rect x="9" y="0" width="8" height="8" rx="4" fill="' + color + '"/><rect x="2" y="6" width="22" height="14" rx="5" fill="#ff8a3d"/><circle cx="9" cy="13" r="2.4" fill="#fff"/><circle cx="17" cy="13" r="2.4" fill="#fff"/><circle cx="9.5" cy="13.5" r="1.2" fill="#1b1f2a"/><circle cx="17.5" cy="13.5" r="1.2" fill="#1b1f2a"/><path d="M7 20 L19 20 L15.5 27 L10.5 27 Z" fill="#ffc53d"/></svg>';
  }

  // ---------- Toast, konfeti ----------
  function toast(ic, text) {
    var t = document.createElement('div'); t.className = 'toast'; t.innerHTML = '<span>' + ic + '</span>' + esc(text);
    document.body.appendChild(t); setTimeout(function () { t.remove(); }, 1900);
  }
  function confetti() {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var c = document.createElement('canvas'); c.className = 'confetti'; document.body.appendChild(c);
    var dpr = window.devicePixelRatio || 1, W = window.innerWidth, H = window.innerHeight; c.width = W * dpr; c.height = H * dpr;
    var x = c.getContext('2d'); x.scale(dpr, dpr);
    var cols = ['#3ddc84', '#ffc53d', '#ff6fb1', '#4ea1ff', '#ff8a3d', '#a78bfa'], P = [];
    for (var i = 0; i < 140; i++) P.push({ x: W / 2 + (Math.random() - 0.5) * 60, y: H * 0.35, vx: (Math.random() - 0.5) * 13, vy: -Math.random() * 14 - 4, r: Math.random() * 6 + 4, c: cols[i % cols.length], a: Math.random() * 6, va: (Math.random() - 0.5) * 0.4, sh: i % 3 });
    var t0 = performance.now();
    (function frame(t) {
      var el = t - t0; x.clearRect(0, 0, W, H);
      P.forEach(function (p) {
        p.vy += 0.38; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.a += p.va;
        x.save(); x.translate(p.x, p.y); x.rotate(p.a); x.globalAlpha = Math.max(0, 1 - el / 2600); x.fillStyle = p.c;
        if (p.sh === 0) x.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2); else if (p.sh === 1) { x.beginPath(); x.arc(0, 0, p.r / 2.4, 0, 6.3); x.fill(); } else x.fillRect(-p.r / 4, -p.r / 2, p.r / 2, p.r);
        x.restore();
      });
      if (el < 2700) requestAnimationFrame(frame); else c.remove();
    })(t0);
  }

  // ---------- Kök render ----------
  var app = document.getElementById('app');
  var UI = { tab: 'path', refQ: '', refCat: 'Tümü', newsSeg: 'changes', prevSeen: null, loading: false, newsErr: null, bump: null };
  var SES = null, lessonEl = null;

  function unseenCount() {
    var c = S.news.cache; if (!c || !c.changes) return 0;
    var seen = S.news.seen || SNAP.date.replace(/-/g, '');
    return c.changes.filter(function (x) { return x.date > seen; }).length;
  }

  function render(enter) {
    ensureQuests();
    var due = dueIds().length, st = curStreak(), today = S.lastDay === dayKey();
    var html = '<div class="topbar"><div class="brand">' + nozi('idle') + 'Klipper</div>' +
      '<div class="chipstat fire' + (today ? '' : ' cold') + (UI.bump === 'fire' ? ' bump' : '') + '"><span class="i">🔥</span>' + st + '</div>' +
      '<div class="chipstat spool' + (UI.bump === 'spool' ? ' bump' : '') + '"><span class="i">🧵</span>' + S.spools + '</div>' +
      '<div class="chipstat xp' + (UI.bump === 'xp' ? ' bump' : '') + '"><span class="i">⚡</span>' + S.xp + '</div></div>';
    UI.bump = null;
    html += '<div class="screen' + (enter ? ' enter' : '') + '" id="scr">' + screenHtml() + '</div>';
    var nb = unseenCount(), qr = readyQuests();
    var tabs = [['path', '🏠', T('Yol'), qr], ['review', '🧠', T('Tekrar'), due], ['news', '📰', T('Yenilikler'), nb], ['ref', '📖', T('Rehber'), 0], ['me', '🧑‍🔧', T('Profil'), 0]];
    html += '<nav class="tabbar">' + tabs.map(function (t) {
      return '<button class="tab' + (UI.tab === t[0] ? ' on' : '') + '" data-tab="' + t[0] + '"><span class="ic">' + t[1] + '</span>' + t[2] +
        (t[3] ? '<span class="badge">' + (t[3] > 99 ? '99+' : t[3]) + '</span>' : '') + '</button>';
    }).join('') + '</nav>';
    var old = document.getElementById('scr'), top = old ? old.scrollTop : 0;
    app.innerHTML = html;
    if (!enter) document.getElementById('scr').scrollTop = top;
    if (UI.tab === 'ref' && UI.focusRef) { var si = document.getElementById('refq'); if (si) { si.focus(); si.setSelectionRange(si.value.length, si.value.length); } }
  }
  function screenHtml() {
    switch (UI.tab) { case 'path': return pathHtml(); case 'review': return reviewHtml(); case 'news': return newsHtml(); case 'ref': return refHtml(); case 'me': return meHtml(); }
    return '';
  }

  // ---------- Yol ----------
  function greeting() {
    var tx = todayXp(), due = dueIds().length;
    if (!S.stats.lessons) return [T('Selam! Ben <b>Nozi</b> 👋'), T('Klipper\'ı birlikte katman katman öğreneceğiz. İlk dersle başlayalım mı?')];
    if (due >= 5) return [T('Bazı bilgiler soğumaya başladı 🥶'), due + T(' soru tekrar bekliyor. Unutmadan ısıtalım!')];
    if (tx >= S.goal) return [T('Bugünkü hedef tamam! 🎉'), T('Seri ') + curStreak() + T(' gün. İstersen bir ders daha basalım.')];
    if (S.lastDay !== dayKey() && S.streak > 0) return [T('Serin tehlikede! 🔥'), T('Bugün bir ders bitir, ') + S.streak + T(' günlük seri devam etsin.')];
    return [T('Hadi, nozul ısındı! 🔥'), T('Günlük hedefe ') + (S.goal - tx) + T(' XP kaldı.')];
  }
  function questsHtml() {
    var h = T('<div class="card quests"><div class="row" style="margin-bottom:4px"><h3 style="flex:1;margin:0">Günlük görevler</h3><span class="small muted" style="font-weight:800">her görev 🧵10</span></div>');
    S.quests.list.forEach(function (q, i) {
      var P = QPOOL[q.k], p = Math.min(qProg(q), q.g), pct = p / q.g * 100;
      h += '<div class="quest"><div class="qi">' + P.ic + '</div><div style="flex:1"><div class="qt">' + esc(P.t(q.g)) + '</div><div class="bar"><i style="width:' + pct + '%"></i><span class="lbl">' + p + ' / ' + q.g + '</span></div></div>' +
        (q.c ? '<span class="claimed">✅</span>' : pct >= 100 ? '<button class="claim" data-claim="' + i + T('">🎁 AL</button>') : '<span class="claimed" style="opacity:.35">🎁</span>') + '</div>';
    });
    return h + '</div>';
  }
  function pathHtml() {
    var g = greeting(), due = dueIds().length, nb = unseenCount();
    var h = '<div class="hello"><div class="nz">' + nozi(S.lastDay === dayKey() && todayXp() >= S.goal ? 'happy' : 'idle') + '</div><div class="bubble">' + g[0] + '<span class="sub">' + g[1] + '</span></div></div>';
    h += questsHtml();
    if (due > 0) h += T('<button class="alert review press" data-act="review" style="width:100%;text-align:left"><span class="ai">🧠</span><span class="at">Tekrar zamanı<small>') + due + T(' soru unutulmak üzere</small></span><span class="btn blue sm">BAŞLA</span></button>');
    if (nb > 0) h += T('<button class="alert news press" data-tab="news" style="width:100%;text-align:left"><span class="ai">📰</span><span class="at">Klipper\'da yenilik var<small>') + nb + T(' yeni config değişikliği</small></span><span class="btn ghost sm">BAK</span></button>');

    var offs = [0, 58, 82, 58, 0, -58, -82, -58], firstOpen = null, k = 0;
    for (var i = 0; i < LESSONS.length; i++) if (!S.done[LESSONS[i].id] && isUnlocked(LESSONS[i])) { firstOpen = LESSONS[i].id; break; }
    UNITS.forEach(function (u) {
      var dn = u.lessons.filter(function (l) { return S.done[l.id]; }).length, frac = dn / u.lessons.length;
      h += '<div class="unit"><div class="unit-head" style="background:' + u.color + ';--ud:' + u.dark + T('"><div class="tex"></div><div class="ut"><div class="un">ÜNİTE ') + (u.ui + 1) + ' · ' + u.icon + '</div><h2>' + esc(u.title) + '</h2><p>' + esc(u.desc) + '</p><span class="uc">' + (frac === 1 ? T('Baskı tamam ✨') : pct(Math.round(frac * 100)) + T(' basıldı')) + '</span></div>' + printObj(u, frac) + '</div>';
      h += '<div class="path">';
      u.lessons.forEach(function (l) {
        var done = !!S.done[l.id], open = isUnlocked(l), cur = l.id === firstOpen, off = offs[k++ % offs.length];
        var cls = cur ? 'cur' : (done || open) ? 'done' : 'locked', st = stars(l.id);
        h += '<div class="node-wrap" style="transform:translateX(' + off + 'px)">' +
          (cur ? '<div class="tip">' + (S.stats.lessons ? T('DEVAM') : T('BAŞLA')) + '</div>' : '') +
          (cur ? '<div class="peek" style="' + (off > 0 ? 'left:-52px' : 'right:-52px') + '">' + nozi('idle') + '</div>' : '') +
          '<button class="node ' + cls + '" style="--uc:' + u.color + ';--ud:' + u.dark + '" data-lesson="' + l.id + '"><span>' + (done ? '✔' : open ? u.icon : '🔒') + '</span>' + (st === 3 ? '<span class="crown">👑</span>' : '') + '</button>' +
          '<div class="node-label' + (open ? '' : ' locked') + '">' + esc(l.title) + '</div>' + (st ? '<div class="stars">' + '⭐'.repeat(st) + '</div>' : '') + '</div>';
      });
      var off2 = offs[k++ % offs.length], ready = unitDone(u) && !S.chests[u.id];
      h += '<div class="node-wrap" style="transform:translateX(' + off2 + 'px)"><button class="chest ' + (S.chests[u.id] ? 'open' : ready ? 'ready' : '') + '" data-chest="' + u.id + '">' + (S.chests[u.id] ? '📭' : '🎁') + '</button><div class="node-label' + (ready ? '' : ' locked') + '">' + (S.chests[u.id] ? T('Açıldı') : ready ? T('Sandığı aç!') : T('Ünite sandığı')) + '</div></div>';
      h += '</div></div>';
    });
    h += '<div class="empty"><div class="nz">' + nozi(LESSONS.every(function (l) { return S.done[l.id]; }) ? 'cheer' : 'think') + '</div>' + (LESSONS.every(function (l) { return S.done[l.id]; }) ? T('Hepsini bitirdin, usta! Artık tekrarlarla taze tut.') : T('Yolun sonu burada. Katman katman ilerle!')) + '</div>';
    return h;
  }

  // ---------- Tekrar ----------
  function reviewHtml() {
    var due = dueIds(), weak = weakIds(), learned = Object.keys(S.srs).length;
    var h = '<div class="hello"><div class="nz">' + nozi(due.length ? 'think' : 'happy') + '</div><div class="bubble">' + (due.length ? due.length + T(' soru tekrar bekliyor') : learned ? T('Şu an her şey taze! 🧊') : T('Önce bir ders bitirelim')) +
      T('<span class="sub">Bildiğin soru 1, 3, 7, 16, 35, 90 gün sonra geri gelir. Yanlış yaptığın hemen gelir.</span></div></div>');
    if (due.length) h += T('<button class="btn primary" data-act="review">TEKRARA BAŞLA</button>');
    else if (learned) h += T('<button class="btn blue" data-act="practice">KARIŞIK PRATİK</button>');
    if (learned) {
      var boxes = [0, 0, 0, 0, 0, 0, 0]; Object.keys(S.srs).forEach(function (id) { boxes[S.srs[id].box]++; });
      var names = [T('Unutuldu'), T('1 gün'), T('3 gün'), T('1 hafta'), T('2 hafta'), T('1 ay'), T('Usta 👑')], cols = ['#ff5a5f', '#ff8a3d', '#ffc53d', '#eab308', '#a3e635', '#3ddc84', '#14b8a6'];
      h += T('<div class="sec-title">Hafızan</div><div class="card">');
      boxes.forEach(function (n, i) { h += '<div class="mem-row"><span>' + names[i] + '</span><div class="bar"><i style="width:' + (n / learned * 100) + '%;background:' + cols[i] + '"></i></div><b>' + n + '</b></div>'; });
      h += '</div>';
    }
    if (weak.length) {
      h += T('<div class="sec-title">Zayıf noktaların</div>');
      weak.slice(0, 5).forEach(function (id) { var q = QIDX[id]; h += '<div class="weak"><div class="wl">' + q.lesson.unit.icon + ' ' + esc(q.lesson.title) + ' · ' + S.srs[id].wrong + T(' yanlış</div><div class="wq">') + esc(q.q) + '</div></div>'; });
      h += T('<button class="btn ghost" data-act="weak">ZAYIF NOKTALARI ÇALIŞ</button>');
    }
    var ld = LESSONS.filter(function (l) { return S.done[l.id]; });
    if (ld.length) {
      h += T('<div class="sec-title">Ders bazında güç</div>');
      ld.forEach(function (l) {
        var s = strength(l.id);
        h += '<button class="lrow press" data-lesson="' + l.id + '"><span class="li" style="background:' + l.unit.color + '">' + l.unit.icon + '</span><div style="flex:1"><div style="font-weight:900;font-size:15px">' + esc(l.title) + '</div><div class="bar" style="height:9px;margin-top:7px"><i style="width:' + Math.round(s * 100) + '%;background:' + l.unit.color + '"></i></div></div><span class="muted small" style="font-weight:900">↻</span></button>';
      });
    }
    return h;
  }

  // ---------- Yenilikler ----------
  function newsHtml() {
    var c = S.news.cache;
    var h = '<div class="hello"><div class="nz">' + nozi(UI.loading ? 'think' : 'idle') + T('</div><div class="bubble">Klipper\'dan taze haberler<span class="sub">') + (c ? T('Son kontrol: ') + ago(c.at) : T('Henüz kontrol edilmedi')) + ' · <a href="#" data-act="refresh">' + (UI.loading ? '<span class="spinner"></span>' : T('Şimdi kontrol et')) + '</a></span></div></div>';
    if (UI.newsErr) h += T('<div class="card" style="border-color:#7f1d1d"><b>Bağlanılamadı.</b> <span class="muted small">') + esc(UI.newsErr) + (c ? T(' Aşağıda son kaydedilen bilgiler var.') : '') + '</span></div>';
    if (!c) { h += UI.loading ? '' : T('<div class="empty">Klipper\'ın GitHub deposundan config değişikliklerini, son commit\'leri ve wiki\'ye eklenen komutları çekerim.<br><br><button class="btn primary" data-act="refresh">ŞİMDİ KONTROL ET</button></div>'); return h; }
    if (c.release) h += T('<div class="card row"><div style="font-size:30px">🏷️</div><div><div class="muted small" style="font-weight:800">Son resmi sürüm</div><b style="font-size:18px">') + esc(c.release.name) + '</b> <span class="muted small">· ' + fmtDate8(c.release.date) + '</span></div></div>';
    var segs = [['changes', T('Değişiklikler')], ['wiki', T('Wiki kontrolü')], ['commits', T('Commit\'ler')]];
    h += '<div class="seg">' + segs.map(function (s) { return '<button class="' + (UI.newsSeg === s[0] ? 'on' : '') + '" data-seg="' + s[0] + '">' + s[1] + '</button>'; }).join('') + '</div>';
    var seen = UI.prevSeen || SNAP.date.replace(/-/g, '');
    if (UI.newsSeg === 'changes') {
      h += T('<p class="muted small" style="margin:0 2px 10px;font-weight:700">Güncellerken config\'ini etkileyebilecek değişiklikler. Metinler resmi İngilizce haliyle.</p>');
      (c.changes || []).forEach(function (x) {
        var isNew = x.date > seen, ls = relatedLessons(x.text);
        h += '<div class="news-item' + (isNew ? ' new' : '') + '"><div class="d">📅 ' + fmtDate8(x.date) + (isNew ? T('<span class="nw">YENİ</span>') : '') + '</div><p>' + inlineMd(x.text) + '</p>' +
          ls.map(function (l) { return '<button class="lchip press" data-lesson="' + l.id + T('">📘 Ders: ') + esc(l.title) + '</button> '; }).join('') + '</div>';
      });
      h += '<button class="btn ghost" data-url="' + DOC + T('Config_Changes.html">TAMAMINI WİKİ\'DE AÇ</button>');
    } else if (UI.newsSeg === 'wiki') {
      var add = c.added || [], rem = c.removed || [];
      h += T('<div class="card"><h3>Komut listesi karşılaştırması</h3><p class="muted small" style="margin:0;font-weight:700">Uygulama ') + fmtDate8(SNAP.date.replace(/-/g, '')) + T(' tarihli wiki ile hazırlandı (') + SNAP.commands.length + T(' komut). Wiki\'de şu an ') + (c.total || '?') + T(' komut var.</p></div>');
      if (!add.length && !rem.length) h += '<div class="empty"><div class="nz">' + nozi('happy') + T('</div>Wiki\'de yeni komut yok. İçerik güncel!</div>');
      if (add.length) { h += T('<div class="sec-title">Wiki\'ye eklenenler (') + add.length + ')</div>'; add.forEach(function (n) { h += '<div class="ref"><div class="n">🆕 ' + esc(n) + '</div><div class="acts"><a href="#" data-url="' + DOC + 'G-Codes.html#' + n.toLowerCase() + T('">Wiki\'de oku ›</a></div></div>'); }); }
      if (rem.length) { h += T('<div class="sec-title">Wiki\'den kalkanlar (') + rem.length + ')</div>'; rem.forEach(function (n) { h += '<div class="ref"><div class="n" style="color:#ff8a8d;text-decoration:line-through">' + esc(n) + '</div>' + (REF_BY_CMD[n] ? T('<div class="small muted">Derslerde geçiyor; kullanmadan önce wiki\'ye bak.</div>') : '') + '</div>'; }); }
    } else {
      (c.commits || []).forEach(function (x) { h += '<div class="news-item"><div class="d">' + esc(x.date.slice(0, 10).split('-').reverse().join('.')) + ' · ' + esc(x.author) + '</div><p>' + inlineMd(x.msg) + '</p><a href="#" class="small" data-url="' + esc(x.url) + T('">GitHub\'da aç ›</a></div>'); });
      if (!(c.commits || []).length) h += T('<div class="empty">Commit bilgisi alınamadı.</div>');
    }
    return h;
  }
  function relatedLessons(text) {
    var f = {}, out = [];
    (text.match(/[A-Z][A-Z0-9_]{3,}/g) || []).forEach(function (w) { var r = REF_BY_CMD[w]; if (r && r.l && !f[r.l]) { f[r.l] = 1; out.push(LIDX[r.l]); } });
    return out.slice(0, 2);
  }
  function fetchText(u) { return fetch(u, { cache: 'no-store' }).then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.text(); }); }
  function parseChanges(t) {
    var i = t.indexOf('## Changes'); if (i >= 0) t = t.slice(i);
    var out = [], re = /^(\d{8}):\s+([\s\S]*?)(?=\n\s*\n\d{8}:|\n## |(?![\s\S]))/gm, m;
    while ((m = re.exec(t)) && out.length < 30) out.push({ date: m[1], text: m[2].replace(/\s+/g, ' ').trim() });
    return out;
  }
  function parseCommands(t) {
    var set = {}, re = /^#{3,4}\s+`?([A-Z][A-Z0-9_]+)`?/gm, m;
    while ((m = re.exec(t))) set[m[1]] = 1;
    var re2 = /`((?:G|M)\d+)/g; while ((m = re2.exec(t))) set[m[1]] = 1;
    return Object.keys(set).sort();
  }
  function refreshNews(silent) {
    if (UI.loading) return;
    UI.loading = true; UI.newsErr = null; if (!silent && !SES) render();
    var res = {};
    var p1 = fetchText(RAW + 'Config_Changes.md').then(function (t) { res.changes = parseChanges(t); });
    var p2 = fetchText(RAW + 'Releases.md').then(function (t) { var m = t.match(/## (Klipper [\d.]+)\s+Available on (\d{8})/); if (m) res.release = { name: m[1], date: m[2] }; }).catch(function () {});
    var p3 = fetchText(RAW + 'G-Codes.md').then(function (t) {
      var now = parseCommands(t), old = {}, cur = {};
      SNAP.commands.forEach(function (c) { old[c] = 1; }); now.forEach(function (c) { cur[c] = 1; });
      res.total = now.length; res.added = now.filter(function (c) { return !old[c]; }); res.removed = SNAP.commands.filter(function (c) { return !cur[c]; });
    }).catch(function () {});
    var p4 = fetch('https://api.github.com/repos/Klipper3d/klipper/commits?per_page=15', { cache: 'no-store' })
      .then(function (r) { if (!r.ok) throw new Error(); return r.json(); })
      .then(function (j) { res.commits = j.map(function (c) { return { msg: c.commit.message.split('\n')[0], date: c.commit.committer.date, author: c.commit.author.name, url: c.html_url }; }); })
      .catch(function () {});
    Promise.all([p1, p2, p3, p4]).then(function () {
      var prev = S.news.cache || {}; res.at = Date.now();
      if (!res.commits) res.commits = prev.commits || [];
      if (!res.release) res.release = prev.release;
      if (res.added == null) { res.added = prev.added || []; res.removed = prev.removed || []; res.total = prev.total; }
      S.news.cache = res; save();
    }).catch(function () { UI.newsErr = T('Klipper GitHub\'a ulaşılamadı. İnternet bağlantını kontrol et.'); })
      .then(function () { UI.loading = false; if (UI.tab === 'news') markSeen(); if (!SES) render(); });
  }
  function markSeen() {
    var c = S.news.cache; if (!c || !c.changes || !c.changes.length) return;
    if (UI.prevSeen == null) UI.prevSeen = S.news.seen || SNAP.date.replace(/-/g, '');
    S.news.seen = c.changes[0].date; save();
  }

  // ---------- Rehber ----------
  function refHtml() {
    var q = UI.refQ.trim().toUpperCase(), cats = ['Tümü'];
    REF.forEach(function (r) { if (cats.indexOf(r.k) < 0) cats.push(r.k); });
    var h = T('<input id="refq" class="search" placeholder="🔍  Komut ara: BED_MESH, M109, fan…" value="') + esc(UI.refQ) + '" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false">';
    if (!q) h += '<div class="cats">' + cats.map(function (c) { return '<button class="cat' + (UI.refCat === c ? ' on' : '') + '" data-cat="' + esc(c) + '">' + esc(T(c)) + '</button>'; }).join('') + '</div>';
    var list = REF.filter(function (r) { if (q) return (r.c + ' ' + r.s + ' ' + r.d).toUpperCase().indexOf(q) >= 0; return UI.refCat === 'Tümü' || r.k === UI.refCat; });
    list.forEach(function (r) {
      var l = LIDX[r.l];
      h += '<div class="ref"><div class="n">' + esc(r.c) + '</div><div class="s">' + esc(r.s) + '</div><div class="t">' + esc(r.d) + '</div><div class="acts">' +
        (l ? '<button data-lesson="' + l.id + '">📘 ' + esc(l.title) + '</button>' : '') +
        '<a href="#" data-url="' + DOC + 'G-Codes.html#' + (/^[GM]\d/.test(r.c) ? 'g-code-commands' : r.c.toLowerCase()) + '">Wiki ›</a></div></div>';
    });
    if (q) {
      var extra = SNAP.commands.filter(function (c) { return !REF_BY_CMD[c] && c.indexOf(q) >= 0; }).slice(0, 30);
      if (extra.length) { h += T('<div class="sec-title">Wiki\'deki diğer komutlar</div>'); extra.forEach(function (c) { h += '<div class="ref"><div class="n">' + esc(c) + '</div><div class="acts"><a href="#" data-url="' + DOC + 'G-Codes.html#' + (/^[GM]\d/.test(c) ? 'g-code-commands' : c.toLowerCase()) + T('">Wiki\'de oku (İngilizce) ›</a></div></div>'); }); }
      if (!list.length && !extra.length) h += '<div class="empty"><div class="nz">' + nozi('sad') + '</div>"' + esc(UI.refQ) + T('" bulunamadı.</div>');
    }
    return h;
  }

  // ---------- Profil ----------
  function meHtml() {
    var acc = S.stats.answered ? Math.round(S.stats.correct / S.stats.answered * 100) : 0, done = LESSONS.filter(function (l) { return S.done[l.id]; }).length, L = lvl(S.xp);
    var h = '<div class="prof"><div class="nz">' + nozi(S.xp ? 'happy' : 'idle') + '</div><div style="flex:1"><h2>' + TITLES[Math.min(L.L - 1, TITLES.length - 1)] + T('</h2><div class="muted small" style="font-weight:800">Sonraki seviyeye ') + L.need + T(' XP</div><div class="lvl"><b>Sv. ') + L.L + '</b><div class="bar"><i style="width:' + Math.round(L.p * 100) + '%"></i></div></div></div></div>';
    h += '<div class="stat-grid">' +
      '<div class="stat"><span class="si">🔥</span><div><b>' + curStreak() + T('</b><span>gün seri · en iyi ') + S.best + '</span></div></div>' +
      '<div class="stat"><span class="si">⚡</span><div><b>' + S.xp + T('</b><span>toplam XP</span></div></div>') +
      '<div class="stat"><span class="si">📘</span><div><b>' + done + '/' + LESSONS.length + T('</b><span>ders</span></div></div>') +
      '<div class="stat"><span class="si">🎯</span><div><b>' + pct(acc) + T('</b><span>doğruluk</span></div></div></div>');
    var got = BADGES.filter(function (b) { return S.badges[b.id]; }).length;
    h += T('<div class="sec-title">Rozetler <span class="muted small">') + got + '/' + BADGES.length + '</span></div><div class="badges">' + BADGES.map(function (b) {
      var on = !!S.badges[b.id];
      return '<div class="badge-it' + (on ? '' : ' off') + '" style="--bc:' + b.c + '"><div class="bi">' + b.ic + '</div><b>' + b.n + '</b><span>' + b.d + '</span></div>';
    }).join('') + '</div>';
    h += T('<div class="sec-title">Dükkân</div><div class="card shop"><span class="si">🧊</span><div style="flex:1"><b>Seri koruyucu</b><div class="muted small" style="font-weight:700">Bir gün kaçırırsan serin bozulmaz. Elinde: ') + S.freezes + '/2</div></div><button class="btn ' + (S.spools >= 50 && S.freezes < 2 ? 'primary' : 'ghost') + ' sm" data-act="buy"' + (S.spools >= 50 && S.freezes < 2 ? '' : ' disabled') + '>🧵 50</button></div>';
    h += T('<div class="sec-title">Ayarlar</div>');
    h += '<div class="seg">' + [['tr', '🇹🇷 Türkçe'], ['en', '🇬🇧 English']].map(function (o) { return '<button class="' + (LANG === o[0] ? 'on' : '') + '" data-lang="' + o[0] + '">' + o[1] + '</button>'; }).join('') + '</div>';
    h += T('<div class="card row"><span style="font-size:24px">🔊</span><b style="flex:1">Sesler</b><button class="toggle') + (S.sound ? ' on' : '') + T('" data-act="sound" aria-label="Sesler"></button></div>');
    h += T('<div class="small muted" style="font-weight:800;margin:4px 2px 8px">Günlük hedef</div><div class="seg">') + [[20, T('Rahat')], [50, 'Normal'], [100, T('Ciddi')], [200, T('Çılgın')]].map(function (g) {
      return '<button class="' + (S.goal === g[0] ? 'on' : '') + '" data-goal="' + g[0] + '">' + g[1] + '<br><span class="small muted">' + g[0] + ' XP</span></button>';
    }).join('') + '</div>';
    h += T('<div class="card small" style="line-height:1.55;font-weight:600">Dersler Klipper\'ın resmi dokümanlarından (klipper3d.org) Türkçe hazırlandı. ') + UNITS.length + T(' ünite, ') + LESSONS.length + T(' ders, ') + Object.keys(QIDX).length + T(' soru. Komut listesi ') + fmtDate8(SNAP.date.replace(/-/g, '')) + T(' tarihli; Yenilikler sekmesi wiki\'yi canlı kontrol eder.<br><a href="#" data-url="') + DOC + T('Overview.html">Klipper dokümanlarını aç ›</a></div>');
    h += T('<button class="btn ghost" data-act="reset">İLERLEMEYİ SIFIRLA</button>');
    return h;
  }

  // ---------- Modal ----------
  function modal(html) {
    closeModal();
    var d = document.createElement('div'); d.className = 'modal-bg'; d.id = 'modal';
    d.innerHTML = '<div class="modal">' + html + '</div>';
    d.addEventListener('click', function (e) { if (e.target === d) closeModal(); });
    document.body.appendChild(d); return d;
  }
  function closeModal() { var m = document.getElementById('modal'); if (m) m.remove(); }

  // ---------- Ders oturumu ----------
  function startLesson(l, force) {
    if (!isUnlocked(l) && !force) {
      var d = modal('<div class="nz">' + nozi('think') + '</div><h3>🔒 ' + esc(l.title) + T('</h3><p class="muted">Bu ders henüz kilitli. Konuyu biliyorsan yine de başlayabilirsin.</p><button class="btn primary" id="m-go">YİNE DE BAŞLA</button><button class="btn ghost" id="m-x">VAZGEÇ</button>'));
      d.querySelector('#m-go').onclick = function () { closeModal(); startLesson(l, true); };
      d.querySelector('#m-x').onclick = closeModal; return;
    }
    var items = [], replay = !!S.done[l.id];
    if (!replay) l.teach.forEach(function (t, i) { items.push({ kind: 'teach', t: t, n: i + 1, of: l.teach.length }); });
    else items.push({ kind: 'teach', t: { title: T('Hatırlayalım'), body: l.teach.map(function (t) { return '• **' + t.title + '**'; }).join('\n') + T('\n\nBu dersi daha önce bitirdin. Bakalım ne kadar aklında kalmış!') }, n: 1, of: 1 });
    var qs = shuffle(l.questions.slice(0, 3)).concat(shuffle(l.questions.slice(3))).map(function (q) { return { kind: 'q', q: q }; });
    var olds = dueIds().filter(function (id) { return QIDX[id].lesson.id !== l.id; }).slice(0, 2);
    if (olds.length < 2) {
      var pool = shuffle(Object.keys(S.srs).filter(function (id) { return QIDX[id] && QIDX[id].lesson.id !== l.id && olds.indexOf(id) < 0; }).sort(function (a, b) { return S.srs[a].box - S.srs[b].box; }).slice(0, 8));
      olds = olds.concat(pool.slice(0, 2 - olds.length));
    }
    olds.forEach(function (id, i) { qs.splice(Math.min(qs.length, 3 + i * 3), 0, { kind: 'q', q: QIDX[id], review: true }); });
    SES = { mode: 'lesson', lesson: l, items: items.concat(qs), ok: 0, total: items.length + qs.length, i: 0, xp: 0, firstTry: {}, wrongs: 0, combo: 0, maxCombo: 0, start: Date.now(), color: l.unit.color };
    openSession();
  }
  function startReview(mode) {
    var ids;
    if (mode === 'weak') ids = weakIds().slice(0, 12);
    else if (mode === 'practice') ids = shuffle(Object.keys(S.srs).filter(function (id) { return QIDX[id]; })).sort(function (a, b) { return S.srs[a].box - S.srs[b].box; }).slice(0, 10);
    else ids = dueIds().slice(0, 15);
    if (!ids.length) return;
    SES = { mode: 'review', items: shuffle(ids).map(function (id) { return { kind: 'q', q: QIDX[id], review: true }; }), ok: 0, total: ids.length, i: 0, xp: 0, firstTry: {}, wrongs: 0, combo: 0, maxCombo: 0, start: Date.now(), color: '#4ea1ff' };
    openSession();
  }
  function openSession() {
    lessonEl = document.createElement('div'); lessonEl.className = 'lesson'; lessonEl.style.setProperty('--uc', SES.color);
    document.body.appendChild(lessonEl); prepItem(); renderSession(); audio();
  }
  function closeSession() { if (lessonEl) lessonEl.remove(); lessonEl = null; SES = null; render(true); }

  function prepItem() {
    var it = SES.items[SES.i]; if (!it || it.kind !== 'q') return;
    var q = it.q; it.st = { sel: null, done: false };
    if (q.t === 'mc') it.st.order = shuffle(q.o.map(function (_, i) { return i; }));
    if (q.t === 'fill') it.st.order = shuffle(q.o.slice());
    if (q.t === 'order') { var idx = q.items.map(function (_, i) { return i; }), sh; do { sh = shuffle(idx); } while (idx.length > 1 && sh.join() === idx.join()); it.st.bank = sh; it.st.ans = []; it.st.mono = q.items.filter(isCode).length * 2 >= q.items.length; }
    if (q.t === 'match') { it.st.right = shuffle(q.pairs.map(function (_, i) { return i; })); it.st.ok = {}; it.st.l = null; it.st.mist = 0; }
    if (q.t === 'type') it.st.sel = '';
  }
  function canCheck(it) {
    var q = it.q, st = it.st;
    if (q.t === 'order') return st.ans.length === q.items.length;
    if (q.t === 'type') return st.sel.trim().length > 0;
    if (q.t === 'match') return false;
    return st.sel !== null;
  }

  function barHtml() {
    var it = SES.items[SES.i], pct = it ? SES.ok / SES.total * 100 : 100;
    return '<div class="l-top"><button class="l-close" data-sact="quit" aria-label="Kapat">✕</button><div class="l-bar"><div class="l-track"></div><div class="l-fill" style="width:' + pct + '%"><div class="layers"></div></div><div class="l-head" style="left:' + Math.max(3, Math.min(97, pct)) + '%">' + headSvg(SES.color) + '</div></div>' +
      '<div class="combo' + (SES.combo >= 2 ? ' pop' : '') + '">' + (SES.combo >= 2 ? '🔥' + SES.combo : '') + '</div></div>';
  }
  function renderSession() {
    if (!SES) return;
    var it = SES.items[SES.i], h = barHtml();
    if (!it) { lessonEl.innerHTML = h + resultHtml(); return; }
    h += '<div class="l-body' + (it.shown ? '' : ' fresh') + '" id="lbody">'; it.shown = true;
    if (it.kind === 'teach') {
      h += '<div class="teach"><div class="who"><div class="nz">' + nozi(it.n === 1 ? 'happy' : 'idle') + T('</div><span class="tag">Nozi anlatıyor') + (it.of > 1 ? ' · ' + it.n + '/' + it.of : '') + '</span></div><div class="tcard"><h2>' + esc(it.t.title) + '</h2>' + (it.t.body ? '<div class="tbody">' + md(it.t.body) + '</div>' : '') + (it.t.code ? codeHtml(it.t.code) : '') +
        (SES.lesson && SES.lesson.doc && it.n === it.of ? '<a href="#" class="small" data-url="' + DOC + SES.lesson.doc + T('">📖 Wiki\'de bu konu ›</a>') : '') + '</div></div>';
      h += '</div><div class="l-foot"><button class="btn primary" data-sact="next">' + (it.n === it.of ? T('HADİ BAŞLAYALIM') : T('DEVAM')) + '</button></div>';
    } else {
      h += questionHtml(it) + '</div>';
      if (it.st.done) h += feedbackHtml(it);
      else if (it.q.t !== 'match') h += '<div class="l-foot"><button class="btn primary" data-sact="check"' + (canCheck(it) ? '' : ' disabled') + T('>KONTROL ET</button></div>');
      else h += T('<div class="l-foot"><button class="btn ghost" data-sact="skipmatch">BİLMİYORUM</button></div>');
    }
    lessonEl.innerHTML = h;
    var ti = lessonEl.querySelector('.type-in'); if (ti && !it.st.done) ti.focus();
  }

  var KIND = { mc: T('🎯 Doğru cevabı seç'), tf: T('⚖️ Doğru mu, yanlış mı?'), fill: T('🧩 Boşluğu doldur'), order: T('🪜 Doğru sıraya diz'), match: T('🔗 Eşleştir'), type: T('⌨️ Cevabı yaz') };
  function questionHtml(it) {
    var q = it.q, st = it.st, d = st.done, h = '';
    h += '<div class="q-kind">' + (q.log ? T('🚨 Arıza vakası') : KIND[q.t]) + (it.review ? T('<span class="rv">🔁 Eski konu: ') + esc(q.lesson.title) + '</span>' : '') + (it.retry ? T('<span class="rv" style="background:#3a1618;color:#ff8a8d">↺ Tekrar deneme</span>') : '') + '</div>';
    h += '<p class="q-text">' + esc(q.q) + '</p>';
    if (q.log) h += logHtml(q.log);
    if (q.code && q.t !== 'fill') h += codeHtml(q.code);
    if (q.t === 'mc') {
      var allCode = q.o.every(isCode);
      h += '<div class="opts">' + st.order.map(function (i) {
        var c = 'opt' + (allCode ? ' code' : '');
        if (d) { if (i === q.a) c += ' right'; else if (i === st.sel) c += ' wrong'; } else if (st.sel === i) c += ' sel';
        return '<button class="' + c + '" data-pick="' + i + '"' + (d ? ' disabled' : '') + '>' + esc(q.o[i]) + '</button>';
      }).join('') + '</div>';
    } else if (q.t === 'tf') {
      h += '<div class="tf opts">' + [[true, '👍', T('Doğru')], [false, '👎', T('Yanlış')]].map(function (o) {
        var c = 'opt';
        if (d) { if (o[0] === q.a) c += ' right'; else if (o[0] === st.sel) c += ' wrong'; } else if (st.sel === o[0]) c += ' sel';
        return '<button class="' + c + '" data-tf="' + o[0] + '"' + (d ? ' disabled' : '') + '><span class="em">' + o[1] + '</span>' + o[2] + '</button>';
      }).join('') + '</div>';
    } else if (q.t === 'fill') {
      h += codeHtml(q.code, '<span class="blank' + (st.sel ? ' filled' : '') + '">' + (st.sel ? esc(st.sel) : '&nbsp;?&nbsp;') + '</span>');
      h += '<div class="chips">' + st.order.map(function (o) { return '<button class="chip' + (st.sel === o ? ' sel' : '') + '" data-fill="' + esc(o) + '"' + (d ? ' disabled' : '') + '>' + esc(o) + '</button>'; }).join('') + '</div>';
    } else if (q.t === 'order') {
      h += '<div class="order-ans">' + (st.ans.length ? st.ans.map(function (i, k) {
        return '<button class="chip' + (st.mono ? '' : ' txt') + '" data-unord="' + k + '"' + (d ? ' disabled style="border-color:' + (i === k ? 'var(--green)' : 'var(--red)') + '"' : '') + '>' + esc(q.items[i]) + '</button>';
      }).join('') : T('<div class="ph">👇 Aşağıdan sırayla dokun</div>')) + '</div>';
      h += '<div class="order-bank">' + st.bank.map(function (i) { return '<button class="chip' + (st.ans.indexOf(i) >= 0 ? ' used' : '') + (st.mono ? '' : ' txt') + '" data-ord="' + i + '"' + (d ? ' disabled' : '') + '>' + esc(q.items[i]) + '</button>'; }).join('') + '</div>';
    } else if (q.t === 'match') {
      h += '<div class="match"><div class="col">' + q.pairs.map(function (p, i) { return '<button class="opt l' + (st.ok[i] ? ' ok' : '') + (st.l === i ? ' sel' : '') + (st.badL === i ? ' bad' : '') + '" data-ml="' + i + '">' + esc(p[0]) + '</button>'; }).join('') +
        '</div><div class="col">' + st.right.map(function (i) { return '<button class="opt' + (st.ok[i] ? ' ok' : '') + (st.badR === i ? ' bad' : '') + '" data-mr="' + i + '">' + esc(q.pairs[i][1]) + '</button>'; }).join('') + '</div></div>';
      if (st.mist && !d) h += '<p class="small muted" style="margin-top:12px;font-weight:800">' + st.mist + T(' hatalı eşleştirme</p>');
    } else if (q.t === 'type') {
      h += '<input class="type-in" id="typein" lang="en" value="' + esc(st.sel) + T('" placeholder="Buraya yaz…" autocomplete="off" autocorrect="off" autocapitalize="characters" spellcheck="false"') + (d ? ' disabled' : '') + '>';
      h += T('<p class="small muted" style="font-weight:700">İpucu: büyük/küçük harf ve fazla boşluk önemli değil.</p>');
    }
    return h;
  }
  function correctText(q) {
    switch (q.t) {
      case 'mc': return q.o[q.a]; case 'tf': return q.a ? T('Doğru') : T('Yanlış'); case 'fill': return q.code.replace('___', q.a);
      case 'order': return q.items.join('\n'); case 'match': return q.pairs.map(function (p) { return p[0] + ' → ' + p[1]; }).join('\n'); case 'type': return q.a[0];
    }
  }
  var PRAISE = [T('Harika!'), T('Süper!'), T('Aynen öyle!'), T('Mükemmel!'), T('Tam isabet!'), T('Ustasın!'), T('Nozul gibi keskin!')];
  var OOPS = [T('Az kaldı!'), T('Olur böyle şeyler'), T('Hmm, tam değil'), T('Bir dahakine!')];
  function feedbackHtml(it) {
    var ok = it.st.ok2, gain = it.st.gain;
    var h = '<div class="fb ' + (ok ? 'ok' : 'no') + '"><div class="fbh"><div class="nz">' + nozi(ok ? 'happy' : 'sad') + '</div><h4>' + (ok ? PRAISE[it.st.msg % PRAISE.length] : OOPS[it.st.msg % OOPS.length]) + '</h4>' + (ok && gain ? '<span class="xpg">+' + gain + ' XP</span>' : '') + '</div>';
    if (!ok) h += T('<div class="small" style="font-weight:900;color:#ffb3b5;margin-bottom:4px">Doğru cevap:</div><div class="ans">') + esc(correctText(it.q)) + '</div>';
    h += '<p>' + esc(it.q.e || '') + '</p>';
    if (!ok) h += '<a href="#" class="small" data-url="' + DOC + it.q.lesson.doc + T('" style="color:#ffb3b5">📖 Wiki\'de bu konu ›</a>');
    h += '<button class="btn primary" data-sact="cont">' + (ok ? T('DEVAM') : T('ANLADIM')) + '</button></div>';
    return h;
  }
  function norm(s) { return String(s).trim().toUpperCase().replace(/\s+/g, ' ').replace(/\s*=\s*/g, '=').replace(/\/+$/, ''); }
  function check(it) {
    var q = it.q, st = it.st, ok = false;
    if (q.t === 'mc' || q.t === 'tf' || q.t === 'fill') ok = st.sel === q.a;
    else if (q.t === 'order') ok = st.ans.every(function (v, k) { return v === k; });
    else if (q.t === 'type') ok = q.a.some(function (a) { return norm(a) === norm(st.sel); });
    else if (q.t === 'match') ok = st.mist === 0;
    finish(it, ok);
  }
  function finish(it, ok) {
    var st = it.st; st.done = true; st.ok2 = ok; st.msg = Math.floor(Math.random() * 100);
    var first = !(it.q.id in SES.firstTry);
    if (first) SES.firstTry[it.q.id] = ok;
    S.stats.answered++; if (ok) S.stats.correct++;
    if (first || !ok) grade(it.q.id, ok);
    else { var r = S.srs[it.q.id]; if (r) { r.due = Date.now() + DAY - 3 * 3600000; r.box = Math.max(r.box, 1); } }
    if (ok) {
      SES.combo++; SES.maxCombo = Math.max(SES.maxCombo, SES.combo); S.bestCombo = Math.max(S.bestCombo, SES.combo);
      var g = (first ? 10 : 5) + (SES.combo >= 5 ? 2 : 0); SES.xp += g; st.gain = g; SES.ok++;
      qEvent('combo', SES.combo, true); if (it.q.t === 'type') { qEvent('typed', 1); S.stats.typed++; }
      if (SES.mode === 'review') { qEvent('review', 1); S.stats.reviewQs++; }
      if ([3, 5, 10, 15, 20].indexOf(SES.combo) >= 0) { setTimeout(function () { SFX.combo(); toast('🔥', SES ? SES.combo + T(' üst üste doğru!') : ''); }, 250); }
      SFX.ok(); haptic('success');
    } else {
      SES.combo = 0; SES.wrongs++; SES.items.push({ kind: 'q', q: it.q, review: it.review, retry: true });
      SFX.no(); haptic('error');
    }
    save(); renderSession();
  }

  function resultHtml() {
    var ids = Object.keys(SES.firstTry), ok = ids.filter(function (id) { return SES.firstTry[id]; }).length, acc = ids.length ? ok / ids.length : 1;
    if (!SES.ended) {
      SES.ended = true; var bonus;
      if (SES.mode === 'lesson') {
        bonus = acc === 1 ? 20 : 10; var d = S.done[SES.lesson.id] || { best: 0, times: 0 };
        var firstTime = !S.done[SES.lesson.id];
        d.best = Math.max(d.best, acc); d.times++; S.done[SES.lesson.id] = d; S.stats.lessons++; qEvent('lesson', 1);
        if (acc === 1) { S.stats.perfect++; qEvent('perfect', 1); }
        SES.firstTime = firstTime;
      } else { bonus = 5; S.stats.reviews++; }
      SES.bonus = bonus; SES.xp += bonus;
      SES.streakGrew = addXp(SES.xp);
      SES.newBadges = checkBadges();
      SES.questsReady = readyQuests();
      save(); SFX.done(); haptic('success');
      setTimeout(confetti, 120);
    }
    var secs = Math.round((Date.now() - SES.start) / 1000);
    var title = SES.mode === 'review' ? T('Tekrar tamam!') : acc === 1 ? T('Kusursuz baskı!') : acc >= 0.8 ? T('Katman tamam!') : T('Bitti, aferin!');
    var h = '<div class="l-body"><div class="result"><div class="nz">' + nozi('cheer') + '</div><h2>' + title + '</h2>' +
      '<p class="muted" style="font-weight:800;margin:0">' + (SES.mode === 'lesson' ? esc(SES.lesson.title) : ids.length + T(' soru tekrar edildi')) + '</p>' +
      T('<div class="res-grid"><div style="border-color:#ffc53d"><span style="background:#ffc53d">Toplam XP</span><b style="color:#ffc53d" data-count="') + SES.xp + '">⚡0</b></div>' +
      T('<div style="border-color:#3ddc84"><span style="background:#3ddc84">Doğruluk</span><b style="color:#3ddc84">') + pct(Math.round(acc * 100)) + '</b></div>' +
      T('<div style="border-color:#4ea1ff"><span style="background:#4ea1ff">Süre</span><b style="color:#4ea1ff">') + Math.floor(secs / 60) + ':' + pad(secs % 60) + '</b></div></div>';
    if (SES.streakGrew) h += T('<div class="res-note"><span style="font-size:28px">🔥</span><div>Seri ') + curStreak() + T(' gün oldu!<div class="muted small">Yarın da gel, zinciri kırma.</div></div></div>');
    if (SES.maxCombo >= 5) h += T('<div class="res-note"><span style="font-size:28px">⚡</span><div>En uzun zincir: ') + SES.maxCombo + T(' doğru</div></div>');
    (SES.newBadges || []).forEach(function (b) { h += '<div class="res-note"><span style="font-size:28px">' + b.ic + T('</span><div>Yeni rozet: ') + b.n + '<div class="muted small">' + b.d + '</div></div></div>'; });
    if (SES.questsReady) h += '<div class="res-note"><span style="font-size:28px">🎁</span><div>' + SES.questsReady + T(' görev ödülü seni bekliyor<div class="muted small">Ana sayfada al</div></div></div>');
    if (SES.mode === 'lesson' && SES.lesson && unitDone(SES.lesson.unit) && !S.chests[SES.lesson.unit.id]) h += T('<div class="res-note"><span style="font-size:28px">🧱</span><div>Ünite bitti! Sandığını aç<div class="muted small">Yolun sonunda seni bekliyor</div></div></div>');
    h += '</div></div><div class="l-foot"><button class="btn primary" data-sact="close">DEVAM</button></div>';
    setTimeout(countUp, 60);
    return h;
  }
  function countUp() {
    var el = lessonEl && lessonEl.querySelector('[data-count]'); if (!el) return;
    var to = +el.getAttribute('data-count'), t0 = performance.now();
    (function f(t) { var p = Math.min(1, (t - t0) / 900), e = 1 - Math.pow(1 - p, 3); el.textContent = '⚡' + Math.round(to * e); if (p < 1) requestAnimationFrame(f); })(t0);
  }

  // ---------- Ödüller ----------
  function claimQuest(i) {
    var q = S.quests.list[i]; if (!q || q.c || qProg(q) < q.g) return;
    q.c = true; S.spools += 10; UI.bump = 'spool'; save(); SFX.chest(); haptic('success');
    var all = S.quests.list.every(function (x) { return x.c; });
    if (all) { S.spools += 20; save(); rewardModal('cheer', T('Bütün görevler tamam!'), '🧵 +30', T('Bugünkü üç görevi de bitirdin. Bonus makara kazandın.')); }
    else toast('🧵', T('+10 makara'));
    render();
  }
  function openChest(uid) {
    var u = UNITS.filter(function (x) { return x.id === uid; })[0];
    if (!u) return;
    if (S.chests[uid]) { toast('📭', T('Bu sandık zaten açıldı')); return; }
    if (!unitDone(u)) { toast('🔒', T('Önce ünitedeki bütün dersleri bitir')); return; }
    S.chests[uid] = true; S.spools += 30; addXp(20); UI.bump = 'spool'; var nb = checkBadges(); save(); SFX.chest(); haptic('success'); confetti();
    rewardModal('cheer', u.title + T(' basıldı!'), '🧵 +30  ⚡ +20', T('Bir üniteyi baştan sona bitirdin.') + (nb.length ? T(' Yeni rozet: ') + nb.map(function (b) { return b.ic + ' ' + b.n; }).join(', ') : ''));
    render();
  }
  function rewardModal(mood, title, reward, text) {
    var m = modal('<div class="nz">' + nozi(mood) + '</div><h3>' + esc(title) + '</h3><div class="reward">' + reward + '</div><p class="muted">' + esc(text) + T('</p><button class="btn primary" id="m-ok">SÜPER!</button>'));
    m.querySelector('#m-ok').onclick = closeModal;
  }

  // ---------- Olaylar ----------
  document.addEventListener('click', function (e) {
    var t = e.target.closest('button, a'); if (!t) return;
    var ds = t.dataset;
    if (ds.url) { e.preventDefault(); openUrl(ds.url); return; }
    if (t.tagName === 'A') e.preventDefault();
    if (SES && lessonEl && lessonEl.contains(t)) { sessionClick(t, ds); return; }
    if (ds.tab) {
      if (UI.tab !== ds.tab) SFX.tap();
      UI.tab = ds.tab; UI.focusRef = false;
      if (ds.tab === 'news') { markSeen(); if (!S.news.cache || Date.now() - S.news.cache.at > 3 * 3600000) refreshNews(true); } else UI.prevSeen = null;
      render(true); return;
    }
    if (ds.lesson) { SFX.tap(); haptic('light'); startLesson(LIDX[ds.lesson], !!S.done[ds.lesson]); return; }
    if (ds.claim != null) { claimQuest(+ds.claim); return; }
    if (ds.chest) { openChest(ds.chest); return; }
    if (ds.act === 'review') { startReview('due'); return; }
    if (ds.act === 'practice') { startReview('practice'); return; }
    if (ds.act === 'weak') { startReview('weak'); return; }
    if (ds.act === 'refresh') { refreshNews(false); return; }
    if (ds.act === 'sound') { S.sound = !S.sound; save(); if (S.sound) SFX.ok(); render(); return; }
    if (ds.act === 'buy') { if (S.spools >= 50 && S.freezes < 2) { S.spools -= 50; S.freezes++; save(); SFX.chest(); toast('🧊', T('Seri koruyucu alındı')); render(); } return; }
    if (ds.seg) { UI.newsSeg = ds.seg; render(); return; }
    if (ds.cat) { UI.refCat = ds.cat; render(); return; }
    if (ds.lang) { if (ds.lang !== LANG) { S.lang = ds.lang; save(); location.reload(); } return; }
    if (ds.goal) { S.goal = +ds.goal; if (S.quests) S.quests.list.forEach(function (q) { if (q.k === 'xp') q.g = S.goal; }); save(); render(); return; }
    if (ds.act === 'reset') {
      var m = modal('<div class="nz">' + nozi('sad') + T('</div><h3>İlerlemeyi sıfırla?</h3><p class="muted">XP, seri, dersler, rozetler ve tekrar geçmişi silinir. Geri alınamaz.</p><button class="btn danger" id="m-y">EVET, SIFIRLA</button><button class="btn ghost" id="m-n">VAZGEÇ</button>'));
      m.querySelector('#m-y').onclick = function () { var news = S.news, snd = S.sound; S = fresh(); S.news = news; S.sound = snd; S.lang = LANG; save(); closeModal(); render(true); };
      m.querySelector('#m-n').onclick = closeModal;
    }
  });

  function sessionClick(t, ds) {
    var it = SES.items[SES.i];
    if (ds.sact === 'quit') {
      if (!it) { closeSession(); return; }
      var m = modal('<div class="nz">' + nozi('sad') + T('</div><h3>Gidiyor musun?</h3><p class="muted">Bu dersin ilerlemesi kaydedilmez. Cevapladığın sorular tekrar listesine işlendi.</p><button class="btn primary" id="m-n">DEVAM ET</button><button class="btn ghost" id="m-y" style="color:var(--red)">ÇIK</button>'));
      m.querySelector('#m-y').onclick = function () { closeModal(); closeSession(); };
      m.querySelector('#m-n').onclick = closeModal; return;
    }
    if (ds.sact === 'close') { closeSession(); return; }
    if (ds.sact === 'next' || ds.sact === 'cont') { if (ds.sact === 'next') SES.ok++; SES.i++; prepItem(); renderSession(); var b = document.getElementById('lbody'); if (b) b.scrollTop = 0; return; }
    if (ds.sact === 'check') { if (canCheck(it)) check(it); return; }
    if (ds.sact === 'skipmatch') { it.st.mist = Math.max(1, it.st.mist); check(it); return; }
    if (!it || it.kind !== 'q' || it.st.done) return;
    var st = it.st, q = it.q;
    if (ds.pick != null) st.sel = +ds.pick;
    else if (ds.tf != null) st.sel = ds.tf === 'true';
    else if (ds.fill != null) st.sel = ds.fill;
    else if (ds.ord != null) { var i = +ds.ord; if (st.ans.indexOf(i) < 0) st.ans.push(i); }
    else if (ds.unord != null) st.ans.splice(+ds.unord, 1);
    else if (ds.ml != null) { st.l = +ds.ml; st.badL = st.badR = null; }
    else if (ds.mr != null) {
      var r = +ds.mr; if (st.l == null) return;
      if (st.l === r) { st.ok[r] = true; st.l = null; st.badL = st.badR = null; SFX.ok(); haptic('light'); }
      else { st.mist++; st.badL = st.l; st.badR = r; st.l = null; SFX.no(); haptic('error'); }
      if (Object.keys(st.ok).length === q.pairs.length) { check(it); return; }
      renderSession(); return;
    }
    SFX.tap(); haptic('light'); renderSession();
  }

  document.addEventListener('input', function (e) {
    if (e.target.id === 'refq') { UI.refQ = e.target.value; UI.focusRef = true; render(); }
    if (e.target.id === 'typein' && SES) { var it = SES.items[SES.i]; it.st.sel = e.target.value; var b = lessonEl.querySelector('[data-sact="check"]'); if (b) b.disabled = !canCheck(it); }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && SES && e.target.id === 'typein') { var it = SES.items[SES.i]; if (canCheck(it)) { e.preventDefault(); e.target.blur(); check(it); } }
  });
  document.addEventListener('visibilitychange', function () { if (!document.hidden && !SES) { render(); autoNews(); } });
  function autoNews() { var c = S.news.cache; if (!c || Date.now() - c.at > 6 * 3600000) refreshNews(true); }

  window.__klipperApp = { state: function () { return S; }, refreshNews: refreshNews, cur: function () { return SES && SES.items[SES.i]; } };
  render(true);
  setTimeout(autoNews, 900);
})();
