import XML2JS from 'xml2js';
import FS from 'fs';
import { Vector3, CompressedPixelFormat } from 'three';
import cleanXML from "./utils/cleanXML";
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

      XML2JS.parseString(data, (err, json) => {
        if (err) {
          throw err;
        }

        // Improve XML2JS parsing by
        // - Using meta ("$") keys as props
        // - Recursively parsing child arrays
        let output = cleanXML(json.osm);
        
        console.log(JSON.stringify(output, null, 4));

        if (onLoad && typeof onLoad === 'function') {
          let result = this.build(output);
          return onLoad(result);
        }
      });
    });
  }
  build(input) {
    // Build the geometry!
  }
}

export default function (THREE) {
  THREE.OSMLoader = OSMLoader;
}
