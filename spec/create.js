var os = require( 'os' );
var path = require( 'path' );

var test = require( 'tape' );
var level = require( 'level' );
var levelPromisify = require( '../dist' );

var dbpath = path.join( os.tmpdir(), 'level-promisify-' + Math.random() );


test( 'creation', function( t ) {
    t.plan( 1 );

    var rootdb = level( dbpath );
    try {
        var db = levelPromisify( rootdb );
        t.ok( true, 'Sync create ok' );
    } catch( err ) {
        t.fail( err );
    }

    t.on( 'end', function() {
        if ( db ) {
            db.close();
        }
    });

});
