/**
 * Checks a string for number and if it's a number, returns the number, otherwise
 * returns the string unchanged.
 * @param n 
 */
export default function( n: string ): string|number {
	if ( +n === +n ) {
		return +n;
	}
	return n;
}