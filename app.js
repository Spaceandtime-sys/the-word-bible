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
async function loadChapter(){
 const book=bookSelect.value,chapter=chapterSelect.value;
 $('status').textContent='Loading '+book+' '+chapter+'…';$('passage').innerHTML='';$('searchResults').innerHTML='';
 try{
  const url='https://bible-api.com/'+encodeURIComponent(book+' '+chapter)+'?translation=kjv';
  const res=await fetch(url);if(!res.ok)throw new Error('Could not load this chapter.');
  const data=await res.json();currentVerses=data.verses||[];$('status').textContent=data.reference+' · King James Version';
  $('passage').innerHTML=currentVerses.map(v=>`<div class="verse"><sup>${v.verse}</sup>${escapeHtml(v.text.trim())}<span class="verse-actions"><button class="save-one" data-verse="${v.verse}">♡ Save</button></span></div>`).join('');
  document.querySelectorAll('.save-one').forEach(btn=>btn.addEventListener('click',()=>saveVerse(btn.dataset.verse)));
 }catch(e){$('status').textContent='We could not load the chapter. Please check your internet connection and try again.'}
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function saveVerse(n){
 const v=currentVerses.find(x=>String(x.verse)===String(n));if(!v)return;
 let saved=JSON.parse(localStorage.getItem('wordSaved')||'[]');
 const ref=`${bookSelect.value} ${chapterSelect.value}:${n}`;
 if(!saved.some(x=>x.ref===ref)){saved.unshift({ref,text:v.text.trim()});localStorage.setItem('wordSaved',JSON.stringify(saved));renderSaved()}
}
function renderSaved(){
 const saved=JSON.parse(localStorage.getItem('wordSaved')||'[]');
 $('savedList').innerHTML=saved.length?saved.map((v,i)=>`<div class="saved-item">“${escapeHtml(v.text)}”<small>${escapeHtml(v.ref)} · <button class="remove-save" data-i="${i}">Remove</button></small></div>`).join(''):'<p class="muted">Verses you save will appear here.</p>';
 document.querySelectorAll('.remove-save').forEach(b=>b.addEventListener('click',()=>{let a=JSON.parse(localStorage.getItem('wordSaved')||'[]');a.splice(Number(b.dataset.i),1);localStorage.setItem('wordSaved',JSON.stringify(a));renderSaved()}))
}
$('loadBtn').addEventListener('click',loadChapter);
$('searchBtn').addEventListener('click',()=>{
 const q=$('searchInput').value.trim().toLowerCase();if(!q)return;
 $('searchResults').innerHTML=currentVerses.filter(v=>v.text.toLowerCase().includes(q)).map(v=>`<div class="result"><b>${escapeHtml(bookSelect.value)} ${chapterSelect.value}:${v.verse}</b>${escapeHtml(v.text.trim())}</div>`).join('')||'<p class="muted">No matches in this chapter. Open another chapter and search again.</p>'
});
$('searchInput').addEventListener('keydown',e=>{if(e.key==='Enter')$('searchBtn').click()});

/* One consistent verse per local calendar day; it changes at local midnight. */
const daily=[
['“Thy word is a lamp unto my feet, and a light unto my path.”','Psalm 119:105'],
['“The LORD is my shepherd; I shall not want.”','Psalm 23:1'],
['“I can do all things through Christ which strengtheneth me.”','Philippians 4:13'],
['“Trust in the LORD with all thine heart; and lean not unto thine own understanding.”','Proverbs 3:5'],
['“Be still, and know that I am God.”','Psalm 46:10'],
['“The LORD is my light and my salvation; whom shall I fear?”','Psalm 27:1'],
['“Fear thou not; for I am with thee: be not dismayed; for I am thy God.”','Isaiah 41:10'],
['“ casting all your care upon him; for he careth for you.”','1 Peter 5:7'],
['“The LORD is good, a strong hold in the day of trouble.”','Nahum 1:7'],
['“In all thy ways acknowledge him, and he shall direct thy paths.”','Proverbs 3:6'],
['“For with God nothing shall be impossible.”','Luke 1:37'],
['“The joy of the LORD is your strength.”','Nehemiah 8:10'],
['“God is our refuge and strength, a very present help in trouble.”','Psalm 46:1'],
['“Commit thy way unto the LORD; trust also in him; and he shall bring it to pass.”','Psalm 37:5'],
['“Let all your things be done with charity.”','1 Corinthians 16:14'],
['“The LORD shall fight for you, and ye shall hold your peace.”','Exodus 14:14'],
['“Draw nigh to God, and he will draw nigh to you.”','James 4:8'],
['“But they that wait upon the LORD shall renew their strength.”','Isaiah 40:31'],
['“The name of the LORD is a strong tower: the righteous runneth into it, and is safe.”','Proverbs 18:10'],
['“We love him, because he first loved us.”','1 John 4:19'],
['“The LORD is nigh unto all them that call upon him.”','Psalm 145:18'],
['“And we know that all things work together for good to them that love God.”','Romans 8:28'],
['“Let not your heart be troubled: ye believe in God, believe also in me.”','John 14:1'],
['“My grace is sufficient for thee: for my strength is made perfect in weakness.”','2 Corinthians 12:9'],
['“O give thanks unto the LORD; for he is good: for his mercy endureth for ever.”','Psalm 107:1'],
['“Thy faith hath made thee whole; go in peace.”','Luke 8:48'],
['“The LORD is my strength and my shield; my heart trusted in him.”','Psalm 28:7'],
['“If God be for us, who can be against us?”','Romans 8:31'],
['“Let us not be weary in well doing: for in due season we shall reap.”','Galatians 6:9'],
['“Jesus Christ the same yesterday, and to day, and for ever.”','Hebrews 13:8']
];
function localDayNumber(){
 const now=new Date(),start=new Date(now.getFullYear(),0,0);
 return Math.floor((now-start)/86400000);
}
function getDailyVerse(){return daily[localDayNumber()%daily.length]}
function renderDaily(){
 const v=getDailyVerse();
 $('dailyVerse').textContent=v[0];$('dailyRef').textContent=v[1]+' · KJV';
}
function dailyShareText(){return `${$('dailyVerse').textContent}\n${$('dailyRef').textContent}\n\nShared from THE WORD Bible app.`}
$('copyDaily').addEventListener('click',async()=>{
 const text=dailyShareText(),feedback=$('dailyFeedback');
 try{
  if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(text)}
  else{
   const area=document.createElement('textarea');area.value=text;area.style.position='fixed';area.style.opacity='0';document.body.append(area);area.select();
   const ok=document.execCommand('copy');area.remove();if(!ok)throw new Error('Copy unavailable');
  }
  feedback.textContent='Verse copied. You can paste it anywhere.';
 }catch(e){feedback.textContent='Copy was not available in this browser. Please select the verse and copy it.'}
});
$('shareDaily').addEventListener('click',()=>{
 const url='https://wa.me/?text='+encodeURIComponent(dailyShareText());
 window.open(url,'_blank','noopener,noreferrer');
});
$('themeBtn').addEventListener('click',()=>{document.body.classList.toggle('dark');localStorage.setItem('wordDark',document.body.classList.contains('dark')?'1':'0')});
if(localStorage.getItem('wordDark')==='1')document.body.classList.add('dark');

/* Highlight the glass navigation tab for the section currently in view. */
const navLinks=[...document.querySelectorAll('.bottom-nav a')];
const navTargets=navLinks.map(a=>document.querySelector(a.getAttribute('href'))).filter(Boolean);
if('IntersectionObserver' in window){
 const navObserver=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{if(entry.isIntersecting){navLinks.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+entry.target.id || (entry.target.id==='top'&&a.getAttribute('href')==='#top')))}});
 },{rootMargin:'-25% 0px -60% 0px',threshold:0});
 navTargets.forEach(el=>navObserver.observe(el));
}
navLinks.forEach(a=>a.addEventListener('click',()=>{navLinks.forEach(x=>x.classList.toggle('active',x===a))}));
renderDaily();
renderSaved();
if('serviceWorker' in navigator && location.protocol.startsWith('http'))navigator.serviceWorker.register('./sw.js').catch(()=>{});
