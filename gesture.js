const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y,(a.z||0)-(b.z||0));
export function classifyHand(points){
 if(!points||points.length!==21||points.some(p=>![p.x,p.y,p.z??0].every(Number.isFinite)))return'none';
 if(dist(points[0],points[9])<.0001)return'none';let extended=0,folded=0;
 for(const[mcp,pip,tip]of[[5,6,8],[9,10,12],[13,14,16],[17,18,20]]){const a=dist(points[mcp],points[pip]),b=dist(points[pip],points[tip]),c=dist(points[mcp],points[tip]);const cos=(a*a+b*b-c*c)/Math.max(2*a*b,.0000001),reach=dist(points[tip],points[0])/Math.max(dist(points[pip],points[0]),.0001);if(cos<-.65&&reach>1.1)extended++;if(cos>-.25||reach<.92)folded++}
 return extended>=3?'open':folded>=3?'closed':'neutral';
}
export function createGestureFilter(){let last='none',count=0;return{reset(){last='none';count=0},update(gesture){if(gesture==='none'||gesture==='multiple'){last=gesture;count=0;return gesture}if(gesture===last)count++;else{last=gesture;count=1}return count>=3?gesture:'neutral'}}}
