// js/app.js
import { INITIAL_CONFIG, INITIAL_PAPERS, INITIAL_NOTICES, DataStore } from './data.js';

// Application State
let config = DataStore.get('sm_config', INITIAL_CONFIG);
let students = DataStore.get('sm_students', []);
let notices = DataStore.get('sm_notices', INITIAL_NOTICES);
let papers = DataStore.get('sm_papers', INITIAL_PAPERS);
let feedbacks = DataStore.get('sm_feedbacks', []);
let session = getPersistentSession();

// Attach globally accessible functions to window for DOM event listeners
window.dismissGreeting = () => document.getElementById('greeting-overlay').classList.add('hidden');
window.navigateTab = navigateTab;
window.openModal = (id) => { const el = document.getElementById(id); el.classList.remove('hidden'); el.classList.add('flex'); };
window.closeModal = (id) => { const el = document.getElementById(id); el.classList.add('hidden'); el.classList.remove('flex'); };
window.handleUniversalLogin = handleUniversalLogin;
window.handleSessionLogout = handleSessionLogout;
window.handleStudentRegister = handleStudentRegister;
window.handleDocLookup = handleDocLookup;
window.handlePublicResultLookup = handlePublicResultLookup;
window.handleFeedbackSubmit = handleFeedbackSubmit;
window.autoGenerateSeatingPlan = autoGenerateSeatingPlan;
window.clearSeatingPlan = clearSeatingPlan;
window.pullAllApplicationForms = pullAllApplicationForms;
window.downloadPDFDoc = downloadPDFDoc;
window.saveSuperAdminConfig = saveSuperAdminConfig;
window.addNewModelPaper = addNewModelPaper;
window.filterRosterTable = filterRosterTable;
window.openEditCandidateModal = openEditCandidateModal;
window.saveCandidateModifications = saveCandidateModifications;
window.deleteCandidate = deleteCandidate;
window.showCurrentStudentDoc = showCurrentStudentDoc;

window.addEventListener('DOMContentLoaded', () => {
  startLiveClock();
  renderPrayerTimes();
  renderNotices();
  renderModelPapers();
  syncConfigUI();
  updateAuthUI();
  renderSeatingMatrixPreview();
});

function startLiveClock() {
  const update = () => {
    const now = new Date();
    document.getElementById('ist-live-clock').innerText = now.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: true }) + ' IST';
  };
  update();
  setInterval(update, 1000);
}

function syncConfigUI() {
  document.getElementById('txt-header-masjid').innerText = config.masjidTitle;
  document.getElementById('txt-header-sub').innerText = config.masjidSub;
  document.getElementById('txt-comp-title').innerText = config.compTitle;
  document.getElementById('txt-comp-subtitle').innerText = config.compSubtitle;
  document.getElementById('txt-badge-comp').innerText = config.compBadge;
  document.getElementById('txt-comp-desc').innerText = config.compDesc;
  document.getElementById('banner-exam-date-str').innerText = config.examDate;
  document.getElementById('txt-juma-announcement').innerText = config.jumaLine;
  document.getElementById('ribbon-poc').innerText = config.pocContact;

  if (document.getElementById('cfg-masjid-title')) {
    document.getElementById('cfg-masjid-title').value = config.masjidTitle;
    document.getElementById('cfg-date-time').value = config.examDate;
    document.getElementById('cfg-prep-time').value = config.prepTime;
    document.getElementById('cfg-exam-time').value = config.examTime;
    document.getElementById('cfg-poc').value = config.pocContact;
    document.getElementById('cfg-masjid-contact').value = config.masjidContact;
    document.getElementById('cfg-venue').value = config.examVenue;
    renderPrayerConfigGrid();
  }
}

function renderPrayerTimes() {
  const container = document.getElementById('prayer-time-table');
  container.innerHTML = config.prayers.map(p => `
    <div class="flex justify-between items-center py-1.5 border-b border-slate-100">
      <span class="font-bold text-slate-800">${p.name}</span>
      <div class="space-x-3">
        <span class="text-slate-400">Azan: ${p.adhan}</span>
        <span class="text-emerald-800 font-mono font-bold">Iqama: ${p.iqama}</span>
      </div>
    </div>
  `).join('');
}

function renderPrayerConfigGrid() {
  const grid = document.getElementById('cfg-prayers-grid');
  grid.innerHTML = config.prayers.map((p, idx) => `
    <div class="p-2 border rounded bg-slate-50">
      <span class="font-bold block text-slate-800 mb-1">${p.name}</span>
      <label class="text-[9px] text-gray-500">Azan</label>
      <input type="text" id="cfg-p-adhan-${idx}" value="${p.adhan}" class="border rounded p-1 w-full text-xs mb-1" />
      <label class="text-[9px] text-gray-500">Iqama</label>
      <input type="text" id="cfg-p-iqama-${idx}" value="${p.iqama}" class="border rounded p-1 w-full text-xs" />
    </div>
  `).join('');
}

function renderNotices() {
  const el = document.getElementById('home-notices-container');
  el.innerHTML = notices.map(n => `
    <div class="p-2.5 bg-amber-50/60 border border-amber-200/80 rounded-lg">
      <div class="flex justify-between font-bold text-slate-800">
        <span>${n.title}</span>
        <span class="text-[10px] text-amber-700 font-normal">${n.date}</span>
      </div>
      <p class="text-[11px] text-slate-600 mt-1">${n.desc}</p>
    </div>
  `).join('');
}

function renderModelPapers() {
  const el = document.getElementById('model-papers-list');
  el.innerHTML = papers.map(p => `
    <div class="p-4 bg-slate-50 border rounded-lg flex justify-between items-center">
      <div>
        <h4 class="font-bold text-sm text-slate-800">${p.title}</h4>
        <span class="text-xs text-amber-700 font-semibold">Edition Year: ${p.year}</span>
      </div>
      <a href="${p.url}" target="_blank" class="bg-emerald-950 text-amber-300 px-3 py-1.5 rounded text-xs font-bold hover:bg-emerald-900">
        <i class="fa-solid fa-download mr-1"></i> Download
      </a>
    </div>
  `).join('');
}

function addNewModelPaper() {
  const title = document.getElementById('new-paper-title').value.trim();
  const year = document.getElementById('new-paper-year').value.trim();
  const url = document.getElementById('new-paper-url').value.trim();
  if (!title || !url) return alert('Enter title and paper URL');

  papers.unshift({ id: Date.now(), title, year: year || '2026', url });
  DataStore.set('sm_papers', papers);
  renderModelPapers();
  alert('Model paper uploaded.');
}

function navigateTab(tabId) {
  ['home', 'competitions', 'model-papers', 'doc-lookup', 'results-public', 'feedback', 'printable', 'dashboard'].forEach(id => {
    const el = document.getElementById(`tab-${id}`);
    if (el) el.classList.add('hidden');
  });
  document.getElementById(`tab-${tabId}`).classList.remove('hidden');
  window.scrollTo(0, 0);
}

// AUTH & 24-HOUR EXPIRING SESSIONS
function saveSession(user, remember24h) {
  const now = new Date().getTime();
  const expiry = remember24h ? now + (24 * 3600 * 1000) : now + (2 * 3600 * 1000);
  const sessionObj = { user, expiry };
  localStorage.setItem('sm_session', JSON.stringify(sessionObj));
  session = sessionObj;
  updateAuthUI();
}

function getPersistentSession() {
  const raw = localStorage.getItem('sm_session');
  if (!raw) return null;
  try {
    const s = JSON.parse(raw);
    if (new Date().getTime() > s.expiry) {
      localStorage.removeItem('sm_session');
      return null;
    }
    return s;
  } catch (e) {
    return null;
  }
}

function handleSessionLogout() {
  localStorage.removeItem('sm_session');
  session = null;
  updateAuthUI();
  navigateTab('home');
}

function updateAuthUI() {
  const slot = document.getElementById('nav-auth-slot');
  if (session && session.user) {
    slot.innerHTML = `
      <button onclick="navigateTab('dashboard')" class="bg-amber-400 text-emerald-950 px-3 py-1 rounded-full font-bold">
        Dashboard (${session.user.name})
      </button>
    `;
  } else {
    slot.innerHTML = `
      <button onclick="openModal('modal-auth')" class="bg-amber-400 text-emerald-950 px-3.5 py-1.5 rounded-full font-bold">
        Login
      </button>
    `;
  }
}

function handleUniversalLogin(e) {
  e.preventDefault();
  const id = document.getElementById('login-id').value.trim();
  const pwd = document.getElementById('login-pwd').value.trim();
  const remember = document.getElementById('login-save-24h').checked;

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

  const found = students.find(s => (s.phone === id || s.email === id || s.ticketNo === id) && s.password === pwd);
  if (found) {
    if (found.status === 'Blocked') return alert('Your profile is blocked due to duplicate verification conflict. Contact committee.');
    saveSession({ id: found.ticketNo, name: found.name, role: 'student', data: found }, remember);
    window.closeModal('modal-auth');
    openDashboard();
    return;
  }

  alert('Invalid credentials.');
}

// REGISTRATION WITH DUPLICATE DETECTION (DOB + GOVT ID)
function handleStudentRegister(e) {
  e.preventDefault();
  const dob = document.getElementById('reg-dob').value;
  const idNumber = document.getElementById('reg-id-number').value.trim().toUpperCase();

  // Duplicate Check
  const isDuplicate = students.some(s => s.dob === dob && s.idNumber === idNumber);
  if (isDuplicate) {
    alert('Duplicate Registration Error: A candidate with this Date of Birth and Government ID Number already exists.');
    return;
  }

  const category = document.getElementById('reg-category').value;
  const gender = document.getElementById('reg-gender').value;
  const attempt = document.querySelector('input[name="reg-attempt"]:checked').value;
  const seq = 1000 + students.length + 1;
  const ticketNo = `SUN-${category}-${gender}-${seq}`;
  const appId = `APP-HAMOOMEA-${new Date().getFullYear()}-${seq}`;

  const hall = gender === 'M' ? 'Hall A (Boys)' : 'Hall B (Girls)';
  const seat = `${hall} - Desk #${(students.length % 50) + 1}`;

  const cand = {
    appId,
    ticketNo,
    name: document.getElementById('reg-name').value.trim(),
    father: document.getElementById('reg-father').value.trim(),
    dob,
    phone: document.getElementById('reg-phone').value.trim(),
    email: document.getElementById('reg-email').value.trim() || 'N/A',
    idType: document.getElementById('reg-id-type').value,
    idNumber,
    category,
    gender,
    attempt,
    seat,
    address: document.getElementById('reg-address').value.trim(),
    password: document.getElementById('reg-password').value,
    marks: 0,
    status: 'Enrolled',
    registeredDate: new Date().toLocaleDateString('en-IN')
  };

  students.push(cand);
  DataStore.set('sm_students', students);

  saveSession({ id: cand.ticketNo, name: cand.name, role: 'student', data: cand }, true);
  alert(`Registration Complete!\nHall Ticket: ${ticketNo}\nAssigned Desk: ${seat}`);
  displayHallTicket(cand);
}

// SEATING ENGINE
function autoGenerateSeatingPlan() {
  if (students.length === 0) return alert('No registered students to seat.');
  let m = 1, f = 1;
  students.forEach(s => {
    if (s.gender === 'M') s.seat = `Hall A (Boys) - Desk #${m++}`;
    else s.seat = `Hall B (Girls) - Desk #${f++}`;
  });
  DataStore.set('sm_students', students);
  renderSeatingMatrixPreview();
  renderManagementRoster();
  alert('Seating plan matrix automatically created.');
}

function clearSeatingPlan() {
  if (confirm('Reset seating plan for all students?')) {
    students.forEach(s => s.seat = 'Unassigned');
    DataStore.set('sm_students', students);
    renderSeatingMatrixPreview();
    renderManagementRoster();
  }
}

function renderSeatingMatrixPreview() {
  const container = document.getElementById('seating-matrix-preview');
  if (!container) return;
  if (students.length === 0) {
    container.innerHTML = `<span class="text-gray-400 p-2 col-span-full">No candidates enrolled yet.</span>`;
    return;
  }
  container.innerHTML = students.map(s => `
    <div class="p-2 border rounded ${s.gender === 'M' ? 'bg-blue-50 border-blue-200' : 'bg-pink-50 border-pink-200'}">
      <span class="font-mono font-bold text-red-700 block">${s.ticketNo}</span>
      <span class="font-semibold text-slate-800 truncate block">${s.name}</span>
      <span class="text-[10px] font-bold text-emerald-800 block mt-1"><i class="fa-solid fa-chair mr-0.5"></i> ${s.seat || 'Unassigned'}</span>
    </div>
  `).join('');
}

// DASHBOARD
function openDashboard() {
  if (!session || !session.user) return window.openModal('modal-auth');
  const role = session.user.role;
  document.getElementById('dash-user-name').innerText = `Welcome, ${session.user.name}`;

  const pill = document.getElementById('dash-role-pill');
  pill.innerText = role.replace('_', ' ');
  pill.className = `text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
    role === 'super_admin' ? 'bg-red-100 text-red-700' : role === 'admin' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
  }`;

  document.getElementById('dash-section-student').classList.toggle('hidden', role !== 'student');
  document.getElementById('dash-section-management').classList.toggle('hidden', role === 'student');
  document.getElementById('super-admin-master-card').classList.toggle('hidden', role !== 'super_admin');

  if (role === 'student') {
    const cand = students.find(s => s.ticketNo === session.user.id) || session.user.data;
    document.getElementById('student-prep-time').innerText = config.prepTime;
    document.getElementById('student-exam-time').innerText = config.examTime;
    document.getElementById('student-dash-seat-badge').innerText = cand.seat || 'Allocated at Gate';
    document.getElementById('student-dash-result-box').innerHTML = `
      Marks: <span class="text-emerald-800 font-bold font-mono">${cand.marks || 0}/100</span> | Status: <span class="text-amber-800 font-bold">${cand.status}</span>
    `;
  } else {
    renderManagementRoster();
    renderSeatingMatrixPreview();
    syncConfigUI();
  }

  navigateTab('dashboard');
}

function renderManagementRoster() {
  const tbody = document.getElementById('admin-roster-tbody');
  tbody.innerHTML = students.map((s, idx) => `
    <tr class="hover:bg-slate-50 text-xs">
      <td class="p-2.5 font-mono font-bold text-red-600">${s.ticketNo}</td>
      <td class="p-2.5 font-semibold">${s.name}</td>
      <td class="p-2.5">${s.father}</td>
      <td class="p-2.5">${s.dob || 'N/A'}</td>
      <td class="p-2.5">${s.category} (${s.gender})</td>
      <td class="p-2.5 font-bold text-emerald-800">${s.seat || 'Unassigned'}</td>
      <td class="p-2.5"><span class="px-2 py-0.5 rounded text-[10px] font-bold ${s.status === 'Blocked' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-800'}">${s.status}</span></td>
      <td class="p-2.5 text-center space-x-1">
        <button onclick="openEditCandidateModal(${idx})" class="text-blue-600 hover:underline">Edit</button>
        <button onclick="displayHallTicket(students[${idx}])" class="text-emerald-700 hover:underline">Ticket</button>
        ${session.user.role === 'super_admin' ? `<button onclick="deleteCandidate(${idx})" class="text-red-600 hover:underline">Delete</button>` : ''}
      </td>
    </tr>
  `).join('');
}

function filterRosterTable() {
  const q = document.getElementById('roster-search').value.toLowerCase();
  document.querySelectorAll('#admin-roster-tbody tr').forEach(r => {
    r.style.display = r.innerText.toLowerCase().includes(q) ? '' : 'none';
  });
}

function openEditCandidateModal(idx) {
  const c = students[idx];
  document.getElementById('edit-cand-index').value = idx;
  document.getElementById('edit-cand-ht').innerText = c.ticketNo;
  document.getElementById('edit-cand-name').value = c.name;
  document.getElementById('edit-cand-father').value = c.father;
  document.getElementById('edit-cand-seat').value = c.seat || '';
  document.getElementById('edit-cand-marks').value = c.marks || 0;
  document.getElementById('edit-cand-status').value = c.status;
  document.getElementById('edit-cand-newpwd').value = '';
  window.openModal('modal-edit-candidate');
}

function saveCandidateModifications(e) {
  e.preventDefault();
  const idx = document.getElementById('edit-cand-index').value;
  const c = students[idx];
  c.name = document.getElementById('edit-cand-name').value.trim();
  c.father = document.getElementById('edit-cand-father').value.trim();
  c.seat = document.getElementById('edit-cand-seat').value.trim();
  c.marks = parseInt(document.getElementById('edit-cand-marks').value) || 0;
  c.status = document.getElementById('edit-cand-status').value;
  const newPwd = document.getElementById('edit-cand-newpwd').value.trim();
  if (newPwd) c.password = newPwd;

  students[idx] = c;
  DataStore.set('sm_students', students);
  window.closeModal('modal-edit-candidate');
  renderManagementRoster();
  renderSeatingMatrixPreview();
  alert('Candidate modifications saved.');
}

function deleteCandidate(idx) {
  if (confirm(`Super Admin Verification: Delete candidate ${students[idx].ticketNo}?`)) {
    students.splice(idx, 1);
    DataStore.set('sm_students', students);
    renderManagementRoster();
    renderSeatingMatrixPreview();
  }
}

function saveSuperAdminConfig() {
  config.masjidTitle = document.getElementById('cfg-masjid-title').value.trim();
  config.examDate = document.getElementById('cfg-date-time').value.trim();
  config.prepTime = document.getElementById('cfg-prep-time').value.trim();
  config.examTime = document.getElementById('cfg-exam-time').value.trim();
  config.pocContact = document.getElementById('cfg-poc').value.trim();
  config.masjidContact = document.getElementById('cfg-masjid-contact').value.trim();
  config.examVenue = document.getElementById('cfg-venue').value.trim();

  // Save Azan & Iqama times
  config.prayers.forEach((p, idx) => {
    p.adhan = document.getElementById(`cfg-p-adhan-${idx}`).value;
    p.iqama = document.getElementById(`cfg-p-iqama-${idx}`).value;
  });

  DataStore.set('sm_config', config);
  syncConfigUI();
  renderPrayerTimes();
  alert('Global timings, POC details, and prayer times updated successfully.');
}

// DOCUMENT ENGINE
function showCurrentStudentDoc(type) {
  const cand = students.find(s => s.ticketNo === session.user.id) || session.user.data;
  if (type === 'ticket') displayHallTicket(cand);
  else displayApplicationForm(cand);
}

function handleDocLookup(e) {
  e.preventDefault();
  const phone = document.getElementById('lookup-phone').value.trim();
  const name = document.getElementById('lookup-name').value.trim().toLowerCase();
  const father = document.getElementById('lookup-father').value.trim().toLowerCase();
  const type = document.getElementById('lookup-doc-type').value;

  const cand = students.find(s => s.phone === phone && s.name.trim().toLowerCase() === name && s.father.trim().toLowerCase() === father);
  if (!cand) return alert('Verification failed: Mobile, name, and father name did not match any record.');

  if (type === 'ticket') displayHallTicket(cand);
  else displayApplicationForm(cand);
}

function displayHallTicket(cand) {
  const area = document.getElementById('printable-document');
  area.innerHTML = `
    <div class="border-b-2 border-emerald-900 pb-3 mb-4 flex justify-between items-center">
      <div>
        <h2 class="text-lg font-black text-emerald-950 font-cinzel">${config.compTitle}</h2>
        <p class="text-[11px] text-gray-600 font-bold uppercase">${config.masjidTitle}</p>
        <p class="text-[10px] text-emerald-800 font-semibold">${config.masjidSub}</p>
      </div>
      <div class="text-right">
        <span class="text-[10px] text-gray-500 font-bold uppercase block">Hall Ticket Number</span>
        <span class="text-lg font-mono font-black text-red-600">${cand.ticketNo}</span>
      </div>
    </div>

    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-8 space-y-2 text-xs">
        <p><strong>Candidate Name:</strong> <span class="uppercase font-bold">${cand.name}</span></p>
        <p><strong>Father's Name:</strong> <span class="uppercase">${cand.father}</span></p>
        <p><strong>Date of Birth:</strong> ${cand.dob || 'Verified'}</p>
        <p><strong>Category:</strong> <span class="font-bold text-emerald-900">${cand.category}</span> (${cand.gender === 'M' ? 'Male Candidate' : 'Female Candidate'})</p>
        <div class="p-2 bg-amber-50 border border-amber-300 rounded">
          <p><strong>Assigned Seating Desk:</strong> <span class="text-sm font-black text-red-700">${cand.seat || 'Allocated at Gate'}</span></p>
          <p class="text-[11px] text-emerald-900"><strong>Reporting & Prep:</strong> ${config.prepTime}</p>
          <p class="text-[11px] text-red-700"><strong>Exam Timing:</strong> ${config.examTime}</p>
        </div>
        <p><strong>Exam Date:</strong> ${config.examDate}</p>
        <p><strong>Venue:</strong> ${config.examVenue}</p>
      </div>

      <div class="col-span-4 flex flex-col items-center justify-between border-l pl-4">
        <div class="w-28 h-32 border-2 border-dashed border-slate-400 bg-slate-50 flex flex-col items-center justify-center text-center p-1 rounded text-[10px] text-slate-500">
          <i class="fa-regular fa-user text-xl mb-1 text-slate-400"></i>
          <span>Affix Recent Passport Photo</span>
        </div>
        <div class="mt-2 text-center">
          <div id="ticket-qr" class="p-1 border bg-white inline-block"></div>
          <span class="block text-[8px] text-slate-400 uppercase mt-0.5">Invigilator Scan QR</span>
        </div>
      </div>
    </div>
  `;

  new QRCode(document.getElementById('ticket-qr'), {
    text: `VERIFY|HT:${cand.ticketNo}|NAME:${cand.name}|SEAT:${cand.seat}|DOB:${cand.dob}`,
    width: 80,
    height: 80
  });

  navigateTab('printable');
}

function displayApplicationForm(cand) {
  const area = document.getElementById('printable-document');
  area.innerHTML = `
    <div class="text-center border-b-2 border-amber-600 pb-3 mb-4">
      <p class="font-arabic text-xl font-bold text-emerald-950 leading-none">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</p>
      <h2 class="text-base font-extrabold text-emerald-950 uppercase font-cinzel mt-1">${config.masjidTitle}</h2>
      <p class="text-[11px] font-semibold text-amber-700">${config.masjidSub}</p>
      <p class="text-[10px] text-slate-600 font-bold">${config.compTitle}</p>
    </div>
    <div class="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded border">
      <p><strong>Application ID:</strong> ${cand.appId}</p>
      <p><strong>Hall Ticket No:</strong> <span class="text-red-600 font-bold">${cand.ticketNo}</span></p>
      <p><strong>Candidate:</strong> ${cand.name}</p>
      <p><strong>Father:</strong> ${cand.father}</p>
      <p><strong>DOB:</strong> ${cand.dob}</p>
      <p><strong>Identity Proof:</strong> ${cand.idType} (${cand.idNumber})</p>
      <p><strong>Assigned Seat:</strong> ${cand.seat}</p>
      <p><strong>Status:</strong> ${cand.status}</p>
    </div>
  `;
  navigateTab('printable');
}

function pullAllApplicationForms() {
  if (students.length === 0) return alert('No applications registered.');
  const area = document.getElementById('printable-document');
  area.innerHTML = students.map((cand, idx) => `
    <div class="${idx < students.length - 1 ? 'page-break' : ''} p-4 mb-4 border-b">
      <h3 class="font-bold text-sm text-emerald-950">${cand.name} (${cand.ticketNo})</h3>
      <p class="text-xs">Father: ${cand.father} | DOB: ${cand.dob} | Govt ID: ${cand.idNumber}</p>
      <p class="text-xs font-bold text-amber-800">Seat Desk: ${cand.seat} | Status: ${cand.status}</p>
    </div>
  `).join('');
  navigateTab('printable');
}

function handlePublicResultLookup() {
  const ht = document.getElementById('public-ht-input').value.trim().toUpperCase();
  const resBox = document.getElementById('public-result-display');
  const cand = students.find(s => s.ticketNo === ht);
  if (!cand) {
    resBox.classList.remove('hidden');
    resBox.innerHTML = `<span class="text-xs text-red-600 font-bold">No record found for Hall Ticket "${ht}".</span>`;
    return;
  }
  resBox.classList.remove('hidden');
  resBox.innerHTML = `
    <h4 class="text-sm font-bold text-slate-900">${cand.name} (${cand.ticketNo})</h4>
    <p class="text-xs"><strong>Seat:</strong> ${cand.seat} | <strong>Score:</strong> <span class="font-bold text-emerald-800 font-mono">${cand.marks}/100</span></p>
    <p class="text-xs"><strong>Status:</strong> ${cand.status}</p>
  `;
}

function handleFeedbackSubmit(e) {
  e.preventDefault();
  feedbacks.unshift({
    name: document.getElementById('fb-name').value.trim(),
    phone: document.getElementById('fb-phone').value.trim(),
    message: document.getElementById('fb-msg').value.trim(),
    date: new Date().toLocaleDateString('en-IN')
  });
  DataStore.set('sm_feedbacks', feedbacks);
  alert('Query dispatched to committee.');
  document.getElementById('fb-msg').value = '';
  navigateTab('home');
}

function downloadPDFDoc() {
  const el = document.getElementById('printable-document');
  html2pdf().set({
    margin: 6,
    filename: 'Madarsa_Seerat_Record.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  }).from(el).save();
}
