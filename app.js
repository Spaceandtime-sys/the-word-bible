const books = [
["Genesis",50],["Exodus",40],["Leviticus",27],["Numbers",36],["Deuteronomy",34],["Joshua",24],["Judges",21],["Ruth",4],["1 Samuel",31],["2 Samuel",24],["1 Kings",22],["2 Kings",25],["1 Chronicles",29],["2 Chronicles",36],["Ezra",10],["Nehemiah",13],["Esther",10],["Job",42],["Psalms",150],["Proverbs",31],["Ecclesiastes",12],["Song of Solomon",8],["Isaiah",66],["Jeremiah",52],["Lamentations",5],["Ezekiel",48],["Daniel",12],["Hosea",14],["Joel",3],["Amos",9],["Obadiah",1],["Jonah",4],["Micah",7],["Nahum",3],["Habakkuk",3],["Zephaniah",3],["Haggai",2],["Zechariah",14],["Malachi",4],
["Matthew",28],["Mark",16],["Luke",24],["John",21],["Acts",28],["Romans",16],["1 Corinthians",16],["2 Corinthians",13],["Galatians",6],["Ephesians",6],["Philippians",4],["Colossians",4],["1 Thessalonians",5],["2 Thessalonians",3],["1 Timothy",6],["2 Timothy",4],["Titus",3],["Philemon",1],["Hebrews",13],["James",5],["1 Peter",5],["2 Peter",3],["1 John",5],["2 John",1],["3 John",1],["Jude",1],["Revelation",22]
];
const $=id=>document.getElementById(id);
const bookSelect=$('bookSelect'), chapterSelect=$('chapterSelect');
books.forEach(([name])=>{const o=document.createElement('option');o.value=name;o.textContent=name;bookSelect.append(o)});
function fillChapters(){chapterSelect.innerHTML='';const count=books.find(b=>b[0]===bookSelect.value)[1];for(let i=1;i<=count;i++){const o=document.createElement('option');o.value=i;o.textContent='Chapter '+i;chapterSelect.append(o)}}
bookSelect.addEventListener('change',fillChapters);fillChapters();
let currentVerses=[];
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
async function loadChapter(){const book=bookSelect.value,chapter=chapterSelect.value;$('status').textContent='Loading '+book+' '+chapter+'…';$('passage').innerHTML='';$('searchResults').innerHTML='';
 try{const res=await fetch('https://bible-api.com/'+encodeURIComponent(book+' '+chapter)+'?translation=kjv');if(!res.ok)throw new Error('Could not load this chapter.');const data=await res.json();currentVerses=data.verses||[];$('status').textContent=data.reference+' · King James Version';$('passage').innerHTML=currentVerses.map(v=>`<div class="verse"><sup>${v.verse}</sup>${escapeHtml(v.text.trim())}<span class="verse-actions"><button class="save-one" data-verse="${v.verse}">♡ Save</button></span></div>`).join('');document.querySelectorAll('.save-one').forEach(btn=>btn.addEventListener('click',()=>saveVerse(btn.dataset.verse)));}catch(e){$('status').textContent='We could not load the chapter. Please check your internet connection and try again.'}}
function saveVerse(n){const v=currentVerses.find(x=>String(x.verse)===String(n));if(!v)return;let saved=JSON.parse(localStorage.getItem('wordSaved')||'[]');const ref=`${bookSelect.value} ${chapterSelect.value}:${n}`;if(!saved.some(x=>x.ref===ref)){saved.unshift({ref,text:v.text.trim()});localStorage.setItem('wordSaved',JSON.stringify(saved));renderSaved();showToast('Verse saved');}}
function renderSaved(){const saved=JSON.parse(localStorage.getItem('wordSaved')||'[]');$('savedList').innerHTML=saved.length?saved.map((v,i)=>`<div class="saved-item">“${escapeHtml(v.text)}”<small>${escapeHtml(v.ref)} · <button class="remove-save" data-i="${i}">Remove</button></small></div>`).join(''):'<p class="muted">Verses you save will appear here.</p>';document.querySelectorAll('.remove-save').forEach(b=>b.addEventListener('click',()=>{let a=JSON.parse(localStorage.getItem('wordSaved')||'[]');a.splice(Number(b.dataset.i),1);localStorage.setItem('wordSaved',JSON.stringify(a));renderSaved()}))}
$('loadBtn').addEventListener('click',loadChapter);
$('searchBtn').addEventListener('click',()=>{const q=$('searchInput').value.trim().toLowerCase();if(!q)return;$('searchResults').innerHTML=currentVerses.filter(v=>v.text.toLowerCase().includes(q)).map(v=>`<div class="result"><b>${bookSelect.value} ${chapterSelect.value}:${v.verse}</b>${escapeHtml(v.text.trim())}</div>`).join('')||'<p class="muted">No matches in this chapter. Open another chapter and search again.</p>'});
$('searchInput').addEventListener('keydown',e=>{if(e.key==='Enter')$('searchBtn').click()});

const daily=[
['“In the beginning was the Word, and the Word was with God, and the Word was God.”','John 1:1'],
['“Thy word is a lamp unto my feet, and a light unto my path.”','Psalm 119:105'],
['“The LORD is my shepherd; I shall not want.”','Psalm 23:1'],
['“I can do all things through Christ which strengtheneth me.”','Philippians 4:13'],
['“Trust in the LORD with all thine heart; and lean not unto thine own understanding.”','Proverbs 3:5'],
['“Be still, and know that I am God.”','Psalm 46:10'],
['“The LORD is my light and my salvation; whom shall I fear?”','Psalm 27:1'],
['“For we walk by faith, not by sight.”','2 Corinthians 5:7'],
['“The LORD is good, a strong hold in the day of trouble.”','Nahum 1:7'],
['“Jesus Christ the same yesterday, and to day, and for ever.”','Hebrews 13:8'],
['“But seek ye first the kingdom of God, and his righteousness.”','Matthew 6:33'],
['“God is our refuge and strength, a very present help in trouble.”','Psalm 46:1'],
['“Let all your things be done with charity.”','1 Corinthians 16:14'],
['“The fear of the LORD is the beginning of wisdom.”','Proverbs 9:10'],
['“Pray without ceasing.”','1 Thessalonians 5:17'],
['“If God be for us, who can be against us?”','Romans 8:31'],
['“The LORD is nigh unto all them that call upon him.”','Psalm 145:18'],
['“Create in me a clean heart, O God; and renew a right spirit within me.”','Psalm 51:10'],
['“For with God nothing shall be impossible.”','Luke 1:37'],
['“I am the way, the truth, and the life.”','John 14:6'],
['“The joy of the LORD is your strength.”','Nehemiah 8:10'],
['“Casting all your care upon him; for he careth for you.”','1 Peter 5:7'],
['“Let your light so shine before men.”','Matthew 5:16'],
['“The LORD shall fight for you, and ye shall hold your peace.”','Exodus 14:14'],
['“Where your treasure is, there will your heart be also.”','Matthew 6:21'],
['“We love him, because he first loved us.”','1 John 4:19'],
['“Commit thy way unto the LORD; trust also in him.”','Psalm 37:5'],
['“The entrance of thy words giveth light.”','Psalm 119:130'],
['“Be ye doers of the word, and not hearers only.”','James 1:22'],
['“My grace is sufficient for thee: for my strength is made perfect in weakness.”','2 Corinthians 12:9']
];
function dayNumber(){const d=new Date();return Math.floor((Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())-Date.UTC(d.getFullYear(),0,0))/86400000)}
function showDaily(){const v=daily[(dayNumber()-1)%daily.length];$('dailyVerse').textContent=v[0];$('dailyRef').textContent=v[1]+' · KJV'}
function dailyShareText(){return $('dailyVerse').textContent+' — '+$('dailyRef').textContent}
$('copyDaily').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(dailyShareText());showToast('Daily verse copied')}catch(e){const t=document.createElement('textarea');t.value=dailyShareText();document.body.append(t);t.select();document.execCommand('copy');t.remove();showToast('Daily verse copied')}});
$('shareDaily').addEventListener('click',()=>{const url='https://wa.me/?text='+encodeURIComponent(dailyShareText());window.open(url,'_blank','noopener')});

const questions=[
{q:'Who built the ark?',a:['Moses','Noah','Abraham','David'],c:1,why:'Genesis 6–7 tells us that Noah built the ark as God commanded.'},
{q:'Who was swallowed by a great fish?',a:['Jonah','Peter','Elijah','Joseph'],c:0,why:'Jonah 1:17 says the LORD prepared a great fish to swallow Jonah.'},
{q:'In which town was Jesus born?',a:['Nazareth','Jerusalem','Bethlehem','Capernaum'],c:2,why:'Matthew 2:1 records that Jesus was born in Bethlehem of Judaea.'},
{q:'Who defeated Goliath?',a:['Saul','Jonathan','David','Samuel'],c:2,why:'David defeated Goliath with a sling and a stone (1 Samuel 17).'},
{q:'How many disciples did Jesus choose?',a:['10','12',' सात','14'],c:1,why:'Jesus appointed twelve disciples (Luke 6:13).'}
];
questions[4].a[2]='7';
let quizIndex=0,quizPoints=0,answered=false;
function renderQuestion(){const q=questions[quizIndex];answered=false;$('quizQuestion').textContent=q.q;$('quizProgress').textContent=`Question ${quizIndex+1} of ${questions.length}`;$('quizScore').textContent='Score: '+quizPoints;$('quizProgressBar').style.width=((quizIndex+1)/questions.length*100)+'%';$('quizFeedback').textContent='';$('nextQuestion').disabled=true;$('nextQuestion').textContent=quizIndex===questions.length-1?'See my result →':'Next question →';$('quizOptions').innerHTML=q.a.map((a,i)=>`<button class="quiz-option" data-choice="${i}">${String.fromCharCode(65+i)}. ${a}</button>`).join('');document.querySelectorAll('.quiz-option').forEach(b=>b.addEventListener('click',()=>answerQuestion(Number(b.dataset.choice))))}
function answerQuestion(choice){if(answered)return;answered=true;const q=questions[quizIndex];document.querySelectorAll('.quiz-option').forEach((b,i)=>{b.disabled=true;if(i===q.c)b.classList.add('correct');if(i===choice&&choice!==q.c)b.classList.add('wrong')});if(choice===q.c){quizPoints++;$('quizFeedback').textContent='Correct! '+q.why}else{$('quizFeedback').textContent='Not quite. '+q.why}$('quizScore').textContent='Score: '+quizPoints;$('nextQuestion').disabled=false}
$('nextQuestion').addEventListener('click',()=>{if(!answered)return;if(quizIndex<questions.length-1){quizIndex++;renderQuestion()}else{$('quizQuestion').textContent=`Quiz complete! You scored ${quizPoints} out of ${questions.length}.`;$('quizOptions').innerHTML='';$('quizFeedback').textContent=quizPoints===questions.length?'Excellent work! Keep growing in the Word.':'Keep studying Scripture and try again. You can do it!';$('nextQuestion').disabled=true;$('nextQuestion').textContent='Quiz completed'}})
$('restartQuiz').addEventListener('click',()=>{quizIndex=0;quizPoints=0;renderQuestion()});

function showToast(msg){const t=$('toast');t.textContent=msg;t.classList.add('show');clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>t.classList.remove('show'),1900)}
$('themeBtn').addEventListener('click',()=>{document.body.classList.toggle('dark');localStorage.setItem('wordDark',document.body.classList.contains('dark')?'1':'0')});
if(localStorage.getItem('wordDark')==='1')document.body.classList.add('dark');
document.querySelectorAll('.bottom-nav a').forEach(a=>a.addEventListener('click',()=>{document.querySelectorAll('.bottom-nav a').forEach(x=>x.classList.remove('active'));a.classList.add('active')}));
showDaily();renderSaved();renderQuestion();
if('serviceWorker' in navigator && location.protocol.startsWith('http'))navigator.serviceWorker.register('./sw.js').catch(()=>{});
