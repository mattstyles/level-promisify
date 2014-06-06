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
    this._level = db;
}

LP.prototype = {

    /**
     * Promise wrapper to ensure context
     */
    _promise: function( fn ) {
        return new Promise( fn.bind( this ) );
    },

    /**
     * LevelUp API
     */

    put: function( key, val, opts ) {
        return this._promise( function( resolve, reject ) {
            this._level.put( key, val, opts, function( err ) {
                if ( err ) reject ( err );
                resolve();
            });
        });
    },


    get: function( key, opts ) {
        return this._promise( function( resolve, reject ) {
            this._level.get( key, opts, function( err, val ) {
                if ( err ) reject( err );
                resolve( val );
            });
        });
    }
}
