/* =============================================
   MIRA Health Prediction — Frontend Logic
   ============================================= */

// ─── Constants ───────────────────────────────────
// Clinical thresholds — single source of truth.
// Must stay in sync with app/core/constants.py on the backend.
const THRESHOLDS = Object.freeze({
  glucose:     { high: 126, warn: 100 },
  haemoglobin: { critical: 8, low: 12 },
  cholesterol: { high: 240, warn: 200 },
});

const API = "/api/patients";

// ─── State ───────────────────────────────────────
let allPatients    = [];
let deleteTargetId = null;

// ─── DOM refs ────────────────────────────────────
const tableBody      = document.getElementById("tableBody");
const emptyState     = document.getElementById("emptyState");
const recordCount    = document.getElementById("recordCount");
const searchInput    = document.getElementById("searchInput");
const modalOverlay   = document.getElementById("modalOverlay");
const viewOverlay    = document.getElementById("viewOverlay");
const deleteOverlay  = document.getElementById("deleteOverlay");
const patientForm    = document.getElementById("patientForm");
const modalTitle     = document.getElementById("modalTitle");
const btnSubmit      = document.getElementById("btnSubmit");
const btnSubmitLabel = document.getElementById("btnSubmitLabel");
const btnSpinner     = document.getElementById("btnSpinner");

// ─── Init ────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  loadPatients();
  bindEvents();
});

// ─── Event Bindings ──────────────────────────────
function bindEvents() {
  document.getElementById("btnOpenAdd").addEventListener("click", openAddModal);
  document.getElementById("btnCloseModal").addEventListener("click", closeModal);
  document.getElementById("btnCancel").addEventListener("click", closeModal);
  document.getElementById("btnCloseView").addEventListener("click", () => closeOverlay(viewOverlay));
  document.getElementById("btnCloseDelete").addEventListener("click", () => closeOverlay(deleteOverlay));
  document.getElementById("btnCancelDelete").addEventListener("click", () => closeOverlay(deleteOverlay));
  document.getElementById("btnConfirmDelete").addEventListener("click", confirmDelete);

  patientForm.addEventListener("submit", handleSubmit);

  searchInput.addEventListener("input", () => {
    renderTable(filterPatients(searchInput.value));
  });

  // Close on backdrop click
  modalOverlay.addEventListener("click",  (e) => { if (e.target === modalOverlay)  closeModal(); });
  viewOverlay.addEventListener("click",   (e) => { if (e.target === viewOverlay)   closeOverlay(viewOverlay); });
  deleteOverlay.addEventListener("click", (e) => { if (e.target === deleteOverlay) closeOverlay(deleteOverlay); });

  // Close on ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal();
      closeOverlay(viewOverlay);
      closeOverlay(deleteOverlay);
    }
  });
}

// ─── API Layer ───────────────────────────────────

async function loadPatients() {
  try {
    const res = await fetch(API);
    if (!res.ok) throw new Error("Failed to load patients");
    allPatients = await res.json();
    renderTable(allPatients);
    updateStats(allPatients);
  } catch (err) {
    // Use CSS variable instead of hardcoded colour
    tableBody.innerHTML = `
      <tr>
        <td colspan="10" style="text-align:center;padding:40px;color:var(--red);">
          Error loading patients: ${escHtml(err.message)}
        </td>
      </tr>`;
    showToast("Failed to load patient records", "error");
  }
}

async function createPatient(data) {
  const res = await fetch(API, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(formatApiError(err));
  }
  return res.json();
}

async function updatePatient(id, data) {
  const res = await fetch(`${API}/${id}`, {
    method:  "PUT",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(formatApiError(err));
  }
  return res.json();
}

async function deletePatient(id) {
  const res = await fetch(`${API}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete patient");
}

async function getPatient(id) {
  const res = await fetch(`${API}/${id}`);
  if (!res.ok) throw new Error("Patient not found");
  return res.json();
}

/**
 * Formats a FastAPI / Pydantic validation error response into a
 * human-readable string.
 * @param {Object} err - The parsed JSON error body from the API.
 * @returns {string}
 */
function formatApiError(err) {
  if (err.detail && Array.isArray(err.detail)) {
    return err.detail.map((d) => d.msg.replace("Value error, ", "")).join("; ");
  }
  return err.detail || "An error occurred";
}

// ─── Render ──────────────────────────────────────

function renderTable(patients) {
  const wrap = document.querySelector(".table-wrap");

  if (!patients || patients.length === 0) {
    wrap.style.display   = "none";
    emptyState.style.display = "block";
    recordCount.textContent  = "No records";
    return;
  }

  wrap.style.display       = "";
  emptyState.style.display = "none";
  recordCount.textContent  = `${patients.length} record${patients.length !== 1 ? "s" : ""}`;

  tableBody.innerHTML = patients.map((p, idx) => `
    <tr>
      <td style="color:var(--text-sec);font-size:0.8rem">${idx + 1}</td>
      <td>
        <div class="td-name">${escHtml(p.full_name)}</div>
      </td>
      <td class="td-dob">${formatDate(p.date_of_birth)}</td>
      <td class="td-email">${escHtml(p.email)}</td>
<<<<<<< HEAD
      <td class="num-col">${badge(p.glucose, 'glucose')}</td>
      <td class="num-col">${badge(p.haemoglobin, 'haemoglobin')}</td>
      <td class="num-col">${badge(p.cholesterol, 'cholesterol')}</td>
      <td>${riskBadge(p.risk_level)}</td>
=======
      <td class="num-col">${labBadge(p.glucose, "glucose")}</td>
      <td class="num-col">${labBadge(p.haemoglobin, "haemoglobin")}</td>
      <td class="num-col">${labBadge(p.cholesterol, "cholesterol")}</td>
      <td class="risk-col">${riskBadge(p.risk_level)}</td>
>>>>>>> 6ad780f (fixed backend logic and improved risk calculation)
      <td class="remarks-col">
        ${p.remarks
          ? `<span class="remarks-text">${escHtml(p.remarks)}</span>`
          : `<span class="remarks-loading">
               <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                 <circle cx="6" cy="6" r="5" stroke="currentColor" stroke-width="1.5"
                   fill="none" stroke-dasharray="20" stroke-dashoffset="5">
                   <animateTransform attributeName="transform" type="rotate"
                     from="0 6 6" to="360 6 6" dur="1s" repeatCount="indefinite"/>
                 </circle>
               </svg>
               Generating…
             </span>`
        }
      </td>
      <td>
        <div class="action-btns">
          <button class="action-btn" title="View details"
            onclick="openView(${p.id})" aria-label="View details for ${escHtml(p.full_name)}">
            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M1 10s3.5-7 9-7 9 7 9 7-3.5 7-9 7-9-7-9-7z" stroke="currentColor" stroke-width="1.5"/>
              <circle cx="10" cy="10" r="2.5" stroke="currentColor" stroke-width="1.5"/>
            </svg>
          </button>
          <button class="action-btn edit" title="Edit patient"
            onclick="openEdit(${p.id})" aria-label="Edit ${escHtml(p.full_name)}">
            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M13.5 3.5l3 3-9 9H4.5v-3l9-9z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
            </svg>
          </button>
          <button class="action-btn delete" title="Delete patient"
            onclick="openDelete(${p.id}, '${escHtml(p.full_name)}')"
            aria-label="Delete ${escHtml(p.full_name)}">
            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M4 6h12M8 6V4h4v2M7 9v6M13 9v6M5 6l1 10h8l1-10"
                stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </td>
    </tr>
  `).join("");
}

// ─── Badges ──────────────────────────────────────

/**
 * Returns a coloured badge for a lab value (glucose, haemoglobin, cholesterol).
 * Thresholds are read from the THRESHOLDS constant — one place to update them.
 *
 * @param {number} value - The numeric lab result.
 * @param {"glucose"|"haemoglobin"|"cholesterol"} type
 * @returns {string} HTML string
 */
function labBadge(value, type) {
  const label = value.toFixed(1);
  let cls = "badge-ok";

  if (type === "glucose") {
    if (value >= THRESHOLDS.glucose.high) cls = "badge-high";
    else if (value >= THRESHOLDS.glucose.warn) cls = "badge-warn";
  } else if (type === "haemoglobin") {
    if (value < THRESHOLDS.haemoglobin.critical) cls = "badge-high";
    else if (value < THRESHOLDS.haemoglobin.low) cls = "badge-warn";
  } else if (type === "cholesterol") {
    if (value >= THRESHOLDS.cholesterol.high) cls = "badge-high";
    else if (value >= THRESHOLDS.cholesterol.warn) cls = "badge-warn";
  }

  return `<span class="badge ${cls}">${label}</span>`;
}

/**
 * Returns a coloured badge for a risk level string.
 * Handles the values produced by the backend ("Low Risk", "Moderate Risk",
 * "High Risk") as well as short forms ("low", "medium", "high") for
 * forward-compatibility.
 *
 * @param {string|null} level
 * @returns {string} HTML string
 */
function riskBadge(level) {
  if (!level) {
    return `<span style="color:var(--text-mute)">—</span>`;
  }

  const normalized = String(level).trim().toLowerCase();

  if (normalized.includes("high")) {
    return `<span class="badge badge-high">High Risk</span>`;
  }
  if (normalized.includes("moderate") || normalized.includes("medium")) {
    return `<span class="badge badge-warn">Moderate Risk</span>`;
  }
  if (normalized.includes("low")) {
    return `<span class="badge badge-ok">Low Risk</span>`;
  }

  // Fallback: render the raw value so unknown strings are visible
  return `<span class="badge badge-ok">${escHtml(level)}</span>`;
}

// ─── Stats ───────────────────────────────────────

function updateStats(patients) {
  const { glucose, haemoglobin, cholesterol } = THRESHOLDS;

  document.getElementById("statTotal").textContent =
    patients.length;
  document.getElementById("statHighGlucose").textContent =
    patients.filter((p) => p.glucose >= glucose.high).length;
  document.getElementById("statHighChol").textContent =
    patients.filter((p) => p.cholesterol >= cholesterol.high).length;
  document.getElementById("statLowHb").textContent =
    patients.filter((p) => p.haemoglobin < haemoglobin.low).length;
}

// ─── Search ──────────────────────────────────────

function filterPatients(query) {
  if (!query.trim()) return allPatients;
  const q = query.toLowerCase();
  return allPatients.filter(
    (p) =>
      p.full_name.toLowerCase().includes(q) ||
      p.email.toLowerCase().includes(q)
  );
}

// ─── Modal: Add ──────────────────────────────────

function openAddModal() {
  resetForm();
  modalTitle.textContent       = "Add Patient";
  btnSubmitLabel.textContent   = "Save Patient";
  document.getElementById("patientId").value = "";
  openOverlay(modalOverlay);
}
window.openAddModal = openAddModal;

// ─── Modal: Edit ─────────────────────────────────

async function openEdit(id) {
  try {
    const p = await getPatient(id);
    resetForm();
    modalTitle.textContent     = "Edit Patient";
    btnSubmitLabel.textContent = "Update Patient";

    document.getElementById("patientId").value   = p.id;
    document.getElementById("fullName").value    = p.full_name;
    document.getElementById("dob").value         = p.date_of_birth;
    document.getElementById("email").value       = p.email;
    document.getElementById("glucose").value     = p.glucose;
    document.getElementById("haemoglobin").value = p.haemoglobin;
    document.getElementById("cholesterol").value = p.cholesterol;

    openOverlay(modalOverlay);
  } catch (err) {
    showToast("Could not load patient data", "error");
  }
}
window.openEdit = openEdit;
// ─── Health Value Badge ──────────────────────────
function badge(value, type) {
  let cls = "badge-ok",
    label = value.toFixed(1);

  if (type === "glucose") {
    if (value >= 126) cls = "badge-high";
    else if (value >= 100) cls = "badge-warn";
  } else if (type === "haemoglobin") {
    if (value < 8) cls = "badge-high";
    else if (value < 12) cls = "badge-warn";
  } else if (type === "cholesterol") {
    if (value >= 240) cls = "badge-high";
    else if (value >= 200) cls = "badge-warn";
  }

  return `<span class="badge ${cls}">${label}</span>`;
}

// ─── Risk Level Badge ────────────────────────────
function riskBadge(level) {
  if (!level) {
    return `<span class="badge badge-ok">Unknown</span>`;
  }

  const risk = String(level).trim().toLowerCase();

  switch (risk) {
    case "low":
      return `<span class="badge badge-ok">Low</span>`;

    case "medium":
      return `<span class="badge badge-warn">Medium</span>`;

    case "high":
      return `<span class="badge badge-high">High</span>`;

    default:
      return `<span class="badge badge-ok">${escHtml(level)}</span>`;
  }
}

// ─── Modal: View ─────────────────────────────────

async function openView(id) {
  try {
    const p = await getPatient(id);

    document.getElementById("viewContent").innerHTML = `
      <div class="view-grid">
        <div class="view-field">
          <div class="view-field-label">Full Name</div>
          <div class="view-field-value">${escHtml(p.full_name)}</div>
        </div>
        <div class="view-field">
          <div class="view-field-label">Date of Birth</div>
          <div class="view-field-value">${formatDate(p.date_of_birth)}</div>
        </div>
        <div class="view-field full">
          <div class="view-field-label">Email Address</div>
          <div class="view-field-value">${escHtml(p.email)}</div>
        </div>
        <div class="view-field">
          <div class="view-field-label">Glucose</div>
          <div class="view-field-value">${labBadge(p.glucose, "glucose")} mg/dL</div>
        </div>
        <div class="view-field">
          <div class="view-field-label">Haemoglobin</div>
          <div class="view-field-value">${labBadge(p.haemoglobin, "haemoglobin")} g/dL</div>
        </div>
        <div class="view-field">
          <div class="view-field-label">Cholesterol</div>
          <div class="view-field-value">${labBadge(p.cholesterol, "cholesterol")} mg/dL</div>
        </div>
        <div class="view-field">
          <div class="view-field-label">Risk Level</div>
          <div class="view-field-value">${riskBadge(p.risk_level)}</div>
        </div>
      </div>
          <div class="view-field">
          <div class="view-field-label">Risk Level</div>
          <div class="view-field-value">
              ${riskBadge(p.risk_level)}
          </div>
      </div>
      <div class="remarks-block">
        <div class="view-field-label">AI Health Assessment (Groq AI)</div>
<<<<<<< HEAD
        <div class="view-field-value">${p.remarks ? escHtml(p.remarks) : "Generating…"}</div>
=======
        <div class="view-field-value">
          ${p.remarks ? escHtml(p.remarks) : "<em>Generating…</em>"}
        </div>
>>>>>>> 6ad780f (fixed backend logic and improved risk calculation)
      </div>
    `;

    openOverlay(viewOverlay);
  } catch (err) {
    showToast("Could not load patient details", "error");
  }
}
window.openView = openView;

// ─── Modal: Delete ───────────────────────────────

function openDelete(id, name) {
  deleteTargetId = id;
  document.getElementById("deleteMessage").textContent =
    `Are you sure you want to delete the record for "${name}"? This cannot be undone.`;
  openOverlay(deleteOverlay);
}
window.openDelete = openDelete;

async function confirmDelete() {
  if (!deleteTargetId) return;

  const btn = document.getElementById("btnConfirmDelete");
  btn.disabled    = true;
  btn.textContent = "Deleting…";

  try {
    await deletePatient(deleteTargetId);
    showToast("Patient record deleted", "success");
    closeOverlay(deleteOverlay);
    await loadPatients();
  } catch (err) {
    showToast("Failed to delete: " + err.message, "error");
  } finally {
    btn.disabled    = false;
    btn.textContent = "Delete Record";
    deleteTargetId  = null;
  }
}

// ─── Form Submit ─────────────────────────────────

async function handleSubmit(e) {
  e.preventDefault();
  clearErrors();
  if (!validateForm()) return;

  const id = document.getElementById("patientId").value;
  const payload = {
    full_name:     document.getElementById("fullName").value.trim(),
    date_of_birth: document.getElementById("dob").value,
    email:         document.getElementById("email").value.trim(),
    glucose:       parseFloat(document.getElementById("glucose").value),
    haemoglobin:   parseFloat(document.getElementById("haemoglobin").value),
    cholesterol:   parseFloat(document.getElementById("cholesterol").value),
  };

  setLoading(true);

  try {
    if (id) {
      await updatePatient(id, payload);
      showToast("Patient updated — AI remarks regenerated ✓", "success");
    } else {
      await createPatient(payload);
      showToast("Patient saved — AI remarks generated ✓", "success");
    }
    closeModal();
    await loadPatients();
  } catch (err) {
    showToast(err.message, "error");
  } finally {
    setLoading(false);
  }
}

// ─── Validation ──────────────────────────────────

function validateForm() {
  let valid = true;

  const name = document.getElementById("fullName").value.trim();
  if (!name || name.length < 2) {
    showError("fullName", "Full name must be at least 2 characters");
    valid = false;
  }

  const dob = document.getElementById("dob").value;
  if (!dob) {
    showError("dob", "Date of birth is required");
    valid = false;
  } else if (new Date(dob) >= new Date()) {
    showError("dob", "Date of birth cannot be today or in the future");
    valid = false;
  }

  const email  = document.getElementById("email").value.trim();
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRe.test(email)) {
    showError("email", "Please enter a valid email address");
    valid = false;
  }

  const glucose = parseFloat(document.getElementById("glucose").value);
  if (isNaN(glucose) || glucose <= 0 || glucose > THRESHOLDS.glucose.high * 8) {
    showError("glucose", "Glucose must be a number between 0.1 and 1000");
    valid = false;
  }

  const hb = parseFloat(document.getElementById("haemoglobin").value);
  if (isNaN(hb) || hb <= 0 || hb > 25) {
    showError("haemoglobin", "Haemoglobin must be between 0.1 and 25 g/dL");
    valid = false;
  }

  const chol = parseFloat(document.getElementById("cholesterol").value);
  if (isNaN(chol) || chol <= 0 || chol > THRESHOLDS.cholesterol.high * 4) {
    showError("cholesterol", "Cholesterol must be a number between 0.1 and 1000");
    valid = false;
  }

  return valid;
}

function showError(field, msg) {
  const errEl   = document.getElementById(`err${capitalize(field)}`);
  const inputEl = document.getElementById(field);
  if (errEl)   errEl.textContent = msg;
  if (inputEl) inputEl.classList.add("error");
}

function clearErrors() {
  ["fullName", "dob", "email", "glucose", "haemoglobin", "cholesterol"].forEach((f) => {
    const errEl   = document.getElementById(`err${capitalize(f)}`);
    const inputEl = document.getElementById(f);
    if (errEl)   errEl.textContent = "";
    if (inputEl) inputEl.classList.remove("error");
  });
}

// ─── Overlay helpers ─────────────────────────────

function openOverlay(el) {
  el.classList.add("open");
  el.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeOverlay(el) {
  el.classList.remove("open");
  el.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function closeModal() {
  closeOverlay(modalOverlay);
  resetForm();
}

function resetForm() {
  patientForm.reset();
  clearErrors();
  document.getElementById("patientId").value = "";
}

function setLoading(on) {
  btnSubmit.disabled          = on;
  btnSubmitLabel.style.display = on ? "none" : "";
  btnSpinner.style.display     = on ? ""     : "none";
}

// ─── Utility ─────────────────────────────────────

/**
 * Formats an ISO date string ("YYYY-MM-DD") as "D Mon YYYY".
 * @param {string|null} d
 * @returns {string}
 */
function formatDate(d) {
  if (!d) return "—";
  const [y, m, day] = d.split("-");
  const months = ["Jan","Feb","Mar","Apr","May","Jun",
                  "Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${parseInt(day, 10)} ${months[parseInt(m, 10) - 1]} ${y}`;
}

/**
 * Escapes a string for safe insertion into HTML.
 * Prevents XSS from user-supplied data.
 * @param {string} str
 * @returns {string}
 */
function escHtml(str) {
  return String(str)
    .replace(/&/g,  "&amp;")
    .replace(/</g,  "&lt;")
    .replace(/>/g,  "&gt;")
    .replace(/"/g,  "&quot;")
    .replace(/'/g,  "&#39;");
}

/** Uppercases the first character of a string. */
function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/**
 * Displays a self-dismissing toast notification.
 * @param {string} message
 * @param {"success"|"error"|"info"} type
 */
function showToast(message, type = "info") {
  const icons = { success: "✓", error: "✗", info: "ℹ" };
  const wrap  = document.getElementById("toastWrap");
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.setAttribute("role", "alert");
  toast.innerHTML = `
    <span class="toast-icon" aria-hidden="true">${icons[type] ?? "ℹ"}</span>
    <span>${escHtml(message)}</span>`;
  wrap.appendChild(toast);
  setTimeout(() => toast.remove(), 4500);
}
