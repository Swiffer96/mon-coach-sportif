// =====================================================
// MON COACH SPORTIF - JavaScript simple et commenté
// Les données sont gardées dans le navigateur avec localStorage.
// =====================================================

// --- DONNÉES DE DÉPART ---
const defaultExercises = {
  Push: ["Développé couché", "Développé incliné", "Dips", "Peck Deck", "Pompes", "Écarté haltères"],
  Pull: ["Tractions", "Rowing barre", "Tirage horizontal", "Curl biceps", "Shrugs"],
  Jambes: ["Squat", "Leg Press", "Fentes marchées", "Soulevé de terre", "Leg Curl", "Mollets", "Soulevé de terre roumain", "Hack Squat"],
  Épaules: ["Élévations latérales", "Développé militaire", "Face pull"],
  Abdos: ["Crunchs", "Gainage", "Relevés de jambes", "Planche"]
};

const exerciseIcons = {
  "Squat": "🏋️", "Développé couché": "💪", "Développé incliné": "💪", "Tractions": "🧗", "Leg Press": "🦵", "Peck Deck": "🦋",
  "Rowing barre": "🚣", "Élévations latérales": "🪽", "Curl biceps": "💪", "Dips": "🔥", "Soulevé de terre": "🏋️", "Fentes marchées": "🚶",
  "Leg Curl": "🦵", "Mollets": "🦶", "Crunchs": "腹", "Gainage": "🧱", "Planche": "🧱", "Face pull": "🛡️"
};

const defaultProgram = {
  Lundi: { name: "Full Body", exercises: ["Squat", "Développé couché", "Tractions", "Leg Press", "Peck Deck"] },
  Mercredi: { name: "Split Haut", exercises: ["Développé incliné", "Rowing barre", "Élévations latérales", "Curl biceps", "Dips"] },
  Vendredi: { name: "Split Bas", exercises: ["Soulevé de terre", "Fentes marchées", "Leg Curl", "Mollets", "Crunchs"] }
};

const defaultRecords = {
  "Squat": 70,
  "Développé couché": 60,
  "Tractions": 6,
  "Leg Press": 112,
  "Peck Deck": 66
};

const challenges = [
  { title: "30 jours pour 10 tractions", target: 10, unit: "tractions" },
  { title: "100 squats en 7 jours", target: 100, unit: "squats" },
  { title: "3 séances propres cette semaine", target: 3, unit: "séances" },
  { title: "50 séries jambes cette semaine", target: 50, unit: "séries jambes" }
];

const injuryRules = {
  shoulders: {
    label: "Épaules",
    avoid: ["Développé couché", "Développé incliné", "Dips", "Développé militaire", "Écarté haltères"],
    alternatives: { "Développé couché": "Peck Deck", "Développé incliné": "Peck Deck", "Dips": "Pompes", "Développé militaire": "Face pull", "Écarté haltères": "Peck Deck" }
  },
  back: {
    label: "Dos",
    avoid: ["Soulevé de terre", "Rowing barre", "Shrugs"],
    alternatives: { "Soulevé de terre": "Leg Curl", "Rowing barre": "Tirage horizontal", "Shrugs": "Face pull" }
  },
  knees: {
    label: "Genoux",
    avoid: ["Squat", "Leg Press", "Fentes marchées", "Hack Squat"],
    alternatives: { "Squat": "Leg Curl", "Leg Press": "Soulevé de terre roumain", "Fentes marchées": "Mollets", "Hack Squat": "Leg Curl" }
  }
};

// --- PETITES FONCTIONS UTILES ---
function loadData(key, fallback) {
  const saved = localStorage.getItem(key);
  return saved ? JSON.parse(saved) : fallback;
}
function saveData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
function formatDate(date) {
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "short", timeStyle: "short" }).format(new Date(date));
}
function todayFrenchDay() {
  const days = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
  return days[new Date().getDay()];
}
function getExerciseType(exercise) {
  return Object.keys(app.exercises).find(type => app.exercises[type].includes(exercise)) || "Autre";
}
function iconFor(exercise) {
  return exerciseIcons[exercise] || "🏋️";
}

// --- ÉTAT DE L'APPLICATION ---
let app = {
  exercises: loadData("coach_exercises", defaultExercises),
  program: loadData("coach_program", defaultProgram),
  records: loadData("coach_records", defaultRecords),
  sessions: loadData("coach_sessions", []),
  currentSession: null,
  challenge: loadData("coach_challenge", null),
  injury: loadData("coach_injury", "none")
};

let homeChart, progressChart, volumeChart;
let timerInterval = null;
let timerSeconds = 90;

// --- NAVIGATION PAR ONGLETS ---
document.querySelectorAll(".tab").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active-page"));
    button.classList.add("active");
    document.getElementById(button.dataset.tab).classList.add("active-page");
    drawCharts();
  });
});

// --- PROGRAMME ET SÉANCE ---
function renderProgram() {
  const container = document.getElementById("programList");
  container.innerHTML = "";
  Object.entries(app.program).forEach(([day, workout]) => {
    const div = document.createElement("div");
    div.className = "program-day";
    div.innerHTML = `<h3>${day} - ${workout.name}</h3><p>${workout.exercises.map(e => `${iconFor(e)} ${e}`).join(" · ")}</p>`;

    const addBtn = document.createElement("button");
    addBtn.textContent = "Ajouter un exercice";
    addBtn.onclick = () => addExerciseToProgram(day);
    div.appendChild(addBtn);

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Supprimer un exercice";
    removeBtn.onclick = () => removeExerciseFromProgram(day);
    div.appendChild(removeBtn);

    const replaceBtn = document.createElement("button");
    replaceBtn.textContent = "Remplacer un exercice";
    replaceBtn.onclick = () => replaceExerciseInProgram(day);
    div.appendChild(replaceBtn);

    container.appendChild(div);
  });
}

function chooseExercise(message, sameType) {
  const list = sameType ? app.exercises[sameType] : Object.values(app.exercises).flat();
  const answer = prompt(`${message}\n\nExercices disponibles :\n${list.join(", ")}`);
  return list.includes(answer) ? answer : null;
}
function addExerciseToProgram(day) {
  const exercise = chooseExercise("Tape le nom exact de l’exercice à ajouter.");
  if (!exercise) return alert("Exercice non trouvé. Vérifie l’orthographe.");
  app.program[day].exercises.push(exercise);
  saveData("coach_program", app.program);
  renderAll();
}
function removeExerciseFromProgram(day) {
  const exercise = prompt(`Quel exercice supprimer ?\n${app.program[day].exercises.join(", ")}`);
  app.program[day].exercises = app.program[day].exercises.filter(e => e !== exercise);
  saveData("coach_program", app.program);
  renderAll();
}
function replaceExerciseInProgram(day) {
  const oldExercise = prompt(`Quel exercice remplacer ?\n${app.program[day].exercises.join(", ")}`);
  if (!oldExercise || !app.program[day].exercises.includes(oldExercise)) return;
  const type = getExerciseType(oldExercise);
  const newExercise = chooseExercise(`Remplacer ${oldExercise} par quel exercice du même type (${type}) ?`, type);
  if (!newExercise) return alert("Exercice non trouvé dans le même type.");
  app.program[day].exercises = app.program[day].exercises.map(e => e === oldExercise ? newExercise : e);
  saveData("coach_program", app.program);
  renderAll();
}

function startWorkout() {
  const day = todayFrenchDay();
  const workout = app.program[day] || app.program.Lundi;
  app.currentSession = {
    id: Date.now(),
    start: new Date().toISOString(),
    name: workout.name,
    exercises: workout.exercises.map(name => ({ name, weight: "", reps: "", rpe: "", notes: "" }))
  };
  document.querySelector('[data-tab="program"]').click();
  renderCurrentWorkout();
}

function renderCurrentWorkout() {
  const info = document.getElementById("currentSessionInfo");
  const container = document.getElementById("currentWorkout");
  const saveBtn = document.getElementById("saveWorkoutBtn");
  container.innerHTML = "";
  if (!app.currentSession) {
    info.textContent = "Clique sur “Commencer ma séance”.";
    saveBtn.classList.add("hidden");
    return;
  }
  info.textContent = `${app.currentSession.name} commencée le ${formatDate(app.currentSession.start)}`;
  saveBtn.classList.remove("hidden");
  app.currentSession.exercises.forEach((exercise, index) => {
    const row = document.createElement("div");
    row.className = "exercise-row";
    row.innerHTML = `
      <label>Exercice<input value="${iconFor(exercise.name)} ${exercise.name}" disabled></label>
      <label>Poids kg<input type="number" min="0" data-field="weight" data-index="${index}" value="${exercise.weight}"></label>
      <label>Répétitions<input type="number" min="0" data-field="reps" data-index="${index}" value="${exercise.reps}"></label>
      <label>RPE 1-10<input type="number" min="1" max="10" data-field="rpe" data-index="${index}" value="${exercise.rpe}"></label>
      <label>Notes<input data-field="notes" data-index="${index}" value="${exercise.notes}"></label>
      <button data-remove="${index}">Supprimer</button>`;
    container.appendChild(row);
  });
  const add = document.createElement("button");
  add.textContent = "Ajouter un exercice à cette séance";
  add.onclick = () => {
    const exercise = chooseExercise("Quel exercice ajouter à la séance en cours ?");
    if (exercise) {
      app.currentSession.exercises.push({ name: exercise, weight: "", reps: "", rpe: "", notes: "" });
      renderCurrentWorkout();
    }
  };
  container.appendChild(add);

  container.querySelectorAll("input[data-field]").forEach(input => {
    input.addEventListener("input", () => {
      app.currentSession.exercises[input.dataset.index][input.dataset.field] = input.value;
    });
  });
  container.querySelectorAll("button[data-remove]").forEach(button => {
    button.addEventListener("click", () => {
      app.currentSession.exercises.splice(Number(button.dataset.remove), 1);
      renderCurrentWorkout();
    });
  });
}

function saveWorkout() {
  if (!app.currentSession) return;
  app.currentSession.end = new Date().toISOString();
  app.sessions.unshift(app.currentSession);
  app.currentSession.exercises.forEach(ex => {
    const value = Number(ex.weight) || Number(ex.reps) || 0;
    if (value > (app.records[ex.name] || 0)) app.records[ex.name] = value;
  });
  saveData("coach_sessions", app.sessions);
  saveData("coach_records", app.records);
  app.currentSession = null;
  renderAll();
  alert("Séance enregistrée. Bravo !");
}

// --- HISTORIQUE ET EXPORT ---
function renderHistory() {
  const container = document.getElementById("historyList");
  container.innerHTML = app.sessions.length ? "" : "<p class='muted'>Aucune séance enregistrée pour le moment.</p>";
  app.sessions.forEach(session => {
    const div = document.createElement("div");
    div.className = "history-item";
    div.innerHTML = `<h3>${session.name} - ${formatDate(session.start)}</h3>` +
      session.exercises.map(e => `<p>${iconFor(e.name)} <strong>${e.name}</strong> : ${e.weight || 0} kg · ${e.reps || 0} reps · RPE ${e.rpe || "-"} ${e.notes ? " · " + e.notes : ""}</p>`).join("");
    container.appendChild(div);
  });
}
function exportCSV() {
  const rows = [["Date", "Séance", "Exercice", "Poids", "Répétitions", "RPE", "Notes"]];
  app.sessions.forEach(s => s.exercises.forEach(e => rows.push([formatDate(s.start), s.name, e.name, e.weight, e.reps, e.rpe, e.notes])));
  const csv = rows.map(row => row.map(cell => `"${String(cell || "").replaceAll('"', '""')}"`).join(";")).join("\n");
  const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "historique-musculation.csv";
  link.click();
}

// --- RECORDS ET CONSEILS ---
function renderRecords() {
  const container = document.getElementById("recordsList");
  container.innerHTML = "";
  Object.entries(app.records).forEach(([exercise, value]) => {
    const div = document.createElement("div");
    div.className = "record-item";
    div.innerHTML = `${iconFor(exercise)} <strong>${exercise}</strong> : ${value} ${exercise === "Tractions" ? "reps" : "kg"}`;
    container.appendChild(div);
  });
}
function renderTips() {
  const tips = [
    "Échauffe tes épaules 5 à 8 minutes avant les mouvements de poussée.",
    "Garde 1 à 2 répétitions en réserve sur les séries lourdes pour limiter le risque de blessure.",
    "Si ton RPE dépasse souvent 9, prévois une séance plus légère.",
    "Pour progresser, augmente d’abord la qualité d’exécution, puis les répétitions, puis le poids."
  ];
  const lastSquat = findProgress("Squat");
  if (lastSquat > 0) tips.push(`Ton squat progresse : tente une série propre autour de ${Math.round(lastSquat * 0.85)} kg.`);
  document.getElementById("tipsList").innerHTML = tips.map(t => `<div class="tip-item">💡 ${t}</div>`).join("");
}
function findProgress(exercise) {
  const values = app.sessions.flatMap(s => s.exercises.filter(e => e.name === exercise).map(e => Number(e.weight) || 0)).filter(Boolean);
  return values[0] || 0;
}

// --- GRAPHIQUES ---
function setupChartSelects() {
  const select = document.getElementById("chartExerciseSelect");
  const all = Object.values(app.exercises).flat();
  select.innerHTML = all.map(e => `<option value="${e}">${e}</option>`).join("");
}
function drawCharts() {
  if (!window.Chart) return;
  drawHomeChart();
  drawProgressChart();
  drawVolumeChart();
}
function chartDestroy(chart) { if (chart) chart.destroy(); }
function sessionPoints(exercise, days) {
  const min = Date.now() - days * 24 * 60 * 60 * 1000;
  return app.sessions.slice().reverse().flatMap(s => s.exercises
    .filter(e => e.name === exercise && new Date(s.start).getTime() >= min)
    .map(e => ({ x: s.start, weight: Number(e.weight) || 0, reps: Number(e.reps) || 0, rpe: Number(e.rpe) || 0 })));
}
function drawHomeChart() {
  const ctx = document.getElementById("homeChart");
  if (!ctx) return;
  chartDestroy(homeChart);
  const points = app.sessions.slice().reverse().map(s => ({ x: s.start, y: s.exercises.reduce((sum, e) => sum + (Number(e.weight) || 0) * (Number(e.reps) || 0), 0) }));
  homeChart = new Chart(ctx, { type: "line", data: { datasets: [{ label: "Volume par séance", data: points }] }, options: { responsive: true, scales: { x: { type: "time" } } } });
}
function drawProgressChart() {
  const ctx = document.getElementById("progressChart");
  if (!ctx) return;
  chartDestroy(progressChart);
  const exercise = document.getElementById("chartExerciseSelect").value || "Squat";
  const days = Number(document.getElementById("chartPeriodSelect").value || 30);
  const points = sessionPoints(exercise, days);
  progressChart = new Chart(ctx, {
    type: "line",
    data: { datasets: [
      { label: "Poids", data: points.map(p => ({ x: p.x, y: p.weight })) },
      { label: "Répétitions", data: points.map(p => ({ x: p.x, y: p.reps })) },
      { label: "RPE", data: points.map(p => ({ x: p.x, y: p.rpe })) }
    ]},
    options: { responsive: true, scales: { x: { type: "time" } } }
  });
}
function drawVolumeChart() {
  const ctx = document.getElementById("volumeChart");
  if (!ctx) return;
  chartDestroy(volumeChart);
  const volumes = {};
  Object.keys(app.exercises).forEach(type => volumes[type] = 0);
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  app.sessions.filter(s => new Date(s.start).getTime() >= weekAgo).forEach(s => {
    s.exercises.forEach(e => { volumes[getExerciseType(e.name)] = (volumes[getExerciseType(e.name)] || 0) + 1; });
  });
  volumeChart = new Chart(ctx, { type: "bar", data: { labels: Object.keys(volumes), datasets: [{ label: "Séries cette semaine", data: Object.values(volumes) }] }, options: { responsive: true } });
}

// --- MINUTEUR ---
function updateTimerDisplay() {
  const min = String(Math.floor(timerSeconds / 60)).padStart(2, "0");
  const sec = String(timerSeconds % 60).padStart(2, "0");
  document.getElementById("timerDisplay").textContent = `${min}:${sec}`;
}
function startTimer() {
  if (timerInterval) return;
  timerInterval = setInterval(() => {
    timerSeconds--;
    updateTimerDisplay();
    if (timerSeconds <= 0) { stopTimer(); alert("Repos terminé !"); resetTimer(); }
  }, 1000);
}
function stopTimer() { clearInterval(timerInterval); timerInterval = null; }
function resetTimer() { stopTimer(); timerSeconds = Number(document.getElementById("restInput").value) || 90; updateTimerDisplay(); }

// --- DÉFIS ---
function currentChallenge() {
  if (!app.challenge) {
    const index = Math.floor((Date.now() / (7 * 24 * 60 * 60 * 1000))) % challenges.length;
    app.challenge = { ...challenges[index], started: false, done: 0, finished: false };
    saveData("coach_challenge", app.challenge);
  }
  return app.challenge;
}
function renderChallenge() {
  const c = currentChallenge();
  const percent = c.finished ? 100 : Math.min(100, Math.round((c.done / c.target) * 100));
  document.getElementById("challengeTitle").textContent = c.title;
  document.getElementById("challengeDescription").textContent = `Objectif : ${c.target} ${c.unit}`;
  document.getElementById("challengeBar").style.width = percent + "%";
  document.getElementById("challengeProgress").textContent = `${percent}% du défi terminé`;
}
function startChallenge() { app.challenge.started = true; saveData("coach_challenge", app.challenge); renderChallenge(); }
function finishChallenge() { app.challenge.finished = true; app.challenge.done = app.challenge.target; saveData("coach_challenge", app.challenge); renderChallenge(); }

// --- MODE BLESSURE ---
function applyInjuryMode() {
  const injury = document.getElementById("injurySelect").value;
  app.injury = injury;
  saveData("coach_injury", injury);
  if (injury === "none") { renderInjury(); return; }
  const rules = injuryRules[injury];
  Object.keys(app.program).forEach(day => {
    app.program[day].exercises = app.program[day].exercises.map(e => rules.alternatives[e] || e);
  });
  saveData("coach_program", app.program);
  renderAll();
}
function renderInjury() {
  document.getElementById("injurySelect").value = app.injury;
  const box = document.getElementById("injurySuggestions");
  if (app.injury === "none") { box.innerHTML = "<p class='muted'>Aucune blessure sélectionnée.</p>"; return; }
  const r = injuryRules[app.injury];
  box.innerHTML = `<h3>Zone : ${r.label}</h3><p class="danger">À éviter : ${r.avoid.join(", ")}</p><h3>Substitutions</h3>` +
    Object.entries(r.alternatives).map(([a, b]) => `<p>${a} → <strong>${b}</strong></p>`).join("");
}

// --- ACCUEIL ET STATS ---
function renderHome() {
  const day = todayFrenchDay();
  const workout = app.program[day] || app.program.Lundi;
  document.getElementById("todayTitle").textContent = `${day} : ${workout.name}`;
  document.getElementById("nextWorkoutText").textContent = workout.exercises.join(" · ");
  document.getElementById("sessionCount").textContent = app.sessions.length;
  document.getElementById("recordCount").textContent = Object.keys(app.records).length;
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  document.getElementById("weeklySets").textContent = app.sessions.filter(s => new Date(s.start).getTime() >= weekAgo).reduce((sum, s) => sum + s.exercises.length, 0);
}
function updateProtein() {
  const kg = Number(document.getElementById("bodyWeightInput").value) || 0;
  const ratio = Number(document.getElementById("proteinRatioInput").value) || 1.8;
  document.getElementById("proteinResult").textContent = `${Math.round(kg * ratio)} g de protéines / jour`;
}

// --- NOTIFICATIONS SIMPLES ---
function askNotificationPermission() {
  if ("Notification" in window && Notification.permission === "default") {
    Notification.requestPermission();
  }
}

// --- AFFICHAGE GLOBAL ---
function renderAll() {
  renderHome();
  renderProgram();
  renderCurrentWorkout();
  renderRecords();
  renderHistory();
  renderChallenge();
  renderInjury();
  renderTips();
  setupChartSelects();
  updateProtein();
  resetTimer();
  setTimeout(drawCharts, 100);
}

// --- BOUTONS ---
document.getElementById("startWorkoutBtn").addEventListener("click", startWorkout);
document.getElementById("saveWorkoutBtn").addEventListener("click", saveWorkout);
document.getElementById("exportBtn").addEventListener("click", exportCSV);
document.getElementById("timerStart").addEventListener("click", startTimer);
document.getElementById("timerStop").addEventListener("click", stopTimer);
document.getElementById("timerReset").addEventListener("click", resetTimer);
document.getElementById("restInput").addEventListener("input", resetTimer);
document.getElementById("startChallengeBtn").addEventListener("click", startChallenge);
document.getElementById("finishChallengeBtn").addEventListener("click", finishChallenge);
document.getElementById("applyInjuryBtn").addEventListener("click", applyInjuryMode);
document.getElementById("chartExerciseSelect").addEventListener("change", drawCharts);
document.getElementById("chartPeriodSelect").addEventListener("change", drawCharts);
document.getElementById("bodyWeightInput").addEventListener("input", updateProtein);
document.getElementById("proteinRatioInput").addEventListener("input", updateProtein);

askNotificationPermission();
renderAll();
