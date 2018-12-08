import extractNum from "./extractNum"
/**
 * XML2JS gives us some ugly looking formatting. This cleans it up into a
 * tidier object.
 */

const cleanXML = function(obj) {
    for (var property in obj) {
        if (obj.hasOwnProperty(property)) {
          if (property === "$") {
            for (var metaprop in obj.$) {
              if (obj.$.hasOwnProperty(metaprop)) {
                if (typeof obj.$[metaprop] === "string") {
                  if (obj.$[metaprop] === "yes" || obj.$[metaprop] === "true") {
                    obj[metaprop] = true
                  } else if (obj.$[metaprop] === "no" || obj.$[metaprop] === "false") {
                    obj[metaprop] = false
                  } else {
                    obj[metaprop] = extractNum(obj.$[metaprop])
                  }
                }
              }
            }
            delete obj.$;
          } else if (property === "tag") {
            // Handle tags
            obj.tags = {};
            obj.tag.forEach(tag=>{
              let value;
              if (tag.$.v === "yes") {
                value = true;
              } else if (tag.$.v === "no") {
                value = false;
              } else {
                value = tag.$.v;
              }
              obj.tags[tag.$.k] = value;
            })
            // Clean up the old tag array
            delete obj.tag;
          } else if (Array.isArray(obj[property])) {
            // Handle other children arrays
            obj[property].forEach(child=>{
              child = cleanXML(child);
            });
          } else {
            // Do nothing with it
          }
        }
      }
      return obj;
}

export default cleanXML;