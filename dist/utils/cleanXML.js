"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const extractNum_1 = __importDefault(require("./extractNum"));
/**
 * XML2JS gives us some ugly looking formatting. This cleans it up into a
 * tidier object.
 */
const cleanXML = function (obj) {
    for (const property in obj) {
        if (obj.hasOwnProperty(property)) {
            switch (property) {
                case "$":
                    handle$(obj);
                    break;
                case "nd":
                    handleNd(obj);
                    break;
                case "tag":
                    handleTag(obj);
                    break;
                default:
                    if (Array.isArray(obj[property])) {
                        // Handle other children arrays
                        obj[property].forEach((child) => {
                            child = cleanXML(child);
                        });
                    }
                    else {
                        // Do nothing with it
                    }
                    break;
            }
        }
    }
    return obj;
};
function handle$(obj) {
    for (const metaprop in obj.$) {
        if (obj.$.hasOwnProperty(metaprop)) {
            if (typeof obj.$[metaprop] === "string") {
                if (obj.$[metaprop] === "yes" || obj.$[metaprop] === "true") {
                    obj[metaprop] = true;
                }
                else if (obj.$[metaprop] === "no" || obj.$[metaprop] === "false") {
                    obj[metaprop] = false;
                }
                else {
                    obj[metaprop] = extractNum_1.default(obj.$[metaprop]);
                }
            }
        }
    }
    delete obj.$;
}
function handleTag(obj) {
    // Handle tags
    obj.tags = {};
    obj.tag.forEach((tag) => {
        let value;
        if (tag.$.v === "yes") {
            value = true;
        }
        else if (tag.$.v === "no") {
            value = false;
        }
        else {
            value = tag.$.v;
        }
        obj.tags[tag.$.k] = value;
    });
    // Clean up the old tag array
    delete obj.tag;
}
function handleNd(obj) {
    // Handle refs
    obj.refs = [];
    obj.nd.forEach((nd) => {
        obj.refs.push(extractNum_1.default(nd.$.ref));
    });
    // Clean up the old ref array
    delete obj.nd;
}
exports.default = cleanXML;
//# sourceMappingURL=cleanXML.js.map