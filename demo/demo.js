const Three = require( "three" );
// You can name it "THREE" instead of "Three" if you want, but it's just another
// module and therefore it has no business having an all-capital name.

require( "../dist/index.js" ).default( Three );

const scene = new Three.Scene();
const loader = new Three.OSMLoader();
const path = "./map.xml";
const onError = function( err ) {
	console.log( err );
};
const onLoad = function( result ) {
	const material = new Three.LineBasicMaterial({ color: 0xffff00 });
	const line = new Three.Line( result, material );
	scene.add( line );
};

loader.load( path, onError, onLoad );