import XML2JS from "xml2js";
import FS from "fs";
import cleanXML from "../utils/cleanXML";
import calcCenter from "../utils/calcCenter";
import GeoCoordinate from "./GeoCoordinate";
import { Geometry, Line, LineBasicMaterial, Object3D } from "three";

class OSMLoader {
	load( path, onError, onLoad ) {
		// Read the file...
		FS.readFile( path, "utf8", ( err, data ) => {
			if ( err ) {
				if ( onError && typeof onError === "function" ) {
					return onError( err );
				}
				throw err;
			}

			XML2JS.parseString( data, ( err, json ) => {
				if ( err ) {
					throw err;
				}

				// Improve XML2JS parsing by
				// - Using meta keys ("$") as props
				// - Recursively parsing child arrays
				const output = cleanXML( json.osm );

				console.log( JSON.stringify( output, null, 4 ) );

				if ( onLoad && typeof onLoad === "function" ) {
					const result = this.build( output );
					return onLoad( result );
				}
			});
		});
	}
	build( input ) {
		// Build the geometry!

		// Find the center
		const center = calcCenter(
			new GeoCoordinate( input.bounds[ 0 ].maxlat, input.bounds[ 0 ].maxlon ),
			new GeoCoordinate( input.bounds[ 0 ].minlat, input.bounds[ 0 ].minlon )
		);

		const buildings = new Object3D();
		// Collect ways with the "building" tag
		input.way.forEach( ( way ) => {
			if ( way.tags && way.tags.building ) {
				const material = new LineBasicMaterial({
					color: 0x0000ff
				});
				const geometry = new Geometry();
				way.nd.forEach( ( ref ) => {
					const data = input.node.find( ( node ) => {
						return node.id === ref;
					});
					const coordinate = new GeoCoordinate( data.lat, data.lon );
					geometry.vertices.push( coordinate.asCartesian( center ) );
				});
				geometry.vertices.push( geometry.vertices[ 0 ] );
				buildings.add( new Line( geometry, material ) );
			}
		});
		return buildings;
	}
}
export default OSMLoader;
