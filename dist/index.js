"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const OSMLoader_1 = __importDefault(require("./core/OSMLoader"));
module.exports = function (THREE) {
    THREE.OSMLoader = OSMLoader_1.default;
};
//# sourceMappingURL=index.js.map