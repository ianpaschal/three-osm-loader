import XML2JS from "xml2js";
import cleanXML from "../utils/cleanXML";
import calcCenter from "../utils/calcCenter";
import GeoCoordinate from "./GeoCoordinate";
import {
	DefaultLoadingManager,
	FileLoader,
	Geometry,
	LoadingManager
} from "three";

const defaultOnError = function defaultOnError( err ) {
	throw new Error( err );
};

class OSMLoader {

	manager: LoadingManager;
	onError: Function;

	/**
	 * Create a new instance of OSMLoader.
	 */
	constructor( manager?: LoadingManager ) {
		this.manager = manager || DefaultLoadingManager;
	}

	/**
	 * Load the data, convert it to JSON, pass it to the build() method, and return the result.
	 * @param path
	 * @param onError
	 * @param onProgress
	 * @param onLoad
	 */
	load( path: string, onError?: Function, onProgress?: Function, onLoad?: Function ) {

		// Assign the default error handler if no error handler is provided
		this.onError = onError || defaultOnError;

		const loader = new FileLoader( this.manager );

		loader.load( path, ( data ) => {
			XML2JS.parseString( data, ( err, json ) => {
				if ( err ) {
					throw new Error( err );
				}

				// Improve XML2JS parsing by
				// - Using meta keys ("$") as props
				// - Recursively parsing child arrays
				const output = cleanXML( json.osm );

				// subNodeRefs( output );
				console.log( output );
				if ( onLoad && typeof onLoad === "function" ) {
					const result = this.build( output );
					return onLoad( result );
				}
			});
		});
		//}, onProgress, onError );

		// Read the file...
		// FS.readFile( path, "utf8", ( err, data ) => {
		// 	if ( err ) {
		// 		if ( onError && typeof onError === "function" ) {
		// 			return onError( err );
		// 		}
		// 		throw err;
		// 	}

		// });
	}

	parse( data ) {

	}

	build( input: any ): Geometry[] {
		// Build the geometry!

		// Find the center
		const center = calcCenter(
			new GeoCoordinate( input.bounds[ 0 ].maxlat, input.bounds[ 0 ].maxlon ),
			new GeoCoordinate( input.bounds[ 0 ].minlat, input.bounds[ 0 ].minlon )
		);

		const geometries = [];
		// Collect ways with the "building" tag
		input.way.forEach( ( way ) => {
			if ( way.tags && way.tags.building ) {
				const geometry = new Geometry();
				way.refs.forEach( ( ref ) => {
					const data = input.node.find( ( node ) => {
						return node.id === ref;
					});
					if ( data ) {
						const coordinate = new GeoCoordinate( data.lat, data.lon );
						geometry.vertices.push( coordinate.asCartesian( center ) );
					}
				});
				geometries.push( geometry );
			}
		});
		return geometries;
	}
}
export default OSMLoader;

function subNodeRefs( obj ) {
	// Go through each way.
	// For each way, go through nd and find the cooresponding node in node
	obj.way.forEach( ( way ) => {
		way.nodes = [];
		way.nd.forEach( ( ref ) => {
			for ( let i = 0; i < obj.node.length; i++ ) {
				if ( obj.node[ i ].id == ref ) {
					way.nodes.push( obj.node[ i ] );
				}
			}
		});
		delete way.nd;

	});
}
