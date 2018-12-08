import XML2JS from "xml2js";
import FS from "fs";
import cleanXML from "../utils/cleanXML";

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

				if ( onLoad && typeof onLoad === "function" ) {
					const result = this.build( output );
					return onLoad( result );
				}
			});
		});
	}
	build( input ) {
		// Build the geometry!
	}
}
export default OSMLoader;