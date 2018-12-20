const THREE = require( "three" );
const OrbitControls = require( "three-orbit-controls" )( THREE );

// Import the three-osm-loader module and attach it to three.js
require( "../dist/" )( THREE );

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color( 0xcccccc );
scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );

// Camera
const camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
camera.position.set( 0, -200, 200 );
camera.up.set( 0, 0, 1 );
camera.lookAt( new THREE.Vector3() );

// Controls
const controls = new OrbitControls( camera, renderer.domElement );
controls.minDistance = 0;
controls.maxDistance = 500;
controls.maxPolarAngle = Math.PI / 2;

// Objects
const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );

// Loader
const loader = new THREE.OSMLoader();
loader.load(
	"centre-ville.xml",

	// On error
	( err ) => {
		console.log( err );
	},

	// On progress
	() => {
		// Do nothing
	},

	// On success
	( result ) => {
		// Result is an array of THREE.Geometry instances

		// Create a reusable material for all lines.
		const material = new THREE.LineBasicMaterial({
			color: 0xFFFFFF
		});

		// For each geometry, create a line using the above material and add it to
		// the scene.
		result.forEach( ( geometry ) => {
			scene.add( new THREE.Line(
				geometry, material
			) );
		});
	}
);

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
window.addEventListener( "resize", () => {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}, false );
document.body.appendChild( renderer.domElement );

function render() {
	renderer.render( scene, camera );
	requestAnimationFrame( render );
}

render();
