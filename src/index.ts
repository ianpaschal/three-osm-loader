import XML2JS from 'xml2js';
import FS from 'fs';
import { Vector3, CompressedPixelFormat } from 'three';
import calcCenter from "./utils/calcCenter"
import GeoCoordinate from './GeoCoordinate';
interface Way {
  id: string;
  building: boolean;
  nodes: any[];
}
class OSMLoader {
  load(path, onError, onLoad) {
    // Read the file...
    FS.readFile(path, 'utf8', (err, data) => {
      if (err) {
        if (onError && typeof onError === 'function') {
          return onError(err);
        }
        throw err;
      }
      if (onLoad && typeof onLoad === 'function') {
        XML2JS.parseString(data, (err, json) => {
          if (err) {
            throw err;
          }

          const parsedData = {
            bounds: {
              max: {
                lat: parseFloat(json.osm.bounds[0].$.maxlat),
                lon: parseFloat(json.osm.bounds[0].$.maxlon)
              },
              min: {
                lat: parseFloat(json.osm.bounds[0].$.minlat),
                lon: parseFloat(json.osm.bounds[0].$.minlon)
              }
            }
          };
          parsedData.nodes = json.osm.node.map(node=>{
            const result = {...node.$};

            // Convert some strings to numbers:
            result.id = parseInt(result.id);
            result.version = parseInt(result.version);
            result.changeset = parseInt(result.changeset);
            result.uid = parseInt(result.uid);

            // Convert some strings to booleans
            result.visible = result.visible === "true";

            result.lat = parseFloat(result.lat);
            result.lon = parseFloat(result.lon);

            return result;
          });
          parsedData.ways = json.osm.way.map(way=>{

            // Map all metadata to the way object
            const result = {...way.$};

            // Convert some strings to numbers:
            result.id = parseInt(result.id);
            result.version = parseInt(result.version);
            result.changeset = parseInt(result.changeset);
            result.uid = parseInt(result.uid);

            // Convert some strings to booleans
            result.visible = result.visible === "true";
            

            // Add all node references
            result.nodeIDs = way.nd.map(node=>{
              return parseInt(node.$.ref);
            });

            // Add any tags which exist on the way
            if (way.tag) {
              result.tags = {};
              way.tag.forEach(tag=>{
                let value;
                if (tag.$.v === "yes") {
                  value = true;
                } else if (tag.$.v === "no") {
                  value = false;
                } else {
                  value = tag.$.v;
                }
                result.tags[tag.$.k] = value;
              })
            }
            
            return result;
          });

          console.log("Parsed data:", JSON.stringify(parsedData, null, 4))















          // const min = new GeoCoordinate(
          //   parseFloat(json.osm.bounds[0].$.minlat),
          //   parseFloat(json.osm.bounds[0].$.minlon)
          // );
          // const max = new GeoCoordinate(
          //   parseFloat(json.osm.bounds[0].$.maxlat),
          //   parseFloat(json.osm.bounds[0].$.maxlon)
          // );
          // const center = calcCenter(max, min);
          // console.log("Center of OSM at", center);

          // const nodes = json.osm.node.map(obj=>{
          //   return {
          //     id: obj.$.id,
          //     lat: obj.$.lat,
          //     lon: obj.$.lon
          //   }
          // });
          // const ways = [];
          
          // json.osm.way.forEach(obj=>{

          //   // Create an empty way object
          //   // TODO: Replace with a proper class
          //   const way = {};

          //   // Set the ID
          //   way.id = obj.$.id;

          //   // Check it for "building:yes" tags
          //   if (obj.tag) {
          //     obj.tag.forEach(tag=>{
          //       if (tag.$.k === "building" && tag.$.v === "yes") {

          //         // Collect the nodes (type = geocoordinates)
          //         way.coords = [];

          //         // For each node reference (nd), try to find a node with that
          //         // Id within the nodes array
          //         obj.nd.forEach(( nd ) => {
          //           const node = json.osm.node.find(( node ) => {
          //             return node.$.id === nd.$.ref;
          //           })

          //           // Turn the node into a proper coordinate
          //           const coord = new GeoCoordinate(parseFloat(node.$.lat), parseFloat(node.$.lon));
          //           way.coords.push(coord)
          //         });
          //         console.log("WAY:", way)
          //         ways.push(way)
          //       }
          //     })
          //   }
          // });
          // console.log("Found", ways.length, "building ways.")
          // console.log("WAYS", JSON.stringify(ways, null, 4));
          // console.log("NODES", JSON.stringify(nodes, null, 4));
        });
      }
    });
  }
}

export default function (THREE) {
  THREE.OSMLoader = OSMLoader;
}
// export default function(THREE) {
//     THREE.GPXLoader = function() {
//         return this;
//     }
//     THREE.GPXLoader.prototype = {
//         constructor: THREE.GPXLoader,
//         load( path, onError, onLoad ) {

//             // Provide access to "this":
//             let scope = this;

//             // Read the file...
//             FS.readFile( path, "utf8", ( err, data ) => {
//                 if ( err ) {
//                     if ( typeof onError === "function" ) {
//                         return onError( err );
//                     } else {
//                         throw err;
//                     }
//                 } else {
//                     if ( typeof onLoad === "function" ) {
//                         let geometry = scope.parse( data, () => {
//                             // Build and return the geometry instance:
//                             return onLoad( scope.build() );
//                         });
//                     } else {
//                         return "Please do something with the loaded file!"
//                     }
//                 }
//             });
//         },
//         parse( data, callback ) {

//             // Provide access to "this":
//             let scope = this;

//             // Parse the XML as a JSON object:
//             XML2JS.parseString( data, ( err, data ) => {
//                 if ( err ) {
//                     throw err;
//                 } else {
//                     scope.points = [];

//                     // Loop in case GPX file has multiple segments:
//                     for ( let trkseg of data.gpx.trk[ 0 ].trkseg ) {
//                         for ( let trkpt of trkseg.trkpt ) {

//                             // Push points after converting to radians and rounding:
//                             scope.points.push({
//                                 lat: scope.toRadians( trkpt.$.lat ),
//                                 lon: scope.toRadians( trkpt.$.lon ),
//                                 ele: scope.round( trkpt.ele[ 0 ], 2)
//                             });
//                         }
//                     }

//                     callback();

//                 }
//             });
//         },
//         build() {
//             let geometry = new THREE.Geometry();

//             geometry.vertices.push( new THREE.Vector3( 0, 0, this.points[ 0 ].ele ));
//             this.distance = 0;

//             for ( let i = 0; i < this.points.length; i++ ) {
//                 let d, b; // d = distance, b = bearing

//                 // If there is a next point...
//                 if ( this.points[ i + 1 ] ) {

//                     // Compute distance and bearing between the current and next point:
//                     d = this.getDistance( this.points[ i ], this.points[ i + 1 ] );
//                     b = this.getBearing( this.points[ i ], this.points[ i + 1 ] );

//                     // Add the distance to the total distance:
//                     this.distance += d;

//                     // Using the results, push a new object to the points array:
//                     geometry.vertices.push( new THREE.Vector3(
//                         geometry.vertices[ i ].x - d * ( Math.cos( b )),
//                         geometry.vertices[ i ].y + d * ( Math.sin( b )),
//                         this.points[ i + 1 ].ele
//                     ));
//                 }
//             }
//             return geometry;
//         },
//         round( value, places ) {
//             return Number( Math.round( value + 'e' + places ) + 'e-' + places );
//         },
//         toRadians( value ) {
//             return Number( value * ( Math.PI / 180 ));
//         },
//         toDegrees() {
//             // TODO: Add this function, even though it's not needed...?
//         }
//     };
// }
