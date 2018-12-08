import GeoCoordinate from "../core/GeoCoordinate";

// TODO: Allow to pass in a bounds object
export default function( p1: GeoCoordinate, p2: GeoCoordinate ): GeoCoordinate {
	const maxLat = Math.max( p1.lat, p2.lat );
	const minLat = Math.min( p1.lat, p2.lat );
	const maxLon = Math.max( p1.lon, p2.lon );
	const minLon = Math.min( p1.lon, p2.lon );
	const center = new GeoCoordinate(
		( maxLat - minLat ) / 2 + minLat,
		( maxLon - minLon ) / 2 + minLon
	);
	return center;
}