/**
 * @author Anay Mittal <anayttal@gmail.com>
 */

let scene = new THREE.Scene()
let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000)
let renderer = new THREE.WebGLRenderer({antialias: true});
let tl = new TimelineMax();

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

setInterval(function() {
    tl.to(sphereMesh.material, 0.5, {opacity: 0, ease: "none"})
    tl.to(sphereMesh.material, 0.5, {opacity: 1, ease: "none"})
}, 10000)