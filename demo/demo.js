let Three = require( "three" );
// You can name it "THREE" instead of "Three" if you want, but it's just another
// module and therefore it has no business having an all-capital name.

let OSMLoader = require( "../dist/index.js" ).default( Three );

let scene = new Three.Scene();
let loader = new Three.OSMLoader();
let path = "./map.xml";
let onError = function( err ) {
	console.log( err );
}
let onLoad = function( result ) {
	let material = new Three.LineBasicMaterial({ color: 0xffff00 });
	let line = new Three.Line( result, material );
	scene.add( line );
}

loader.load( path, onError, onLoad );