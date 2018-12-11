import { Vector3 } from "three";

class GeoCoordinate {
	_lat: number;
	_lon: number;
	_ele: number;

	constructor( lat: number, lon: number, ele?: number ) {
		this._lat = lat;
		this._lon = lon;
		this._ele = ele || 0;
	}

	get lat() {
		return this._lat;
	}

	set lat( value ) {
		this.lat = value;
	}

	get lon() {
		return this._lon;
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
		const R = 6371008.8;

		const φ1 = this.rad(this.lat);
		const φ2 = this.rad(p2.lat);
		const Δφ = this.rad(p2.lat - this.lat);
		const Δλ = this.rad(p2.lon - this.lon);

		const a = Math.sin( Δφ / 2 ) * Math.sin( Δφ / 2 ) + Math.cos( φ1 ) * Math.cos( φ2 ) * Math.sin( Δλ / 2 ) * Math.sin( Δλ / 2 );
		return R * 2 * Math.atan2( Math.sqrt( a ), Math.sqrt( 1 - a ) );
	}

	bearingTo( p2: GeoCoordinate ): number {

		const φ1 = this.rad(this.lat);
		const φ2 = this.rad(p2.lat);
		const Δφ = this.rad(p2.lat - this.lat);
		const Δλ = this.rad(p2.lon - this.lon);

		const y = Math.sin( Δλ ) * Math.cos( φ2 );
		const x = Math.cos( φ1 ) * Math.sin( φ2 ) - Math.sin( φ1 ) * Math.cos( φ2 ) * Math.cos( Δλ );
		return Math.atan2( y, x );
	}

	rad( degrees ) {
		return Number( degrees * ( Math.PI / 180 ));
	}
	deg( radians ) {
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
	asCartesian( origin: GeoCoordinate ): Vector3 {

		const bearing = origin.bearingTo( this );
		const distance = origin.distanceTo( this );

		if ( this._ele ) {
			return new Vector3(
				distance * Math.cos( bearing ),
				distance * Math.sin( bearing ),
				this._ele
			);
		}
		return new Vector3(
			distance * Math.cos( bearing ),
			distance * Math.sin( bearing ),
			0
		);
	}

}

export default GeoCoordinate;