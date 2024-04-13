/**
 * @author Anay Mittal <anayttal@gmail.com>
 */
let username = new URLSearchParams(window.location.search).get("username")
history.replaceState({}, document.title, window.location.pathname);

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
let renderer = new THREE.WebGLRenderer({antialias: true});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x87CEEB);
document.getElementById("scene").appendChild(renderer.domElement);

camera.position.set(0, -22, 13);
camera.rotation.set(1, 0, 0);
camera.up.set(0, 0, 1);

//Controls
let controls = new THREE.OrbitControls(camera, renderer.domElement);

//Player
let cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
let cubeMaterial = new THREE.MeshLambertMaterial({color: 0xff0000});
let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

cube.rotation.z = Math.PI / 2;
cube.position.z = -0.5;
scene.add(cube);

//Ground
let groundGeometry = new THREE.BoxGeometry(50, 50, 1);
let groundMaterial = new THREE.MeshLambertMaterial({color: 0x3ce63c});
let ground = new THREE.Mesh(groundGeometry, groundMaterial);

ground.position.z = -1.5;
scene.add(ground);

//Lights
let spotlight = new THREE.SpotLight(0xffffff, 3, undefined, 1.3, 1);
spotlight.position.set(0, 0, 10);
scene.add(spotlight);

let ambient = new THREE.AmbientLight(0xffffff, 0.75);
scene.add(ambient);

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
}

function render(){
    requestAnimationFrame(render);
    renderer.render(scene, camera);

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