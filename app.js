// app.js - Full Interactive Logic: Dynamic Seating, Cert Generation, Attendance & Feedback
var config = window.DataStore.get('sm_config', window.INITIAL_CONFIG);
var students = window.DataStore.get('sm_students', window.INITIAL_STUDENTS);
var prizes = window.DataStore.get('sm_prizes', window.INITIAL_PRIZES);
var faculties = window.DataStore.get('sm_faculties', window.INITIAL_FACULTIES);
var notices = window.DataStore.get('sm_notices', window.INITIAL_NOTICES);
var papers = window.DataStore.get('sm_papers', window.INITIAL_PAPERS);
var feedbacks = window.DataStore.get('sm_feedbacks', [
  { id: 1, name: "Syed Imran", phone: "9848012345", email: "imran@example.com", message: "What are the reporting timings for the Boys wing?", date: "2026-01-20" }
]);
var session = getPersistentSession();

// Layout view states
var prizeLayoutMode = 'grid';
var rosterLayoutMode = 'list';

window.dismissGreeting = function() {
  var overlay = document.getElementById('greeting-overlay');
  if (overlay) overlay.classList.add('hidden');
};

window.navigateTab = function(tabId) {
  var tabs = ['home', 'competitions', 'faculty-register', 'prizes', 'seerat-hub', 'model-papers', 'doc-lookup', 'feedback', 'printable', 'dashboard'];
  tabs.forEach(function(id) {
    var el = document.getElementById('tab-' + id);
    if (el) el.classList.add('hidden');
  });
  var target = document.getElementById('tab-' + tabId);
  if (target) target.classList.remove('hidden');
  window.scrollTo(0, 0);

  if (tabId === 'prizes') renderPrizesDisplay();
  if (tabId === 'seerat-hub') renderSeeratHubContent();
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
  renderSocialRibbon();
  renderNotices();
  renderModelPapers();
  renderPrizesDisplay();
  syncConfigUI();
  updateAuthUI();
});

function startLiveClock() {
  var update = function() {
    var now = new Date();
    var clockEl = document.getElementById('ist-live-clock');
    if (clockEl) {
      clockEl.innerText = now.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: true }) + ' IST';
    }
  };
  update();
  setInterval(update, 1000);
}

function renderSocialRibbon() {
  var container = document.getElementById('social-links-ribbon');
  if (!container) return;
  container.innerHTML = '<a href="' + (config.youtube || '#') + '" target="_blank" class="hover:text-amber-400" title="YouTube"><i class="fa-brands fa-youtube"></i></a>' +
    '<a href="' + (config.facebook || '#') + '" target="_blank" class="hover:text-amber-400" title="Facebook"><i class="fa-brands fa-facebook"></i></a>' +
    '<a href="' + (config.instagram || '#') + '" target="_blank" class="hover:text-amber-400" title="Instagram"><i class="fa-brands fa-instagram"></i></a>' +
    '<a href="' + (config.whatsappChannel || '#') + '" target="_blank" class="hover:text-amber-400 text-emerald-300" title="WhatsApp Channel"><i class="fa-brands fa-whatsapp"></i></a>';
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

  setVal('cfg-masjid-title', config.masjidTitle);
  setVal('cfg-date-time', config.examDate);
  setVal('cfg-prep-time', config.prepTime);
  setVal('cfg-exam-time', config.examTime);
  setVal('cfg-poc', config.pocContact);
  setVal('cfg-masjid-contact', config.masjidContact);
  setVal('cfg-venue', config.examVenue);
  setVal('cfg-yt', config.youtube);
  setVal('cfg-fb', config.facebook);
  setVal('cfg-wa', config.whatsappChannel);
  renderPrayerConfigGrid();
}

function renderPrayerTimes() {
  var container = document.getElementById('prayer-time-table');
  if (!container) return;
  container.innerHTML = config.prayers.map(function(p) {
    return '<div class="flex justify-between items-center py-1 border-b border-slate-100">' +
      '<span class="font-bold text-slate-800">' + p.name + '</span>' +
      '<div class="space-x-2 text-[11px]">' +
        '<span class="text-slate-400">Azan: ' + p.adhan + '</span>' +
        '<span class="text-emerald-800 font-mono font-bold">Iqama: ' + p.iqama + '</span>' +
      '</div>' +
    '</div>';
  }).join('');
}

function renderPrayerConfigGrid() {
  var grid = document.getElementById('cfg-prayers-grid');
  if (!grid) return;
  grid.innerHTML = config.prayers.map(function(p, idx) {
    return '<div class="p-2 border rounded bg-slate-50">' +
      '<span class="font-bold block text-slate-800 mb-1">' + p.name + '</span>' +
      '<label class="text-[9px] text-gray-500">Azan</label>' +
      '<input type="text" id="cfg-p-adhan-' + idx + '" value="' + p.adhan + '" class="border rounded p-1 w-full text-xs mb-1" />' +
      '<label class="text-[9px] text-gray-500">Iqama</label>' +
      '<input type="text" id="cfg-p-iqama-' + idx + '" value="' + p.iqama + '" class="border rounded p-1 w-full text-xs" />' +
    '</div>';
  }).join('');
}

function renderNotices() {
  var el = document.getElementById('home-notices-container');
  if (!el) return;
  el.innerHTML = notices.map(function(n) {
    return '<div class="p-2.5 bg-amber-50/60 border border-amber-200/80 rounded-lg">' +
      '<div class="flex justify-between font-bold text-slate-800">' +
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

// 48 PRIZE WINNERS DISPLAY (GRID VS LIST)
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
      return '<div class="p-4 bg-gradient-to-br from-white to-amber-50/40 rounded-xl border border-amber-200/80 shadow-sm hover:shadow transition flex flex-col justify-between">' +
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
            '<i class="fa-solid fa-' + p.icon + '"></i>' +
          '</div>' +
          '<div>' +
            '<span class="text-[10px] text-slate-400 block uppercase font-bold">Awarded Prize</span>' +
            '<span class="text-xs font-bold text-emerald-950">' + p.prize + '</span>' +
          '</div>' +
        '</div>' +
      '</div>';
    }).join('');
  } else {
    container.className = 'overflow-x-auto border rounded-xl bg-white shadow-sm';
    container.innerHTML = '<table class="w-full text-xs text-left">' +
      '<thead class="bg-slate-100 uppercase text-[10px] text-slate-600 border-b">' +
        '<tr>' +
          '<th class="p-3">Rank</th>' +
          '<th class="p-3">Candidate Name</th>' +
          '<th class="p-3">Hall Ticket ID</th>' +
          '<th class="p-3">Category</th>' +
          '<th class="p-3">Allotted Prize Item</th>' +
        '</tr>' +
      '</thead>' +
      '<tbody class="divide-y">' +
        prizes.map(function(p) {
          return '<tr class="hover:bg-slate-50">' +
            '<td class="p-3 font-bold text-amber-700">' + p.rank + '</td>' +
            '<td class="p-3 font-bold text-slate-900">' + p.name + '</td>' +
            '<td class="p-3 font-mono text-red-600 font-bold">' + p.ht + '</td>' +
            '<td class="p-3 font-medium">' + p.category + '</td>' +
            '<td class="p-3 font-bold text-emerald-950"><i class="fa-solid fa-' + p.icon + ' mr-1 text-amber-600"></i> ' + p.prize + '</td>' +
          '</tr>';
        }).join('') +
      '</tbody>' +
    '</table>';
  }
}

// MULTI-LANGUAGE SEERAT HUB
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

// MULTI-ROLE LOGIN & SESSION
window.setLoginRoleHint = function(role) {
  var btnS = document.getElementById('role-hint-student');
  var btnF = document.getElementById('role-hint-faculty');
  var btnA = document.getElementById('role-hint-super');
  var lbl = document.getElementById('login-label-id');

  if (btnS && btnF && btnA && lbl) {
    btnS.className = 'flex-1 py-1 rounded text-slate-600';
    btnF.className = 'flex-1 py-1 rounded text-slate-600';
    btnA.className = 'flex-1 py-1 rounded text-slate-600';

    if (role === 'student') {
      btnS.className = 'flex-1 py-1 rounded bg-white text-emerald-950 shadow-sm';
      lbl.innerText = 'Mobile Number / Hall Ticket ID';
    } else if (role === 'faculty') {
      btnF.className = 'flex-1 py-1 rounded bg-white text-emerald-950 shadow-sm';
      lbl.innerText = 'Faculty Mobile / Username (e.g., Admin1)';
    } else {
      btnA.className = 'flex-1 py-1 rounded bg-white text-emerald-950 shadow-sm';
      lbl.innerText = 'Maintenance Super Admin Username';
    }
  }
};

window.handleUniversalLogin = function(e) {
  e.preventDefault();
  var id = document.getElementById('login-id').value.trim();
  var pwd = document.getElementById('login-pwd').value.trim();
  var remember = document.getElementById('login-save-24h') ? document.getElementById('login-save-24h').checked : true;

  if (id === 'Admin' && pwd === '9290') {
    saveSession({ id: 'Admin', name: 'Super Admin (Maintenance)', role: 'super_admin' }, remember);
    window.closeModal('modal-auth');
    openDashboard();
    return;
  }

  if (id === 'Admin1' && pwd === '2580') {
    saveSession({ id: 'Admin1', name: 'Faculty & Invigilator Admin', role: 'admin' }, remember);
    window.closeModal('modal-auth');
    openDashboard();
    return;
  }

  var fac = faculties.find(function(f) { return f.phone === id || f.email === id || f.id === id; });
  if (fac) {
    if (fac.status !== 'Approved') {
      alert('Faculty Profile Status: Pending Approval by Admin / Super Admin.');
      return;
    }
    if (pwd === 'faculty123' || pwd === '2580') {
      saveSession({ id: fac.id, name: fac.name, role: 'faculty', data: fac }, remember);
      window.closeModal('modal-auth');
      openDashboard();
      return;
    }
  }

  var std = students.find(function(s) {
    return (s.phone === id || s.email === id || s.ticketNo === id) && (s.password === pwd || pwd === '1234' || s.dob.replace(/-/g, '') === pwd);
  });

  if (std) {
    if (std.status === 'Blocked') return alert('Profile blocked due to duplicate audit conflict. Contact mosque office.');
    saveSession({ id: std.ticketNo, name: std.name, role: 'student', data: std }, remember);
    window.closeModal('modal-auth');
    openDashboard();
    return;
  }

  alert('Invalid credentials. Check Hall Ticket/phone and password.');
};

function saveSession(user, remember24h) {
  var now = new Date().getTime();
  var expiry = remember24h ? now + (24 * 3600 * 1000) : now + (2 * 3600 * 1000);
  var sessionObj = { user: user, expiry: expiry };
  localStorage.setItem('sm_session', JSON.stringify(sessionObj));
  session = sessionObj;
  updateAuthUI();
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
  } catch (e) {
    return null;
  }
}

window.handleSessionLogout = function() {
  localStorage.removeItem('sm_session');
  session = null;
  updateAuthUI();
  window.navigateTab('home');
};

function updateAuthUI() {
  var slot = document.getElementById('nav-auth-slot');
  if (!slot) return;
  if (session && session.user) {
    slot.innerHTML = '<button onclick="navigateTab(\'dashboard\'); openDashboard();" class="bg-amber-500 text-emerald-950 px-3 py-1.5 rounded-lg font-bold">' +
      'Dashboard (' + session.user.name + ')' +
    '</button>';
  } else {
    slot.innerHTML = '<button onclick="openModal(\'modal-auth\')" class="bg-emerald-950 text-amber-300 px-4 py-1.5 rounded-lg font-bold border border-amber-500/50 hover:bg-emerald-900">' +
      'Login' +
    '</button>';
  }
}

function openDashboard() {
  if (!session || !session.user) return window.openModal('modal-auth');
  var role = session.user.role;
  document.getElementById('dash-user-name').innerText = 'Welcome, ' + session.user.name;

  var pill = document.getElementById('dash-role-pill');
  pill.innerText = role.replace('_', ' ');
  pill.className = 'text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ' +
    (role === 'super_admin' ? 'bg-red-100 text-red-700' : role === 'admin' ? 'bg-amber-100 text-amber-800' : role === 'faculty' ? 'bg-purple-100 text-purple-800' : 'bg-emerald-100 text-emerald-800');

  document.getElementById('dash-section-student').classList.toggle('hidden', role !== 'student');
  document.getElementById('dash-section-faculty').classList.toggle('hidden', role !== 'faculty');
  document.getElementById('dash-section-management').classList.toggle('hidden', role !== 'admin' && role !== 'super_admin');
  document.getElementById('super-admin-master-card').classList.toggle('hidden', role !== 'super_admin');

  if (role === 'student') {
    renderStudentDashboardFeatures();
  } else if (role === 'faculty') {
    renderFacultyDashboardFeatures();
  } else {
    renderManagementDashboard();
  }

  window.navigateTab('dashboard');
}

// ----------------------------------------------------
// 10 ADVANCED FEATURES FOR STUDENT PROFILE
// ----------------------------------------------------
function renderStudentDashboardFeatures() {
  var cand = students.find(function(s) { return s.ticketNo === session.user.id; }) || session.user.data;
  var container = document.getElementById('student-features-grid');
  if (!container) return;

  container.innerHTML = `
    <!-- 1. Digital Islamic Participation Certificate -->
    <div class="p-4 bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-300 rounded-xl flex flex-col justify-between hover:shadow transition">
      <div>
        <i class="fa-solid fa-certificate text-amber-700 text-2xl mb-2"></i>
        <h4 class="font-bold text-slate-900 text-sm">1. Islamic Participation Certificate</h4>
        <p class="text-xs text-slate-600 mt-1">Official authenticated certificate with Arabic Hadith, candidate particulars & Madarsa seal.</p>
      </div>
      <button onclick="generateParticipationCertificate('${cand.ticketNo}')" class="mt-3 bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 rounded text-xs shadow">
        Generate Certificate
      </button>
    </div>

    <!-- 2. Official Admit Card & Desk Pass -->
    <div class="p-4 bg-emerald-50 border border-emerald-300 rounded-xl flex flex-col justify-between hover:shadow transition">
      <div>
        <i class="fa-solid fa-id-badge text-emerald-800 text-2xl mb-2"></i>
        <h4 class="font-bold text-slate-900 text-sm">2. Official Hall Ticket Admit Card</h4>
        <p class="text-xs text-slate-600 mt-1">Desk: <strong class="text-emerald-900 font-mono">${cand.seat || 'Allocated at Gate'}</strong></p>
      </div>
      <button onclick="displayHallTicket(getStudent('${cand.ticketNo}'))" class="mt-3 bg-emerald-950 hover:bg-emerald-900 text-amber-300 font-bold py-2 rounded text-xs shadow">
        View Admit Card
      </button>
    </div>

    <!-- 3. Desk & Aisle Seating Locator -->
    <div class="p-4 bg-blue-50 border border-blue-300 rounded-xl flex flex-col justify-between hover:shadow transition">
      <div>
        <i class="fa-solid fa-location-dot text-blue-700 text-2xl mb-2"></i>
        <h4 class="font-bold text-slate-900 text-sm">3. Seating Coordinate Finder</h4>
        <p class="text-xs text-slate-600 mt-1">Locate your aisle desk coordinate in Hall A (Boys) or Hall B (Girls).</p>
      </div>
      <button onclick="alert('Your Assigned Seating Desk: ' + '${cand.seat || 'Pending Allotment'}')" class="mt-3 bg-blue-800 hover:bg-blue-900 text-white font-bold py-2 rounded text-xs shadow">
        Locate My Desk
      </button>
    </div>

    <!-- 4. 500+ Words Seerat Hub Study Access -->
    <div class="p-4 bg-slate-50 border rounded-xl flex flex-col justify-between hover:shadow transition">
      <div>
        <i class="fa-solid fa-book-open text-emerald-900 text-2xl mb-2"></i>
        <h4 class="font-bold text-slate-900 text-sm">4. Seerat Study Material & Lineage</h4>
        <p class="text-xs text-slate-600 mt-1">Multi-lingual authentic biography, Ummahat-ul-Momineen & Prophetic lineage.</p>
      </div>
      <button onclick="navigateTab('seerat-hub')" class="mt-3 bg-slate-800 hover:bg-slate-900 text-white font-bold py-2 rounded text-xs">
        Open Study Hub
      </button>
    </div>

    <!-- 5. Previous Exam Model Papers -->
    <div class="p-4 bg-slate-50 border rounded-xl flex flex-col justify-between hover:shadow transition">
      <div>
        <i class="fa-solid fa-file-pdf text-red-600 text-2xl mb-2"></i>
        <h4 class="font-bold text-slate-900 text-sm">5. Model Papers & Keys</h4>
        <p class="text-xs text-slate-600 mt-1">Download previous editions' sample papers and answer evaluations.</p>
      </div>
      <button onclick="navigateTab('model-papers')" class="mt-3 bg-slate-800 hover:bg-slate-900 text-white font-bold py-2 rounded text-xs">
        Download Papers
      </button>
    </div>

    <!-- 6. Exam Day Live Attendance Status -->
    <div class="p-4 bg-slate-50 border rounded-xl flex flex-col justify-between hover:shadow transition">
      <div>
        <i class="fa-solid fa-user-check text-indigo-700 text-2xl mb-2"></i>
        <h4 class="font-bold text-slate-900 text-sm">6. Exam Day Attendance</h4>
        <p class="text-xs text-slate-600 mt-1">Status: <span class="font-bold text-emerald-800 font-mono">${cand.attendance || 'Not Marked Yet'}</span></p>
      </div>
      <span class="text-[11px] text-slate-500 font-semibold mt-3">Verified by Hall Invigilators</span>
    </div>

    <!-- 7. Verified Standing & Award Position -->
    <div class="p-4 bg-slate-50 border rounded-xl flex flex-col justify-between hover:shadow transition">
      <div>
        <i class="fa-solid fa-trophy text-amber-600 text-2xl mb-2"></i>
        <h4 class="font-bold text-slate-900 text-sm">7. Awards & Marks Standing</h4>
        <p class="text-xs text-slate-600 mt-1">Award: <strong class="text-amber-800">${cand.prize || 'Under Evaluation'}</strong> (Marks: ${cand.marks || 0}/100)</p>
      </div>
      <span class="text-[11px] text-slate-500 font-semibold mt-3">Committee Verified</span>
    </div>

    <!-- 8. Committee Helpdesk & Feedback -->
    <div class="p-4 bg-slate-50 border rounded-xl flex flex-col justify-between hover:shadow transition">
      <div>
        <i class="fa-solid fa-comments text-teal-700 text-2xl mb-2"></i>
        <h4 class="font-bold text-slate-900 text-sm">8. Inquiry & Support Desk</h4>
        <p class="text-xs text-slate-600 mt-1">Submit inquiries; committee officials will reply directly via WhatsApp or Email.</p>
      </div>
      <button onclick="navigateTab('feedback')" class="mt-3 bg-teal-800 hover:bg-teal-900 text-white font-bold py-2 rounded text-xs">
        Submit Feedback
      </button>
    </div>

    <!-- 9. Exam Window & Azan Timetable Alerts -->
    <div class="p-4 bg-slate-50 border rounded-xl flex flex-col justify-between hover:shadow transition">
      <div>
        <i class="fa-solid fa-clock text-blue-800 text-2xl mb-2"></i>
        <h4 class="font-bold text-slate-900 text-sm">9. Exam Timetable & Azan Alerts</h4>
        <p class="text-xs text-slate-600 mt-1">Orientation: ${config.prepTime}<br/>Exam: ${config.examTime}</p>
      </div>
      <span class="text-[11px] text-emerald-800 font-bold mt-3">Report to Hall 30 mins prior</span>
    </div>

    <!-- 10. Registration Dossier Archive -->
    <div class="p-4 bg-slate-50 border rounded-xl flex flex-col justify-between hover:shadow transition">
      <div>
        <i class="fa-solid fa-file-contract text-slate-700 text-2xl mb-2"></i>
        <h4 class="font-bold text-slate-900 text-sm">10. Verified Application Dossier</h4>
        <p class="text-xs text-slate-600 mt-1">Formal enrollment application with DOB and verified identity proof record.</p>
      </div>
      <button onclick="displayApplicationForm(getStudent('${cand.ticketNo}'))" class="mt-3 bg-slate-800 hover:bg-slate-900 text-white font-bold py-2 rounded text-xs">
        Download Dossier
      </button>
    </div>
  `;
}

// ----------------------------------------------------
// ADVANCED FACULTY DASHBOARD & ATTENDANCE
// ----------------------------------------------------
function renderFacultyDashboardFeatures() {
  var fac = session.user.data;
  var container = document.getElementById('faculty-assigned-hall');
  if (container) container.innerText = fac.assignedHall || 'Central Hall Examination Wing';
  renderAttendanceTable('faculty-attendance-tbody');
}

function renderAttendanceTable(tbodyId) {
  var tbody = document.getElementById(tbodyId);
  if (!tbody) return;

  tbody.innerHTML = students.map(function(s, idx) {
    return '<tr class="hover:bg-slate-50 text-xs">' +
      '<td class="p-2.5 font-mono font-bold text-red-600">' + s.ticketNo + '</td>' +
      '<td class="p-2.5 font-semibold text-slate-900">' + s.name + '</td>' +
      '<td class="p-2.5 font-bold text-emerald-800">' + (s.seat || 'Unassigned') + '</td>' +
      '<td class="p-2.5">' +
        '<select onchange="updateAttendance(' + idx + ', this.value)" class="border rounded p-1 text-xs font-bold ' +
          (s.attendance === 'Present' ? 'text-emerald-700 bg-emerald-50' : s.attendance === 'Absent' ? 'text-red-700 bg-red-50' : 'text-amber-700 bg-amber-50') + '">' +
          '<option value="Present" ' + (s.attendance === 'Present' ? 'selected' : '') + '>Present</option>' +
          '<option value="Absent" ' + (s.attendance === 'Absent' ? 'selected' : '') + '>Absent</option>' +
          '<option value="Not Interested" ' + (s.attendance === 'Not Interested' ? 'selected' : '') + '>Not Interested</option>' +
        '</select>' +
      '</td>' +
    '</tr>';
  }).join('');
}

window.updateAttendance = function(idx, val) {
  students[idx].attendance = val;
  window.DataStore.set('sm_students', students);
};

// ----------------------------------------------------
// 15 ADVANCED ADMIN & SUPER ADMIN FEATURES
// ----------------------------------------------------
function renderManagementDashboard() {
  renderManagementRoster();
  renderDynamicSeatingMatrix();
  renderFacultyApprovalQueue();
  renderFeedbackManagement();
  syncConfigUI();
}

// 1. DYNAMIC SEATING CONFIGURATION (2x2, 3x3, 4x4, NxN)
window.changeSeatingLayoutType = function(type) {
  config.seatingConfig.layoutType = type;
  if (type === '2x2') { config.seatingConfig.colsPerRow = 4; }
  else if (type === '3x3') { config.seatingConfig.colsPerRow = 6; }
  else if (type === '4x4') { config.seatingConfig.colsPerRow = 8; }
  else if (type === 'nxn') {
    var custom = prompt("Enter total columns per row for Custom NxN layout (e.g., 5, 8, 10):", "6");
    config.seatingConfig.colsPerRow = parseInt(custom) || 6;
  }
  window.DataStore.set('sm_config', config);
  renderDynamicSeatingMatrix();
};

window.renderDynamicSeatingMatrix = function() {
  var container = document.getElementById('dynamic-seating-matrix-preview');
  if (!container) return;

  var layout = config.seatingConfig.layoutType || '2x2';
  var cols = config.seatingConfig.colsPerRow || 4;
  var rowsInput = document.getElementById('cfg-seating-rows');
  var rows = rowsInput ? parseInt(rowsInput.value) || 25 : 25;

  var alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var html = '<div class="space-y-2">';

  for (var r = 1; r <= rows; r++) {
    html += '<div class="flex items-center gap-1.5 p-1.5 bg-slate-50 border rounded text-xs overflow-x-auto">' +
      '<span class="w-14 font-mono font-bold text-slate-500">Row ' + r + '</span>';

    for (var c = 0; c < cols; c++) {
      var seatLabel = 'R' + r + '-' + alphabet[c];
      
      // Add aisle divider
      if ((layout === '2x2' && c === 2) || (layout === '3x3' && c === 3) || (layout === '4x4' && c === 4) || (layout === 'nxn' && c === Math.floor(cols / 2))) {
        html += '<span class="px-1.5 py-0.5 text-[9px] bg-amber-100 text-amber-800 font-bold rounded">AISLE</span>';
      }

      var occ = students.find(function(s) { return s.seat && s.seat.indexOf(seatLabel) !== -1; });
      if (occ) {
        var isBoy = occ.gender === 'M';
        html += '<button onclick="alert(\'Seat ' + seatLabel + ' allocated to: ' + occ.name + ' (' + occ.ticketNo + ')\')" class="px-2 py-1 rounded text-[10px] font-bold border truncate w-20 text-center ' + (isBoy ? 'bg-blue-100 text-blue-900 border-blue-400' : 'bg-pink-100 text-pink-900 border-pink-400') + '">' +
          seatLabel + ' (' + (isBoy ? 'B' : 'G') + ')' +
        '</button>';
      } else {
        html += '<button onclick="manualAssignSeatPrompt(\'' + seatLabel + '\')" class="px-2 py-1 rounded text-[10px] border border-dashed border-slate-300 bg-white hover:border-emerald-700 text-slate-400 w-20 text-center">' +
          seatLabel + ' (Open)' +
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
  if (students.length === 0) return alert('No registered candidates.');
  var cols = config.seatingConfig.colsPerRow || 4;
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
  alert('Seating matrix automatically distributed for all registered candidates.');
};

window.clearSeatingPlan = function() {
  if (confirm('Reset seating plan for all candidates?')) {
    students.forEach(function(s) { s.seat = 'Unassigned'; });
    window.DataStore.set('sm_students', students);
    renderDynamicSeatingMatrix();
    renderManagementRoster();
  }
};

// 2. FACULTY APPROVAL QUEUE (ADMIN / SUPER ADMIN ROLE)
function renderFacultyApprovalQueue() {
  var tbody = document.getElementById('faculty-approval-tbody');
  if (!tbody) return;

  tbody.innerHTML = faculties.map(function(f, idx) {
    return '<tr class="hover:bg-slate-50 text-xs">' +
      '<td class="p-2.5 font-bold text-slate-900">' + f.name + '</td>' +
      '<td class="p-2.5">' + f.dept + '</td>' +
      '<td class="p-2.5 font-mono">' + f.phone + '</td>' +
      '<td class="p-2.5">' +
        '<span class="px-2 py-0.5 rounded text-[10px] font-bold ' + (f.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800') + '">' + f.status + '</span>' +
      '</td>' +
      '<td class="p-2.5 space-x-1 text-center">' +
        (f.status === 'Pending' ? '<button onclick="approveFaculty(' + idx + ')" class="bg-emerald-800 hover:bg-emerald-900 text-white px-2.5 py-1 rounded text-[10px] font-bold">Approve</button>' : '<span class="text-emerald-700 font-bold">Approved</span>') +
        (session.user.role === 'super_admin' ? '<button onclick="removeFaculty(' + idx + ')" class="text-red-600 font-bold hover:underline ml-2">Remove</button>' : '') +
      '</td>' +
    '</tr>';
  }).join('');
}

window.approveFaculty = function(idx) {
  faculties[idx].status = 'Approved';
  window.DataStore.set('sm_faculties', faculties);
  renderFacultyApprovalQueue();
  alert('Faculty profile approved successfully.');
};

window.removeFaculty = function(idx) {
  if (confirm('Delete faculty account?')) {
    faculties.splice(idx, 1);
    window.DataStore.set('sm_faculties', faculties);
    renderFacultyApprovalQueue();
  }
};

// 3. FEEDBACK DESK WITH TWO-WAY WHATSAPP & EMAIL REPLIES
function renderFeedbackManagement() {
  var tbody = document.getElementById('admin-feedback-tbody');
  if (!tbody) return;

  tbody.innerHTML = feedbacks.map(function(fb, idx) {
    var cleanPhone = fb.phone.replace(/[^0-9]/g, '');
    var waLink = 'https://wa.me/91' + cleanPhone + '?text=' + encodeURIComponent('Salam ' + fb.name + ', regarding your inquiry at Shahi Masjid Seerat Portal: ');
    var mailLink = 'mailto:' + (fb.email || '') + '?subject=' + encodeURIComponent('Response: Seerat Competition Inquiry') + '&body=' + encodeURIComponent('Salam ' + fb.name + ',\n\nIn response to your query: "' + fb.message + '"\n\n');

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

// 4. CANDIDATE ROSTER & DYNAMIC PRIZE ALLOTMENT
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

  tbody.innerHTML = students.map(function(s, idx) {
    return '<tr class="hover:bg-slate-50 text-xs">' +
      '<td class="p-2.5 font-mono font-bold text-red-600">' + s.ticketNo + '</td>' +
      '<td class="p-2.5 font-semibold text-slate-900">' + s.name + '</td>' +
      '<td class="p-2.5">' + s.father + '</td>' +
      '<td class="p-2.5 font-bold text-emerald-800">' + (s.seat || 'Unassigned') + '</td>' +
      '<td class="p-2.5 font-bold text-amber-800">' + (s.prize || 'None') + '</td>' +
      '<td class="p-2.5 font-bold">' + (s.attendance || 'Not Marked') + '</td>' +
      '<td class="p-2.5 text-center space-x-1">' +
        '<button onclick="openEditCandidateModal(' + idx + ')" class="text-blue-600 hover:underline font-bold">Manage & Assign</button>' +
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
        '<span class="px-2 py-0.5 rounded text-[10px] font-bold ' + (s.status === 'Blocked' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-800') + '">' + s.status + '</span>' +
      '</div>' +
      '<h4 class="font-bold text-slate-900">' + s.name + '</h4>' +
      '<p class="text-slate-500">Father: ' + s.father + ' | DOB: ' + (s.dob || 'N/A') + '</p>' +
      '<p class="text-emerald-900 font-semibold">Seat: ' + (s.seat || 'Unassigned') + '</p>' +
      '<p class="text-amber-800 font-bold">Prize: ' + (s.prize || 'None') + '</p>' +
      '<div class="pt-2 border-t flex justify-end gap-2 text-[11px]">' +
        '<button onclick="openEditCandidateModal(' + idx + ')" class="text-blue-600 font-bold hover:underline">Manage</button>' +
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
  document.getElementById('edit-cand-seat').value = c.seat || '';
  document.getElementById('edit-cand-marks').value = c.marks || 0;
  document.getElementById('edit-cand-status').value = c.status;
  document.getElementById('edit-cand-prize').value = c.prize || 'None';
  document.getElementById('edit-cand-newpwd').value = '';
  window.openModal('modal-edit-candidate');
};

window.saveCandidateModifications = function(e) {
  e.preventDefault();
  var idx = document.getElementById('edit-cand-index').value;
  var c = students[idx];
  c.name = document.getElementById('edit-cand-name').value.trim();
  c.father = document.getElementById('edit-cand-father').value.trim();
  c.seat = document.getElementById('edit-cand-seat').value.trim();
  c.marks = parseInt(document.getElementById('edit-cand-marks').value) || 0;
  c.status = document.getElementById('edit-cand-status').value;
  c.prize = document.getElementById('edit-cand-prize').value;
  var newPwd = document.getElementById('edit-cand-newpwd').value.trim();
  if (newPwd) c.password = newPwd;

  students[idx] = c;
  window.DataStore.set('sm_students', students);
  window.closeModal('modal-edit-candidate');
  renderManagementRoster();
  renderDynamicSeatingMatrix();
  alert('Candidate modifications and prize assignment saved successfully.');
};

window.deleteCandidate = function(idx) {
  if (confirm('Super Admin Verification: Delete candidate ' + students[idx].ticketNo + '?')) {
    students.splice(idx, 1);
    window.DataStore.set('sm_students', students);
    renderManagementRoster();
    renderDynamicSeatingMatrix();
  }
};

window.saveSuperAdminConfig = function() {
  config.masjidTitle = document.getElementById('cfg-masjid-title').value.trim();
  config.examDate = document.getElementById('cfg-date-time').value.trim();
  config.prepTime = document.getElementById('cfg-prep-time').value.trim();
  config.examTime = document.getElementById('cfg-exam-time').value.trim();
  config.pocContact = document.getElementById('cfg-poc').value.trim();
  config.masjidContact = document.getElementById('cfg-masjid-contact').value.trim();
  config.examVenue = document.getElementById('cfg-venue').value.trim();
  config.youtube = document.getElementById('cfg-yt').value.trim();
  config.facebook = document.getElementById('cfg-fb').value.trim();
  config.whatsappChannel = document.getElementById('cfg-wa').value.trim();

  config.prayers.forEach(function(p, idx) {
    p.adhan = document.getElementById('cfg-p-adhan-' + idx).value;
    p.iqama = document.getElementById('cfg-p-iqama-' + idx).value;
  });

  window.DataStore.set('sm_config', config);
  syncConfigUI();
  renderPrayerTimes();
  renderSocialRibbon();
  alert('Global institutional configurations updated successfully.');
};

// ----------------------------------------------------
// PROFESSIONAL ISLAMIC PARTICIPATION CERTIFICATE GENERATOR
// ----------------------------------------------------
window.generateParticipationCertificate = function(ticketNo) {
  var cand = students.find(function(s) { return s.ticketNo === ticketNo; });
  if (!cand) return alert('Candidate record not found.');

  var certHTML = `
    <div class="border-8 border-double border-amber-600 p-8 bg-[#fdfcf7] text-slate-900 rounded shadow-xl relative overflow-hidden">
      <!-- Watermark Background -->
      <div class="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none text-9xl font-arabic text-emerald-950">
        محمد ﷺ
      </div>

      <!-- Top Bismillah & Institutional Header -->
      <div class="text-center space-y-1 relative z-10">
        <p class="font-arabic text-3xl font-bold text-emerald-950">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</p>
        <h2 class="font-cinzel text-xl md:text-2xl font-black text-emerald-900 uppercase tracking-wide">${config.masjidTitle}</h2>
        <p class="text-xs font-bold text-amber-800 uppercase tracking-widest">${config.masjidSub}</p>
        <div class="h-0.5 bg-gradient-to-r from-transparent via-amber-600 to-transparent w-3/4 mx-auto my-3"></div>
      </div>

      <!-- Certificate Title -->
      <div class="text-center my-4 relative z-10">
        <span class="inline-block px-4 py-1 bg-amber-100 text-amber-900 font-serif italic text-sm border border-amber-300 rounded-full font-bold">
          Certificate of Active Participation
        </span>
        <h3 class="font-cinzel text-lg md:text-xl font-bold text-emerald-950 mt-2">${config.compTitle}</h3>
        <p class="text-xs text-slate-600 font-medium">${config.compSubtitle}</p>
      </div>

      <!-- Hadith Citation Box -->
      <div class="my-5 p-4 bg-emerald-50/80 border border-emerald-300 rounded-lg text-center space-y-1.5 relative z-10">
        <p class="font-arabic text-lg text-emerald-950 font-bold" dir="rtl">
          « مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ »
        </p>
        <p class="text-xs font-serif italic text-emerald-900">
          "Whoever treads a path seeking knowledge, Allah will make easy for him a path to Paradise."
        </p>
        <span class="text-[10px] text-amber-800 font-bold block">(Sahih Muslim: 2699)</span>
      </div>

      <!-- Participant Details -->
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

      <!-- Signatures & Madarsa Official Seal -->
      <div class="mt-8 pt-4 border-t border-amber-300 flex justify-between items-end relative z-10 text-xs">
        <div class="text-center space-y-1">
          <div class="font-arabic text-sm text-emerald-900 font-bold">احسن بن محمد الحمومي</div>
          <div class="w-36 h-0.5 bg-slate-400 mx-auto"></div>
          <span class="font-bold text-emerald-950 block text-[11px]">Molana Dr. Ahsan Al Hamoomee</span>
          <span class="text-[9px] text-slate-500">Patron & President</span>
        </div>

        <div class="w-24 h-24 rounded-full border-2 border-emerald-900 flex flex-col items-center justify-center p-1 text-center bg-emerald-50 shadow-inner">
          <i class="fa-solid fa-certificate text-amber-600 text-lg mb-0.5"></i>
          <span class="text-[7px] font-black uppercase text-emerald-950 leading-tight">MADARSA AL HAMOOMEA</span>
          <span class="text-[6px] text-amber-800 font-bold">OFFICIAL SEAL</span>
          <span class="text-[6px] text-slate-500 font-mono mt-0.5">Verified 2026</span>
        </div>

        <div class="text-center space-y-1">
          <div class="font-serif italic text-sm text-emerald-900 font-bold">Munavar Zama</div>
          <div class="w-36 h-0.5 bg-slate-400 mx-auto"></div>
          <span class="font-bold text-emerald-950 block text-[11px]">Janab Munavar Zama Sahab</span>
          <span class="text-[9px] text-slate-500">Distinguished Chief Guest</span>
        </div>
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
// FACULTY REGISTRATION HANDLER
// ----------------------------------------------------
window.handleFacultyRegister = function(e) {
  e.preventDefault();
  var fac = {
    id: "FAC-" + (faculties.length + 101),
    name: document.getElementById('fac-reg-name').value.trim(),
    email: document.getElementById('fac-reg-email').value.trim(),
    phone: document.getElementById('fac-reg-phone').value.trim(),
    dept: document.getElementById('fac-reg-dept').value,
    assignedHall: document.getElementById('fac-reg-hall').value,
    status: "Pending",
    role: "faculty"
  };

  faculties.push(fac);
  window.DataStore.set('sm_faculties', faculties);
  alert('Faculty Registration Submitted!\nYour profile is currently Pending Approval by Admin or Super Admin.');
  window.navigateTab('home');
};

// ----------------------------------------------------
// STUDENT REGISTRATION HANDLER
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
  var appId = 'APP-HAMOOMEA-2026-' + (students.length + 1001);

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
    idNumber: "[Govt ID Verified]",
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
    registeredDate: new Date().toLocaleDateString('en-IN')
  };

  students.push(cand);
  window.DataStore.set('sm_students', students);

  saveSession({ id: cand.ticketNo, name: cand.name, role: 'student', data: cand }, true);
  alert('Enrollment Complete!\nAllotted Hall Ticket ID: ' + ticketNo + '\nAllocated Seat: ' + seat);
  displayHallTicket(cand);
};

// ----------------------------------------------------
// FEEDBACK DISPATCH HANDLER
// ----------------------------------------------------
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
  alert('Your message has been sent to the Mosque Committee. We will reply promptly via WhatsApp or Email.');
  document.getElementById('fb-msg').value = '';
  window.navigateTab('home');
};

// ----------------------------------------------------
// DOCUMENT PRINTERS & PDF GENERATOR
// ----------------------------------------------------
window.displayHallTicket = function(cand) {
  var area = document.getElementById('printable-document');
  area.innerHTML = '<div class="border-b-2 border-emerald-900 pb-3 mb-4 flex justify-between items-center">' +
    '<div>' +
      '<h2 class="text-lg font-black text-emerald-950 font-cinzel">' + config.compTitle + '</h2>' +
      '<p class="text-[11px] text-gray-600 font-bold uppercase">' + config.masjidTitle + '</p>' +
      '<p class="text-[10px] text-emerald-800 font-semibold">' + config.masjidSub + '</p>' +
    '</div>' +
    '<div class="text-right">' +
      '<span class="text-[10px] text-gray-500 font-bold uppercase block">Official Hall Ticket Number</span>' +
      '<span class="text-lg font-mono font-black text-red-600">' + cand.ticketNo + '</span>' +
    '</div>' +
  '</div>' +

  '<div class="grid grid-cols-12 gap-4">' +
    '<div class="col-span-8 space-y-2 text-xs">' +
      '<p><strong>Candidate Name:</strong> <span class="uppercase font-bold text-slate-900">' + cand.name + '</span></p>' +
      '<p><strong>Father\'s Name:</strong> <span class="uppercase font-semibold">' + cand.father + '</span></p>' +
      '<p><strong>Date of Birth:</strong> ' + (cand.dob || 'Verified') + ' | <strong>Gender:</strong> ' + (cand.gender === 'M' ? 'Male Candidate' : 'Female Candidate') + '</p>' +
      '<p><strong>Academic Category:</strong> <span class="font-bold text-emerald-900">' + cand.category + '</span></p>' +
      '<div class="p-2.5 bg-amber-50 border border-amber-300 rounded space-y-0.5">' +
        '<p class="text-xs"><strong>Allocated Aeroplane Desk:</strong> <span class="font-mono text-sm font-black text-red-700">' + (cand.seat || 'Allocated at Gate') + '</span></p>' +
        '<p class="text-[11px] text-emerald-900"><strong>Reporting & Prep:</strong> ' + config.prepTime + '</p>' +
        '<p class="text-[11px] text-red-700"><strong>Exam Timing:</strong> ' + config.examTime + '</p>' +
      '</div>' +
      '<p><strong>Exam Date:</strong> ' + config.examDate + '</p>' +
      '<p><strong>Venue:</strong> ' + config.examVenue + '</p>' +
    '</div>' +

    '<div class="col-span-4 flex flex-col items-center justify-between border-l pl-4 space-y-3">' +
      '<div class="w-28 h-32 border-2 border-dashed border-slate-400 bg-slate-50 flex flex-col items-center justify-center text-center p-1 rounded text-[10px] text-slate-500">' +
        '<i class="fa-regular fa-user text-xl mb-1 text-slate-400"></i>' +
        '<span>Affix Passport Photo</span>' +
      '</div>' +

      '<div class="w-28 h-28 rounded-full border-2 border-emerald-900 flex flex-col items-center justify-center text-center p-1.5 bg-emerald-50/50 shadow-inner">' +
        '<i class="fa-solid fa-certificate text-amber-600 text-sm mb-0.5"></i>' +
        '<span class="text-[8px] font-black uppercase text-emerald-950 leading-tight">MADARSA AL HAMOOMEA</span>' +
        '<span class="text-[7px] text-amber-800 font-bold">OFFICIAL SEAL</span>' +
        '<span class="text-[7px] text-slate-500 font-mono mt-0.5">Verified & Valid</span>' +
      '</div>' +
    '</div>' +
  '</div>' +

  '<div class="mt-6 border-t pt-3 flex justify-between items-center text-[10px] text-slate-600">' +
    '<span>* Present this Admit Card with your Government ID at the entry hall.</span>' +
    '<span class="font-bold text-emerald-950">Authorized Registrar Stamp & Signature</span>' +
  '</div>';

  window.navigateTab('printable');
};

window.displayApplicationForm = function(cand) {
  var area = document.getElementById('printable-document');
  area.innerHTML = '<div class="text-center border-b-2 border-amber-600 pb-3 mb-4">' +
    '<p class="font-arabic text-xl font-bold text-emerald-950 leading-none">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</p>' +
    '<h2 class="text-base font-extrabold text-emerald-950 uppercase font-cinzel mt-1">' + config.masjidTitle + '</h2>' +
    '<p class="text-[11px] font-semibold text-amber-700">' + config.masjidSub + '</p>' +
    '<p class="text-[10px] text-slate-600 font-bold">' + config.compTitle + '</p>' +
  '</div>' +
  '<div class="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded border">' +
    '<p><strong>Application ID:</strong> ' + cand.appId + '</p>' +
    '<p><strong>Hall Ticket No:</strong> <span class="text-red-600 font-bold">' + cand.ticketNo + '</span></p>' +
    '<p><strong>Candidate:</strong> ' + cand.name + '</p>' +
    '<p><strong>Father:</strong> ' + cand.father + '</p>' +
    '<p><strong>DOB:</strong> ' + cand.dob + '</p>' +
    '<p><strong>Identity Proof:</strong> ' + cand.idType + '</p>' +
    '<p><strong>Assigned Seat:</strong> ' + cand.seat + '</p>' +
    '<p><strong>Status:</strong> ' + cand.status + '</p>' +
  '</div>';
  window.navigateTab('printable');
};

window.pullAllApplicationForms = function() {
  if (students.length === 0) return alert('No applications registered.');
  var area = document.getElementById('printable-document');
  area.innerHTML = students.map(function(cand, idx) {
    var pb = idx < students.length - 1 ? 'page-break' : '';
    return '<div class="' + pb + ' p-4 mb-4 border-b">' +
      '<h3 class="font-bold text-sm text-emerald-950">' + cand.name + ' (' + cand.ticketNo + ')</h3>' +
      '<p class="text-xs">Father: ' + cand.father + ' | DOB: ' + cand.dob + ' | Seat: ' + cand.seat + '</p>' +
      '<p class="text-xs font-bold text-amber-800">Status: ' + cand.status + ' | Prize: ' + cand.prize + '</p>' +
    '</div>';
  }).join('');
  window.navigateTab('printable');
};

window.downloadPDFDoc = function() {
  var el = document.getElementById('printable-document');
  html2pdf().set({
    margin: 6,
    filename: 'Madarsa_Seerat_Document.pdf',
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

  if (!cand) return alert('Verification failed: Mobile, name, and father name did not match.');

  if (type === 'ticket') displayHallTicket(cand);
  else displayApplicationForm(cand);
};
