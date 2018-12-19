"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Checks a string for number and if it's a number, returns the number, otherwise
 * returns the string unchanged.
 * @param n
 */
function default_1(n) {
    if (+n === +n) {
        return +n;
    }
    return n;
}
exports.default = default_1;
//# sourceMappingURL=extractNum.js.map