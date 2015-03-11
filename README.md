# Level-promisify

> Leveldb with promises

Skinny wrapper around leveldb that adds promises instead of callbacks.


## Getting Started

Installation

```shell
npm i -S level-promisify
```

The constructor takes one argument, the leveldb instance to use.

```js
var level = require( 'level' )( path );
var db = require( 'level-promisify' )( level );

db.put( 'foo', 'bar' )
  .then( function() {
    db.get( 'foo' )
      .then( function( res ) {
        console.log( res ); // 'bar'
      })
  })
  .catch( function( err ) {
    console.log( err );
  });
```


## API

* `put`
* `get`
* `del`
* `batch` *Array form*

The API doesn’t change, you just handle the responses using promises.

If you want access to the underlying database then it’s exposed via `db.root`, for example, if you pass it a db using the hooks plugin then that’s still available:

```js
var level = require( 'level' )( path );
var hookdb = require( 'level-hooks' )( db );
var db = require( 'level-promisify' )( hookdb );

db.root.hooks.pre( … );
```

## License

[ISC](https://github.com/mattstyles/level-promisify/blob/master/LICENSE)
