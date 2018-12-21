"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const three_1 = require("three");
class GeoCoordinate {
    constructor(lat, lon, ele) {
        this._lat = lat;
        this._lon = lon;
        this._ele = ele || 0;
    }
    get lat() {
        return this._lat;
    }
    set lat(value) {
        this.lat = value;
    }
    get lon() {
        return this._lon;
    }
    set lon(value) {
        this.lon = value;
    }
    copy() {
    }
    clone() {
    }
    /**
     * NOTE: This uses the haversine formula. Other implementations are
            possible. In the future, the user can choose which option the loader
            uses. This will also be related to whether the user intends to preserve
            the spherical nature of the coordinates, or project them as a map.
     * @param p2
     */
    distanceTo(p2) {
        const { sin, cos, atan2, sqrt } = Math;
        const R = 6371008.8;
        const φ1 = this.rad(this.lat);
        const φ2 = this.rad(p2.lat);
        const Δφ = this.rad(p2.lat - this.lat);
        const Δλ = this.rad(p2.lon - this.lon);
        const a = sin(Δφ / 2) * sin(Δφ / 2) + cos(φ1) * cos(φ2) * sin(Δλ / 2) * sin(Δλ / 2);
        return R * 2 * atan2(sqrt(a), sqrt(1 - a));
    }
    bearingTo(p2) {
        const { sin, cos, atan2 } = Math;
        const φ1 = this.rad(this.lat);
        const φ2 = this.rad(p2.lat);
        const Δφ = this.rad(p2.lat - this.lat);
        const Δλ = this.rad(p2.lon - this.lon);
        const y = sin(Δλ) * cos(φ2);
        const x = cos(φ1) * sin(φ2) - sin(φ1) * cos(φ2) * cos(Δλ);
        return atan2(y, x);
    }
    rad(degrees) {
        return Number(degrees * (Math.PI / 180));
    }
    deg(radians) {
        return radians * 180 / Math.PI;
    }
    // /**
    //  * The components of the vector are rounded down to the nearest integer value.
    //  */
    // floor(): GeoCoordinate {
    //     this.lat = Math.floor(this.lat)
    //     this.lon = Math.floor(this.lon)
    //     return this;
    // }
    /**
     * Convert this coordinate to an xyz coordinate relative to some other lat/lon coordinate
     * @param origin
     */
    asCartesian(origin) {
        const bearing = origin.bearingTo(this);
        const distance = origin.distanceTo(this);
        if (this._ele) {
            return new three_1.Vector3(distance * Math.sin(bearing), distance * Math.cos(bearing), this._ele);
        }
        return new three_1.Vector3(distance * Math.sin(bearing), distance * Math.cos(bearing), 0);
    }
}
exports.default = GeoCoordinate;
//# sourceMappingURL=GeoCoordinate.js.map