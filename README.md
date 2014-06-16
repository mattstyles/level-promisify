# Level-promisify

> Leveldb with promises


Skinny wrapper around leveldb that adds promises instead of callbacks.

Uses the current es6.next (harmony) promises spec, using [es6-promise](https://github.com/jakearchibald/es6-promise) polyfill.


## Getting Started

Installation

```sh
npm i --save level-promisify
```

All of your favourite Level and Sublevel functions are still there but you can use most of them as a promise

```js
var Level = require( 'level-promisify' );

Level( './db' )
  .then( function( db ) {
    db.put( 'foo', 'bar' )
      .catch( function( err ) {
        console.log( err );
      });
  });
```

## API

* `Constructor`
* `put`
* `get`
* `del`
* `batch` *Array form*

### Level-promisify Constructor

Unlike the other API augments the constructor function replaces callback-style asynchronous behaviour with promise-style.

The default is to return a promise so if you want to create an instance synchronously you'll have to supply a flag.

```js
var Level = require( 'level-promisify' );

// Async - promise
Level( './db' )
  .then( function( db ) { /*...*/ } )
  .catch( function( err ) { /*...*/ } );

// vs the synchronous
var db = Level( './db', {    // will throw on error
  sync: true
});
db.get( /*...*/ );
```

Level-promisify can also be used to expose a promisified API for [sublevel](https://github.com/dominictarr/level-sublevel), again, just specify a flag and the promise will resolve with an instance of a sublevel-ready db. Like its counterpart this type of db can also be created synchronously.

```js
Level( './db', {
  sublevel: true
}).then( function( db ){
  // creating a sublevel is also promisified
  db.sublevel( 'users' )
    .then( sub ) {
      sub.put( 'john', 'sec7et' );    // this will also return a promise!
    };
});
```


### Put

`put` can now be called in 3 ways,

* Async - promise
* Async - callback
* Sync

Synchronous `puts` work the exact same way as a vanilla `Level` instance, meaning they are **significantly** slower than asynchronously calls.

```js
// Promise
db.put( 'key', 'value' )
  .then( function( err ) {
    // Perform some actions
    // You can handle the error here if you like or use catch
  })
  .catch( function( err ) {
    // Handle the error here
  });

// Callback - as normal
db.put( 'key', 'value', function( err ) {
  // Handle an error or do something now the database is a little fuller or updated
});

// Synchronous
db.put( 'key', 'value', {
  sync: true
})
// Now do more stuff
```


### Get

`get` doesnt have a synchronous variant so use callbacks as normal or handle the response using a promise.

```js
db.get( 'key' )
  .then( function( value ) {
    // do something with value
  })
  .catch( function( err ) {
    // Handle error
  });
```


### Del

`del` is another `levelup` function that can handle a synchronous call if you absolutely need it (see `put` for some extra info on synchronous calls).

```js
db.del( 'key' )
  .then()
  .catch();
```


### Batch *Array Form*

`batch` can be called by passing an array of options to the `batch` function or by chaining operations and performing the batch with a call to `write`. The chain form of the function is as normal but `batch` can also be used as a promise.

```js
db.batch([
  { type: 'del', key: 'group' },
  { type: 'put', key: 'admin', value: 'true' },
  { type: 'put', key: 'info', value: 'foobar' }
])
  .then()
  .catch();
```


## Events

As the promises are resolved within the usual `levelup` callback functions all of the usual events are still fired and work as normal.

```js
db.on( 'put', function() {
  console.log( 'fired on a put event' );
});

db.put( 'key', 'value' );

// will have output 'fired on a put event'
```


## Contributing

In lieu of a formal styleguide please take care to maintain the current coding style. Add test cases for any additional functionality. The test suite can be run using `npm test`.


## Additional Reading

* [Levelup](https://github.com/rvagg/node-levelup)
* [Sublevel](https://github.com/dominictarr/level-sublevel)
* [Levelup Mailing List](https://groups.google.com/forum/#!forum/node-levelup)
* [ES6 Promises](http://www.html5rocks.com/en/tutorials/es6/promises/)
* [JS Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)


## License

[ISC](https://github.com/mattstyles/level-promisify/blob/master/LICENSE.md)

Copyright (c) 2014 Matt Styles

---

@personalurban
