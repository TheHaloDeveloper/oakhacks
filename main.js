let scene = new THREE.Scene()
let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000)
let renderer = new THREE.WebGLRenderer({antialias: true});

renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('scene').appendChild(renderer.domElement)
renderer.setClearColor(0x87CEEB);

function render(){
    requestAnimationFrame(render)
    renderer.render(scene,camera)
}

render();

