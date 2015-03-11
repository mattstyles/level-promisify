var fs = require( 'fs' ),
    test = require( 'tape' ),
    LP = require( '../' ),

    db = './db',
    level = null;


test( 'creation test - using promise', function( t ) {
    t.plan( 1 );

    LP( db, {
        valueEncoding: 'json'
    })
        .then( function( l ) {
            level = l;
            t.ok( fs.existsSync( db ), 'db created' );
        })
        .catch( function() {
            t.notOk( true, 'problem opening db' );
        });

});


test( 'put test - expect a put to not throw an error', function( t ) {
    t.plan( 1 );

    level.put( 'a', 'aardvark' )
        .then( function() {
            t.ok( true, 'put ok' );
        })
        .catch( function( err ) {
            t.notOk( true, 'error putting data' );
        });
});


test( 'get test', function( t ) {
    t.plan( 2 );

    level.get( 'a' )
        .then( function( res ) {
            t.equal( res, 'aardvark', 'got the data from the db ok' );
        })
        .catch( function( err ) {
            t.notOk( true, 'error getting data' );
        });

    level.get( 'b' )
        .then( function( res ) {
            t.notOk( true, 'this get should not exist and should instead throw a catchable' );
        })
        .catch( function( err ) {
            t.ok( true, 'getting a value that does not exist should throw a catchable' );
        });
});


test( 'delete test', function( t ) {
    t.plan( 1 );

    level.del( 'a' )
        .then( function() {
            level.get( 'a' )
                .then( function() {
                    t.notOk( true, 'this value should have been deleted' );
                })
                .catch( function() {
                    t.ok( true, 'value has been deleted' );
                })
        })
        .catch( function( err ) {
            t.notOk( 'deleting an entry is throwing an error, it shouldnt be' );
        })
});


test( 'batch test', function( t ) {
    t.plan( 1 );

    level.batch([
        { type: 'put', key: 'c', value: 'coyote' },
        { type: 'put', key: 'd', value: 'dingo' }
    ])
        .then( function() {
            var results = [];

            level.createReadStream()
                .on( 'data', function( data ) {
                    results.push( data.value );
                })
                .on( 'error', function( err ) {
                    t.notOk( 'error streaming db' );
                })
                .on( 'end', function() {
                    t.equal( results.join( '-' ), 'coyote-dingo' );
                });
        })
        .catch( function( err ) {
            t.notOk( true, 'batch is throwing an error' );
        });
});
