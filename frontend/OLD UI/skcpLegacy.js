/* ═══════ LANGUAGE ═══════ */
const LANG_LABELS={
  en:{overview:'Overview',orders:'Orders',quote:'Quote Builder',inventory:'Inventory',production:'Production',rawmat:'Raw Materials',catalogue:'Product Catalogue',customers:'Customers',pipeline:'Sales Pipeline',ledger:'Ledger',dispatch:'Dispatch',payments:'Payment Centre','online-orders':'Online Orders',labour:'Labour & Attendance',wages:'Wages & Payroll',timesheet:'Timesheet',notifications:'Alerts',calendar:'Calendar 2026',reports:'Reports & Analytics',map:'Location',contact:'Contact',settings:'Settings',about:'About Us',maintenance:'Maintenance',marketing:'Marketing Hub',brand:'Shree Kundodari\nCement Products',tagline:'B2B MANAGEMENT PORTAL'},
  hi:{overview:'अवलोकन',orders:'ऑर्डर',quote:'कोटेशन',inventory:'इन्वेंटरी',production:'उत्पादन',rawmat:'कच्चा माल',catalogue:'उत्पाद सूची',customers:'ग्राहक',pipeline:'बिक्री पाइपलाइन',ledger:'खाता बही',dispatch:'डिस्पैच',payments:'भुगतान केंद्र','online-orders':'ऑनलाइन ऑर्डर',labour:'श्रमिक',wages:'मजदूरी',timesheet:'टाइमशीट',notifications:'सूचनाएं',calendar:'कैलेंडर 2026',reports:'रिपोर्ट',map:'स्थान',contact:'संपर्क',settings:'सेटिंग',about:'हमारे बारे में',maintenance:'रख-रखाव',marketing:'मार्केटिंग',brand:'श्री कुंडोदरी\nसीमेंट उत्पाद',tagline:'B2B प्रबंधन पोर्टल'},
  mr:{overview:'विहंगावलोकन',orders:'ऑर्डर',quote:'कोटेशन',inventory:'यादी',production:'उत्पादन',rawmat:'कच्चा माल',catalogue:'उत्पाद सूची',customers:'ग्राहक',pipeline:'विक्री पाइपलाइन',ledger:'खातेवही',dispatch:'डिस्पॅच',payments:'देयक केंद्र','online-orders':'ऑनलाइन ऑर्डर',labour:'कामगार',wages:'मजुरी',timesheet:'टाइमशीट',notifications:'सूचना',calendar:'दिनदर्शिका 2026',reports:'अहवाल',map:'स्थान',contact:'संपर्क',settings:'सेटिंग्ज',about:'आमच्याबद्दल',maintenance:'देखभाल',marketing:'मार्केटिंग',brand:'श्री कुंडोदरी\nसिमेंट उत्पादने',tagline:'B2B व्यवस्थापन पोर्टल'},
  kn:{overview:'ಅವಲೋಕನ',orders:'ಆರ್ಡರ್',quote:'ಉದ್ಧರಣ',inventory:'ಇನ್ವೆಂಟರಿ',production:'ಉತ್ಪಾದನೆ',rawmat:'ಕಚ್ಚಾ ವಸ್ತು',catalogue:'ಉತ್ಪನ್ನ ಪಟ್ಟಿ',customers:'ಗ್ರಾಹಕರು',pipeline:'ಮಾರಾಟ ಪೈಪ್‌ಲೈನ್',ledger:'ಲೆಡ್ಜರ್',dispatch:'ಡಿಸ್ಪ್ಯಾಚ್',payments:'ಪಾವತಿ ಕೇಂದ್ರ','online-orders':'ಆನ್‌ಲೈನ್ ಆರ್ಡರ್',labour:'ಕಾರ್ಮಿಕ',wages:'ವೇತನ',timesheet:'ಟೈಮ್‌ಶೀಟ್',notifications:'ಎಚ್ಚರಿಕೆಗಳು',calendar:'ಕ್ಯಾಲೆಂಡರ್ 2026',reports:'ವರದಿಗಳು',map:'ಸ್ಥಳ',contact:'ಸಂಪರ್ಕ',settings:'ಸೆಟ್ಟಿಂಗ್‌ಗಳು',about:'ನಮ್ಮ ಬಗ್ಗೆ',maintenance:'ನಿರ್ವಹಣೆ',marketing:'ಮಾರ್ಕೆಟಿಂಗ್',brand:'ಶ್ರೀ ಕುಂಡೋದರಿ\nಸಿಮೆಂಟ್ ಉತ್ಪನ್ನಗಳು',tagline:'B2B ನಿರ್ವಹಣಾ ಪೋರ್ಟಲ್'}
};
let currentLang='en';
function setLang(code,btn){
  currentLang=code;
  document.querySelectorAll('.lang-btn').forEach(b=>b.classList.remove('active'));
  if(btn)btn.classList.add('active');
  const L=LANG_LABELS[code]||LANG_LABELS.en;
  // Update page title
  const pt=document.getElementById('page-title');
  const curPage=Object.keys(PT).find(k=>pt&&pt.textContent===PT[k]);
  if(curPage&&L[curPage])pt.textContent=L[curPage];
  // Update brand name
  const bn=document.querySelector('.brand-name');
  if(bn)bn.innerHTML=L.brand.replace('\n','<br>');
  const bs=document.querySelector('.brand-sub');
  if(bs)bs.textContent=L.tagline;
  // Update nav items text (match by icon)
  document.querySelectorAll('.nav-item').forEach(ni=>{
    const icon=ni.querySelector('i')?.className||'';
    const badge=ni.querySelector('.nav-badge');
    const map={'ti-layout-dashboard':'overview','ti-file-invoice':'orders','ti-calculator':'quote','ti-package':'inventory','ti-settings-2':'production','ti-stack-2':'rawmat','ti-world':'online-orders','ti-shopping-bag':'catalogue','ti-building':'customers','ti-chart-dots':'pipeline','ti-receipt-2':'ledger','ti-truck':'dispatch','ti-coin-rupee':'payments','ti-users':'labour','ti-wallet':'wages','ti-calendar-stats':'timesheet','ti-bell':'notifications','ti-calendar':'calendar','ti-chart-bar':'reports','ti-map-2':'map','ti-phone':'contact','ti-settings':'settings','ti-info-circle':'about','ti-tool':'maintenance','ti-speakerphone':'marketing'};
    const key=Object.keys(map).find(k=>icon.includes(k));
    if(key&&L[map[key]]){ni.childNodes.forEach(n=>{if(n.nodeType===3)n.textContent=L[map[key]];});if(badge)ni.appendChild(badge);}
  });
}

/* ═══════ THEME ═══════ */
let isDark=false;
function toggleTheme(){
  isDark=!isDark;
  document.documentElement.setAttribute('data-theme',isDark?'dark':'light');
  document.getElementById('theme-sw').classList.toggle('on',isDark);
  document.getElementById('theme-icon').className=isDark?'ti ti-moon':'ti ti-sun';
  document.getElementById('theme-label').textContent=isDark?'Dark Mode':'Light Mode';
  const s=document.getElementById('settings-theme-sw');if(s)s.classList.toggle('on',isDark);
  setTimeout(()=>{destroyCharts();initVisibleCharts();},50);
}

/* ═══════ NAV ═══════ */
const PT={overview:'Sales Overview',orders:'Orders',quote:'Quote Builder',inventory:'Inventory',production:'Production',rawmat:'Raw Materials',catalogue:'Product Catalogue',customers:'Customers',pipeline:'Sales Pipeline',ledger:'Ledger',dispatch:'Dispatch',payments:'Payment Centre',labour:'Labour & Attendance',wages:'Wages & Payroll',timesheet:'Timesheet',notifications:'Alerts',calendar:'Calendar 2026',reports:'Reports & Analytics',map:'Location',contact:'Contact',settings:'Settings',about:'About Us',maintenance:'Maintenance',marketing:'Marketing Hub'};
function nav(id,el){
  document.querySelectorAll('.section').forEach(s=>s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  const sec=document.getElementById('sec-'+id);if(!sec)return;
  sec.classList.add('active');
  if(el)el.classList.add('active');
  document.getElementById('page-title').textContent=PT[id]||id;
  initVisibleCharts();
  if(id==='timesheet')renderTimesheet();
  if(id==='calendar')renderCalendar();
  if(id==='labour')startLClock();
  if(id==='wages'){renderWagesTable();populateSelects();}
  if(id==='catalogue')renderCatalogue();
  if(id==='reports')initReportCharts();
  if(id==='pipeline')initPipeChart();
  if(id==='payments'){initPayments();updatePayKPIs();}
  if(id==='maintenance'){/* tabs already active */}
  if(id==='rawmat'){initRawMatCharts();}
  if(id==='inventory'){initInvCharts();}
  if(id==='marketing'){setTimeout(initMktChannelsChart,50);}
}

function showAlert(id,type,msg){
  const el=document.getElementById(id);if(!el)return;
  el.className=`alert ${type} show`;el.innerHTML=`<i class="ti ti-circle-check"></i> ${msg}`;
  setTimeout(()=>el.classList.remove('show'),3500);
}

function showSubSection(cid,pid,tab){
  const c=document.getElementById(cid);if(!c)return;
  c.querySelectorAll('.tab-panel').forEach(p=>p.classList.remove('active'));
  c.parentElement.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
  const p=document.getElementById(pid);if(p)p.classList.add('active');
  if(tab)tab.classList.add('active');
}

function showToast(msg,type='s'){
  const t=document.getElementById('toast');
  t.className=`toast ${type}`;t.innerHTML=`<i class="ti ti-circle-check"></i> ${msg}`;t.style.display='flex';
  setTimeout(()=>{t.style.display='none';},3000);
}

/* ═══════ CHARTS ═══════ */
const charts={};
function gc(){return getComputedStyle(document.documentElement).getPropertyValue('--chart-grid').trim();}
function tc(){return getComputedStyle(document.documentElement).getPropertyValue('--chart-tick').trim();}
function ac(){return isDark?'#579DFF':'#0C66E4';}
function destroyCharts(){Object.keys(charts).forEach(k=>{if(charts[k]){charts[k].destroy();delete charts[k];}});}
function mkChart(id,cfg){if(charts[id])charts[id].destroy();const el=document.getElementById(id);if(!el)return;charts[id]=new Chart(el,cfg);}
function initVisibleCharts(){const sec=document.querySelector('.section.active');if(!sec)return;const id=sec.id;if(id==='sec-overview')initOvCharts();if(id==='sec-production')initProdChart();if(id==='sec-reports')initReportCharts();if(id==='sec-pipeline')initPipeChart();if(id==='sec-rawmat')initRawMatCharts();if(id==='sec-inventory')initInvCharts();}
function initRawMatCharts(){
  mkChart('c-rm-monthly',{type:'bar',data:{labels:['Jan','Feb','Mar','Apr','May','Jun'],datasets:[{label:'Cement (bags)',data:[1620,1580,1740,1690,1810,1860],backgroundColor:ac(),borderRadius:4}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{grid:{color:gc()},ticks:{color:tc(),font:{size:10}}},y:{grid:{color:gc()},ticks:{color:tc(),font:{size:10}}}}}});
  mkChart('c-rm-mix',{type:'doughnut',data:{labels:['Cement','Sand','Aggregate','Water'],datasets:[{data:[46,24,22,8],backgroundColor:['#0C66E4','#22A06B','#FFAB00','#6E5DC6'],borderWidth:0}]},options:{responsive:true,maintainAspectRatio:false,cutout:'62%',plugins:{legend:{labels:{color:tc(),font:{size:10},boxWidth:10}}}}});
  mkChart('c-rm-yearly',{type:'line',data:{labels:['2021','2022','2023','2024','2025','2026 (proj.)'],datasets:[{label:'Cement (bags/yr)',data:[16200,17800,19100,20400,21600,22800],borderColor:ac(),backgroundColor:ac()+'22',fill:true,tension:0.35,pointRadius:3,borderWidth:2}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{grid:{color:gc()},ticks:{color:tc(),font:{size:10}}},y:{grid:{color:gc()},ticks:{color:tc(),font:{size:10}}}}}});
}
function initOvCharts(){
  const m=['Jan','Feb','Mar','Apr','May','Jun'];
  mkChart('c-rev',{type:'line',data:{labels:m,datasets:[{label:'Revenue',data:[6.2,7.1,7.8,8.4,9.0,9.8],borderColor:ac(),backgroundColor:ac()+'22',fill:true,tension:0.4,pointRadius:4,borderWidth:2}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{grid:{color:gc()},ticks:{color:tc(),font:{size:10}}},y:{grid:{color:gc()},ticks:{color:tc(),font:{size:10},callback:v=>'₹'+v+'L'}}}}});
  mkChart('c-donut',{type:'doughnut',data:{labels:['Solid','Hollow','Paver'],datasets:[{data:[48,32,20],backgroundColor:['#0C66E4','#22A06B','#FFAB00'],borderWidth:0}]},options:{responsive:true,maintainAspectRatio:false,cutout:'66%',plugins:{legend:{display:false}}}});
}
function initProdChart(){mkChart('c-week',{type:'bar',data:{labels:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],datasets:[{label:'Blocks',data:[980,1100,1050,1200,1320,890,600],backgroundColor:ac(),borderRadius:4}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{grid:{color:gc()},ticks:{color:tc(),font:{size:10}}},y:{grid:{color:gc()},ticks:{color:tc(),font:{size:10}}}}}});}
function initInvCharts(){
  mkChart('c-inv-rawmat',{type:'bar',data:{labels:['Cement (bags)','Sand (t)','Coarse Agg. (t)','Fine Agg. (t)','Water (kL)'],datasets:[
    {label:'On-Site',data:[186,22.4,12.6,6.2,8],backgroundColor:ac(),borderRadius:4},
    {label:'Reorder Level',data:[300,10,8,5,2],backgroundColor:isDark?'#454F59':'#DCDFE4',borderRadius:4}
  ]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{labels:{color:tc(),font:{size:10}}}},scales:{x:{grid:{color:gc()},ticks:{color:tc(),font:{size:10}}},y:{grid:{color:gc()},ticks:{color:tc(),font:{size:10}}}}}});
}
function initReportCharts(){
  mkChart('c-margin',{type:'line',data:{labels:['Jan','Feb','Mar','Apr','May','Jun'],datasets:[{label:'Revenue',data:[6.2,7.1,7.8,8.4,9.0,9.8],borderColor:'#4caf7d',tension:0.4,pointRadius:3,borderWidth:2},{label:'Cost',data:[3.9,4.4,4.7,5.0,5.5,5.9],borderColor:'#e24b4a',tension:0.4,pointRadius:3,borderWidth:2,borderDash:[5,4]}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{labels:{color:tc(),font:{size:11},boxWidth:12}}},scales:{x:{grid:{color:gc()},ticks:{color:tc(),font:{size:10}}},y:{grid:{color:gc()},ticks:{color:tc(),font:{size:10},callback:v=>'₹'+v+'L'}}}}});
  mkChart('c-attend',{type:'bar',data:{labels:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],datasets:[{data:[94,91,96,89,93,88,0,0,0,0,0,0],backgroundColor:['#0C66E4','#0C66E4','#0C66E4','#0C66E4','#0C66E4','#0C66E4','#DCDFE4','#DCDFE4','#DCDFE4','#DCDFE4','#DCDFE4','#DCDFE4'],borderRadius:4}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{grid:{color:gc()},ticks:{color:tc(),font:{size:10}}},y:{grid:{color:gc()},ticks:{color:tc(),font:{size:10},callback:v=>v+'%'},max:100,min:0}}}});
}
function initPipeChart(){mkChart('c-pipe',{type:'doughnut',data:{labels:['Lead','Quote','Negotiation','PO'],datasets:[{data:[6.2,4.8,5.4,2.0],backgroundColor:['#378add','#e8a317','#9b59b6','#4caf7d'],borderWidth:0}]},options:{responsive:true,maintainAspectRatio:false,cutout:'55%',plugins:{legend:{labels:{color:tc(),font:{size:10},boxWidth:10}}}}});}

/* ═══════ ORDERS ═══════ */
const ORDERS=[
  {id:'#1042',cust:'Rajesh Constructions',product:'Solid 6" Block',qty:500,amount:'₹18,500',date:'Jun 15',payment:'Paid',status:'Delivered'},
  {id:'#1041',cust:'Patil Builders',product:'Hollow 8" Block',qty:300,amount:'₹14,400',date:'Jun 16',payment:'Partial',status:'In Transit'},
  {id:'#1040',cust:'Suresh Infra',product:'Paver I-Block',qty:800,amount:'₹22,400',date:'Jun 14',payment:'Paid',status:'Delivered'},
  {id:'#1039',cust:'Ganesh Homes',product:'Solid 4" Block',qty:400,amount:'₹13,200',date:'Jun 17',payment:'Pending',status:'Pending'},
  {id:'#1038',cust:'Shankar Traders',product:'Hollow 6" Block',qty:250,amount:'₹10,000',date:'Jun 14',payment:'Paid',status:'Delivered'},
  {id:'#1037',cust:'Kiran Developers',product:'Paver Hex',qty:600,amount:'₹18,000',date:'Jun 18',payment:'Advance',status:'Pending'},
];
const SB={Delivered:'bg','In Transit':'ba',Pending:'br',Cancelled:'br'};
const PB={Paid:'bg',Partial:'ba',Pending:'br',Advance:'bi'};
function renderOrders(list){document.getElementById('orders-body').innerHTML=list.map(o=>`<tr><td><b>${o.id}</b></td><td>${o.cust}</td><td class="mu">${o.product}</td><td>${o.qty}</td><td><b>${o.amount}</b></td><td class="mu">${o.date}</td><td><span class="badge ${PB[o.payment]||'bi'}">${o.payment}</span></td><td><span class="badge ${SB[o.status]||'bi'}">${o.status}</span></td></tr>`).join('');}
renderOrders(ORDERS);
function filterOrders(q,sid){const s=document.getElementById(sid)?.value||'All';renderOrders(ORDERS.filter(o=>(s==='All'||o.status===s)&&(!q||[o.id,o.cust,o.product].some(v=>v.toLowerCase().includes(q.toLowerCase())))));}

/* ═══════ QUOTE ═══════ */
const QI=[];let qNum=47;
function addQuoteItem(){
  const sel=document.getElementById('q-product').value;if(!sel)return;
  const[name,price,sku]=sel.split('|');
  const qty=Math.max(1,parseInt(document.getElementById('q-qty').value)||1);
  const disc=Math.min(30,Math.max(0,parseFloat(document.getElementById('q-disc').value)||0));
  const ex=QI.find(i=>i.sku===sku);if(ex){ex.qty+=qty;}else QI.push({name,price:parseInt(price),qty,disc,sku});
  document.getElementById('q-prev-name').textContent=document.getElementById('q-company').value||'—';
  document.getElementById('q-prev-terms').textContent=document.getElementById('q-terms').value;
  renderQuote();
}
function renderQuote(){
  if(!QI.length){document.getElementById('quote-items').innerHTML='<div class="empty-state"><i class="ti ti-file-invoice"></i><p>Add products to build your quote</p></div>';updateTotals(0,0);return;}
  let tot=0,disc=0;
  document.getElementById('quote-items').innerHTML=QI.map((it,i)=>{const ld=it.price*it.qty*(it.disc/100),ln=it.price*it.qty-ld;tot+=ln;disc+=ld;return`<div class="q-item"><div class="qi-name">${it.name}</div><input class="qi-qty-inp" type="number" value="${it.qty}" min="1" onchange="updateQty(${i},this.value)"/><div class="qi-price">₹${Math.round(ln).toLocaleString('en-IN')}</div><div class="qi-del" onclick="removeItem(${i})"><i class="ti ti-x"></i></div></div>`;}).join('');
  updateTotals(tot,disc);
}
function updateTotals(sub,disc){const gst=Math.round(sub*.18);document.getElementById('q-sub').textContent='₹'+(Math.round(sub)+Math.round(disc)).toLocaleString('en-IN');document.getElementById('q-disc-amt').textContent='−₹'+Math.round(disc).toLocaleString('en-IN');document.getElementById('q-gst').textContent='₹'+gst.toLocaleString('en-IN');document.getElementById('q-total').textContent='₹'+(Math.round(sub)+gst).toLocaleString('en-IN');}
function updateQty(i,v){QI[i].qty=Math.max(1,parseInt(v)||1);renderQuote();}
function removeItem(i){QI.splice(i,1);renderQuote();}
function clearQuote(){QI.length=0;renderQuote();}
function sendQuote(){showAlert('q-alert','s',`Quote QUO-2026-00${++qNum} sent`);}

/* ═══════ CATALOGUE ═══════ */
const PRODS=[
  {name:'Solid Block 6"×8"×16"',sku:'SB-6816',price:37,icon:'ti-box',stock:1400,max:2000},
  {name:'Solid Block 4"×8"×16"',sku:'SB-4816',price:28,icon:'ti-box',stock:1400,max:2000},
  {name:'Hollow Block 2-hole',sku:'HB-2H',price:40,icon:'ti-layout-2',stock:1200,max:1600},
  {name:'Hollow Block 3-hole',sku:'HB-3H',price:44,icon:'ti-layout-grid',stock:980,max:1600},
  {name:'Paver Block I-shape',sku:'PB-I60',price:28,icon:'ti-hexagons',stock:800,max:1200},
  {name:'Paver Block Hex',sku:'PB-HX60',price:30,icon:'ti-hexagon',stock:600,max:1200},
];
function renderCatalogue(){
  document.getElementById('catalogue-grid').innerHTML=PRODS.map(p=>{
    const pct=Math.round((p.stock/p.max)*100);const sc=pct>60?'g':pct>30?'a':'r';
    return`<div class="product-card"><div class="product-icon"><i class="ti ${p.icon}"></i></div><div class="product-name">${p.name}</div><div class="product-sku">SKU: ${p.sku}</div><div class="product-price">₹${p.price}<span style="font-size:10px;color:var(--text3)">/unit</span></div><div class="stock-label" style="display:flex;justify-content:space-between;font-size:10px;color:var(--text3)"><span>Stock: ${p.stock.toLocaleString('en-IN')}</span><span>${pct}%</span></div><div class="prog"><div class="pf ${sc}" style="width:${pct}%"></div></div><div class="add-to-cart" style="margin-top:8px" onclick="openQuote('${p.name}|${p.price}|${p.sku}')">Request Quote →</div></div>`;
  }).join('');
}
function openQuote(val){nav('quote',null);setTimeout(()=>{document.getElementById('q-product').value=val;},100);}

/* ═══════ LABOUR ═══════ */
const LABOUR=[
  {id:1,name:'Ramesh Kumar',role:'Block Maker',wage:550,status:'in',checkin:'7:02 AM',checkout:'',adv:2000},
  {id:2,name:'Suresh Bhosale',role:'Mixer Operator',wage:600,status:'in',checkin:'7:05 AM',checkout:'',adv:0},
  {id:3,name:'Mahesh Patil',role:'Loader',wage:480,status:'in',checkin:'7:10 AM',checkout:'',adv:0},
  {id:4,name:'Ganesh Thorat',role:'Block Maker',wage:550,status:'in',checkin:'7:03 AM',checkout:'',adv:0},
  {id:5,name:'Raju Jadhav',role:'Helper',wage:420,status:'in',checkin:'7:15 AM',checkout:'',adv:0},
  {id:6,name:'Santosh More',role:'Block Maker',wage:550,status:'in',checkin:'7:08 AM',checkout:'',adv:0},
  {id:7,name:'Vijay Shinde',role:'Loader',wage:480,status:'in',checkin:'7:12 AM',checkout:'',adv:1500},
  {id:8,name:'Anil Waghmare',role:'Helper',wage:420,status:'in',checkin:'7:20 AM',checkout:'',adv:0},
  {id:9,name:'Dnyaneshwar Kale',role:'Supervisor',wage:800,status:'in',checkin:'7:00 AM',checkout:'',adv:0},
  {id:10,name:'Pravin Gaikwad',role:'Block Maker',wage:550,status:'in',checkin:'7:07 AM',checkout:'',adv:0},
  {id:11,name:'Kishor Deshmukh',role:'Driver',wage:650,status:'in',checkin:'7:30 AM',checkout:'',adv:0},
  {id:12,name:'Rajendra Yadav',role:'Helper',wage:420,status:'in',checkin:'7:45 AM',checkout:'',adv:0},
  {id:13,name:'Balaji Pawar',role:'Block Maker',wage:550,status:'absent',checkin:'',checkout:'',adv:0},
  {id:14,name:'Omkar Nikam',role:'Loader',wage:480,status:'absent',checkin:'',checkout:'',adv:0},
  {id:15,name:'Tushar Jagtap',role:'Helper',wage:420,status:'absent',checkin:'',checkout:'',adv:0},
];
let lclock;
function startLClock(){clearInterval(lclock);const upd=()=>{const el=document.getElementById('l-time');if(el)el.textContent=new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit',second:'2-digit'});};upd();lclock=setInterval(upd,1000);}
function toggleCheckin(id){const w=LABOUR.find(l=>l.id===id);if(!w)return;const now=new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'});if(w.status==='absent'){w.status='in';w.checkin=now;w.checkout='';}else if(w.status==='in'){w.status='out';w.checkout=now;}else{w.status='in';w.checkin=now;w.checkout='';}renderLabour();}
function renderLabour(){
  const lp=document.getElementById('l-present'),la=document.getElementById('l-absent');
  if(lp)lp.textContent=LABOUR.filter(l=>l.status==='in').length;
  if(la)la.textContent=LABOUR.filter(l=>l.status==='absent').length;
  const el=document.getElementById('labour-list');if(!el)return;
  el.innerHTML=LABOUR.map(l=>{
    const ini=l.name.split(' ').map(n=>n[0]).join('').substring(0,2);
    const isIn=l.status==='in',isAbs=l.status==='absent';
    const badge=isIn?'<span class="badge bg">Present</span>':(!isAbs?'<span class="badge ba">Out</span>':'<span class="badge br">Absent</span>');
    const times=(l.checkin?`In: ${l.checkin}`:'')+( l.checkout?` · Out: ${l.checkout}`:'');
    return`<div class="labour-row"><div class="avatar" style="background:var(--accent-bg);color:var(--accent)">${ini}</div><div style="flex:1"><div class="la-name">${l.name}</div><div class="la-role">${l.role} · ₹${l.wage}/day${times?' · '+times:''}</div></div>${badge}<button class="checkin-btn ${isIn?'ci-out':'ci-in'}" onclick="toggleCheckin(${l.id})">${isIn?'Check Out':'Check In'}</button></div>`;
  }).join('');
}
renderLabour();
function addLabour(){const n=document.getElementById('l-name').value.trim();if(!n){showAlert('labour-alert','e','Name required');return;}LABOUR.push({id:Math.max(...LABOUR.map(l=>l.id))+1,name:n,role:document.getElementById('l-role').value,wage:parseInt(document.getElementById('l-wage').value)||500,status:'absent',checkin:'',checkout:'',adv:0});renderLabour();populateSelects();showAlert('labour-alert','s',`${n} added`);document.getElementById('l-name').value='';}

/* ═══════ WAGES ═══════ */
function populateSelects(){
  ['pay-labour','adv-sel','ded-sel'].forEach(id=>{const s=document.getElementById(id);if(!s)return;const base=id==='pay-labour'?'<option value="">All labour</option>':'';s.innerHTML=base+LABOUR.map(l=>`<option value="${l.id}">${l.name}</option>`).join('');});
}
function getAtt(li,d){const s=(li*31+d*7)%100;return s<75?'P':s<88?'H':'A';}
function renderWagesTable(){
  const el=document.getElementById('wages-register-table');if(!el)return;
  const yr=2026,mo=5,days=new Date(yr,mo+1,0).getDate();let rows='';
  LABOUR.forEach((l,li)=>{let p=0,h=0,a=0;for(let d=1;d<=days;d++){if(new Date(yr,mo,d).getDay()===0)continue;const att=getAtt(li,d);if(att==='P')p++;else if(att==='H'){p+=.5;h++;}else a++;}const g=Math.round(p*l.wage),pf=Math.round(g*.12),net=g-pf-l.adv;rows+=`<tr><td><b>${l.name}</b></td><td class="mu">${l.role}</td><td class="mu">₹${l.wage}</td><td style="color:var(--green-t)">${Math.round(p)}</td><td style="color:var(--amber-t)">${h}</td><td style="color:var(--red-t)">${a}</td><td style="color:var(--green-t)">₹${g.toLocaleString('en-IN')}</td><td class="mu">₹${pf.toLocaleString('en-IN')}</td><td class="mu">${l.adv>0?'₹'+l.adv.toLocaleString('en-IN'):'—'}</td><td><b>₹${Math.max(0,net).toLocaleString('en-IN')}</b></td><td><span class="payment-status ${net>0?'ps-pending':'ps-paid'}">${net>0?'Pending':'Paid'}</span></td></tr>`;});
  el.innerHTML=`<table><thead><tr><th>Name</th><th>Role</th><th>Daily Rate</th><th>Days</th><th>Half Days</th><th>Absent</th><th>Gross</th><th>PF</th><th>Advance</th><th>Net Payable</th><th>Status</th></tr></thead><tbody>${rows}</tbody></table>`;
  const hb=document.getElementById('wages-history-body');if(hb)hb.innerHTML=LABOUR.slice(0,8).map((l,li)=>{const p=22+(li%3),ot=(li%4)*2,g=p*l.wage+ot*l.wage/8,net=Math.round(g-g*.12);return`<tr><td class="mu">May 2026</td><td><b>${l.name}</b></td><td>${p}</td><td class="mu">₹${l.wage}</td><td class="mu">${ot}</td><td class="mu">₹${Math.round(ot*l.wage/8)}</td><td class="mu">—</td><td><b>₹${net.toLocaleString('en-IN')}</b></td><td class="mu">May 31</td><td class="mu">Cash</td><td><span class="badge bg">Paid</span></td></tr>`;}).join('');
}

/* ═══════ TIMESHEET ═══════ */
const HOL={'2026-01-14':'Makar Sankranti','2026-01-26':'Republic Day','2026-03-03':'Holi','2026-03-27':'Good Friday','2026-04-14':'Dr. Ambedkar Jayanti','2026-05-01':'Maharashtra Day','2026-05-15':'Buddha Purnima','2026-06-17':'Eid ul-Adha','2026-08-15':'Independence Day','2026-09-02':'Ganesh Chaturthi','2026-10-02':'Gandhi Jayanti','2026-10-21':'Dussehra','2026-11-01':'Diwali','2026-11-15':'Guru Nanak Jayanti','2026-12-25':'Christmas'};
function getHol(y,m,d){return HOL[`${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`]||null;}
function isSun(y,m,d){return new Date(y,m,d).getDay()===0;}
function renderTimesheet(){
  const mo=parseInt(document.getElementById('ts-month')?.value||5);
  const yr=parseInt(document.getElementById('ts-year')?.value||2026);
  const days=new Date(yr,mo+1,0).getDate();
  const wd=[...Array(days)].filter((_,i)=>!isSun(yr,mo,i+1)&&!getHol(yr,mo,i+1)).length;
  const el=document.getElementById('ts-days');if(el)el.textContent=wd;
  const hd=document.getElementById('ts-head'),bd=document.getElementById('ts-body');if(!hd||!bd)return;
  let h='<tr><th style="text-align:left;padding:5px 8px;white-space:nowrap">Name</th>';
  for(let d=1;d<=days;d++){const s=isSun(yr,mo,d),hl=getHol(yr,mo,d);h+=`<th class="ts-cell" style="${s||hl?'color:var(--text3)':''}">${d}</th>`;}
  h+='<th class="ts-cell">Days</th><th class="ts-cell">Wages</th></tr>';hd.innerHTML=h;
  bd.innerHTML=LABOUR.map((l,li)=>{let p=0,cells='';for(let d=1;d<=days;d++){const s=isSun(yr,mo,d),hl=getHol(yr,mo,d);if(s||hl){cells+=`<td class="ts-cell ts-x">—</td>`;continue;}const a=getAtt(li,d);if(a==='P'){p++;cells+=`<td class="ts-cell ts-p">P</td>`;}else if(a==='H'){p+=.5;cells+=`<td class="ts-cell ts-h">½</td>`;}else cells+=`<td class="ts-cell ts-a">A</td>`;}return`<tr><td style="padding:5px 8px;white-space:nowrap;font-size:11px;color:var(--text)">${l.name.split(' ')[0]}</td>${cells}<td class="ts-cell ts-p" style="font-weight:600">${Math.round(p)}</td><td class="ts-cell" style="color:var(--accent);font-weight:600">₹${Math.round(p*l.wage).toLocaleString('en-IN')}</td></tr>`;}).join('');
}

/* ═══════ CALENDAR ═══════ */
const MN=['January','February','March','April','May','June','July','August','September','October','November','December'];
let calY=2026,calM=5;
function renderCalendar(){
  document.getElementById('cal-label').textContent=`${MN[calM]} ${calY}`;
  const days=new Date(calY,calM+1,0).getDate(),fd=new Date(calY,calM,1).getDay(),today=new Date();
  let html='';for(let i=0;i<fd;i++)html+='<div class="cal-cell empty"></div>';
  for(let d=1;d<=days;d++){const isT=d===today.getDate()&&calM===today.getMonth()&&calY===today.getFullYear(),sun=isSun(calY,calM,d),hol=getHol(calY,calM,d);let cls='cal-cell';if(isT)cls+=' today';else if(hol)cls+=' holiday';else if(sun)cls+=' weekend';const hn=hol?`<div class="cal-hn">${hol.length>13?hol.substring(0,11)+'…':hol}</div>`:'';html+=`<div class="${cls}"><div class="cal-num">${d}</div>${hn}</div>`;}
  document.getElementById('cal-grid').innerHTML=html;
  const rows=Object.entries(HOL).map(([k,v])=>{const[yr,mo,da]=k.split('-').map(Number);const dt=new Date(yr,mo-1,da);const dn=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][dt.getDay()];return{ts:dt.getTime(),row:`<tr><td>${da} ${MN[mo-1].substring(0,3)} ${yr}</td><td>${dn}</td><td>${v}</td><td><span class="badge br">Public</span></td></tr>`};});
  rows.sort((a,b)=>a.ts-b.ts);document.getElementById('holiday-list').innerHTML=rows.map(r=>r.row).join('');
}
function calNav(d){calM+=d;if(calM>11){calM=0;calY++;}if(calM<0){calM=11;calY--;}renderCalendar();}

/* ═══════ SEARCH ═══════ */
function handleSearch(q){if(!q)return;const l=q.toLowerCase();if(l.includes('pay'))nav('payments',null);else if(l.includes('order'))nav('orders',null);else if(l.includes('stock')||l.includes('inventory'))nav('inventory',null);else if(l.includes('labour')||l.includes('worker'))nav('labour',null);else if(l.includes('wage')||l.includes('salary'))nav('wages',null);else if(l.includes('produc'))nav('production',null);else if(l.includes('customer'))nav('customers',null);else if(l.includes('quote'))nav('quote',null);else if(l.includes('report'))nav('reports',null);}

/* ═══════════════════════════════════════════════════
   PAYMENT CENTRE — FULL IMPLEMENTATION
═══════════════════════════════════════════════════ */
const VENDORS=['ACC Cement Depot','Shinde Aggregates','Patil Stone Depot','PCMC Water Dept','Bhosari Tools & Spares','National Transport Co.','Raj Electricals','Sharma Packaging','Bharat Petroleum'];
const CUSTOMERS_LIST=['Rajesh Constructions','Patil Builders','Suresh Infra','Ganesh Homes','Sharma Infra','Kiran Developers','Omkar Infrastructure','Sai Builders','Nashik Housing Board'];

const PAY_METHODS=[
  {key:'qr',icon:'ti-qrcode',name:'QR / UPI',desc:'GPay · PhonePe · Paytm · BHIM'},
  {key:'upi',icon:'ti-brand-google',name:'UPI Direct',desc:'Bank-to-bank UPI transfer'},
  {key:'neft',icon:'ti-building-bank',name:'NEFT / RTGS',desc:'Bank wire transfer'},
  {key:'card',icon:'ti-credit-card',name:'Card',desc:'Debit / Credit / RuPay'},
  {key:'cheque',icon:'ti-writing',name:'Cheque / DD',desc:'Bank cheque or DD'},
  {key:'cash',icon:'ti-cash',name:'Cash',desc:'Physical cash payment'},
  {key:'other',icon:'ti-dots-circle-horizontal',name:'Other',desc:'Barter / Exchange / Other'},
];

const METHOD_ICONS={'UPI':'ti-qrcode','NEFT':'ti-building-bank','Cash':'ti-cash','Cheque':'ti-writing','Card':'ti-credit-card','Other':'ti-dots-circle-horizontal','QR':'ti-qrcode'};

let payDir='vendor';
let selMethod=null;
let pendingPay={};

// Seeded transaction history
let PAY_HISTORY=[
  {id:'TXN-001',dir:'out',party:'ACC Cement Depot',method:'NEFT',amount:42500,date:'Jun 17',ref:'INV-ACC-2341',status:'Paid',type:'Vendor'},
  {id:'TXN-002',dir:'in',party:'Rajesh Constructions',method:'UPI',amount:18500,date:'Jun 17',ref:'ORD-1042',status:'Paid',type:'Customer'},
  {id:'TXN-003',dir:'out',party:'Shinde Aggregates',method:'Cash',amount:3500,date:'Jun 17',ref:'CASH-015',status:'Paid',type:'Vendor'},
  {id:'TXN-004',dir:'in',party:'Suresh Infra',method:'NEFT',amount:22400,date:'Jun 15',ref:'ORD-1040',status:'Paid',type:'Customer'},
  {id:'TXN-005',dir:'out',party:'Patil Stone Depot',method:'Cheque',amount:14800,date:'Jun 14',ref:'CHQ-884231',status:'Processing',type:'Vendor'},
  {id:'TXN-006',dir:'in',party:'Patil Builders',method:'Card',amount:7200,date:'Jun 14',ref:'ORD-1041',status:'Paid',type:'Customer'},
  {id:'TXN-007',dir:'in',party:'Ganesh Homes',method:'Cash',amount:14200,date:'Jun 10',ref:'ORD-1033',status:'Pending',type:'Customer'},
  {id:'TXN-008',dir:'out',party:'National Transport Co.',method:'UPI',amount:6000,date:'Jun 13',ref:'TRNSP-001',status:'Paid',type:'Vendor'},
  {id:'TXN-009',dir:'in',party:'Sharma Infra',method:'NEFT',amount:15000,date:'Jun 13',ref:'ORD-ADV-037',status:'Paid',type:'Customer'},
  {id:'TXN-010',dir:'out',party:'Raj Electricals',method:'Cash',amount:2200,date:'Jun 12',ref:'MAINT-Jun',status:'Paid',type:'Vendor'},
];
let txnCounter=PAY_HISTORY.length+1;
let payHistFilter='All';

function fmtINR(n){return'₹'+Math.round(n).toLocaleString('en-IN');}

function updatePayKPIs(){
  const paid=PAY_HISTORY.filter(x=>x.dir==='out'&&x.status==='Paid').reduce((a,b)=>a+b.amount,0);
  const recv=PAY_HISTORY.filter(x=>x.dir==='in'&&x.status==='Paid').reduce((a,b)=>a+b.amount,0);
  const out=PAY_HISTORY.filter(x=>x.dir==='in'&&x.status==='Pending').reduce((a,b)=>a+b.amount,0);
  const today=PAY_HISTORY.filter(x=>x.date==='Jun 17').length;
  const proc=PAY_HISTORY.filter(x=>x.status==='Processing').length;
  const e=id=>document.getElementById(id);
  e('kpi-paid').textContent=fmtINR(paid);e('kpi-recv').textContent=fmtINR(recv);e('kpi-out').textContent=fmtINR(out);e('kpi-txn').textContent=today;e('kpi-proc').textContent=proc;
}

function initPayments(){
  renderPayMethods();
  renderPayHistory();
  renderMethodSummary();
  renderOutstanding();
  updatePartySelect();
  generateQR();
}

function setPayDir(dir){
  payDir=dir;selMethod=null;
  document.getElementById('dir-vendor').classList.toggle('active',dir==='vendor');
  document.getElementById('dir-customer').classList.toggle('active',dir==='customer');
  document.getElementById('pay-form-card').style.display='none';
  document.getElementById('qr-panel').style.display='none';
  document.getElementById('pay-receipt').style.display='none';
  renderPayMethods();
  updatePartySelect();
}

function renderPayMethods(){
  document.getElementById('pay-method-grid').innerHTML=PAY_METHODS.map(m=>`
    <div class="pay-method-card ${selMethod===m.key?'sel':''}" onclick="selectMethod('${m.key}')">
      <i class="ti ${m.icon}"></i>
      <div class="pm-name">${m.name}</div>
      <div class="pm-desc">${m.desc}</div>
    </div>`).join('');
}

function selectMethod(key){
  selMethod=key;
  renderPayMethods();
  document.getElementById('pay-receipt').style.display='none';
  // Show QR panel for qr method
  document.getElementById('qr-panel').style.display=(key==='qr')?'block':'none';
  // Show form
  const fc=document.getElementById('pay-form-card');
  fc.style.display='block';
  const titles={qr:'QR / UPI Payment',upi:'UPI Direct Payment',neft:'NEFT / RTGS Transfer',card:'Card Payment',cheque:'Cheque / DD Payment',cash:'Cash Payment',other:'Other Payment'};
  document.getElementById('pay-form-title').innerHTML=`<i class="ti ${PAY_METHODS.find(m=>m.key===key)?.icon||'ti-coin-rupee'}"></i> ${titles[key]||'Payment Details'} — ${payDir==='vendor'?'Pay to Vendor':'Receive from Customer'}`;
  document.getElementById('party-label').textContent=payDir==='vendor'?'Vendor *':'Customer *';
  // Extra fields
  const ef=document.getElementById('method-extra-fields');
  let extra='';
  if(key==='cheque'){extra=`<div class="fld"><label>Bank Name</label><input placeholder="e.g. SBI, HDFC"/></div><div class="fld"><label>Cheque Number</label><input placeholder="000000"/></div><div class="fld"><label>Cheque Date</label><input type="date" value="2026-06-17"/></div><div class="fld"><label>Branch</label><input placeholder="Branch name"/></div>`;}
  else if(key==='card'){extra=`<div class="fld"><label>Card Type</label><select><option>Visa</option><option>Mastercard</option><option>RuPay</option><option>Amex</option></select></div><div class="fld"><label>Last 4 Digits</label><input maxlength="4" placeholder="XXXX"/></div><div class="fld"><label>Bank / Issuer</label><input placeholder="e.g. SBI, HDFC"/></div>`;}
  else if(key==='neft'){extra=`<div class="fld"><label>Bank Name</label><input placeholder="Bank name"/></div><div class="fld"><label>UTR / Reference No.</label><input placeholder="UTR number"/></div><div class="fld"><label>Account No. (last 4)</label><input maxlength="4" placeholder="XXXX"/></div>`;}
  else if(key==='upi'||key==='qr'){extra=`<div class="fld"><label>UPI ID (sender/receiver)</label><input value="kundodari@upi" placeholder="name@upi"/></div><div class="fld"><label>UPI Transaction ID</label><input placeholder="Auto-filled after payment"/></div>`;}
  else if(key==='cash'){extra=`<div class="fld"><label>Received / Given by</label><input placeholder="Person name"/></div><div class="fld"><label>Denomination</label><select><option>Mixed</option><option>₹500 notes</option><option>₹200 notes</option><option>₹100 notes</option></select></div>`;}
  ef.style.display=extra?'grid':'none';ef.innerHTML=extra;
}

function updatePartySelect(){
  const sel=document.getElementById('pay-party');if(!sel)return;
  const list=payDir==='vendor'?VENDORS:CUSTOMERS_LIST;
  sel.innerHTML='<option value="">— Select party —</option>'+list.map(p=>`<option value="${p}">${p}</option>`).join('');
}

function updatePayAmt(){
  const amt=parseFloat(document.getElementById('pay-amount')?.value||0);
  document.getElementById('pay-preview-amt').textContent=fmtINR(amt);
  document.getElementById('pay-preview-gst').textContent=fmtINR(amt*.18);
  document.getElementById('pay-preview-net').textContent=fmtINR(amt*1.18);
}

function submitPay(){
  const party=document.getElementById('pay-party')?.value;
  const amount=parseFloat(document.getElementById('pay-amount')?.value||0);
  if(!party){showToast('Please select a party','e');return;}
  if(!amount||amount<=0){showToast('Please enter a valid amount','e');return;}
  if(!selMethod){showToast('Please select a payment method','e');return;}
  // Build confirm data
  const ref=document.getElementById('pay-ref')?.value||`AUTO-${Date.now().toString().slice(-6)}`;
  const date=document.getElementById('pay-date')?.value||'2026-06-17';
  const remarks=document.getElementById('pay-remarks')?.value||'';
  const methodName=PAY_METHODS.find(m=>m.key===selMethod)?.name||selMethod;
  pendingPay={party,amount,method:methodName,ref,date,remarks,dir:payDir==='vendor'?'out':'in',type:payDir==='vendor'?'Vendor':'Customer'};
  // Show confirm
  document.getElementById('confirm-rows').innerHTML=[
    ['Direction',payDir==='vendor'?'Pay to Vendor ↑':'Receive from Customer ↓'],
    ['Party',party],
    ['Method',methodName],
    ['Amount',fmtINR(amount)],
    ['Reference',ref],
    ['Date',date],
    ...(remarks?[['Remarks',remarks]]:[]),
  ].map(([k,v])=>`<div class="confirm-row"><span>${k}</span><span>${v}</span></div>`).join('');
  document.getElementById('pay-confirm').style.display='flex';
}

function closeConfirm(){document.getElementById('pay-confirm').style.display='none';}

function confirmPay(){
  closeConfirm();
  const id=`TXN-${String(txnCounter++).padStart(3,'0')}`;
  const newTxn={id,...pendingPay,status:pendingPay.method==='Cheque / DD'?'Processing':'Paid'};
  PAY_HISTORY.unshift(newTxn);
  // Show receipt
  document.getElementById('receipt-rows').innerHTML=[
    ['Transaction ID',newTxn.id],
    ['Party',newTxn.party],
    ['Method',newTxn.method],
    ['Amount',fmtINR(newTxn.amount)],
    ['Reference',newTxn.ref],
    ['Date',newTxn.date],
    ['Status',newTxn.status],
  ].map(([k,v])=>`<div class="pay-receipt-row"><span>${k}</span><span>${v}</span></div>`).join('');
  document.getElementById('pay-receipt').style.display='block';
  document.getElementById('pay-form-card').style.display='none';
  document.getElementById('qr-panel').style.display='none';
  // Reset form
  const pa=document.getElementById('pay-amount');if(pa)pa.value='';
  const pp=document.getElementById('pay-party');if(pp)pp.value='';
  const pr=document.getElementById('pay-ref');if(pr)pr.value='';
  selMethod=null;renderPayMethods();
  renderPayHistory();renderMethodSummary();renderOutstanding();updatePayKPIs();
  showToast(`${fmtINR(pendingPay.amount)} recorded successfully`);
}

function closeReceipt(){document.getElementById('pay-receipt').style.display='none';}
function printReceipt(){showToast('Print dialog would open in production','s');}
function cancelPay(){selMethod=null;renderPayMethods();document.getElementById('pay-form-card').style.display='none';document.getElementById('qr-panel').style.display='none';}

function filterPay(f,btn){
  payHistFilter=f;
  document.querySelectorAll('.pay-filter-btn').forEach(b=>b.classList.remove('active'));
  if(btn)btn.classList.add('active');
  renderPayHistory();
}

function renderPayHistory(){
  const list=PAY_HISTORY.filter(x=>{
    if(payHistFilter==='Vendor')return x.type==='Vendor';
    if(payHistFilter==='Customer')return x.type==='Customer';
    if(payHistFilter==='Pending')return x.status==='Pending';
    if(payHistFilter==='Processing')return x.status==='Processing';
    return true;
  });
  const STC={Paid:'bg',Pending:'ba',Processing:'bi'};
  document.getElementById('pay-history-body').innerHTML=list.map(tx=>`
    <tr>
      <td class="mu" style="font-size:11px">${tx.id}</td>
      <td><b style="font-size:12px">${tx.party.split(' ').slice(0,2).join(' ')}</b><br><span style="font-size:10px;color:var(--text3)">${tx.date}</span></td>
      <td><span style="display:flex;align-items:center;gap:4px;font-size:11.5px"><i class="ti ${METHOD_ICONS[tx.method.split(' ')[0]]||'ti-dots'}" style="font-size:14px"></i>${tx.method}</span></td>
      <td style="font-weight:700;color:${tx.dir==='in'?'var(--green-t)':'var(--red-t)'}">${tx.dir==='in'?'+':'−'}${fmtINR(tx.amount)}</td>
      <td><span style="font-size:10px;padding:2px 7px;border-radius:99px;font-weight:600;background:${tx.dir==='in'?'var(--green-bg)':'var(--red-bg)'};color:${tx.dir==='in'?'var(--green-t)':'var(--red-t)'}">${tx.dir==='in'?'↓ In':'↑ Out'}</span></td>
      <td class="mu" style="font-size:11px">${tx.ref}</td>
      <td><span class="badge ${STC[tx.status]||'bc'}">${tx.status}</span></td>
    </tr>`).join('');
}

function renderMethodSummary(){
  const methods=['UPI','NEFT','Cash','Cheque','Card','Other'];
  const maxAmt=150000;
  document.getElementById('method-summary').innerHTML=methods.map(m=>{
    const list=PAY_HISTORY.filter(x=>x.method.startsWith(m));
    const tot=list.reduce((a,b)=>a+b.amount,0);
    const pct=Math.min(100,Math.round((tot/maxAmt)*100));
    return`<div class="method-bar-row">
      <i class="ti ${METHOD_ICONS[m]||'ti-dots'} method-bar-icon"></i>
      <span class="method-bar-name">${m}</span>
      <div class="method-bar-track"><div class="method-bar-fill" style="width:${pct}%"></div></div>
      <span class="method-bar-val">${fmtINR(tot)}</span>
      <span class="method-bar-cnt">${list.length}x</span>
    </div>`;
  }).join('');
}

function renderOutstanding(){
  const list=PAY_HISTORY.filter(x=>x.status==='Pending'||x.status==='Processing');
  if(!list.length){document.getElementById('outstanding-list').innerHTML='<div style="font-size:12px;color:var(--text3);padding:12px 0;text-align:center">No outstanding payments</div>';return;}
  document.getElementById('outstanding-list').innerHTML=list.map(tx=>`
    <div class="outstanding-row">
      <div>
        <div style="font-size:12.5px;font-weight:500;color:var(--text)">${tx.party}</div>
        <div style="font-size:10px;color:var(--text3)">${tx.ref} · ${tx.date}</div>
      </div>
      <div style="text-align:right">
        <div style="font-size:13px;font-weight:700;color:${tx.status==='Pending'?'var(--amber-t)':'var(--blue-t)'}">${fmtINR(tx.amount)}</div>
        <span class="badge ${tx.status==='Pending'?'ba':'bi'}">${tx.status}</span>
      </div>
    </div>`).join('');
}

/* QR code — simple deterministic pixel pattern */
function generateQR(){
  const svg=document.getElementById('qr-svg');if(!svg)return;
  const cells=21,rects=[];
  const finder=(ox,oy)=>{for(let r=0;r<7;r++)for(let c=0;c<7;c++){const inner=r>0&&r<6&&c>0&&c<6,border=r===0||r===6||c===0||c===6;if(border||(r>1&&r<5&&c>1&&c<5&&!inner))rects.push(`<rect x="${(ox+c)}" y="${(oy+r)}" width="1" height="1" fill="#000"/>`);}};
  finder(0,0);finder(14,0);finder(0,14);
  for(let i=0;i<cells;i++)for(let j=0;j<cells;j++){if((i<8&&j<8)||(i<8&&j>13)||(i>13&&j<8))continue;if(((i*17+j*13+7)%3===0))rects.push(`<rect x="${j}" y="${i}" width="1" height="1" fill="#000"/>`);}
  svg.innerHTML=rects.join('');
}

/* ═══════ MAINTENANCE ═══════ */
function openMaintLog(eqId, eqName) {
  nav('maintenance', null);
  // Switch to log tab
  setTimeout(() => {
    showSubSection('maint-tabs', 'maint-log', null);
    // Also activate the tab button
    document.querySelectorAll('#maint-tabs-bar .tab').forEach((t,i) => {
      t.classList.toggle('active', i === 3);
    });
    const sel = document.getElementById('maint-eq');
    if (sel) sel.value = eqId;
    const desc = document.getElementById('maint-desc');
    if (desc) { desc.focus(); }
  }, 100);
}

function saveMaintLog() {
  const eq  = document.getElementById('maint-eq')?.value;
  const desc= document.getElementById('maint-desc')?.value?.trim();
  if (!eq)   { showAlert('maint-log-alert','e','Please select equipment'); return; }
  if (!desc) { showAlert('maint-log-alert','e','Please enter work description'); return; }
  const cost = document.getElementById('maint-cost')?.value || '0';
  const parts= document.getElementById('maint-parts')?.value || '—';
  const mType= document.getElementById('maint-type')?.value || '';
  const by   = document.getElementById('maint-by')?.value || '';
  const date = document.getElementById('maint-date')?.value || '';
  const next = document.getElementById('maint-next')?.value || '';
  const status= document.getElementById('maint-status')?.value || '';
  // Prepend to history table
  const tbody = document.getElementById('maint-history-body');
  if (tbody) {
    const eqText = document.getElementById('maint-eq')?.options[document.getElementById('maint-eq').selectedIndex]?.text || eq;
    const newRow = `<tr>
      <td class="mu">${date}</td>
      <td>${eqText}</td>
      <td><span class="badge bg">${mType.split(' ')[0]}</span></td>
      <td style="white-space:normal;max-width:200px;font-size:11.5px">${desc}</td>
      <td class="mu">${by}</td>
      <td class="mu">₹${parseInt(cost).toLocaleString('en-IN')}</td>
      <td class="mu">${parts}</td>
      <td class="mu">${next}</td>
      <td><span class="badge bg">${status.split(' ')[0]}</span></td>
    </tr>`;
    tbody.insertAdjacentHTML('afterbegin', newRow);
  }
  showAlert('maint-log-alert','s','Maintenance log saved successfully');
  // Reset form
  if(document.getElementById('maint-desc')) document.getElementById('maint-desc').value='';
  if(document.getElementById('maint-cost')) document.getElementById('maint-cost').value='';
  if(document.getElementById('maint-parts')) document.getElementById('maint-parts').value='';
}

/* ═══════ MARKETING ═══════ */
const WA_TEMPLATES = {
  promo: `🏗️ *Shree Kundodari Cement Products — Special Offer!*\n\nOrder 500+ Solid Blocks & get *5% extra discount*.\n\n📦 Solid Blocks ₹37/unit\n📦 Hollow Blocks ₹40/unit\n📦 Paver Blocks ₹28/unit\n\nIS 2185 Certified · Bhosari MIDC, Pune\n📞 98765 43210`,
  stock:  `📦 *Stock Available — Shree Kundodari*\n\nGood news! All products in stock for *immediate delivery*.\n✅ Solid Blocks · ✅ Hollow Blocks · ✅ Paver Blocks\n\nBulk discounts available. Call us today!\n📞 98765 43210 | info@kundodari.com`,
  intro:  `👋 *New Product Available!*\n\nShree Kundodari Cement Products is proud to introduce our *New Paver Block — Hex 60mm*.\n\nIS 15658 certified · ₹30/unit · Min 300 units\n📞 98765 43210`,
  fest:   `🎉 *Ganesh Chaturthi Special — Shree Kundodari*\n\nCelebrate with *8% off on Hollow Blocks* (min 300 units)\n\nValid: Sep 1–20, 2026 only.\nQuick delivery from Bhosari MIDC.\n📞 98765 43210`,
  remind: `🔔 *We miss you!*\n\nNamaste! Your last order from Shree Kundodari was 30+ days ago.\n\nStock ready. Order now & get *priority dispatch*.\n📞 98765 43210 | 📱 98765 43210 (WhatsApp)`
};

function previewWA() {
  const key = document.getElementById('wa-tmpl')?.value;
  const prev= document.getElementById('wa-preview');
  if (prev) prev.value = key ? WA_TEMPLATES[key] || '' : '';
}

function filterLeads(stage) {
  // Simple filter — in production this would filter the leads table
  showToast(stage === 'All Leads' ? 'Showing all leads' : `Filtered: ${stage}`);
}

// Marketing channels chart — init when section is opened
let mktChartInst = null;
function initMktChannelsChart() {
  const canvas = document.getElementById('c-channels');
  if (!canvas || mktChartInst) return;
  const gc = getComputedStyle(document.documentElement).getPropertyValue('--chart-grid').trim();
  const tc = getComputedStyle(document.documentElement).getPropertyValue('--chart-tick').trim();
  mktChartInst = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: ['WhatsApp','Referral','IndiaMart / JustDial','Phone','Walk-in','Other'],
      datasets: [{
        label: 'Leads',
        data: [18, 12, 9, 6, 4, 3],
        backgroundColor: ['#22A06B','#0C66E4','#6E5DC6','#579DFF','#B65C02','#6B778C'],
        borderRadius: 5
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: gc }, ticks: { color: tc, font: { size: 10 } } },
        y: { grid: { color: gc }, ticks: { color: tc, font: { size: 11 } } }
      }
    }
  });
}

/* ═══════ INIT ═══════ */
initRawMatCharts();
renderCalendar();
renderCatalogue();
populateSelects();
