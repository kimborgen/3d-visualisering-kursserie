const THREE = require("three");
const OrbitControlsModule = require("three-orbit-controls");
const OrbitControls = OrbitControlsModule(THREE);
const analyse = require("./fasit/oppgave2/soundanalyser.js");


let scene; 
let camera;
const SPEED = 0.1;
let renderer;
const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
let controls;
let cubes = [];
let analyser;

let maxDecibels;
let minDecibels;  

function init() {
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(WIDTH, HEIGHT);
  document.body.appendChild(renderer.domElement);

  scene = new THREE.Scene();

  let fov = 70;
  let near = 0.1;
  let far = 1000;
  camera = new THREE.PerspectiveCamera(fov, WIDTH / HEIGHT, near, far);
  
  camera.position.z = 20;
  
  controls = new OrbitControls(camera);

  makeCubes();
  
  let startPos = -10;
  cubes.map((cube,i) => {
    cube.position.x = positionCube(i,startPos)
  })


  renderer.render(scene, camera);

}

function makeCubes(){
  for(let i = 0; i < 32; i++) {

    let cube = makeCube(0.5,0.5,0.5);
    console.log(cube)

    cube.rotation.x = 1;
    cube.rotation.y = 0.5;
    cube.rotation.z = 1.25;
    
    cubes.push(cube);
    scene.add(cube);
  }
}

function makeCube(height, width, depth) {
  let geometry = new THREE.BoxGeometry(height, width, depth);
  let material = new THREE.MeshNormalMaterial();
  return new THREE.Mesh(geometry, material);
}

function rotateCube(_cube) {
  _cube.rotation.x -= SPEED;
  _cube.rotation.y -= SPEED;
  _cube.rotation.z -= SPEED;
}

function positionCube(cubeNumber, startPosition) {
  // hvor X er et tall på avstanden mellom hver kube
  return startPosition + cubeNumber * 0.6;
}

analyse(function(a) {
  // Når analyse-funksjonen har kobla seg til mikrofonen
  // vil denne koden bli kjørt

  // Da får du en referanse til analysern, som du bør ta vare på
  analyser = a;
  maxDecibels = analyser.analyser.maxDecibels;
  minDecibels = analyser.analyser.minDecibels;
  // Så kan du kalle render-funksjonen din
  // som kicker i gang render-loopen som før
  render();
});

function normalise(min, max, value) {
  return (value - min) / max;
}


function scaleCube(freq, cube, cubeNumber) {
  let frequency = freq[cubeNumber];
  let scaleFactor = normalise(minDecibels, maxDecibels, frequency);
  console.log(scaleFactor)
  cube.scale.y = scaleFactor;
}

function render() {
  requestAnimationFrame(render);
  let frequencies = analyser.frequencies();
  console.log(frequencies)
  cubes.map((cube, i) => {
    //rotateCube(cube)
    scaleCube(frequencies, cube, i)
  })

  renderer.render(scene, camera);
}

init();
