const THREE = require( "three" );
require( "../dist/index.js" )( THREE );
const OrbitControls = require( "three-orbit-controls" )( THREE );
console.log( OrbitControls );

let camera;
let controls;
let scene;
let renderer;

init();
animate();

function init() {
	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0xcccccc );
	scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );
	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );
	const aspect = window.innerWidth / window.innerHeight;
	camera = new THREE.PerspectiveCamera( 60, aspect, 1, 1000 );
	camera.position.set( 400, 200, 0 );
	// controls
	controls = new OrbitControls( camera, renderer.domElement );
	controls.minDistance = 100;
	controls.maxDistance = 500;
	controls.maxPolarAngle = Math.PI / 2;

	loadOSM();

	// lights
	const lightA = new THREE.DirectionalLight( 0xffffff );
	lightA.position.set( 1, 1, 1 );
	scene.add( lightA );
	const lightB = new THREE.DirectionalLight( 0x002288 );
	lightB.position.set( - 1, - 1, - 1 );
	scene.add( lightB );
	const lightC = new THREE.AmbientLight( 0x222222 );
	scene.add( lightC );
	//
	window.addEventListener( "resize", onWindowResize, false );
}
function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}
function animate() {
	renderer.render( scene, camera );
	requestAnimationFrame( animate );
}
function loadOSM() {
	const loader = new THREE.OSMLoader();

	console.log( loader.load );

	const path = "../map.xml";
	const onError = function( err ) {
		console.log( err );
	};
	const onLoad = function( result ) {
		const material = new THREE.LineBasicMaterial({ color: 0xffff00 });
		const line = new THREE.Line( result, material );
		scene.add( line );
	};

	loader.load( path, onError, onLoad );
}
