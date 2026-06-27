/* Mon Coach Sportif V4
   Application simple : HTML + CSS + JavaScript, sans framework, sans serveur.
   Objectif : prise de masse, usage iPhone, sauvegarde locale + export JSON. */

// --- STOCKAGE LOCAL ---
const STORAGE_KEY = "coachSportifV4";

// --- EXERCICES ---
const EXERCISES = {
  Push: ["Développé couché", "Développé incliné", "Dips", "Peck Deck", "Pompes", "Pompes inclinées", "Écarté haltères", "Développé haltères"],
  Pull: ["Tractions", "Rowing barre", "Tirage horizontal", "Curl biceps", "Shrugs", "Rowing élastique", "Curl élastique", "Superman"],
  Jambes: ["Squat", "Leg Press", "Fentes marchées", "Soulevé de terre", "Soulevé de terre roumain", "Leg Curl", "Mollets", "Squat goblet", "Fentes arrière", "Pont fessier"],
  Épaules: ["Élévations latérales", "Développé militaire", "Face pull", "Oiseau haltères", "Rotation externe élastique"],
  Abdos: ["Crunchs", "Gainage", "Relevés de jambes", "Planche", "Dead bug", "Mountain climbers"]
};

const ICONS = {
  "Développé couché":"💪", "Développé incliné":"💪", "Dips":"💪", "Peck Deck":"🦋", "Pompes":"🤲", "Pompes inclinées":"🤲", "Écarté haltères":"🦋", "Développé haltères":"🏋️",
  "Tractions":"🧗", "Rowing barre":"🚣", "Tirage horizontal":"🚣", "Curl biceps":"💪", "Shrugs":"🦍", "Rowing élastique":"🪢", "Curl élastique":"🪢", "Superman":"🦸",
  "Squat":"🏋️", "Leg Press":"🦵", "Fentes marchées":"🚶", "Soulevé de terre":"🏗️", "Soulevé de terre roumain":"🏗️", "Leg Curl":"🦵", "Mollets":"🦶", "Squat goblet":"🏋️", "Fentes arrière":"🚶", "Pont fessier":"🌉",
  "Élévations latérales":"🪽", "Développé militaire":"🎖️", "Face pull":"🛡️", "Oiseau haltères":"🪽", "Rotation externe élastique":"🛡️",
  "Crunchs":"🔥", "Gainage":"🧱", "Relevés de jambes":"🔥", "Planche":"🧱", "Dead bug":"🐞", "Mountain climbers":"⛰️"
};

// --- SÉANCES MAISON / SALLE ---
const TEMPLATES = [
  { id:"home-push-25", place:"home", type:"Push", duration:25, name:"Maison Push 25 min", goal:"Pompes + pectoraux sans matériel", exercises:["Pompes", "Pompes inclinées", "Écarté haltères", "Élévations latérales", "Gainage"] },
  { id:"home-pull-25", place:"home", type:"Pull", duration:25, name:"Maison Pull élastique 25 min", goal:"Dos + biceps rapide", exercises:["Rowing élastique", "Curl élastique", "Superman", "Face pull", "Dead bug"] },
  { id:"home-legs-30", place:"home", type:"Jambes", duration:30, name:"Maison Jambes 30 min", goal:"Jambes sans machine", exercises:["Squat goblet", "Fentes arrière", "Pont fessier", "Mollets", "Planche"] },
  { id:"home-full-20", place:"home", type:"Full Body", duration:20, name:"Maison Full Body express", goal:"Séance courte mais utile", exercises:["Pompes", "Squat goblet", "Rowing élastique", "Mountain climbers"] },
  { id:"home-core-25", place:"home", type:"Abdos", duration:25, name:"Maison Abdos + mobilité", goal:"Gainage, abdos, prévention", exercises:["Gainage", "Crunchs", "Dead bug", "Relevés de jambes", "Rotation externe élastique"] },
  { id:"home-shoulders-safe", place:"home", type:"Épaules", duration:20, name:"Maison épaules prudentes", goal:"Renforcement doux", exercises:["Face pull", "Rotation externe élastique", "Oiseau haltères", "Gainage"] },
  { id:"gym-push-60", place:"gym", type:"Push", duration:60, name:"Salle Push force", goal:"Pecs + épaules + triceps", exercises:["Développé couché", "Développé incliné", "Peck Deck", "Dips", "Élévations latérales"] },
  { id:"gym-pull-60", place:"gym", type:"Pull", duration:60, name:"Salle Pull dos", goal:"Dos + biceps", exercises:["Tractions", "Rowing barre", "Tirage horizontal", "Curl biceps", "Shrugs"] },
  { id:"gym-legs-60", place:"gym", type:"Jambes", duration:60, name:"Salle Jambes squat", goal:"Quadriceps + fessiers", exercises:["Squat", "Leg Press", "Fentes marchées", "Leg Curl", "Mollets"] },
  { id:"gym-posterior-60", place:"gym", type:"Jambes", duration:60, name:"Salle chaîne arrière", goal:"Ischios + fessiers + dos prudent", exercises:["Soulevé de terre", "Soulevé de terre roumain", "Leg Curl", "Pont fessier", "Gainage"] },
  { id:"gym-upper-60", place:"gym", type:"Haut", duration:60, name:"Salle Haut du corps", goal:"Haut complet", exercises:["Développé incliné", "Tractions", "Rowing barre", "Peck Deck", "Curl biceps"] },
  { id:"gym-full-60", place:"gym", type:"Full Body", duration:60, name:"Salle Full Body", goal:"Tout le corps", exercises:["Squat", "Développé couché", "Tractions", "Leg Press", "Peck Deck"] }
];

const INITIAL_RECORDS = {
  "Squat": { weight: 70, reps: 0 },
  "Développé couché": { weight: 60, reps: 0 },
  "Tractions": { weight: 0, reps: 6 },
  "Leg Press": { weight: 112, reps: 0 },
  "Peck Deck": { weight: 66, reps: 0 }
};

const INJURY_SUBS = {
  shoulders: { label:"Épaules", avoid:["Développé couché", "Développé incliné", "Dips", "Développé militaire"], subs:{"Développé couché":"Peck Deck", "Développé incliné":"Peck Deck", "Dips":"Pompes inclinées", "Développé militaire":"Face pull"} },
  back: { label:"Dos", avoid:["Soulevé de terre", "Soulevé de terre roumain", "Rowing barre", "Squat"], subs:{"Soulevé de terre":"Leg Curl", "Soulevé de terre roumain":"Pont fessier", "Rowing barre":"Tirage horizontal", "Squat":"Leg Press"} },
  knees: { label:"Genoux", avoid:["Squat", "Fentes marchées", "Fentes arrière", "Leg Press"], subs:{"Squat":"Pont fessier", "Fentes marchées":"Leg Curl", "Fentes arrière":"Pont fessier", "Leg Press":"Leg Curl"} }
};

const CHALLENGES = [
  { id:"mass-regular", name:"Régularité prise de masse", desc:"Faire 4 séances en 10 jours.", days:10, metric:"sessions", target:4 },
  { id:"gym-3", name:"3 séances salle", desc:"Faire 3 séances salle en 7 jours.", days:7, metric:"sessions", place:"gym", target:3 },
  { id:"home-3", name:"3 séances maison", desc:"Faire 3 séances maison en 7 jours.", days:7, metric:"sessions", place:"home", target:3 },
  { id:"push-45", name:"45 séries Push", desc:"Cumuler 45 séries Push en 14 jours.", days:14, metric:"sets", type:"Push", target:45 },
  { id:"pull-40", name:"40 séries Pull", desc:"Cumuler 40 séries Pull en 14 jours.", days:14, metric:"sets", type:"Pull", target:40 },
  { id:"legs-50", name:"50 séries Jambes", desc:"Cumuler 50 séries jambes en 14 jours.", days:14, metric:"sets", type:"Jambes", target:50 },
  { id:"squat-120", name:"120 reps Squat", desc:"Cumuler 120 répétitions de Squat en 14 jours.", days:14, metric:"reps", exercise:"Squat", target:120 },
  { id:"pushups-200", name:"200 pompes", desc:"Cumuler 200 pompes en 14 jours.", days:14, metric:"reps", exercise:"Pompes", target:200 },
  { id:"pullups-35", name:"35 tractions", desc:"Cumuler 35 tractions en 14 jours.", days:14, metric:"reps", exercise:"Tractions", target:35 },
  { id:"volume-20000", name:"20 000 kg de volume", desc:"Cumuler 20 000 kg x reps en 10 jours.", days:10, metric:"volume", target:20000 },
  { id:"pain-free", name:"Séances propres", desc:"Faire 3 séances avec douleur moyenne inférieure à 2/5.", days:14, metric:"lowPainSessions", target:3 },
  { id:"protein-week", name:"Rappel protéines", desc:"Noter ton poids et consulter les conseils nutrition 3 fois.", days:7, metric:"nutritionViews", target:3 }
];

// --- DONNÉES PAR DÉFAUT ---
function defaultData(){
  return {
    sessions: [],
    records: deepClone(INITIAL_RECORDS),
    settings: { restSeconds:90, injury:"none", bodyWeight:"", objective:"Prise de masse" },
    active: null,
    counters: { nutritionViews:0 },
    challenge: { ...CHALLENGES[0], startedAt:new Date().toISOString(), finished:false }
  };
}

let data = loadData();
let timerRemaining = data.settings.restSeconds || 90;
let timerInterval = null;
let pendingFinishedSession = null;

// --- OUTILS SIMPLES ---
function $(id){ return document.getElementById(id); }
function deepClone(obj){ return JSON.parse(JSON.stringify(obj)); }
function saveData(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
function loadData(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return defaultData();
    const parsed = JSON.parse(raw);
    const merged = { ...defaultData(), ...parsed };
    merged.settings = { ...defaultData().settings, ...(parsed.settings || {}) };
    merged.counters = { ...defaultData().counters, ...(parsed.counters || {}) };
    return merged;
  }catch(e){ return defaultData(); }
}
function toast(msg){ const el=$("toast"); el.textContent=msg; el.classList.add("show"); setTimeout(()=>el.classList.remove("show"),1800); }
function groupOf(name){ return Object.keys(EXERCISES).find(g => EXERCISES[g].includes(name)) || "Autre"; }
function icon(name){ return ICONS[name] || "🏋️"; }
function placeLabel(p){ return p === "home" ? "Maison" : "Salle"; }
function fmtDate(iso){ return new Date(iso).toLocaleDateString("fr-FR", { day:"2-digit", month:"2-digit", hour:"2-digit", minute:"2-digit" }); }
function today(){ return new Date().toISOString().slice(0,10); }
function daysAgo(n){ const d = new Date(); d.setDate(d.getDate() - Number(n)); return d; }
function number(v){ return Number(String(v).replace(",", ".")) || 0; }
function allExercises(){ return [...new Set(Object.values(EXERCISES).flat())].sort((a,b)=>a.localeCompare(b,"fr")); }
function setVolume(set){ return number(set.weight) * number(set.reps); }
function sessionVolume(s){ return s.exercises.reduce((total,e)=>total+e.sets.reduce((t,set)=>t+setVolume(set),0),0); }
function sessionSets(s){ return s.exercises.reduce((total,e)=>total+e.sets.length,0); }
function sessionReps(s){ return s.exercises.reduce((total,e)=>total+e.sets.reduce((t,set)=>t+number(set.reps),0),0); }
function avg(arr){ const nums = arr.map(number).filter(n=>n>0); return nums.length ? nums.reduce((a,b)=>a+b,0)/nums.length : 0; }
function safeId(){ return (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()+Math.random())); }

// --- NAVIGATION ---
document.querySelectorAll(".tab").forEach(btn => btn.addEventListener("click", () => showPage(btn.dataset.page)));
function showPage(page){
  document.querySelectorAll(".tab").forEach(b => b.classList.toggle("active", b.dataset.page === page));
  document.querySelectorAll(".page").forEach(p => p.classList.toggle("active", p.id === page));
  if(page === "tracking") renderTracking();
  if(page === "nutrition") { data.counters.nutritionViews += 1; saveData(); renderNutrition(); renderChallenge(); }
}

// --- RENDU GLOBAL ---
function renderAll(){
  saveData();
  renderHome();
  renderLibrary();
  renderActiveWorkout();
  renderTracking();
  renderNutrition();
  renderChallenge();
  renderSafety();
  renderAddExerciseSelects();
}

// --- ACCUEIL / BIBLIOTHÈQUE ---
function templatePasses(t, filter){
  if(filter === "all") return true;
  if(filter === "home" || filter === "gym") return t.place === filter;
  if(filter === "push") return t.type === "Push";
  if(filter === "pull") return t.type === "Pull";
  if(filter === "legs") return t.type === "Jambes";
  return true;
}
function templateCard(t){
  return `<div class="template-card">
    <div class="section-title"><div><h3>${t.name}</h3><p class="muted">${t.goal}</p></div></div>
    <div class="meta"><span class="pill ${t.place === "home" ? "home-pill" : "gym-pill"}">${placeLabel(t.place)}</span><span class="pill">${t.type}</span><span class="pill muted-pill">${t.duration} min</span><span class="pill mass-pill">prise de masse</span></div>
    <p class="muted">${t.exercises.map(e => `${icon(e)} ${e}`).join(" · ")}</p>
    <button class="primary" data-start-template="${t.id}">Lancer</button>
  </div>`;
}
function renderHome(){
  const sinceWeek = daysAgo(7);
  const week = data.sessions.filter(s => new Date(s.startedAt) >= sinceWeek);
  $("statSessions").textContent = data.sessions.length;
  $("statWeekSets").textContent = week.reduce((t,s)=>t+sessionSets(s),0);
  $("statWeekVolume").textContent = Math.round(week.reduce((t,s)=>t+sessionVolume(s),0)).toLocaleString("fr-FR");
  const home = data.sessions.filter(s=>s.place==="home").length;
  const gym = data.sessions.filter(s=>s.place==="gym").length;
  $("statBalance").textContent = `${home} / ${gym}`;
  const suggested = TEMPLATES.filter(t => t.place === "gym").slice(0,3).concat(TEMPLATES.filter(t => t.place === "home").slice(0,3));
  $("suggestedSessions").innerHTML = suggested.map(templateCard).join("");
  bindStartButtons();
  drawHomeChart();
}
function renderLibrary(filter="all"){
  $("templateList").innerHTML = TEMPLATES.filter(t=>templatePasses(t,filter)).map(templateCard).join("");
  bindStartButtons();
}
function bindStartButtons(){
  document.querySelectorAll("[data-start-template]").forEach(btn => btn.onclick = () => startWorkout(btn.dataset.startTemplate));
}
document.querySelectorAll("[data-template-filter]").forEach(btn => btn.addEventListener("click", () => {
  const filter = btn.dataset.templateFilter;
  document.querySelectorAll("[data-template-filter]").forEach(b => b.classList.toggle("active", b.dataset.templateFilter === filter));
  renderLibrary(filter);
}));
document.querySelectorAll("[data-filter-open]").forEach(btn => btn.addEventListener("click", () => {
  showPage("library"); renderLibrary(btn.dataset.filterOpen);
}));
$("quickStartBtn").addEventListener("click", () => showPage("library"));

// --- SÉANCE ACTIVE ---
function emptySet(){ return { weight:"", reps:"", rpe:"", pain:0, notes:"" }; }
function applyInjury(exercises){
  const inj = data.settings.injury;
  if(inj === "none" || !INJURY_SUBS[inj]) return exercises;
  const subs = INJURY_SUBS[inj].subs;
  return exercises.map(ex => {
    const newName = subs[ex.name] || ex.name;
    return { ...ex, name:newName, type:groupOf(newName) };
  });
}
function startWorkout(templateId){
  const t = TEMPLATES.find(x=>x.id===templateId);
  if(!t) return;
  let exercises = t.exercises.map(name => ({ id:safeId(), name, type:groupOf(name), sets:[emptySet()] }));
  exercises = applyInjury(exercises);
  data.active = { id:safeId(), startedAt:new Date().toISOString(), templateId:t.id, templateName:t.name, place:t.place, type:t.type, duration:t.duration, readiness:{energy:"normal", sleep:"correct", pain:"none"}, exercises };
  timerRemaining = data.settings.restSeconds;
  stopTimer();
  renderAll();
  showPage("workout");
  toast(`${t.name} lancée`);
}
function renderActiveWorkout(){
  const a = data.active;
  if(!a){
    $("activeBadge").textContent = "Aucune séance active";
    $("activeTitle").textContent = "Choisis une séance";
    $("activeMeta").textContent = "Va dans “Choisir” ou lance une séance depuis l'accueil.";
    $("readinessPanel").innerHTML = "";
    $("activeExercises").innerHTML = `<div class="empty">Aucune séance en cours.</div>`;
    return;
  }
  $("activeBadge").textContent = `${placeLabel(a.place)} · ${a.duration} min · ${a.type}`;
  $("activeBadge").className = `pill ${a.place === "home" ? "home-pill" : "gym-pill"}`;
  $("activeTitle").textContent = a.templateName;
  $("activeMeta").textContent = `Démarrée le ${fmtDate(a.startedAt)} · objectif prise de masse`;
  renderReadiness();
  $("activeExercises").innerHTML = a.exercises.map((ex, exIndex) => exerciseHtml(ex, exIndex)).join("");
  bindWorkoutEvents();
}
function renderReadiness(){
  const r = data.active.readiness;
  const groups = [
    { key:"energy", label:"Énergie", values:[["low","Basse"],["normal","OK"],["high","Haute"]] },
    { key:"sleep", label:"Sommeil", values:[["bad","Mauvais"],["correct","OK"],["good","Bon"]] },
    { key:"pain", label:"Douleur", values:[["none","Non"],["light","Légère"],["careful","Prudence"]] }
  ];
  $("readinessPanel").innerHTML = groups.map(g => `<div class="mini-choice"><span>${g.label}</span><div class="choice-row">${g.values.map(v => `<button data-ready-key="${g.key}" data-ready-val="${v[0]}" class="${r[g.key]===v[0]?'active':''}">${v[1]}</button>`).join("")}</div></div>`).join("");
  document.querySelectorAll("[data-ready-key]").forEach(btn => btn.onclick = () => { data.active.readiness[btn.dataset.readyKey] = btn.dataset.readyVal; renderAll(); });
}
function exerciseHtml(ex, exIndex){
  const record = data.records[ex.name];
  const recordText = record ? `${record.weight ? `record ${record.weight} kg` : ""}${record.weight && record.reps ? " · " : ""}${record.reps ? `record ${record.reps} reps` : ""}` : "pas encore de record";
  return `<article class="exercise-card" data-ex-index="${exIndex}">
    <div class="exercise-title">
      <div><h3>${icon(ex.name)} ${ex.name}</h3><p class="record-note">${recordText}</p></div>
      <span class="pill">${ex.type}</span>
    </div>
    ${ex.sets.map((set,setIndex)=>setHtml(set,exIndex,setIndex)).join("")}
    <div class="exercise-actions">
      <button data-add-set="${exIndex}" class="primary small">+ Série</button>
      <button data-copy-set="${exIndex}" class="small">Copier</button>
      <button data-replace-ex="${exIndex}" class="small">Remplacer</button>
      <button data-delete-ex="${exIndex}" class="danger ghost small">Supprimer</button>
    </div>
  </article>`;
}
function setHtml(set, exIndex, setIndex){
  return `<div class="set-block">
    <div class="set-row">
      <div class="set-label">S${setIndex+1}</div>
      <input data-field="weight" data-ex="${exIndex}" data-set="${setIndex}" type="number" inputmode="decimal" step="0.5" placeholder="kg" value="${set.weight}">
      <input data-field="reps" data-ex="${exIndex}" data-set="${setIndex}" type="number" inputmode="numeric" step="1" placeholder="reps" value="${set.reps}">
      <input data-field="rpe" data-ex="${exIndex}" data-set="${setIndex}" type="number" inputmode="decimal" step="0.5" min="1" max="10" placeholder="RPE" value="${set.rpe}">
    </div>
    <div class="stepper-row">
      <button data-step="weight:-2.5" data-ex="${exIndex}" data-set="${setIndex}">-2,5 kg</button>
      <button data-step="weight:2.5" data-ex="${exIndex}" data-set="${setIndex}">+2,5 kg</button>
      <button data-step="reps:-1" data-ex="${exIndex}" data-set="${setIndex}">-1 rep</button>
      <button data-step="reps:1" data-ex="${exIndex}" data-set="${setIndex}">+1 rep</button>
    </div>
    <div class="notes-row">
      <input data-field="notes" data-ex="${exIndex}" data-set="${setIndex}" type="text" placeholder="note rapide" value="${set.notes || ""}">
      <select data-field="pain" data-ex="${exIndex}" data-set="${setIndex}">
        ${[0,1,2,3,4,5].map(n => `<option value="${n}" ${Number(set.pain)===n?'selected':''}>douleur ${n}/5</option>`).join("")}
      </select>
    </div>
    <div class="exercise-actions"><button data-delete-set="${exIndex}:${setIndex}" class="danger ghost small">Supprimer cette série</button></div>
  </div>`;
}
function bindWorkoutEvents(){
  document.querySelectorAll("[data-field]").forEach(el => el.oninput = () => {
    const ex = data.active.exercises[Number(el.dataset.ex)];
    const set = ex.sets[Number(el.dataset.set)];
    set[el.dataset.field] = el.value;
    saveData();
  });
  document.querySelectorAll("[data-step]").forEach(btn => btn.onclick = () => {
    const [field, delta] = btn.dataset.step.split(":");
    const set = data.active.exercises[Number(btn.dataset.ex)].sets[Number(btn.dataset.set)];
    const next = Math.max(0, number(set[field]) + Number(delta));
    set[field] = field === "weight" ? String(Number(next.toFixed(1))) : String(Math.round(next));
    renderAll();
  });
  document.querySelectorAll("[data-add-set]").forEach(btn => btn.onclick = () => {
    const ex = data.active.exercises[Number(btn.dataset.addSet)];
    const last = ex.sets[ex.sets.length-1] || emptySet();
    ex.sets.push({ ...emptySet(), weight:last.weight || "", reps:last.reps || "" });
    renderAll();
    startTimer();
  });
  document.querySelectorAll("[data-copy-set]").forEach(btn => btn.onclick = () => {
    const ex = data.active.exercises[Number(btn.dataset.copySet)];
    ex.sets.push({ ...(ex.sets[ex.sets.length-1] || emptySet()) });
    renderAll();
  });
  document.querySelectorAll("[data-delete-set]").forEach(btn => btn.onclick = () => {
    const [exI,setI] = btn.dataset.deleteSet.split(":").map(Number);
    const ex = data.active.exercises[exI];
    if(ex.sets.length > 1) ex.sets.splice(setI,1); else ex.sets[0] = emptySet();
    renderAll();
  });
  document.querySelectorAll("[data-delete-ex]").forEach(btn => btn.onclick = () => { data.active.exercises.splice(Number(btn.dataset.deleteEx),1); renderAll(); });
  document.querySelectorAll("[data-replace-ex]").forEach(btn => btn.onclick = () => replaceExercise(Number(btn.dataset.replaceEx)));
}
function replaceExercise(index){
  const current = data.active.exercises[index];
  const sameGroup = EXERCISES[current.type] || allExercises();
  const choice = prompt(`Remplacer ${current.name}. Copie/colle un nom :\n\n${sameGroup.join("\n")}`);
  if(!choice) return;
  const found = allExercises().find(e => e.toLowerCase() === choice.trim().toLowerCase());
  if(!found){ toast("Exercice non trouvé"); return; }
  current.name = found;
  current.type = groupOf(found);
  renderAll();
}

// --- AJOUT EXERCICE ---
function renderAddExerciseSelects(){
  $("addGroup").innerHTML = Object.keys(EXERCISES).map(g=>`<option value="${g}">${g}</option>`).join("");
  updateAddExerciseList();
}
function updateAddExerciseList(){
  const g = $("addGroup").value || Object.keys(EXERCISES)[0];
  $("addExercise").innerHTML = EXERCISES[g].map(e=>`<option value="${e}">${icon(e)} ${e}</option>`).join("");
}
$("addGroup").addEventListener("change", updateAddExerciseList);
$("addExercise").addEventListener("click", updateAddExerciseList);
$("addExercise").addEventListener("change", updateAddExerciseList);
$("addExercise").addEventListener("input", updateAddExerciseList);
$("addExercise").addEventListener("blur", updateAddExerciseList);
$("addExercise").addEventListener("focus", updateAddExerciseList);
$("addExercise").addEventListener("keydown", updateAddExerciseList);
$("addExercise").addEventListener("keyup", updateAddExerciseList);
$("addExercise").addEventListener("mousedown", updateAddExerciseList);
$("addExercise").addEventListener("touchstart", updateAddExerciseList);
$("addExercise").addEventListener("pointerdown", updateAddExerciseList);
$("addExercise").addEventListener("pointerup", updateAddExerciseList);
$("addExercise").addEventListener("mouseup", updateAddExerciseList);
$("addExercise").addEventListener("touchend", updateAddExerciseList);
$("addExercise").addEventListener("select", updateAddExerciseList);
$("addExercise").addEventListener("search", updateAddExerciseList);
$("addExercise").addEventListener("paste", updateAddExerciseList);
$("addExercise").addEventListener("cut", updateAddExerciseList);
$("addExercise").addEventListener("compositionend", updateAddExerciseList);
$("addExercise").addEventListener("animationend", updateAddExerciseList);
$("addExercise").addEventListener("transitionend", updateAddExerciseList);
$("addExercise").addEventListener("wheel", updateAddExerciseList);
$("addExercise").addEventListener("scroll", updateAddExerciseList);
$("addExercise").addEventListener("drag", updateAddExerciseList);
$("addExercise").addEventListener("drop", updateAddExerciseList);
$("addExercise").addEventListener("dragend", updateAddExerciseList);
$("addExercise").addEventListener("dragstart", updateAddExerciseList);
$("addExercise").addEventListener("dragover", updateAddExerciseList);
$("addExercise").addEventListener("dragleave", updateAddExerciseList);
$("addExercise").addEventListener("dragenter", updateAddExerciseList);
function addSelectedExercise(){
  if(!data.active){ toast("Lance d'abord une séance"); return; }
  const name = $("addExercise").value;
  data.active.exercises.push({ id:safeId(), name, type:groupOf(name), sets:[emptySet()] });
  renderAll();
}
$("addExercise").closest(".inline-form").querySelector("button").addEventListener("click", addSelectedExercise);

// --- MINUTEUR ---
function timerText(sec){ const m=String(Math.floor(sec/60)).padStart(2,"0"); const s=String(sec%60).padStart(2,"0"); return `${m}:${s}`; }
function renderTimer(){ $("timerDisplay").textContent = timerText(timerRemaining); }
function startTimer(){ stopTimer(); timerInterval = setInterval(()=>{ timerRemaining = Math.max(0,timerRemaining-1); renderTimer(); if(timerRemaining===0) stopTimer(); },1000); $("timerToggle").textContent="⏸"; }
function stopTimer(){ clearInterval(timerInterval); timerInterval=null; $("timerToggle").textContent="▶"; }
function resetTimer(){ stopTimer(); timerRemaining = data.settings.restSeconds || 90; renderTimer(); }
$("timerToggle").addEventListener("click", () => timerInterval ? stopTimer() : startTimer());
$("timerReset").addEventListener("click", resetTimer);

// --- FIN DE SÉANCE ---
function prepareFinishedSession(){
  if(!data.active) return null;
  const s = deepClone(data.active);
  s.endedAt = new Date().toISOString();
  s.summary = buildSessionSummary(s);
  return s;
}
function buildSessionSummary(s){
  const volume = sessionVolume(s);
  const sets = sessionSets(s);
  const reps = sessionReps(s);
  const rpes = s.exercises.flatMap(e=>e.sets.map(set=>set.rpe));
  const pains = s.exercises.flatMap(e=>e.sets.map(set=>set.pain));
  const avgRpe = avg(rpes);
  const avgPain = avg(pains);
  const durationMin = Math.max(1, Math.round((new Date(s.endedAt) - new Date(s.startedAt)) / 60000));
  const prs = findPotentialRecords(s);
  return { volume, sets, reps, avgRpe, avgPain, durationMin, prs };
}
function findPotentialRecords(s){
  const out = [];
  s.exercises.forEach(ex => ex.sets.forEach(set => {
    const rec = data.records[ex.name] || { weight:0, reps:0 };
    if(number(set.weight) > (rec.weight || 0)) out.push(`${ex.name} : nouveau poids ${set.weight} kg`);
    if(number(set.reps) > (rec.reps || 0) && number(set.weight) === 0) out.push(`${ex.name} : nouveau record ${set.reps} reps`);
  }));
  return [...new Set(out)];
}
function renderFinishModal(session){
  const sum = session.summary;
  const nutrition = nutritionAdviceFor(session);
  const next = nextSessionAdvice(session);
  $("finishSummary").innerHTML = `
    <div class="summary-grid">
      <div class="summary-box"><strong>${Math.round(sum.durationMin)} min</strong><span class="muted">durée</span></div>
      <div class="summary-box"><strong>${sum.sets}</strong><span class="muted">séries</span></div>
      <div class="summary-box"><strong>${Math.round(sum.volume).toLocaleString("fr-FR")}</strong><span class="muted">kg x reps</span></div>
      <div class="summary-box"><strong>${sum.avgRpe ? sum.avgRpe.toFixed(1) : "—"}</strong><span class="muted">RPE moyen</span></div>
    </div>
    ${sum.prs.length ? `<div class="advice"><strong>🏆 Records possibles</strong><p class="muted">${sum.prs.join("<br>")}</p></div>` : `<div class="advice"><strong>👍 Séance validée</strong><p class="muted">Pas forcément de record, mais la régularité construit la prise de masse.</p></div>`}
    <div class="advice"><strong>🍽️ Après cette séance</strong><p class="muted">${nutrition}</p></div>
    <div class="advice"><strong>📈 Prochaine fois</strong><p class="muted">${next}</p></div>
    ${sum.avgPain >= 2 ? `<div class="warning">Douleur moyenne ${sum.avgPain.toFixed(1)}/5 : évite d'augmenter la charge sur les exercices concernés à la prochaine séance.</div>` : ``}
  `;
  $("finishModal").classList.remove("hidden");
}
function finishWorkout(){
  if(!data.active){ toast("Aucune séance active"); return; }
  pendingFinishedSession = prepareFinishedSession();
  renderFinishModal(pendingFinishedSession);
}
function saveFinishedWorkout(){
  if(!pendingFinishedSession) return;
  updateRecords(pendingFinishedSession);
  data.sessions.unshift(pendingFinishedSession);
  data.active = null;
  pendingFinishedSession = null;
  $("finishModal").classList.add("hidden");
  resetTimer();
  renderAll();
  showPage("nutrition");
  toast("Séance enregistrée");
}
function updateRecords(s){
  s.exercises.forEach(ex => ex.sets.forEach(set => {
    const w = number(set.weight), r = number(set.reps);
    if(!data.records[ex.name]) data.records[ex.name] = { weight:0, reps:0 };
    if(w > data.records[ex.name].weight) data.records[ex.name].weight = w;
    if(w === 0 && r > data.records[ex.name].reps) data.records[ex.name].reps = r;
    if(w > 0 && r > data.records[ex.name].reps && ex.name === "Tractions") data.records[ex.name].reps = r;
  }));
}
$("finishWorkout").addEventListener("click", finishWorkout);
$("saveFinishedWorkout").addEventListener("click", saveFinishedWorkout);
$("returnWorkout").addEventListener("click", () => $("finishModal").classList.add("hidden"));
$("closeModal").addEventListener("click", () => $("finishModal").classList.add("hidden"));
$("cancelWorkout").addEventListener("click", () => { if(confirm("Annuler la séance en cours ?")){ data.active=null; renderAll(); }});

// --- NUTRITION ---
function nutritionAdviceFor(session){
  const place = session.place;
  const type = session.type;
  const intense = session.summary.volume > 9000 || session.summary.avgRpe >= 8 || type === "Jambes";
  if(place === "gym" && intense) return "Séance exigeante : vise un vrai repas dans les 1 à 2 h avec protéines + glucides. Exemple : poulet/riz/légumes, œufs + pain complet + fruit, ou skyr + avoine + banane si tu veux rapide.";
  if(place === "gym") return "Séance salle : prends une source de protéines et des glucides. L'objectif prise de masse est d'éviter de finir la journée trop bas en calories.";
  if(type === "Abdos" || session.duration <= 25) return "Séance courte : si ton prochain repas arrive bientôt, pas besoin de forcer. Sinon, collation simple : skyr/fromage blanc + fruit, ou œufs + pain complet.";
  return "Séance maison : garde le réflexe protéines + glucides, même en portion modérée. Exemple : fromage blanc + banane + flocons d'avoine.";
}
function nextSessionAdvice(session){
  const lines = [];
  session.exercises.slice(0,3).forEach(ex => {
    const best = Math.max(...ex.sets.map(s=>number(s.weight)));
    const rpe = avg(ex.sets.map(s=>s.rpe));
    const pain = avg(ex.sets.map(s=>s.pain));
    if(pain >= 2) lines.push(`${ex.name} : garde léger ou remplace, douleur signalée.`);
    else if(best && rpe && rpe <= 7) lines.push(`${ex.name} : tu peux tenter +2,5 kg si la technique reste propre.`);
    else if(best && rpe >= 8.5) lines.push(`${ex.name} : garde la même charge, priorité qualité.`);
    else lines.push(`${ex.name} : vise au moins la même performance.`);
  });
  return lines.join("<br>") || "Prochaine séance : régularité, technique propre et légère progression si tu te sens bien.";
}
function renderNutrition(){
  if(data.settings.bodyWeight) $("bodyWeight").value = data.settings.bodyWeight;
  updateProteinResult();
  const last = data.sessions[0];
  const advice = last ? nutritionAdviceFor(last) : "Après une séance prise de masse : prends une source de protéines et des glucides. Si la séance est lourde, privilégie un vrai repas plutôt qu'une petite collation.";
  $("postWorkoutAdvice").innerHTML = `
    <div class="advice"><strong>Conseil principal</strong><p class="muted">${advice}</p></div>
    <div class="advice"><strong>Repère simple</strong><p class="muted">Sur la journée, vise environ 1,6 à 2,0 g de protéines par kg de poids de corps, avec assez de glucides pour tenir tes séances.</p></div>
    <div class="advice"><strong>Le piège en prise de masse</strong><p class="muted">Ne pas assez manger après les grosses séances, surtout jambes ou full body. La progression vient de l'entraînement + récupération + alimentation.</p></div>`;
}
function updateProteinResult(){
  const w = number($("bodyWeight").value || data.settings.bodyWeight);
  if(!w){ $("proteinResult").textContent = "Indique ton poids pour obtenir une cible."; return; }
  $("proteinResult").textContent = `Cible simple : ${Math.round(w*1.6)} à ${Math.round(w*2.0)} g de protéines/jour.`;
}
$("saveWeight").addEventListener("click", () => { data.settings.bodyWeight = $("bodyWeight").value; saveData(); updateProteinResult(); toast("Poids enregistré"); });
$("bodyWeight").addEventListener("input", updateProteinResult);

// --- SUIVI / HISTORIQUE / GRAPHIQUES NATIFS ---
function renderTracking(){
  renderFilters(); renderRecords(); renderHistory(); drawProgressChart();
}
function renderFilters(){
  const current = $("exerciseFilter").value;
  $("exerciseFilter").innerHTML = `<option value="all">Tous les exercices</option>` + allExercises().map(e=>`<option value="${e}">${e}</option>`).join("");
  if(current) $("exerciseFilter").value = current;
}
["metricFilter","exerciseFilter","placeFilter","periodFilter"].forEach(id => $(id).addEventListener("change", drawProgressChart));
function renderRecords(){
  const entries = Object.entries(data.records).sort((a,b)=>a[0].localeCompare(b[0],"fr"));
  $("recordsList").innerHTML = entries.length ? entries.map(([name,r]) => `<div class="record-row"><strong>${icon(name)} ${name}</strong><p class="muted">${r.weight ? `${r.weight} kg` : "—"}${r.weight && r.reps ? " · " : ""}${r.reps ? `${r.reps} reps` : ""}</p></div>`).join("") : `<div class="empty">Aucun record.</div>`;
}
function renderHistory(){
  if(!data.sessions.length){ $("historyList").innerHTML = `<div class="empty">Aucune séance enregistrée.</div>`; return; }
  $("historyList").innerHTML = data.sessions.map(s => `<article class="history-item">
    <div class="section-title"><div><h3>${s.templateName}</h3><p class="muted">${fmtDate(s.startedAt)} · ${placeLabel(s.place)} · ${sessionSets(s)} séries · ${Math.round(sessionVolume(s)).toLocaleString("fr-FR")} kg x reps</p></div><span class="pill ${s.place==='home'?'home-pill':'gym-pill'}">${placeLabel(s.place)}</span></div>
    <details><summary>Détail</summary>${s.exercises.map(e=>`<p class="muted">${icon(e.name)} <strong>${e.name}</strong> — ${e.sets.map((set,i)=>`S${i+1}: ${set.weight||0}kg x ${set.reps||0}, RPE ${set.rpe||"—"}, douleur ${set.pain||0}/5`).join(" · ")}</p>`).join("")}</details>
  </article>`).join("");
}
function filteredSessions(){
  const place = $("placeFilter").value;
  const since = daysAgo($("periodFilter").value);
  return data.sessions.filter(s => new Date(s.startedAt) >= since && (place === "all" || s.place === place)).slice().reverse();
}
function metricForSession(s, metric, exercise){
  let exercises = s.exercises;
  if(exercise !== "all") exercises = exercises.filter(e => e.name === exercise);
  const sets = exercises.flatMap(e=>e.sets.map(set=>({ ...set, ex:e })));
  if(!sets.length) return null;
  if(metric === "bestWeight") return Math.max(...sets.map(set=>number(set.weight)));
  if(metric === "maxReps") return Math.max(...sets.map(set=>number(set.reps)));
  if(metric === "volume") return sets.reduce((t,set)=>t+setVolume(set),0);
  if(metric === "sets") return sets.length;
  if(metric === "avgRpe") return avg(sets.map(s=>s.rpe));
  if(metric === "pain") return avg(sets.map(s=>s.pain));
  return null;
}
function drawProgressChart(){
  const metric = $("metricFilter").value;
  const exercise = $("exerciseFilter").value || "all";
  const points = filteredSessions().map(s => ({ label:fmtDate(s.startedAt), value:metricForSession(s,metric,exercise) })).filter(p => p.value !== null && p.value > 0);
  $("chartHint").textContent = points.length ? `${points.length} point(s) exploitable(s).` : "Pas encore assez de données pour ce filtre.";
  drawLineCanvas("progressCanvas", points, metricLabel(metric));
}
function drawHomeChart(){
  const points = data.sessions.slice(0,8).reverse().map(s => ({ label:fmtDate(s.startedAt), value:sessionVolume(s) }));
  drawLineCanvas("homeCanvas", points, "Volume");
}
function metricLabel(m){ return ({bestWeight:"kg", maxReps:"reps", volume:"kg x reps", sets:"séries", avgRpe:"RPE", pain:"douleur"})[m] || m; }
function drawLineCanvas(id, points, label){
  const canvas = $(id); const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1; const rect = canvas.getBoundingClientRect();
  canvas.width = Math.max(320, rect.width) * dpr; canvas.height = Number(canvas.getAttribute("height")) * dpr;
  ctx.scale(dpr,dpr); const w=canvas.width/dpr, h=canvas.height/dpr;
  ctx.clearRect(0,0,w,h); ctx.fillStyle = "rgba(255,255,255,.02)"; ctx.fillRect(0,0,w,h);
  ctx.strokeStyle = "rgba(255,255,255,.12)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(34,12); ctx.lineTo(34,h-28); ctx.lineTo(w-10,h-28); ctx.stroke();
  ctx.fillStyle = "#93a8c3"; ctx.font = "12px -apple-system, BlinkMacSystemFont, Segoe UI"; ctx.fillText(label, 8, 18);
  if(points.length === 0){ ctx.fillStyle="#93a8c3"; ctx.fillText("Aucune donnée", 44, h/2); return; }
  const max = Math.max(...points.map(p=>p.value), 1); const min = Math.min(...points.map(p=>p.value), 0);
  const xFor = i => points.length === 1 ? w/2 : 44 + i * ((w-64)/(points.length-1));
  const yFor = v => (h-34) - ((v-min)/(max-min || 1)) * (h-56);
  ctx.strokeStyle = "#61e6a7"; ctx.lineWidth = 3; ctx.beginPath();
  points.forEach((p,i)=>{ const x=xFor(i), y=yFor(p.value); if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y); }); ctx.stroke();
  points.forEach((p,i)=>{ const x=xFor(i), y=yFor(p.value); ctx.fillStyle="#61e6a7"; ctx.beginPath(); ctx.arc(x,y,4,0,Math.PI*2); ctx.fill(); });
  ctx.fillStyle="#eef6ff"; const last=points[points.length-1]; ctx.fillText(String(Math.round(last.value*10)/10), xFor(points.length-1)-18, yFor(last.value)-10);
}

// --- DÉFIS ---
function challengeProgress(ch){
  const since = new Date(ch.startedAt || new Date());
  const relevant = data.sessions.filter(s => new Date(s.startedAt) >= since);
  let value = 0;
  if(ch.metric === "sessions") value = relevant.filter(s => !ch.place || s.place === ch.place).length;
  if(ch.metric === "sets") value = relevant.reduce((t,s)=>t+s.exercises.filter(e=>!ch.type || e.type===ch.type).reduce((a,e)=>a+e.sets.length,0),0);
  if(ch.metric === "reps") value = relevant.reduce((t,s)=>t+s.exercises.filter(e=>e.name===ch.exercise).reduce((a,e)=>a+e.sets.reduce((x,set)=>x+number(set.reps),0),0),0);
  if(ch.metric === "volume") value = relevant.reduce((t,s)=>t+sessionVolume(s),0);
  if(ch.metric === "lowPainSessions") value = relevant.filter(s => avg(s.exercises.flatMap(e=>e.sets.map(set=>set.pain))) < 2).length;
  if(ch.metric === "nutritionViews") value = data.counters.nutritionViews || 0;
  return { value, pct: Math.min(100, Math.round((value/ch.target)*100)) };
}
function renderChallenge(){
  const ch = data.challenge;
  const pr = challengeProgress(ch);
  $("challengeTitle").textContent = ch.name;
  $("challengeDesc").textContent = ch.desc;
  $("challengeBar").style.width = `${pr.pct}%`;
  $("challengeProgressText").textContent = `${Math.round(pr.value).toLocaleString("fr-FR")} / ${ch.target} · ${pr.pct}%`;
  $("challengeList").innerHTML = CHALLENGES.map(c => `<div class="challenge-card"><h3>${c.name}</h3><p class="muted">${c.desc}</p><button class="primary small" data-challenge="${c.id}">Choisir</button></div>`).join("");
  document.querySelectorAll("[data-challenge]").forEach(btn => btn.onclick = () => { data.challenge = { ...CHALLENGES.find(c=>c.id===btn.dataset.challenge), startedAt:new Date().toISOString(), finished:false }; renderAll(); toast("Défi choisi"); });
}
$("randomChallenge").addEventListener("click", () => { const c = CHALLENGES[Math.floor(Math.random()*CHALLENGES.length)]; data.challenge = { ...c, startedAt:new Date().toISOString(), finished:false }; renderAll(); });
$("finishChallenge").addEventListener("click", () => { data.challenge.finished = true; saveData(); toast("Défi terminé"); });

// --- DOULEUR / PRUDENCE ---
function renderSafety(){
  $("injurySelect").value = data.settings.injury;
  const inj = data.settings.injury;
  if(inj === "none") { $("injuryAdvice").innerHTML = `<div class="advice"><strong>Rien à signaler</strong><p class="muted">Garde une technique propre, échauffe les épaules et évite de courir après les records si tu es fatigué.</p></div>`; return; }
  const cfg = INJURY_SUBS[inj];
  $("injuryAdvice").innerHTML = `<div class="advice"><strong>À éviter temporairement</strong><p class="muted">${cfg.avoid.join(" · ")}</p></div><div class="advice"><strong>Substitutions proposées</strong><p class="muted">${Object.entries(cfg.subs).map(([a,b])=>`${a} → ${b}`).join("<br>")}</p></div>`;
}
$("injurySelect").addEventListener("change", () => { data.settings.injury = $("injurySelect").value; renderAll(); toast("Mode prudence mis à jour"); });

// --- EXPORTS / SAUVEGARDE ---
function download(name, text, type){ const a=document.createElement("a"); a.href=URL.createObjectURL(new Blob([text],{type})); a.download=name; a.click(); URL.revokeObjectURL(a.href); }
function exportCsv(){
  const rows = [["date","lieu","seance","type","exercice","serie","poids","reps","rpe","douleur","notes"]];
  data.sessions.forEach(s => s.exercises.forEach(e => e.sets.forEach((set,i) => rows.push([s.startedAt,placeLabel(s.place),s.templateName,s.type,e.name,i+1,set.weight,set.reps,set.rpe,set.pain,set.notes||""]))));
  const csv = rows.map(r => r.map(v => `"${String(v).replaceAll('"','""')}"`).join(";")).join("\n");
  download(`coach-sportif-historique-${today()}.csv`, csv, "text/csv;charset=utf-8");
}
function exportJson(){ download(`coach-sportif-sauvegarde-${today()}.json`, JSON.stringify(data,null,2), "application/json"); }
$("exportCsv").addEventListener("click", exportCsv);
$("exportJson").addEventListener("click", exportJson);
$("backupJson").addEventListener("click", exportJson);
$("restoreJson").addEventListener("change", async (e) => {
  const file = e.target.files[0]; if(!file) return;
  try{ const text = await file.text(); const restored = JSON.parse(text); data = { ...defaultData(), ...restored, settings:{...defaultData().settings, ...(restored.settings||{})} }; saveData(); renderAll(); toast("Sauvegarde restaurée"); }
  catch(err){ toast("Fichier invalide"); }
});
$("resetAll").addEventListener("click", () => { if(confirm("Supprimer toutes les données ?")){ localStorage.removeItem(STORAGE_KEY); data=defaultData(); renderAll(); toast("Données réinitialisées"); }});

// --- SERVICE WORKER POUR MODE INSTALLABLE / HORS LIGNE ---
if("serviceWorker" in navigator){ window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(()=>{})); }

// --- INITIALISATION ---
renderTimer();
renderAll();
