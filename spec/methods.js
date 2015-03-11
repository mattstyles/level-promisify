var os = require( 'os' );
var path = require( 'path' );

var test = require( 'tape' );
var level = require( 'level' );
var levelPromisify = require( '../dist' );

var dbpath = path.join( os.tmpdir(), 'level-promisify-' + Math.random() );


test( 'put', function( t ) {
    t.plan( 2 );

    var rootdb = level( dbpath );
    var db = levelPromisify( rootdb );

    db.put( 'a', 'aston' )
        .then( function( res ) {
            t.ok( true, 'put ok' );
            t.ok( res.put && res.get, 'returned instance ok' );
        })
        .catch( function( err ) {
            t.fail( err );
        });

    t.on( 'end', function() {
        db.close();
    });
});


test( 'get', function( t ) {
    t.plan( 1 );

    var rootdb = level( dbpath );
    var db = levelPromisify( rootdb );

    db.get( 'a' )
        .then( function( res ) {
            t.ok( res === 'aston', 'get ok' );
        })
        .catch( function( err ) {
            t.fail( err );
        });

    t.on( 'end', function() {
        db.close();
    });
});


test( 'del', function( t ) {
    t.plan( 3 );

    var rootdb = level( dbpath );
    var db = levelPromisify( rootdb );

    db.del( 'a' )
        .then( function( res ) {
            t.ok( true, 'del ok' );
            t.ok( res.put && res.get, 'returned instance ok' );
        })
        .then( function() {
            db.get( 'a' )
                .then( function() {
                    t.fail( 'a not removed' );
                })
                .catch( function( err ) {
                    if ( err.notFound ) {
                        t.ok( true, 'del definitely ok' );
                        return;
                    }

                    t.fail( err );
                });
        })
        .catch( function( err ) {
            t.fail( err );
        });

    t.on( 'end', function() {
        db.close();
    });
});


test( 'batch', function( t ) {
    t.plan( 2 );

    var rootdb = level( dbpath );
    var db = levelPromisify( rootdb );

    db.batch([
        { type: 'put', key: 'b', value: 'brian' },
        { type: 'put', key: 'c', value: 'charles' }
    ])
        .then( function( res ) {
            t.ok( res.get && res.put, 'returned instance ok' );

            var results = [];

            rootdb.createReadStream()
                .on( 'data', function( data ) {
                    results.push( data.value );
                })
                .on( 'error', function( err ) {
                    t.fail( err );
                })
                .on( 'end', function() {
                    t.ok( results.join( '-' ) === 'brian-charles', 'batch ok' );
                });
        })
        .catch( function( err ) {
            t.fail( err );
        });

    t.on( 'end', function() {
        db.close();
    });
});
