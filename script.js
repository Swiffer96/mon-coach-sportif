// Coach Mass V5 - app simple, mobile-first, sans backend
// Donnees stockees uniquement dans le navigateur avec localStorage

const STORAGE_KEY = 'coachMassV5Data';

const exercises = {
  push: [
    { name: 'Developpe couche', icon: '💪', muscle: 'Push', avoid: ['shoulders'], alt: 'Peck Deck' },
    { name: 'Developpe incline', icon: '💪', muscle: 'Push', avoid: ['shoulders'], alt: 'Pompes inclinees' },
    { name: 'Peck Deck', icon: '🦋', muscle: 'Push', avoid: [], alt: '' },
    { name: 'Pompes', icon: '🔥', muscle: 'Push', avoid: ['shoulders'], alt: 'Peck Deck' },
    { name: 'Dips', icon: '🔥', muscle: 'Push', avoid: ['shoulders'], alt: 'Pompes inclinees' },
    { name: 'Ecarte halteres', icon: '🦋', muscle: 'Push', avoid: ['shoulders'], alt: 'Peck Deck' }
  ],
  pull: [
    { name: 'Tractions', icon: '🧗', muscle: 'Pull', avoid: [], alt: '' },
    { name: 'Rowing barre', icon: '🚣', muscle: 'Pull', avoid: ['back'], alt: 'Tirage horizontal' },
    { name: 'Tirage horizontal', icon: '🚣', muscle: 'Pull', avoid: [], alt: '' },
    { name: 'Curl biceps', icon: '💪', muscle: 'Pull', avoid: [], alt: '' },
    { name: 'Shrugs', icon: '🏋️', muscle: 'Pull', avoid: [], alt: '' },
    { name: 'Face pull', icon: '🎯', muscle: 'Pull', avoid: [], alt: '' }
  ],
  legs: [
    { name: 'Squat', icon: '🏋️', muscle: 'Jambes', avoid: ['knees', 'back'], alt: 'Leg Press' },
    { name: 'Leg Press', icon: '🦵', muscle: 'Jambes', avoid: ['knees'], alt: 'Leg Curl' },
    { name: 'Fentes marchees', icon: '🚶', muscle: 'Jambes', avoid: ['knees'], alt: 'Leg Press' },
    { name: 'Souleve de terre', icon: '🏋️', muscle: 'Jambes', avoid: ['back'], alt: 'Leg Curl' },
    { name: 'Souleve de terre roumain', icon: '🏋️', muscle: 'Jambes', avoid: ['back'], alt: 'Leg Curl' },
    { name: 'Leg Curl', icon: '🦵', muscle: 'Jambes', avoid: [], alt: '' },
    { name: 'Mollets', icon: '🦵', muscle: 'Jambes', avoid: [], alt: '' }
  ],
  abs: [
    { name: 'Crunchs', icon: '🔥', muscle: 'Abdos', avoid: ['back'], alt: 'Gainage' },
    { name: 'Gainage', icon: '🧱', muscle: 'Abdos', avoid: [], alt: '' },
    { name: 'Releves de jambes', icon: '🔥', muscle: 'Abdos', avoid: ['back'], alt: 'Planche' },
    { name: 'Planche', icon: '🧱', muscle: 'Abdos', avoid: [], alt: '' }
  ],
  shoulders: [
    { name: 'Elevations laterales', icon: '🪽', muscle: 'Push', avoid: ['shoulders'], alt: 'Face pull' },
    { name: 'Developpe militaire', icon: '🏋️', muscle: 'Push', avoid: ['shoulders'], alt: 'Face pull' },
    { name: 'Rotateurs externes', icon: '🛡️', muscle: 'Push', avoid: [], alt: '' }
  ]
};

const allExercises = Object.values(exercises).flat();

const templates = [
  { id: 'home-push', place: 'home', type: 'Push', duration: '25 min', title: 'Maison Push express', focus: 'Pompes, pecs, epaules prudentes', list: ['Pompes', 'Peck Deck', 'Elevations laterales', 'Rotateurs externes', 'Gainage'] },
  { id: 'home-pull', place: 'home', type: 'Pull', duration: '25 min', title: 'Maison Pull elastique', focus: 'Dos et biceps leger', list: ['Tirage horizontal', 'Face pull', 'Curl biceps', 'Shrugs', 'Planche'] },
  { id: 'home-legs', place: 'home', type: 'Jambes', duration: '30 min', title: 'Maison jambes', focus: 'Jambes sans machine', list: ['Squat', 'Fentes marchees', 'Souleve de terre roumain', 'Mollets', 'Gainage'] },
  { id: 'home-full', place: 'home', type: 'Full', duration: '30 min', title: 'Maison full body', focus: 'Efficace quand tu as peu de temps', list: ['Squat', 'Pompes', 'Tirage horizontal', 'Curl biceps', 'Planche'] },
  { id: 'gym-push', place: 'gym', type: 'Push', duration: '1h', title: 'Salle Push force', focus: 'Pecs, triceps, epaules', list: ['Developpe couche', 'Developpe incline', 'Peck Deck', 'Dips', 'Elevations laterales'] },
  { id: 'gym-pull', place: 'gym', type: 'Pull', duration: '1h', title: 'Salle Pull dos', focus: 'Dos epais, tractions, biceps', list: ['Tractions', 'Rowing barre', 'Tirage horizontal', 'Curl biceps', 'Face pull'] },
  { id: 'gym-legs', place: 'gym', type: 'Jambes', duration: '1h', title: 'Salle jambes squat', focus: 'Quadriceps, ischios, mollets', list: ['Squat', 'Leg Press', 'Fentes marchees', 'Leg Curl', 'Mollets'] },
  { id: 'gym-chain', place: 'gym', type: 'Jambes', duration: '1h', title: 'Salle chaine arriere', focus: 'Ischios, fessiers, dos prudent', list: ['Souleve de terre', 'Souleve de terre roumain', 'Leg Curl', 'Mollets', 'Gainage'] },
  { id: 'gym-upper', place: 'gym', type: 'Haut', duration: '1h', title: 'Salle haut du corps', focus: 'Push + Pull equilibre', list: ['Developpe incline', 'Tractions', 'Peck Deck', 'Rowing barre', 'Curl biceps'] },
  { id: 'gym-full', place: 'gym', type: 'Full', duration: '1h', title: 'Salle full body', focus: 'Progression globale', list: ['Squat', 'Developpe couche', 'Tractions', 'Leg Press', 'Peck Deck'] }
];

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
let timerSeconds = 90;
let timerLeft = 90;
let timerInterval = null;

function loadData(){
  const saved = localStorage.getItem(STORAGE_KEY);
  if(saved){
    try { return JSON.parse(saved); } catch(e) { console.warn('Sauvegarde illisible', e); }
  }
  return {
    sessions: [],
    records: initialRecords,
    activeSession: null,
    injury: 'none',
    bodyWeights: [],
    activeChallenge: 'regularity3'
  };
}

function saveData(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
function $(id){ return document.getElementById(id); }
function todayIso(){ return new Date().toISOString(); }
function formatDate(d){ return new Date(d).toLocaleDateString('fr-FR', { day:'2-digit', month:'2-digit' }); }
function formatDateTime(d){ return new Date(d).toLocaleString('fr-FR', { day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit' }); }
function getExercise(name){ return allExercises.find(e => e.name === name) || { name, icon: '🏋️', muscle: 'Autre', avoid: [], alt: '' }; }
function clamp(n, min, max){ return Math.max(min, Math.min(max, n)); }
function weekStart(){ const d = new Date(); const day = (d.getDay() + 6) % 7; d.setHours(0,0,0,0); d.setDate(d.getDate() - day); return d; }
function isThisWeek(date){ return new Date(date) >= weekStart(); }

function showPage(next){
  page = next;
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  $(next).classList.add('active');
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.toggle('active', b.dataset.page === next));
  renderAll();
}

function renderAll(){
  renderTemplates();
  renderSession();
  renderProgress();
  renderMore();
  $('resumeBtn').classList.toggle('hidden', !data.activeSession);
}

function renderTemplates(){
  const list = $('templates');
  list.innerHTML = '';
  const recent = data.sessions[0];
  $('recommendationTitle').textContent = recent ? suggestNextTitle(recent) : 'Choisis ta séance';
  $('recommendationText').textContent = recent ? 'Tu gardes le choix. La proposition sert juste a eviter de refaire toujours le meme groupe.' : 'Maison 20-30 min ou salle 1h. Objectif : progresser sans alourdir la navigation.';

  templates.filter(t => placeFilter === 'all' || t.place === placeFilter).forEach(t => {
    const card = document.createElement('article');
    card.className = 'template-card';
    card.innerHTML = `
      <div class="row">
        <div>
          <h3>${t.place === 'home' ? '🏠' : '🏋️'} ${t.title}</h3>
          <p class="muted">${t.focus}</p>
        </div>
        <span class="tag">${t.duration}</span>
      </div>
      <div class="start-row">
        <span class="muted">${t.type} · ${t.list.length} exercices</span>
        <button class="primary mini" data-start="${t.id}">Lancer</button>
      </div>`;
    list.appendChild(card);
  });

  document.querySelectorAll('[data-start]').forEach(btn => btn.onclick = () => startSession(btn.dataset.start));
}

function suggestNextTitle(last){
  if(last.type === 'Push') return 'Suggestion : Pull ou jambes';
  if(last.type === 'Pull') return 'Suggestion : Jambes ou Push';
  if(last.type === 'Jambes') return 'Suggestion : Push ou Pull';
  return 'Suggestion : séance au choix';
}

function startSession(templateId){
  const tpl = templates.find(t => t.id === templateId);
  if(!tpl) return;
  const startedAt = todayIso();
  const list = tpl.list.map(name => applyInjurySubstitution(name)).map(name => ({
    name,
    sets: [{ weight: lastWeight(name), reps: lastReps(name) || 8, rpe: '', note: '', pain: 'none' }]
  }));
  data.activeSession = { id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()), templateId, title: tpl.title, place: tpl.place, type: tpl.type, startedAt, exercises: list };
  saveData();
  resetTimer();
  showPage('session');
}

function applyInjurySubstitution(name){
  if(data.injury === 'none') return name;
  const ex = getExercise(name);
  if(ex.avoid && ex.avoid.includes(data.injury) && ex.alt) return ex.alt;
  return name;
}

function lastWeight(name){
  for(const s of data.sessions){
    const ex = s.exercises.find(e => e.name === name);
    if(ex){
      const valid = ex.sets.map(set => Number(set.weight || 0)).filter(Boolean);
      if(valid.length) return valid[valid.length - 1];
    }
  }
  return data.records[name]?.weight || '';
}
function lastReps(name){
  for(const s of data.sessions){
    const ex = s.exercises.find(e => e.name === name);
    if(ex){
      const valid = ex.sets.map(set => Number(set.reps || 0)).filter(Boolean);
      if(valid.length) return valid[valid.length - 1];
    }
  }
  return data.records[name]?.reps || '';
}

function renderSession(){
  const active = data.activeSession;
  $('timerBar').classList.toggle('hidden', !active);
  $('finishBtn').classList.toggle('hidden', !active);
  if(!active){
    $('sessionBadge').textContent = 'Aucune séance';
    $('sessionTitle').textContent = 'Lance une séance';
    $('sessionMeta').textContent = 'Va dans Entraînement pour choisir une séance.';
    $('exerciseStack').className = 'exercise-stack empty-state';
    $('exerciseStack').innerHTML = '<p>Aucune séance active. Va dans <strong>Entraînement</strong> pour choisir une séance.</p>';
    return;
  }
  $('sessionBadge').textContent = `${active.place === 'home' ? 'Maison' : 'Salle'} · ${active.type}`;
  $('sessionTitle').textContent = active.title;
  $('sessionMeta').textContent = `Début : ${formatDateTime(active.startedAt)} · Objectif prise de masse`;
  $('exerciseStack').className = 'exercise-stack';
  $('exerciseStack').innerHTML = '';

  active.exercises.forEach((ex, exIndex) => {
    const info = getExercise(ex.name);
    const rec = data.records[ex.name];
    const last = getLastPerformance(ex.name);
    const card = document.createElement('article');
    card.className = 'exercise-card';
    card.innerHTML = `
      <div class="exercise-top">
        <div>
          <div class="exercise-title"><strong>${info.icon}</strong><h3>${ex.name}</h3></div>
          <div class="record">${rec ? `record discret : ${rec.weight || '-'} kg · ${rec.reps || '-'} reps` : 'record discret : a creer'}</div>
          <div class="last-perf">${last}</div>
        </div>
        <button class="ghost-small" data-remove-ex="${exIndex}">Suppr.</button>
      </div>
      <div class="set-list">
        ${ex.sets.map((set, setIndex) => renderSetRow(exIndex, setIndex, set)).join('')}
      </div>
      <div class="set-actions">
        <button data-weight-minus="${exIndex}">-2,5 kg</button>
        <button data-weight-plus="${exIndex}">+2,5 kg</button>
        <button data-rep-minus="${exIndex}">-1 rep</button>
        <button data-rep-plus="${exIndex}">+1 rep</button>
      </div>
      <div class="set-actions">
        <button data-add-set="${exIndex}">+ Série</button>
        <button data-copy-set="${exIndex}">Copier</button>
        <button data-replace-ex="${exIndex}">Remplacer</button>
        <button data-done-set="${exIndex}">Valider</button>
      </div>
      <details class="details">
        <summary>Détails : RPE, note, douleur</summary>
        <div class="details-body" data-details="${exIndex}"></div>
      </details>`;
    $('exerciseStack').appendChild(card);
    renderDetails(exIndex);
  });
  attachSessionEvents();
}

function renderSetRow(exIndex, setIndex, set){
  return `<div class="set-row">
    <input type="number" step="0.5" inputmode="decimal" value="${set.weight ?? ''}" data-set-field="weight" data-ex="${exIndex}" data-set="${setIndex}" aria-label="Poids" />
    <input type="number" step="1" inputmode="numeric" value="${set.reps ?? ''}" data-set-field="reps" data-ex="${exIndex}" data-set="${setIndex}" aria-label="Repetitions" />
    <button class="ghost-small" data-remove-set="${exIndex}:${setIndex}">×</button>
  </div>`;
}

function renderDetails(exIndex){
  const container = document.querySelector(`[data-details="${exIndex}"]`);
  if(!container) return;
  const ex = data.activeSession.exercises[exIndex];
  container.innerHTML = ex.sets.map((set, setIndex) => `
    <div class="set-row">
      <input type="number" min="1" max="10" placeholder="RPE" value="${set.rpe ?? ''}" data-set-field="rpe" data-ex="${exIndex}" data-set="${setIndex}" />
      <select data-set-field="pain" data-ex="${exIndex}" data-set="${setIndex}">
        <option value="none" ${set.pain === 'none' ? 'selected' : ''}>Douleur non</option>
        <option value="light" ${set.pain === 'light' ? 'selected' : ''}>Légère</option>
        <option value="medium" ${set.pain === 'medium' ? 'selected' : ''}>Moyenne</option>
        <option value="strong" ${set.pain === 'strong' ? 'selected' : ''}>Forte</option>
      </select>
      <input type="text" placeholder="Note" value="${set.note ?? ''}" data-set-field="note" data-ex="${exIndex}" data-set="${setIndex}" />
    </div>`).join('');
}

function attachSessionEvents(){
  document.querySelectorAll('[data-set-field]').forEach(input => {
    input.onchange = input.oninput = () => {
      const ex = Number(input.dataset.ex);
      const set = Number(input.dataset.set);
      const field = input.dataset.setField;
      data.activeSession.exercises[ex].sets[set][field] = input.value;
      saveData();
    };
  });
  document.querySelectorAll('[data-remove-set]').forEach(btn => btn.onclick = () => {
    const [ex, set] = btn.dataset.removeSet.split(':').map(Number);
    if(data.activeSession.exercises[ex].sets.length > 1) data.activeSession.exercises[ex].sets.splice(set,1);
    saveData(); renderSession();
  });
  document.querySelectorAll('[data-remove-ex]').forEach(btn => btn.onclick = () => {
    data.activeSession.exercises.splice(Number(btn.dataset.removeEx),1); saveData(); renderSession();
  });
  document.querySelectorAll('[data-add-set]').forEach(btn => btn.onclick = () => addSet(Number(btn.dataset.addSet), false));
  document.querySelectorAll('[data-copy-set]').forEach(btn => btn.onclick = () => addSet(Number(btn.dataset.copySet), true));
  document.querySelectorAll('[data-replace-ex]').forEach(btn => btn.onclick = () => replaceExercise(Number(btn.dataset.replaceEx)));
  document.querySelectorAll('[data-done-set]').forEach(btn => btn.onclick = () => { startTimer(); vibrate(); });
  document.querySelectorAll('[data-weight-minus]').forEach(btn => btn.onclick = () => adjustLastSet(Number(btn.dataset.weightMinus), 'weight', -2.5));
  document.querySelectorAll('[data-weight-plus]').forEach(btn => btn.onclick = () => adjustLastSet(Number(btn.dataset.weightPlus), 'weight', 2.5));
  document.querySelectorAll('[data-rep-minus]').forEach(btn => btn.onclick = () => adjustLastSet(Number(btn.dataset.repMinus), 'reps', -1));
  document.querySelectorAll('[data-rep-plus]').forEach(btn => btn.onclick = () => adjustLastSet(Number(btn.dataset.repPlus), 'reps', 1));
}

function addSet(exIndex, copy){
  const sets = data.activeSession.exercises[exIndex].sets;
  const base = copy ? { ...sets[sets.length - 1] } : { weight: sets[sets.length - 1]?.weight || '', reps: sets[sets.length - 1]?.reps || 8, rpe: '', note: '', pain: 'none' };
  sets.push(base); saveData(); renderSession();
}
function adjustLastSet(exIndex, field, delta){
  const sets = data.activeSession.exercises[exIndex].sets;
  const last = sets[sets.length - 1];
  const value = Number(last[field] || 0) + delta;
  last[field] = field === 'reps' ? Math.max(0, Math.round(value)) : Math.max(0, Math.round(value * 2) / 2);
  saveData(); renderSession();
}
function replaceExercise(exIndex){
  const current = data.activeSession.exercises[exIndex];
  const muscle = getExercise(current.name).muscle;
  const options = allExercises.filter(e => e.muscle === muscle || muscle === 'Autre').map(e => e.name);
  const choice = prompt(`Remplacer par :\n${options.join('\n')}`);
  if(choice && options.includes(choice)){
    current.name = choice; saveData(); renderSession();
  }
}
function getLastPerformance(name){
  for(const s of data.sessions){
    const ex = s.exercises.find(e => e.name === name);
    if(ex && ex.sets.length){
      const best = bestSet(ex.sets);
      return `dernière fois : ${best.weight || 0} kg x ${best.reps || 0}`;
    }
  }
  return 'dernière fois : aucune donnée';
}
function bestSet(sets){
  return sets.reduce((best, s) => (Number(s.weight || 0) * Number(s.reps || 0)) > (Number(best.weight || 0) * Number(best.reps || 0)) ? s : best, sets[0] || {});
}
function finishSession(){
  if(!data.activeSession) return;
  const session = { ...data.activeSession, endedAt: todayIso() };
  session.exercises = session.exercises.filter(ex => ex.sets.some(set => Number(set.reps || 0) > 0));
  updateRecords(session);
  data.sessions.unshift(session);
  data.activeSession = null;
  stopTimer(); resetTimer(); saveData();
  showSummary(session);
  showPage('progress');
}
function updateRecords(session){
  session.exercises.forEach(ex => {
    if(!data.records[ex.name]) data.records[ex.name] = { weight: 0, reps: 0 };
    ex.sets.forEach(set => {
      const w = Number(set.weight || 0), r = Number(set.reps || 0);
      if(w > data.records[ex.name].weight) data.records[ex.name].weight = w;
      if(r > data.records[ex.name].reps) data.records[ex.name].reps = r;
    });
  });
}
function showSummary(session){
  const stats = sessionStats(session);
  const nutrition = nutritionAdvice(session, stats);
  const next = nextAdvice(session);
  $('summaryTitle').textContent = session.title;
  $('summaryContent').innerHTML = `
    <div class="summary-box"><strong>${stats.sets}</strong> séries · <strong>${Math.round(stats.volume)}</strong> kg de volume · RPE moyen <strong>${stats.rpe || '-'}</strong></div>
    <div class="summary-box"><strong>Prise de masse :</strong> ${nutrition}</div>
    <div class="summary-box"><strong>Prochaine fois :</strong> ${next}</div>`;
  $('summaryModal').classList.remove('hidden');
}
function sessionStats(session){
  let sets = 0, volume = 0, rpeSum = 0, rpeCount = 0, pain = 0;
  session.exercises.forEach(ex => ex.sets.forEach(set => {
    const reps = Number(set.reps || 0), weight = Number(set.weight || 0), rpe = Number(set.rpe || 0);
    if(reps > 0){ sets++; volume += reps * weight; }
    if(rpe){ rpeSum += rpe; rpeCount++; }
    if(['medium','strong'].includes(set.pain)) pain++;
  }));
  return { sets, volume, rpe: rpeCount ? (rpeSum / rpeCount).toFixed(1) : '', pain };
}
function nutritionAdvice(session, stats){
  if(session.place === 'home' && stats.volume < 3000) return 'si ton repas arrive bientôt, inutile de compliquer. Sinon collation simple : skyr + banane, oeufs + pain, ou fromage blanc + flocons.';
  if(session.type === 'Jambes' || session.type === 'Full') return 'priorité vrai repas : protéines + glucides. Exemple : riz/poulet/légumes, pâtes/thon/huile d’olive, omelette/pain/fruit.';
  return 'vise protéines + glucides dans les prochaines heures. Exemple : skyr + banane + flocons, riz + oeufs, ou pâtes + poulet.';
}
function nextAdvice(session){
  const stats = sessionStats(session);
  if(stats.pain) return 'douleur signalée : garde la charge, réduis l’amplitude si besoin, ou choisis une alternative.';
  if(Number(stats.rpe || 0) <= 7 && stats.sets >= 12) return 'tu peux tenter une petite progression sur 1 exercice clé : +1 rep ou +2,5 kg.';
  if(Number(stats.rpe || 0) >= 9) return 'RPE élevé : consolide avant d’augmenter. Même charge la prochaine fois.';
  return 'reste régulier. Augmente seulement si la technique reste propre.';
}

function renderProgress(){
  const sessions = data.sessions;
  const week = sessions.filter(s => isThisWeek(s.startedAt));
  $('totalSessions').textContent = sessions.length;
  $('weekSets').textContent = week.reduce((sum,s) => sum + sessionStats(s).sets, 0);
  $('weekVolume').textContent = Math.round(week.reduce((sum,s) => sum + sessionStats(s).volume, 0));
  renderMuscleTargets(week);
  renderWeightTrend();
  renderExerciseFilter();
  drawProgressChart();
  renderRecords();
}
function renderMuscleTargets(week){
  const groups = { Push:0, Pull:0, Jambes:0, Abdos:0 };
  week.forEach(s => s.exercises.forEach(ex => {
    const muscle = getExercise(ex.name).muscle;
    if(groups[muscle] !== undefined) groups[muscle] += ex.sets.filter(set => Number(set.reps || 0) > 0).length;
  }));
  $('muscleTargets').innerHTML = Object.entries(groups).map(([name, count]) => {
    const pct = clamp((count / 16) * 100, 0, 100);
    return `<div class="target-line"><strong>${name}</strong><div class="bar"><span style="width:${pct}%"></span></div><span>${count}/16</span></div>`;
  }).join('');
}
function renderWeightTrend(){
  const arr = data.bodyWeights.slice(-14);
  if(!arr.length){ $('weightTrend').textContent = 'Ajoute ton poids 1 à 3 fois par semaine. Pour une prise de masse, la tendance compte plus que le chiffre du jour.'; return; }
  const last = arr[arr.length - 1].weight;
  const prev = arr.length >= 2 ? arr[0].weight : last;
  const diff = Math.round((last - prev) * 10) / 10;
  $('weightTrend').textContent = diff > 0 ? `Tendance récente : +${diff} kg. Si tu progresses à l'entraînement, c'est positif.` : diff < 0 ? `Tendance récente : ${diff} kg. Pour la prise de masse, ajoute une petite collation si ça dure.` : 'Poids stable. Surveille la tendance sur 2 semaines.';
}
function renderExerciseFilter(){
  const select = $('exerciseFilter');
  const current = select.value;
  const names = [...new Set(data.sessions.flatMap(s => s.exercises.map(e => e.name)))];
  select.innerHTML = '<option value="all">Tous exercices</option>' + names.map(n => `<option value="${n}">${n}</option>`).join('');
  select.value = names.includes(current) ? current : 'all';
}
function drawProgressChart(){
  const canvas = $('progressCanvas');
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const width = canvas.clientWidth || 330, height = 180;
  canvas.width = width * dpr; canvas.height = height * dpr; ctx.scale(dpr,dpr);
  ctx.clearRect(0,0,width,height);
  const metric = $('metricFilter').value, exFilter = $('exerciseFilter').value, pFilter = $('placeFilter').value;
  const points = data.sessions.slice().reverse().filter(s => pFilter === 'all' || s.place === pFilter).map(s => {
    const exs = exFilter === 'all' ? s.exercises : s.exercises.filter(e => e.name === exFilter);
    let value = 0;
    if(metric === 'volume') value = exs.reduce((sum,e) => sum + e.sets.reduce((a,set) => a + Number(set.weight||0)*Number(set.reps||0),0),0);
    if(metric === 'sets') value = exs.reduce((sum,e) => sum + e.sets.filter(set => Number(set.reps||0)>0).length,0);
    if(metric === 'bestWeight') value = Math.max(0, ...exs.flatMap(e => e.sets.map(set => Number(set.weight||0))));
    if(metric === 'maxReps') value = Math.max(0, ...exs.flatMap(e => e.sets.map(set => Number(set.reps||0))));
    return { label: formatDate(s.startedAt), value };
  }).filter(p => p.value > 0).slice(-8);
  ctx.fillStyle = '#9fb1ca'; ctx.font = '12px -apple-system';
  if(points.length < 2){ ctx.fillText('Pas encore assez de données pour ce filtre.', 16, 90); return; }
  const max = Math.max(...points.map(p=>p.value)) || 1;
  const min = Math.min(...points.map(p=>p.value));
  const pad = 24;
  ctx.strokeStyle = 'rgba(255,255,255,.12)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(pad, 12); ctx.lineTo(pad, height-pad); ctx.lineTo(width-8, height-pad); ctx.stroke();
  ctx.strokeStyle = '#7dd3fc'; ctx.lineWidth = 3; ctx.beginPath();
  points.forEach((p,i) => {
    const x = pad + i * ((width - pad - 16) / (points.length - 1));
    const y = height - pad - ((p.value - min) / Math.max(1, max - min)) * (height - pad - 20);
    if(i === 0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  });
  ctx.stroke();
  points.forEach((p,i) => {
    const x = pad + i * ((width - pad - 16) / (points.length - 1));
    const y = height - pad - ((p.value - min) / Math.max(1, max - min)) * (height - pad - 20);
    ctx.fillStyle = '#a7f3d0'; ctx.beginPath(); ctx.arc(x,y,4,0,Math.PI*2); ctx.fill();
    ctx.fillStyle = '#9fb1ca'; ctx.fillText(String(Math.round(p.value)), x-8, y-9);
  });
}
function renderRecords(){
  const entries = Object.entries(data.records).sort((a,b) => a[0].localeCompare(b[0]));
  $('recordsList').innerHTML = entries.map(([name, r]) => `<div class="record-item"><strong>${name}</strong><span>${r.weight || '-'} kg · ${r.reps || '-'} reps</span></div>`).join('') || '<p class="muted">Aucun record pour le moment.</p>';
}

function renderMore(){
  const challenge = challenges.find(c => c.id === data.activeChallenge) || challenges[0];
  const progress = challengeProgress(challenge);
  $('challengeText').textContent = `${challenge.label} · ${progress.current}/${challenge.target}`;
  $('challengeBar').style.width = `${clamp(progress.current / challenge.target * 100,0,100)}%`;
  $('injurySelect').value = data.injury;
  const labels = { none:'Aucune adaptation active.', shoulders:'Épaules : développé couché, dips et développé militaire peuvent être remplacés.', back:'Dos : attention au rowing barre, soulevé de terre et crunchs.', knees:'Genoux : attention squat, leg press et fentes.' };
  $('injuryText').textContent = labels[data.injury];
}
function challengeProgress(challenge){
  const week = data.sessions.filter(s => isThisWeek(s.startedAt));
  if(challenge.kind === 'sessions') return { current: week.length };
  if(challenge.kind === 'placeSessions') return { current: week.filter(s => s.place === challenge.place).length };
  if(challenge.kind === 'volume') return { current: Math.round(week.reduce((sum,s) => sum + sessionStats(s).volume,0)) };
  if(challenge.kind === 'muscleSets'){
    let current = 0; week.forEach(s => s.exercises.forEach(ex => { if(getExercise(ex.name).muscle === challenge.muscle) current += ex.sets.filter(set => Number(set.reps||0)>0).length; }));
    return { current };
  }
  if(challenge.kind === 'exerciseReps'){
    let current = 0; week.forEach(s => s.exercises.forEach(ex => { if(ex.name === challenge.exercise) current += ex.sets.reduce((sum,set) => sum + Number(set.reps||0),0); }));
    return { current };
  }
  return { current: 0 };
}

function startTimer(){ stopTimer(); timerLeft = timerSeconds; updateTimerLabel(); timerInterval = setInterval(() => { timerLeft--; updateTimerLabel(); if(timerLeft <= 0){ stopTimer(); vibrate(); } }, 1000); }
function stopTimer(){ if(timerInterval) clearInterval(timerInterval); timerInterval = null; updateTimerLabel(); }
function resetTimer(){ stopTimer(); timerLeft = timerSeconds; updateTimerLabel(); }
function updateTimerLabel(){ const m = String(Math.floor(timerLeft/60)).padStart(2,'0'), s = String(timerLeft%60).padStart(2,'0'); $('timerToggle').textContent = timerInterval ? `Repos ${m}:${s}` : `Repos ${m}:${s}`; }
function vibrate(){ if(navigator.vibrate) navigator.vibrate(80); }

function exportCsv(){
  const rows = [['date','lieu','seance','type','exercice','serie','poids','reps','rpe','douleur','note']];
  data.sessions.slice().reverse().forEach(s => s.exercises.forEach(ex => ex.sets.forEach((set,i) => rows.push([formatDateTime(s.startedAt), s.place, s.title, s.type, ex.name, i+1, set.weight||'', set.reps||'', set.rpe||'', set.pain||'', set.note||'']))));
  downloadFile('coach-mass-historique.csv', rows.map(r => r.map(cell => `"${String(cell).replaceAll('"','""')}"`).join(';')).join('\n'), 'text/csv;charset=utf-8');
}
function exportJson(){ downloadFile(`coach-mass-sauvegarde-${new Date().toISOString().slice(0,10)}.json`, JSON.stringify(data,null,2), 'application/json'); }
function downloadFile(name, content, type){ const blob = new Blob([content], {type}); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; a.click(); URL.revokeObjectURL(a.href); }
function importJson(file){
  const reader = new FileReader();
  reader.onload = () => { try { data = JSON.parse(reader.result); saveData(); renderAll(); alert('Sauvegarde restauree.'); } catch(e){ alert('Fichier illisible.'); } };
  reader.readAsText(file);
}

// Evenements principaux
document.querySelectorAll('.nav-btn').forEach(btn => btn.onclick = () => showPage(btn.dataset.page));
document.querySelectorAll('[data-place]').forEach(btn => btn.onclick = () => { document.querySelectorAll('[data-place]').forEach(b => b.classList.remove('active')); btn.classList.add('active'); placeFilter = btn.dataset.place; renderTemplates(); });
$('resumeBtn').onclick = () => showPage('session');
$('finishBtn').onclick = finishSession;
$('timerToggle').onclick = () => timerInterval ? stopTimer() : startTimer();
$('timerReset').onclick = resetTimer;
$('timerMinus').onclick = () => { timerSeconds = Math.max(30, timerSeconds - 15); timerLeft = timerSeconds; updateTimerLabel(); };
$('saveWeightBtn').onclick = () => { const w = Number($('bodyWeightInput').value); if(w){ data.bodyWeights.push({ date: todayIso(), weight: w }); $('bodyWeightInput').value = ''; saveData(); renderProgress(); } };
['metricFilter','exerciseFilter','placeFilter'].forEach(id => $(id).onchange = drawProgressChart);
$('exportCsvBtn').onclick = exportCsv; $('exportCsvBtn2').onclick = exportCsv; $('exportJsonBtn').onclick = exportJson;
$('importJsonInput').onchange = e => { if(e.target.files[0]) importJson(e.target.files[0]); };
$('clearDataBtn').onclick = () => { if(confirm('Tout effacer sur cet appareil ?')){ localStorage.removeItem(STORAGE_KEY); data = loadData(); renderAll(); showPage('training'); } };
$('newChallengeBtn').onclick = () => { const index = challenges.findIndex(c => c.id === data.activeChallenge); data.activeChallenge = challenges[(index + 1) % challenges.length].id; saveData(); renderMore(); };
$('injurySelect').onchange = e => { data.injury = e.target.value; saveData(); renderMore(); };
$('closeSummaryBtn').onclick = () => $('summaryModal').classList.add('hidden');

if('serviceWorker' in navigator){ window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {})); }
renderAll();
