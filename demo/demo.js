const THREE = require( "three" );
require( "../dist/index.js" )( THREE );
const OrbitControls = require( "three-orbit-controls" )( THREE );
// console.log( OrbitControls );

let camera;
let controls;
let scene;
let renderer;

init();
animate();

function init() {
	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0xcccccc );
	// scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );
	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );
	const aspect = window.innerWidth / window.innerHeight;
	camera = new THREE.PerspectiveCamera( 60, aspect, 1, 1000 );
	camera.position.set( 200, 0, 200 );
	camera.up.set( 0, 0, 1 );
	camera.lookAt( new THREE.Vector3() )
	// controls
	controls = new OrbitControls( camera, renderer.domElement );
	controls.minDistance = 0;
	controls.maxDistance = 500;
	controls.maxPolarAngle = Math.PI / 2;

	var axesHelper = new THREE.AxesHelper( 5 );
	scene.add( axesHelper );

	loadOSM("centre-ville.xml");

	// lights
	// const lightA = new THREE.DirectionalLight( 0xffffff );
	// lightA.position.set( 1, 1, 1 );
	// scene.add( lightA );
	// const lightB = new THREE.DirectionalLight( 0x002288 );
	// lightB.position.set( - 1, - 1, - 1 );
	// scene.add( lightB );
	// const lightC = new THREE.AmbientLight( 0x222222 );
	// scene.add( lightC );
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
function loadOSM(path ) {
	const loader = new THREE.OSMLoader();

	const onError = function( err ) {
		console.log( err );
	};
	const onProgress = function() {
		// do nothing
	};
	const onLoad = function( result ) {
		console.log("LINES", result );
		result.forEach(obj=>{
			scene.add( obj );
		});
		console.log("SCENE", scene)
	};

	loader.load( path, onError, onProgress, onLoad );
}
