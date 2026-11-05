'use strict';
// Original illustrations: a different silhouette and markings for every species.
const FishArt=(()=>{
const ns='http://www.w3.org/2000/svg';
const art={
sardina:{body:'M10 31Q24 17 53 24L79 30 94 20 89 32 95 43 78 36Q37 48 10 31Z',color:'#72b8cc',fin:'M36 24 44 15 54 24M40 39 47 47 56 39',detail:'M17 33Q42 39 76 33M32 27l2 6m10-6 2 6m10-5 2 5',eye:[20,29]},
jurel:{body:'M8 32Q18 15 43 19Q63 19 77 29L94 17 89 32 95 45 76 35Q39 50 8 32Z',color:'#79b0a1',fin:'M32 21 38 10 44 20 52 12 59 23M44 41 50 49 60 40',detail:'M31 31Q53 36 77 32M59 29l1 6m5-6 1 5m5-5 1 4',eye:[19,28],spot:[27,29]},
salpa:{body:'M11 32Q16 15 39 15Q64 14 77 29L93 19 89 32 93 44 76 37Q41 57 15 39Z',color:'#dcbd6a',fin:'M28 17 40 7 54 16M33 46 43 55 58 44',detail:'M24 24Q49 20 72 29M21 30Q49 27 76 33M24 37Q47 35 69 38M31 43Q48 42 58 42',eye:[20,29]},
mugil:{body:'M8 31Q20 20 59 25L80 29 95 21 90 32 95 41 80 36Q37 47 8 35Z',color:'#a1b7c4',fin:'M35 24 41 16 47 24M61 25 67 18 72 28M49 39 56 47 64 38',detail:'M27 29 77 31M25 34 76 34M33 38 64 37',eye:[18,29]},
lubina:{body:'M6 32Q19 13 47 18Q63 18 79 28L95 19 90 33 96 45 77 37Q44 51 18 41L6 36Z',color:'#88acb3',fin:'M30 20 35 9 40 17 44 10 49 18 54 12 61 22M41 42 49 52 61 41',detail:'M7 34 20 34M26 23Q37 31 27 40M33 31Q53 35 76 32',eye:[17,28]},
sepia:{body:'M17 32Q22 13 50 14Q70 14 76 28Q79 41 57 46Q33 50 17 37Z',color:'#dba57e',fin:'M25 21Q13 12 15 29Q6 37 22 43M58 17Q86 17 82 34Q83 47 59 44',detail:'M17 31Q7 26 5 36M18 35Q4 43 14 47M23 40Q13 54 27 51M29 43Q25 57 39 51M38 45Q40 57 48 49M38 23l5 5m6-7 5 5m6-5 5 4',eye:[26,29]},
caballa:{body:'M7 30Q24 13 56 23L79 29 96 18 90 32 95 46 78 36Q33 49 7 34Z',color:'#64a6a9',fin:'M34 22 46 10 55 23M53 39 62 48 70 37',detail:'M31 22l7 8m1-10 7 11m2-10 7 10m2-8 7 9m3-6 5 6M22 35Q45 40 75 33',eye:[18,28]},
faneca:{body:'M9 34Q19 17 40 17Q63 17 77 29L94 23 90 34 94 44 76 39Q45 52 18 42Z',color:'#d4ac86',fin:'M30 19 32 10 42 17M47 19 52 9 59 22M46 44 54 54 64 43',detail:'M23 22Q32 33 23 42M33 32Q51 37 73 35M17 40l-2 8',eye:[19,29]},
rodaballo:{body:'M14 33Q28 4 49 8Q72 9 83 33Q70 56 48 56Q26 54 14 33Z',color:'#b5a382',fin:'M28 15 44 3 62 8 76 19M25 48 42 61 63 56 78 43M81 28 96 23 92 35 95 45 81 39',detail:'M30 19q-7 13-2 24M44 18l2 3m11-3 2 3m8 7 2 3m-23 6 2 3m12 5 2 3m-22 1 2 3',eye:[27,27],eye2:[33,22]},
congrio:{body:'M5 27Q17 18 31 26Q57 47 76 30Q83 25 95 29Q82 40 76 43Q53 57 28 37Q16 29 5 35Z',color:'#9d9ec2',fin:'M25 25Q48 35 59 35L69 27 84 25 91 29M28 39Q52 60 78 43',detail:'M7 31 17 31M24 29Q52 52 78 35',eye:[14,26]},
luna:{body:'M17 31Q12 13 34 13Q51 10 61 23L68 29 64 39Q54 54 34 52Q15 52 17 31Z',color:'#9eb6d8',fin:'M36 14Q38-2 46 3L48 15M35 50Q38 66 48 62L49 49M62 24 72 22 67 31 72 42 61 40',detail:'M26 24Q37 30 29 41M39 27q8-4 13 3M39 36q9 6 14-1',eye:[25,25]},
cristal:{body:'M30 38 21 22 42 4 63 21 55 39Q44 46 30 38Z',color:'#9cdbdb',fin:'M27 18 10 32 31 33M58 17 77 31 55 34',detail:'M31 39Q20 57 27 58M38 42Q31 62 41 57M45 42Q45 65 52 56M52 40Q65 61 69 51M39 14l4-3 4 3M35 22l2 3m13-3 2 3',eye:[35,32],eye2:[49,32]},
aguja:{body:'M3 31 20 28Q45 20 77 28L94 20 89 31 95 41 76 34Q45 39 20 33Z',color:'#79b7b1',fin:'M58 26 69 16 72 27M59 36 68 46 73 35',detail:'M5 31 24 31M28 30 76 31',eye:[27,28]},
gallo:{body:'M9 29Q25 9 51 14Q70 16 79 31Q64 51 36 50Q16 46 9 29Z',color:'#c3a77c',fin:'M22 17 43 6 67 13M22 43 40 58 64 47M76 26 94 20 90 33 95 44 76 38',detail:'M27 19Q17 31 28 42M39 22l10 4m-13 8 12 3m8-10 5 4',eye:[21,26],eye2:[28,22]},
rubio:{body:'M7 33 18 22 42 25Q65 20 80 29L94 22 91 33 96 43 78 37Q46 49 24 42Z',color:'#ce8b76',fin:'M31 26Q45 3 66 12L53 29M28 36Q45 61 66 49L51 34M42 25 48 13 56 23',detail:'M32 34 51 19M33 36 51 47M40 32 59 17M40 38 59 48M17 38l-3 10m8-8-1 10',eye:[18,29],finColor:'#78b3cf'},
dragon:{body:'M7 31Q14 15 29 23L43 28 54 22 65 31 77 26 92 32 81 42 66 39 55 45 42 39 26 43Q13 42 7 31Z',color:'#b19ad0',fin:'M22 24 27 7 34 26M41 28 48 12 56 25M61 29 68 12 73 28M33 41 41 56 46 40M58 43 66 55 71 39',detail:'M12 32 23 32M28 33q5 5 10 0m8 1q6 5 11 0m8 0 10 1',eye:[18,27],finColor:'#e6c879'},
boqueron:{body:'M7 32Q25 20 60 27L80 30 94 23 91 32 95 41 79 36Q36 43 7 35Z',color:'#8aafce',fin:'M45 26 52 17 59 26M49 38 56 45 63 37',detail:'M9 34 28 35M27 29Q49 33 78 32M26 37 72 35',eye:[18,29]},
dorada:{body:'M9 32Q16 12 43 13Q66 12 79 29L94 18 89 32 95 46 78 38Q46 56 17 42Z',color:'#d7bb78',fin:'M28 16 40 5 58 16M35 46 48 58 62 43',detail:'M17 22Q24 19 29 24M28 22Q36 31 27 42M38 27Q53 25 69 31',eye:[20,29],spot:[32,31]},
pulpo:{body:'M27 32Q18 8 41 6Q66 6 59 31L65 38Q77 36 82 43Q80 52 67 46L61 42Q73 55 62 58L51 43Q54 62 44 59L42 43Q35 63 27 57L33 41Q15 56 10 46Q13 39 27 35Z',color:'#bb8caa',fin:'',detail:'M19 45l5-3m8 11 3-6m10 8 1-7m14 5-4-7M31 16q9-6 16-1M36 34q6 4 10 0',eye:[32,27],eye2:[49,27]},
pejerrey:{body:'M7 30Q25 19 61 26L80 30 95 20 90 32 95 41 79 35Q36 42 7 34Z',color:'#9ec1cf',fin:'M29 25 36 16 44 25M62 27 68 20 73 28M49 37 56 45 64 36',detail:'M23 29 78 31M22 33 77 33',eye:[17,28]},
lenguado:{body:'M10 33Q22 17 51 17Q74 17 85 31Q77 46 48 47Q24 47 10 33Z',color:'#b99e7d',fin:'M20 22 41 11 65 14 79 23M19 41 38 52 66 49 79 40M83 27 96 23 94 33 97 42 83 38',detail:'M26 24Q17 33 28 40M41 26l3 2m9-4 3 2m10 5 3 2m-26 3 3 2m13 2 3 2',eye:[20,29],eye2:[27,26]},
pezvolador:{body:'M10 31Q29 19 60 27L79 30 94 20 90 32 96 43 79 36Q35 45 10 35Z',color:'#8ab6d6',fin:'M29 29Q41 3 70 4L57 29M30 35Q43 59 70 58L56 35',detail:'M33 28 57 9M39 30 65 10M33 37 57 53M40 35 64 51',eye:[21,29],finColor:'#b0d8df'},
espadin:{body:'M9 29Q26 18 59 25L79 30 93 21 89 32 95 42 78 36Q34 45 9 33Z',color:'#8aa5bd',fin:'M35 24 46 15 54 24M45 38 51 46 60 38',detail:'M25 29 76 31M26 34 73 34M29 25l4 3m9-4 4 3',eye:[19,27]},
sargo:{body:'M10 32Q20 10 47 13Q67 14 78 29L94 19 89 33 94 46 76 39Q44 55 17 43Z',color:'#b8c4ba',fin:'M25 17 36 6 41 14 47 7 57 17M38 46 50 56 62 42',detail:'M31 18 32 44M43 16 44 47M55 19 56 45M66 23 67 40M79 29 79 38',eye:[20,29]},
morena:{body:'M6 27Q19 15 34 31Q49 48 65 37Q79 22 95 28Q85 36 80 42Q59 62 35 44Q21 30 7 36Z',color:'#b5a26c',fin:'M25 27Q47 43 63 32Q79 18 94 26M38 47Q58 62 79 44',detail:'M8 32 20 32M28 29l2 3m8 7 2 3m10 3 2 3m10-5 2 3m8-10 2 3m9-9 2 3',eye:[17,26]},
gobio:{body:'M7 34Q8 22 27 23Q39 23 48 29L78 32 94 23 91 35 96 45 78 40 40 43Q13 48 7 34Z',color:'#b6a68a',fin:'M31 25 35 13 44 28M49 29 57 16 70 31M30 39 35 54 44 42',detail:'M13 37 24 38M27 28Q35 34 29 42M45 34l2 3m8-3 2 3m8-2 2 3',eye:[18,28]},
salmonete:{body:'M7 32Q19 16 44 21Q64 22 79 30L95 22 91 33 96 43 78 37Q40 49 16 41Z',color:'#d98779',fin:'M32 23 40 11 49 23M57 26 64 18 70 28M41 41 50 51 60 40',detail:'M13 39q-1 10 4 13M20 41q0 9 5 11M28 28Q50 29 74 33M30 36 69 37',eye:[18,29],finColor:'#eac17e'},
farol:{body:'M8 31Q16 14 38 15Q59 14 73 30L94 20 88 33 95 46 72 38Q42 56 17 43Z',color:'#6d9eb1',fin:'M37 17 47 5 58 20M35 46 47 57 59 43',detail:'M29 24Q38 32 30 42M37 40h1m8 2h1m8-3h1m8-4h1',eye:[20,28],glow:true},
herrera:{body:'M9 33Q20 14 44 18Q66 19 79 29L94 20 89 33 95 44 77 38Q43 52 17 42Z',color:'#c4bca0',fin:'M29 20 42 10 58 21M38 44 51 53 63 42',detail:'M31 21 32 43M41 20 42 45M51 21 52 44M61 24 62 42M71 27 72 39',eye:[19,30]},
merluza:{body:'M4 34Q14 19 33 24L65 29 82 31 96 24 92 35 97 43 79 40 35 43Q16 47 4 37Z',color:'#8babb8',fin:'M32 25 38 14 46 27M50 28 68 19 78 31M39 41 60 50 76 40',detail:'M6 36 21 35M28 27Q34 34 28 42M37 32 79 35',eye:[17,29]},
caballito:{body:'M49 10Q33 2 26 17L13 21 14 28 29 27Q27 35 35 40Q49 44 41 51Q34 56 29 50Q25 47 28 43Q18 46 23 55Q31 67 46 58Q63 47 48 32L45 25Q58 23 55 15Z',color:'#ddb871',fin:'M48 29 62 33 53 41M40 9 39 2 46 6 49 3 51 11',detail:'M34 30 46 29M35 36 49 35M40 42l9-1M17 24h9M35 19q2-3 5-1',eye:[38,17]},
bogavante:{body:'M45 15Q58 13 60 28L58 48 63 56 53 60 46 56 47 45 42 30Z',color:'#6b96bb',fin:'M45 21 27 17 26 8 16 4 11 14 18 23 29 25 43 30M58 22 74 17 75 7 85 3 91 13 84 23 72 25 58 31',detail:'M46 20h11m-12 8h13m-12 8h11m-10 8h9M46 30 31 33 27 40M45 36 34 40 31 47M58 31 71 35 74 42M58 38 69 43 71 49M48 15 40 3M55 15 62 2',eye:[47,20],eye2:[56,20]},
bonito:{body:'M5 31Q25 12 56 21Q70 24 80 29L96 15 89 33 97 50 78 37Q40 53 5 35Z',color:'#769abb',fin:'M31 23 46 5 51 22M52 41 65 54 68 39M70 28l3-6M75 29l3-4M72 39l3 5',detail:'M23 34Q52 42 77 33M34 21l-3 9m10-10-3 11m10-9-3 10m11-7-3 8',eye:[18,29]},
remo:{body:'M4 27Q21 19 40 31Q67 46 97 31Q84 51 56 45Q33 41 22 35L5 35Z',color:'#baaccc',fin:'M21 25 25 13 28 27 34 15 37 30 43 20 46 33 53 24 57 36 63 29 67 38 75 31 80 37 88 31M22 35 21 57M25 37 28 59',detail:'M8 32 20 32M32 33Q63 47 90 36',eye:[15,26],finColor:'#d8878f'},
breca:{body:'M9 32Q18 11 42 14Q65 14 78 29L94 19 89 33 95 45 76 39Q45 57 17 43Z',color:'#d59c9e',fin:'M25 18 38 6 55 16 64 23M35 47 48 57 63 43',detail:'M29 24Q35 33 28 42M38 25l2 2m9-3 2 2m9 1 2 2m-20 6 2 2m9-1 2 2',eye:[19,28],finColor:'#d7b17c'},
rape:{body:'M7 33Q3 15 30 14Q49 10 61 27L77 30 94 23 90 35 96 45 75 40 56 42Q29 58 7 33Z',color:'#9e92ab',fin:'M30 17Q26 2 40 5L43 10M15 36 4 50 29 43M50 36 66 51 68 39',detail:'M10 34Q29 48 45 32M15 37l3-5 3 8 4-7 4 8 5-8 4 5M42 10h1',eye:[18,25],eye2:[33,23],lure:true},
manta:{body:'M44 25 15 5Q11 21 3 34L27 45 44 36 60 45 83 32Q74 20 72 5L49 25Z',color:'#958ac2',fin:'M45 35Q45 53 61 60M35 24 31 17 38 18M54 24 59 17 52 18',detail:'M19 26l2-4 3 4-3 3ZM63 26l2-4 3 4-3 3ZM28 34h1m26 0h1M39 31q5 3 10 0',eye:[38,25],eye2:[52,25]}
};
function node(tag,attrs){const n=document.createElementNS(ns,tag);for(const [k,v]of Object.entries(attrs))n.setAttribute(k,v);return n;}
function drawFish(f,known=true){
 if(f.id==='rodolfo'){const img=document.createElement('img');img.src='rodolfo.svg';img.alt=known?'Rodolfo, langostino con bigotes, ojos grandes y sonrisa':'Langostino misterioso';if(!known)img.className='fish-undiscovered';return img;}
 const a=art[f.id];if(!a)throw new Error('Falta ilustración de '+f.id);
 const svg=node('svg',{viewBox:'0 0 100 66','aria-hidden':'true','data-species':f.id});
 if(!known)svg.classList.add('fish-undiscovered');
 const g=node('g',{stroke:'#263f53','stroke-width':1.65,'stroke-linecap':'round','stroke-linejoin':'round'});
 if(a.fin)g.append(node('path',{d:a.fin,fill:a.finColor||a.color}));
 g.append(node('path',{d:a.body,fill:a.color}));
 if(a.detail)g.append(node('path',{d:a.detail,fill:'none',stroke:a.glow?'#e6d394':'#375666','stroke-width':a.glow?2.7:1.2,opacity:a.glow?1:.65}));
 if(a.spot)g.append(node('circle',{cx:a.spot[0],cy:a.spot[1],r:2,fill:'#355061',stroke:'none'}));
 for(const [x,y]of [a.eye,a.eye2].filter(Boolean)){g.append(node('circle',{cx:x,cy:y,r:3.4,fill:'#fffcf1',stroke:'#263f53','stroke-width':1.1}));g.append(node('circle',{cx:x-.5,cy:y+.2,r:1.65,fill:'#20374b',stroke:'none'}));g.append(node('circle',{cx:x-1,cy:y-.5,r:.55,fill:'#fff',stroke:'none'}));}
 if(a.lure)g.append(node('circle',{cx:43,cy:9,r:3,fill:'#f3d887',stroke:'#a98545','stroke-width':1}));
 svg.append(g);return svg;
}
return {drawFish,ids:Object.freeze([...Object.keys(art),'rodolfo'])};
})();
