"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const xml2js_1 = __importDefault(require("xml2js"));
const cleanXML_1 = __importDefault(require("../utils/cleanXML"));
const calcCenter_1 = __importDefault(require("../utils/calcCenter"));
const GeoCoordinate_1 = __importDefault(require("./GeoCoordinate"));
const three_1 = require("three");
const defaultOnError = function defaultOnError(err) {
    throw new Error(err);
};
class OSMLoader {
    /**
     * Create a new instance of OSMLoader.
     */
    constructor(manager) {
        this.manager = manager || three_1.DefaultLoadingManager;
    }
    /**
     * Load the data, convert it to JSON, pass it to the build() method, and return the result.
     * @param path
     * @param onError
     * @param onProgress
     * @param onLoad
     */
    load(path, onError, onProgress, onLoad) {
        // Assign the default error handler if no error handler is provided
        this.onError = onError || defaultOnError;
        const loader = new three_1.FileLoader(this.manager);
        loader.load(path, (data) => {
            xml2js_1.default.parseString(data, (err, json) => {
                if (err) {
                    throw new Error(err);
                }
                // Improve XML2JS parsing by
                // - Using meta keys ("$") as props
                // - Recursively parsing child arrays
                const output = cleanXML_1.default(json.osm);
                // subNodeRefs( output );
                console.log(output);
                if (onLoad && typeof onLoad === "function") {
                    const result = this.build(output);
                    return onLoad(result);
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
    parse(data) {
    }
    build(input) {
        // Build the geometry!
        // Find the center
        const center = calcCenter_1.default(new GeoCoordinate_1.default(input.bounds[0].maxlat, input.bounds[0].maxlon), new GeoCoordinate_1.default(input.bounds[0].minlat, input.bounds[0].minlon));
        console.log(center);
        const buildings = [];
        // Collect ways with the "building" tag
        input.way.forEach((way) => {
            if (way.tags && way.tags.building) {
                // console.log( "Found a building with", way.nd, "nodes." );
                const material = new three_1.LineBasicMaterial({
                    color: 0xffffff
                });
                const geometry = new three_1.Geometry();
                way.refs.forEach((ref) => {
                    const data = input.node.find((node) => {
                        return node.id === ref;
                    });
                    if (data) {
                        const coordinate = new GeoCoordinate_1.default(data.lat, data.lon);
                        geometry.vertices.push(coordinate.asCartesian(center));
                    }
                    // else {
                    // 	console.warn( "Couldn't find a node with ref", ref );
                    // }
                });
                buildings.push(new three_1.Line(geometry, material));
            }
        });
        return buildings;
    }
}
exports.default = OSMLoader;
function subNodeRefs(obj) {
    // Go through each way.
    // For each way, go through nd and find the cooresponding node in node
    obj.way.forEach((way) => {
        way.nodes = [];
        way.nd.forEach((ref) => {
            for (let i = 0; i < obj.node.length; i++) {
                if (obj.node[i].id == ref) {
                    way.nodes.push(obj.node[i]);
                }
            }
        });
        delete way.nd;
    });
}
//# sourceMappingURL=OSMLoader.js.map