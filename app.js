// app.js - Full Enterprise Engine: Flexible Seating, Dynamic Awards, Faculty Approval & JSON Sync
var config = window.DataStore.get('sm_config', window.INITIAL_CONFIG);
var students = window.DataStore.get('sm_students', []);
var notices = window.DataStore.get('sm_notices', window.INITIAL_NOTICES);
var papers = window.DataStore.get('sm_papers', window.INITIAL_PAPERS);
var prizes = window.DataStore.get('sm_prizes', window.INITIAL_PRIZES);
var faculty = window.DataStore.get('sm_faculty', window.INITIAL_FACULTY);
var feedbacks = window.DataStore.get('sm_feedbacks', []);
var session = getPersistentSession();

var prizeLayoutMode = 'grid';
var rosterLayoutMode = 'list';

window.dismissGreeting = function() {
  document.getElementById('greeting-overlay').classList.add('hidden');
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
  renderSeatingMatrixPreview();
  renderFacultyQueue();
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

// DYNAMIC AWARDS & PRIZES SYSTEM (NO DUMMY DATA)
window.switchPrizeLayout = function(mode) {
  prizeLayoutMode = mode;
  var btnGrid = document.getElementById('btn-prize-grid');
  var btnList = document.getElementById('btn-prize-list');
  if (mode === 'grid') {
    btnGrid.className = 'px-3 py-1 rounded font-bold bg-white text-emerald-950 shadow-sm';
    btnList.className = 'px-3 py-1 rounded font-bold text-slate-600 hover:text-emerald-950';
  } else {
    btnList.className = 'px-3 py-1 rounded font-bold bg-white text-emerald-950 shadow-sm';
    btnGrid.className = 'px-3 py-1 rounded font-bold text-slate-600 hover:text-emerald-950';
  }
  renderPrizesDisplay();
};

function renderPrizesDisplay() {
  var container = document.getElementById('prize-winners-display');
  var addBtn = document.getElementById('btn-admin-add-prize');
  if (!container) return;

  if (session && (session.user.role === 'super_admin' || session.user.role === 'admin')) {
    if (addBtn) addBtn.classList.remove('hidden');
  } else {
    if (addBtn) addBtn.classList.add('hidden');
  }

  if (prizes.length === 0) {
    container.className = 'p-8 bg-amber-50/50 rounded-xl border border-dashed border-amber-300 text-center';
    container.innerHTML = '<i class="fa-solid fa-trophy text-amber-500 text-3xl mb-2"></i>' +
      '<h3 class="font-bold text-emerald-950 text-sm">Official Prize Evaluations in Progress</h3>' +
      '<p class="text-xs text-slate-500 mt-1">Authorized award items and candidate mappings are being finalized by the Madarsa Committee.</p>' +
      ((session && session.user.role === 'super_admin') ? '<button onclick="openModal(\'modal-add-prize\')" class="mt-3 bg-emerald-950 text-amber-300 font-bold px-3 py-1 rounded text-xs">Add First Prize</button>' : '');
    return;
  }

  if (prizeLayoutMode === 'grid') {
    container.className = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4';
    container.innerHTML = prizes.map(function(p, idx) {
      return '<div class="p-4 bg-white rounded-xl border border-amber-200/80 shadow-sm flex flex-col justify-between relative">' +
        '<div>' +
          '<div class="flex justify-between items-center mb-2">' +
            '<span class="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-500 text-emerald-950">' + p.rank + '</span>' +
            '<span class="font-mono text-xs font-bold text-red-600">' + (p.ht || 'Unmapped') + '</span>' +
          '</div>' +
          '<h3 class="font-bold text-slate-900 text-sm">' + (p.name || 'Candidate Pending') + '</h3>' +
          '<span class="text-[11px] text-emerald-900 font-semibold">' + p.category + '</span>' +
        '</div>' +
        '<div class="mt-4 pt-3 border-t border-amber-200 flex items-center justify-between">' +
          '<div class="flex items-center gap-2">' +
            '<div class="w-8 h-8 rounded-lg bg-emerald-950 text-amber-400 flex items-center justify-center font-bold text-sm">' +
              '<i class="fa-solid fa-' + (p.icon || 'trophy') + '"></i>' +
            '</div>' +
            '<div>' +
              '<span class="text-[10px] text-slate-400 block uppercase font-bold">Prize Item</span>' +
              '<span class="text-xs font-bold text-emerald-950">' + p.prize + '</span>' +
            '</div>' +
          '</div>' +
          ((session && session.user.role === 'super_admin') ? '<button onclick="deletePrize(' + idx + ')" class="text-red-500 hover:text-red-700 text-xs"><i class="fa-solid fa-trash"></i></button>' : '') +
        '</div>' +
      '</div>';
    }).join('');
  } else {
    container.className = 'overflow-x-auto border rounded-xl bg-white shadow-sm';
    container.innerHTML = '<table class="w-full text-xs text-left">' +
      '<thead class="bg-slate-100 uppercase text-[10px] text-slate-600 border-b">' +
        '<tr>' +
          '<th class="p-3">Rank / Level</th>' +
          '<th class="p-3">Candidate Name</th>' +
          '<th class="p-3">Roll No</th>' +
          '<th class="p-3">Category</th>' +
          '<th class="p-3">Allotted Prize Item</th>' +
          ((session && session.user.role === 'super_admin') ? '<th class="p-3 text-center">Action</th>' : '') +
        '</tr>' +
      '</thead>' +
      '<tbody class="divide-y">' +
        prizes.map(function(p, idx) {
          return '<tr class="hover:bg-slate-50">' +
            '<td class="p-3 font-bold text-amber-700">' + p.rank + '</td>' +
            '<td class="p-3 font-bold text-slate-900">' + (p.name || 'Candidate Pending') + '</td>' +
            '<td class="p-3 font-mono text-red-600 font-bold">' + (p.ht || 'Unmapped') + '</td>' +
            '<td class="p-3 font-medium">' + p.category + '</td>' +
            '<td class="p-3 font-bold text-emerald-950"><i class="fa-solid fa-' + (p.icon || 'trophy') + ' mr-1 text-amber-600"></i> ' + p.prize + '</td>' +
            ((session && session.user.role === 'super_admin') ? '<td class="p-3 text-center"><button onclick="deletePrize(' + idx + ')" class="text-red-600 hover:underline">Delete</button></td>' : '') +
          '</tr>';
        }).join('') +
      '</tbody>' +
    '</table>';
  }
}

window.handleAddNewPrize = function(e) {
  e.preventDefault();
  var rank = document.getElementById('prize-new-rank').value.trim();
  var category = document.getElementById('prize-new-cat').value.trim();
  var prize = document.getElementById('prize-new-item').value.trim();
  var ht = document.getElementById('prize-new-ht').value.trim().toUpperCase();
  var icon = document.getElementById('prize-new-icon').value;

  var name = 'Pending Announcement';
  if (ht) {
    var cand = students.find(function(s) { return s.ticketNo === ht; });
    if (cand) {
      name = cand.name;
      cand.prize = rank + ' - ' + prize;
      window.DataStore.set('sm_students', students);
    }
  }

  prizes.unshift({
    id: Date.now(),
    rank: rank,
    category: category,
    prize: prize,
    ht: ht || 'Unmapped',
    name: name,
    icon: icon
  });

  window.DataStore.set('sm_prizes', prizes);
  window.closeModal('modal-add-prize');
  renderPrizesDisplay();
  renderManagementRoster();
  alert('Prize item added successfully.');
};

window.deletePrize = function(idx) {
  if (confirm('Delete this prize entry?')) {
    prizes.splice(idx, 1);
    window.DataStore.set('sm_prizes', prizes);
    renderPrizesDisplay();
  }
};

// FACULTY SELF-REGISTRATION & RBAC APPROVAL QUEUE
window.toggleFacultyRegisterForm = function(showReg) {
  document.getElementById('auth-sub-login').classList.toggle('hidden', showReg);
  document.getElementById('auth-sub-faculty-reg').classList.toggle('hidden', !showReg);
};

window.handleFacultySelfRegister = function(e) {
  e.preventDefault();
  var name = document.getElementById('fac-reg-name').value.trim();
  var dept = document.getElementById('fac-reg-dept').value.trim();
  var username = document.getElementById('fac-reg-username').value.trim();
  var phone = document.getElementById('fac-reg-phone').value.trim();
  var pwd = document.getElementById('fac-reg-pwd').value;

  if (faculty.some(function(f) { return f.username.toLowerCase() === username.toLowerCase(); })) {
    return alert('This username is already requested or active.');
  }

  var newFac = {
    id: Date.now(),
    name: name,
    dept: dept,
    username: username,
    phone: phone,
    pwd: pwd,
    status: 'Pending Approval',
    role: 'admin'
  };

  faculty.push(newFac);
  window.DataStore.set('sm_faculty', faculty);
  alert('Registration Submitted!\nYour account is in the review queue. Once Super Admin approves, you can log in.');
  toggleFacultyRegisterForm(false);
  window.closeModal('modal-auth');
};

function renderFacultyQueue() {
  var panel = document.getElementById('faculty-approval-panel');
  var table = document.getElementById('faculty-queue-table');
  if (!panel || !table) return;

  if (session && session.user.role === 'super_admin') {
    panel.classList.remove('hidden');
    table.innerHTML = '<table class="w-full text-xs text-left">' +
      '<thead class="bg-blue-100/60 uppercase text-[10px] text-blue-900 border-b">' +
        '<tr>' +
          '<th class="p-2">Name</th>' +
          '<th class="p-2">Department</th>' +
          '<th class="p-2">Username</th>' +
          '<th class="p-2">Mobile</th>' +
          '<th class="p-2">Status</th>' +
          '<th class="p-2 text-center">Action</th>' +
        '</tr>' +
      '</thead>' +
      '<tbody class="divide-y">' +
        faculty.map(function(f, idx) {
          return '<tr class="hover:bg-blue-50/50">' +
            '<td class="p-2 font-bold">' + f.name + '</td>' +
            '<td class="p-2">' + f.dept + '</td>' +
            '<td class="p-2 font-mono font-bold text-slate-800">' + f.username + '</td>' +
            '<td class="p-2">' + f.phone + '</td>' +
            '<td class="p-2"><span class="px-2 py-0.5 rounded text-[10px] font-bold ' + (f.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800') + '">' + f.status + '</span></td>' +
            '<td class="p-2 text-center space-x-1">' +
              (f.status !== 'Approved' ? '<button onclick="approveFaculty(' + idx + ')" class="text-emerald-700 font-bold hover:underline">Approve</button>' : '<button onclick="suspendFaculty(' + idx + ')" class="text-amber-700 font-bold hover:underline">Suspend</button>') +
              '<button onclick="deleteFaculty(' + idx + ')" class="text-red-600 font-bold hover:underline ml-1">Delete</button>' +
            '</td>' +
          '</tr>';
        }).join('') +
      '</tbody>' +
    '</table>';
  } else {
    panel.classList.add('hidden');
  }
}

window.approveFaculty = function(idx) {
  faculty[idx].status = 'Approved';
  window.DataStore.set('sm_faculty', faculty);
  renderFacultyQueue();
  alert('Faculty account approved.');
};

window.suspendFaculty = function(idx) {
  faculty[idx].status = 'Suspended';
  window.DataStore.set('sm_faculty', faculty);
  renderFacultyQueue();
  alert('Faculty account suspended.');
};

window.deleteFaculty = function(idx) {
  if (confirm('Delete this faculty account?')) {
    faculty.splice(idx, 1);
    window.DataStore.set('sm_faculty', faculty);
    renderFacultyQueue();
  }
};

// 1-CLICK COMPLETE EXCEL / CSV CANDIDATE EXPORT
window.exportStudentsToCSV = function() {
  if (students.length === 0) return alert('No enrolled students to export.');
  var headers = ["Roll_No", "Candidate_Name", "Father_Name", "DOB", "Category", "Gender", "Govt_ID_Type", "Govt_ID_Number", "Seating_Desk", "Marks", "Allotted_Prize", "Status", "Mobile", "Email", "Address", "Registered_Date"];
  var rows = students.map(function(s) {
    return [
      s.ticketNo,
      s.name,
      s.father,
      s.dob || 'N/A',
      s.category,
      s.gender,
      s.idType || 'Aadhaar',
      s.idNumber || 'N/A',
      s.seat || 'Unassigned',
      s.marks || 0,
      s.prize || 'None',
      s.status || 'Enrolled',
      s.phone,
      s.email || 'N/A',
      (s.address || '').replace(/,/g, ' '),
      s.registeredDate || 'N/A'
    ];
  });

  var csvContent = "data:text/csv;charset=utf-8," + [headers.join(",")].concat(rows.map(function(e) { return e.join(","); })).join("\n");
  var encodedUri = encodeURI(csvContent);
  var link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "Shahi_Masjid_Enrolled_Students_" + Date.now() + ".csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// FULL SYSTEM DATABASE BACKUP & RESTORE (DEVICE-TO-BROWSER JSON SYNC)
window.exportEntireDatabaseJSON = function() {
  var masterData = {
    config: config,
    students: students,
    notices: notices,
    papers: papers,
    prizes: prizes,
    faculty: faculty,
    feedbacks: feedbacks,
    backupTimestamp: new Date().toISOString()
  };

  var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(masterData, null, 2));
  var downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", "Shahi_Masjid_Master_Database_" + Date.now() + ".json");
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
};

window.importEntireDatabaseJSON = function(event) {
  var file = event.target.files[0];
  if (!file) return;

  var reader = new FileReader();
  reader.onload = function(e) {
    try {
      var imported = JSON.parse(e.target.result);
      if (imported.config && imported.students) {
        config = imported.config;
        students = imported.students;
        notices = imported.notices || notices;
        papers = imported.papers || papers;
        prizes = imported.prizes || prizes;
        faculty = imported.faculty || faculty;
        feedbacks = imported.feedbacks || feedbacks;

        window.DataStore.set('sm_config', config);
        window.DataStore.set('sm_students', students);
        window.DataStore.set('sm_notices', notices);
        window.DataStore.set('sm_papers', papers);
        window.DataStore.set('sm_prizes', prizes);
        window.DataStore.set('sm_faculty', faculty);
        window.DataStore.set('sm_feedbacks', feedbacks);

        alert('Database Restored Successfully!\nSynced candidate records, seating plans, awards, and portal configs.');
        location.reload();
      } else {
        alert('Invalid JSON Database File Structure.');
      }
    } catch (err) {
      alert('Error parsing JSON backup file.');
    }
  };
  reader.readAsText(file);
};

// FLEXIBLE SEATING ENGINE (2x2, 3x3, 4x4, 5x5, 6x6, CUSTOM N x N)
window.renderSeatingMatrixPreview = function() {
  var container = document.getElementById('seating-matrix-preview');
  if (!container) return;

  var pattern = document.getElementById('cfg-seating-pattern').value;
  var rowsInput = document.getElementById('cfg-seating-rows');
  var totalRows = rowsInput ? parseInt(rowsInput.value) || 25 : 25;

  var desksPerSide = parseInt(pattern.charAt(0)) || 2;
  var leftCols = [], rightCols = [];
  var charCode = 65; // 'A'
  for (var l = 0; l < desksPerSide; l++) leftCols.push(String.fromCharCode(charCode++));
  for (var r = 0; r < desksPerSide; r++) rightCols.push(String.fromCharCode(charCode++));

  var matrixHTML = '<div class="space-y-2">';
  for (var row = 1; row <= totalRows; row++) {
    matrixHTML += '<div class="flex items-center justify-between gap-2 p-1.5 bg-slate-50 border rounded text-xs">' +
      '<span class="w-14 font-bold font-mono text-slate-500">Row ' + row + '</span>' +
      '<div class="flex items-center gap-1.5">' +
        leftCols.map(function(c) { return renderSingleSeat(row, c); }).join('') +
      '</div>' +
      '<div class="w-10 text-center text-[10px] font-bold text-amber-700 bg-amber-100 rounded">AISLE</div>' +
      '<div class="flex items-center gap-1.5">' +
        rightCols.map(function(c) { return renderSingleSeat(row, c); }).join('') +
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
    return '<button onclick="alert(\'Seat ' + seatCode + ' Assigned to: ' + occupied.name + ' (' + occupied.ticketNo + ')\')" class="w-16 sm:w-20 p-1 rounded border text-[10px] truncate text-center font-semibold ' + colorClass + '" title="' + occupied.name + '">' +
      seatCode + ' (' + (isBoy ? 'B' : 'G') + ')' +
    '</button>';
  }

  return '<button onclick="manualAssignSeatPrompt(\'' + seatCode + '\')" class="w-16 sm:w-20 p-1 rounded border border-dashed border-slate-300 bg-white text-slate-400 text-[10px] text-center hover:border-emerald-700 hover:text-emerald-700">' +
    seatCode + ' (Open)' +
  '</button>';
}

window.manualAssignSeatPrompt = function(seatCode) {
  var roll = prompt('Enter Hall Ticket Number to allocate Seat ' + seatCode + ':');
  if (!roll) return;
  var cand = students.find(function(s) { return s.ticketNo === roll.trim().toUpperCase(); });
  if (!cand) return alert('Candidate not found.');

  var hall = (cand.gender === 'M') ? 'Hall A (Boys Wing)' : 'Hall B (Girls Wing)';
  cand.seat = hall + ' - ' + seatCode;
  window.DataStore.set('sm_students', students);
  renderSeatingMatrixPreview();
  renderManagementRoster();
  alert('Candidate ' + cand.name + ' mapped to seat ' + seatCode);
};

window.autoGenerateSeatingPlan = function() {
  if (students.length === 0) return alert('No registered candidates to arrange.');
  var pattern = document.getElementById('cfg-seating-pattern').value;
  var desksPerSide = parseInt(pattern.charAt(0)) || 2;
  var totalPerCols = desksPerSide * 2;
  var cols = [];
  var charCode = 65;
  for (var c = 0; c < totalPerCols; c++) cols.push(String.fromCharCode(charCode++));

  var mIdx = 0, fIdx = 0;
  students.forEach(function(s) {
    if (s.gender === 'M') {
      var rM = Math.floor(mIdx / totalPerCols) + 1;
      var cM = cols[mIdx % totalPerCols];
      s.seat = 'Hall A (Boys Wing) - R' + rM + '-' + cM;
      mIdx++;
    } else {
      var rF = Math.floor(fIdx / totalPerCols) + 1;
      var cF = cols[fIdx % totalPerCols];
      s.seat = 'Hall B (Girls Wing) - R' + rF + '-' + cF;
      fIdx++;
    }
  });

  window.DataStore.set('sm_students', students);
  renderSeatingMatrixPreview();
  renderManagementRoster();
  alert('Dynamic ' + pattern + ' Seating Grid generated successfully.');
};

window.clearSeatingPlan = function() {
  if (confirm('Reset seating plan for all candidates?')) {
    students.forEach(function(s) { s.seat = 'Unassigned'; });
    window.DataStore.set('sm_students', students);
    renderSeatingMatrixPreview();
    renderManagementRoster();
  }
};

// MULTI-FIELD DUPLICATE DETECTION & UNIQUE GENDER ROLL
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
  var idNumber = document.getElementById('reg-id-number').value.trim().toUpperCase();
  var category = document.getElementById('reg-category').value;
  var gender = document.getElementById('reg-gender').value;

  var duplicateId = students.some(function(s) {
    return s.dob === dob && s.idNumber === idNumber;
  });

  var duplicateBio = students.some(function(s) {
    return s.phone === phone && s.name.toLowerCase() === name.toLowerCase() && s.father.toLowerCase() === father.toLowerCase();
  });

  if (duplicateId || duplicateBio) {
    alert('Duplicate Registration Error: A candidate with matching Government ID Number, Date of Birth, or Guardian contact already exists.');
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
    prize: 'None',
    address: document.getElementById('reg-address').value.trim(),
    password: document.getElementById('reg-password').value,
    marks: 0,
    status: 'Enrolled',
    registeredDate: new Date().toLocaleDateString('en-IN')
  };

  students.push(cand);
  window.DataStore.set('sm_students', students);

  saveSession({ id: cand.ticketNo, name: cand.name, role: 'student', data: cand }, true);
  alert('Enrollment Complete!\nAllotted Hall Ticket ID: ' + ticketNo + '\nAllocated Seat: ' + seat);
  displayHallTicket(cand);
};

// ROSTER VIEW TOGGLE (GRID VS LIST)
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
    var badgeClass = s.status === 'Blocked' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-800';
    return '<tr class="hover:bg-slate-50 text-xs">' +
      '<td class="p-2.5 font-mono font-bold text-red-600">' + s.ticketNo + '</td>' +
      '<td class="p-2.5 font-semibold">' + s.name + '</td>' +
      '<td class="p-2.5">' + s.father + '</td>' +
      '<td class="p-2.5">' + (s.dob || 'N/A') + '</td>' +
      '<td class="p-2.5">' + s.category + ' (' + s.gender + ')</td>' +
      '<td class="p-2.5 font-bold text-emerald-800">' + (s.seat || 'Unassigned') + '</td>' +
      '<td class="p-2.5 font-bold text-amber-800">' + (s.prize || 'None') + '</td>' +
      '<td class="p-2.5 text-center space-x-1">' +
        '<button onclick="openEditCandidateModal(' + idx + ')" class="text-blue-600 hover:underline font-bold">Edit</button>' +
        '<button onclick="displayHallTicket(students[' + idx + '])" class="text-emerald-700 hover:underline font-bold">Admit Card</button>' +
        (session.user.role === 'super_admin' ? '<button onclick="deleteCandidate(' + idx + ')" class="text-red-600 hover:underline">Del</button>' : '') +
      '</td>' +
    '</tr>';
  }).join('');

  gridWrap.innerHTML = students.map(function(s, idx) {
    return '<div class="p-3.5 bg-white border rounded-xl shadow-sm space-y-2 text-xs">' +
      '<div class="flex justify-between items-center">' +
        '<span class="font-mono font-bold text-red-600">' +
