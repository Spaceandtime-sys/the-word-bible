const books=[
["Genesis",50],["Exodus",40],["Leviticus",27],["Numbers",36],["Deuteronomy",34],["Joshua",24],["Judges",21],["Ruth",4],["1 Samuel",31],["2 Samuel",24],["1 Kings",22],["2 Kings",25],["1 Chronicles",29],["2 Chronicles",36],["Ezra",10],["Nehemiah",13],["Esther",10],["Job",42],["Psalms",150],["Proverbs",31],["Ecclesiastes",12],["Song of Solomon",8],["Isaiah",66],["Jeremiah",52],["Lamentations",5],["Ezekiel",48],["Daniel",12],["Hosea",14],["Joel",3],["Amos",9],["Obadiah",1],["Jonah",4],["Micah",7],["Nahum",3],["Habakkuk",3],["Zephaniah",3],["Haggai",2],["Zechariah",14],["Malachi",4],["Matthew",28],["Mark",16],["Luke",24],["John",21],["Acts",28],["Romans",16],["1 Corinthians",16],["2 Corinthians",13],["Galatians",6],["Ephesians",6],["Philippians",4],["Colossians",4],["1 Thessalonians",5],["2 Thessalonians",3],["1 Timothy",6],["2 Timothy",4],["Titus",3],["Philemon",1],["Hebrews",13],["James",5],["1 Peter",5],["2 Peter",3],["1 John",5],["2 John",1],["3 John",1],["Jude",1],["Revelation",22]
];
const $=id=>document.getElementById(id);
const bookSelect=$('bookSelect'),chapterSelect=$('chapterSelect');
books.forEach(([name])=>{const o=document.createElement('option');o.value=name;o.textContent=name;bookSelect.append(o)});
function fillChapters(){chapterSelect.innerHTML='';const count=books.find(b=>b[0]===bookSelect.value)[1];for(let i=1;i<=count;i++){const o=document.createElement('option');o.value=i;o.textContent='Chapter '+i;chapterSelect.append(o)}}
bookSelect.addEventListener('change',fillChapters);fillChapters();

const translations={kjv:{api:'kjv',label:'KJV'},web:{api:'web',label:'WEB'},bbe:{api:'bbe',label:'BBE'},asv:{api:'asv',label:'ASV'},darby:{api:'darby',label:'Darby'},ylt:{api:'ylt',label:'YLT'}};
const versionSelect=$('bibleVersionSelect');
let currentTranslation=localStorage.getItem('wordBibleVersion')||'kjv';
if(!translations[currentTranslation])currentTranslation='kjv';
versionSelect.value=currentTranslation;
let currentVerses=[];
versionSelect.addEventListener('change',()=>{const v=versionSelect.value;if(!translations[v]){versionSelect.value=currentTranslation;showToast('Licensed text access is needed for that version');return;}currentTranslation=v;localStorage.setItem('wordBibleVersion',v);showToast('Version changed to '+translations[v].label);if(currentVerses.length)loadChapter()});
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
async function loadChapter(){
 const book=bookSelect.value,chapter=chapterSelect.value,t=translations[currentTranslation];
 $('status').textContent='Loading '+book+' '+chapter+' · '+t.label+'…';$('passage').innerHTML='';$('searchResults').innerHTML='';
 try{
  const res=await fetch('https://bible-api.com/'+encodeURIComponent(book+' '+chapter)+'?translation='+encodeURIComponent(t.api));
  if(!res.ok)throw new Error('Chapter unavailable');
  const data=await res.json();if(data.error||!data.verses?.length)throw new Error('No text');
  currentVerses=data.verses;$('status').textContent=data.reference+' · '+t.label;
  $('passage').innerHTML=currentVerses.map(v=>`<div class="verse"><sup>${v.verse}</sup>${escapeHtml(v.text.trim())}<span class="verse-actions"><button class="save-one" data-verse="${v.verse}">♡ Save</button></span></div>`).join('');
  document.querySelectorAll('.save-one').forEach(b=>b.addEventListener('click',()=>saveVerse(b.dataset.verse)));
 }catch(e){$('status').textContent='This chapter/version could not be loaded. Check your connection or choose another available version.';}
}
function saveVerse(n){const v=currentVerses.find(x=>String(x.verse)===String(n));if(!v)return;let a=JSON.parse(localStorage.getItem('wordSaved')||'[]');const ref=`${bookSelect.value} ${chapterSelect.value}:${n} · ${translations[currentTranslation].label}`;if(!a.some(x=>x.ref===ref)){a.unshift({ref,text:v.text.trim()});localStorage.setItem('wordSaved',JSON.stringify(a));renderSaved();showToast('Verse saved')}}
function renderSaved(){const a=JSON.parse(localStorage.getItem('wordSaved')||'[]');$('savedList').innerHTML=a.length?a.map((v,i)=>`<div class="saved-item">“${escapeHtml(v.text)}”<small>${escapeHtml(v.ref)} · <button class="remove-save" data-i="${i}">Remove</button></small></div>`).join(''):'<p class="muted">Verses you save will appear here.</p>';document.querySelectorAll('.remove-save').forEach(b=>b.addEventListener('click',()=>{let x=JSON.parse(localStorage.getItem('wordSaved')||'[]');x.splice(Number(b.dataset.i),1);localStorage.setItem('wordSaved',JSON.stringify(x));renderSaved()}))}
$('loadBtn').addEventListener('click',loadChapter);
$('searchBtn').addEventListener('click',()=>{const q=$('searchInput').value.trim().toLowerCase();if(!q)return;$('searchResults').innerHTML=currentVerses.filter(v=>v.text.toLowerCase().includes(q)).map(v=>`<div class="result"><b>${bookSelect.value} ${chapterSelect.value}:${v.verse}</b>${escapeHtml(v.text.trim())}</div>`).join('')||'<p class="muted">No matches in this chapter. Open another chapter and search again.</p>'});
$('searchInput').addEventListener('keydown',e=>{if(e.key==='Enter')$('searchBtn').click()});

const daily=[
['“In the beginning was the Word, and the Word was with God, and the Word was God.”','John 1:1'],['“Thy word is a lamp unto my feet, and a light unto my path.”','Psalm 119:105'],['“The LORD is my shepherd; I shall not want.”','Psalm 23:1'],['“I can do all things through Christ which strengtheneth me.”','Philippians 4:13'],['“Trust in the LORD with all thine heart; and lean not unto thine own understanding.”','Proverbs 3:5'],['“Be still, and know that I am God.”','Psalm 46:10'],['“The LORD is my light and my salvation; whom shall I fear?”','Psalm 27:1'],['“For we walk by faith, not by sight.”','2 Corinthians 5:7'],['“The LORD is good, a strong hold in the day of trouble.”','Nahum 1:7'],['“Jesus Christ the same yesterday, and to day, and for ever.”','Hebrews 13:8'],['“But seek ye first the kingdom of God, and his righteousness.”','Matthew 6:33'],['“God is our refuge and strength, a very present help in trouble.”','Psalm 46:1'],['“Let all your things be done with charity.”','1 Corinthians 16:14'],['“The fear of the LORD is the beginning of wisdom.”','Proverbs 9:10'],['“Pray without ceasing.”','1 Thessalonians 5:17'],['“If God be for us, who can be against us?”','Romans 8:31'],['“The LORD is nigh unto all them that call upon him.”','Psalm 145:18'],['“Create in me a clean heart, O God; and renew a right spirit within me.”','Psalm 51:10'],['“For with God nothing shall be impossible.”','Luke 1:37'],['“I am the way, the truth, and the life.”','John 14:6'],['“The joy of the LORD is your strength.”','Nehemiah 8:10'],['“Casting all your care upon him; for he careth for you.”','1 Peter 5:7'],['“Let your light so shine before men.”','Matthew 5:16'],['“The LORD shall fight for you, and ye shall hold your peace.”','Exodus 14:14'],['“Where your treasure is, there will your heart be also.”','Matthew 6:21'],['“We love him, because he first loved us.”','1 John 4:19'],['“Commit thy way unto the LORD; trust also in him.”','Psalm 37:5'],['“The entrance of thy words giveth light.”','Psalm 119:130'],['“Be ye doers of the word, and not hearers only.”','James 1:22'],['“My grace is sufficient for thee: for my strength is made perfect in weakness.”','2 Corinthians 12:9']
];
function dayNumber(){const d=new Date();return Math.floor((Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())-Date.UTC(d.getFullYear(),0,0))/86400000)}
function cycleDay(){const now=new Date();const today=Date.UTC(now.getFullYear(),now.getMonth(),now.getDate());return ((Math.floor((today-Date.UTC(2025,0,1))/86400000)%400)+400)%400}
function showDaily(){
 const v=daily[(dayNumber()-1)%daily.length];$('dailyVerse').textContent=v[0];$('dailyRef').textContent=v[1]+' · KJV';
 const n=cycleDay()+1;
 // Stable daily nature image seed: one seed per day in the 400-day sequence.
 $('home').style.setProperty('--daily-photo','url("https://loremflickr.com/1400/1000/nature,landscape,forest?lock='+n+'")');
 $('home').dataset.backgroundDay=String(n);
}
function dailyShareText(){return $('dailyVerse').textContent+' — '+$('dailyRef').textContent}
$('copyDaily').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(dailyShareText());showToast('Daily verse copied')}catch(e){const t=document.createElement('textarea');t.value=dailyShareText();document.body.append(t);t.select();document.execCommand('copy');t.remove();showToast('Daily verse copied')}});
$('shareDaily').addEventListener('click',()=>window.open('https://wa.me/?text='+encodeURIComponent(dailyShareText()),'_blank','noopener'));

const questions=[
{q:'Who built the ark?',a:['Moses','Noah','Abraham','David'],c:1,why:'Genesis 6–7 tells us that Noah built the ark as God commanded.'},
{q:'Who was swallowed by a great fish?',a:['Jonah','Peter','Elijah','Joseph'],c:0,why:'Jonah 1:17 says the LORD prepared a great fish to swallow Jonah.'},
{q:'In which town was Jesus born?',a:['Nazareth','Jerusalem','Bethlehem','Capernaum'],c:2,why:'Matthew 2:1 records that Jesus was born in Bethlehem of Judaea.'},
{q:'Who defeated Goliath?',a:['Saul','Jonathan','David','Samuel'],c:2,why:'David defeated Goliath with a sling and a stone (1 Samuel 17).'},
{q:'How many disciples did Jesus choose?',a:['10','12','7','14'],c:1,why:'Jesus appointed twelve disciples (Luke 6:13).'}
];
let quizIndex=0,quizPoints=0,answered=false;
function renderQuestion(){const q=questions[quizIndex];answered=false;$('quizQuestion').textContent=q.q;$('quizProgress').textContent=`Question ${quizIndex+1} of ${questions.length}`;$('quizScore').textContent='Score: '+quizPoints;$('quizProgressBar').style.width=((quizIndex+1)/questions.length*100)+'%';$('quizFeedback').textContent='';$('nextQuestion').disabled=true;$('nextQuestion').textContent=quizIndex===questions.length-1?'See my result →':'Next question →';$('quizOptions').innerHTML=q.a.map((a,i)=>`<button class="quiz-option" data-choice="${i}">${String.fromCharCode(65+i)}. ${a}</button>`).join('');document.querySelectorAll('.quiz-option').forEach(b=>b.addEventListener('click',()=>answerQuestion(Number(b.dataset.choice))))}
function answerQuestion(choice){if(answered)return;answered=true;const q=questions[quizIndex];document.querySelectorAll('.quiz-option').forEach((b,i)=>{b.disabled=true;if(i===q.c)b.classList.add('correct');if(i===choice&&choice!==q.c)b.classList.add('wrong')});$('quizFeedback').textContent=(choice===q.c?'Correct! ':'Not quite. ')+q.why;if(choice===q.c)quizPoints++;$('quizScore').textContent='Score: '+quizPoints;$('nextQuestion').disabled=false}
$('nextQuestion').addEventListener('click',()=>{if(!answered)return;if(quizIndex<questions.length-1){quizIndex++;renderQuestion()}else{$('quizQuestion').textContent=`Quiz complete! You scored ${quizPoints} out of ${questions.length}.`;$('quizOptions').innerHTML='';$('quizFeedback').textContent=quizPoints===questions.length?'Excellent work! Keep growing in the Word.':'Keep studying Scripture and try again. You can do it!';$('nextQuestion').disabled=true;$('nextQuestion').textContent='Quiz completed'}});
$('restartQuiz').addEventListener('click',()=>{quizIndex=0;quizPoints=0;renderQuestion()});
function showToast(msg){const t=$('toast');t.textContent=msg;t.classList.add('show');clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>t.classList.remove('show'),1900)}
const settingsBtn=$('settingsBtn'),settingsPanel=$('readingSettings'),fontStyleSelect=$('fontStyleSelect');
function setReaderSize(size){const px=Number(size)||16;document.documentElement.style.setProperty('--reader-font-size',px+'px');document.documentElement.style.setProperty('--daily-font-size',Math.min(28,px+8)+'px');document.querySelectorAll('[data-font-size]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.fontSize)===px)));localStorage.setItem('wordReaderSize',String(px))}
function setReaderStyle(style){const allowed=['classic','modern','elegant','clean'];const value=allowed.includes(style)?style:'classic';document.body.dataset.readerStyle=value;fontStyleSelect.value=value;localStorage.setItem('wordReaderStyle',value)}
document.querySelectorAll('[data-font-size]').forEach(b=>b.addEventListener('click',()=>setReaderSize(b.dataset.fontSize)));
fontStyleSelect.addEventListener('change',()=>setReaderStyle(fontStyleSelect.value));
settingsBtn.addEventListener('click',()=>{const opening=settingsPanel.hidden;settingsPanel.hidden=!opening;settingsBtn.setAttribute('aria-expanded',String(opening))});
document.addEventListener('click',e=>{if(!e.target.closest('.settings-wrap')){settingsPanel.hidden=true;settingsBtn.setAttribute('aria-expanded','false')}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){settingsPanel.hidden=true;settingsBtn.setAttribute('aria-expanded','false')}});
setReaderSize(localStorage.getItem('wordReaderSize')||'16');setReaderStyle(localStorage.getItem('wordReaderStyle')||'classic');
$('themeBtn').addEventListener('click',()=>{document.body.classList.toggle('dark');localStorage.setItem('wordDark',document.body.classList.contains('dark')?'1':'0')});
if(localStorage.getItem('wordDark')==='1')document.body.classList.add('dark');
document.querySelectorAll('.bottom-nav a').forEach(a=>a.addEventListener('click',()=>{document.querySelectorAll('.bottom-nav a').forEach(x=>x.classList.remove('active'));a.classList.add('active')}));
showDaily();renderSaved();renderQuestion();
if('serviceWorker' in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('./sw.js').catch(()=>{});


/* THE WORD — Bible Reading Plans */

(function () {
  const planSelect = document.getElementById('planSelect');
  const planDays = document.getElementById('planDays');
  const planProgress = document.getElementById('planProgress');
  const planProgressText = document.getElementById('planProgressText');
  const planHeading = document.getElementById('planHeading');

  if (!planSelect || !planDays || !planProgress || !planProgressText || !planHeading) return;

  const planOptions = {
    30: '30-Day Bible Challenge',
    90: '90-Day Bible Journey',
    365: '365-Day Bible Journey'
  };

  const storageKey = 'theWordReadingPlans';
  let completedPlans = JSON.parse(localStorage.getItem(storageKey) || '{}');

  const allChapters = [];
  books.forEach(([book, count]) => {
    for (let chapter = 1; chapter <= count; chapter++) {
      allChapters.push({ book, chapter });
    }
  });

  function getDayReadings(totalDays, day) {
    const start = Math.floor((day - 1) * allChapters.length / totalDays);
    const end = Math.floor(day * allChapters.length / totalDays);
    const chapters = allChapters.slice(start, end);
    const groups = [];

    chapters.forEach(item => {
      const last = groups[groups.length - 1];
      if (last && last.book === item.book && last.end + 1 === item.chapter) {
        last.end = item.chapter;
      } else {
        groups.push({
          book: item.book,
          start: item.chapter,
          end: item.chapter
        });
      }
    });

    return groups.map(g =>
      g.book + ' ' + g.start +
      (g.end > g.start ? '–' + g.end : '')
    ).join(', ');
  }

  function saveProgress() {
    localStorage.setItem(storageKey, JSON.stringify(completedPlans));
  }

  function renderPlans() {
    const totalDays = Number(planSelect.value);
    const planName = planOptions[totalDays];
    if (!completedPlans[totalDays]) completedPlans[totalDays] = [];

    const completed = completedPlans[totalDays];
    const percentage = Math.round(completed.length / totalDays * 100);

    planHeading.textContent = planName;
    planProgress.style.width = percentage + '%';
    planProgressText.textContent =
      completed.length + ' of ' + totalDays + ' days completed · ' + percentage + '%';

    planDays.innerHTML = '';

    for (let day = 1; day <= totalDays; day++) {
      const isDone = completed.includes(day);
      const item = document.createElement('label');
      item.className = 'plan-day' + (isDone ? ' completed' : '');

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = isDone;
      checkbox.setAttribute('aria-label', 'Mark day ' + day + ' completed');

      const details = document.createElement('span');
      details.className = 'plan-day-details';

      const heading = document.createElement('strong');
      heading.textContent = 'Day ' + day;

      const reading = document.createElement('small');
      reading.textContent = getDayReadings(totalDays, day);

      details.append(heading, reading);
      item.append(checkbox, details);

      checkbox.addEventListener('change', () => {
        const list = completedPlans[totalDays] || [];

        if (checkbox.checked) {
          if (!list.includes(day)) list.push(day);
        } else {
          completedPlans[totalDays] = list.filter(d => d !== day);
        }

        completedPlans[totalDays] = list.sort((a, b) => a - b);
        saveProgress();
        renderPlans();
      });

      planDays.append(item);
    }
  }

  planSelect.addEventListener('change', renderPlans);
  renderPlans();
})();

