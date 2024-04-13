/**
 * @author Anay Mittal <anayttal@gmail.com>
 */
let username = new URLSearchParams(window.location.search).get("username")
// history.replaceState({}, document.title, window.location.pathname);

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
let renderer = new THREE.WebGLRenderer({antialias: true});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x87CEEB);
document.getElementById("scene").appendChild(renderer.domElement);

camera.position.set(0, -22, 13);
camera.rotation.set(1, 0, 0);
camera.up.set(0, 0, 1);

let labelRenderer = new THREE.CSS2DRenderer();
labelRenderer.setSize( window.innerWidth, window.innerHeight );
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';
labelRenderer.domElement.style.pointerEvents = 'none';
document.getElementById('scene').appendChild(labelRenderer.domElement);

//Controls
let controls = new THREE.OrbitControls(camera, renderer.domElement);

//Player
let cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
let cubeMaterial = new THREE.MeshLambertMaterial({color: 0xff0000});
let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

cube.rotation.z = Math.PI / 2;
cube.position.z = 0.5;
scene.add(cube);

const text = document.createElement('div');
text.className = 'label';
text.style.fontSize = "20px"
text.style.fontFamily = "Verdana"
text.textContent = username;

const label = new THREE.CSS2DObject(text);
scene.add(label)

//Map
let gltfLoader = new THREE.GLTFLoader();
gltfLoader.load('assets/models/map.glb', function(gltf){
    gltf.scene.position.set(80, 0, -2.5);
    gltf.scene.rotation.x = Math.PI / 2;
    gltf.scene.scale.set(15, 15, 15);
    scene.add(gltf.scene);
})

//Lights
let light = new THREE.SpotLight(0xffffff, 3);
light.position.set(50, 0, 100);
scene.add(light);

let light2 = new THREE.SpotLight(0xffffff, 3);
light2.position.set(-50, 0, 100);
scene.add(light2);

let keyboard = {};
let player = {
    speed: 0.1
}

function player_movement() {
    if(keyboard[37]){ //left arrow key
        cube.rotation.z += Math.PI * 0.01;
    }

    if(keyboard[39]){ //right arrow key
        cube.rotation.z -= Math.PI * 0.01;
    }

    if(keyboard[87]){ //W key
        cube.position.x += Math.cos(cube.rotation.z) * player.speed;
        cube.position.y += Math.sin(cube.rotation.z) * player.speed;
        
        camera.position.x += Math.cos(cube.rotation.z) * player.speed;
        camera.position.y += Math.sin(cube.rotation.z) * player.speed;
    }

    if(keyboard[83]){ //S key
        cube.position.x -= Math.cos(cube.rotation.z) * player.speed;
        cube.position.y -= Math.sin(cube.rotation.z) * player.speed;

        camera.position.x -= Math.cos(cube.rotation.z) * player.speed;
        camera.position.y -= Math.sin(cube.rotation.z) * player.speed;
    }

    controls.target.copy(cube.position);
}

function onWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
    labelRenderer.setSize( window.innerWidth, window.innerHeight );
}

function render(){
    requestAnimationFrame(render);
    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
    label.position.set(cube.position.x, cube.position.y, cube.position.z + 1);

    player_movement();
}

function keyDown(e) {
    keyboard[e.keyCode] = true;
}

function keyUp(e) {
    keyboard[e.keyCode] = false;
}

window.addEventListener('keydown', keyDown)
window.addEventListener('keyup', keyUp)
window.addEventListener('resize', onWindowResize, false);

render();