var Promise = require( 'es6-promise' ).Promise,
    Level = require( 'level' );


/**
 * Returns a level-promisify instance or a promise resolvable when the db is open
 */
module.exports = function( loc, opts ) {
    if ( opts && opts.sync ) {
        return new LP( Level( loc, opts ) );
    }

    return new Promise( function( resolve, reject ) {
        Level( loc, opts, function( err, db ) {
            if ( err ) reject( err );
            resolve( new LP( db ) );
        });
    });
}


/**
 * Level-promisify object
 */
var LP = function( db ) {
    console.log( 'new LP object', db );
    this._level = db;
}
