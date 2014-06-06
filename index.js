var Proto = require( 'uberproto' ),
    Promise = require( 'es6-promise' ).Promise,
    Level = require( 'level' );

/**
 * Returns a level-promisify instance or a promise resolvable when the db is open
 */
module.exports = function( loc, opts ) {
    if ( opts && opts.sync ) {
        return Proto.extend( LP, Level( loc, opts ) ).create();
    }

    return new Promise( function( resolve, reject ) {
        Level( loc, opts, function( err, db ) {
            if ( err ) reject( err );
            resolve( Proto.extend( LP, db ).create() );
        });
    });
}

/**
 * Level-promisify object
 */
var LP = Proto.extend({

    init: function() {
        console.log( 'creating LP' );
    },

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
            this._super( key, val, opts, function( err ) {
                if ( err ) reject ( err );
                resolve();
            });
        });
    },


    get: function( key, opts ) {
        return this._promise( function( resolve, reject ) {
            this._super( key, opts, function( err, val ) {
                if ( err ) reject( err );
                resolve( val );
            });
        });
    },


    del: function( key, opts ) {
        return this._promise( function( resolve, reject ) {
            this._super( key, opts, function( err ) {
                if ( err ) reject( err );
                resolve();
            });
        });
    },


    batch: function( ops, opts ) {
        return this._promise( function( resolve, reject ) {
            this._super( ops, opts, function( err ) {
                if ( err ) reject( err );
                resolve();
            });
        })
    }
});
