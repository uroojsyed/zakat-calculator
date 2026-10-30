(function(){
var GOLD_OZ=4120.1,SILVER_OZ=60.991,OZ=31.1034768,CAD=1.4166,GBP=.75396,GOLD_G=87.48,SILVER_G=612.36;
var gpg=GOLD_OZ*CAD/OZ,spg=SILVER_OZ*CAD/OZ;
var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var fmt=function(n){return new Intl.NumberFormat('en-CA',{style:'currency',currency:'CAD',maximumFractionDigits:2}).format(n)};
var INVT=[['stocks','Stocks & shares','Shares you can access or sell.'],['funds','Funds & ETFs','Accessible mutual funds and exchange-traded funds.'],['crypto','Cryptocurrency','Digital assets held in wallets or exchanges.'],['pension','Accessible pension','The portion of a pension you can access now.'],['other','Other investment','Another accessible investment not listed here.']];
var CASHC=['Chequing','Savings','Cash at home','Digital wallet','TFSA','RRSP','Other'];
var LIABT=[['rent','Rent or housing payment'],['housing','Home payment currently due'],['utilities','Utilities and bills'],['invoices','Business invoices'],['salaries','Staff salaries'],['other','Other']];
var S;
function fresh(){return {cash:[{cat:'Chequing',label:'Chequing',amount:0}],business:[{label:'Inventory',amount:0}],owed:[{label:'Money expected during the lunar year',amount:0}],inv:[{type:'stocks',amount:0}],fx:[{cur:'USD',code:'',amount:0,rate:0}],gold:[{karat:24,grams:0}],silver:[{grams:0}],liab:[{type:'rent',label:'',amount:0}],interest:0}}
S=fresh();
var TRASH='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/></svg>';
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function money(list,i,f,sym){return '<label class="money"><span class="sr">Amount</span><b>'+sym+'</b><input class="fi" type="number" min="0" step=".01" placeholder="0.00" value="'+(S[list][i][f]||'')+'" data-l="'+list+'" data-i="'+i+'" data-f="'+f+'"></label>'}
function del(list,i){return '<button class="del" type="button" aria-label="Remove line" data-del="'+list+'" data-i="'+i+'"'+(S[list].length===1?' disabled':'')+'>'+TRASH+'</button>'}
function txt(list,i,f,ph){return '<input class="fi" value="'+esc(S[list][i][f])+'" placeholder="'+ph+'" data-l="'+list+'" data-i="'+i+'" data-f="'+f+'" data-t="1">'}
function sel(list,i,f,opts,cls){return '<select class="fs '+(cls||'')+'" data-l="'+list+'" data-i="'+i+'" data-f="'+f+'" data-t="1" data-sel="1">'+opts.map(function(o){var v=o[0],l=o[1];return '<option value="'+v+'"'+(String(S[list][i][f])===String(v)?' selected':'')+'>'+l+'</option>'}).join('')+'</select>'}
var R={
cash:function(i){var r=S.cash[i];return '<div class="row"><div class="rg"><div>'+sel('cash',i,'cat',CASHC.map(function(c){return [c,c]}))+(r.cat==='Other'?'<input class="fi sm" style="margin-top:8px" value="'+esc(r.label)+'" placeholder="Describe this account" data-l="cash" data-i="'+i+'" data-f="label" data-t="1">':'')+'</div>'+money('cash',i,'amount','$')+del('cash',i)+'</div><p class="help">Add a line so you can remember what this amount represents.</p></div>'},
business:function(i){return '<div class="row"><div class="rg">'+txt('business',i,'label','Inventory or location')+money('business',i,'amount','$')+del('business',i)+'</div><p class="help">Add a line so you can remember what this amount represents.</p></div>'},
owed:function(i){return '<div class="row"><div class="rg">'+txt('owed',i,'label','Who or what is paying you?')+money('owed',i,'amount','$')+del('owed',i)+'</div><p class="help">Add a line so you can remember what this amount represents.</p></div>'},
inv:function(i){var r=S.inv[i],d=INVT.filter(function(t){return t[0]===r.type})[0][2];return '<div class="row"><div class="rg">'+sel('inv',i,'type',INVT.map(function(t){return [t[0],t[1]]}))+money('inv',i,'amount','$')+del('inv',i)+'</div><p class="help">'+d+'</p></div>'},
fx:function(i){var r=S.fx[i],sym=r.cur==='GBP'?'£':(r.cur==='other'?(r.code||'¤'):'$');return '<div class="row"><div class="rg fx">'+sel('fx',i,'cur',[['USD','US dollars (USD)'],['GBP','British pounds (GBP)'],['other','Other currency']])+money('fx',i,'amount',sym)+del('fx',i)+'</div>'+(r.cur==='other'?'<div class="rg fx" style="margin-top:12px;grid-template-columns:1fr 1fr"><input class="fi sm" value="'+esc(r.code)+'" maxlength="6" placeholder="Currency code, e.g. EUR" data-l="fx" data-i="'+i+'" data-f="code" data-t="1" data-up="1"><label class="money"><b>$</b><input class="fi sm" type="number" min="0" step=".0001" placeholder="CAD for 1 unit" value="'+(r.rate||'')+'" data-l="fx" data-i="'+i+'" data-f="rate"></label></div>'+(r.rate<=0?'<p class="warn">Enter the CAD value of one unit to include this balance in the estimate.</p>':''):'')+'<p class="approx" data-fxline="'+i+'"></p></div>'},
gold:function(i){return '<div class="mrow">'+sel('gold',i,'karat',[[24,'24k'],[22,'22k'],[21,'21k'],[18,'18k']],'sm')+'<input class="fi sm" type="number" min="0" step=".01" placeholder="grams" value="'+(S.gold[i].grams||'')+'" data-l="gold" data-i="'+i+'" data-f="grams">'+del('gold',i)+'</div>'},
silver:function(i){return '<div class="mrow s"><input class="fi sm" type="number" min="0" step=".01" placeholder="Grams of silver" value="'+(S.silver[i].grams||'')+'" data-l="silver" data-i="'+i+'" data-f="grams">'+del('silver',i)+'</div>'},
liab:function(i){return '<div class="row"><div class="rg due">'+sel('liab',i,'type',LIABT)+txt('liab',i,'label',S.liab[i].type==='other'?'Add your own label':'Optional note')+money('liab',i,'amount','$')+del('liab',i)+'</div><p class="help">'+(S.liab[i].type==='other'?'Use the label column to remember what this amount is for.':'Only include the portion due within the relevant period.')+'</p></div>'}
};
function renderList(k){var el=$('[data-list="'+k+'"]');if(!el)return;el.innerHTML=S[k].map(function(_,i){return R[k](i)}).join('')}
function renderAll(){['cash','business','owed','inv','fx','gold','silver','liab'].forEach(renderList);$('#interest').value=S.interest||'';calc()}
function sum(a,f){return a.reduce(function(s,r){return s+Math.max(0,r[f]||0)},0)}
function fxCad(r){var rate=r.cur==='USD'?CAD:r.cur==='GBP'?CAD/GBP:r.rate;return Math.max(0,r.amount)*Math.max(0,rate||0)}
var intent=null;
function calc(){
var cash=sum(S.cash,'amount'),biz=sum(S.business,'amount'),owed=sum(S.owed,'amount'),inv=sum(S.inv,'amount');
var fx=S.fx.reduce(function(s,r){return s+fxCad(r)},0);
var g=S.gold.reduce(function(s,r){return s+r.grams*gpg*(r.karat/24)},0),sv=S.silver.reduce(function(s,r){return s+r.grams*spg},0);
var due=sum(S.liab,'amount'),gross=cash+biz+owed+inv+fx+g+sv,used=Math.max(0,gross-due);
var goldN=GOLD_G*gpg,silN=SILVER_G*spg,which=used<goldN?'silver':'gold',nis=which==='gold'?goldN:silN,reached=used>=nis,z=reached?used*.025:0,pct=Math.min(100,nis?used/(nis*2)*100:0),need=Math.max(0,nis-used),I=S.interest||0;
$$('[data-tot="cash"]').forEach(function(e){e.textContent=fmt(cash)});$$('[data-tot="business"]').forEach(function(e){e.textContent=fmt(biz)});$$('[data-tot="owed"]').forEach(function(e){e.textContent=fmt(owed)});$$('[data-tot="inv"]').forEach(function(e){e.textContent=fmt(inv)});
$('#fxTot').textContent='$'+fx.toLocaleString('en-CA',{minimumFractionDigits:2,maximumFractionDigits:2})+' CAD';
$$('[data-fxline]').forEach(function(e){e.textContent='≈ $'+fxCad(S.fx[+e.getAttribute('data-fxline')]).toLocaleString('en-CA',{minimumFractionDigits:2,maximumFractionDigits:2})+' CAD'});
$('#metalTot').textContent=fmt(g+sv);$('#goldTot').textContent=fmt(g);$('#silverTot').textContent=fmt(sv);
$('#goldPG').textContent=fmt(gpg)+' per gram at the live reference price';$('#silverPG').textContent=fmt(spg)+' per gram at the live reference price';
$('#liabTot').textContent=fmt(due);
$('#nsV').textContent=fmt(silN);$('#ngV').textContent=fmt(goldN);$('#nbS').className='nb'+(which==='silver'?' on':'');$('#nbG').className='nb'+(which==='gold'?' on':'');
$('#autoSel').textContent='Auto-selected '+(which==='silver'?'Silver':'Gold')+' from your current eligible wealth. One lunar year is assumed.';
$('#zakat').textContent=fmt(z);$('#heroZ').textContent=fmt(z);$('#heroBar').style.width=pct+'%';$('#fill').style.width=pct+'%';
$('#zsub').textContent=reached?'Zakat estimate ready · one lunar year assumed':'Add more eligible wealth to reach the minimum';
$('#usedTop').textContent=fmt(used);
$('#stat').innerHTML=reached?'<span style="color:var(--gold)"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><path d="M5 12l5 5 9-10"/></svg></span><span><strong>Nisab reached.</strong> This estimate assumes one lunar year.</span>':'<span class="dot"></span><span>Add '+fmt(need)+' more to reach the minimum.</span>';
$('#gross').textContent=fmt(gross);$('#dueV').textContent='− '+fmt(due);$('#usedV').textContent=fmt(used);$('#zV').textContent=fmt(z);
$('#intRow').style.display=I>0?'flex':'none';$('#intV').textContent=fmt(I);
$('#selN').textContent=fmt(nis)+' · '+which+' standard';
var gb=$('#giveBtn');gb.disabled=!reached;gb.className='give '+(reached?'go':'off');gb.innerHTML=(I>0?'Review Zakat + interest':'Give Zakat')+' <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
var ib=$('#intBtn');ib.style.display=I>0?'block':'none';ib.textContent='Review interest donation · '+'$'+I.toLocaleString('en-CA',{minimumFractionDigits:2,maximumFractionDigits:2})+' CAD';
window.__st={used:used,z:z,I:I,nis:nis,which:which};
}
document.addEventListener('input',function(e){var t=e.target,l=t.getAttribute&&t.getAttribute('data-l');if(t.id==='interest'){S.interest=Math.max(0,Number(t.value)||0);calc();return}if(!l||t.tagName==='SELECT')return;var i=+t.getAttribute('data-i'),f=t.getAttribute('data-f');
if(t.getAttribute('data-t')){var v=t.value;if(t.getAttribute('data-up'))v=v.toUpperCase();S[l][i][f]=v}else S[l][i][f]=Math.max(0,Number(t.value)||0);calc()});
document.addEventListener('change',function(e){var t=e.target;if(t.tagName!=='SELECT')return;var l=t.getAttribute('data-l');if(!l)return;var i=+t.getAttribute('data-i'),f=t.getAttribute('data-f');
if(f==='karat')S[l][i][f]=Number(t.value);else S[l][i][f]=t.value;if(l==='cash')S.cash[i].label=t.value==='Other'?'':t.value;renderList(l);calc()});
document.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;
var d=b.getAttribute('data-del');if(d){var i=+b.getAttribute('data-i');if(S[d].length>1){S[d].splice(i,1);renderList(d);calc()}return}
var a=b.getAttribute('data-add');if(a){var n={fx:{cur:'USD',code:'',amount:0,rate:0},gold:{karat:24,grams:0},silver:{grams:0},liab:{type:'other',label:'',amount:0}}[a];S[a].push(JSON.parse(JSON.stringify(n)));renderList(a);calc();return}
var ai=b.getAttribute('data-addinv');if(ai){S.inv.push({type:ai,amount:0});renderList('inv');calc()}});
function reset(){S=fresh();renderAll();window.scrollTo({top:0,behavior:'smooth'})}
$('#reset1').onclick=reset;$('#reset2').onclick=reset;
$('#intBtn').onclick=function(){open('interest')};$('#giveBtn').onclick=function(){open('zakat')};
function open(k){intent=k;var s=window.__st,z=k==='zakat'?s.z:0;$('#vt').textContent=k==='interest'?'Review interest donation':'Please verify your information';
var mz=$('#mz'),mi=$('#mi');mz.style.display=z>0?'flex':'none';mz.lastChild.textContent=fmt(z);mi.style.display=s.I>0?'flex':'none';mi.lastChild.textContent=fmt(s.I);$('#mt').textContent=fmt(z+s.I);$('#modal').classList.add('open')}
function close(){$('#modal').classList.remove('open')}
$('#mclose').onclick=close;$('#mback').onclick=close;$('#mgo').onclick=function(){location.href='https://humanappeal.ca/appeals'};
$('#emailBtn').onclick=function(){var s=window.__st,body='Human Appeal Canada Zakat estimate\nAmount used for Zakat: '+fmt(s.used)+'\nEstimated Zakat at 2.5%: '+fmt(s.z)+'\nInterest to donate separately: '+fmt(s.I)+'\nCombined amount to enter at checkout: '+fmt(s.z+s.I)+'\nNisab: '+fmt(s.nis)+' ('+s.which+')\nAssumption: one lunar year';location.href='mailto:?subject='+encodeURIComponent('My Zakat calculator result')+'&body='+encodeURIComponent(body)};
function dl(){var a=document.createElement('a');a.href=URL.createObjectURL(new Blob(['<!DOCTYPE html>'+document.documentElement.outerHTML],{type:'text/html'}));a.download='human-appeal-canada-zakat-calculator.html';a.click()}
$('#dlBtn').onclick=dl;$('#dlBtn2').onclick=dl;
$('#gbtn').onclick=function(){var g=$('#guidance');g.classList.toggle('open');this.setAttribute('aria-expanded',g.classList.contains('open'))};
$$('.fq button').forEach(function(b){b.onclick=function(){var f=b.parentNode,o=f.classList.contains('open');$$('.fq').forEach(function(x){x.classList.remove('open');$('button',x).setAttribute('aria-expanded','false')});if(!o){f.classList.add('open');b.setAttribute('aria-expanded','true')}}});
$('#stog').onclick=function(){$('#srch').classList.toggle('open')};
$('#mtog').onclick=function(){$('#mnav').classList.toggle('open')};
$$('#mnav a[href^="#"]').forEach(function(a){a.onclick=function(){$('#mnav').classList.remove('open')}});
$('#yr').textContent=new Date().getFullYear();
var closeAnnouncement = $('#closeAnnouncement');
if (closeAnnouncement) closeAnnouncement.addEventListener('click', function(){ $('#ann').remove(); });
var printResult = $('#printResult');
if (printResult) printResult.addEventListener('click', function(){ window.print(); });
renderAll();
})();
