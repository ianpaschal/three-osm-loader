"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GeoCoordinate_1 = __importDefault(require("../core/GeoCoordinate"));
// TODO: Allow to pass in a bounds object
function default_1(p1, p2) {
    const maxLat = Math.max(p1.lat, p2.lat);
    const minLat = Math.min(p1.lat, p2.lat);
    const maxLon = Math.max(p1.lon, p2.lon);
    const minLon = Math.min(p1.lon, p2.lon);
    const center = new GeoCoordinate_1.default((maxLat - minLat) / 2 + minLat, (maxLon - minLon) / 2 + minLon);
    return center;
}
exports.default = default_1;
//# sourceMappingURL=calcCenter.js.map