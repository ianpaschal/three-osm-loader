import { Vector3 } from "three";
declare class GeoCoordinate {
    _lat: number;
    _lon: number;
    _ele: number;
    constructor(lat: number, lon: number, ele?: number);
    lat: number;
    lon: number;
    copy(): void;
    clone(): void;
    /**
     * NOTE: This uses the haversine formula. Other implementations are
            possible. In the future, the user can choose which option the loader
            uses. This will also be related to whether the user intends to preserve
            the spherical nature of the coordinates, or project them as a map.
     * @param p2
     */
    distanceTo(p2: GeoCoordinate): number;
    bearingTo(p2: GeoCoordinate): number;
    rad(degrees: any): number;
    deg(radians: any): number;
    /**
     * Convert this coordinate to an xyz coordinate relative to some other lat/lon coordinate
     * @param origin
     */
    asCartesian(origin: GeoCoordinate): Vector3;
}
export default GeoCoordinate;
