import * as THREE from './vendor/three.module.js';
let moonTexture;
let seed=841;function rng(){seed=(seed*16807)%2147483647;return(seed-1)/2147483646}
const helper=new THREE.Object3D();
function rockGeometry(){const geo=new THREE.IcosahedronGeometry(1,1),p=geo.attributes.position;for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i),k=1+.13*Math.sin(x*13+y*7+z*11);p.setXYZ(i,x*k,y*k,z*k)}geo.computeVertexNormals();return geo}
function orbitLine(radius,color){const points=[];for(let i=0;i<=180;i++){const a=i/180*Math.PI*2;points.push(new THREE.Vector3(Math.cos(a)*radius,0,Math.sin(a)*radius))}return new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),new THREE.LineBasicMaterial({color,transparent:true,opacity:.14}))}
export function addOrbitalDetails(root,id,{closeup=false}={}){
 seed=841;
 if(id==='saturn'){
  const count=innerWidth<780?700:1300,mesh=new THREE.InstancedMesh(rockGeometry(),new THREE.MeshStandardMaterial({roughness:.94,metalness:0,flatShading:true}),count);mesh.name='saturn-ring-fragments';const dummyColor=new THREE.Color();
  for(let i=0;i<count;i++){let r=1.39+rng()*1.15;if(r>2.05&&r<2.16)r+=.13;const angle=rng()*Math.PI*2,scale=(.008+Math.pow(rng(),4)*.022)*(closeup?2.4:1);helper.position.set(Math.cos(angle)*r,(rng()-.5)*.025,Math.sin(angle)*r);helper.rotation.set(rng()*6,rng()*6,rng()*6);helper.scale.set(scale*(.65+rng()),scale*(.5+rng()*.7),scale*(.6+rng()));helper.updateMatrix();mesh.setMatrixAt(i,helper.matrix);dummyColor.setHSL(.10+rng()*.035,.08+rng()*.18,.48+rng()*.4);mesh.setColorAt(i,dummyColor)}mesh.instanceMatrix.needsUpdate=true;mesh.userData.orbitalSpeed=.018;root.add(mesh);
  const pos=[],colors=[];for(let i=0;i<4200;i++){let r=1.4+rng()*1.18;if(r>2.05&&r<2.16)continue;const a=rng()*Math.PI*2;pos.push(Math.cos(a)*r,(rng()-.5)*.012,Math.sin(a)*r);const c=.4+rng()*.55;colors.push(c,c*.94,c*.83)}const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));geo.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));const dust=new THREE.Points(geo,new THREE.PointsMaterial({vertexColors:true,size:closeup?.014:.008,transparent:true,opacity:.65,depthWrite:false}));dust.name='saturn-ring-ice';dust.userData.orbitalSpeed=.03;root.add(dust);
 }else if(id==='earth'){
  const pivot=new THREE.Group();pivot.name='moon-orbit';pivot.rotation.z=.12;const map=moonTexture||(moonTexture=new THREE.TextureLoader().load('./assets/moon.jpg'));map.colorSpace=THREE.SRGBColorSpace;const moon=new THREE.Mesh(new THREE.SphereGeometry(.19,32,24),new THREE.MeshStandardMaterial({map,roughness:1}));moon.position.set(2.12,.06,.65);pivot.add(moon);pivot.userData.orbitalSpeed=.035;root.add(pivot);root.add(orbitLine(2.22,0x83bfcf));
 }else if(id==='mars'){
  for(let i=0;i<2;i++){const pivot=new THREE.Group(),moon=new THREE.Mesh(rockGeometry(),new THREE.MeshStandardMaterial({color:i?'#978878':'#aaa094',roughness:1,flatShading:true}));moon.scale.set(.085-i*.024,.057-i*.014,.067-i*.016);moon.position.set(i?-1.9:1.82,i?.3:-.2,i?.6:.5);pivot.add(moon);pivot.userData.orbitalSpeed=i?.022:.048;root.add(pivot)}
 }else if(id==='jupiter'){
  const colors=['#c5af6e','#d4ccb8','#988e7e','#716c64'];for(let i=0;i<4;i++){const pivot=new THREE.Group(),m=new THREE.Mesh(new THREE.SphereGeometry(.07+(i===2?.025:0),24,16),new THREE.MeshStandardMaterial({color:colors[i],roughness:1})),a=.6+i*1.65;rng();m.position.set(Math.cos(a)*(1.93+i*.13),.08,Math.sin(a)*(1.93+i*.13));pivot.add(m);pivot.userData.orbitalSpeed=.04-i*.007;root.add(pivot)}
 }else if(id==='uranus'||id==='neptune'){
  for(let j=0;j<(id==='uranus'?5:3);j++){const radius=1.83+j*.065,line=orbitLine(radius,id==='uranus'?0x9baab5:0x718195);line.material.opacity=.22;root.add(line)}
 }
}
export function updateOrbitalDetails(root,dt){for(const o of root.children)if(o.userData.orbitalSpeed)o.rotation.y+=dt*o.userData.orbitalSpeed}
