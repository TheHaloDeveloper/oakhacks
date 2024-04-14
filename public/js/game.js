/**
 * @author Anay Mittal <anayttal@gmail.com>
 */

let username = new URLSearchParams(window.location.search).get("username")
history.replaceState({}, document.title, window.location.pathname);

//Chat
$("#blocker").fadeOut(1000)
var socket = io();

let messages = document.getElementById('messages');
let form = document.getElementById('chatForm');
let input = document.getElementById('chatInput');
let chatPanel = document.getElementById('chatPanel');

form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (input.value) {
      socket.emit('chat message', [username, input.value]);
      input.value = '';
    }
});

socket.on('chat message', function(msg) { 
    var item = document.createElement('li'); 
    item.textContent = `[${msg[0]}]: ${msg[1]}`;
    messages.appendChild(item);
});

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100000);
let renderer = new THREE.WebGLRenderer({antialias: true});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x87CEEB);
document.getElementById("scene").appendChild(renderer.domElement);

camera.position.set(0, -22, 13);
camera.rotation.set(1, 0, 0);
camera.up.set(0, 0, 1);

let textureLoader = new THREE.TextureLoader()

let skyGeometry = new THREE.SphereGeometry(50000, 64, 32);
let skyMaterial = new THREE.MeshBasicMaterial({map: textureLoader.load('assets/images/skybox.jpg'), side: THREE.BackSide})
let sky = new THREE.Mesh(skyGeometry, skyMaterial);

sky.name = 'Sky';
scene.add(sky);

let labelRenderer = new THREE.CSS2DRenderer();
labelRenderer.setSize( window.innerWidth, window.innerHeight );
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';
labelRenderer.domElement.style.pointerEvents = 'none';
document.getElementById('scene').appendChild(labelRenderer.domElement);

//Controls
let controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.maxDistance = 1000

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

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

gltfLoader.load('assets/models/BlueSoldier_Male.gltf', function(gltf){
    gltf.scene.position.set(0, 10, 0);
    gltf.scene.rotation.x = Math.PI / 2;
    scene.add(gltf.scene);
})

for(let i = 0; i < 100; i++){
    gltfLoader.load('assets/models/cactus.glb', function(gltf){
        gltf.scene.position.set(rand(-1000, 1000), rand(-1000, 1000), 0);
        gltf.scene.rotation.x = Math.PI / 2;
        scene.add(gltf.scene);
    })
}


//Ground
let groundGeometry = new THREE.BoxGeometry(100000, 100000, 1);
let groundMaterial = new THREE.MeshBasicMaterial({color: 0xFFFF91});
let ground = new THREE.Mesh(groundGeometry, groundMaterial);

ground.position.z = -3;
scene.add(ground);

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