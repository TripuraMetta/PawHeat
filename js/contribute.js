(function () {
  const dynamicContent = document.getElementById('dynamicContent');
  const shelters = [
  {
    name: "Shelter #1",
    status: "Occupied",
    location: "Girls Hostel",
    details: "Often dogs rest here",
    img: "images/shelters/shelter1.jpg"
  },
  {
    name: "Shelter #2",
    status: "Available",
    location: "Footpath",
    details: "Empty most of the day",
    img: "images/shelters/shelter2.jpg"
  },
  {
    name: "Shelter #3",
    status: "Occupied",
    location: "Near Canteen",
    details: "Two dogs seen during evening",
    img: "images/shelters/shelter3.jpg"
  }
];
const stories = [
  {
    name: "Tommy’s Journey",
    before: "images/stories/before1.jpg",
    after: "images/stories/after1.jpg",
    note: "Rescued with a broken leg, now healed and happy."
  },
  {
    name: "Luna’s Transformation",
    before: "images/stories/before2.jpg",
    after: "images/stories/after2.jpg",
    note: "Found malnourished, now thriving in a loving shelter."
  }
];


  const showAppToast = msg => {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.style.opacity = '1';
    setTimeout(() => { t.style.opacity = '0'; }, 2500);
  };

  const hideOriginals = () => {
    ['shelters', 'report-cta', 'contribute-cta', 'stories'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = 'none';
    });
  };



  // ---- Shelters ----
function renderShelters() {
  const container = document.getElementById("dynamicContent");
  container.innerHTML = `
    <h2>🏠 Shelter Info</h2>
    <p>Photo • Location • Quick actions</p>
    <div class="shelter-grid"></div>
  `;

  const grid = container.querySelector(".shelter-grid");

  shelters.forEach((shelter, i) => {
    const card = document.createElement("div");
    card.className = "shelter-card";
    card.innerHTML = `
      <!-- 👇 insert image into the same box -->
      <div class="shelter-image">
        <img src="${shelter.img}" alt="${shelter.name}">
      </div>

      <div class="shelter-body">
        <h3>${shelter.name} 
          <span class="status ${shelter.status.toLowerCase()}">${shelter.status}</span>
        </h3>
        <p>📍 ${shelter.location}</p>
        <p>${shelter.details}</p>
      </div>

      <div class="shelter-actions">
  <button class="btn-map" onclick="window.open('https://maps.app.goo.gl/pTVbW5j5jETmTcew7', '_blank')">
    📍 View Location
  </button>
</div>

    `;
    grid.appendChild(card);
  });
}



  // ---- Reports ----
  function renderReport(openInline = false, preselectShelterId = '') {
    dynamicContent.innerHTML = `
    <div class="section-header">
      <h2>🚨 Report an Issue</h2>
      <p class="muted">Report damaged shelter or sick animal quickly.</p>
    </div>
    <form id="inlineReportForm" class="form">
      <label>Shelter (optional)
        <select id="inlineReportShelter"><option value="">— Select shelter —</option></select>
      </label>
      <label>Issue Type
        <select id="inlineReportType" required>
          <option value="">— Select —</option>
          <option value="damaged">Damaged shelter</option>
          <option value="sick">Sick animal</option>
          <option value="sighting">New sighting</option>
          <option value="other">Other</option>
        </select>
      </label>
      <label>Details
        <textarea id="inlineReportDetails" rows="4" placeholder="Short description..." required></textarea>
      </label>
      <label>Your contact (optional)
        <input id="inlineReportContact" type="text" placeholder="Name / Phone / Email">
      </label>
      <div class="form-actions">
        <button type="submit" class="btn btn-primary">Submit Report</button>
        <button type="button" class="btn btn-outline" id="inlineReportCancel">Cancel</button>
      </div>
    </form>`;
    
    const sel = document.getElementById('inlineReportShelter');
    shelters.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s.id; opt.textContent = `${s.name} — ${s.location}`;
      sel.appendChild(opt);
    });
    if(preselectShelterId) sel.value = preselectShelterId;

    document.getElementById('inlineReportForm').addEventListener('submit', ev => {
      ev.preventDefault();
      const data = {
        id: 'R' + Date.now(),
        shelter: document.getElementById('inlineReportShelter').value || null,
        type: document.getElementById('inlineReportType').value,
        details: document.getElementById('inlineReportDetails').value.trim(),
        contact: document.getElementById('inlineReportContact').value.trim(),
        time: new Date().toISOString()
      };
      const arr = JSON.parse(localStorage.getItem('paw_reports') || '[]');
      arr.push(data);
      localStorage.setItem('paw_reports', JSON.stringify(arr));
      showAppToast('Report submitted — thank you');
      dynamicContent.innerHTML = '<div class="muted">Report submitted successfully.</div>';
    });

    document.getElementById('inlineReportCancel').addEventListener('click', () => {
      dynamicContent.innerHTML = '<div class="muted">Report cancelled.</div>';
    });

    if(openInline) document.getElementById('inlineReportType').focus();
  }

  // ---- Contribute (Money + Food + Fabric) ----
  function renderContribute(openInline = false) {
    dynamicContent.innerHTML = `
      <div class="section-header">
        <h2>❤️ Contribute</h2>
        <p class="muted">Donate fabric, food or pledge money for upkeep.</p>
      </div>

      <div class="tabs">
        <button class="tab-btn active" data-tab="money">Money</button>
        <button class="tab-btn" data-tab="food">Food</button>
        <button class="tab-btn" data-tab="fabric">Fabric</button>
      </div>

      <div class="tab-contents">
        <!-- Money -->
        <div class="tab-content" id="tab-money">
          <form id="moneyForm" class="form">
            <label>Name
              <input type="text" id="name" placeholder="Your Name" required>
            </label>
            <label>Amount (INR)
              <input type="number" id="moneyAmount" min="1" required>
            </label>
            <label>UPI ID
              <input type="text" id="moneyUPI" placeholder="example@upi" required>
            </label>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary">Donate</button>
              <button type="button" class="btn btn-outline cancelBtn">Cancel</button>
            </div>
          </form>
          <div id="moneyResult" style="margin-top:10px;"></div>
        </div>

        <!-- Food -->
        <div class="tab-content" id="tab-food" style="display:none;">
          <form id="foodForm" class="form">
            <label>Item Name
              <input type="text" id="foodItem" placeholder="Dog food, milk..." required>
            </label>
            <label>Quantity
              <input type="number" id="foodQty" min="1" required>
            </label>
            <label>
              <input type="checkbox" id="foodPickup"> Request Pickup?
            </label>
            <label id="foodAddressLabel" style="display:none;">Pickup Address
              <input type="text" id="foodAddress" placeholder="Your address">
            </label>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary">Send Food</button>
              <button type="button" class="btn btn-outline cancelBtn">Cancel</button>
            </div>
          </form>
        </div>

        <!-- Fabric -->
        <div class="tab-content" id="tab-fabric" style="display:none;">
          <form id="fabricForm" class="form">
            <label>Fabric Type
              <input type="text" id="fabricType" placeholder="Blanket, towel..." required>
            </label>
            <label>Quantity
              <input type="number" id="fabricQty" min="1" required>
            </label>
            <label>Drop-off Center
              <input type="text" id="fabricCenter" placeholder="Shelter or location" required>
            </label>
            <label>
              <input type="checkbox" id="fabricPickup"> Request Pickup?
            </label>
            <label id="fabricAddressLabel" style="display:none;">Pickup Address
              <input type="text" id="fabricAddress" placeholder="Your address">
            </label>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary">Send Fabric</button>
              <button type="button" class="btn btn-outline cancelBtn">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    `;

    // ---- Tabs ----
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.querySelectorAll('.tab-content').forEach(tc => tc.style.display = 'none');
        document.getElementById('tab-' + btn.dataset.tab).style.display = 'block';
      });
    });

    // ---- Conditional Pickup ----
    document.getElementById('foodPickup').addEventListener('change', e => {
      document.getElementById('foodAddressLabel').style.display = e.target.checked ? 'block' : 'none';
    });
    document.getElementById('fabricPickup').addEventListener('change', e => {
      document.getElementById('fabricAddressLabel').style.display = e.target.checked ? 'block' : 'none';
    });

    // ---- Money Form (backend + receipt) ----
    document.getElementById("moneyForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const amount = Number(document.getElementById("moneyAmount").value);
  const upiId = document.getElementById("moneyUPI").value.trim();
  const resultDiv = document.getElementById("moneyResult");

  resultDiv.innerHTML = "Processing…";

  try {
    const res = await fetch("http://localhost:5000/api/donations/money", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, amount, upiId }),
    });

    // Read body once, then decide
    const text = await res.text();
    console.log("Raw response:", text);

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error(`Non-JSON response from server: ${text || res.status}`);
    }

    if (!res.ok || !data.success) {
      throw new Error(data?.error || `Request failed (HTTP ${res.status})`);
    }

    // Success UI
    resultDiv.innerHTML = `<p style="color:green;">
      ✅ Thank you <strong>${data.receipt.name}</strong> 🙏.<br>
      Your donation of ₹${data.receipt.amount} has been received.
    </p>`;

    // Build & download receipt
    const receiptContent = `Receipt ID: ${data.receipt.receiptId}
Name: ${data.receipt.name}
Amount: ₹${data.receipt.amount}
UPI ID: ${data.receipt.upiId}
Date: ${new Date(data.receipt.date).toLocaleString()}`;

    const blob = new Blob([receiptContent], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Receipt_${data.receipt.receiptId}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    e.target.reset();
  } catch (err) {
    console.error(err);
    resultDiv.innerHTML = `<p style="color:red;">❌ ${err.message}</p>`;
  }
});



    // ---- Food Form ----
    document.getElementById('foodForm').addEventListener('submit', ev => {
      ev.preventDefault();
      const data = {
        id: 'F' + Date.now(),
        item: document.getElementById('foodItem').value.trim(),
        quantity: document.getElementById('foodQty').value,
        pickup: document.getElementById('foodPickup').checked,
        address: document.getElementById('foodAddress').value.trim() || null,
        time: new Date().toISOString()
      };
      const arr = JSON.parse(localStorage.getItem('paw_food') || '[]');
      arr.push(data);
      localStorage.setItem('paw_food', JSON.stringify(arr));
      showAppToast('Food donation recorded. Thank you!');
      renderContribute();
    });

    // ---- Fabric Form ----
    document.getElementById('fabricForm').addEventListener('submit', ev => {
      ev.preventDefault();
      const data = {
        id: 'B' + Date.now(),
        type: document.getElementById('fabricType').value.trim(),
        quantity: document.getElementById('fabricQty').value,
        center: document.getElementById('fabricCenter').value.trim(),
        pickup: document.getElementById('fabricPickup').checked,
        address: document.getElementById('fabricAddress').value.trim() || null,
        time: new Date().toISOString()
      };
      const arr = JSON.parse(localStorage.getItem('paw_fabric') || '[]');
      arr.push(data);
      localStorage.setItem('paw_fabric', JSON.stringify(arr));
      showAppToast('Fabric donation recorded. Thank you!');
      renderContribute();
    });

    // ---- Cancel ----
    document.querySelectorAll('.cancelBtn').forEach(btn => {
      btn.addEventListener('click', () => {
        dynamicContent.innerHTML = '<div class="muted">Donation cancelled.</div>';
      });
    });

    if (openInline) document.querySelector('#tab-money input')?.focus();
  }

  // ---- Stories ----
  // ---- Stories ----
function renderStories() {
  let html = `<div class="section-header">
                <h2>📸 Stories & Before-After</h2>
                <p class="muted">Short updates from campus shelters — emotional connects.</p>
              </div>
              <div class="story-grid">`;

  stories.forEach(story => {
    html += `<div class="story-card">
      <h3>${story.name}</h3>
      <div class="story-images">
        <div class="before">
          <p>Before</p>
          <img src="${story.before}" alt="Before rescue" 
               onerror="this.src='https://via.placeholder.com/200x150?text=Before'">
        </div>
        <div class="after">
          <p>After</p>
          <img src="${story.after}" alt="After rescue" 
               onerror="this.src='https://via.placeholder.com/200x150?text=After'">
        </div>
      </div>
      <p class="muted">${story.note}</p>
    </div>`;
  });

  html += `</div>`;
  dynamicContent.innerHTML = html;
}

  

  // ---- Navigation ----
  function showSectionByAnchor(anchor) {
    hideOriginals();
    switch(anchor) {
      case 'shelters': renderShelters(); break;
      case 'report-cta': renderReport(); break;
      case 'contribute-cta': renderContribute(); break;
      case 'stories': renderStories(); break;
      default: dynamicContent.innerHTML = '<div class="muted">Select an option above to view details</div>';
    }
  }

  document.querySelectorAll('.topnav .nav a').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const href = (link.getAttribute('href') || '').replace('#','').trim();
      showSectionByAnchor(href);
    });
  });

  // ---- Init ----
  const initialHash = (window.location.hash || '').replace('#','');
  if(initialHash) setTimeout(() => showSectionByAnchor(initialHash), 200);
  else hideOriginals();

})();
