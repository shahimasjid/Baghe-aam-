// app.js - Full Interactive Engine: Dynamic Seating, Cert Generation, Attendance & Feedback
var config = window.DataStore.get('sm_config', window.INITIAL_CONFIG);
var students = window.DataStore.get('sm_students', window.INITIAL_STUDENTS);
var faculties = window.DataStore.get('sm_faculties', window.INITIAL_FACULTIES);
var notices = window.DataStore.get('sm_notices', window.INITIAL_NOTICES);
var feedbacks = window.DataStore.get('sm_feedbacks', [
  { id: 1, name: "Syed Imran", phone: "9848012345", email: "imran@example.com", message: "What are the reporting timings for Boys wing?", date: "2026-01-20", replied: false }
]);
var session = getPersistentSession();

window.dismissGreeting = function() {
  document.getElementById('greeting-overlay').classList.add('hidden');
};

window.navigateTab = function(tabId) {
  var tabs = ['home', 'competitions', 'faculty-register', 'seerat-hub', 'model-papers', 'doc-lookup', 'feedback', 'printable', 'dashboard'];
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
  syncConfigUI();
  updateAuthUI();
});

function startLiveClock() {
  var update = function() {
    var clock = document.getElementById('ist-live-clock');
    if (clock) clock.innerText = new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: true }) + ' IST';
  };
  update();
  setInterval(update, 1000);
}

function syncConfigUI() {
  document.getElementById('txt-header-masjid').innerText = config.masjidTitle;
  document.getElementById('txt-header-sub').innerText = config.masjidSub;
  document.getElementById('txt-comp-title').innerText = config.compTitle;
  document.getElementById('banner-exam-date-str').innerText = config.examDate;
  document.getElementById('banner-venue-str').innerText = config.examVenue;
  document.getElementById('topbar-poc').innerText = config.pocContact;
}

function renderPrayerTimes() {
  var container = document.getElementById('prayer-time-table');
  if (!container) return;
  container.innerHTML = config.prayers.map(function(p) {
    return '<div class="flex justify-between items-center py-1 border-b border-slate-100 text-xs">' +
      '<span class="font-bold text-slate-800">' + p.name + '</span>' +
      '<span class="text-emerald-800 font-mono font-bold">Iqama: ' + p.iqama + '</span>' +
    '</div>';
  }).join('');
}

// ----------------------------------------------------
// AUTHENTICATION & MULTI-ROLE HANDLING
// ----------------------------------------------------
function saveSession(user, remember24h) {
  var expiry = new Date().getTime() + (remember24h ? 24 * 3600 * 1000 : 2 * 3600 * 1000);
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
  } catch (e) { return null; }
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
      'Portal Login' +
    '</button>';
  }
}

window.handleUniversalLogin = function(e) {
  e.preventDefault();
  var id = document.getElementById('login-id').value.trim();
  var pwd = document.getElementById('login-pwd').value.trim();

  // 1. Super Admin
  if (id === 'Admin' && pwd === '9290') {
    saveSession({ id: 'Admin', name: 'Super Admin Maintenance', role: 'super_admin' }, true);
    window.closeModal('modal-auth');
    openDashboard();
    return;
  }

  // 2. Co-Admin
  if (id === 'Admin1' && pwd === '2580') {
    saveSession({ id: 'Admin1', name: 'Admin Exam Coordinator', role: 'admin' }, true);
    window.closeModal('modal-auth');
    openDashboard();
    return;
  }

  // 3. Faculty
  var fac = faculties.find(function(f) { return (f.phone === id || f.email === id || f.id === id); });
  if (fac) {
    if (fac.status !== 'Approved') {
      alert('Faculty Registration Status: Pending Approval by Admin / Super Admin.');
      return;
    }
    if (pwd === 'faculty123') {
      saveSession({ id: fac.id, name: fac.name, role: 'faculty', data: fac }, true);
      window.closeModal('modal-auth');
      openDashboard();
      return;
    }
  }

  // 4. Student
  var std = students.find(function(s) { return s.ticketNo === id || s.phone === id; });
  if (std && (pwd === '1234' || std.dob.replace(/-/g, '') === pwd)) {
    saveSession({ id: std.ticketNo, name: std.name, role: 'student', data: std }, true);
    window.closeModal('modal-auth');
    openDashboard();
    return;
  }

  alert('Invalid credentials. Check username/phone and password (Default student password is DOB YYYYMMDD or 1234).');
};

function openDashboard() {
  if (!session || !session.user) return window.openModal('modal-auth');
  var role = session.user.role;
  document.getElementById('dash-user-name').innerText = 'Welcome, ' + session.user.name;

  var pill = document.getElementById('dash-role-pill');
  pill.innerText = role.replace('_', ' ');
  pill.className = 'text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ' +
    (role === 'super_admin' ? 'bg-red-100 text-red-700' : role === 'admin' ? 'bg-amber-100 text-amber-800' : role === 'faculty' ? 'bg-purple-100 text-purple-800' : 'bg-emerald-100 text-emerald-800');

  // Display sections depending on role
  document.getElementById('dash-section-student').classList.toggle('hidden', role !== 'student');
  document.getElementById('dash-section-faculty').classList.toggle('hidden', role !== 'faculty');
  document.getElementById('dash-section-management').classList.toggle('hidden', role !== 'admin' && role !== 'super_admin');

  if (role === 'student') {
    renderStudentProfileFeatures();
  } else if (role === 'faculty') {
    renderFacultyDashboard();
  } else {
    renderManagementDashboard();
  }

  window.navigateTab('dashboard');
}

// ----------------------------------------------------
// 10 BEST ADVANCED FEATURES FOR STUDENTS
// ----------------------------------------------------
function renderStudentProfileFeatures() {
  var student = students.find(function(s) { return s.ticketNo === session.user.id; }) || session.user.data;
  var container = document.getElementById('student-features-grid');
  if (!container) return;

  container.innerHTML = `
    <!-- Feature 1: Official Participation Certificate -->
    <div class="p-4 bg-amber-50 border border-amber-300 rounded-xl flex flex-col justify-between">
      <div>
        <i class="fa-solid fa-certificate text-amber-700 text-2xl mb-2"></i>
        <h4 class="font-bold text-slate-900 text-sm">1. Islamic Participation Certificate</h4>
        <p class="text-xs text-slate-600 mt-1">Generate authenticated certificate featuring Hadith, your name, father's name, and DOB.</p>
      </div>
      <button onclick="generateParticipationCertificate('${student.ticketNo}')" class="mt-3 bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 rounded text-xs">
        Generate Certificate
      </button>
    </div>

    <!-- Feature 2: Official Admit Card & Desk Pass -->
    <div class="p-4 bg-emerald-50 border border-emerald-300 rounded-xl flex flex-col justify-between">
      <div>
        <i class="fa-solid fa-id-badge text-emerald-800 text-2xl mb-2"></i>
        <h4 class="font-bold text-slate-900 text-sm">2. Official Hall Ticket & Seat Pass</h4>
        <p class="text-xs text-slate-600 mt-1">Desk: <strong class="text-emerald-900">${student.seat || 'Assigned on Entry'}</strong></p>
      </div>
      <button onclick="displayHallTicket(getStudent('${student.ticketNo}'))" class="mt-3 bg-emerald-950 hover:bg-emerald-900 text-amber-300 font-bold py-2 rounded text-xs">
        Print Admit Card
      </button>
    </div>

    <!-- Feature 3: Seating Arrangement Navigator -->
    <div class="p-4 bg-blue-50 border border-blue-300 rounded-xl flex flex-col justify-between">
      <div>
        <i class="fa-solid fa-location-dot text-blue-700 text-2xl mb-2"></i>
        <h4 class="font-bold text-slate-900 text-sm">3. Live Seating Matrix Position</h4>
        <p class="text-xs text-slate-600 mt-1">Verify your assigned row and aisle coordinate within the examination hall.</p>
      </div>
      <button onclick="alert('Your Seating Coordinate: ' + '${student.seat || 'Pending Allotment'}')" class="mt-3 bg-blue-800 hover:bg-blue-900 text-white font-bold py-2 rounded text-xs">
        Locate My Desk
      </button>
    </div>

    <!-- Feature 4: 500+ Words Seerat Reference Hub -->
    <div class="p-4 bg-slate-50 border rounded-xl flex flex-col justify-between">
      <div>
        <i class="fa-solid fa-book-open text-emerald-900 text-2xl mb-2"></i>
        <h4 class="font-bold text-slate-900 text-sm">4. Seerat Study Material & Lineage</h4>
        <p class="text-xs text-slate-600 mt-1">Full 500+ words authenticated biography, Ummahat-ul-Momineen & blessed family.</p>
      </div>
      <button onclick="navigateTab('seerat-hub')" class="mt-3 bg-slate-800 hover:bg-slate-900 text-white font-bold py-2 rounded text-xs">
        Open Study Hub
      </button>
    </div>

    <!-- Feature 5: Model Papers & Question Bank -->
    <div class="p-4 bg-slate-50 border rounded-xl flex flex-col justify-between">
      <div>
        <i class="fa-solid fa-file-pdf text-red-600 text-2xl mb-2"></i>
        <h4 class="font-bold text-slate-900 text-sm">5. Download Model Papers</h4>
        <p class="text-xs text-slate-600 mt-1">Access 1st & 2nd edition papers with answer schemes.</p>
      </div>
      <button onclick="navigateTab('model-papers')" class="mt-3 bg-slate-800 hover:bg-slate-900 text-white font-bold py-2 rounded text-xs">
        View Question Papers
      </button>
    </div>

    <!-- Feature 6: Exam Day Attendance Status Tracker -->
    <div class="p-4 bg-slate-50 border rounded-xl flex flex-col justify-between">
      <div>
        <i class="fa-solid fa-user-check text-indigo-700 text-2xl mb-2"></i>
        <h4 class="font-bold text-slate-900 text-sm">6. Live Attendance Registry</h4>
        <p class="text-xs text-slate-600 mt-1">Exam Attendance: <span class="font-bold text-emerald-800">${student.attendance || 'Not Marked Yet'}</span></p>
      </div>
      <span class="text-[11px] text-slate-500 font-semibold mt-3">Marked by Hall Invigilator</span>
    </div>

    <!-- Feature 7: Award & Standing Status -->
    <div class="p-4 bg-slate-50 border rounded-xl flex flex-col justify-between">
      <div>
        <i class="fa-solid fa-trophy text-amber-600 text-2xl mb-2"></i>
        <h4 class="font-bold text-slate-900 text-sm">7. Awards & Marks Standing</h4>
        <p class="text-xs text-slate-600 mt-1">Award Status: <strong class="text-amber-800">${student.prize || 'Under Evaluation'}</strong> (Marks: ${student.marks || 0}/100)</p>
      </div>
      <span class="text-[11px] text-slate-500 font-semibold mt-3">Verified by Central Committee</span>
    </div>

    <!-- Feature 8: Direct Mosque Committee Helpdesk & Feedback -->
    <div class="p-4 bg-slate-50 border rounded-xl flex flex-col justify-between">
      <div>
        <i class="fa-solid fa-comments text-teal-700 text-2xl mb-2"></i>
        <h4 class="font-bold text-slate-900 text-sm">8. Inquiry & Support Desk</h4>
        <p class="text-xs text-slate-600 mt-1">Submit feedback and queries; committee will respond via WhatsApp or Email.</p>
      </div>
      <button onclick="navigateTab('feedback')" class="mt-3 bg-teal-800 hover:bg-teal-900 text-white font-bold py-2 rounded text-xs">
        Submit Feedback
      </button>
    </div>

    <!-- Feature 9: Real-time Examination Timetable & Azan Alerts -->
    <div class="p-4 bg-slate-50 border rounded-xl flex flex-col justify-between">
      <div>
        <i class="fa-solid fa-clock text-blue-800 text-2xl mb-2"></i>
        <h4 class="font-bold text-slate-900 text-sm">9. Exam Clock & Reporting Alerts</h4>
        <p class="text-xs text-slate-600 mt-1">Orientation: ${config.prepTime}<br/>Exam: ${config.examTime}</p>
      </div>
      <span class="text-[11px] text-emerald-800 font-bold mt-3">Report to Assigned Hall 30 mins prior</span>
    </div>

    <!-- Feature 10: Registration Dossier Record -->
    <div class="p-4 bg-slate-50 border rounded-xl flex flex-col justify-between">
      <div>
        <i class="fa-solid fa-file-contract text-slate-700 text-2xl mb-2"></i>
        <h4 class="font-bold text-slate-900 text-sm">10. Verified Registration Dossier</h4>
        <p class="text-xs text-slate-600 mt-1">Print formal copy of your application form with identity proof details.</p>
      </div>
      <button onclick="displayApplicationForm(getStudent('${student.ticketNo}'))" class="mt-3 bg-slate-800 hover:bg-slate-900 text-white font-bold py-2 rounded text-xs">
        Download Dossier
      </button>
    </div>
  `;
}

// ----------------------------------------------------
// ADVANCED FACULTY DASHBOARD & ATTENDANCE
// ----------------------------------------------------
function renderFacultyDashboard() {
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
  alert('Attendance updated for ' + students[idx].name + ': ' + val);
};

// ----------------------------------------------------
// 15 ADVANCED ADMIN & SUPER ADMIN MANAGEMENT FEATURES
// ----------------------------------------------------
function renderManagementDashboard() {
  renderManagementRoster();
  renderDynamicSeatingMatrix();
  renderFacultyApprovalQueue();
  renderFeedbackManagement();
}

// 1. DYNAMIC N x N / 2x2 / 3x3 / 4x4 SEATING MATRIX GENERATOR
window.changeSeatingLayoutType = function(type) {
  config.seatingConfig.layoutType = type;
  if (type === '2x2') { config.seatingConfig.colsPerRow = 4; }
  else if (type === '3x3') { config.seatingConfig.colsPerRow = 6; }
  else if (type === '4x4') { config.seatingConfig.colsPerRow = 8; }
  else if (type === 'nxn') {
    var custom = prompt("Enter columns per row for Custom NxN layout (e.g., 5 or 10):", "5");
    config.seatingConfig.colsPerRow = parseInt(custom) || 5;
  }
  window.DataStore.set('sm_config', config);
  renderDynamicSeatingMatrix();
};

window.renderDynamicSeatingMatrix = function() {
  var container = document.getElementById('dynamic-seating-matrix-preview');
  if (!container) return;

  var layout = config.seatingConfig.layoutType || '2x2';
  var cols = config.seatingConfig.colsPerRow || 4;
  var rows = parseInt(document.getElementById('cfg-seating-rows').value) || 20;

  var html = '<div class="text-xs mb-3 font-semibold text-slate-700">Active Layout: <span class="uppercase text-emerald-900 font-bold">' + layout + ' (' + cols + ' seats per row)</span></div>';
  html += '<div class="space-y-2">';

  var alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  for (var r = 1; r <= rows; r++) {
    html += '<div class="flex items-center gap-1.5 p-1.5 bg-slate-50 border rounded text-xs overflow-x-auto">' +
      '<span class="w-14 font-mono font-bold text-slate-500">Row ' + r + '</span>';

    for (var c = 0; c < cols; c++) {
      var seatLabel = 'R' + r + '-' + alphabet[c];
      // Aisle separation depending on layout
      if ((layout === '2x2' && c === 2) || (layout === '3x3' && c === 3) || (layout === '4x4' && c === 4)) {
        html += '<span class="px-1.5 py-0.5 text-[9px] bg-amber-100 text-amber-800 font-bold rounded">AISLE</span>';
      }

      var occ = students.find(function(s) { return s.seat && s.seat.indexOf(seatLabel) !== -1; });
      if (occ) {
        var isB = occ.gender === 'M';
        html += '<button onclick="alert(\'Assigned to: ' + occ.name + ' (' + occ.ticketNo + ')\')" class="px-2 py-1 rounded text-[10px] font-bold border truncate w-20 text-center ' + (isB ? 'bg-blue-100 text-blue-900 border-blue-400' : 'bg-pink-100 text-pink-900 border-pink-400') + '">' +
          seatLabel + ' (' + occ.name.split(' ')[0] + ')' +
        '</button>';
      } else {
        html += '<button onclick="assignSeatToStudentPrompt(\'' + seatLabel + '\')" class="px-2 py-1 rounded text-[10px] border border-dashed border-slate-300 bg-white hover:border-emerald-600 text-slate-400 w-20 text-center">' +
          seatLabel + ' (Open)' +
        '</button>';
      }
    }
    html += '</div>';
  }
  html += '</div>';
  container.innerHTML = html;
};

window.assignSeatToStudentPrompt = function(seatCode) {
  var roll = prompt("Enter Hall Ticket number to allocate seat " + seatCode + ":");
  if (!roll) return;
  var cand = students.find(function(s) { return s.ticketNo === roll.trim().toUpperCase(); });
  if (!cand) return alert("Candidate not found.");

  var hall = (cand.gender === 'M') ? 'Hall A (Boys)' : 'Hall B (Girls)';
  cand.seat = hall + ' - ' + seatCode;
  window.DataStore.set('sm_students', students);
  renderDynamicSeatingMatrix();
  renderManagementRoster();
  alert("Assigned seat " + seatCode + " to " + cand.name);
};

window.autoGenerateDynamicSeating = function() {
  if (students.length === 0) return alert('No registered students.');
  var cols = config.seatingConfig.colsPerRow || 4;
  var alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  var mIdx = 0, fIdx = 0;
  students.forEach(function(s) {
    if (s.gender === 'M') {
      var rM = Math.floor(mIdx / cols) + 1;
      var cM = alphabet[mIdx % cols];
      s.seat = 'Hall A (Boys) - R' + rM + '-' + cM;
      mIdx++;
    } else {
      var rF = Math.floor(fIdx / cols) + 1;
      var cF = alphabet[fIdx % cols];
      s.seat = 'Hall B (Girls) - R' + rF + '-' + cF;
      fIdx++;
    }
  });

  window.DataStore.set('sm_students', students);
  renderDynamicSeatingMatrix();
  renderManagementRoster();
  alert('Seating matrix automatically distributed.');
};

// 2. FACULTY APPROVAL WORKFLOW
function renderFacultyApprovalQueue() {
  var tbody = document.getElementById('faculty-approval-tbody');
  if (!tbody) return;

  tbody.innerHTML = faculties.map(function(f, idx) {
    return '<tr class="hover:bg-slate-50 text-xs">' +
      '<td class="p-2.5 font-bold text-slate-900">' + f.name + '</td>' +
      '<td class="p-2.5">' + f.dept + '</td>' +
      '<td class="p-2.5 font-mono">' + f.phone + '</td>' +
      '<td class="p-2.5"><span class="px-2 py-0.5 rounded text-[10px] font-bold ' + (f.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800') + '">' + f.status + '</span></td>' +
      '<td class="p-2.5 space-x-1 text-center">' +
        (f.status === 'Pending' ? '<button onclick="approveFaculty(' + idx + ')" class="bg-emerald-800 hover:bg-emerald-900 text-white px-2 py-1 rounded text-[10px] font-bold">Approve</button>' : '<span class="text-emerald-700 font-bold">Active</span>') +
        (session.user.role === 'super_admin' ? '<button onclick="removeFaculty(' + idx + ')" class="text-red-600 font-bold hover:underline ml-1">Remove</button>' : '') +
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

// 3. FEEDBACK DESK WITH EMAIL & WHATSAPP REPLIES
function renderFeedbackManagement() {
  var container = document.getElementById('admin-feedback-tbody');
  if (!container) return;

  container.innerHTML = feedbacks.map(function(fb, idx) {
    var waLink = 'https://wa.me/91' + fb.phone.replace(/[^0-9]/g, '') + '?text=' + encodeURIComponent('Salam ' + fb.name + ', regarding your inquiry at Shahi Masjid Seerat Portal: ');
    var mailLink = 'mailto:' + (fb.email || '') + '?subject=' + encodeURIComponent('Response: Seerat Competition Inquiry') + '&body=' + encodeURIComponent('Salam ' + fb.name + ',\n\n');

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

// 4. CANDIDATE ROSTER & DYNAMIC AWARD ALLOTMENT
function renderManagementRoster() {
  var tbody = document.getElementById('admin-roster-tbody');
  if (!tbody) return;

  tbody.innerHTML = students.map(function(s, idx) {
    return '<tr class="hover:bg-slate-50 text-xs">' +
      '<td class="p-2.5 font-mono font-bold text-red-600">' + s.ticketNo + '</td>' +
      '<td class="p-2.5 font-semibold text-slate-900">' + s.name + '</td>' +
      '<td class="p-2.5">' + s.father + '</td>' +
      '<td class="p-2.5 font-bold text-emerald-800">' + (s.seat || 'Unassigned') + '</td>' +
      '<td class="p-2.5 font-bold text-amber-800">' + (s.prize || 'None') + '</td>' +
      '<td class="p-2.5 font-bold">' + (s.attendance || 'Not Marked') + '</td>' +
      '<td class="p-2.5 text-center space-x-1">' +
        '<button onclick="openEditCandidateModal(' + idx + ')" class="text-blue-600 hover:underline font-bold">Manage / Assign Prize</button>' +
        '<button onclick="generateParticipationCertificate(\'' + s.ticketNo + '\')" class="text-amber-700 hover:underline font-bold">Cert</button>' +
        (session.user.role === 'super_admin' ? '<button onclick="deleteCandidate(' + idx + ')" class="text-red-600 hover:underline">Del</button>' : '') +
      '</td>' +
    '</tr>';
  }).join('');
}

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

  students[idx] = c;
  window.DataStore.set('sm_students', students);
  window.closeModal('modal-edit-candidate');
  renderManagementRoster();
  renderDynamicSeatingMatrix();
  alert('Candidate modifications and prize assignment updated successfully.');
};

window.deleteCandidate = function(idx) {
  if (confirm('Delete candidate ' + students[idx].ticketNo + '?')) {
    students.splice(idx, 1);
    window.DataStore.set('sm_students', students);
    renderManagementRoster();
    renderDynamicSeatingMatrix();
  }
};

// ----------------------------------------------------
// PROFESSIONAL ISLAMIC PARTICIPATION CERTIFICATE GENERATOR
// ----------------------------------------------------
window.generateParticipationCertificate = function(ticketNo) {
  var cand = students.find(function(s) { return s.ticketNo === ticketNo; });
  if (!cand) return alert('Candidate not found.');

  var certHTML = `
    <div class="border-8 border-double border-amber-600 p-8 bg-[#fdfcf7] text-slate-900 rounded shadow-xl relative overflow-hidden">
      <!-- Watermark Background -->
      <div class="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none text-9xl font-arabic text-emerald-950">
        محمد ﷺ
      </div>

      <!-- Top Bismillah & Header -->
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

      <!-- Participant Particulars -->
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

      <!-- Signatures & Authentic Seal Stamp -->
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
    status: "Pending", // Needs Admin approval
    role: "faculty"
  };

  faculties.push(fac);
  window.DataStore.set('sm_faculties', faculties);
  alert('Faculty Registration Submitted!\nYour profile is currently Pending Approval by Admin or Super Admin.');
  window.navigateTab('home');
};

// ----------------------------------------------------
// PUBLIC FEEDBACK SUBMISSION
// ----------------------------------------------------
window.handleFeedbackSubmit = function(e) {
  e.preventDefault();
  feedbacks.unshift({
    id: feedbacks.length + 1,
    name: document.getElementById('fb-name').value.trim(),
    phone: document.getElementById('fb-phone').value.trim(),
    email: document.getElementById('fb-email').value.trim(),
    message: document.getElementById('fb-msg').value.trim(),
    date: new Date().toLocaleDateString('en-IN')
  });
  window.DataStore.set('sm_feedbacks', feedbacks);
  alert('Your inquiry/feedback has been received. Mosque officials will reply via WhatsApp or Email.');
  document.getElementById('fb-msg').value = '';
  window.navigateTab('home');
};

// ----------------------------------------------------
// SEERAT HUB RENDERER (500+ Words)
// ----------------------------------------------------
function renderSeeratHubContent() {
  var data = window.SEERAT_COMPREHENSIVE_TEXT.en;
  var container = document.getElementById('seerat-hub-container');
  if (!container) return;

  container.innerHTML = `
    <div class="p-5 bg-gradient-to-br from-amber-50 to-emerald-50 rounded-xl border border-amber-300 space-y-3">
      <h3 class="text-base font-bold text-emerald-950 flex items-center gap-2 border-b border-amber-200 pb-2">
        <i class="fa-solid fa-tree text-amber-600"></i> ${data.lineageHeader}
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs leading-relaxed">
        <p><strong>Father:</strong> ${data.father}</p>
        <p><strong>Mother:</strong> ${data.mother}</p>
        <p><strong>Grandfather:</strong> ${data.grandfather}</p>
        <p><strong>Protective Uncle:</strong> ${data.uncle}</p>
        <p class="md:col-span-2"><strong>Blessed Wives:</strong> ${data.wives}</p>
        <p class="md:col-span-2"><strong>Blessed Children:</strong> Sons: ${data.sons} | Daughters: ${data.daughters}</p>
      </div>
    </div>
    <div class="p-6 bg-white border border-slate-200 rounded-xl shadow-sm space-y-4 text-xs md:text-sm leading-relaxed text-slate-800">
      <h3 class="text-base font-bold text-emerald-950 border-b pb-2 flex items-center gap-2">
        <i class="fa-solid fa-feather-pointed text-emerald-800"></i> ${data.title}
      </h3>
      <div class="space-y-3 text-justify">
        ${data.narrative.split('\n\n').map(function(p) { return '<p class="leading-relaxed">' + p + '</p>'; }).join('')}
      </div>
    </div>
  `;
}

// ----------------------------------------------------
// DOCUMENT PRINTS & EXPORTS
// ----------------------------------------------------
window.displayHallTicket = function(cand) {
  var area = document.getElementById('printable-document');
  area.innerHTML = `
    <div class="border-b-2 border-emerald-900 pb-3 mb-4 flex justify-between items-center">
      <div>
        <h2 class="text-lg font-black text-emerald-950 font-cinzel">${config.compTitle}</h2>
        <p class="text-[11px] text-gray-600 font-bold uppercase">${config.masjidTitle}</p>
      </div>
      <div class="text-right">
        <span class="text-[10px] text-gray-500 font-bold uppercase block">Official Hall Ticket</span>
        <span class="text-lg font-mono font-black text-red-600">${cand.ticketNo}</span>
      </div>
    </div>
    <div class="grid grid-cols-12 gap-4 text-xs">
      <div class="col-span-8 space-y-2">
        <p><strong>Candidate Name:</strong> <span class="uppercase font-bold">${cand.name}</span></p>
        <p><strong>Father's Name:</strong> <span class="uppercase font-semibold">${cand.father}</span></p>
        <p><strong>DOB:</strong> ${cand.dob} | <strong>Gender:</strong> ${cand.gender === 'M' ? 'Male' : 'Female'}</p>
        <div class="p-2.5 bg-amber-50 border border-amber-300 rounded">
          <p><strong>Allocated Seat:</strong> <span class="font-mono text-sm font-black text-red-700">${cand.seat || 'Allocated at Gate'}</span></p>
          <p class="text-[11px] text-emerald-900"><strong>Exam Timing:</strong> ${config.examTime}</p>
        </div>
      </div>
      <div class="col-span-4 flex flex-col items-center justify-between border-l pl-4">
        <div class="w-24 h-28 border border-dashed border-slate-400 flex items-center justify-center text-[10px] text-slate-400">Photo</div>
        <div class="text-[8px] font-bold text-center text-emerald-900 mt-2">OFFICIAL MADARSA SEAL</div>
      </div>
    </div>
  `;
  window.navigateTab('printable');
};

window.displayApplicationForm = function(cand) {
  var area = document.getElementById('printable-document');
  area.innerHTML = `
    <div class="text-center border-b pb-2 mb-3">
      <h3 class="font-bold text-base text-emerald-950 uppercase">${config.masjidTitle}</h3>
      <p class="text-xs text-slate-500">Official Candidate Registration Dossier</p>
    </div>
    <div class="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-4 rounded border">
      <p><strong>Application ID:</strong> ${cand.appId}</p>
      <p><strong>Hall Ticket No:</strong> <span class="text-red-600 font-bold font-mono">${cand.ticketNo}</span></p>
      <p><strong>Candidate:</strong> ${cand.name}</p>
      <p><strong>Father:</strong> ${cand.father}</p>
      <p><strong>DOB:</strong> ${cand.dob}</p>
      <p><strong>Assigned Seat:</strong> ${cand.seat}</p>
      <p><strong>Attendance:</strong> ${cand.attendance || 'Pending'}</p>
      <p><strong>Prize Allotment:</strong> ${cand.prize || 'None'}</p>
    </div>
  `;
  window.navigateTab('printable');
};

window.downloadPDFDoc = function() {
  var el = document.getElementById('printable-document');
  html2pdf().set({
    margin: 6,
    filename: 'Madarsa_Document.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  }).from(el).save();
};
