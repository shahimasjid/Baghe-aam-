// app.js - Full Interactive Logic: Theater Seating, Direct Faculty Approval, KPI Sync & Modal Fixes
var config = window.DataStore.get('sm_config', window.INITIAL_CONFIG);
var students = window.DataStore.get('sm_students', window.INITIAL_STUDENTS);
var prizes = window.DataStore.get('sm_prizes', window.INITIAL_PRIZES);
var faculties = window.DataStore.get('sm_faculties', window.INITIAL_FACULTIES);
var notices = window.DataStore.get('sm_notices', window.INITIAL_NOTICES);
var papers = window.DataStore.get('sm_papers', window.INITIAL_PAPERS);
var feedbacks = window.DataStore.get('sm_feedbacks', window.INITIAL_FEEDBACKS);
var session = getPersistentSession();

var prizeLayoutMode = 'grid';
var rosterLayoutMode = 'list';

window.dismissGreeting = function() {
  var overlay = document.getElementById('greeting-overlay');
  if (overlay) overlay.classList.add('hidden');
};

window.navigateTab = function(tabId) {
  var tabs = ['home', 'competitions', 'prizes', 'seerat-hub', 'model-papers', 'doc-lookup', 'results-public', 'feedback', 'printable', 'dashboard'];
  tabs.forEach(function(id) {
    var el = document.getElementById('tab-' + id);
    if (el) el.classList.add('hidden');
  });
  var target = document.getElementById('tab-' + tabId);
  if (target) target.classList.remove('hidden');
  window.scrollTo(0, 0);

  if (tabId === 'prizes') renderPrizesDisplay();
  if (tabId === 'seerat-hub') renderSeeratHubContent();
  if (tabId === 'dashboard') refreshDashboardState();
};

window.openModal = function(id) {
  var el = document.getElementById(id);
  if (el) { el.classList.remove('hidden'); el.classList.add('flex'); }
};

window.closeModal = function(id) {
  var el = document.getElementById(id);
  if (el) { el.classList.add('hidden'); el.classList.remove('flex'); }
};

window.addEventListener('DOMContentLoaded', function() {
  startLiveClock();
  renderPrayerTimes();
  renderNotices();
  renderModelPapers();
  renderPrizesDisplay();
  renderSeeratHubContent();
  syncConfigUI();
  updateAuthUI();
});

function startLiveClock() {
  var update = function() {
    var clockEl = document.getElementById('ist-live-clock');
    if (clockEl) {
      clockEl.innerText = new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: true }) + ' IST';
    }
  };
  update();
  setInterval(update, 1000);
}

function syncConfigUI() {
  var setText = function(id, val) {
    var el = document.getElementById(id);
    if (el) el.innerText = val;
  };
  var setVal = function(id, val) {
    var el = document.getElementById(id);
    if (el) el.value = val;
  };

  setText('txt-header-masjid', config.masjidTitle);
  setText('txt-header-sub', config.masjidSub);
  setText('txt-comp-title', config.compTitle);
  setText('txt-comp-subtitle', config.compSubtitle);
  setText('txt-badge-comp', config.compBadge);
  setText('txt-comp-desc', config.compDesc);
  setText('banner-exam-date-str', config.examDate);
  setText('banner-venue-str', config.examVenue);
  setText('txt-juma-announcement', config.jumaLine);
  setText('topbar-poc', config.pocContact);

  var dignitaryBox = document.getElementById('dignitaries-display-box');
  if (dignitaryBox) {
    var chiefHtml = config.dignitaries.chiefGuest ? 
      `<div class="flex items-center space-x-2.5 p-2.5 bg-black/25 rounded-lg border border-white/10">
        <div class="w-8 h-8 rounded-full bg-amber-500 text-emerald-950 flex items-center justify-center font-bold text-xs"><i class="fa-solid fa-microphone"></i></div>
        <div>
          <span class="text-[9px] text-amber-300 block font-bold uppercase">${config.dignitaries.chiefGuestTitle}</span>
          <strong class="text-white text-xs">${config.dignitaries.chiefGuest}</strong>
        </div>
      </div>` : '';

    dignitaryBox.innerHTML = `
      <div class="flex items-center space-x-2.5 p-2.5 bg-black/25 rounded-lg border border-white/10">
        <div class="w-8 h-8 rounded-full bg-amber-500 text-emerald-950 flex items-center justify-center font-bold text-xs"><i class="fa-solid fa-user-tie"></i></div>
        <div>
          <span class="text-[9px] text-amber-300 block font-bold uppercase">${config.dignitaries.patronTitle}</span>
          <strong class="text-white text-xs">${config.dignitaries.patron}</strong>
        </div>
      </div>
      ${chiefHtml}
    `;
  }

  setVal('cfg-masjid-title', config.masjidTitle);
  setVal('cfg-date-time', config.examDate);
  setVal('cfg-prep-time', config.prepTime);
  setVal('cfg-exam-time', config.examTime);
  setVal('cfg-poc', config.pocContact);
  setVal('cfg-masjid-contact', config.masjidContact);
  setVal('cfg-venue', config.examVenue);
  setVal('cfg-dignitary-patron', config.dignitaries.patron);
  setVal('cfg-dignitary-guest', config.dignitaries.chiefGuest || '');
}

function renderPrayerTimes() {
  var container = document.getElementById('prayer-time-table');
  if (!container) return;
  container.innerHTML = config.prayers.map(function(p) {
    return '<div class="flex justify-between items-center py-1.5 border-b border-slate-100 text-xs">' +
      '<span class="font-bold text-slate-800">' + p.name + '</span>' +
      '<span class="text-emerald-800 font-mono font-bold">Iqama: ' + p.iqama + '</span>' +
    '</div>';
  }).join('');
}

function renderNotices() {
  var el = document.getElementById('home-notices-container');
  if (!el) return;
  el.innerHTML = notices.map(function(n) {
    return '<div class="p-2.5 bg-amber-50/70 border border-amber-200 rounded-lg">' +
      '<div class="flex justify-between font-bold text-slate-900">' +
        '<span>' + n.title + '</span>' +
        '<span class="text-[10px] text-amber-700 font-normal">' + n.date + '</span>' +
      '</div>' +
      '<p class="text-[11px] text-slate-600 mt-1">' + n.desc + '</p>' +
    '</div>';
  }).join('');
}

function renderModelPapers() {
  var el = document.getElementById('model-papers-list');
  if (!el) return;
  el.innerHTML = papers.map(function(p) {
    return '<div class="p-4 bg-slate-50 border rounded-lg flex justify-between items-center">' +
      '<div>' +
        '<h4 class="font-bold text-sm text-slate-800">' + p.title + '</h4>' +
        '<span class="text-xs text-amber-700 font-semibold">Edition Year: ' + p.year + '</span>' +
      '</div>' +
      '<a href="' + p.url + '" target="_blank" class="bg-emerald-950 text-amber-300 px-3 py-1.5 rounded text-xs font-bold hover:bg-emerald-900">' +
        '<i class="fa-solid fa-download mr-1"></i> Download' +
      '</a>' +
    '</div>';
  }).join('');
}

// ----------------------------------------------------
// PRIZES GALLERY DISPLAY
// ----------------------------------------------------
window.switchPrizeLayout = function(mode) {
  prizeLayoutMode = mode;
  var btnGrid = document.getElementById('btn-prize-grid');
  var btnList = document.getElementById('btn-prize-list');
  if (btnGrid && btnList) {
    if (mode === 'grid') {
      btnGrid.className = 'px-3 py-1 rounded font-bold bg-white text-emerald-950 shadow-sm';
      btnList.className = 'px-3 py-1 rounded font-bold text-slate-600 hover:text-emerald-950';
    } else {
      btnList.className = 'px-3 py-1 rounded font-bold bg-white text-emerald-950 shadow-sm';
      btnGrid.className = 'px-3 py-1 rounded font-bold text-slate-600 hover:text-emerald-950';
    }
  }
  renderPrizesDisplay();
};

function renderPrizesDisplay() {
  var container = document.getElementById('prize-winners-display');
  if (!container) return;

  if (prizeLayoutMode === 'grid') {
    container.className = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4';
    container.innerHTML = prizes.map(function(p) {
      return '<div class="p-4 bg-gradient-to-br from-white to-amber-50/40 rounded-xl border border-amber-200/80 shadow-sm flex flex-col justify-between">' +
        '<div>' +
          '<div class="flex justify-between items-center mb-2">' +
            '<span class="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-500 text-emerald-950">' + p.rank + '</span>' +
            '<span class="font-mono text-xs font-bold text-red-600">' + p.ht + '</span>' +
          '</div>' +
          '<h3 class="font-bold text-slate-900 text-sm">' + p.name + '</h3>' +
          '<span class="text-[11px] text-emerald-900 font-semibold">' + p.category + '</span>' +
        '</div>' +
        '<div class="mt-4 pt-3 border-t border-amber-200 flex items-center gap-2">' +
          '<div class="w-8 h-8 rounded-lg bg-emerald-950 text-amber-400 flex items-center justify-center font-bold text-sm">' +
            '<i class="fa-solid fa-' + (p.icon || 'trophy') + '"></i>' +
          '</div>' +
          '<div>' +
            '<span class="text-[10px] text-slate-400 block uppercase font-bold">Allocated Award</span>' +
            '<span class="text-xs font-bold text-emerald-950">' + p.prize + '</span>' +
          '</div>' +
        '</div>' +
      '</div>';
    }).join('');
  } else {
    container.className = 'overflow-x-auto border rounded-xl bg-white shadow-sm';
    container.innerHTML = '<table class="w-full text-xs text-left">' +
      '<thead class="bg-slate-100 uppercase text-[10px] text-slate-600 border-b">' +
        '<tr><th class="p-3">Rank</th><th class="p-3">Candidate</th><th class="p-3">Hall Ticket</th><th class="p-3">Category</th><th class="p-3">Prize Item</th></tr>' +
      '</thead>' +
      '<tbody class="divide-y">' +
        prizes.map(function(p) {
          return '<tr>' +
            '<td class="p-3 font-bold text-amber-700">' + p.rank + '</td>' +
            '<td class="p-3 font-bold text-slate-900">' + p.name + '</td>' +
            '<td class="p-3 font-mono text-red-600 font-bold">' + p.ht + '</td>' +
            '<td class="p-3">' + p.category + '</td>' +
            '<td class="p-3 font-bold text-emerald-950">' + p.prize + '</td>' +
          '</tr>';
        }).join('') +
      '</tbody>' +
    '</table>';
  }
}

// ----------------------------------------------------
// SEERAT-UN-NABI ﷺ KNOWLEDGE HUB
// ----------------------------------------------------
window.renderSeeratHubContent = function() {
  var langSelect = document.getElementById('seerat-lang-select');
  var lang = langSelect ? langSelect.value : 'en';
  var data = window.SEERAT_COMPREHENSIVE_TEXT[lang] || window.SEERAT_COMPREHENSIVE_TEXT['en'];
  var container = document.getElementById('seerat-hub-container');
  if (!container) return;

  var isRtl = lang === 'ar' ? 'dir="rtl" text-right font-arabic' : '';

  container.innerHTML = '<div class="' + isRtl + ' space-y-6">' +
    '<div class="p-5 bg-gradient-to-br from-amber-50 to-emerald-50 rounded-xl border border-amber-300 space-y-3">' +
      '<div class="flex justify-between items-center border-b border-amber-200 pb-2">' +
        '<h3 class="text-base font-bold text-emerald-950 flex items-center gap-2">' +
          '<i class="fa-solid fa-tree text-amber-600"></i> ' + data.lineageHeader +
        '</h3>' +
        '<span class="text-[10px] font-bold bg-amber-500 text-emerald-950 px-2 py-0.5 rounded">' + data.wordCount + '</span>' +
      '</div>' +
      '<div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs leading-relaxed">' +
        '<p><strong>Father:</strong> ' + data.father + '</p>' +
        '<p><strong>Mother:</strong> ' + data.mother + '</p>' +
        '<p><strong>Grandfather:</strong> ' + data.grandfather + '</p>' +
        '<p><strong>Protective Uncle:</strong> ' + data.uncle + '</p>' +
        '<p class="md:col-span-2"><strong>Blessed Wives (Ummahat-ul-Momineen):</strong> ' + data.wives + '</p>' +
        '<p class="md:col-span-2"><strong>Blessed Sons:</strong> ' + data.sons + '</p>' +
        '<p class="md:col-span-2"><strong>Blessed Daughters:</strong> ' + data.daughters + '</p>' +
      '</div>' +
    '</div>' +

    '<div class="p-6 bg-white border border-slate-200 rounded-xl shadow-sm space-y-4 text-xs md:text-sm leading-relaxed text-slate-800">' +
      '<h3 class="text-base font-bold text-emerald-950 flex items-center gap-2 border-b pb-2">' +
        '<i class="fa-solid fa-feather-pointed text-emerald-800"></i> ' + data.title +
      '</h3>' +
      '<div class="prose max-w-none space-y-3 text-justify">' +
        data.narrative.split('\n\n').map(function(paragraph) {
          return '<p class="leading-relaxed">' + paragraph + '</p>';
        }).join('') +
      '</div>' +
    '</div>' +
  '</div>';
};

// ----------------------------------------------------
// AUTHENTICATION & MULTI-ROLE MODAL / HEADER LOGIC
// ----------------------------------------------------
function saveSession(user, remember24h) {
  var expiry = new Date().getTime() + (remember24h ? 24 * 3600 * 1000 : 2 * 3600 * 1000);
  var sessionObj = { user: user, expiry: expiry };
  localStorage.setItem('sm_session', JSON.stringify(sessionObj));
  session = sessionObj;
  updateAuthUI();
  refreshDashboardState();
}

function getPersistentSession() {
  var raw = localStorage.getItem('sm_session');
  if (!raw) return null;
  try {
    var s = JSON.parse(raw);
    if (new Date().getTime() > s.expiry) {
      localStorage.removeItem('sm_session');
      return null;
    }
    return s;
  } catch (e) { return null; }
}

window.handleSessionLogout = function() {
  localStorage.removeItem('sm_session');
  session = null;
  updateAuthUI();
  refreshDashboardState();
  window.navigateTab('home');
};

function updateAuthUI() {
  var slot = document.getElementById('nav-auth-slot');
  if (!slot) return;
  if (session && session.user) {
    slot.innerHTML = '<button onclick="navigateTab(\'dashboard\')" class="bg-amber-500 hover:bg-amber-400 text-emerald-950 px-3.5 py-1.5 rounded-lg font-bold shadow">' +
      'Dashboard (' + session.user.name + ')' +
    '</button>';
  } else {
    slot.innerHTML = '<button onclick="openModal(\'modal-auth\')" class="bg-emerald-950 text-amber-300 px-4 py-1.5 rounded-lg font-bold border border-amber-500/60 hover:bg-emerald-900 shadow">' +
      '<i class="fa-solid fa-right-to-bracket mr-1.5 text-amber-400"></i> Central Portal Sign In' +
    '</button>';
  }
}

window.setModalRoleHint = function(role) {
  document.getElementById('modal-login-role-hint').value = role;
  ['student', 'faculty', 'admin', 'super'].forEach(function(r) {
    var btn = document.getElementById('role-hint-' + r);
    if (btn) btn.className = (r === role) ? 'flex-1 py-1.5 rounded-lg bg-white text-emerald-950 font-bold shadow-sm' : 'flex-1 py-1.5 rounded-lg text-slate-600 font-bold';
  });

  var facRegisterToggle = document.getElementById('modal-faculty-reg-toggle');
  var facRegForm = document.getElementById('modal-faculty-registration-pane');
  var loginForm = document.getElementById('modal-login-form');

  if (role === 'faculty') {
    if (facRegisterToggle) facRegisterToggle.classList.remove('hidden');
  } else {
    if (facRegisterToggle) facRegisterToggle.classList.add('hidden');
    if (facRegForm) facRegForm.classList.add('hidden');
    if (loginForm) loginForm.classList.remove('hidden');
  }

  var lbl = document.getElementById('modal-login-label-id');
  if (lbl) {
    if (role === 'student') lbl.innerText = 'Mobile Number / Hall Ticket ID';
    else if (role === 'faculty') lbl.innerText = 'Faculty Username (e.g. Faculty1) or Phone';
    else if (role === 'admin') lbl.innerText = 'Admin Username (Default: Admin1)';
    else lbl.innerText = 'Super Admin Username (Default: Admin)';
  }
};

window.toggleFacultyModalRegistration = function(showReg) {
  var loginForm = document.getElementById('modal-login-form');
  var regForm = document.getElementById('modal-faculty-registration-pane');
  if (showReg) {
    loginForm.classList.add('hidden');
    regForm.classList.remove('hidden');
  } else {
    regForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
  }
};

window.handleUniversalLogin = function(e) {
  e.preventDefault();
  var id = document.getElementById('modal-login-id').value.trim();
  var pwd = document.getElementById('modal-login-pwd').value.trim();
  var role = document.getElementById('modal-login-role-hint').value;

  executeAuthentication(id, pwd, role);
};

function executeAuthentication(id, pwd, roleHint) {
  // Super Admin Check
  if (id === 'Admin' && pwd === '9290') {
    saveSession({ id: 'Admin', name: 'Super Admin Maintenance', role: 'super_admin' }, true);
    window.closeModal('modal-auth');
    window.navigateTab('dashboard');
    return;
  }

  // Admin Check
  if (id === 'Admin1' && pwd === '2580') {
    saveSession({ id: 'Admin1', name: 'Admin Exam Coordinator', role: 'admin' }, true);
    window.closeModal('modal-auth');
    window.navigateTab('dashboard');
    return;
  }

  // Faculty Check
  var fac = faculties.find(function(f) { 
    return f.phone === id || f.email === id || f.id === id || (f.username && f.username.toLowerCase() === id.toLowerCase()); 
  });

  if (fac) {
    if (fac.status === 'Denied' || fac.status === 'Blocked') {
      alert('Access Denied: Your faculty account access has been revoked or denied.');
      return;
    }
    if (fac.status === 'Pending') {
      alert('Account Pending: Your faculty registration is awaiting official approval from Admin or Super Admin.');
      return;
    }
    if (fac.password === pwd) {
      saveSession({ id: fac.id, name: fac.name, role: 'faculty', data: fac }, true);
      window.closeModal('modal-auth');
      window.navigateTab('dashboard');
      return;
    } else {
      alert('Invalid Faculty Password.');
      return;
    }
  }

  // Student Check
  var std = students.find(function(s) { return s.ticketNo === id || s.phone === id || s.email === id; });
  if (std) {
    if (std.status === 'Denied' || std.status === 'Blocked') {
      alert('Access Denied: Your registration has been blocked or denied.');
      return;
    }
    if (std.password === pwd || pwd === '1234') {
      saveSession({ id: std.ticketNo, name: std.name, role: 'student', data: std }, true);
      window.closeModal('modal-auth');
      window.navigateTab('dashboard');
      return;
    }
  }

  alert('Authentication Failed: Check credentials or register if you are a new applicant.');
}

// ----------------------------------------------------
// EXECUTIVE DASHBOARD REFRESHER & METRICS
// ----------------------------------------------------
function refreshDashboardState() {
  var isAuth = session && session.user;
  var unauthPrompt = document.getElementById('dashboard-unauth-prompt');
  var authContent = document.getElementById('dashboard-authenticated-content');

  if (!isAuth) {
    if (unauthPrompt) unauthPrompt.classList.remove('hidden');
    if (authContent) authContent.classList.add('hidden');
    return;
  }

  if (unauthPrompt) unauthPrompt.classList.add('hidden');
  if (authContent) authContent.classList.remove('hidden');

  var role = session.user.role;
  document.getElementById('dash-user-name').innerText = 'Welcome, ' + session.user.name;

  var pill = document.getElementById('dash-role-pill');
  pill.innerText = role.replace('_', ' ');
  pill.className = 'text-[10px] font-black uppercase px-3 py-1 rounded-full ' +
    (role === 'super_admin' ? 'bg-red-100 text-red-700 border border-red-200' : role === 'admin' ? 'bg-amber-100 text-amber-800 border border-amber-200' : role === 'faculty' ? 'bg-purple-100 text-purple-800 border border-purple-200' : 'bg-emerald-100 text-emerald-800 border border-emerald-200');

  // KPI Statistics
  document.getElementById('stat-total-students').innerText = students.length;
  document.getElementById('stat-present-count').innerText = students.filter(function(s) { return s.attendance === 'Present'; }).length;
  document.getElementById('stat-faculty-count').innerText = faculties.filter(function(f) { return f.status === 'Approved'; }).length;
  document.getElementById('stat-release-state').innerText = config.resultsPublished ? 'Published' : 'Under Lock';

  document.getElementById('dash-section-student').classList.toggle('hidden', role !== 'student');
  document.getElementById('dash-section-faculty').classList.toggle('hidden', role !== 'faculty');
  document.getElementById('dash-section-management').classList.toggle('hidden', role !== 'admin' && role !== 'super_admin');
  document.getElementById('super-admin-master-card').classList.toggle('hidden', role !== 'super_admin');

  if (role === 'student') {
    renderStudentProfileFeatures();
  } else if (role === 'faculty') {
    renderFacultyDashboard();
  } else {
    renderManagementDashboard();
  }
}

// ----------------------------------------------------
// 10 ADVANCED STUDENT FEATURES (WITH OMR & RESULTS)
// ----------------------------------------------------
function renderStudentProfileFeatures() {
  var cand = students.find(function(s) { return s.ticketNo === session.user.id; }) || session.user.data;
  var container = document.getElementById('student-features-grid');
  if (!container) return;

  var resultsCardHTML = config.resultsPublished ? `
    <div class="p-4 bg-emerald-50 border border-emerald-300 rounded-xl flex flex-col justify-between">
      <div>
        <i class="fa-solid fa-square-poll-vertical text-emerald-700 text-2xl mb-2"></i>
        <h4 class="font-bold text-slate-900 text-sm">7. Official Examination Result</h4>
        <p class="text-xs text-slate-600 mt-1">Score: <strong class="text-emerald-950 font-bold font-mono">${cand.marks || 0}/100</strong></p>
        <p class="text-xs text-amber-800 font-semibold mt-0.5">Award: ${cand.prize || 'Participant'}</p>
      </div>
      <span class="text-[10px] text-emerald-800 font-bold mt-2">Released by Central Board</span>
    </div>
  ` : `
    <div class="p-4 bg-slate-50 border rounded-xl flex flex-col justify-between">
      <div>
        <i class="fa-solid fa-hourglass-half text-amber-600 text-2xl mb-2"></i>
        <h4 class="font-bold text-slate-900 text-sm">7. Examination Result</h4>
        <p class="text-xs text-slate-500 mt-1">Verification Status: <span class="font-bold text-slate-700">${cand.resultVerified ? 'Verified by Faculty' : 'Under Evaluation'}</span></p>
        <p class="text-xs text-amber-800 font-semibold mt-0.5">Awaiting 1-Click Release by Admin</p>
      </div>
      <span class="text-[10px] text-slate-400 font-semibold mt-2">Official Release Pending</span>
    </div>
  `;

  container.innerHTML = `
    <!-- 1. Digital Islamic Participation Certificate -->
    <div class="p-4 bg-amber-50 border border-amber-300 rounded-xl flex flex-col justify-between">
      <div>
        <i class="fa-solid fa-certificate text-amber-700 text-2xl mb-2"></i>
        <h4 class="font-bold text-slate-900 text-sm">1. Islamic Participation Certificate</h4>
        <p class="text-xs text-slate-600 mt-1">Official certificate with Arabic Hadith, candidate particulars & official Madarsa seal.</p>
      </div>
      <button onclick="generateParticipationCertificate('${cand.ticketNo}')" class="mt-3 bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 rounded text-xs shadow">
        Generate Certificate
      </button>
    </div>

    <!-- 2. Official Hall Ticket Admit Card -->
    <div class="p-4 bg-emerald-50 border border-emerald-300 rounded-xl flex flex-col justify-between">
      <div>
        <i class="fa-solid fa-id-badge text-emerald-800 text-2xl mb-2"></i>
        <h4 class="font-bold text-slate-900 text-sm">2. Official Hall Ticket Admit Card</h4>
        <p class="text-xs text-slate-600 mt-1">Allocated Desk: <strong class="text-emerald-900 font-mono">${cand.seat || 'Assigned by Gate Incharge'}</strong></p>
      </div>
      <button onclick="displayHallTicket(getStudent('${cand.ticketNo}'))" class="mt-3 bg-emerald-950 hover:bg-emerald-900 text-amber-300 font-bold py-2 rounded text-xs shadow">
        View Admit Card
      </button>
    </div>

    <!-- 3. Professional Candidate OMR Sheet -->
    <div class="p-4 bg-purple-50 border border-purple-300 rounded-xl flex flex-col justify-between">
      <div>
        <i class="fa-solid fa-table-cells text-purple-800 text-2xl mb-2"></i>
        <h4 class="font-bold text-slate-900 text-sm">3. Standard Examination OMR Sheet</h4>
        <p class="text-xs text-slate-600 mt-1">Pre-filled bio grid, roll bubbling matrix & 100-question answer response sheet.</p>
      </div>
      <button onclick="generateSingleOMR('${cand.ticketNo}')" class="mt-3 bg-purple-900 hover:bg-purple-800 text-white font-bold py-2 rounded text-xs shadow">
        Download My OMR Sheet
      </button>
    </div>

    <!-- 4. Seating Coordinate Finder -->
    <div class="p-4 bg-blue-50 border border-blue-300 rounded-xl flex flex-col justify-between">
      <div>
        <i class="fa-solid fa-location-dot text-blue-700 text-2xl mb-2"></i>
        <h4 class="font-bold text-slate-900 text-sm">4. Seating Coordinate Finder</h4>
        <p class="text-xs text-slate-600 mt-1">Verify assigned row and aisle desk coordinates in Hall A or Hall B.</p>
      </div>
      <button onclick="alert('Your Desk Location: ' + '${cand.seat || 'Pending Allotment by Admin'}')" class="mt-3 bg-blue-800 hover:bg-blue-900 text-white font-bold py-2 rounded text-xs">
        Locate Desk
      </button>
    </div>

    <!-- 5. Seerat Reference Hub (500+ Words) -->
    <div class="p-4 bg-slate-50 border rounded-xl flex flex-col justify-between">
      <div>
        <i class="fa-solid fa-book-open text-emerald-900 text-2xl mb-2"></i>
        <h4 class="font-bold text-slate-900 text-sm">5. Seerat Reference Hub</h4>
        <p class="text-xs text-slate-600 mt-1">Comprehensive biography, lineage, and exam study modules in 3 languages.</p>
      </div>
      <button onclick="navigateTab('seerat-hub')" class="mt-3 bg-slate-800 hover:bg-slate-900 text-white font-bold py-2 rounded text-xs">
        Study Hub
      </button>
    </div>

    <!-- 6. Model Papers & Exam Pattern -->
    <div class="p-4 bg-slate-50 border rounded-xl flex flex-col justify-between">
      <div>
        <i class="fa-solid fa-file-pdf text-red-600 text-2xl mb-2"></i>
        <h4 class="font-bold text-slate-900 text-sm">6. Model Papers & Pattern</h4>
        <p class="text-xs text-slate-600 mt-1">Download official model question papers & past syllabi.</p>
      </div>
      <button onclick="navigateTab('model-papers')" class="mt-3 bg-slate-800 hover:bg-slate-900 text-white font-bold py-2 rounded text-xs">
        Download Papers
      </button>
    </div>

    <!-- 7. Dynamic Result Status -->
    ${resultsCardHTML}

    <!-- 8. Live Attendance Status -->
    <div class="p-4 bg-slate-50 border rounded-xl flex flex-col justify-between">
      <div>
        <i class="fa-solid fa-user-check text-indigo-700 text-2xl mb-2"></i>
        <h4 class="font-bold text-slate-900 text-sm">8. Live Attendance Status</h4>
        <p class="text-xs text-slate-600 mt-1">Status: <span class="font-bold text-emerald-800">${cand.attendance || 'Pending Marking'}</span></p>
      </div>
      <span class="text-[11px] text-slate-400 font-semibold mt-3">Verified by Hall Invigilators</span>
    </div>

    <!-- 9. Committee Helpdesk -->
    <div class="p-4 bg-slate-50 border rounded-xl flex flex-col justify-between">
      <div>
        <i class="fa-solid fa-comments text-teal-700 text-2xl mb-2"></i>
        <h4 class="font-bold text-slate-900 text-sm">9. Support Helpdesk</h4>
        <p class="text-xs text-slate-600 mt-1">Direct inquiries dispatched to Mosque Committee with WhatsApp & Email replies.</p>
      </div>
      <button onclick="navigateTab('feedback')" class="mt-3 bg-teal-800 hover:bg-teal-900 text-white font-bold py-2 rounded text-xs">
        Submit Query
      </button>
    </div>

    <!-- 10. Verified Application Dossier -->
    <div class="p-4 bg-slate-50 border rounded-xl flex flex-col justify-between">
      <div>
        <i class="fa-solid fa-file-contract text-slate-700 text-2xl mb-2"></i>
        <h4 class="font-bold text-slate-900 text-sm">10. Verified Application Dossier</h4>
        <p class="text-xs text-slate-600 mt-1">Formal enrollment application with DOB and verified identity proof record.</p>
      </div>
      <button onclick="displayApplicationForm(getStudent('${cand.ticketNo}'))" class="mt-3 bg-slate-800 hover:bg-slate-900 text-white font-bold py-2 rounded text-xs">
        View Dossier
      </button>
    </div>
  `;
}

// ----------------------------------------------------
// FACULTY REGISTRATION & DASHBOARD
// ----------------------------------------------------
window.handleFacultyRegister = function(e) {
  e.preventDefault();
  var name = document.getElementById('fac-reg-name').value.trim();
  var email = document.getElementById('fac-reg-email').value.trim();
  var phone = document.getElementById('fac-reg-phone').value.trim();
  var pwd = document.getElementById('fac-reg-pwd').value.trim();
  var dept = document.getElementById('fac-reg-dept').value;
  var hall = document.getElementById('fac-reg-hall').value;

  if (faculties.some(function(f) { return f.phone === phone || f.email === email; })) {
    alert('A faculty application with this phone number or email already exists.');
    return;
  }

  var fac = {
    id: "FAC-" + (faculties.length + 101),
    name: name,
    email: email,
    phone: phone,
    username: phone,
    password: pwd,
    dept: dept,
    assignedHall: hall,
    status: "Pending",
    role: "faculty",
    registeredDate: new Date().toLocaleDateString('en-IN')
  };

  faculties.push(fac);
  window.DataStore.set('sm_faculties', faculties);
  alert('Registration Submitted Successfully!\nYour faculty profile is currently PENDING approval from Admin or Super Admin.');
  document.getElementById('modal-faculty-reg-form').reset();
  toggleFacultyModalRegistration(false);
};

function renderFacultyDashboard() {
  var fac = session.user.data || faculties.find(function(f) { return f.id === session.user.id; });
  var hallBadge = document.getElementById('faculty-assigned-hall');
  if (hallBadge) hallBadge.innerText = fac ? fac.assignedHall : 'Central Exam Hall';
  renderFacultyAttendanceTable();
}

function renderFacultyAttendanceTable() {
  var tbody = document.getElementById('faculty-attendance-tbody');
  if (!tbody) return;

  if (students.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="p-4 text-center text-slate-400">No candidates currently enrolled.</td></tr>';
    return;
  }

  tbody.innerHTML = students.map(function(s, idx) {
    return '<tr class="hover:bg-slate-50 text-xs">' +
      '<td class="p-2.5 font-mono font-bold text-red-600">' + s.ticketNo + '</td>' +
      '<td class="p-2.5 font-semibold text-slate-900">' + s.name + ' (' + s.category + ')</td>' +
      '<td class="p-2.5 font-bold text-emerald-800">' + (s.seat || 'Unassigned') + '</td>' +
      '<td class="p-2.5">' +
        '<select onchange="updateAttendance(' + idx + ', this.value)" class="border rounded p-1 text-xs font-bold ' +
          (s.attendance === 'Present' ? 'text-emerald-700 bg-emerald-50 border-emerald-300' : s.attendance === 'Absent' ? 'text-red-700 bg-red-50 border-red-300' : 'text-amber-700 bg-amber-50 border-amber-300') + '">' +
          '<option value="Present" ' + (s.attendance === 'Present' ? 'selected' : '') + '>Present</option>' +
          '<option value="Absent" ' + (s.attendance === 'Absent' ? 'selected' : '') + '>Absent</option>' +
          '<option value="Not Interested" ' + (s.attendance === 'Not Interested' ? 'selected' : '') + '>Not Interested</option>' +
        '</select>' +
      '</td>' +
      '<td class="p-2.5 space-x-1 text-center">' +
        '<button onclick="generateSingleOMR(\'' + s.ticketNo + '\')" class="bg-purple-900 text-white px-2 py-1 rounded text-[10px] font-bold"><i class="fa-solid fa-table-cells mr-1"></i> OMR</button>' +
        '<button onclick="facultyVerifyResult(' + idx + ')" class="px-2 py-1 rounded text-[10px] font-bold ' + (s.resultVerified ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700') + '">' +
          (s.resultVerified ? '<i class="fa-solid fa-check mr-1"></i> Verified' : 'Verify Result') +
        '</button>' +
      '</td>' +
    '</tr>';
  }).join('');
}

window.updateAttendance = function(idx, val) {
  students[idx].attendance = val;
  window.DataStore.set('sm_students', students);
  refreshDashboardState();
};

window.facultyVerifyResult = function(idx) {
  students[idx].resultVerified = !students[idx].resultVerified;
  window.DataStore.set('sm_students', students);
  renderFacultyAttendanceTable();
  renderManagementRoster();
};

// ----------------------------------------------------
// 15 ADVANCED MANAGEMENT FEATURES (DATA SYNC, EXCEL, OMR & SEATING)
// ----------------------------------------------------
function renderManagementDashboard() {
  renderManagementRoster();
  renderDynamicSeatingMatrix();
  renderFacultyApprovalQueue();
  renderFeedbackManagement();
  syncConfigUI();

  var resBtn = document.getElementById('btn-toggle-results-release');
  if (resBtn) {
    resBtn.innerText = config.resultsPublished ? 'Results Released Globally (Click to Lock)' : '1-Click: Release Results Globally';
    resBtn.className = config.resultsPublished ? 'bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded text-xs shadow' : 'bg-amber-600 hover:bg-amber-700 text-white font-bold px-3 py-1.5 rounded text-xs shadow';
  }
}

// 1. 1-CLICK EXCEL / CSV DATA EXPORT
window.exportStudentsToExcel = function() {
  if (students.length === 0) return alert('No registered students to export.');
  var headers = ['Application ID', 'Hall Ticket No', 'Candidate Name', 'Father Name', 'DOB', 'Mobile Phone', 'Email', 'Category', 'Gender', 'Assigned Seat', 'Exam Attendance', 'Marks', 'Prize Awarded', 'Status', 'Result Verified'];
  var rows = students.map(function(s) {
    return [
      s.appId,
      s.ticketNo,
      '"' + s.name.replace(/"/g, '""') + '"',
      '"' + s.father.replace(/"/g, '""') + '"',
      s.dob,
      s.phone,
      s.email || 'N/A',
      s.category,
      s.gender,
      '"' + (s.seat || 'Unassigned') + '"',
      s.attendance || 'Pending',
      s.marks || 0,
      '"' + (s.prize || 'None') + '"',
      s.status,
      s.resultVerified ? 'YES' : 'NO'
    ];
  });

  var csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), rows.map(function(e) { return e.join(','); }).join('\n')].join('\n');
  var encodedUri = encodeURI(csvContent);
  var link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', 'Seerat_Competition_Students_' + new Date().toISOString().slice(0,10) + '.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// 2. 1-CLICK DATABASE BACKUP & RESTORE
window.backupDatabaseToJSON = function() {
  var backupData = {
    version: '4.5',
    exportDate: new Date().toISOString(),
    config: config,
    students: students,
    prizes: prizes,
    faculties: faculties,
    notices: notices,
    feedbacks: feedbacks
  };

  var blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = 'Seerat_Madarsa_Backup_' + new Date().toISOString().slice(0,10) + '.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

window.triggerRestoreDatabase = function() {
  document.getElementById('file-restore-input').click();
};

window.handleDatabaseRestoreFile = function(e) {
  var file = e.target.files[0];
  if (!file) return;

  var reader = new FileReader();
  reader.onload = function(evt) {
    try {
      var data = JSON.parse(evt.target.result);
      if (data.students && data.config) {
        config = data.config;
        students = data.students;
        prizes = data.prizes || window.INITIAL_PRIZES;
        faculties = data.faculties || [];
        feedbacks = data.feedbacks || [];
        
        window.DataStore.set('sm_config', config);
        window.DataStore.set('sm_students', students);
        window.DataStore.set('sm_prizes', prizes);
        window.DataStore.set('sm_faculties', faculties);
        window.DataStore.set('sm_feedbacks', feedbacks);

        syncConfigUI();
        renderPrayerTimes();
        refreshDashboardState();
        renderPrizesDisplay();
        alert('Data Synchronized Successfully! Portal database restored completely.');
      } else {
        alert('Invalid Backup File Format.');
      }
    } catch (err) {
      alert('Error parsing JSON backup file.');
    }
  };
  reader.readAsText(file);
};

// 3. 1-CLICK GLOBAL RESULT RELEASE
window.toggleResultsRelease = function() {
  config.resultsPublished = !config.resultsPublished;
  window.DataStore.set('sm_config', config);
  refreshDashboardState();
  alert(config.resultsPublished ? 'Results Published Globally! Students can now view their marks and ranks.' : 'Results Locked! Results hidden from public view.');
};

// 4. PROFESSIONAL EXAMINATION OMR SHEET GENERATOR
window.generateSingleOMR = function(ticketNo) {
  var cand = students.find(function(s) { return s.ticketNo === ticketNo; });
  if (!cand) return alert('Candidate not found.');

  var area = document.getElementById('printable-document');
  area.innerHTML = buildProfessionalOMRHTML(cand);
  window.navigateTab('printable');
};

window.generateBatchOMR = function() {
  if (students.length === 0) return alert('No registered candidates to generate OMR sheets.');
  var area = document.getElementById('printable-document');
  area.innerHTML = students.map(function(s, idx) {
    var pb = idx < students.length - 1 ? 'page-break' : '';
    return '<div class="' + pb + '">' + buildProfessionalOMRHTML(s) + '</div>';
  }).join('');
  window.navigateTab('printable');
};

function buildProfessionalOMRHTML(cand) {
  var digits = cand.ticketNo.replace(/[^0-9]/g, '');
  while (digits.length < 6) digits = '0' + digits;

  var qColumns = '';
  for (var col = 0; col < 4; col++) {
    var startQ = (col * 25) + 1;
    var endQ = startQ + 24;
    var rows = '';
    for (var q = startQ; q <= endQ; q++) {
      var qNumStr = q < 10 ? '0' + q : '' + q;
      rows += `
        <div class="flex items-center justify-between py-0.5 border-b border-slate-200 text-[9px] font-mono">
          <span class="w-5 font-bold text-slate-800">${qNumStr}</span>
          <div class="flex gap-1.5">
            <span class="w-3.5 h-3.5 rounded-full border border-slate-700 flex items-center justify-center text-[7px] font-bold">A</span>
            <span class="w-3.5 h-3.5 rounded-full border border-slate-700 flex items-center justify-center text-[7px] font-bold">B</span>
            <span class="w-3.5 h-3.5 rounded-full border border-slate-700 flex items-center justify-center text-[7px] font-bold">C</span>
            <span class="w-3.5 h-3.5 rounded-full border border-slate-700 flex items-center justify-center text-[7px] font-bold">D</span>
          </div>
        </div>
      `;
    }
    qColumns += `<div class="p-2 border border-slate-300 rounded bg-white">${rows}</div>`;
  }

  var rollHeader = '';
  var rollBubbles = '';
  for (var d = 0; d < digits.length; d++) {
    rollHeader += `<span class="w-4 h-5 border border-slate-400 bg-slate-100 flex items-center justify-center font-mono font-bold text-[10px] text-red-700">${digits[d]}</span>`;
  }
  for (var n = 0; n <= 9; n++) {
    var rowB = '';
    for (var colIdx = 0; colIdx < digits.length; colIdx++) {
      var isFilled = parseInt(digits[colIdx]) === n;
      rowB += `<span class="w-4 h-4 rounded-full border border-slate-600 flex items-center justify-center text-[8px] font-mono ${isFilled ? 'bg-slate-900 text-white font-bold' : ''}">${n}</span>`;
    }
    rollBubbles += `<div class="flex justify-between py-0.5">${rowB}</div>`;
  }

  return `
    <div class="border-4 border-slate-800 p-6 bg-white text-slate-900 rounded shadow-lg max-w-4xl mx-auto space-y-4 font-sans text-xs">
      <div class="border-b-2 border-slate-900 pb-2 flex justify-between items-center">
        <div>
          <h2 class="text-base font-black uppercase text-emerald-950 font-cinzel">${config.compTitle}</h2>
          <p class="text-[10px] font-bold text-amber-800 uppercase">${config.masjidTitle}</p>
          <p class="text-[9px] text-slate-600">Official Optical Mark Recognition (OMR) Answer Response Sheet</p>
        </div>
        <div class="text-right">
          <span class="px-2 py-0.5 bg-slate-900 text-white font-mono font-bold text-[10px] rounded">FORM: SEERAT-OMR-2026</span>
          <p class="text-[9px] font-mono text-slate-500 mt-0.5">BARCODE / SER: ${cand.appId}</p>
        </div>
      </div>

      <div class="grid grid-cols-12 gap-3 text-xs">
        <div class="col-span-7 p-2.5 bg-slate-50 border rounded space-y-1">
          <p><strong>Candidate Full Name:</strong> <span class="font-bold uppercase text-slate-900">${cand.name}</span></p>
          <p><strong>Father's Name:</strong> <span class="uppercase">${cand.father}</span></p>
          <p><strong>Hall Ticket No:</strong> <span class="font-mono font-bold text-red-600">${cand.ticketNo}</span> | <strong>DOB:</strong> ${cand.dob}</p>
          <p><strong>Category:</strong> <span class="font-bold text-emerald-900">${cand.category} (${cand.gender === 'M' ? 'Boys' : 'Girls'})</span> | <strong>Seat:</strong> ${cand.seat || 'Assigned at Gate'}</p>
          <div class="mt-2 p-1.5 bg-amber-50 border border-amber-200 rounded text-[9px] text-amber-950 leading-tight">
            <strong>OMR Rules:</strong> Use Blue or Black Ball Point Pen only. Completely darken the circle corresponding to the correct answer. Do not use white fluid or make stray marks.
          </div>
        </div>

        <div class="col-span-5 p-2 border rounded bg-slate-50 flex flex-col items-center justify-between">
          <span class="text-[9px] font-bold uppercase text-slate-700">Roll Number Shading Grid</span>
          <div class="flex gap-1 my-1">${rollHeader}</div>
          <div class="w-full px-2">${rollBubbles}</div>
        </div>
      </div>

      <div>
        <div class="flex justify-between items-center mb-1">
          <span class="text-[10px] font-bold text-slate-800 uppercase tracking-wide">Candidate Answers Section (Questions 01 to 100)</span>
          <span class="text-[9px] font-mono text-slate-500">Total Marks: 100 (1 Mark per Question)</span>
        </div>
        <div class="grid grid-cols-4 gap-2">
          ${qColumns}
        </div>
      </div>

      <div class="border-t-2 border-slate-900 pt-3 flex justify-between items-end text-[10px]">
        <div class="text-center w-40">
          <div class="h-8 border-b border-dashed border-slate-400"></div>
          <span class="font-bold text-slate-700 mt-1 block">Candidate Signature</span>
        </div>

        <div class="text-center">
          <div class="w-16 h-16 rounded-full border border-slate-400 flex flex-col items-center justify-center p-1 text-[7px] text-slate-400 mx-auto">
            <span>OFFICIAL</span>
            <span>MADARSA SEAL</span>
          </div>
        </div>

        <div class="text-center w-40">
          <div class="h-8 border-b border-dashed border-slate-400"></div>
          <span class="font-bold text-slate-700 mt-1 block">Invigilator Signature</span>
        </div>
      </div>
    </div>
  `;
}

// 5. 1-CLICK BATCH DOWNLOAD ADMIT CARDS
window.pullAllAdmitCards = function() {
  if (students.length === 0) return alert('No registered candidates to generate Admit Cards.');
  var area = document.getElementById('printable-document');
  area.innerHTML = students.map(function(cand, idx) {
    var pb = idx < students.length - 1 ? 'page-break' : '';
    return '<div class="' + pb + '">' + buildHallTicketHTML(cand) + '</div>';
  }).join('');
  window.navigateTab('printable');
};

// 6. DYNAMIC THEATER & MATRIX SEATING ENGINE
window.changeSeatingLayoutType = function(type) {
  config.seatingConfig.layoutType = type;
  if (type === 'theater') { config.seatingConfig.colsPerRow = 14; }
  else if (type === '2x2') { config.seatingConfig.colsPerRow = 4; }
  else if (type === '3x3') { config.seatingConfig.colsPerRow = 6; }
  else if (type === '4x4') { config.seatingConfig.colsPerRow = 8; }
  else if (type === 'nxn') {
    var custom = prompt("Enter total desks per row for Custom NxN layout (e.g. 5, 8, 10):", "6");
    config.seatingConfig.colsPerRow = parseInt(custom) || 6;
  }
  window.DataStore.set('sm_config', config);
  renderDynamicSeatingMatrix();
};

window.renderDynamicSeatingMatrix = function() {
  var container = document.getElementById('dynamic-seating-matrix-preview');
  if (!container) return;

  var layout = config.seatingConfig.layoutType || 'theater';
  var cols = config.seatingConfig.colsPerRow || 14;
  var rowsInput = document.getElementById('cfg-seating-rows');
  var rows = rowsInput ? parseInt(rowsInput.value) || 20 : 20;

  var alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var html = '';

  if (layout === 'theater') {
    html += `
      <div class="mb-3 text-center">
        <div class="w-3/4 mx-auto bg-slate-800 text-amber-300 py-1 rounded-t-xl text-[10px] font-black uppercase tracking-widest shadow">
          <i class="fa-solid fa-chalkboard mr-1.5"></i> STAGE & SCREEN AREA
        </div>
      </div>
    `;
  }

  html += '<div class="space-y-2">';

  for (var r = 1; r <= rows; r++) {
    html += '<div class="flex items-center gap-1.5 p-1.5 bg-slate-50 border rounded text-xs overflow-x-auto justify-center">' +
      '<span class="w-12 font-mono font-bold text-slate-500 text-center">R' + r + '</span>';

    for (var c = 0; c < cols; c++) {
      var seatLabel = 'R' + r + '-' + alphabet[c];

      // Aisle separation markers
      if (layout === 'theater') {
        if (c === 4) html += '<span class="px-1.5 py-0.5 text-[8px] bg-amber-100 text-amber-800 font-bold rounded">AISLE</span>';
        if (c === 10) html += '<span class="px-1.5 py-0.5 text-[8px] bg-amber-100 text-amber-800 font-bold rounded">AISLE</span>';
      } else if ((layout === '2x2' && c === 2) || (layout === '3x3' && c === 3) || (layout === '4x4' && c === 4) || (layout === 'nxn' && c === Math.floor(cols / 2))) {
        html += '<span class="px-1.5 py-0.5 text-[8px] bg-amber-100 text-amber-800 font-bold rounded">AISLE</span>';
      }

      var occ = students.find(function(s) { return s.seat && s.seat.indexOf(seatLabel) !== -1; });
      if (occ) {
        var isBoy = occ.gender === 'M';
        html += '<button onclick="alert(\'Seat ' + seatLabel + ' allocated to: ' + occ.name + ' (' + occ.ticketNo + ')\')" class="px-1.5 py-1 rounded text-[10px] font-bold border truncate w-14 text-center ' + (isBoy ? 'bg-blue-100 text-blue-900 border-blue-400' : 'bg-pink-100 text-pink-900 border-pink-400') + '">' +
          seatLabel + ' (' + (isBoy ? 'B' : 'G') + ')' +
        '</button>';
      } else {
        html += '<button onclick="manualAssignSeatPrompt(\'' + seatLabel + '\')" class="px-1.5 py-1 rounded text-[10px] border border-dashed border-slate-300 bg-white hover:border-emerald-700 text-slate-400 w-14 text-center">' +
          seatLabel +
        '</button>';
      }
    }
    html += '</div>';
  }
  html += '</div>';
  container.innerHTML = html;
};

window.manualAssignSeatPrompt = function(seatCode) {
  var roll = prompt('Enter Hall Ticket number to allocate seat ' + seatCode + ':');
  if (!roll) return;
  var cand = students.find(function(s) { return s.ticketNo === roll.trim().toUpperCase(); });
  if (!cand) return alert('Candidate not found.');

  var hall = (cand.gender === 'M') ? 'Hall A (Boys Wing)' : 'Hall B (Girls Wing)';
  cand.seat = hall + ' - ' + seatCode;
  window.DataStore.set('sm_students', students);
  renderDynamicSeatingMatrix();
  renderManagementRoster();
  alert('Seat ' + seatCode + ' mapped to ' + cand.name);
};

window.autoGenerateDynamicSeating = function() {
  if (students.length === 0) return alert('No registered candidates to arrange.');
  var cols = config.seatingConfig.colsPerRow || 14;
  var alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  var mIdx = 0, fIdx = 0;
  students.forEach(function(s) {
    if (s.gender === 'M') {
      var rM = Math.floor(mIdx / cols) + 1;
      var cM = alphabet[mIdx % cols];
      s.seat = 'Hall A (Boys Wing) - R' + rM + '-' + cM;
      mIdx++;
    } else {
      var rF = Math.floor(fIdx / cols) + 1;
      var cF = alphabet[fIdx % cols];
      s.seat = 'Hall B (Girls Wing) - R' + rF + '-' + cF;
      fIdx++;
    }
  });

  window.DataStore.set('sm_students', students);
  renderDynamicSeatingMatrix();
  renderManagementRoster();
  alert('Seating matrix automatically arranged for all candidates.');
};

window.clearSeatingPlan = function() {
  if (confirm('Reset seating plan for all candidates?')) {
    students.forEach(function(s) { s.seat = 'Unassigned'; });
    window.DataStore.set('sm_students', students);
    renderDynamicSeatingMatrix();
    renderManagementRoster();
  }
};

// 7. FACULTY APPROVAL & VETTING WORKFLOW
function renderFacultyApprovalQueue() {
  var tbody = document.getElementById('faculty-approval-tbody');
  if (!tbody) return;

  if (faculties.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="p-4 text-center text-slate-400">No faculty registrations submitted yet.</td></tr>';
    return;
  }

  tbody.innerHTML = faculties.map(function(f, idx) {
    var statusClass = f.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : f.status === 'Denied' || f.status === 'Blocked' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800';

    return '<tr class="hover:bg-slate-50 text-xs">' +
      '<td class="p-2.5 font-bold text-slate-900">' + f.name + '</td>' +
      '<td class="p-2.5">' + f.dept + '</td>' +
      '<td class="p-2.5 font-mono">' + (f.username || f.phone) + '</td>' +
      '<td class="p-2.5 font-mono">' + f.password + '</td>' +
      '<td class="p-2.5"><span class="px-2 py-0.5 rounded text-[10px] font-bold ' + statusClass + '">' + f.status + '</span></td>' +
      '<td class="p-2.5 space-x-1 text-center">' +
        (f.status !== 'Approved' ? '<button onclick="setFacultyStatus(' + idx + ', \'Approved\')" class="bg-emerald-800 hover:bg-emerald-900 text-white px-2 py-0.5 rounded text-[10px] font-bold">Approve</button>' : '') +
        (f.status !== 'Denied' && f.status !== 'Blocked' ? '<button onclick="setFacultyStatus(' + idx + ', \'Denied\')" class="bg-red-600 hover:bg-red-700 text-white px-2 py-0.5 rounded text-[10px] font-bold">Deny</button>' : '') +
        '<button onclick="openEditFacultyModal(' + idx + ')" class="text-blue-600 font-bold hover:underline ml-1">Edit</button>' +
        (session.user.role === 'super_admin' ? '<button onclick="removeFaculty(' + idx + ')" class="text-slate-500 hover:text-red-700 text-[11px] font-bold ml-1">Del</button>' : '') +
      '</td>' +
    '</tr>';
  }).join('');
}

window.setFacultyStatus = function(idx, newStatus) {
  faculties[idx].status = newStatus;
  window.DataStore.set('sm_faculties', faculties);
  renderFacultyApprovalQueue();
  refreshDashboardState();
  alert('Faculty ' + faculties[idx].name + ' status updated to ' + newStatus);
};

window.openEditFacultyModal = function(idx) {
  var f = faculties[idx];
  document.getElementById('edit-fac-index').value = idx;
  document.getElementById('edit-fac-name').value = f.name;
  document.getElementById('edit-fac-email').value = f.email;
  document.getElementById('edit-fac-phone').value = f.phone;
  document.getElementById('edit-fac-username').value = f.username || f.phone;
  document.getElementById('edit-fac-dept').value = f.dept;
  document.getElementById('edit-fac-hall').value = f.assignedHall;
  document.getElementById('edit-fac-status').value = f.status;
  document.getElementById('edit-fac-pwd').value = f.password;
  window.openModal('modal-edit-faculty');
};

window.saveFacultyModifications = function(e) {
  e.preventDefault();
  var idx = document.getElementById('edit-fac-index').value;
  var f = faculties[idx];
  f.name = document.getElementById('edit-fac-name').value.trim();
  f.email = document.getElementById('edit-fac-email').value.trim();
  f.phone = document.getElementById('edit-fac-phone').value.trim();
  f.username = document.getElementById('edit-fac-username').value.trim();
  f.dept = document.getElementById('edit-fac-dept').value;
  f.assignedHall = document.getElementById('edit-fac-hall').value;
  f.status = document.getElementById('edit-fac-status').value;
  var newPwd = document.getElementById('edit-fac-pwd').value.trim();
  if (newPwd) f.password = newPwd;

  faculties[idx] = f;
  window.DataStore.set('sm_faculties', faculties);
  window.closeModal('modal-edit-faculty');
  renderFacultyApprovalQueue();
  refreshDashboardState();
  alert('Faculty profile updated successfully.');
};

window.removeFaculty = function(idx) {
  if (confirm('Delete faculty account permanently?')) {
    faculties.splice(idx, 1);
    window.DataStore.set('sm_faculties', faculties);
    renderFacultyApprovalQueue();
    refreshDashboardState();
  }
};

// 8. MASTER ROSTER VIEW & ACTIONS
window.switchRosterLayout = function(mode) {
  rosterLayoutMode = mode;
  var btnList = document.getElementById('btn-roster-list');
  var btnGrid = document.getElementById('btn-roster-grid');
  var listWrap = document.getElementById('roster-list-wrapper');
  var gridWrap = document.getElementById('roster-grid-wrapper');

  if (mode === 'list') {
    btnList.className = 'px-2 py-0.5 rounded font-bold bg-white text-emerald-950 shadow-sm';
    btnGrid.className = 'px-2 py-0.5 rounded font-bold text-slate-600 hover:text-emerald-950';
    listWrap.classList.remove('hidden');
    gridWrap.classList.add('hidden');
  } else {
    btnGrid.className = 'px-2 py-0.5 rounded font-bold bg-white text-emerald-950 shadow-sm';
    btnList.className = 'px-2 py-0.5 rounded font-bold text-slate-600 hover:text-emerald-950';
    gridWrap.classList.remove('hidden');
    listWrap.classList.add('hidden');
  }
  renderManagementRoster();
};

function renderManagementRoster() {
  var tbody = document.getElementById('admin-roster-tbody');
  var gridWrap = document.getElementById('roster-grid-wrapper');
  if (!tbody || !gridWrap) return;

  if (students.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" class="p-6 text-center text-slate-400">No candidates enrolled yet. Use Student Enrollment to register candidates.</td></tr>';
    gridWrap.innerHTML = '<div class="col-span-full p-6 text-center text-slate-400">No candidate cards available.</div>';
    return;
  }

  tbody.innerHTML = students.map(function(s, idx) {
    var statusClass = s.status === 'Enrolled' ? 'bg-emerald-100 text-emerald-800' : s.status === 'Denied' || s.status === 'Blocked' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800';

    return '<tr class="hover:bg-slate-50 text-xs">' +
      '<td class="p-2.5 font-mono font-bold text-red-600">' + s.ticketNo + '</td>' +
      '<td class="p-2.5 font-semibold text-slate-900">' + s.name + '</td>' +
      '<td class="p-2.5">' + s.father + '</td>' +
      '<td class="p-2.5 font-bold text-emerald-800">' + (s.seat || 'Unassigned') + '</td>' +
      '<td class="p-2.5 font-bold text-amber-800">' + (s.prize || 'None') + '</td>' +
      '<td class="p-2.5"><span class="px-2 py-0.5 rounded text-[10px] font-bold ' + statusClass + '">' + s.status + ' (' + (s.attendance || 'Pending') + ')</span></td>' +
      '<td class="p-2.5 text-center space-x-1">' +
        '<button onclick="openEditCandidateModal(' + idx + ')" class="text-blue-600 hover:underline font-bold">Edit</button>' +
        '<button onclick="generateSingleOMR(\'' + s.ticketNo + '\')" class="text-purple-700 hover:underline font-bold">OMR</button>' +
        '<button onclick="generateParticipationCertificate(\'' + s.ticketNo + '\')" class="text-amber-700 hover:underline font-bold">Cert</button>' +
        '<button onclick="displayHallTicket(students[' + idx + '])" class="text-emerald-700 hover:underline font-bold">Admit</button>' +
        (session.user.role === 'super_admin' ? '<button onclick="deleteCandidate(' + idx + ')" class="text-red-600 hover:underline">Del</button>' : '') +
      '</td>' +
    '</tr>';
  }).join('');

  gridWrap.innerHTML = students.map(function(s, idx) {
    return '<div class="p-3.5 bg-white border rounded-xl shadow-sm space-y-2 text-xs">' +
      '<div class="flex justify-between items-center">' +
        '<span class="font-mono font-bold text-red-600">' + s.ticketNo + '</span>' +
        '<span class="px-2 py-0.5 rounded text-[10px] font-bold ' + (s.status === 'Blocked' || s.status === 'Denied' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-800') + '">' + s.status + '</span>' +
      '</div>' +
      '<h4 class="font-bold text-slate-900">' + s.name + '</h4>' +
      '<p class="text-slate-500">Father: ' + s.father + ' | DOB: ' + (s.dob || 'N/A') + '</p>' +
      '<p class="text-emerald-900 font-semibold">Seat: ' + (s.seat || 'Unassigned') + '</p>' +
      '<p class="text-amber-800 font-bold">Prize: ' + (s.prize || 'None') + '</p>' +
      '<div class="pt-2 border-t flex justify-end gap-2 text-[11px]">' +
        '<button onclick="openEditCandidateModal(' + idx + ')" class="text-blue-600 font-bold hover:underline">Edit</button>' +
        '<button onclick="generateSingleOMR(\'' + s.ticketNo + '\')" class="text-purple-700 font-bold hover:underline">OMR</button>' +
        '<button onclick="generateParticipationCertificate(\'' + s.ticketNo + '\')" class="text-amber-700 font-bold hover:underline">Cert</button>' +
        (session.user.role === 'super_admin' ? '<button onclick="deleteCandidate(' + idx + ')" class="text-red-600 hover:underline">Delete</button>' : '') +
      '</div>' +
    '</div>';
  }).join('');
}

window.filterRosterTable = function() {
  var q = document.getElementById('roster-search').value.toLowerCase();
  document.querySelectorAll('#admin-roster-tbody tr').forEach(function(r) {
    r.style.display = r.innerText.toLowerCase().includes(q) ? '' : 'none';
  });
  document.querySelectorAll('#roster-grid-wrapper > div').forEach(function(card) {
    card.style.display = card.innerText.toLowerCase().includes(q) ? '' : 'none';
  });
};

window.openEditCandidateModal = function(idx) {
  var c = students[idx];
  document.getElementById('edit-cand-index').value = idx;
  document.getElementById('edit-cand-ht').innerText = c.ticketNo;
  document.getElementById('edit-cand-name').value = c.name;
  document.getElementById('edit-cand-father').value = c.father;
  document.getElementById('edit-cand-dob').value = c.dob || '';
  document.getElementById('edit-cand-phone').value = c.phone || '';
  document.getElementById('edit-cand-seat').value = c.seat || '';
  document.getElementById('edit-cand-marks').value = c.marks || 0;
  document.getElementById('edit-cand-status').value = c.status;
  document.getElementById('edit-cand-attendance').value = c.attendance || 'Present';
  document.getElementById('edit-cand-prize').value = c.prize || 'None';
  document.getElementById('edit-cand-pwd').value = c.password || '';
  window.openModal('modal-edit-candidate');
};

window.saveCandidateModifications = function(e) {
  e.preventDefault();
  var idx = document.getElementById('edit-cand-index').value;
  var c = students[idx];
  c.name = document.getElementById('edit-cand-name').value.trim();
  c.father = document.getElementById('edit-cand-father').value.trim();
  c.dob = document.getElementById('edit-cand-dob').value;
  c.phone = document.getElementById('edit-cand-phone').value.trim();
  c.seat = document.getElementById('edit-cand-seat').value.trim();
  c.marks = parseInt(document.getElementById('edit-cand-marks').value) || 0;
  c.status = document.getElementById('edit-cand-status').value;
  c.attendance = document.getElementById('edit-cand-attendance').value;
  c.prize = document.getElementById('edit-cand-prize').value;
  var newPwd = document.getElementById('edit-cand-pwd').value.trim();
  if (newPwd) c.password = newPwd;

  students[idx] = c;
  window.DataStore.set('sm_students', students);
  window.closeModal('modal-edit-candidate');
  renderManagementRoster();
  renderDynamicSeatingMatrix();
  refreshDashboardState();
  alert('Candidate modifications, password, attendance, and prize updated successfully.');
};

window.deleteCandidate = function(idx) {
  if (confirm('Delete candidate ' + students[idx].ticketNo + ' permanently?')) {
    students.splice(idx, 1);
    window.DataStore.set('sm_students', students);
    renderManagementRoster();
    renderDynamicSeatingMatrix();
    refreshDashboardState();
  }
};

function renderFeedbackManagement() {
  var tbody = document.getElementById('admin-feedback-tbody');
  if (!tbody) return;

  if (feedbacks.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" class="p-4 text-center text-slate-400">No inquiries received yet.</td></tr>';
    return;
  }

  tbody.innerHTML = feedbacks.map(function(fb, idx) {
    var cleanPhone = fb.phone.replace(/[^0-9]/g, '');
    var waLink = 'https://wa.me/91' + cleanPhone + '?text=' + encodeURIComponent('Salam ' + fb.name + ', regarding your query at Shahi Masjid Seerat Portal: ');
    var mailLink = 'mailto:' + (fb.email || '') + '?subject=' + encodeURIComponent('Response: Seerat Competition Inquiry') + '&body=' + encodeURIComponent('Salam ' + fb.name + ',\n\nIn response to your inquiry: "' + fb.message + '"\n\n');

    return '<tr class="hover:bg-slate-50 text-xs">' +
      '<td class="p-2.5 font-bold text-slate-900">' + fb.name + '<br/><span class="text-[10px] text-slate-400">' + fb.date + '</span></td>' +
      '<td class="p-2.5 text-slate-700">' + fb.message + '</td>' +
      '<td class="p-2.5 font-mono">' + fb.phone + '</td>' +
      '<td class="p-2.5 text-center space-x-2">' +
        '<a href="' + waLink + '" target="_blank" class="inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-2 py-1 rounded font-bold text-[10px]">' +
          '<i class="fa-brands fa-whatsapp mr-1"></i> WhatsApp' +
        '</a>' +
        '<a href="' + mailLink + '" class="inline-block bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded font-bold text-[10px]">' +
          '<i class="fa-solid fa-envelope mr-1"></i> Email' +
        '</a>' +
      '</td>' +
    '</tr>';
  }).join('');
}

window.saveSuperAdminConfig = function() {
  config.masjidTitle = document.getElementById('cfg-masjid-title').value.trim();
  config.examDate = document.getElementById('cfg-date-time').value.trim();
  config.prepTime = document.getElementById('cfg-prep-time').value.trim();
  config.examTime = document.getElementById('cfg-exam-time').value.trim();
  config.pocContact = document.getElementById('cfg-poc').value.trim();
  config.masjidContact = document.getElementById('cfg-masjid-contact').value.trim();
  config.examVenue = document.getElementById('cfg-venue').value.trim();
  config.dignitaries.patron = document.getElementById('cfg-dignitary-patron').value.trim();
  config.dignitaries.chiefGuest = document.getElementById('cfg-dignitary-guest').value.trim();

  window.DataStore.set('sm_config', config);
  syncConfigUI();
  alert('Configurations and Dignitary details saved globally.');
};

// ----------------------------------------------------
// PROFESSIONAL ISLAMIC PARTICIPATION CERTIFICATE GENERATOR
// ----------------------------------------------------
window.generateParticipationCertificate = function(ticketNo) {
  var cand = students.find(function(s) { return s.ticketNo === ticketNo; });
  if (!cand) return alert('Candidate not found.');

  var guestSignatureSection = config.dignitaries.chiefGuest ? `
    <div class="text-center space-y-1">
      <div class="font-serif italic text-sm text-emerald-900 font-bold">${config.dignitaries.chiefGuest}</div>
      <div class="w-36 h-0.5 bg-slate-400 mx-auto"></div>
      <span class="font-bold text-emerald-950 block text-[11px]">${config.dignitaries.chiefGuest}</span>
      <span class="text-[9px] text-slate-500">${config.dignitaries.chiefGuestTitle}</span>
    </div>
  ` : `
    <div class="text-center space-y-1">
      <div class="font-serif italic text-sm text-emerald-900 font-bold">Controller of Exams</div>
      <div class="w-36 h-0.5 bg-slate-400 mx-auto"></div>
      <span class="font-bold text-emerald-950 block text-[11px]">Examination Board</span>
      <span class="text-[9px] text-slate-500">Academic Wing</span>
    </div>
  `;

  var certHTML = `
    <div class="border-8 border-double border-amber-600 p-8 bg-[#fdfcf7] text-slate-900 rounded shadow-xl relative overflow-hidden">
      <div class="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none text-9xl font-arabic text-emerald-950">
        محمد ﷺ
      </div>

      <div class="text-center space-y-1 relative z-10">
        <p class="font-arabic text-3xl font-bold text-emerald-950">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</p>
        <h2 class="font-cinzel text-xl md:text-2xl font-black text-emerald-900 uppercase tracking-wide">${config.masjidTitle}</h2>
        <p class="text-xs font-bold text-amber-800 uppercase tracking-widest">${config.masjidSub}</p>
        <div class="h-0.5 bg-gradient-to-r from-transparent via-amber-600 to-transparent w-3/4 mx-auto my-3"></div>
      </div>

      <div class="text-center my-4 relative z-10">
        <span class="inline-block px-4 py-1 bg-amber-100 text-amber-900 font-serif italic text-sm border border-amber-300 rounded-full font-bold">
          Certificate of Active Participation
        </span>
        <h3 class="font-cinzel text-lg md:text-xl font-bold text-emerald-950 mt-2">${config.compTitle}</h3>
        <p class="text-xs text-slate-600 font-medium">${config.compSubtitle}</p>
      </div>

      <div class="my-5 p-4 bg-emerald-50/80 border border-emerald-300 rounded-lg text-center space-y-1.5 relative z-10">
        <p class="font-arabic text-lg text-emerald-950 font-bold" dir="rtl">
          « مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ »
        </p>
        <p class="text-xs font-serif italic text-emerald-900">
          "Whoever treads a path seeking knowledge, Allah will make easy for him a path to Paradise."
        </p>
        <span class="text-[10px] text-amber-800 font-bold block">(Sahih Muslim: 2699)</span>
      </div>

      <div class="my-6 text-center text-xs md:text-sm leading-relaxed space-y-3 relative z-10">
        <p class="text-slate-700">This is to proudly certify that</p>
        <h4 class="text-xl font-bold text-emerald-950 uppercase underline decoration-amber-500 underline-offset-4 tracking-wider">${cand.name}</h4>
        <div class="flex flex-wrap justify-center gap-6 text-xs text-slate-700 pt-1">
          <p><strong>Father's Name:</strong> <span class="font-semibold uppercase">${cand.father}</span></p>
          <p><strong>Date of Birth:</strong> <span class="font-semibold">${cand.dob || 'Verified'}</span></p>
          <p><strong>Hall Ticket No:</strong> <span class="font-mono font-bold text-red-600">${cand.ticketNo}</span></p>
        </div>
        <p class="max-w-2xl mx-auto text-xs text-slate-600 pt-2">
          has successfully enrolled and diligently participated in the annual <em>Seerat-un-Nabi ﷺ Knowledge Assessment</em>. We appreciate their pursuit of Prophetic wisdom, character, and discipline.
        </p>
      </div>

      <div class="mt-8 pt-4 border-t border-amber-300 flex justify-between items-end relative z-10 text-xs">
        <div class="text-center space-y-1">
          <div class="font-arabic text-sm text-emerald-900 font-bold">احسن بن محمد الحمومي</div>
          <div class="w-36 h-0.5 bg-slate-400 mx-auto"></div>
          <span class="font-bold text-emerald-950 block text-[11px]">${config.dignitaries.patron}</span>
          <span class="text-[9px] text-slate-500">${config.dignitaries.patronTitle}</span>
        </div>

        <div class="w-24 h-24 rounded-full border-2 border-emerald-900 flex flex-col items-center justify-center p-1 text-center bg-emerald-50 shadow-inner">
          <i class="fa-solid fa-certificate text-amber-600 text-lg mb-0.5"></i>
          <span class="text-[7px] font-black uppercase text-emerald-950 leading-tight">MADARSA AL HAMOOMI</span>
          <span class="text-[6px] text-amber-800 font-bold">OFFICIAL SEAL</span>
          <span class="text-[6px] text-slate-500 font-mono mt-0.5">Verified 2026</span>
        </div>

        ${guestSignatureSection}
      </div>
    </div>
  `;

  document.getElementById('printable-document').innerHTML = certHTML;
  window.navigateTab('printable');
};

function getStudent(ticketNo) {
  return students.find(function(s) { return s.ticketNo === ticketNo; });
}

// ----------------------------------------------------
// CANDIDATE ENROLLMENT ENGINE
// ----------------------------------------------------
function generateUniqueHallTicket(gender, category) {
  var prefix = (gender === 'M') ? 'SUN3-B-' : 'SUN3-G-';
  var categoryCode = category.toUpperCase();
  var startNumber = (gender === 'M') ? 1000 : 2000;

  var candidateList = students.filter(function(s) {
    return s.gender === gender && s.category === category;
  });

  var nextSeq = startNumber + candidateList.length + 1;
  var candidateHT = prefix + categoryCode + '-' + nextSeq;

  while (students.some(function(s) { return s.ticketNo === candidateHT; })) {
    nextSeq++;
    candidateHT = prefix + categoryCode + '-' + nextSeq;
  }

  return candidateHT;
}

window.handleStudentRegister = function(e) {
  e.preventDefault();
  var name = document.getElementById('reg-name').value.trim();
  var father = document.getElementById('reg-father').value.trim();
  var dob = document.getElementById('reg-dob').value;
  var phone = document.getElementById('reg-phone').value.trim();
  var category = document.getElementById('reg-category').value;
  var gender = document.getElementById('reg-gender').value;

  var duplicateBio = students.some(function(s) {
    return s.phone === phone && s.name.toLowerCase() === name.toLowerCase() && s.father.toLowerCase() === father.toLowerCase();
  });

  if (duplicateBio) {
    alert('Duplicate Registration Error: A candidate with matching phone, name, and father name already exists.');
    return;
  }

  var attemptEl = document.querySelector('input[name="reg-attempt"]:checked');
  var attempt = attemptEl ? attemptEl.value : '1st Time (New Applicant)';
  
  var ticketNo = generateUniqueHallTicket(gender, category);
  var appId = 'APP-HAMOOMI-2026-' + (students.length + 1001);

  var hall = (gender === 'M') ? 'Hall A (Boys Wing)' : 'Hall B (Girls Wing)';
  var seat = hall + ' - Row ' + (Math.floor(students.length / 4) + 1) + ' (Desk #' + ((students.length % 50) + 1) + ')';

  var cand = {
    appId: appId,
    ticketNo: ticketNo,
    name: name,
    father: father,
    dob: dob,
    phone: phone,
    email: document.getElementById('reg-email').value.trim() || 'N/A',
    idType: document.getElementById('reg-id-type').value,
    category: category,
    gender: gender,
    attempt: attempt,
    seat: seat,
    prize: 'None',
    address: document.getElementById('reg-address').value.trim(),
    password: document.getElementById('reg-password').value,
    marks: 0,
    status: 'Enrolled',
    attendance: 'Pending',
    resultVerified: false,
    registeredDate: new Date().toLocaleDateString('en-IN')
  };

  students.push(cand);
  window.DataStore.set('sm_students', students);

  saveSession({ id: cand.ticketNo, name: cand.name, role: 'student', data: cand }, true);
  alert('Enrollment Complete!\nAllotted Hall Ticket ID: ' + ticketNo + '\nAllocated Seat: ' + seat);
  displayHallTicket(cand);
};

// ----------------------------------------------------
// DOCUMENT RENDERING (HALL TICKETS & ADMIT CARDS)
// ----------------------------------------------------
function buildHallTicketHTML(cand) {
  return `
    <div class="border-b-2 border-emerald-900 pb-3 mb-4 flex justify-between items-center">
      <div>
        <h2 class="text-lg font-black text-emerald-950 font-cinzel">${config.compTitle}</h2>
        <p class="text-[11px] text-gray-600 font-bold uppercase">${config.masjidTitle}</p>
        <p class="text-[10px] text-emerald-800 font-semibold">${config.masjidSub}</p>
      </div>
      <div class="text-right">
        <span class="text-[10px] text-gray-500 font-bold uppercase block">Official Hall Ticket Number</span>
        <span class="text-lg font-mono font-black text-red-600">${cand.ticketNo}</span>
      </div>
    </div>

    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-8 space-y-2 text-xs">
        <p><strong>Candidate Name:</strong> <span class="uppercase font-bold text-slate-900">${cand.name}</span></p>
        <p><strong>Father's Name:</strong> <span class="uppercase font-semibold">${cand.father}</span></p>
        <p><strong>Date of Birth:</strong> ${cand.dob || 'Verified'} | <strong>Gender:</strong> ${cand.gender === 'M' ? 'Male Candidate' : 'Female Candidate'}</p>
        <p><strong>Academic Category:</strong> <span class="font-bold text-emerald-900">${cand.category}</span></p>
        <div class="p-2.5 bg-amber-50 border border-amber-300 rounded space-y-0.5">
          <p class="text-xs"><strong>Allocated Desk:</strong> <span class="font-mono text-sm font-black text-red-700">${cand.seat || 'Allocated at Gate'}</span></p>
          <p class="text-[11px] text-emerald-900"><strong>Reporting & Prep:</strong> ${config.prepTime}</p>
          <p class="text-[11px] text-red-700"><strong>Exam Timing:</strong> ${config.examTime}</p>
        </div>
        <p><strong>Exam Date:</strong> ${config.examDate}</p>
        <p><strong>Venue:</strong> ${config.examVenue}</p>
      </div>

      <div class="col-span-4 flex flex-col items-center justify-between border-l pl-4 space-y-3">
        <div class="w-28 h-32 border-2 border-dashed border-slate-400 bg-slate-50 flex flex-col items-center justify-center text-center p-1 rounded text-[10px] text-slate-500">
          <i class="fa-regular fa-user text-xl mb-1 text-slate-400"></i>
          <span>Affix Passport Photo</span>
        </div>

        <div class="w-28 h-28 rounded-full border-2 border-emerald-900 flex flex-col items-center justify-center text-center p-1.5 bg-emerald-50/50 shadow-inner">
          <i class="fa-solid fa-certificate text-amber-600 text-sm mb-0.5"></i>
          <span class="text-[8px] font-black uppercase text-emerald-950 leading-tight">MADARSA AL HAMOOMI</span>
          <span class="text-[7px] text-amber-800 font-bold">OFFICIAL SEAL</span>
          <span class="text-[7px] text-slate-500 font-mono mt-0.5">Verified & Valid</span>
        </div>
      </div>
    </div>

    <div class="mt-6 border-t pt-3 flex justify-between items-center text-[10px] text-slate-600">
      <span>* Present this Admit Card with valid Government / College ID at entry gate.</span>
      <span class="font-bold text-emerald-950">Authorized Registrar Stamp</span>
    </div>
  `;
}

window.displayHallTicket = function(cand) {
  var area = document.getElementById('printable-document');
  area.innerHTML = buildHallTicketHTML(cand);
  window.navigateTab('printable');
};

window.displayApplicationForm = function(cand) {
  var area = document.getElementById('printable-document');
  area.innerHTML = `
    <div class="text-center border-b-2 border-amber-600 pb-3 mb-4">
      <p class="font-arabic text-xl font-bold text-emerald-950 leading-none">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</p>
      <h2 class="text-base font-extrabold text-emerald-950 uppercase font-cinzel mt-1">${config.masjidTitle}</h2>
      <p class="text-[11px] font-semibold text-amber-700">${config.masjidSub}</p>
      <p class="text-[10px] text-slate-600 font-bold">${config.compTitle}</p>
    </div>
    <div class="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded border">
      <p><strong>Application ID:</strong> ${cand.appId}</p>
      <p><strong>Hall Ticket No:</strong> <span class="text-red-600 font-bold font-mono">${cand.ticketNo}</span></p>
      <p><strong>Candidate:</strong> ${cand.name}</p>
      <p><strong>Father:</strong> ${cand.father}</p>
      <p><strong>DOB:</strong> ${cand.dob}</p>
      <p><strong>Identity Type:</strong> ${cand.idType}</p>
      <p><strong>Assigned Seat:</strong> ${cand.seat}</p>
      <p><strong>Registration Status:</strong> ${cand.status}</p>
    </div>
  `;
  window.navigateTab('printable');
};

window.pullAllApplicationForms = function() {
  if (students.length === 0) return alert('No registered applications to print.');
  var area = document.getElementById('printable-document');
  area.innerHTML = students.map(function(cand, idx) {
    var pb = idx < students.length - 1 ? 'page-break' : '';
    return '<div class="' + pb + ' p-4 mb-4 border-b">' +
      '<h3 class="font-bold text-sm text-emerald-950">' + cand.name + ' (' + cand.ticketNo + ')</h3>' +
      '<p class="text-xs">Father: ' + cand.father + ' | DOB: ' + cand.dob + ' | Seat: ' + cand.seat + '</p>' +
      '<p class="text-xs font-bold text-amber-800">Status: ' + cand.status + ' | Attendance: ' + cand.attendance + '</p>' +
    '</div>';
  }).join('');
  window.navigateTab('printable');
};

window.downloadPDFDoc = function() {
  var el = document.getElementById('printable-document');
  html2pdf().set({
    margin: 6,
    filename: 'Madarsa_Official_Document.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  }).from(el).save();
};

window.handleDocLookup = function(e) {
  e.preventDefault();
  var phone = document.getElementById('lookup-phone').value.trim();
  var name = document.getElementById('lookup-name').value.trim().toLowerCase();
  var father = document.getElementById('lookup-father').value.trim().toLowerCase();
  var type = document.getElementById('lookup-doc-type').value;

  var cand = students.find(function(s) {
    return s.phone === phone && s.name.trim().toLowerCase() === name && s.father.trim().toLowerCase() === father;
  });

  if (!cand) return alert('Verification Failed: Matching student record not found.');

  if (type === 'ticket') displayHallTicket(cand);
  else if (type === 'omr') generateSingleOMR(cand.ticketNo);
  else displayApplicationForm(cand);
};

// ----------------------------------------------------
// PUBLIC RESULT SEARCH
// ----------------------------------------------------
window.handlePublicResultLookup = function() {
  var query = document.getElementById('public-result-search-input').value.trim().toLowerCase();
  var resBox = document.getElementById('public-result-display');
  if (!query) return alert('Please enter candidate Hall Ticket number or Full Name.');

  if (!config.resultsPublished) {
    resBox.classList.remove('hidden');
    resBox.innerHTML = `
      <div class="p-4 bg-amber-50 border border-amber-300 rounded-lg text-xs text-amber-900 font-medium">
        <i class="fa-solid fa-lock mr-1.5 text-amber-600"></i> The official results have not been released publicly by the Board yet.
      </div>
    `;
    return;
  }

  var cand = students.find(function(s) {
    return s.ticketNo.toLowerCase() === query || s.name.toLowerCase().indexOf(query) !== -1;
  });

  if (!cand) {
    resBox.classList.remove('hidden');
    resBox.innerHTML = `
      <div class="p-4 bg-red-50 border border-red-300 rounded-lg text-xs text-red-700 font-bold">
        No candidate result record found matching "${query}".
      </div>
    `;
    return;
  }

  resBox.classList.remove('hidden');
  resBox.innerHTML = `
    <div class="p-4 bg-white border border-emerald-300 rounded-xl shadow-sm text-xs space-y-2">
      <div class="flex justify-between items-center border-b pb-2">
        <h4 class="font-bold text-sm text-slate-900">${cand.name}</h4>
        <span class="font-mono font-bold text-red-600">${cand.ticketNo}</span>
      </div>
      <p><strong>Father's Name:</strong> ${cand.father}</p>
      <p><strong>Academic Stream:</strong> ${cand.category} (${cand.gender === 'M' ? 'Boys Wing' : 'Girls Wing'})</p>
      <div class="p-2.5 bg-emerald-50 border border-emerald-200 rounded flex justify-between items-center">
        <span>Score: <strong class="font-mono text-emerald-950 font-bold text-sm">${cand.marks || 0}/100</strong></span>
        <span>Award: <strong class="text-amber-800 font-bold">${cand.prize || 'Participant'}</strong></span>
      </div>
      <p class="text-[10px] text-slate-500">Board Status: Verified & Released</p>
    </div>
  `;
};

window.handleFeedbackSubmit = function(e) {
  e.preventDefault();
  feedbacks.unshift({
    id: feedbacks.length + 1,
    name: document.getElementById('fb-name').value.trim(),
    phone: document.getElementById('fb-phone').value.trim(),
    email: document.getElementById('fb-email') ? document.getElementById('fb-email').value.trim() : '',
    message: document.getElementById('fb-msg').value.trim(),
    date: new Date().toLocaleDateString('en-IN')
  });
  window.DataStore.set('sm_feedbacks', feedbacks);
  alert('Query Dispatched: Mosque officials will reply via WhatsApp or Email.');
  document.getElementById('fb-msg').value = '';
  window.navigateTab('home');
};
