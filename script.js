/* Mon Coach Sportif V3 - JavaScript simple, sans framework.
   Objectif : usage rapide sur iPhone, données locales, filtres clairs. */

// --- DONNÉES DE BASE ---
const STORAGE_KEY = "coachSportifV3";

const EXERCISES = {
  Push: ["Développé couché", "Développé incliné", "Dips", "Peck Deck", "Pompes", "Pompes inclinées", "Pompes diamant", "Écarté haltères"],
  Pull: ["Tractions", "Rowing barre", "Tirage horizontal", "Curl biceps", "Shrugs", "Rowing élastique", "Curl élastique", "Superman"],
  Jambes: ["Squat", "Leg Press", "Fentes marchées", "Soulevé de terre", "Soulevé de terre roumain", "Leg Curl", "Mollets", "Squat goblet", "Fentes arrière", "Pont fessier"],
  Épaules: ["Élévations latérales", "Développé militaire", "Face pull", "Oiseau haltères", "Rotation externe élastique"],
  Abdos: ["Crunchs", "Gainage", "Relevés de jambes", "Planche", "Dead bug", "Mountain climbers"]
};

const ICONS = {
  "Développé couché": "💪", "Développé incliné": "💪", "Dips": "💪", "Peck Deck": "🦋", "Pompes": "🤲", "Pompes inclinées": "🤲", "Pompes diamant": "💎", "Écarté haltères": "🦋",
  "Tractions": "🧗", "Rowing barre": "🚣", "Tirage horizontal": "🚣", "Curl biceps": "💪", "Shrugs": "🏔️", "Rowing élastique": "🪢", "Curl élastique": "🪢", "Superman": "🦸",
  "Squat": "🏋️", "Leg Press": "🦵", "Fentes marchées": "🚶", "Soulevé de terre": "🏋️", "Soulevé de terre roumain": "🏋️", "Leg Curl": "🦵", "Mollets": "🦶", "Squat goblet": "🏋️", "Fentes arrière": "🚶", "Pont fessier": "🌉",
  "Élévations latérales": "🪽", "Développé militaire": "🎖️", "Face pull": "🪢", "Oiseau haltères": "🪽", "Rotation externe élastique": "🛡️",
  "Crunchs": "🔥", "Gainage": "🧱", "Relevés de jambes": "🔥", "Planche": "🧱", "Dead bug": "🐞", "Mountain climbers": "⛰️"
};

const TEMPLATES = [
  { id: "home-push-20", place: "home", type: "Push", duration: 22, name: "Maison Push express", exercises: ["Pompes", "Pompes inclinées", "Pompes diamant", "Élévations latérales", "Gainage"] },
  { id: "home-pull-25", place: "home", type: "Pull", duration: 25, name: "Maison Pull élastique", exercises: ["Rowing élastique", "Curl élastique", "Face pull", "Superman", "Dead bug"] },
  { id: "home-legs-30", place: "home", type: "Jambes", duration: 30, name: "Maison Jambes 30 min", exercises: ["Squat goblet", "Fentes arrière", "Pont fessier", "Mollets", "Planche"] },
  { id: "home-full-20", place: "home", type: "Full Body", duration: 20, name: "Maison Full Body rapide", exercises: ["Pompes", "Squat goblet", "Rowing élastique", "Mountain climbers"] },
  { id: "home-core-25", place: "home", type: "Abdos", duration: 25, name: "Maison Abdos + mobilité", exercises: ["Gainage", "Crunchs", "Dead bug", "Relevés de jambes", "Rotation externe élastique"] },
  { id: "home-shoulders-safe", place: "home", type: "Épaules", duration: 20, name: "Maison épaules prudentes", exercises: ["Face pull", "Rotation externe élastique", "Oiseau haltères", "Gainage"] },

  { id: "gym-push-60", place: "gym", type: "Push", duration: 60, name: "Salle Push force", exercises: ["Développé couché", "Développé incliné", "Peck Deck", "Dips", "Élévations latérales"] },
  { id: "gym-pull-60", place: "gym", type: "Pull", duration: 60, name: "Salle Pull dos", exercises: ["Tractions", "Rowing barre", "Tirage horizontal", "Curl biceps", "Shrugs"] },
  { id: "gym-legs-60", place: "gym", type: "Jambes", duration: 60, name: "Salle Jambes squat", exercises: ["Squat", "Leg Press", "Fentes marchées", "Leg Curl", "Mollets"] },
  { id: "gym-posterior-60", place: "gym", type: "Jambes", duration: 60, name: "Salle chaîne arrière", exercises: ["Soulevé de terre", "Soulevé de terre roumain", "Leg Curl", "Pont fessier", "Gainage"] },
  { id: "gym-upper-60", place: "gym", type: "Haut", duration: 60, name: "Salle Haut du corps", exercises: ["Développé incliné", "Tractions", "Rowing barre", "Peck Deck", "Curl biceps"] },
  { id: "gym-full-60", place: "gym", type: "Full Body", duration: 60, name: "Salle Full Body", exercises: ["Squat", "Développé couché", "Tractions", "Leg Press", "Peck Deck"] }
];

const INITIAL_RECORDS = {
  "Squat": { weight: 70, reps: 0 },
  "Développé couché": { weight: 60, reps: 0 },
  "Tractions": { weight: 0, reps: 6 },
  "Leg Press": { weight: 112, reps: 0 },
  "Peck Deck": { weight: 66, reps: 0 }
};

const INJURY_SUBS = {
  shoulders: {
    label: "Épaules",
    avoid: ["Développé couché", "Développé incliné", "Dips", "Développé militaire", "Pompes diamant"],
    subs: { "Développé couché": "Peck Deck", "Développé incliné": "Peck Deck", "Dips": "Pompes inclinées", "Développé militaire": "Face pull", "Pompes diamant": "Pompes inclinées" }
  },
  back: {
    label: "Dos",
    avoid: ["Soulevé de terre", "Soulevé de terre roumain", "Rowing barre", "Squat"],
    subs: { "Soulevé de terre": "Leg Curl", "Soulevé de terre roumain": "Pont fessier", "Rowing barre": "Tirage horizontal", "Squat": "Leg Press" }
  },
  knees: {
    label: "Genoux",
    avoid: ["Squat", "Fentes marchées", "Fentes arrière", "Leg Press"],
    subs: { "Squat": "Pont fessier", "Fentes marchées": "Leg Curl", "Fentes arrière": "Pont fessier", "Leg Press": "Leg Curl" }
  }
};

const CHALLENGES = [
  { id: "home-3x", name: "3 séances maison", desc: "Faire 3 séances maison sur 7 jours.", days: 7, metric: "sessions", place: "home", target: 3 },
  { id: "gym-3x", name: "3 séances salle", desc: "Faire 3 séances à la salle sur 7 jours.", days: 7, metric: "sessions", place: "gym", target: 3 },
  { id: "push-40", name: "40 séries Push", desc: "Cumuler 40 séries Push en 14 jours.", days: 14, metric: "sets", type: "Push", target: 40 },
  { id: "pull-35", name: "35 séries Pull", desc: "Cumuler 35 séries Pull en 14 jours.", days: 14, metric: "sets", type: "Pull", target: 35 },
  { id: "legs-45", name: "45 séries Jambes", desc: "Cumuler 45 séries jambes en 14 jours.", days: 14, metric: "sets", type: "Jambes", target: 45 },
  { id: "squat-100", name: "100 reps de Squat", desc: "Atteindre 100 répétitions de Squat en 7 jours.", days: 7, metric: "reps", exercise: "Squat", target: 100 },
  { id: "pushups-150", name: "150 pompes", desc: "Atteindre 150 pompes en 7 jours.", days: 7, metric: "reps", exercise: "Pompes", target: 150 },
  { id: "pullups-30", name: "30 tractions", desc: "Cumuler 30 tractions en 14 jours.", days: 14, metric: "reps", exercise: "Tractions", target: 30 },
  { id: "core-12", name: "12 séries Abdos", desc: "Faire 12 séries d'abdos/gainage en 7 jours.", days: 7, metric: "sets", type: "Abdos", target: 12 },
  { id: "volume-12000", name: "12 000 kg de volume", desc: "Cumuler 12 000 kg x reps en 7 jours.", days: 7, metric: "volume", target: 12000 },
  { id: "shoulder-care", name: "Routine épaules prudentes", desc: "Faire 8 séries Face pull / rotation externe en 10 jours.", days: 10, metric: "sets", exercises: ["Face pull", "Rotation externe élastique"], target: 8 },
  { id: "consistency-5", name: "5 séances en 14 jours", desc: "Tenir une régularité simple : 5 séances en 14 jours.", days: 14, metric: "sessions", target: 5 }
];

// --- ÉTAT DE L'APPLICATION ---
const defaultData = () => ({
  sessions: [],
  records: structuredClone(INITIAL_RECORDS),
  settings: { restSeconds: 90, injury: "none" },
  active: null,
  challenge: { ...CHALLENGES[0], startedAt: new Date().toISOString(), finished: false }
});
let data = loadData();
let timerInterval = null;
let timerRemaining = data.settings.restSeconds;
let charts = { home: null, progress: null, volume: null };

function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return defaultData();
    const parsed = JSON.parse(saved);
    return { ...defaultData(), ...parsed, settings: { ...defaultData().settings, ...(parsed.settings || {}) } };
  } catch (e) {
    return defaultData();
  }
}
function saveData() { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
function $(id) { return document.getElementById(id); }
function toast(message) {
  const el = $("toast");
  el.textContent = message;
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 1800);
}
function todayLabel(date = new Date()) { return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" }); }
function dateShort(iso) { return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }); }
function placeLabel(place) { return place === "home" ? "Maison" : "Salle"; }
function groupOfExercise(name) {
  return Object.keys(EXERCISES).find(g => EXERCISES[g].includes(name)) || "Autre";
}
function exerciseIcon(name) { return ICONS[name] || "🏋️"; }
function sum(arr) { return arr.reduce((a, b) => a + b, 0); }
function daysAgo(days) { const d = new Date(); d.setDate(d.getDate() - Number(days)); return d; }
function templateVisible(t, filter) { return filter === "all" || t.place === filter; }

// --- NAVIGATION ---
document.querySelectorAll(".tab").forEach(btn => {
  btn.addEventListener("click", () => showPage(btn.dataset.page));
});
function showPage(page) {
  document.querySelectorAll(".tab").forEach(b => b.classList.toggle("active", b.dataset.page === page));
  document.querySelectorAll(".page").forEach(p => p.classList.toggle("active", p.id === page));
  if (page === "tracking") renderCharts();
}

// --- RENDU GLOBAL ---
function renderAll() {
  saveData();
  renderTemplateButtons();
  renderActiveWorkout();
  renderStats();
  renderRecords();
  renderHistory();
  renderFilters();
  renderChallenge();
  renderInjury();
  renderSettings();
  renderCharts();
}

function renderTemplateButtons(filter = "all") {
  const homeTarget = $("homeTemplates");
  const listTarget = $("templateList");
  const cards = TEMPLATES.filter(t => templateVisible(t, filter));

  homeTarget.innerHTML = cards.slice(0, 6).map(templateCardHtml).join("");
  listTarget.innerHTML = cards.map(templateCardHtml).join("");

  document.querySelectorAll("[data-start-template]").forEach(btn => {
    btn.addEventListener("click", () => startWorkout(btn.dataset.startTemplate));
  });
}

function templateCardHtml(t) {
  return `<div class="template-card">
    <div class="section-title">
      <div>
        <h3>${t.name}</h3>
        <div class="meta">
          <span class="pill ${t.place === "home" ? "home-pill" : "gym-pill"}">${placeLabel(t.place)}</span>
          <span class="pill">${t.type}</span>
          <span class="pill muted-pill">${t.duration} min</span>
        </div>
      </div>
    </div>
    <p class="muted">${t.exercises.map(e => `${exerciseIcon(e)} ${e}`).join(" · ")}</p>
    <button class="primary" data-start-template="${t.id}">Lancer</button>
  </div>`;
}

document.querySelectorAll("[data-template-filter]").forEach(btn => {
  btn.addEventListener("click", () => {
    const filter = btn.dataset.templateFilter;
    document.querySelectorAll("[data-template-filter]").forEach(b => b.classList.toggle("active", b.dataset.templateFilter === filter));
    renderTemplateButtons(filter);
  });
});
$("openWorkoutPicker").addEventListener("click", () => showPage("templates"));

// --- SÉANCE ACTIVE ---
function startWorkout(templateId) {
  const template = TEMPLATES.find(t => t.id === templateId);
  if (!template) return;
  let exercises = template.exercises.map(name => ({ name, type: groupOfExercise(name), sets: [emptySet()] }));
  exercises = applyInjurySubstitutions(exercises);
  data.active = {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    startedAt: new Date().toISOString(),
    templateId: template.id,
    templateName: template.name,
    place: template.place,
    type: template.type,
    duration: template.duration,
    exercises
  };
  timerRemaining = data.settings.restSeconds;
  resetTimer();
  saveData();
  renderActiveWorkout();
  showPage("workout");
  toast(`${template.name} lancée`);
}
function emptySet() { return { weight: "", reps: "", rpe: "", notes: "" }; }
function applyInjurySubstitutions(exercises) {
  const injury = data.settings.injury;
  if (injury === "none" || !INJURY_SUBS[injury]) return exercises;
  const sub = INJURY_SUBS[injury].subs;
  return exercises.map(ex => {
    const newName = sub[ex.name] || ex.name;
    return { ...ex, name: newName, type: groupOfExercise(newName) };
  });
}
function renderActiveWorkout() {
  const active = data.active;
  populateExerciseSelectors();
  if (!active) {
    $("activeBadge").textContent = "Aucune séance";
    $("activeBadge").className = "pill muted-pill";
    $("activeTitle").textContent = "Choisis une séance";
    $("activeMeta").textContent = "Va dans Accueil ou Choisir pour lancer une séance.";
    $("activeExercises").innerHTML = `<article class="card"><p class="muted">Aucune séance en cours.</p></article>`;
    return;
  }
  $("activeBadge").textContent = `${placeLabel(active.place)} · ${active.duration} min`;
  $("activeBadge").className = `pill ${active.place === "home" ? "home-pill" : "gym-pill"}`;
  $("activeTitle").textContent = active.templateName;
  $("activeMeta").textContent = `Début : ${dateShort(active.startedAt)} · ${active.type}`;
  $("activeExercises").innerHTML = active.exercises.map((ex, exIndex) => exerciseCardHtml(ex, exIndex)).join("");
  bindWorkoutButtons();
}
function exerciseCardHtml(ex, exIndex) {
  const record = data.records[ex.name] || { weight: 0, reps: 0 };
  const recordText = record.weight ? `record ${record.weight} kg` : (record.reps ? `record ${record.reps} reps` : "pas encore de record");
  return `<div class="exercise-card">
    <div class="exercise-top">
      <div>
        <h3>${exerciseIcon(ex.name)} ${ex.name}</h3>
        <div class="exercise-meta"><span class="pill">${ex.type}</span><span class="pill muted-pill">${ex.sets.length} série(s)</span></div>
      </div>
      <div class="record-hint">${recordText}</div>
    </div>
    ${ex.sets.map((set, setIndex) => setRowHtml(set, exIndex, setIndex)).join("")}
    <div class="button-row">
      <button data-add-set="${exIndex}">+ Série</button>
      <button data-replace-exercise="${exIndex}">Remplacer</button>
      <button class="danger" data-remove-exercise="${exIndex}">Supprimer</button>
    </div>
  </div>`;
}
function setRowHtml(set, exIndex, setIndex) {
  return `<div class="set-row">
    <label>kg
      <input data-field="weight" data-ex="${exIndex}" data-set="${setIndex}" type="number" inputmode="decimal" value="${set.weight}" placeholder="0" />
    </label>
    <label>reps
      <input data-field="reps" data-ex="${exIndex}" data-set="${setIndex}" type="number" inputmode="numeric" value="${set.reps}" placeholder="0" />
      <div class="rep-controls">
        <button data-rep-minus="${exIndex}:${setIndex}">−1</button>
        <button data-rep-plus="${exIndex}:${setIndex}">+1</button>
        <button data-copy-set="${exIndex}:${setIndex}">Copier</button>
      </div>
    </label>
    <label>RPE
      <input data-field="rpe" data-ex="${exIndex}" data-set="${setIndex}" type="number" inputmode="decimal" min="1" max="10" value="${set.rpe}" placeholder="7" />
    </label>
    <button class="icon-btn danger delete-set" data-delete-set="${exIndex}:${setIndex}">✕</button>
    <label class="set-notes">note rapide
      <input data-field="notes" data-ex="${exIndex}" data-set="${setIndex}" value="${escapeHtml(set.notes)}" placeholder="facile, douleur, machine prise..." />
    </label>
  </div>`;
}
function bindWorkoutButtons() {
  document.querySelectorAll("[data-field]").forEach(input => input.addEventListener("input", e => {
    const ex = Number(e.target.dataset.ex); const set = Number(e.target.dataset.set); const field = e.target.dataset.field;
    data.active.exercises[ex].sets[set][field] = e.target.value;
    saveData();
  }));
  document.querySelectorAll("[data-add-set]").forEach(btn => btn.addEventListener("click", () => {
    const ex = Number(btn.dataset.addSet);
    const previous = data.active.exercises[ex].sets.at(-1) || emptySet();
    data.active.exercises[ex].sets.push({ ...previous, reps: "", rpe: previous.rpe || "", notes: "" });
    renderActiveWorkout();
  }));
  document.querySelectorAll("[data-rep-plus]").forEach(btn => btn.addEventListener("click", () => changeReps(btn.dataset.repPlus, 1)));
  document.querySelectorAll("[data-rep-minus]").forEach(btn => btn.addEventListener("click", () => changeReps(btn.dataset.repMinus, -1)));
  document.querySelectorAll("[data-copy-set]").forEach(btn => btn.addEventListener("click", () => copySet(btn.dataset.copySet)));
  document.querySelectorAll("[data-delete-set]").forEach(btn => btn.addEventListener("click", () => deleteSet(btn.dataset.deleteSet)));
  document.querySelectorAll("[data-remove-exercise]").forEach(btn => btn.addEventListener("click", () => {
    data.active.exercises.splice(Number(btn.dataset.removeExercise), 1);
    renderActiveWorkout();
  }));
  document.querySelectorAll("[data-replace-exercise]").forEach(btn => btn.addEventListener("click", () => replaceExercise(Number(btn.dataset.replaceExercise))));
}
function changeReps(code, delta) {
  const [ex, set] = code.split(":").map(Number);
  const current = Number(data.active.exercises[ex].sets[set].reps || 0);
  data.active.exercises[ex].sets[set].reps = Math.max(0, current + delta);
  renderActiveWorkout();
}
function copySet(code) {
  const [ex, set] = code.split(":").map(Number);
  const copied = { ...data.active.exercises[ex].sets[set] };
  data.active.exercises[ex].sets.splice(set + 1, 0, copied);
  renderActiveWorkout();
}
function deleteSet(code) {
  const [ex, set] = code.split(":").map(Number);
  if (data.active.exercises[ex].sets.length === 1) {
    data.active.exercises[ex].sets[0] = emptySet();
  } else {
    data.active.exercises[ex].sets.splice(set, 1);
  }
  renderActiveWorkout();
}
function replaceExercise(exIndex) {
  const old = data.active.exercises[exIndex];
  const sameGroup = EXERCISES[old.type] || Object.values(EXERCISES).flat();
  const choice = prompt(`Remplacer ${old.name} par :\n${sameGroup.join("\n")}`);
  if (!choice) return;
  const found = Object.values(EXERCISES).flat().find(e => e.toLowerCase() === choice.trim().toLowerCase());
  if (!found) return toast("Exercice non reconnu. Utilise le nom exact affiché.");
  data.active.exercises[exIndex].name = found;
  data.active.exercises[exIndex].type = groupOfExercise(found);
  renderActiveWorkout();
}
function populateExerciseSelectors() {
  const groupSelect = $("addGroup");
  groupSelect.innerHTML = Object.keys(EXERCISES).map(g => `<option value="${g}">${g}</option>`).join("");
  groupSelect.onchange = updateAddExerciseOptions;
  updateAddExerciseOptions();
}
function updateAddExerciseOptions() {
  const group = $("addGroup").value || Object.keys(EXERCISES)[0];
  $("addExercise").innerHTML = EXERCISES[group].map(e => `<option value="${e}">${exerciseIcon(e)} ${e}</option>`).join("");
}
$("addExerciseBtn").addEventListener("click", () => {
  if (!data.active) return toast("Lance d'abord une séance.");
  const name = $("addExercise").value;
  data.active.exercises.push({ name, type: groupOfExercise(name), sets: [emptySet()] });
  renderActiveWorkout();
});
$("saveWorkout").addEventListener("click", () => {
  if (!data.active) return toast("Aucune séance à enregistrer.");
  const cleaned = cleanSession(data.active);
  if (!cleaned.exercises.length) return toast("Ajoute au moins une série remplie.");
  data.sessions.unshift({ ...cleaned, endedAt: new Date().toISOString() });
  updateRecordsFromSession(cleaned);
  data.active = null;
  resetTimer();
  renderAll();
  showPage("tracking");
  toast("Séance enregistrée");
});
$("cancelWorkout").addEventListener("click", () => {
  data.active = null; resetTimer(); renderAll(); toast("Séance annulée");
});
function cleanSession(session) {
  const exercises = session.exercises.map(ex => ({
    ...ex,
    sets: ex.sets.map(s => ({ weight: Number(s.weight || 0), reps: Number(s.reps || 0), rpe: Number(s.rpe || 0), notes: s.notes || "" }))
      .filter(s => s.weight > 0 || s.reps > 0 || s.rpe > 0 || s.notes)
  })).filter(ex => ex.sets.length);
  return { ...session, exercises };
}
function updateRecordsFromSession(session) {
  session.exercises.forEach(ex => ex.sets.forEach(s => {
    const rec = data.records[ex.name] || { weight: 0, reps: 0 };
    rec.weight = Math.max(rec.weight || 0, Number(s.weight || 0));
    rec.reps = Math.max(rec.reps || 0, Number(s.reps || 0));
    data.records[ex.name] = rec;
  }));
}

// --- MINUTEUR ---
function formatTimer(sec) {
  const m = String(Math.floor(sec / 60)).padStart(2, "0");
  const s = String(sec % 60).padStart(2, "0");
  return `${m}:${s}`;
}
function renderTimer() { $("timerDisplay").textContent = formatTimer(timerRemaining); }
function resetTimer() { clearInterval(timerInterval); timerInterval = null; timerRemaining = Number(data.settings.restSeconds || 90); renderTimer(); }
$("timerStart").addEventListener("click", () => {
  if (timerInterval) { clearInterval(timerInterval); timerInterval = null; return; }
  timerInterval = setInterval(() => {
    timerRemaining = Math.max(0, timerRemaining - 1); renderTimer();
    if (timerRemaining === 0) { clearInterval(timerInterval); timerInterval = null; toast("Repos terminé"); }
  }, 1000);
});
$("timerReset").addEventListener("click", resetTimer);

// --- STATS, HISTORIQUE, RECORDS ---
function renderStats() {
  const sessions = data.sessions;
  $("statSessions").textContent = sessions.length;
  const weekStart = daysAgo(7);
  const weekSessions = sessions.filter(s => new Date(s.startedAt) >= weekStart);
  $("statWeekSets").textContent = sum(weekSessions.flatMap(s => s.exercises).map(e => e.sets.length));
  const home = sessions.filter(s => s.place === "home").length;
  const gym = sessions.filter(s => s.place === "gym").length;
  $("statHomeGym").textContent = `${home} / ${gym}`;
  $("statLast").textContent = sessions[0] ? dateShort(sessions[0].startedAt) : "—";
}
function renderRecords() {
  const entries = Object.entries(data.records).sort((a,b) => a[0].localeCompare(b[0]));
  $("recordsList").innerHTML = entries.length ? entries.map(([name, r]) => `<div class="record-item"><strong>${exerciseIcon(name)} ${name}</strong><br><span class="muted">${r.weight ? `${r.weight} kg` : "— kg"} · ${r.reps ? `${r.reps} reps` : "— reps"}</span></div>`).join("") : `<p class="muted">Aucun record.</p>`;
}
function renderHistory() {
  $("historyList").innerHTML = data.sessions.length ? data.sessions.map(s => {
    const sets = sum(s.exercises.map(e => e.sets.length));
    const volume = sessionVolume(s);
    return `<div class="history-item">
      <strong>${s.templateName}</strong> <span class="pill ${s.place === "home" ? "home-pill" : "gym-pill"}">${placeLabel(s.place)}</span>
      <p class="muted">${dateShort(s.startedAt)} · ${sets} séries · volume ${Math.round(volume)} kg</p>
      <details><summary>Voir les exercices</summary>${s.exercises.map(e => `<p>${exerciseIcon(e.name)} <strong>${e.name}</strong> : ${e.sets.map(set => `${set.weight || 0}kg x ${set.reps || 0}${set.rpe ? ` RPE ${set.rpe}` : ""}`).join(" · ")}</p>`).join("")}</details>
    </div>`;
  }).join("") : `<p class="muted">Aucune séance enregistrée pour l'instant.</p>`;
}
function sessionVolume(s) { return sum(s.exercises.flatMap(e => e.sets).map(set => Number(set.weight || 0) * Number(set.reps || 0))); }
function escapeHtml(str = "") { return String(str).replace(/[&<>"]/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;" }[c])); }

// --- GRAPHIQUES AVEC FILTRES ---
function renderFilters() {
  const allExercises = [...new Set([...Object.values(EXERCISES).flat(), ...data.sessions.flatMap(s => s.exercises.map(e => e.name))])].sort();
  const current = $("exerciseFilter").value;
  $("exerciseFilter").innerHTML = `<option value="all">Tous les exercices</option>` + allExercises.map(e => `<option value="${e}">${exerciseIcon(e)} ${e}</option>`).join("");
  if (current) $("exerciseFilter").value = current;
}
["metricFilter", "exerciseFilter", "placeFilter", "periodFilter"].forEach(id => $(id).addEventListener("change", renderCharts));
function filteredSessions() {
  const place = $("placeFilter")?.value || "all";
  const since = daysAgo($("periodFilter")?.value || 9999);
  return data.sessions.filter(s => new Date(s.startedAt) >= since && (place === "all" || s.place === place)).slice().reverse();
}
function sessionMetricForExercise(session, exerciseName, metric) {
  const exercises = exerciseName === "all" ? session.exercises : session.exercises.filter(e => e.name === exerciseName);
  const sets = exercises.flatMap(e => e.sets);
  if (!sets.length) return null;
  if (metric === "bestWeight") return Math.max(...sets.map(s => Number(s.weight || 0)));
  if (metric === "maxReps") return Math.max(...sets.map(s => Number(s.reps || 0)));
  if (metric === "volume") return sum(sets.map(s => Number(s.weight || 0) * Number(s.reps || 0)));
  if (metric === "sets") return sets.length;
  if (metric === "avgRpe") {
    const rpes = sets.map(s => Number(s.rpe || 0)).filter(Boolean);
    return rpes.length ? Number((sum(rpes) / rpes.length).toFixed(1)) : null;
  }
  return null;
}
function metricLabel(metric) {
  return { bestWeight: "Meilleur poids", maxReps: "Max répétitions", volume: "Volume kg x reps", sets: "Nombre de séries", avgRpe: "RPE moyen" }[metric] || metric;
}
function renderCharts() {
  if (!window.Chart) return;
  renderHomeChart();
  renderProgressChart();
  renderVolumeChart();
}
function chartDestroy(name) { if (charts[name]) { charts[name].destroy(); charts[name] = null; } }
function renderHomeChart() {
  const canvas = $("homeChart"); if (!canvas || !window.Chart) return;
  chartDestroy("home");
  const last = data.sessions.slice(0, 8).reverse();
  charts.home = new Chart(canvas, { type: "bar", data: { labels: last.map(s => dateShort(s.startedAt)), datasets: [{ label: "Volume", data: last.map(sessionVolume) }] }, options: baseChartOptions() });
}
function renderProgressChart() {
  const canvas = $("progressChart"); if (!canvas || !window.Chart) return;
  chartDestroy("progress");
  const metric = $("metricFilter")?.value || "bestWeight";
  const exercise = $("exerciseFilter")?.value || "all";
  const rows = filteredSessions().map(s => ({ x: dateShort(s.startedAt), y: sessionMetricForExercise(s, exercise, metric) })).filter(r => r.y !== null && !Number.isNaN(r.y));
  $("chartHint").textContent = rows.length ? `${rows.length} point(s) affiché(s). Les séances sans donnée exploitable sont ignorées.` : "Pas encore assez de données pour ce filtre.";
  charts.progress = new Chart(canvas, { type: metric === "sets" ? "bar" : "line", data: { labels: rows.map(r => r.x), datasets: [{ label: metricLabel(metric), data: rows.map(r => r.y), tension: .32 }] }, options: baseChartOptions() });
}
function renderVolumeChart() {
  const canvas = $("volumeChart"); if (!canvas || !window.Chart) return;
  chartDestroy("volume");
  const totals = {};
  filteredSessions().forEach(s => s.exercises.forEach(e => {
    totals[e.type] = (totals[e.type] || 0) + sum(e.sets.map(set => Number(set.weight || 0) * Number(set.reps || 0)));
  }));
  charts.volume = new Chart(canvas, { type: "bar", data: { labels: Object.keys(totals), datasets: [{ label: "Volume", data: Object.values(totals) }] }, options: baseChartOptions() });
}
function baseChartOptions() {
  return { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: "#d1d5db" } } }, scales: { x: { ticks: { color: "#9ca3af" }, grid: { color: "rgba(255,255,255,.06)" } }, y: { ticks: { color: "#9ca3af" }, grid: { color: "rgba(255,255,255,.06)" } } } };
}

// --- DÉFIS ---
function challengeProgress(challenge = data.challenge) {
  const since = new Date(challenge.startedAt || new Date());
  const until = new Date(since); until.setDate(until.getDate() + Number(challenge.days || 7));
  const relevant = data.sessions.filter(s => new Date(s.startedAt) >= since && new Date(s.startedAt) <= until);
  let value = 0;
  if (challenge.metric === "sessions") value = relevant.filter(s => !challenge.place || s.place === challenge.place).length;
  if (challenge.metric === "sets") value = sum(relevant.flatMap(s => s.exercises).filter(e => matchChallengeExercise(e, challenge)).map(e => e.sets.length));
  if (challenge.metric === "reps") value = sum(relevant.flatMap(s => s.exercises).filter(e => matchChallengeExercise(e, challenge)).flatMap(e => e.sets).map(s => Number(s.reps || 0)));
  if (challenge.metric === "volume") value = sum(relevant.flatMap(s => s.exercises).flatMap(e => e.sets).map(set => Number(set.weight || 0) * Number(set.reps || 0)));
  return { value, target: challenge.target, percent: Math.min(100, Math.round((value / challenge.target) * 100)) };
}
function matchChallengeExercise(ex, c) {
  if (c.exercise) return ex.name === c.exercise;
  if (c.exercises) return c.exercises.includes(ex.name);
  if (c.type) return ex.type === c.type;
  return true;
}
function renderChallenge() {
  const c = data.challenge;
  const p = challengeProgress(c);
  $("challengeTitle").textContent = c.name;
  $("challengeDescription").textContent = c.desc;
  $("challengeProgress").style.width = `${p.percent}%`;
  $("challengeStatus").textContent = `${p.value} / ${p.target} · ${p.percent}%`;
  $("challengeList").innerHTML = CHALLENGES.map(ch => `<div class="challenge-card"><strong>${ch.name}</strong><p class="muted">${ch.desc}</p><button data-pick-challenge="${ch.id}">Choisir</button></div>`).join("");
  document.querySelectorAll("[data-pick-challenge]").forEach(btn => btn.addEventListener("click", () => pickChallenge(btn.dataset.pickChallenge)));
}
function pickChallenge(id) {
  const c = CHALLENGES.find(x => x.id === id);
  data.challenge = { ...c, startedAt: new Date().toISOString(), finished: false };
  renderAll(); toast("Défi lancé");
}
$("randomChallenge").addEventListener("click", () => pickChallenge(CHALLENGES[Math.floor(Math.random() * CHALLENGES.length)].id));
$("finishChallenge").addEventListener("click", () => { data.challenge.finished = true; renderAll(); toast("Défi marqué terminé"); });

// --- MODE BLESSURE ---
function renderInjury() {
  $("injurySelect").value = data.settings.injury || "none";
  const key = data.settings.injury;
  if (key === "none") { $("injuryAdvice").innerHTML = `<p class="muted">Aucune substitution active.</p>`; return; }
  const info = INJURY_SUBS[key];
  $("injuryAdvice").innerHTML = `<h3>${info.label}</h3><p class="muted">À éviter ou surveiller : ${info.avoid.join(", ")}</p><div>${Object.entries(info.subs).map(([a,b]) => `<p>• ${a} → <strong>${b}</strong></p>`).join("")}</div>`;
}
$("injurySelect").addEventListener("change", e => { data.settings.injury = e.target.value; renderAll(); toast("Mode blessure mis à jour"); });

// --- EXPORTS / IMPORTS / RÉGLAGES ---
function renderSettings() { $("restSeconds").value = data.settings.restSeconds || 90; }
$("restSeconds").addEventListener("input", e => { data.settings.restSeconds = Number(e.target.value || 90); saveData(); resetTimer(); });
$("exportCsv").addEventListener("click", exportCsv);
function exportCsv() {
  const rows = [["date", "lieu", "seance", "groupe", "exercice", "serie", "poids_kg", "reps", "rpe", "notes"]];
  data.sessions.forEach(s => s.exercises.forEach(e => e.sets.forEach((set, i) => rows.push([s.startedAt, placeLabel(s.place), s.templateName, e.type, e.name, i + 1, set.weight, set.reps, set.rpe, set.notes || ""]))));
  downloadFile("historique-musculation.csv", rows.map(r => r.map(v => `"${String(v).replaceAll('"','""')}"`).join(";")).join("\n"), "text/csv;charset=utf-8");
}
$("exportJson").addEventListener("click", () => downloadFile("sauvegarde-coach-sportif.json", JSON.stringify(data, null, 2), "application/json"));
$("importJson").addEventListener("change", e => {
  const file = e.target.files[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = () => { try { data = JSON.parse(reader.result); renderAll(); toast("Sauvegarde restaurée"); } catch { toast("Fichier non reconnu"); } };
  reader.readAsText(file);
});
function downloadFile(name, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = name; a.click(); URL.revokeObjectURL(url);
}
$("proteinBtn").addEventListener("click", () => {
  const kg = Number($("bodyWeight").value || 0);
  if (!kg) return toast("Entre ton poids.");
  $("proteinResult").textContent = `Repère simple : ${Math.round(kg * 1.6)} à ${Math.round(kg * 2)} g de protéines par jour.`;
});

// --- DÉMARRAGE ---
renderAll();
renderTimer();
