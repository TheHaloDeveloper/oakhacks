/**
 * @author Anay Mittal <anayttal@gmail.com>
 */

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000)
let renderer = new THREE.WebGLRenderer({antialias: true});
let tl = new TimelineMax();
let textureLoader = new THREE.TextureLoader()

renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('scene').appendChild(renderer.domElement)

let sphereGeo = new THREE.SphereGeometry(3, 32, 16)

let texture = textureLoader.load('assets/images/texture.jpeg');
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set(1, 1);
let sphereMat = new THREE.MeshBasicMaterial({color: 0xff0000, transparent: true, map: texture});
let sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);

scene.add(sphereMesh)
camera.position.z = 4;

let rotation = {
    x: 0.001,
    y: 0.001,
    z: 0.001
};
let introOver = false;

function render(){
    requestAnimationFrame(render)
    renderer.render(scene, camera)

    if(introOver == false){
        sphereMesh.rotation.x += rotation.x;
        sphereMesh.rotation.y += rotation.y;
        sphereMesh.rotation.z += rotation.z;
    }
}

render();

let blinkInterval = window.setInterval(blink, 8000);

function startBlink() {
    blinkInterval = window.setInterval(blink, 8000);
}
function stopBlink() {
    window.clearInterval(blinkInterval);
}

document.getElementById("blocker").style.opacity = 0;

function blink() {
    tl.to(document.getElementById("blocker").style, 0.5, {opacity: 1, ease: "none"})
    tl.to(document.getElementById("blocker").style, 0.5, {opacity: 0, ease: "none"})
}

count = 0

setInterval(function(){
    if(count % 2 == 0){
        sphereMat.map.magFilter = THREE.NearestFilter;
    } else {
        sphereMat.map.magFilter = THREE.LinearFilter;
    }
    texture.needsUpdate = true;
    count++;
}, 1000)

function onWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

let countContainer = document.getElementById("count")
let usernameInput = document.getElementById("usernameInput")

document.getElementById("playButton").addEventListener("click", function(){
    let username = document.getElementById("usernameInput").value
    if(username == ''){
        username = 'Player'
    }
    stopBlink();
    $("#main").fadeOut(1000, function(){
        tl.to(camera.position, 2, {z: 15, ease: "bounce.out"})
        rotation.x = 0.01;
        rotation.y = 0.01;
        rotation.z = 0.01;
        setTimeout(function(){
            countContainer.style.display = "block";
            setTimeout(function(){
                countContainer.innerHTML = "2";
                setTimeout(function(){
                    countContainer.innerHTML = "1"
                    setTimeout(function(){
                        countContainer.style.display = "none"
                        rotation.y = 0.1;
                        tl.to(camera.position, 2, {z: 0})
                        setTimeout(function(){
                            document.getElementById('blocker').style.backgroundColor = "rgb(45, 45, 45)";
                            document.getElementById('blocker').style.display = "block";
                            document.getElementById('blocker').style.opacity = 1;
                            document.getElementById('loading').style.display = "block";
                            document.getElementById('desc').style.display = "none";
                            document.getElementById('info').style.display = "none";
                            introOver = true;
                            scene.remove(sphereMesh)
                            setTimeout(function(){
                                $("#blocker").fadeOut(1000)
                                $("#loading").fadeOut(1000)
                                setTimeout(function(){
                                    window.location.href = `../game.html?username=${username}&direct=false`
                                }, 1000)
                            }, 5000)
                        }, 1500);
                    }, 500)
                }, 500)
            }, 500)
        }, 1000)
    })
})

let modal = document.getElementById("infoModal");
let btn = document.getElementById("info");
let span = document.getElementsByClassName("close")[0];

btn.onclick = function() {
    modal.style.display = "block";
}

span.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

window.addEventListener('resize', onWindowResize, false);
window.addEventListener('focus', startBlink);    
window.addEventListener('blur', stopBlink);