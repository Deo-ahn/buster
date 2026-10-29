'use strict';
const policies = {
  adaptive: '<strong>Scout at 4 FPS. Burst at 8 FPS.</strong> The student score directs more frames to suspicious intervals.',
  uniform: '<strong>A sparse, fixed set of frames.</strong> Uniform sampling can miss brief events between observations.',
  dense: '<strong>Dense sampling throughout the stream.</strong> Fixed-rate processing allocates the same temporal density to every interval.'
};
function showPolicy(policy) {
  const ticks = document.getElementById('sampling-ticks');
  ticks.replaceChildren();
  for (let i = 0; i < 85; i++) {
    const candidate = i >= 55 && i <= 73;
    const selected = policy === 'dense' || (policy === 'uniform' ? i % 14 === 0 : candidate || i % 2 === 0);
    const tick = document.createElement('span');
    tick.className = 'tick' + (candidate && policy === 'adaptive' ? ' burst' : '') + (selected ? '' : ' hidden');
    ticks.append(tick);
  }
  document.getElementById('policy-copy').innerHTML = policies[policy];
  document.getElementById('sampling-track').setAttribute('aria-label', 'Illustration of ' + policy + ' temporal sampling; shaded area marks a candidate interval.');
  document.querySelectorAll('[data-policy]').forEach(b => { const active = b.dataset.policy === policy; b.classList.toggle('active', active); b.setAttribute('aria-pressed', active); });
}
document.querySelectorAll('[data-policy]').forEach(b => b.addEventListener('click', () => showPolicy(b.dataset.policy)));
showPolicy('adaptive');
const datasets = {
  ucf: {summary:'Standard test split · 290 videos · frame-level ROC-AUC (%) ↑',metric:'AUC (%) ↑',rows:[['GCL','Unsupervised','Offline','74.20','Not applicable'],['DyAnNet','Unsupervised','Offline','79.76','Reference'],['LAVAD','Zero-shot','Offline','80.28','Not applicable'],['BUSTER','Unsupervised','Offline','86.30','+6.54 pp'],['BUSTER','Unsupervised','Online','85.50','+5.74 pp']]},
  xd: {summary:'Standard test split · 800 videos · frame-level average precision (%) ↑',metric:'AP (%) ↑',rows:[['RareAnom','Unsupervised','Offline','68.33','Reference'],['LAVAD','Zero-shot','Offline','62.01','Not applicable'],['BUSTER','Unsupervised','Offline','80.48','+12.15 pp'],['BUSTER','Unsupervised','Online','80.35','+12.02 pp']]},
  sht: {summary:'Standard test split · 107 videos · frame-level ROC-AUC (%) ↑',metric:'AUC (%) ↑',rows:[['Tur et al.','Unsupervised','Offline','76.10','Reference'],['LAVAD','Zero-shot','Offline','44.34','Not applicable'],['AnomalyRuler','Zero-shot','Offline','85.20','Not applicable'],['BUSTER','Unsupervised','Offline','78.30','+2.20 pp'],['BUSTER','Unsupervised','Online','75.90','−0.20 pp']]}
};
document.querySelectorAll('[data-dataset]').forEach(button => button.addEventListener('click', () => {
  const key = button.dataset.dataset, data = datasets[key];
  document.getElementById('dataset-summary').textContent = data.summary;
  document.getElementById('score-heading').textContent = data.metric;
  const body = document.getElementById('detection-rows'); body.replaceChildren();
  data.rows.forEach(row => {
    const tr = document.createElement('tr');
    if(row[0] === 'BUSTER') tr.className = 'ours' + (row[2] === 'Online' ? ' secondary' : '');
    row.forEach((value, index) => { const td = document.createElement('td'); td.textContent = value; if(index === 0 && value === 'BUSTER'){ const badge = document.createElement('span'); badge.textContent = 'Ours'; td.append(' ', badge); } tr.append(td); });
    body.append(tr);
  });
  document.querySelectorAll('[data-dataset]').forEach(b => { const active = b === button; b.classList.toggle('active', active); b.setAttribute('aria-pressed', active); });
}));
const demos = {
  overview: ['PIPELINE OVERVIEW', 'The complete BUSTER pipeline'],
  streaming: ['CAUSAL ONLINE INFERENCE', 'Scout-and-Burst in streaming mode'],
  robbery: ['SUPPLEMENTARY EXAMPLE', 'Robbery · selected evidence and reasoning'],
  assault: ['SUPPLEMENTARY EXAMPLE', 'Assault · selected evidence and reasoning'],
  arson: ['SUPPLEMENTARY EXAMPLE', 'Arson · selected evidence and reasoning'],
  riot: ['SUPPLEMENTARY EXAMPLE', 'Riot · selected evidence and reasoning'],
  ipman: ['SUPPLEMENTARY EXAMPLE', 'Ip Man · selected evidence and reasoning'],
  normal: ['SUPPLEMENTARY EXAMPLE', 'Normal · monitoring the stream']
};
const video = document.getElementById('demo-video');
document.querySelectorAll('[data-demo]').forEach(button => button.addEventListener('click', () => {
  const key = button.dataset.demo;
  video.pause(); video.src = 'assets/videos/' + key + '.mp4'; video.poster = 'assets/posters/' + key + '.jpg'; video.setAttribute('aria-label', demos[key][1]); video.load();
  document.getElementById('demo-category').textContent = demos[key][0];
  document.getElementById('demo-title').textContent = demos[key][1];
  document.getElementById('demo-status').textContent = 'Selected ' + demos[key][1] + '. Press play to watch.';
  document.getElementById('demo-download').href = video.src;
  document.querySelectorAll('[data-demo]').forEach(b => { const active = b === button; b.classList.toggle('active', active); b.setAttribute('aria-pressed', active); });
}));
video.addEventListener('error', () => { document.getElementById('demo-status').classList.remove('sr-only'); document.getElementById('demo-status').textContent = 'The video could not load. Use Download video to open the original MP4.'; });
document.getElementById('copy-citation').addEventListener('click', async () => {
  const citation = document.getElementById('bibtex').textContent;
  try {
    if(navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(citation);
    else { const area = document.createElement('textarea'); area.value = citation; area.style.position = 'fixed'; area.style.opacity = '0'; document.body.append(area); area.select(); const copied = document.execCommand('copy'); area.remove(); if(!copied) throw new Error('Copy unavailable'); }
    document.getElementById('copy-status').textContent = 'Citation copied to clipboard.';
  } catch { document.getElementById('copy-status').textContent = 'Select and copy the citation above.'; }
});
if('IntersectionObserver' in window){
 const observer = new IntersectionObserver(entries => entries.forEach(entry => { if(entry.isIntersecting) document.querySelectorAll('.nav-links a').forEach(a => a.classList.toggle('active', a.hash === '#' + entry.target.id)); }),{rootMargin:'-15% 0px -65% 0px'});
 document.querySelectorAll('section[id]').forEach(section => observer.observe(section));
}
