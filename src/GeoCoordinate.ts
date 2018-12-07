import {Vector2} from "three"

class GeoCoordinate {
    _lat: number;
    _lon: number;

    constructor( lat: number, lon: number ) {
        this._lat = lat;
        this._lon = lon;
    }

    get lat() {
        return this._lat
    }

    set lat( value ) {
        this.lat = value;
    }

    get lon() {
        return this._lon
    }

    set lon( value ) {
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
    distanceTo( p2: GeoCoordinate ): number {
        const p1 = this;
        var R = 6371e3; // metres
        var φ1 = p1.lat;
        var φ2 = p2.lat;
        var Δφ = p2.lat - p1.lat;
        var Δλ = p2.lon - p1.lon;

        var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ/2) * Math.sin(Δλ/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

        var d = R * c;
        return d;
    }

    bearingTo( p2: GeoCoordinate ): number {
        const p1 = this;
        var y = Math.sin( p2.lon - p1.lon ) * Math.cos( p2.lat );
        var x = Math.cos( p1.lat ) * Math.sin( p2.lat ) - Math.sin( p1.lat ) * Math.cos( p2.lat ) * Math.cos( p2.lon - p1.lon );
        var brng = Math.atan2( y, x );
        return brng;
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
    asCartesian( origin: GeoCoordinate ): Vector2 {

        const bearing = origin.bearingTo(this);
        const distance = origin.distanceTo(this);

        return new Vector2(
            distance * Math.cos(bearing),
            distance * Math.sin(bearing)
        );
    }

}

export default GeoCoordinate;