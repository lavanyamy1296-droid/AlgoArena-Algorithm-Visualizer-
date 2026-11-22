const $ = id => document.getElementById(id);
const sleep = ms => new Promise(r => setTimeout(r, ms));
let values = [], sortStop = false, searching = false;
const delay = () => [520,350,220,110,35][+$('speed').value-1];

document.querySelectorAll('.tab').forEach(btn => btn.addEventListener('click', () => {
  document.querySelectorAll('.tab').forEach(b => b.classList.toggle('active', b === btn));
  document.querySelectorAll('.panel').forEach(p => p.classList.toggle('active', p.id === btn.dataset.panel));
}));
function randomArray(n=+$('arraySize').value){ values=Array.from({length:n},()=>Math.floor(Math.random()*88)+8); renderBars(); $('sortStatus').textContent='New array generated'; $('comparisons').textContent='0'; $('swaps').textContent='0'; }
function renderBars(active=[],done=[]){const root=$('bars');root.innerHTML='';const max=Math.max(...values,1);values.forEach((v,i)=>{const bar=document.createElement('div');bar.className='bar'+(done.includes(i)?' done':active.includes(i)?' compare':'');bar.style.height=(v/max*100)+'%';bar.title=`Index ${i}: ${v}`;root.appendChild(bar);});}
$('arraySize').addEventListener('input',e=>{$('sizeOut').textContent=e.target.value;randomArray();});
$('speed').addEventListener('input',e=>{$('speedOut').textContent=['Very slow','Slow','Normal','Fast','Very fast'][+e.target.value-1];});
$('sortRandom').onclick=()=>{sortStop=true;randomArray();};
$('sortStop').onclick=()=>{sortStop=true;$('sortStatus').textContent='Stopped';};
$('sortRun').onclick=async()=>{
 if(!values.length)randomArray();sortStop=false;$('sortRun').disabled=true;
 let a=values.slice(),comp=0,swaps=0,n=a.length,done=[];
 const algo=$('sortAlgo').value;
 $('complexity').textContent=algo==='insertion'?'O(n²)': 'O(n²)';
 const draw=async(i,j)=>{values=a.slice();renderBars([i,j],done);$('comparisons').textContent=comp;$('swaps').textContent=swaps;await sleep(delay());};
 $('sortStatus').textContent='Sorting in progress…';
 if(algo==='bubble'){
  for(let i=0;i<n-1&&!sortStop;i++){for(let j=0;j<n-i-1&&!sortStop;j++){comp++;await draw(j,j+1);if(a[j]>a[j+1]){[a[j],a[j+1]]=[a[j+1],a[j]];swaps++;} }done.push(n-i-1);}
 } else if(algo==='selection'){
  for(let i=0;i<n-1&&!sortStop;i++){let min=i;for(let j=i+1;j<n&&!sortStop;j++){comp++;await draw(min,j);if(a[j]<a[min])min=j;}if(min!==i){[a[i],a[min]]=[a[min],a[i]];swaps++;}done.push(i);}
 } else {
  for(let i=1;i<n&&!sortStop;i++){let key=a[i],j=i-1;while(j>=0&&!sortStop){comp++;await draw(j,i);if(a[j]>key){a[j+1]=a[j];swaps++;j--;}else break;}a[j+1]=key;done.push(...Array.from({length:i},(_,k)=>k));}
 }
 values=a;renderBars([],sortStop?[]:Array.from({length:n},(_,i)=>i));
 $('sortStatus').textContent=sortStop?'Run stopped':'Sorting complete ✓';$('comparisons').textContent=comp;$('swaps').textContent=swaps;$('sortRun').disabled=false;
};
randomArray();

let searchValues=[8,14,21,29,35,42,48,53,61,67,74,82,91];
function renderSearch(active=-1,found=-1){$('searchItems').innerHTML='';searchValues.forEach((v,i)=>{let el=document.createElement('div');el.className='search-item'+(i===found?' found':i===active?' current':'');el.textContent=v;$('searchItems').appendChild(el);});}
$('searchReset').onclick=()=>{searchValues=[...new Set(Array.from({length:13},()=>Math.floor(Math.random()*90)+5))].sort((a,b)=>a-b);renderSearch();$('searchStatus').textContent='Values reset';$('checked').textContent='0';$('searchResult').textContent='—';};
$('searchRun').onclick=async()=>{
 if(searching)return;searching=true;$('searchRun').disabled=true;
 const target=Number($('target').value),binary=$('searchAlgo').value==='binary';let checks=0,found=-1;
 $('searchComplexity').textContent=binary?'O(log n)':'O(n)';
 if(binary)searchValues.sort((a,b)=>a-b);
 const indexes=binary?null:Array.from({length:searchValues.length},(_,i)=>i);
 if(binary){
  let lo=0,hi=searchValues.length-1;
  while(lo<=hi){let mid=Math.floor((lo+hi)/2);checks++;renderSearch(mid);$('checked').textContent=checks;$('searchStatus').textContent=`Checking index ${mid}…`;await sleep(450);if(searchValues[mid]===target){found=mid;break;}if(searchValues[mid]<target)lo=mid+1;else hi=mid-1;}
 }else{
  for(let i of indexes){checks++;renderSearch(i);$('checked').textContent=checks;$('searchStatus').textContent=`Checking index ${i}…`;await sleep(350);if(searchValues[i]===target){found=i;break;}}
 }
 renderSearch(-1,found);$('searchResult').textContent=found>=0?`Index ${found}`:'Not found';$('searchStatus').textContent=found>=0?'Target found ✓':'Target not found';searching=false;$('searchRun').disabled=false;
};
renderSearch();

let stack=[],queue=[];
function paintStructures(){
 $('stackView').innerHTML=stack.map((v,i)=>`<div class="struct-node">${escapeHtml(v)}${i===stack.length-1?' · TOP':''}</div>`).join('');
 $('queueView').innerHTML=queue.map((v,i)=>`<div class="struct-node">${escapeHtml(v)}${i===0?' · FRONT':i===queue.length-1?' · REAR':''}</div>`).join('');
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
$('push').onclick=()=>{let v=$('stackValue').value.trim();if(!v)return;if(stack.length>=8){$('stackMessage').textContent='Stack limit reached (8 items).';return;}stack.push(v);$('stackValue').value='';$('stackMessage').textContent=`Pushed "${v}" onto the stack.`;paintStructures();};
$('pop').onclick=()=>{$('stackMessage').textContent=stack.length?`Popped "${stack.pop()}" from the stack.`:'Stack underflow: nothing to pop.';paintStructures();};
$('clearStack').onclick=()=>{stack=[];$('stackMessage').textContent='Stack cleared.';paintStructures();};
$('enqueue').onclick=()=>{let v=$('queueValue').value.trim();if(!v)return;if(queue.length>=8){$('queueMessage').textContent='Queue limit reached (8 items).';return;}queue.push(v);$('queueValue').value='';$('queueMessage').textContent=`Enqueued "${v}" at the rear.`;paintStructures();};
$('dequeue').onclick=()=>{$('queueMessage').textContent=queue.length?`Dequeued "${queue.shift()}" from the front.`:'Queue underflow: nothing to dequeue.';paintStructures();};
$('clearQueue').onclick=()=>{queue=[];$('queueMessage').textContent='Queue cleared.';paintStructures();};
paintStructures();
