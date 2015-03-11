
class LevelPromisify {
    constructor( db, opts ) {
        this.root = db;
        return this;
    }

    put( key, value, opts ) {
        if ( opts ) {
            opts.sync = false;
        }

        return new Promise( ( resolve, reject ) => {
            this.root.put( key, value, opts, ( err ) => {
                if ( err ) return reject( err );
                resolve( this );
            });
        });
    }

    get( key, opts ) {
        return new Promise( ( resolve, reject ) => {
            this.root.get( key, opts, ( err, res ) => {
                if ( err ) return reject( err );
                resolve( res );
            });
        });
    }

    del( key, opts ) {
        if ( opts ) {
            opts.sync = false;
        }

        return new Promise( ( resolve, reject ) => {
            this.root.del( key, opts, ( err ) => {
                if ( err ) return reject( err );
                resolve( this );
            });
        });
    }

    batch( ops, opts) {
        if ( opts ) {
            opts.sync = false;
        }

        return new Promise( ( resolve, reject ) => {
            this.root.batch( ops, opts, ( err ) => {
                if ( err ) return reject( err );
                resolve( this );
            });
        });
    }

    close() {
        this.root.close();
    }
}

export default function( db, opts ) {
    return new LevelPromisify( db, opts );
}
