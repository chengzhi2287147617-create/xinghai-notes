import * as THREE from './vendor/three.module.js';

// Textures are observation-based educational maps, not live imagery.
export const appearanceNotes={
 sun:'太阳光球纹理 · 色彩增强示意',mercury:'撞击坑与古老平原 · 地表地图',venus:'厚云层 · 云纹对比度增强',earth:'海陆地形 + 独立云层 + 大气薄层',mars:'氧化铁荒原、撞击坑与极冠',jupiter:'云带与大红斑 · 历史观测地图',saturn:'云带 + 冰粒光环 · 非实时外观',uranus:'淡青色大气 · 弱条带，非岩石表面',neptune:'大气云带 · 历史风暴特征示意'
};
const cache=new Map(),loader=new THREE.TextureLoader();
function load(name,extension='jpg',color=true){const key=name+'.'+extension;if(!cache.has(key)){const texture=loader.load('./assets/'+key,undefined,undefined,()=>{document.dispatchEvent(new CustomEvent('planet-texture-error',{detail:name}))});texture.colorSpace=color?THREE.SRGBColorSpace:THREE.NoColorSpace;texture.anisotropy=4;cache.set(key,texture)}return cache.get(key)}
function shell(root,radius,color,strength=.45){const m=new THREE.ShaderMaterial({uniforms:{tint:{value:new THREE.Color(color)},strength:{value:strength}},vertexShader:'varying vec3 n; varying vec3 p; void main(){n=normalize(normalMatrix*normal); vec4 v=modelViewMatrix*vec4(position,1.0);p=v.xyz;gl_Position=projectionMatrix*v;}',fragmentShader:'uniform vec3 tint; uniform float strength; varying vec3 n; varying vec3 p; void main(){float rim=pow(1.0-abs(dot(normalize(n),normalize(-p))),3.2);gl_FragColor=vec4(tint,4.0*rim*(1.0-rim)*strength);}',transparent:true,depthWrite:false,blending:THREE.AdditiveBlending});const s=new THREE.Mesh(new THREE.SphereGeometry(radius,80,56),m);root.add(s);return s}
export function buildPlanet(root,object,{venusSurface=false}={}){
 const id=object.id,radius=id==='saturn'?1.13:1.55,geo=new THREE.SphereGeometry(radius,96,64);
 const mapName=id==='venus'?(venusSurface?'venus-surface':'venus-clouds'):id;
 const map=load(mapName);let material;
 if(id==='sun')material=new THREE.MeshBasicMaterial({map,color:0xffffff});
 else material=new THREE.MeshStandardMaterial({map,color:0xffffff,roughness:id==='earth'?.64:.94,metalness:0});
 const body=new THREE.Mesh(geo,material);root.add(body);
 if(id==='earth'){
  material.normalMap=load('earth-normal','jpg',false);material.normalScale.set(.32,.32);
  const clouds=new THREE.Mesh(new THREE.SphereGeometry(radius*1.008,96,64),new THREE.MeshStandardMaterial({color:0xffffff,alphaMap:load('earth-clouds','jpg',false),transparent:true,opacity:.9,depthWrite:false,roughness:1}));clouds.userData.cloudLayer=true;root.add(clouds);shell(root,radius*1.028,'#609cfa',.6);root.rotation.z=.18;body.rotation.y=2.5;clouds.rotation.y=2.5;
 }else if(id==='venus'&&!venusSurface){shell(root,radius*1.019,'#eacaa0',.26);root.rotation.z=.03}
 else if(id==='mars'){shell(root,radius*1.006,'#d6956e',.1);root.rotation.y=2.25;root.rotation.z=.12}
 else if(id==='mercury'){root.rotation.y=2.2}
 else if(id==='sun'){shell(root,radius*1.035,'#ffaa35',.65);shell(root,radius*1.095,'#ed8025',.16)}
 else if(id==='saturn'){
  const inner=1.36,outer=2.55,ringGeo=new THREE.RingGeometry(inner,outer,192,1),p=ringGeo.attributes.position,uv=ringGeo.attributes.uv;
  for(let i=0;i<p.count;i++){const radius=Math.hypot(p.getX(i),p.getY(i));uv.setXY(i,(radius-inner)/(outer-inner),.5)}
  const rings=new THREE.Mesh(ringGeo,new THREE.MeshStandardMaterial({map:load('saturn-ring','png'),side:THREE.DoubleSide,transparent:true,alphaTest:.03,depthWrite:false,roughness:1}));rings.rotation.x=Math.PI/2;root.add(rings);root.rotation.x=.38;root.rotation.z=-.42;body.rotation.y=1.2;shell(root,radius*1.012,'#e5d4a7',.15);
 }else if(id==='uranus'){shell(root,radius*1.022,'#a0e1e6',.28);root.rotation.z=1.71;body.rotation.y=1.8}
 else if(id==='neptune'){shell(root,radius*1.018,'#779dcf',.32);root.rotation.z=.2;body.rotation.y=1.9}
 return body;
}
