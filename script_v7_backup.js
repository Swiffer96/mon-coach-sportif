// Coach Mass V6.1 - mobile-first, avec apercu des seances avant lancement
// Donnees stockees localement dans Safari/Chrome via localStorage

// On garde volontairement la meme cle que la V5 pour conserver les donnees deja saisies.
const STORAGE_KEY = 'coachMassV5Data';

const baseExercises = {
  push: [
    { name: 'Developpe couche', icon: '💪', muscle: 'Push', category: 'push', avoid: ['shoulders'], alt: 'Peck Deck', rest: 180 },
    { name: 'Developpe incline', icon: '💪', muscle: 'Push', category: 'push', avoid: ['shoulders'], alt: 'Pompes inclinees', rest: 150 },
    { name: 'Chest press machine', icon: '💪', muscle: 'Push', category: 'push', avoid: ['shoulders'], alt: 'Peck Deck', rest: 150 },
    { name: 'Peck Deck', icon: '🦋', muscle: 'Push', category: 'push', avoid: [], alt: '', rest: 90 },
    { name: 'Pompes', icon: '🔥', muscle: 'Push', category: 'push', avoid: ['shoulders'], alt: 'Peck Deck', rest: 90 },
    { name: 'Pompes inclinees', icon: '🔥', muscle: 'Push', category: 'push', avoid: [], alt: '', rest: 75 },
    { name: 'Dips', icon: '🔥', muscle: 'Push', category: 'push', avoid: ['shoulders'], alt: 'Pompes inclinees', rest: 150 },
    { name: 'Ecarte halteres', icon: '🦋', muscle: 'Push', category: 'push', avoid: ['shoulders'], alt: 'Peck Deck', rest: 90 }
  ],
  pull: [
    { name: 'Tractions', icon: '🧗', muscle: 'Pull', category: 'pull', avoid: [], alt: '', rest: 180, special: 'pullup' },
    { name: 'Tractions assistees', icon: '🧗', muscle: 'Pull', category: 'pull', avoid: [], alt: '', rest: 150, special: 'pullup' },
    { name: 'Rowing barre', icon: '🚣', muscle: 'Pull', category: 'pull', avoid: ['back'], alt: 'Tirage horizontal', rest: 150 },
    { name: 'Tirage horizontal', icon: '🚣', muscle: 'Pull', category: 'pull', avoid: [], alt: '', rest: 120 },
    { name: 'Tirage vertical', icon: '🧗', muscle: 'Pull', category: 'pull', avoid: [], alt: '', rest: 120 },
    { name: 'Curl biceps', icon: '💪', muscle: 'Pull', category: 'pull', avoid: [], alt: '', rest: 90 },
    { name: 'Shrugs', icon: '🏋️', muscle: 'Pull', category: 'pull', avoid: [], alt: '', rest: 90 },
    { name: 'Face pull', icon: '🎯', muscle: 'Pull', category: 'pull', avoid: [], alt: '', rest: 75 }
  ],
  legs: [
    { name: 'Squat', icon: '🏋️', muscle: 'Jambes', category: 'legs', avoid: ['knees', 'back'], alt: 'Leg Press', rest: 180 },
    { name: 'Leg Press', icon: '🦵', muscle: 'Jambes', category: 'legs', avoid: ['knees'], alt: 'Leg Curl', rest: 180 },
    { name: 'Hack Squat', icon: '🦵', muscle: 'Jambes', category: 'legs', avoid: ['knees'], alt: 'Leg Press', rest: 180 },
    { name: 'Fentes marchees', icon: '🚶', muscle: 'Jambes', category: 'legs', avoid: ['knees'], alt: 'Leg Press', rest: 120 },
    { name: 'Souleve de terre', icon: '🏋️', muscle: 'Jambes', category: 'legs', avoid: ['back'], alt: 'Leg Curl', rest: 180 },
    { name: 'Souleve de terre roumain', icon: '🏋️', muscle: 'Jambes', category: 'legs', avoid: ['back'], alt: 'Leg Curl', rest: 150 },
    { name: 'Leg Curl', icon: '🦵', muscle: 'Jambes', category: 'legs', avoid: [], alt: '', rest: 90 },
    { name: 'Leg Extension', icon: '🦵', muscle: 'Jambes', category: 'legs', avoid: ['knees'], alt: 'Leg Press', rest: 90 },
    { name: 'Mollets', icon: '🦵', muscle: 'Jambes', category: 'legs', avoid: [], alt: '', rest: 75 }
  ],
  abs: [
    { name: 'Crunchs', icon: '🔥', muscle: 'Abdos', category: 'abs', avoid: ['back'], alt: 'Gainage', rest: 60 },
    { name: 'Gainage', icon: '🧱', muscle: 'Abdos', category: 'abs', avoid: [], alt: '', rest: 45 },
    { name: 'Gainage lateral', icon: '🧱', muscle: 'Abdos', category: 'abs', avoid: [], alt: '', rest: 45 },
    { name: 'Dead bug', icon: '🪲', muscle: 'Abdos', category: 'abs', avoid: [], alt: '', rest: 45 },
    { name: 'Bird dog', icon: '🧘', muscle: 'Abdos', category: 'abs', avoid: [], alt: '', rest: 45 },
    { name: 'Releves de jambes', icon: '🔥', muscle: 'Abdos', category: 'abs', avoid: ['back'], alt: 'Planche', rest: 60 },
    { name: 'Planche', icon: '🧱', muscle: 'Abdos', category: 'abs', avoid: [], alt: '', rest: 45 }
  ],
  shoulders: [
    { name: 'Elevations laterales', icon: '🪽', muscle: 'Push', category: 'shoulders', avoid: ['shoulders'], alt: 'Face pull', rest: 75 },
    { name: 'Developpe militaire', icon: '🏋️', muscle: 'Push', category: 'shoulders', avoid: ['shoulders'], alt: 'Face pull', rest: 150 },
    { name: 'Rotateurs externes', icon: '🛡️', muscle: 'Push', category: 'shoulders', avoid: [], alt: '', rest: 45 }
  ],
  warmup: [
    { name: 'Velo echauffement', icon: '🚲', muscle: 'Echauffement', category: 'warmup', avoid: [], alt: '', rest: 30 },
    { name: 'Mobilite hanches chevilles', icon: '🧘', muscle: 'Echauffement', category: 'warmup', avoid: [], alt: '', rest: 30 },
    { name: 'Activation epaules elastique', icon: '🛡️', muscle: 'Echauffement', category: 'warmup', avoid: [], alt: '', rest: 30 },
    { name: 'Tirage leger elastique', icon: '🎯', muscle: 'Echauffement', category: 'warmup', avoid: [], alt: '', rest: 30 }
  ]
};

const templates = [
  { id: 'home-push', place: 'home', type: 'Push', duration: '25 min', title: 'Maison Push express', focus: 'Pompes, pecs, epaules prudentes', list: ['Pompes', 'Pompes inclinees', 'Elevations laterales', 'Rotateurs externes'] },
  { id: 'home-pull', place: 'home', type: 'Pull', duration: '25 min', title: 'Maison Pull elastique', focus: 'Dos et biceps leger', list: ['Tirage horizontal', 'Face pull', 'Curl biceps', 'Shrugs'] },
  { id: 'home-legs', place: 'home', type: 'Jambes', duration: '30 min', title: 'Maison jambes', focus: 'Jambes sans machine', list: ['Squat', 'Fentes marchees', 'Souleve de terre roumain', 'Mollets'] },
  { id: 'home-full', place: 'home', type: 'Full', duration: '30 min', title: 'Maison full body', focus: 'Efficace quand tu as peu de temps', list: ['Squat', 'Pompes', 'Tirage horizontal', 'Curl biceps'] },
  { id: 'gym-push', place: 'gym', type: 'Push', duration: '1h', title: 'Salle Push force', focus: 'Pecs, triceps, epaules', list: ['Developpe couche', 'Developpe incline', 'Peck Deck', 'Dips', 'Elevations laterales'] },
  { id: 'gym-pull', place: 'gym', type: 'Pull', duration: '1h', title: 'Salle Pull dos', focus: 'Dos epais, tractions, biceps', list: ['Tractions', 'Rowing barre', 'Tirage horizontal', 'Curl biceps', 'Face pull'] },
  { id: 'gym-legs', place: 'gym', type: 'Jambes', duration: '1h', title: 'Salle jambes squat', focus: 'Quadriceps, ischios, mollets', list: ['Squat', 'Leg Press', 'Fentes marchees', 'Leg Curl', 'Mollets'] },
  { id: 'gym-chain', place: 'gym', type: 'Jambes', duration: '1h', title: 'Salle chaine arriere', focus: 'Ischios, fessiers, dos prudent', list: ['Souleve de terre', 'Souleve de terre roumain', 'Leg Curl', 'Mollets'] },
  { id: 'gym-upper', place: 'gym', type: 'Haut', duration: '1h', title: 'Salle haut du corps', focus: 'Push + Pull equilibre', list: ['Developpe incline', 'Tractions', 'Peck Deck', 'Rowing barre', 'Curl biceps'] },
  { id: 'gym-full', place: 'gym', type: 'Full', duration: '1h', title: 'Salle full body', focus: 'Progression globale', list: ['Squat', 'Developpe couche', 'Tractions', 'Leg Press', 'Peck Deck'] }
];

const warmups = {
  Push: ['Activation epaules elastique 2 min', 'Face pull leger 2 x 15', '2 series progressives sur le premier developpe'],
  Pull: ['Tirage leger elastique 2 min', 'Scapula pull ou tirage leger 2 x 12', '1 serie progressive sur le premier tirage'],
  Jambes: ['Velo 5 min', 'Mobilite hanches/chevilles 2 min', '2 series legeres sur squat ou leg press'],
  Full: ['Cardio doux 5 min', 'Mobilite globale 3 min', '1 serie legere sur les 2 premiers exercices'],
  Haut: ['Epaules elastique 3 min', 'Tirage leger 2 x 15', '1 serie progressive push + pull']
};

const finishers = {
  Push: ['Gainage 3 x 40 sec', 'Dead bug 2 x 10/cote', 'Face pull leger 2 x 15'],
  Pull: ['Gainage lateral 2 x 30 sec/cote', 'Bird dog 2 x 10/cote', 'Planche 2 x 40 sec'],
  Jambes: ['Gainage 3 x 40 sec', 'Bird dog 2 x 10/cote', 'Mobilite hanches 2 min'],
  Full: ['Crunchs 2 x 15', 'Gainage 2 x 40 sec', 'Dead bug 2 x 10/cote'],
  Haut: ['Gainage 3 x 40 sec', 'Dead bug 2 x 10/cote', 'Planche 1 min']
};

const challenges = [
  { id: 'regularity3', label: '3 seances cette semaine', kind: 'sessions', target: 3 },
  { id: 'gym3', label: '3 seances salle cette semaine', kind: 'placeSessions', place: 'gym', target: 3 },
  { id: 'home3', label: '3 seances maison cette semaine', kind: 'placeSessions', place: 'home', target: 3 },
  { id: 'push40', label: '40 series Push cette semaine', kind: 'muscleSets', muscle: 'Push', target: 40 },
  { id: 'pull35', label: '35 series Pull cette semaine', kind: 'muscleSets', muscle: 'Pull', target: 35 },
  { id: 'legs45', label: '45 series jambes cette semaine', kind: 'muscleSets', muscle: 'Jambes', target: 45 },
  { id: 'squat100', label: '100 reps de squat cette semaine', kind: 'exerciseReps', exercise: 'Squat', target: 100 },
  { id: 'volume12000', label: '12 000 kg de volume cette semaine', kind: 'volume', target: 12000 }
];

const initialRecords = {
  'Squat': { weight: 70, reps: 0 },
  'Developpe couche': { weight: 60, reps: 0 },
  'Tractions': { weight: 0, reps: 6 },
  'Leg Press': { weight: 112, reps: 0 },
  'Peck Deck': { weight: 66, reps: 0 }
};

let data = loadData();
let page = 'training';
let placeFilter = 'all';
let timerSeconds = 120;
let timerLeft = 120;
let timerInterval = null;
let exercisePicker = { mode: 'add', exIndex: null, category: 'all' };
let previewTemplateId = null;

function loadData(){
  const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('coachMassV4Data') || localStorage.getItem('coachSportifData');
  let parsed = null;
  if(saved){ try { parsed = JSON.parse(saved); } catch(e) { console.warn('Sauvegarde illisible', e); } }
  const fresh = {
    sessions: [], records: initialRecords, activeSession: null, injury: 'none', bodyWeights: [], activeChallenge: 'regularity3', customExercises: [], version: 6.1
  };
  const merged = { ...fresh, ...(parsed || {}) };
  merged.records = { ...initialRecords, ...(merged.records || {}) };
  merged.customExercises = merged.customExercises || [];
  if(merged.activeSession) normalizeActiveSession(merged.activeSession);
  (merged.sessions || []).forEach(normalizeSession);
  return merged;
}

function normalizeSession(session){
  if(!session.exercises) session.exercises = [];
  session.exercises.forEach(ex => {
    if(!ex.sets) ex.sets = [];
    ex.sets.forEach(s => {
      if(s.locked === undefined) s.locked = true;
      if(s.kind === undefined) s.kind = 'work';
      if(s.pullMode === undefined && /traction/i.test(ex.name)) s.pullMode = Number(s.weight || 0) < 0 ? 'assist' : Number(s.weight || 0) > 0 ? 'weighted' : 'body';
    });
  });
}
function normalizeActiveSession(session){
  normalizeSession(session);
  session.warmupDone = session.warmupDone || false;
  session.finisherDone = session.finisherDone || false;
  session.exercises.forEach(ex => {
    if(!ex.sets.length) ex.sets.push(defaultSet(ex.name));
    ex.sets.forEach(s => { if(s.locked === undefined) s.locked = false; });
  });
}
function saveData(){ data.version = 6.1; localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
function $(id){ return document.getElementById(id); }
function todayIso(){ return new Date().toISOString(); }
function formatDate(d){ return new Date(d).toLocaleDateString('fr-FR', { day:'2-digit', month:'2-digit' }); }
function formatDateTime(d){ return new Date(d).toLocaleString('fr-FR', { day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit' }); }
function clamp(n, min, max){ return Math.max(min, Math.min(max, n)); }
function weekStart(){ const d = new Date(); const day = (d.getDay() + 6) % 7; d.setHours(0,0,0,0); d.setDate(d.getDate() - day); return d; }
function isThisWeek(date){ return new Date(date) >= weekStart(); }
function allExercises(){ return [...Object.values(baseExercises).flat(), ...(data.customExercises || [])]; }
function getExercise(name){ return allExercises().find(e => e.name === name) || { name, icon:'🏋️', muscle:'Autre', category:'custom', avoid:[], alt:'', rest:120 }; }
function categoryLabel(cat){ return { all:'Tout', push:'Push', pull:'Pull', legs:'Jambes', abs:'Abdos', shoulders:'Epaules', warmup:'Echauffement', custom:'Perso' }[cat] || cat; }
function cleanText(str){ return String(str || '').trim(); }

function showPage(next){
  page = next;
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  $(next).classList.add('active');
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.toggle('active', b.dataset.page === next));
  renderAll();
}
function renderAll(){
  renderTemplates(); renderSession(); renderProgress(); renderMore();
  $('resumeBtn').classList.toggle('hidden', !data.activeSession);
}

function renderTemplates(){
  const list = $('templates'); list.innerHTML = '';
  const recent = data.sessions[0];
  $('recommendationTitle').textContent = recent ? suggestNextTitle(recent) : 'Choisis ta séance';
  $('recommendationText').textContent = recent ? 'Tu gardes le choix. La suggestion évite juste de refaire toujours le même groupe.' : 'Maison 20-30 min ou salle 1h. Simple, rapide, orienté prise de masse.';
  templates.filter(t => placeFilter === 'all' || t.place === placeFilter).forEach(t => {
    const card = document.createElement('article');
    card.className = 'template-card clickable';
    card.dataset.previewTemplate = t.id;
    const previewNames = t.list.slice(0, 4).join(' · ') + (t.list.length > 4 ? '…' : '');
    card.innerHTML = `<div class="row"><div><h3>${t.place === 'home' ? '🏠' : '🏋️'} ${t.title}</h3><p class="muted">${t.focus}</p></div><span class="tag">${t.duration}</span></div><div class="template-preview-line">${previewNames}</div><div class="start-row"><span class="muted">${t.type} · ${t.list.length} exercices</span><button class="primary mini" data-start="${t.id}">Lancer</button></div>`;
    list.appendChild(card);
  });
  document.querySelectorAll('[data-preview-template]').forEach(card => card.onclick = () => openTemplatePreview(card.dataset.previewTemplate));
  document.querySelectorAll('[data-start]').forEach(btn => btn.onclick = (event) => { event.stopPropagation(); startSession(btn.dataset.start); });
}

function openTemplatePreview(templateId){
  const tpl = templates.find(t => t.id === templateId); if(!tpl) return;
  previewTemplateId = templateId;
  $('previewTitle').textContent = `${tpl.place === 'home' ? '🏠 Maison' : '🏋️ Salle'} · ${tpl.title}`;
  $('previewMeta').textContent = `${tpl.duration} · ${tpl.type} · ${tpl.focus}`;
  const warm = warmups[tpl.type] || warmups.Full;
  const fin = finishers[tpl.type] || finishers.Full;
  const exercisesHtml = tpl.list.map((name, index) => {
    const replaced = applyInjurySubstitution(name);
    const info = getExercise(replaced);
    const sub = replaced !== name ? `<small class="substitution">remplace ${name} · mode douleur</small>` : `<small>${info.muscle} · repos ${formatRest(info.rest || 120)}</small>`;
    return `<li><span><strong>${index + 1}. ${info.icon} ${replaced}</strong>${sub}</span></li>`;
  }).join('');
  $('previewContent').innerHTML = `
    <div class="preview-block"><h3>Échauffement conseillé</h3><ul>${warm.map(i => `<li>${i}</li>`).join('')}</ul></div>
    <div class="preview-block main-preview"><h3>Exercices prévus</h3><ul>${exercisesHtml}</ul></div>
    <div class="preview-block"><h3>Finisher facultatif</h3><ul>${fin.map(i => `<li>${i}</li>`).join('')}</ul></div>
  `;
  $('templatePreviewModal').classList.remove('hidden');
}
function closeTemplatePreview(){ $('templatePreviewModal').classList.add('hidden'); previewTemplateId = null; }
function formatRest(seconds){
  const s = Number(seconds || 0);
  if(s < 60) return `${s}s`;
  const m = Math.floor(s / 60), r = s % 60;
  return r ? `${m}min${String(r).padStart(2,'0')}` : `${m}min`;
}

function suggestNextTitle(last){
  if(last.type === 'Push') return 'Suggestion : Pull ou jambes';
  if(last.type === 'Pull') return 'Suggestion : Jambes ou Push';
  if(last.type === 'Jambes') return 'Suggestion : Push ou Pull';
  return 'Suggestion : séance au choix';
}

function startSession(templateId){
  const tpl = templates.find(t => t.id === templateId); if(!tpl) return;
  const list = tpl.list.map(name => applyInjurySubstitution(name)).map(name => ({ name, sets: [defaultSet(name)] }));
  data.activeSession = { id: uid(), templateId, title: tpl.title, place: tpl.place, type: tpl.type, startedAt: todayIso(), exercises: list, warmupDone:false, finisherDone:false };
  saveData(); resetTimer(getExercise(list[0]?.name || '').rest || 120); showPage('session');
}
function uid(){ return (crypto.randomUUID ? crypto.randomUUID() : String(Date.now())); }
function defaultSet(name){
  const isPullup = getExercise(name).special === 'pullup' || /traction/i.test(name);
  const w = lastWeight(name);
  return { weight: w !== '' ? w : (isPullup ? 0 : ''), reps: lastReps(name) || 8, rpe:'', note:'', pain:'none', locked:false, kind:'work', pullMode: isPullup ? pullModeFromWeight(w) : 'normal' };
}
function pullModeFromWeight(w){ const n = Number(w || 0); if(n < 0) return 'assist'; if(n > 0) return 'weighted'; return 'body'; }
function applyInjurySubstitution(name){
  if(data.injury === 'none') return name;
  const ex = getExercise(name);
  if(ex.avoid && ex.avoid.includes(data.injury) && ex.alt) return ex.alt;
  return name;
}
function lastWeight(name){
  for(const s of data.sessions || []){
    const ex = (s.exercises || []).find(e => e.name === name);
    if(ex){ const valid = ex.sets.map(set => Number(set.weight || 0)).filter(v => !Number.isNaN(v)); if(valid.length) return valid[valid.length - 1]; }
  }
  return data.records[name]?.weight ?? '';
}
function lastReps(name){
  for(const s of data.sessions || []){
    const ex = (s.exercises || []).find(e => e.name === name);
    if(ex){ const valid = ex.sets.map(set => Number(set.reps || 0)).filter(Boolean); if(valid.length) return valid[valid.length - 1]; }
  }
  return data.records[name]?.reps || '';
}

function renderSession(){
  const active = data.activeSession;
  $('timerBar').classList.toggle('hidden', !active);
  $('finishBtn').classList.toggle('hidden', !active);
  if(!active){
    $('sessionBadge').textContent = 'Aucune séance'; $('sessionTitle').textContent = 'Lance une séance'; $('sessionMeta').textContent = 'Va dans Entraînement pour choisir une séance.';
    $('exerciseStack').className = 'exercise-stack empty-state'; $('exerciseStack').innerHTML = '<p>Aucune séance active. Va dans <strong>Entraînement</strong> pour choisir une séance.</p>'; return;
  }
  $('sessionBadge').textContent = `${active.place === 'home' ? 'Maison' : 'Salle'} · ${active.type}`;
  $('sessionTitle').textContent = active.title;
  $('sessionMeta').textContent = `Début : ${formatDateTime(active.startedAt)} · saisie rapide iPhone`;
  $('exerciseStack').className = 'exercise-stack'; $('exerciseStack').innerHTML = '';
  renderWarmup(active);
  active.exercises.forEach((ex, exIndex) => renderExerciseCard(ex, exIndex));
  renderAddExerciseCard();
  renderFinisher(active);
  attachSessionEvents();
}
function renderWarmup(active){
  const items = warmups[active.type] || warmups.Full;
  const card = document.createElement('article'); card.className = 'support-card warmup-card';
  card.innerHTML = `<div class="section-row"><div><p class="eyebrow">Echauffement conseillé</p><h3>${active.type === 'Jambes' ? '5 min vélo + activation' : '5 min pour préparer la séance'}</h3></div><button class="mini ${active.warmupDone ? 'done' : ''}" id="warmupToggle">${active.warmupDone ? 'Fait' : 'OK'}</button></div><ul>${items.map(i => `<li>${i}</li>`).join('')}</ul>`;
  $('exerciseStack').appendChild(card);
}
function renderExerciseCard(ex, exIndex){
  const info = getExercise(ex.name), rec = data.records[ex.name], last = getLastPerformance(ex.name);
  const unlockedIndex = getCurrentSetIndex(ex);
  const card = document.createElement('article'); card.className = 'exercise-card';
  card.innerHTML = `
    <div class="exercise-top">
      <div><div class="exercise-title"><strong>${info.icon}</strong><h3>${ex.name}</h3></div><div class="record">${recordLabel(ex.name, rec)}</div><div class="last-perf">${last}</div></div>
      <button class="ghost-small" data-remove-ex="${exIndex}">Suppr.</button>
    </div>
    <div class="set-list">${ex.sets.map((set, setIndex) => renderSetRow(exIndex, setIndex, set, info)).join('')}</div>
    <div class="set-actions main-actions">
      <button data-weight-minus="${exIndex}">-2,5 kg</button><button data-weight-plus="${exIndex}">+2,5 kg</button><button data-rep-minus="${exIndex}">-1 rep</button><button data-rep-plus="${exIndex}">+1 rep</button>
    </div>
    <div class="set-actions two-actions">
      <button data-add-set="${exIndex}">+ Série</button><button class="primary" data-done-set="${exIndex}">${unlockedIndex === -1 ? 'Ajouter série' : 'Valider série'}</button>
    </div>
    <details class="details"><summary>Détails / remplacer</summary><div class="details-body"><button data-replace-ex="${exIndex}">Remplacer par liste</button><button data-duplicate-ex="${exIndex}">Dupliquer exercice</button><p class="muted tiny">Dupliquer = recréer le même bloc exercice. Ajouter série = ajouter une série au même exercice.</p>${ex.sets.map((set, setIndex) => renderSetDetails(exIndex, setIndex, set)).join('')}</div></details>`;
  $('exerciseStack').appendChild(card);
}
function recordLabel(name, rec){
  if(!rec) return 'record discret : à créer';
  if(/traction/i.test(name)) return `record discret : ${rec.reps || '-'} reps · ${signedWeightLabel(rec.weight || 0)}`;
  return `record discret : ${rec.weight || '-'} kg · ${rec.reps || '-'} reps`;
}
function renderSetRow(exIndex, setIndex, set, info){
  const locked = !!set.locked;
  const pullup = info.special === 'pullup' || /traction/i.test(info.name);
  const mode = set.pullMode || pullModeFromWeight(set.weight);
  const modeSelect = pullup ? `<select data-set-field="pullMode" data-ex="${exIndex}" data-set="${setIndex}" ${locked ? 'disabled' : ''}><option value="assist" ${mode==='assist'?'selected':''}>Assist.</option><option value="body" ${mode==='body'?'selected':''}>PDC</option><option value="weighted" ${mode==='weighted'?'selected':''}>Lest</option></select>` : '';
  const status = locked ? '<span class="lock-pill">validée</span>' : '<span class="edit-pill">en cours</span>';
  return `<div class="set-row ${locked ? 'locked' : 'editing'} ${pullup ? 'pullup-row' : ''}">
    <span class="set-number">S${setIndex + 1}</span>
    ${modeSelect}
    <input type="number" step="0.5" inputmode="decimal" value="${Math.abs(Number(set.weight ?? 0)) || (set.weight === 0 ? 0 : '')}" data-set-field="weight" data-ex="${exIndex}" data-set="${setIndex}" aria-label="Poids" ${locked ? 'disabled' : ''} />
    <input type="number" step="1" inputmode="numeric" value="${set.reps ?? ''}" data-set-field="reps" data-ex="${exIndex}" data-set="${setIndex}" aria-label="Repetitions" ${locked ? 'disabled' : ''} />
    ${status}
    <button class="ghost-small" data-unlock-set="${exIndex}:${setIndex}">${locked ? '↺' : '×'}</button>
  </div>`;
}
function renderSetDetails(exIndex, setIndex, set){
  return `<div class="set-row detail-row"><span>S${setIndex + 1}</span><input type="number" min="1" max="10" placeholder="RPE" value="${set.rpe ?? ''}" data-set-field="rpe" data-ex="${exIndex}" data-set="${setIndex}" ${set.locked ? 'disabled' : ''}/><select data-set-field="pain" data-ex="${exIndex}" data-set="${setIndex}" ${set.locked ? 'disabled' : ''}><option value="none" ${set.pain === 'none' ? 'selected' : ''}>Douleur non</option><option value="light" ${set.pain === 'light' ? 'selected' : ''}>Légère</option><option value="medium" ${set.pain === 'medium' ? 'selected' : ''}>Moyenne</option><option value="strong" ${set.pain === 'strong' ? 'selected' : ''}>Forte</option></select><input type="text" placeholder="Note" value="${set.note ?? ''}" data-set-field="note" data-ex="${exIndex}" data-set="${setIndex}" ${set.locked ? 'disabled' : ''}/></div>`;
}
function renderAddExerciseCard(){
  const card = document.createElement('article'); card.className = 'support-card';
  card.innerHTML = `<button id="addExerciseBtn" class="primary full">+ Ajouter un exercice à la séance</button>`;
  $('exerciseStack').appendChild(card);
}
function renderFinisher(active){
  const items = finishers[active.type] || finishers.Full;
  const card = document.createElement('article'); card.className = 'support-card finisher-card';
  card.innerHTML = `<div class="section-row"><div><p class="eyebrow">Finisher facultatif</p><h3>10 min abdos / gainage / bas du dos</h3></div><button class="mini ${active.finisherDone ? 'done' : ''}" id="finisherToggle">${active.finisherDone ? 'Fait' : 'OK'}</button></div><ul>${items.map(i => `<li>${i}</li>`).join('')}</ul>`;
  $('exerciseStack').appendChild(card);
}
function getCurrentSetIndex(ex){ return ex.sets.findIndex(s => !s.locked); }
function currentSet(ex){ const i = getCurrentSetIndex(ex); return i >= 0 ? ex.sets[i] : null; }

function attachSessionEvents(){
  const active = data.activeSession; if(!active) return;
  document.querySelectorAll('[data-set-field]').forEach(input => {
    input.onchange = input.oninput = () => {
      const exI = Number(input.dataset.ex), setI = Number(input.dataset.set), field = input.dataset.setField;
      const set = data.activeSession.exercises[exI].sets[setI]; if(!set || set.locked) return;
      if(field === 'weight') set.weight = normalizeWeightInput(input.value, set.pullMode, data.activeSession.exercises[exI].name);
      else if(field === 'pullMode') { set.pullMode = input.value; set.weight = normalizeWeightInput(Math.abs(Number(set.weight || 0)), set.pullMode, data.activeSession.exercises[exI].name); }
      else set[field] = input.value;
      saveData(); if(field === 'pullMode') renderSession();
    };
  });
  document.querySelectorAll('[data-unlock-set]').forEach(btn => btn.onclick = () => {
    const [exI,setI] = btn.dataset.unlockSet.split(':').map(Number); const sets = data.activeSession.exercises[exI].sets;
    if(sets[setI].locked){ sets[setI].locked = false; } else if(sets.length > 1){ sets.splice(setI,1); }
    saveData(); renderSession();
  });
  document.querySelectorAll('[data-remove-ex]').forEach(btn => btn.onclick = () => { data.activeSession.exercises.splice(Number(btn.dataset.removeEx),1); saveData(); renderSession(); });
  document.querySelectorAll('[data-add-set]').forEach(btn => btn.onclick = () => addSet(Number(btn.dataset.addSet)));
  document.querySelectorAll('[data-duplicate-ex]').forEach(btn => btn.onclick = () => duplicateExercise(Number(btn.dataset.duplicateEx)));
  document.querySelectorAll('[data-replace-ex]').forEach(btn => btn.onclick = () => openExercisePicker('replace', Number(btn.dataset.replaceEx)));
  document.querySelectorAll('[data-done-set]').forEach(btn => btn.onclick = () => validateCurrentSet(Number(btn.dataset.doneSet)));
  document.querySelectorAll('[data-weight-minus]').forEach(btn => btn.onclick = () => adjustCurrentSet(Number(btn.dataset.weightMinus), 'weight', -2.5));
  document.querySelectorAll('[data-weight-plus]').forEach(btn => btn.onclick = () => adjustCurrentSet(Number(btn.dataset.weightPlus), 'weight', 2.5));
  document.querySelectorAll('[data-rep-minus]').forEach(btn => btn.onclick = () => adjustCurrentSet(Number(btn.dataset.repMinus), 'reps', -1));
  document.querySelectorAll('[data-rep-plus]').forEach(btn => btn.onclick = () => adjustCurrentSet(Number(btn.dataset.repPlus), 'reps', 1));
  const addBtn = $('addExerciseBtn'); if(addBtn) addBtn.onclick = () => openExercisePicker('add', null);
  const warmBtn = $('warmupToggle'); if(warmBtn) warmBtn.onclick = () => { data.activeSession.warmupDone = !data.activeSession.warmupDone; saveData(); renderSession(); };
  const finBtn = $('finisherToggle'); if(finBtn) finBtn.onclick = () => { data.activeSession.finisherDone = !data.activeSession.finisherDone; saveData(); renderSession(); };
}
function normalizeWeightInput(raw, mode, name){
  let n = Number(raw || 0); if(Number.isNaN(n)) n = 0;
  if(/traction/i.test(name) || getExercise(name).special === 'pullup'){
    if(mode === 'assist') return -Math.abs(n);
    if(mode === 'body') return 0;
    return Math.abs(n);
  }
  return Math.max(0, Math.round(n * 2) / 2);
}
function addSet(exIndex){
  const ex = data.activeSession.exercises[exIndex];
  if(currentSet(ex)) { alert('Valide ou supprime d’abord la série en cours.'); return; }
  const prev = ex.sets[ex.sets.length - 1] || defaultSet(ex.name);
  ex.sets.push({ ...prev, locked:false, rpe:'', note:'', pain:'none' });
  saveData(); renderSession();
}
function duplicateExercise(exIndex){
  const ex = data.activeSession.exercises[exIndex];
  data.activeSession.exercises.splice(exIndex + 1, 0, { name: ex.name, sets: [defaultSet(ex.name)] });
  saveData(); renderSession();
}
function validateCurrentSet(exIndex){
  const ex = data.activeSession.exercises[exIndex]; let set = currentSet(ex);
  if(!set){ addSet(exIndex); return; }
  if(Number(set.reps || 0) <= 0){ alert('Ajoute au moins 1 répétition avant de valider.'); return; }
  set.locked = true;
  const rest = getExercise(ex.name).rest || 120;
  saveData(); startTimer(rest); vibrate(); renderSession();
}
function adjustCurrentSet(exIndex, field, delta){
  const ex = data.activeSession.exercises[exIndex]; let set = currentSet(ex);
  if(!set){ addSet(exIndex); return; }
  if(field === 'weight'){
    const abs = Math.abs(Number(set.weight || 0));
    const next = Math.max(0, Math.round((abs + delta) * 2) / 2);
    set.weight = normalizeWeightInput(next, set.pullMode, ex.name);
  } else {
    set.reps = Math.max(0, Math.round(Number(set.reps || 0) + delta));
  }
  saveData(); renderSession();
}
function signedWeightLabel(w){ const n = Number(w || 0); if(n < 0) return `${Math.abs(n)} kg assistance`; if(n > 0) return `+${n} kg lest`; return 'poids du corps'; }

function getLastPerformance(name){
  for(const s of data.sessions || []){
    const ex = (s.exercises || []).find(e => e.name === name);
    if(ex && ex.sets.length){ const best = bestSet(ex.sets.filter(set => Number(set.reps||0)>0) || ex.sets); const w = /traction/i.test(name) ? signedWeightLabel(best.weight || 0) : `${best.weight || 0} kg`; return `dernière fois : ${w} x ${best.reps || 0}`; }
  }
  return 'dernière fois : aucune donnée';
}
function bestSet(sets){
  const valid = sets.length ? sets : [{}];
  return valid.reduce((best, s) => (effectiveLoad(s.weight) * Number(s.reps || 0)) > (effectiveLoad(best.weight) * Number(best.reps || 0)) ? s : best, valid[0] || {});
}
function effectiveLoad(w){ return Number(w || 0); }

function openExercisePicker(mode, exIndex){
  exercisePicker = { mode, exIndex, category: guessCategoryForPicker(exIndex) };
  renderExercisePicker();
  $('exercisePickerModal').classList.remove('hidden');
}
function guessCategoryForPicker(exIndex){
  if(exIndex === null || exIndex === undefined) return 'all';
  return getExercise(data.activeSession.exercises[exIndex].name).category || 'all';
}
function renderExercisePicker(){
  const title = exercisePicker.mode === 'replace' ? 'Remplacer exercice' : 'Ajouter exercice';
  $('pickerTitle').textContent = title;
  const cats = ['all','push','pull','legs','abs','shoulders','warmup','custom'];
  $('pickerCategories').innerHTML = cats.map(c => `<button class="chip ${exercisePicker.category===c?'active':''}" data-picker-cat="${c}">${categoryLabel(c)}</button>`).join('');
  const list = allExercises().filter(e => exercisePicker.category === 'all' || e.category === exercisePicker.category);
  $('pickerList').innerHTML = list.map(e => `<button class="exercise-option" data-pick-ex="${escapeAttr(e.name)}"><span>${e.icon} ${e.name}</span><small>${e.muscle} · repos ${formatRest(e.rest || 120)}</small></button>`).join('');
  document.querySelectorAll('[data-picker-cat]').forEach(b => b.onclick = () => { exercisePicker.category = b.dataset.pickerCat; renderExercisePicker(); });
  document.querySelectorAll('[data-pick-ex]').forEach(b => b.onclick = () => pickExercise(b.dataset.pickEx));
}
function escapeAttr(s){ return String(s).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;'); }
function pickExercise(name){
  if(!data.activeSession) return;
  if(exercisePicker.mode === 'replace' && exercisePicker.exIndex !== null){
    data.activeSession.exercises[exercisePicker.exIndex] = { name, sets: [defaultSet(name)] };
  } else {
    data.activeSession.exercises.push({ name, sets: [defaultSet(name)] });
  }
  saveData(); closePicker(); renderSession();
}
function closePicker(){ $('exercisePickerModal').classList.add('hidden'); }
function createCustomExercise(){
  const name = cleanText($('newExerciseName').value); const category = $('newExerciseCategory').value; if(!name){ alert('Indique le nom de l’exercice ou de la machine.'); return; }
  if(allExercises().some(e => e.name.toLowerCase() === name.toLowerCase())){ alert('Cet exercice existe déjà.'); return; }
  const map = { push:'Push', pull:'Pull', legs:'Jambes', abs:'Abdos', shoulders:'Push', warmup:'Echauffement' };
  const restMap = { push:120, pull:120, legs:150, abs:60, shoulders:90, warmup:30 };
  data.customExercises.push({ name, icon:'🏋️', muscle: map[category] || 'Autre', category, avoid:[], alt:'', rest: restMap[category] || 120 });
  $('newExerciseName').value = ''; saveData(); exercisePicker.category = category; renderExercisePicker();
}
function formatRest(sec){ return `${Math.floor(sec/60)}:${String(sec%60).padStart(2,'0')}`; }

function finishSession(){
  if(!data.activeSession) return;
  const session = { ...data.activeSession, endedAt: todayIso() };
  session.exercises = session.exercises.map(ex => ({ ...ex, sets: ex.sets.filter(set => Number(set.reps || 0) > 0 && set.locked) })).filter(ex => ex.sets.length > 0);
  if(!session.exercises.length){ alert('Aucune série validée à enregistrer.'); return; }
  updateRecords(session); data.sessions.unshift(session); data.activeSession = null; stopTimer(); resetTimer(); saveData(); showSummary(session); showPage('progress');
}
function updateRecords(session){
  session.exercises.forEach(ex => {
    if(!data.records[ex.name]) data.records[ex.name] = { weight: 0, reps: 0 };
    ex.sets.forEach(set => {
      const w = Number(set.weight || 0), r = Number(set.reps || 0);
      if(/traction/i.test(ex.name)){
        if(r > (data.records[ex.name].reps || 0)) data.records[ex.name].reps = r;
        if(w > (data.records[ex.name].weight || 0)) data.records[ex.name].weight = w;
      } else {
        if(w > (data.records[ex.name].weight || 0)) data.records[ex.name].weight = w;
        if(r > (data.records[ex.name].reps || 0)) data.records[ex.name].reps = r;
      }
    });
  });
}
function showSummary(session){
  const stats = sessionStats(session), nutrition = nutritionAdvice(session, stats), next = nextAdvice(session), finisher = session.finisherDone ? 'Finisher fait : bon point pour le gainage et la prévention.' : 'Finisher ignoré : pas grave, garde-le pour les jours où tu as 10 min.';
  $('summaryTitle').textContent = session.title;
  $('summaryContent').innerHTML = `<div class="summary-box"><strong>${stats.sets}</strong> séries validées · <strong>${Math.round(stats.volume)}</strong> kg de volume · RPE moyen <strong>${stats.rpe || '-'}</strong></div><div class="summary-box"><strong>Prise de masse :</strong> ${nutrition}</div><div class="summary-box"><strong>Prochaine fois :</strong> ${next}</div><div class="summary-box"><strong>Gainage :</strong> ${finisher}</div>`;
  $('summaryModal').classList.remove('hidden');
}
function sessionStats(session){
  let sets = 0, volume = 0, rpeSum = 0, rpeCount = 0, pain = 0;
  session.exercises.forEach(ex => ex.sets.forEach(set => {
    const reps = Number(set.reps || 0), weight = Math.max(0, Number(set.weight || 0)), rpe = Number(set.rpe || 0);
    if(reps > 0){ sets++; volume += reps * weight; }
    if(rpe){ rpeSum += rpe; rpeCount++; }
    if(['medium','strong'].includes(set.pain)) pain++;
  }));
  return { sets, volume, rpe: rpeCount ? (rpeSum / rpeCount).toFixed(1) : '', pain };
}
function nutritionAdvice(session, stats){
  if(session.place === 'home' && stats.volume < 3000) return 'si ton repas arrive bientôt, inutile de compliquer. Sinon collation simple : skyr + banane, œufs + pain, ou fromage blanc + flocons.';
  if(session.type === 'Jambes' || session.type === 'Full') return 'priorité vrai repas : protéines + glucides. Exemple : riz/poulet/légumes, pâtes/thon/huile d’olive, omelette/pain/fruit.';
  return 'vise protéines + glucides dans les prochaines heures. Exemple : skyr + banane + flocons, riz + œufs, ou pâtes + poulet.';
}
function nextAdvice(session){
  const stats = sessionStats(session);
  if(stats.pain) return 'douleur signalée : garde la charge, réduis l’amplitude si besoin, ou choisis une alternative.';
  if(Number(stats.rpe || 0) <= 7 && stats.sets >= 12) return 'tu peux tenter une petite progression sur 1 exercice clé : +1 rep ou +2,5 kg.';
  if(Number(stats.rpe || 0) >= 9) return 'RPE élevé : consolide avant d’augmenter. Même charge la prochaine fois.';
  return 'reste régulier. Augmente seulement si la technique reste propre.';
}

function renderProgress(){
  const sessions = data.sessions || [], week = sessions.filter(s => isThisWeek(s.startedAt));
  $('totalSessions').textContent = sessions.length;
  $('weekSets').textContent = week.reduce((sum,s) => sum + sessionStats(s).sets, 0);
  $('weekVolume').textContent = Math.round(week.reduce((sum,s) => sum + sessionStats(s).volume, 0));
  renderMuscleTargets(week); renderWeightTrend(); renderExerciseFilter(); drawProgressChart(); renderRecords();
}
function renderMuscleTargets(week){
  const groups = { Push:0, Pull:0, Jambes:0, Abdos:0 };
  week.forEach(s => s.exercises.forEach(ex => { const muscle = getExercise(ex.name).muscle; if(groups[muscle] !== undefined) groups[muscle] += ex.sets.filter(set => Number(set.reps || 0) > 0).length; }));
  $('muscleTargets').innerHTML = Object.entries(groups).map(([name, count]) => `<div class="target-line"><strong>${name}</strong><div class="bar"><span style="width:${clamp((count/16)*100,0,100)}%"></span></div><span>${count}/16</span></div>`).join('');
}
function renderWeightTrend(){
  const arr = (data.bodyWeights || []).slice(-14);
  if(!arr.length){ $('weightTrend').textContent = 'Ajoute ton poids 1 à 3 fois par semaine. Pour une prise de masse, la tendance compte plus que le chiffre du jour.'; return; }
  const last = arr[arr.length - 1].weight, prev = arr.length >= 2 ? arr[0].weight : last, diff = Math.round((last - prev)*10)/10;
  $('weightTrend').textContent = diff > 0 ? `Tendance récente : +${diff} kg. Si tu progresses à l'entraînement, c'est positif.` : diff < 0 ? `Tendance récente : ${diff} kg. Pour la prise de masse, ajoute une petite collation si ça dure.` : 'Poids stable. Surveille la tendance sur 2 semaines.';
}
function renderExerciseFilter(){
  const select = $('exerciseFilter'); const current = select.value;
  const names = [...new Set((data.sessions || []).flatMap(s => s.exercises.map(e => e.name)))];
  select.innerHTML = '<option value="all">Tous exercices</option>' + names.map(n => `<option value="${n}">${n}</option>`).join('');
  select.value = names.includes(current) ? current : 'all';
}
function drawProgressChart(){
  const canvas = $('progressCanvas'), ctx = canvas.getContext('2d'), dpr = window.devicePixelRatio || 1, width = canvas.clientWidth || 330, height = 180;
  canvas.width = width*dpr; canvas.height = height*dpr; ctx.scale(dpr,dpr); ctx.clearRect(0,0,width,height);
  const metric = $('metricFilter').value, exFilter = $('exerciseFilter').value, pFilter = $('placeFilter').value;
  const points = (data.sessions || []).slice().reverse().filter(s => pFilter === 'all' || s.place === pFilter).map(s => {
    const exs = exFilter === 'all' ? s.exercises : s.exercises.filter(e => e.name === exFilter); let value = 0;
    if(metric === 'volume') value = exs.reduce((sum,e) => sum + e.sets.reduce((a,set) => a + Math.max(0,Number(set.weight||0))*Number(set.reps||0),0),0);
    if(metric === 'sets') value = exs.reduce((sum,e) => sum + e.sets.filter(set => Number(set.reps||0)>0).length,0);
    if(metric === 'bestWeight') value = Math.max(0, ...exs.flatMap(e => e.sets.map(set => Number(set.weight||0))));
    if(metric === 'maxReps') value = Math.max(0, ...exs.flatMap(e => e.sets.map(set => Number(set.reps||0))));
    return { label: formatDate(s.startedAt), value };
  }).filter(p => p.value > 0).slice(-8);
  ctx.fillStyle = '#9fb1ca'; ctx.font = '12px -apple-system';

  // --- NOUVEAU : Gestion des cas 0, 1, ou >=2 points ---
  if (points.length === 0) {
    ctx.fillText('Aucune séance enregistrée pour ce filtre.', 16, 90);
    return;
  }

  if (points.length === 1) {
    // Afficher un graphique en barres pour la dernière séance
    const point = points[0];
    const barWidth = 40;
    const barHeight = Math.min((point.value / Math.max(1, point.value)) * (height - 40), height - 40);
    const barX = width / 2 - barWidth / 2;
    const barY = height - barHeight - 20;

    // Dessiner la barre
    ctx.fillStyle = '#7dd3fc';
    ctx.fillRect(barX, barY, barWidth, barHeight);

    // Afficher la valeur
    let labelText = '';
    if (metric === 'volume') labelText = `Volume: ${Math.round(point.value)} kg`;
    else if (metric === 'sets') labelText = `Séries: ${Math.round(point.value)}`;
    else if (metric === 'bestWeight') labelText = `Poids: ${Math.round(point.value)} kg`;
    else if (metric === 'maxReps') labelText = `Répétitions: ${Math.round(point.value)}`;

    ctx.fillStyle = '#a7f3d0';
    ctx.fillText(labelText, barX - 10, barY - 5);

    // Afficher la date
    ctx.fillStyle = '#9fb1ca';
    ctx.fillText(point.label, barX - 10, height - 10);
    return;
  }

  // --- Cas normal (>=2 points) : Courbe de progression ---
  const max = Math.max(...points.map(p=>p.value)) || 1, min = Math.min(...points.map(p=>p.value)), pad = 24;
  ctx.strokeStyle = 'rgba(255,255,255,.12)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(pad,12); ctx.lineTo(pad,height-pad); ctx.lineTo(width-8,height-pad); ctx.stroke();
  ctx.strokeStyle = '#7dd3fc'; ctx.lineWidth = 3; ctx.beginPath();
  points.forEach((p,i) => { const x = pad + i*((width-pad-16)/(points.length-1)); const y = height-pad-((p.value-min)/Math.max(1,max-min))*(height-pad-20); if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y); }); ctx.stroke();
  points.forEach((p,i) => { const x = pad + i*((width-pad-16)/(points.length-1)); const y = height-pad-((p.value-min)/Math.max(1,max-min))*(height-pad-20); ctx.fillStyle='#a7f3d0'; ctx.beginPath(); ctx.arc(x,y,4,0,Math.PI*2); ctx.fill(); ctx.fillStyle='#9fb1ca'; ctx.fillText(String(Math.round(p.value)), x-8, y-9); });
}
function renderRecords(){
  const entries = Object.entries(data.records || {}).sort((a,b) => a[0].localeCompare(b[0]));
  $('recordsList').innerHTML = entries.map(([name, r]) => `<div class="record-item"><strong>${name}</strong><span>${/traction/i.test(name) ? `${r.reps || '-'} reps · ${signedWeightLabel(r.weight || 0)}` : `${r.weight || '-'} kg · ${r.reps || '-'} reps`}</span></div>`).join('') || '<p class="muted">Aucun record pour le moment.</p>';
}

function renderMore(){
  const challenge = challenges.find(c => c.id === data.activeChallenge) || challenges[0], progress = challengeProgress(challenge);
  $('challengeText').textContent = `${challenge.label} · ${progress.current}/${challenge.target}`;
  $('challengeBar').style.width = `${clamp(progress.current / challenge.target * 100,0,100)}%`;
  $('injurySelect').value = data.injury;
  const labels = { none:'Aucune adaptation active.', shoulders:'Épaules : développé couché, dips et développé militaire peuvent être remplacés.', back:'Dos : attention au rowing barre, soulevé de terre et crunchs.', knees:'Genoux : attention squat, leg press et fentes.' };
  $('injuryText').textContent = labels[data.injury];
}
function challengeProgress(challenge){
  const week = (data.sessions || []).filter(s => isThisWeek(s.startedAt));
  if(challenge.kind === 'sessions') return { current: week.length };
  if(challenge.kind === 'placeSessions') return { current: week.filter(s => s.place === challenge.place).length };
  if(challenge.kind === 'volume') return { current: Math.round(week.reduce((sum,s) => sum + sessionStats(s).volume,0)) };
  if(challenge.kind === 'muscleSets'){ let current = 0; week.forEach(s => s.exercises.forEach(ex => { if(getExercise(ex.name).muscle === challenge.muscle) current += ex.sets.filter(set => Number(set.reps||0)>0).length; })); return { current }; }
  if(challenge.kind === 'exerciseReps'){ let current = 0; week.forEach(s => s.exercises.forEach(ex => { if(ex.name === challenge.exercise) current += ex.sets.reduce((sum,set) => sum + Number(set.reps||0),0); })); return { current }; }
  return { current: 0 };
}

function startTimer(seconds){ stopTimer(); timerSeconds = seconds || timerSeconds || 120; timerLeft = timerSeconds; updateTimerLabel(); timerInterval = setInterval(() => { timerLeft--; updateTimerLabel(); if(timerLeft <= 0){ stopTimer(); vibrate(); } }, 1000); }
function stopTimer(){ if(timerInterval) clearInterval(timerInterval); timerInterval = null; updateTimerLabel(); }
function resetTimer(seconds){ stopTimer(); if(seconds) timerSeconds = seconds; timerLeft = timerSeconds; updateTimerLabel(); }
function updateTimerLabel(){ const m = String(Math.floor(timerLeft/60)).padStart(2,'0'), s = String(timerLeft%60).padStart(2,'0'); $('timerToggle').textContent = `Repos ${m}:${s}`; }
function vibrate(){ if(navigator.vibrate) navigator.vibrate(80); }

function exportCsv(){
  const rows = [['date','lieu','seance','type','exercice','serie','statut','poids','mode_traction','reps','rpe','douleur','note']];
  (data.sessions || []).slice().reverse().forEach(s => s.exercises.forEach(ex => ex.sets.forEach((set,i) => rows.push([formatDateTime(s.startedAt), s.place, s.title, s.type, ex.name, i+1, set.locked?'validee':'non_validee', set.weight||'', set.pullMode||'', set.reps||'', set.rpe||'', set.pain||'', set.note||'']))));
  downloadFile('coach-mass-historique.csv', rows.map(r => r.map(cell => `"${String(cell).replaceAll('"','""')}"`).join(';')).join('\n'), 'text/csv;charset=utf-8');
}
function exportJson(){ downloadFile(`coach-mass-sauvegarde-${new Date().toISOString().slice(0,10)}.json`, JSON.stringify(data,null,2), 'application/json'); }
function downloadFile(name, content, type){ const blob = new Blob([content], {type}); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; a.click(); URL.revokeObjectURL(a.href); }
function importJson(file){ const reader = new FileReader(); reader.onload = () => { try { data = JSON.parse(reader.result); if(!data.customExercises) data.customExercises = []; normalizeActiveSession(data.activeSession || {}); saveData(); renderAll(); alert('Sauvegarde restaurée.'); } catch(e){ alert('Fichier illisible.'); } }; reader.readAsText(file); }

// Evenements principaux
document.querySelectorAll('.nav-btn').forEach(btn => btn.onclick = () => showPage(btn.dataset.page));
document.querySelectorAll('[data-place]').forEach(btn => btn.onclick = () => { document.querySelectorAll('[data-place]').forEach(b => b.classList.remove('active')); btn.classList.add('active'); placeFilter = btn.dataset.place; renderTemplates(); });
$('resumeBtn').onclick = () => showPage('session');
$('finishBtn').onclick = finishSession;
$('timerToggle').onclick = () => timerInterval ? stopTimer() : startTimer(timerSeconds);
$('timerReset').onclick = () => resetTimer();
$('timerMinus').onclick = () => { timerSeconds = Math.max(30, timerSeconds - 15); timerLeft = timerSeconds; updateTimerLabel(); };
$('saveWeightBtn').onclick = () => { const w = Number($('bodyWeightInput').value); if(w){ data.bodyWeights.push({ date: todayIso(), weight: w }); $('bodyWeightInput').value = ''; saveData(); renderProgress(); } };
['metricFilter','exerciseFilter','placeFilter'].forEach(id => $(id).onchange = drawProgressChart);
$('exportCsvBtn').onclick = exportCsv; $('exportCsvBtn2').onclick = exportCsv; $('exportJsonBtn').onclick = exportJson;
$('importJsonInput').onchange = e => { if(e.target.files[0]) importJson(e.target.files[0]); };
$('clearDataBtn').onclick = () => { if(confirm('Tout effacer sur cet appareil ?')){ localStorage.removeItem(STORAGE_KEY); data = loadData(); renderAll(); showPage('training'); } };
$('newChallengeBtn').onclick = () => { const index = challenges.findIndex(c => c.id === data.activeChallenge); data.activeChallenge = challenges[(index + 1) % challenges.length].id; saveData(); renderMore(); };
$('injurySelect').onchange = e => { data.injury = e.target.value; saveData(); renderMore(); };
$('closeSummaryBtn').onclick = () => $('summaryModal').classList.add('hidden');
$('closePreviewBtn').onclick = closeTemplatePreview;
$('previewStartBtn').onclick = () => { if(previewTemplateId){ const id = previewTemplateId; closeTemplatePreview(); startSession(id); } };
$('closePickerBtn').onclick = closePicker;
$('createExerciseBtn').onclick = createCustomExercise;

if('serviceWorker' in navigator){ window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {})); }
renderAll();
