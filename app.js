// app.js - Full functional engine compatible with direct script loading
var config = window.DataStore.get('sm_config', window.INITIAL_CONFIG);
var students = window.DataStore.get('sm_students', []);
var notices = window.DataStore.get('sm_notices', window.INITIAL_NOTICES);
var papers = window.DataStore.get('sm_papers', window.INITIAL_PAPERS);
var feedbacks = window.DataStore.get('sm_feedbacks', []);
var session = getPersistentSession();

// Attach handlers to window
window.dismissGreeting = function() {
  document.getElementById('greeting-overlay').classList.add('hidden');
};

window.navigateTab = function(tabId) {
  var tabs = ['home', 'competitions', 'model-papers', 'doc-lookup', 'results-public', 'feedback', 'printable', 'dashboard'];
  tabs.forEach(function(id) {
    var el = document.getElementById('tab-' + id);
    if (el) el.classList.add('hidden');
  });
  var target = document.getElementById('tab-' + tabId);
  if (target) target.classList.remove('hidden');
  window.scrollTo(0, 0);
};

window.openModal = function(id) {
  var el = document.getElementById(id);
  if (el) {
    el.classList.remove('hidden');
    el.classList.add('flex');
  }
};

window.closeModal = function(id) {
  var el = document.getElementById(id);
  if (el) {
    el.classList.add('hidden');
    el.classList.remove('flex');
  }
};

window.addEventListener('DOMContentLoaded', function() {
  startLiveClock();
  renderPrayerTimes();
  renderNotices();
  renderModelPapers();
  syncConfigUI();
  updateAuthUI();
  renderSeatingMatrixPreview();
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
  setText('txt-juma-announcement', config.jumaLine);
  setText('ribbon-poc', config.pocContact);

  setVal('cfg-masjid-title', config.masjidTitle);
  setVal('cfg-date-time', config.examDate);
  setVal('cfg-prep-time', config.prepTime);
  setVal('cfg-exam-time', config.examTime);
  setVal('cfg-poc', config.pocContact);
  setVal('cfg-masjid-contact', config.masjidContact);
  setVal('cfg-venue', config.examVenue);
  renderPrayerConfigGrid();
}

function renderPrayerTimes() {
  var container = document.getElementById('prayer-time-table');
  if (!container) return;
  container.innerHTML = config.prayers.map(function(p) {
    return '<div class="flex justify-between items-center py-1.5 border-b border-slate-100">' +
      '<span class="font-bold text-slate-800">' + p.name + '</span>' +
      '<div class="space-x-3">' +
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

window.addNewModelPaper = function() {
  var title = document.getElementById('new-paper-title').value.trim();
  var year = document.getElementById('new-paper-year').value.trim();
  var url = document.getElementById('new-paper-url').value.trim();
  if (!title || !url) return alert('Enter title and paper URL');

  papers.unshift({ id: Date.now(), title: title, year: year || '2026', url: url });
  window.DataStore.set('sm_papers', papers);
  renderModelPapers();
  alert('Model paper uploaded.');
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
    slot.innerHTML = '<button onclick="navigateTab(\'dashboard\')" class="bg-amber-400 text-emerald-950 px-3 py-1 rounded-full font-bold">' +
      'Dashboard (' + session.user.name + ')' +
    '</button>';
  } else {
    slot.innerHTML = '<button onclick="openModal(\'modal-auth\')" class="bg-amber-400 text-emerald-950 px-3.5 py-1.5 rounded-full font-bold">' +
      'Login' +
    '</button>';
  }
}

window.handleUniversalLogin = function(e) {
  e.preventDefault();
  var id = document.getElementById('login-id').value.trim();
  var pwd = document.getElementById('login-pwd').value.trim();
  var remember = document.getElementById('login-save-24h').checked;

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

  var found = students.find(function(s) {
    return (s.phone === id || s.email === id || s.ticketNo === id) && s.password === pwd;
  });

  if (found) {
    if (found.status === 'Blocked') return alert('Your profile is blocked due to duplicate verification conflict. Contact committee.');
    saveSession({ id: found.ticketNo, name: found.name, role: 'student', data: found }, remember);
    window.closeModal('modal-auth');
    openDashboard();
    return;
  }

  alert('Invalid credentials.');
};

window.handleStudentRegister = function(e) {
  e.preventDefault();
  var dob = document.getElementById('reg-dob').value;
  var idNumber = document.getElementById('reg-id-number').value.trim().toUpperCase();

  var isDuplicate = students.some(function(s) {
    return s.dob === dob && s.idNumber === idNumber;
  });

  if (isDuplicate) {
    alert('Duplicate Registration Error: A candidate with this Date of Birth and Government ID Number already exists.');
    return;
  }

  var category = document.getElementById('reg-category').value;
  var gender = document.getElementById('reg-gender').value;
  var attemptEl = document.querySelector('input[name="reg-attempt"]:checked');
  var attempt = attemptEl ? attemptEl.value : '1st Time (New Applicant)';
  var seq = 1000 + students.length + 1;
  var ticketNo = 'SUN-' + category + '-' + gender + '-' + seq;
  var appId = 'APP-HAMOOMEA-2026-' + seq;

  var hall = gender === 'M' ? 'Hall A (Boys)' : 'Hall B (Girls)';
  var seat = hall + ' - Desk #' + ((students.length % 50) + 1);

  var cand = {
    appId: appId,
    ticketNo: ticketNo,
    name: document.getElementById('reg-name').value.trim(),
    father: document.getElementById('reg-father').value.trim(),
    dob: dob,
    phone: document.getElementById('reg-phone').value.trim(),
    email: document.getElementById('reg-email').value.trim() || 'N/A',
    idType: document.getElementById('reg-id-type').value,
    idNumber: idNumber,
    category: category,
    gender: gender,
    attempt: attempt,
    seat: seat,
    address: document.getElementById('reg-address').value.trim(),
    password: document.getElementById('reg-password').value,
    marks: 0,
    status: 'Enrolled',
    registeredDate: new Date().toLocaleDateString('en-IN')
  };

  students.push(cand);
  window.DataStore.set('sm_students', students);

  saveSession({ id: cand.ticketNo, name: cand.name, role: 'student', data: cand }, true);
  alert('Registration Complete!\nHall Ticket: ' + ticketNo + '\nAssigned Desk: ' + seat);
  displayHallTicket(cand);
};

window.autoGenerateSeatingPlan = function() {
  if (students.length === 0) return alert('No registered students to seat.');
  var m = 1, f = 1;
  students.forEach(function(s) {
    if (s.gender === 'M') s.seat = 'Hall A (Boys) - Desk #' + (m++);
    else s.seat = 'Hall B (Girls) - Desk #' + (f++);
  });
  window.DataStore.set('sm_students', students);
  renderSeatingMatrixPreview();
  renderManagementRoster();
  alert('Seating plan matrix automatically created.');
};

window.clearSeatingPlan = function() {
  if (confirm('Reset seating plan for all students?')) {
    students.forEach(function(s) { s.seat = 'Unassigned'; });
    window.DataStore.set('sm_students', students);
    renderSeatingMatrixPreview();
    renderManagementRoster();
  }
};

function renderSeatingMatrixPreview() {
  var container = document.getElementById('seating-matrix-preview');
  if (!container) return;
  if (students.length === 0) {
    container.innerHTML = '<span class="text-gray-400 p-2 col-span-full">No candidates enrolled yet.</span>';
    return;
  }
  container.innerHTML = students.map(function(s) {
    var bg = s.gender === 'M' ? 'bg-blue-50 border-blue-200' : 'bg-pink-50 border-pink-200';
    return '<div class="p-2 border rounded ' + bg + '">' +
      '<span class="font-mono font-bold text-red-700 block">' + s.ticketNo + '</span>' +
      '<span class="font-semibold text-slate-800 truncate block">' + s.name + '</span>' +
      '<span class="text-[10px] font-bold text-emerald-800 block mt-1"><i class="fa-solid fa-chair mr-0.5"></i> ' + (s.seat || 'Unassigned') + '</span>' +
    '</div>';
  }).join('');
}

function openDashboard() {
  if (!session || !session.user) return window.openModal('modal-auth');
  var role = session.user.role;
  document.getElementById('dash-user-name').innerText = 'Welcome, ' + session.user.name;

  var pill = document.getElementById('dash-role-pill');
  pill.innerText = role.replace('_', ' ');
  pill.className = 'text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ' +
    (role === 'super_admin' ? 'bg-red-100 text-red-700' : role === 'admin' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800');

  document.getElementById('dash-section-student').classList.toggle('hidden', role !== 'student');
  document.getElementById('dash-section-management').classList.toggle('hidden', role === 'student');
  document.getElementById('super-admin-master-card').classList.toggle('hidden', role !== 'super_admin');

  if (role === 'student') {
    var cand = students.find(function(s) { return s.ticketNo === session.user.id; }) || session.user.data;
    document.getElementById('student-prep-time').innerText = config.prepTime;
    document.getElementById('student-exam-time').innerText = config.examTime;
    document.getElementById('student-dash-seat-badge').innerText = cand.seat || 'Allocated at Gate';
    document.getElementById('student-dash-result-box').innerHTML = 'Marks: <span class="text-emerald-800 font-bold font-mono">' + (cand.marks || 0) + '/100</span> | Status: <span class="text-amber-800 font-bold">' + cand.status + '</span>';
  } else {
    renderManagementRoster();
    renderSeatingMatrixPreview();
    syncConfigUI();
  }

  window.navigateTab('dashboard');
}

function renderManagementRoster() {
  var tbody = document.getElementById('admin-roster-tbody');
  if (!tbody) return;
  tbody.innerHTML = students.map(function(s, idx) {
    var badgeClass = s.status === 'Blocked' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-800';
    return '<tr class="hover:bg-slate-50 text-xs">' +
      '<td class="p-2.5 font-mono font-bold text-red-600">' + s.ticketNo + '</td>' +
      '<td class="p-2.5 font-semibold">' + s.name + '</td>' +
      '<td class="p-2.5">' + s.father + '</td>' +
      '<td class="p-2.5">' + (s.dob || 'N/A') + '</td>' +
      '<td class="p-2.5">' + s.category + ' (' + s.gender + ')</td>' +
      '<td class="p-2.5 font-bold text-emerald-800">' + (s.seat || 'Unassigned') + '</td>' +
      '<td class="p-2.5"><span class="px-2 py-0.5 rounded text-[10px] font-bold ' + badgeClass + '">' + s.status + '</span></td>' +
      '<td class="p-2.5 text-center space-x-1">' +
        '<button onclick="openEditCandidateModal(' + idx + ')" class="text-blue-600 hover:underline">Edit</button>' +
        '<button onclick="displayHallTicket(students[' + idx + '])" class="text-emerald-700 hover:underline">Ticket</button>' +
        (session.user.role === 'super_admin' ? '<button onclick="deleteCandidate(' + idx + ')" class="text-red-600 hover:underline">Delete</button>' : '') +
      '</td>' +
    '</tr>';
  }).join('');
}

window.filterRosterTable = function() {
  var q = document.getElementById('roster-search').value.toLowerCase();
  document.querySelectorAll('#admin-roster-tbody tr').forEach(function(r) {
    r.style.display = r.innerText.toLowerCase().includes(q) ? '' : 'none';
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
  var newPwd = document.getElementById('edit-cand-newpwd').value.trim();
  if (newPwd) c.password = newPwd;

  students[idx] = c;
  window.DataStore.set('sm_students', students);
  window.closeModal('modal-edit-candidate');
  renderManagementRoster();
  renderSeatingMatrixPreview();
  alert('Candidate modifications saved.');
};

window.deleteCandidate = function(idx) {
  if (confirm('Super Admin Verification: Delete candidate ' + students[idx].ticketNo + '?')) {
    students.splice(idx, 1);
    window.DataStore.set('sm_students', students);
    renderManagementRoster();
    renderSeatingMatrixPreview();
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

  config.prayers.forEach(function(p, idx) {
    p.adhan = document.getElementById('cfg-p-adhan-' + idx).value;
    p.iqama = document.getElementById('cfg-p-iqama-' + idx).value;
  });

  window.DataStore.set('sm_config', config);
  syncConfigUI();
  renderPrayerTimes();
  alert('Global timings, POC details, and prayer times updated successfully.');
};

window.showCurrentStudentDoc = function(type) {
  var cand = students.find(function(s) { return s.ticketNo === session.user.id; }) || session.user.data;
  if (type === 'ticket') displayHallTicket(cand);
  else displayApplicationForm(cand);
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

  if (!cand) return alert('Verification failed: Mobile, name, and father name did not match any record.');

  if (type === 'ticket') displayHallTicket(cand);
  else displayApplicationForm(cand);
};

window.displayHallTicket = function(cand) {
  var area = document.getElementById('printable-document');
  area.innerHTML = '<div class="border-b-2 border-emerald-900 pb-3 mb-4 flex justify-between items-center">' +
    '<div>' +
      '<h2 class="text-lg font-black text-emerald-950 font-cinzel">' + config.compTitle + '</h2>' +
      '<p class="text-[11px] text-gray-600 font-bold uppercase">' + config.masjidTitle + '</p>' +
      '<p class="text-[10px] text-emerald-800 font-semibold">' + config.masjidSub + '</p>' +
    '</div>' +
    '<div class="text-right">' +
      '<span class="text-[10px] text-gray-500 font-bold uppercase block">Hall Ticket Number</span>' +
      '<span class="text-lg font-mono font-black text-red-600">' + cand.ticketNo + '</span>' +
    '</div>' +
  '</div>' +
  '<div class="grid grid-cols-12 gap-4">' +
    '<div class="col-span-8 space-y-2 text-xs">' +
      '<p><strong>Candidate Name:</strong> <span class="uppercase font-bold">' + cand.name + '</span></p>' +
      '<p><strong>Father\'s Name:</strong> <span class="uppercase">' + cand.father + '</span></p>' +
      '<p><strong>Date of Birth:</strong> ' + (cand.dob || 'Verified') + '</p>' +
      '<p><strong>Category:</strong> <span class="font-bold text-emerald-900">' + cand.category + '</span> (' + (cand.gender === 'M' ? 'Male Candidate' : 'Female Candidate') + ')</p>' +
      '<div class="p-2 bg-amber-50 border border-amber-300 rounded">' +
        '<p><strong>Assigned Seating Desk:</strong> <span class="text-sm font-black text-red-700">' + (cand.seat || 'Allocated at Gate') + '</span></p>' +
        '<p class="text-[11px] text-emerald-900"><strong>Reporting & Prep:</strong> ' + config.prepTime + '</p>' +
        '<p class="text-[11px] text-red-700"><strong>Exam Timing:</strong> ' + config.examTime + '</p>' +
      '</div>' +
      '<p><strong>Exam Date:</strong> ' + config.examDate + '</p>' +
      '<p><strong>Venue:</strong> ' + config.examVenue + '</p>' +
    '</div>' +
    '<div class="col-span-4 flex flex-col items-center justify-between border-l pl-4">' +
      '<div class="w-28 h-32 border-2 border-dashed border-slate-400 bg-slate-50 flex flex-col items-center justify-center text-center p-1 rounded text-[10px] text-slate-500">' +
        '<i class="fa-regular fa-user text-xl mb-1 text-slate-400"></i>' +
        '<span>Affix Recent Passport Photo</span>' +
      '</div>' +
      '<div class="mt-2 text-center">' +
        '<div id="ticket-qr" class="p-1 border bg-white inline-block"></div>' +
        '<span class="block text-[8px] text-slate-400 uppercase mt-0.5">Invigilator Scan QR</span>' +
      '</div>' +
    '</div>' +
  '</div>';

  new QRCode(document.getElementById('ticket-qr'), {
    text: 'VERIFY|HT:' + cand.ticketNo + '|NAME:' + cand.name + '|SEAT:' + cand.seat + '|DOB:' + cand.dob,
    width: 80,
    height: 80
  });

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
    '<p><strong>Identity Proof:</strong> ' + cand.idType + ' (' + cand.idNumber + ')</p>' +
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
      '<p class="text-xs">Father: ' + cand.father + ' | DOB: ' + cand.dob + ' | Govt ID: ' + cand.idNumber + '</p>' +
      '<p class="text-xs font-bold text-amber-800">Seat Desk: ' + cand.seat + ' | Status: ' + cand.status + '</p>' +
    '</div>';
  }).join('');
  window.navigateTab('printable');
};

window.handlePublicResultLookup = function() {
  var ht = document.getElementById('public-ht-input').value.trim().toUpperCase();
  var resBox = document.getElementById('public-result-display');
  var cand = students.find(function(s) { return s.ticketNo === ht; });
  if (!cand) {
    resBox.classList.remove('hidden');
    resBox.innerHTML = '<span class="text-xs text-red-600 font-bold">No record found for Hall Ticket "' + ht + '".</span>';
    return;
  }
  resBox.classList.remove('hidden');
  resBox.innerHTML = '<h4 class="text-sm font-bold text-slate-900">' + cand.name + ' (' + cand.ticketNo + ')</h4>' +
    '<p class="text-xs"><strong>Seat:</strong> ' + cand.seat + ' | <strong>Score:</strong> <span class="font-bold text-emerald-800 font-mono">' + cand.marks + '/100</span></p>' +
    '<p class="text-xs"><strong>Status:</strong> ' + cand.status + '</p>';
};

window.handleFeedbackSubmit = function(e) {
  e.preventDefault();
  feedbacks.unshift({
    name: document.getElementById('fb-name').value.trim(),
    phone: document.getElementById('fb-phone').value.trim(),
    message: document.getElementById('fb-msg').value.trim(),
    date: new Date().toLocaleDateString('en-IN')
  });
  window.DataStore.set('sm_feedbacks', feedbacks);
  alert('Query dispatched to committee.');
  document.getElementById('fb-msg').value = '';
  window.navigateTab('home');
};

window.downloadPDFDoc = function() {
  var el = document.getElementById('printable-document');
  html2pdf().set({
    margin: 6,
    filename: 'Madarsa_Seerat_Record.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  }).from(el).save();
};
