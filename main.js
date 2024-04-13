/**
 * @author Anay Mittal <anayttal@gmail.com>
 */

let scene = new THREE.Scene()
let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000)
let renderer = new THREE.WebGLRenderer({antialias: true});

renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('scene').appendChild(renderer.domElement)

let sphereGeo = new THREE.SphereGeometry(3, 32, 16)
let sphereMat = new THREE.MeshNormalMaterial({transparent: true, opacity: 1});
let sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);

scene.add(sphereMesh)
camera.position.z = 4;

function render(){
    requestAnimationFrame(render)
    renderer.render(scene,camera)
}

render();

function onDocumentLoad() {
    
}

document.addEventListener('load', onDocumentLoad, false);
