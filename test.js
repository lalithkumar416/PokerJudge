const fs=require('fs');
const html=fs.readFileSync('index.html','utf8');
const src=html.split('ENGINE START')[1].split('/* ENGINE END */')[0];
const code='/*'+src.slice(src.indexOf('\n'))+'\nmodule.exports={evaluate5,compareScores,bestOfSeven,describe,judge,explainWin,CAT};';
fs.writeFileSync('/tmp/engine.js',code);
const E=require('/tmp/engine.js');
const P=s=>s.split(' ').map(t=>({rank:{T:10,J:11,Q:12,K:13,A:14}[t[0]]||+t[0],suit:t[1]}));
let fail=0;const eq=(a,b,m)=>{if(a!==b){fail++;console.log('FAIL',m,a,'!=',b)}};
const name=s=>E.bestOfSeven(P(s)).handName;
eq(E.describe(E.evaluate5(P('AS KS QS JS TS'))),'Royal Flush','royal');
eq(name('AH 2H 3H 4H 5H KD KC'),'Straight Flush, Five high','wheel SF');
eq(name('KS KH KD AS AH 2C 3D'),'Full House, Kings full of Aces','FH');
eq(name('KS KH KD AS AH AD 3D'),'Full House, Aces full of Kings','two trips→FH');
eq(name('9S 9H 9D 9C AH 2C 3D'),'Four of a Kind, Nines','quads');
eq(name('2S 5S 9S JS KS 3S AS'),'Flush, Ace high','6 suited, ace high');
eq(name('AH 2C 3D 4S 5H 9C KD'),'Straight, Five high','wheel');
eq(name('6H 7C 8D 9S TH 2C 2D'),'Straight, Ten high','straight w/ pair');
eq(name('2H 3C 4D 5S 6H 7C 9D'),'Straight, Seven high','6-card run');
eq(name('AH AC KD KS 2H 2C 9D'),'Two Pair, Aces and Kings','3 pairs picks best');
eq(name('AH AC 7D 8S 2H 3C 9D'),'One Pair, Aces','pair');
eq(name('AH QC 7D 8S 2H 3C 9D'),'High Card, Ace high','high');
eq(name('TS JS QS KS AS 2D 3D'),'Royal Flush','7 royal');
// SF beats higher flush in 7 cards
eq(name('5S 6S 7S 8S 9S AS KS'),'Straight Flush, Nine high','SF over flush');
// Kicker tests
let b=P('KH KD 7C 4S 2D');
let r=E.judge(b,[{name:'A',cards:P('AH 9C')},{name:'B',cards:P('QH JC')}]);
eq(r.winners.map(w=>w.name).join(),'A','kicker winner');
console.log(E.explainWin(r.rows[0],r.rows[1]));
// Two pair, same pairs, different kicker
b=P('AH AD KC KS 2D');
r=E.judge(b,[{name:'A',cards:P('QH 3C')},{name:'B',cards:P('JH 3D')},{name:'C',cards:P('9H 8C')}]);
eq(r.winners.map(w=>w.name).join(),'A','2pair kicker');
console.log(E.explainWin(r.rows[0],r.rows[1]));
// Split: board plays
b=P('TS JH QD KC AS');
r=E.judge(b,[{name:'A',cards:P('2H 3C')},{name:'B',cards:P('4H 5C')},{name:'C',cards:P('9H 2D')}]);
eq(r.winners.length,3,'broadway on board split');
r=E.judge(b,[{name:'A',cards:P('9H 3C')},{name:'B',cards:P('4H 5C')}]);
eq(r.winners.length,2,'both play broadway');
// Different suits same hand = split
b=P('AH AD KC KS 2D');
r=E.judge(b,[{name:'A',cards:P('QH 3C')},{name:'B',cards:P('QD 3S')}]);
eq(r.winners.length,2,'identical hands split');
// Frequencies over random 5-card hands
const deck=[];for(const s of 'SHDC')for(let r=2;r<=14;r++)deck.push({rank:r,suit:s});
const N=600000,cnt={};
for(let n=0;n<N;n++){
  for(let i=0;i<5;i++){const j=i+Math.floor(Math.random()*(52-i));[deck[i],deck[j]]=[deck[j],deck[i]];}
  const c=E.evaluate5(deck.slice(0,5))[0];cnt[c]=(cnt[c]||0)+1;
}
const exp={0:50.118,1:42.257,2:4.754,3:2.113,4:0.3925,5:0.1965,6:0.1441,7:0.0240,8:0.00139,9:0.000154};
for(const k in exp)console.log(k,(cnt[k]/N*100).toFixed(3),'expected',exp[k]);
console.log(fail?'FAILURES: '+fail:'ALL PASS');
