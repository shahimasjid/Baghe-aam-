// app.js - Aeroplane 2x2 Seating, Gender Auto-ID, Seerat Hub & Stamp Layout
var config = window.DataStore.get('sm_config', window.INITIAL_CONFIG);
var students = window.DataStore.get('sm_students', []);
var notices = window.DataStore.get('sm_notices', window.INITIAL_NOTICES);
var papers = window.DataStore.get('sm_papers', window.INITIAL_PAPERS);
var feedbacks = window.DataStore.get('sm_feedbacks', []);
var session = getPersistentSession();

window.dismissGreeting = function() {
  document.getElementById('greeting-overlay').classList.add('hidden');
};

window.navigateTab = function(tabId) {
  var tabs = ['home', 'competitions', 'seerat-hub', 'model-papers', 'doc-lookup', 'results-public', 'feedback', 'printable', 'dashboard'];
  tabs.forEach(function(id) {
    var el = document.getElementById('tab-' + id);
    if (el) el.classList.add('hidden');
  });
  var target = document.getElementById('tab-' + tabId);
  if (target) target.classList.remove('hidden');
  window.scrollTo(0, 0);

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
  setText('txt-juma-announcement', config.jumaLine);
  setText('ribbon-poc', config.pocContact);

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
  alert('Model paper published.');
};

// TRILINGUAL SEERAT HUB RENDERER
window.renderSeeratHubContent = function() {
  var lang = document.getElementById('seerat-lang-select').value || 'en';
  var data = window.SEERAT_KNOWLEDGE_BASE[lang] || window.SEERAT_KNOWLEDGE_BASE['en'];
  var container = document.getElementById('seerat-hub-container');
  if (!container) return;

  var isRtl = lang === 'ar' ? 'dir="rtl" text-right font-arabic' : '';

  var faqsHtml = data.faqs.map(function(f) {
    return '<div class="p-3 bg-slate-50 border rounded-lg">' +
      '<p class="font-bold text-emerald-950 text-xs">' + f.q + '</p>' +
      '<p class="text-xs text-slate-700 mt-1 leading-relaxed">' + f.a + '</p>' +
    '</div>';
  }).join('');

  container.innerHTML = '<div class="' + isRtl + ' space-y-6">' +
    '<div class="p-5 bg-gradient-to-br from-amber-50 to-emerald-50 rounded-xl border border-amber-300 space-y-3">' +
      '<h3 class="text-base font-bold text-emerald-950 flex items-center gap-2">' +
        '<i class="fa-solid fa-tree text-amber-600"></i> ' + data.lineageTitle +
      '</h3>' +
      '<div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">' +
        '<p><strong>Father:</strong> ' + data.father + '</p>' +
        '<p><strong>Mother:</strong> ' + data.mother + '</p>' +
        '<p><strong>Grandfather:</strong> ' + data.grandfather + '</p>' +
        '<p><strong>Protector Uncle:</strong> ' + data.uncle + '</p>' +
        '<p class="md:col-span-2"><strong>Blessed Birth:</strong> ' + data.birth + '</p>' +
        '<p class="md:col-span-2"><strong>Ummahat-ul-Momineen (Wives):</strong> ' + data.wives + '</p>' +
        '<p class="md:col-span-2"><strong>Blessed Sons:</strong> ' + data.sons + '</p>' +
        '<p class="md:col-span-2"><strong>Blessed Daughters:</strong> ' + data.daughters + '</p>' +
      '</div>' +
    '</div>' +

    '<div>' +
      '<h3 class="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">' +
        '<i class="fa-solid fa-clipboard-question text-emerald-800"></i> Exam Syllabus & Frequently Asked Questions' +
      '</h3>' +
      '<div class="space-y-2.5">' + faqsHtml + '</div>' +
    '</div>' +
  '</div>';
};

// MULTI-FIELD DUPLICATE DETECTION & GENDER ROLL GENERATION
function generateUniqueHallTicket(gender, category) {
  var prefix = (gender === 'M') ? 'SUN3-B-' : 'SUN3-G-';
  var categoryCode = category.toUpperCase();
  var startNumber = (gender === 'M') ? 1000 : 2000;

  var candidateList = students.filter(function(s) {
    return s.gender === gender && s.category === category;
  });

  var nextSeq = startNumber + candidateList.length + 1;
  var candidateHT = prefix + categoryCode + '-' + nextSeq;

  // Collision Verification Loop
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
  var idNumber = document.getElementById('reg-id-number').value.trim().toUpperCase();
  var category = document.getElementById('reg-category').value;
  var gender = document.getElementById('reg-gender').value;

  // Duplicate Check 1: DOB + Govt ID
  var duplicateId = students.some(function(s) {
    return s.dob === dob && s.idNumber === idNumber;
  });

  // Duplicate Check 2: Same Name + Father Name + Phone
  var duplicateBio = students.some(function(s) {
    return s.phone === phone && s.name.toLowerCase() === name.toLowerCase() && s.father.toLowerCase() === father.toLowerCase();
  });

  if (duplicateId || duplicateBio) {
    alert('Duplicate Registration Error: A candidate with this ID number, Date of Birth, or matching Guardian contact already exists in our records.');
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
  alert('Registration Successful!\nAssigned Hall Ticket: ' + ticketNo + '\nAllocated Desk: ' + seat);
  displayHallTicket(cand);
};

// AEROPLANE-STYLE 2x2 SEATING MATRIX
window.renderSeatingMatrixPreview = function() {
  var container = document.getElementById('seating-matrix-preview');
  if (!container) return;

  var rowsInput = document.getElementById('cfg-seating-rows');
  var totalRows = rowsInput ? parseInt(rowsInput.value) || 25 : 25;

  var matrixHTML = '<div class="space-y-2">';
  
  for (var r = 1; r <= totalRows; r++) {
    matrixHTML += '<div class="flex items-center justify-between gap-2 p-1.5 bg-slate-50 border rounded text-xs">' +
      '<span class="w-12 font-bold font-mono text-slate-500">Row ' + r + '</span>' +
      '<div class="flex items-center gap-1.5">' +
        renderSingleSeat(r, 'A') +
        renderSingleSeat(r, 'B') +
      '</div>' +
      '<div class="w-8 text-center text-[10px] font-bold text-amber-700 bg-amber-100 rounded">AISLE</div>' +
      '<div class="flex items-center gap-1.5">' +
        renderSingleSeat(r, 'C') +
        renderSingleSeat(r, 'D') +
      '</div>' +
    '</div>';
  }

  matrixHTML += '</div>';
  container.innerHTML = matrixHTML;
};

function renderSingleSeat(row, col) {
  var seatCode = 'R' + row + '-' + col;
  var occupied = students.find(function(s) {
    return s.seat && s.seat.indexOf(seatCode) !== -1;
  });

  if (occupied) {
    var isBoy = occupied.gender === 'M';
    var colorClass = isBoy ? 'bg-blue-100 border-blue-400 text-blue-900' : 'bg-pink-100 border-pink-400 text-pink-900';
    return '<button onclick="alert(\'Assigned to: ' + occupied.name + ' (' + occupied.ticketNo + ')\')" class="w-20 sm:w-24 p-1 rounded border text-[10px] truncate text-center font-semibold ' + colorClass + '" title="' + occupied.name + '">' +
      seatCode + ' (' + (isBoy ? 'B' : 'G') + ')' +
    '</button>';
  }

  return '<button onclick="manualAssignSeatPrompt(\'' + seatCode + '\')" class="w-20 sm:w-24 p-1 rounded border border-dashed border-slate-300 bg-white text-slate-400 text-[10px] text-center hover:border-emerald-700 hover:text-emerald-700">' +
    seatCode + ' (Open)' +
  '</button>';
}

window.manualAssignSeatPrompt = function(seatCode) {
  var roll = prompt('Enter Hall Ticket Number to manually allocate to Seat ' + seatCode + ':');
  if (!roll) return;
  var cand = students.find(function(s) { return s.ticketNo === roll.trim().toUpperCase(); });
  if (!cand) return alert('Candidate not found.');

  var hall = (cand.gender === 'M') ? 'Hall A (Boys Wing)' : 'Hall B (Girls Wing)';
  cand.seat = hall + ' - ' + seatCode;
  window.DataStore.set('sm_students', students);
  renderSeatingMatrixPreview();
  renderManagementRoster();
  alert('Candidate ' + cand.name + ' successfully mapped to seat ' + seatCode);
};

window.autoGenerateSeatingPlan = function() {
  if (students.length === 0) return alert('No registered candidates to arrange.');
  var rowsInput = document.getElementById('cfg-seating-rows');
  var totalRows = rowsInput ? parseInt(rowsInput.value) || 25 : 25;
  var cols = ['A', 'B', 'C', 'D'];

  var mIdx = 0, fIdx = 0;
  students.forEach(function(s) {
    if (s.gender === 'M') {
      var rM = Math.floor(mIdx / 4) + 1;
      var cM = cols[mIdx % 4];
      s.seat = 'Hall A (Boys Wing) - R' + rM + '-' + cM;
      mIdx++;
    } else {
      var rF = Math.floor(fIdx / 4) + 1;
      var cF = cols[fIdx % 4];
      s.seat = 'Hall B (Girls Wing) - R' + rF + '-' + cF;
      fIdx++;
    }
  });

  window.DataStore.set('sm_students', students);
  renderSeatingMatrixPreview();
  renderManagementRoster();
  alert('Automated 2x2 Aeroplane Seating Plan generated for all candidates.');
};

window.clearSeatingPlan = function() {
  if (confirm('Reset seating plan for all students?')) {
    students.forEach(function(s) { s.seat = 'Unassigned'; });
    window.DataStore.set('sm_students', students);
    renderSeatingMatrixPreview();
    renderManagementRoster();
  }
};

// OFFICIAL DOCUMENT GENERATOR WITH MADARSA STAMP SEAL
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
    '<span>* Present this Admit Card with your Government ID (' + cand.idType + ') at the entry hall.</span>' +
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

// AUTH & SESSIONS
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
    if (found.status === 'Blocked') return alert('Profile blocked due to verification audit. Contact mosque office.');
    saveSession({ id: found.ticketNo, name: found.name, role: 'student', data: found }, remember);
    window.closeModal('modal-auth');
    openDashboard();
    return;
  }

  alert('Invalid credentials.');
};

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
  alert('Candidate record updated.');
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
  alert('Global settings, prayer times, and social links saved.');
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

  if (!cand) return alert('Verification failed: Mobile, name, and father name did not match.');

  if (type === 'ticket') displayHallTicket(cand);
  else displayApplicationForm(cand);
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
