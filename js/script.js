/* pawheat script.js
   - renders demo shelters & stories
   - opens/closes modals
   - handles simple localStorage saving for reports & donations
*/

document.addEventListener('DOMContentLoaded', () => {
  // small responsive nav toggle
  const menuBtn = document.querySelector('.menu-toggle');
  if (menuBtn) {
    menuBtn.addEventListener('click', () => {
      const nav = document.querySelector('.nav');
      if (nav) nav.style.display = (nav.style.display === 'flex') ? 'none' : 'flex';
    });
  }

  // demo shelter data — replace images in images/ folder
  const shelters = [
    { id: 's1', name: 'Shelter #1', location: 'Near CSE Block', img: 'images/shelter1.jpg', status: 'occupied', note: 'Usually 1–2 dogs rest here.'},
    { id: 's2', name: 'Shelter #2', location: 'Library Entrance', img: 'images/shelter2.jpg', status: 'available', note: 'Empty most of the day.'},
    { id: 's3', name: 'Shelter #3', location: 'South Lawn', img: 'images/shelter3.jpg', status: 'occupied', note: 'Two dogs seen during evening.'}
  ];

  renderShelters(shelters);
  populateShelterSelects(shelters);
  renderStories(shelters);

  // modal controls
  const reportModal = document.getElementById('reportModal');
  const donateModal = document.getElementById('donateModal');

  document.getElementById('openReportBtn').addEventListener('click', () => openModal(reportModal));
  document.getElementById('openDonateBtn').addEventListener('click', () => openModal(donateModal));

  // card buttons delegate
  document.body.addEventListener('click', (e) => {
    if (e.target.matches('.btn-report')) {
      const sid = e.target.dataset.shelter;
      selectShelterInReport(sid);
      openModal(reportModal);
      scrollIntoView(reportModal);
    } else if (e.target.matches('.btn-donate')) {
      openModal(donateModal);
      scrollIntoView(donateModal);
    } else if (e.target.matches('[data-close]')) {
      closeModal(e.target.closest('.modal'));
    }
  });

  // form handlers
  const reportForm = document.getElementById('reportForm');
  reportForm.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const data = {
      id: 'R' + Date.now(),
      shelter: document.getElementById('reportShelter').value || null,
      type: document.getElementById('reportType').value,
      details: document.getElementById('reportDetails').value.trim(),
      contact: document.getElementById('reportContact').value.trim(),
      time: new Date().toISOString()
    };
    const arr = JSON.parse(localStorage.getItem('paw_reports') || '[]');
    arr.push(data);
    localStorage.setItem('paw_reports', JSON.stringify(arr));
    closeModal(reportModal);
    showToast('Report submitted — thank you');
    reportForm.reset();
    console.log('Report saved', data);
  });

  const donateForm = document.getElementById('donateForm');
  donateForm.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const data = {
      id: 'D' + Date.now(),
      name: document.getElementById('donorName').value.trim(),
      type: document.getElementById('donationType').value,
      amount: document.getElementById('donationAmount').value || null,
      note: document.getElementById('donationNote').value.trim(),
      time: new Date().toISOString()
    };
    const arr = JSON.parse(localStorage.getItem('paw_donations') || '[]');
    arr.push(data);
    localStorage.setItem('paw_donations', JSON.stringify(arr));
    closeModal(donateModal);
    showToast('Thank you! Donation pledge recorded.');
    donateForm.reset();
    console.log('Donation saved', data);
  });

  // close modals on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      [reportModal, donateModal].forEach(m => m && closeModal(m));
    }
  });

});

/* -- render shelter cards -- */
function renderShelters(shelters) {
  const grid = document.getElementById('shelterGrid');
  grid.innerHTML = '';
  shelters.forEach(s => {
    const el = document.createElement('article');
    el.className = 'shelter';
    el.innerHTML = `
      <div class="imgwrap"><img src="${s.img}" alt="${s.name}" onerror="this.style.background='#eee';this.src='https://via.placeholder.com/400x250?text=Shelter'"></div>
      <div>
        <h3>${s.name} <span class="badge ${s.status === 'occupied' ? 'occupied' : 'available'}">${s.status === 'occupied' ? 'Occupied' : 'Available'}</span></h3>
        <div class="loc">📍 ${s.location}</div>
        <div class="note">${s.note}</div>
      </div>
      <div class="card-actions">
        <button class="btn btn-outline btn-report" data-shelter="${s.id}">Report</button>
        <button class="btn btn-primary btn-donate">Contribute</button>
      </div>
    `;
    grid.appendChild(el);
  });
}

/* populate selects in forms */
function populateShelterSelects(shelters) {
  const sel = document.getElementById('reportShelter');
  if (!sel) return;
  shelters.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s.id; opt.textContent = `${s.name} — ${s.location}`;
    sel.appendChild(opt);
  });
}

/* stories grid re-use shelters as demo */
function renderStories(shelters) {
  const grid = document.getElementById('storiesGrid');
  grid.innerHTML = '';
  shelters.forEach(s => {
    const c = document.createElement('div');
    c.className = 'story';
    c.innerHTML = `<img src="${s.img}" alt="${s.name}" onerror="this.src='https://via.placeholder.com/400x250?text=Story'"><div style="padding:8px"><strong>${s.name}</strong><div class="muted">${s.note}</div></div>`;
    grid.appendChild(c);
  });
}

/* modal helpers */
function openModal(modalEl) {
  if (!modalEl) return;
  modalEl.setAttribute('aria-hidden', 'false');
}
function closeModal(modalEl) {
  if (!modalEl) return;
  modalEl.setAttribute('aria-hidden', 'true');
}
function scrollIntoView(el) {
  if (!el) return;
  el.scrollIntoView({behavior:'smooth',block:'center'});
}

/* pre-select shelter in report form when user clicked from card */
function selectShelterInReport(sid) {
  if (!sid) return;
  const sel = document.getElementById('reportShelter');
  if (!sel) return;
  sel.value = sid;
}

/* small toast */
function showToast(text, ms = 2600) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = text;
  t.style.opacity = '1';
  t.style.transform = 'translateY(0)';
  setTimeout(()=>{ t.style.opacity='0'; t.style.transform='translateY(8px)'; }, ms);
}
