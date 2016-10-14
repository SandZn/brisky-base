# brisky-base
[![Build Status](https://travis-ci.org/vigour-io/brisky-base.svg?branch=master)](https://travis-ci.org/vigour-io/brisky-base)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![npm version](https://badge.fury.io/js/vigour-base.svg)](https://badge.fury.io/js/brisky-base)
[![Coverage Status](https://coveralls.io/repos/github/vigour-io/base/badge.svg?branch=master)](https://coveralls.io/github/vigour-io/brisky-base?branch=master)

Extendable object constructors, build for speed, low memory consumption and simplicity
- set method
- easy extendable property defintions
- deep, memory efficient prototypes
- parent and key fields
- types (easy inheritance)
- inject pattern

-
###Set
Set method, set values or objects on a base object, allways merges objects

**set**

```javascript
const base = require('brisky-base')

const obj = base({
  a: true,
  b: true
})

obj.set({
  a: {
    c: true
  }
}) // → results in { a: { val: true, c: true }, b: true }
```

**reset**

Overwrite base, removes all properties that end up in `.keys()`

```javascript
const base = require('brisky-base')
const b = base({
  a: true,
  b: true,
  properties: { c: true },
  c: 'haha non-key property' // c is not a part of .keys()
})

b.set({ reset: true, x: true }) // removes a and b, but not c, adds x
// reset can also be used as a method b.reset()
```

-
###Properties
The properties field is used to add property definitions for certain keys within set objects.

There are 4 types of property definitions:
- `true` clears any special base behaviour for the key
- `function` calls the function when the key is set instead of the normal behaviour
- `null` removes property definition and any existing instances
- `anything else` uses the set function

**basic**
```javascript
const base = require('brisky-base')
const obj = base({
  properties: {
    normal: true,
    special (val, stamp) {
      this.special = val * 10
    },
    base: { nested: true }
  }
})

obj.set({
  normal: 'hello', // → 'hello'
  special: 10, // → 100
  base: 'a base' // → Base { val: 'a base', nested: true }
})

obj.set({
  properties: {
    normal: null
    // removes property defintion and removes "normal"
  }
})
```

**set**

```javascript
const base = require('brisky-base')

const special = base({
  type: 'special'
})

const obj = base({
  properties: {
    // uses "noReference" for a base
    special: special
  }
})

obj.set({
  special: 10 // → Special 10
})

// add something to the "special" property
obj.set({
  properties: {
    special: {
      aField: true
    }
  }
})
// → base.special.aField.val === true, inherits from the property
```

**define**

Allows for extra customisation of property definitions.

It has 3 options:
- `:key` when a property is set uses this key to store its value
- `:reset` resets a previously defined property
- `:val` property value

```javascript
const briskyBase = require('brisky-base')

const obj = new base({
  properties: {
    define: {
      x: { key: 'y' },
      something: {
        key: 'else',
        val: {
          a: true,
          b: true
        }
      },
      hello: {
        key: 'bye',
        val: 100
      }
    }
  },
  x: 10 // → y: 10
  something: { c: true }, // → else: Base { a: true, b: true, c: true }
  hello: { field: true } // → bye: Base { val: 100, field: true }
})

obj.set({
  properties: {
    define: {
      something: {
        // removes the "else" field on base
        // creates a new property definition for "something"
        reset: true,
        val: 'hello'
      },
      x: {
        key: 'z',
        reset: false // will not move "y"
      },
      hello: {
        // moves "bye" → "hello"
        key: null
      }
    }
  }
})
```

-
###Context
Context enables deep memory efficient prototypes.
Stores information on fields about first non-shared ancestors.
The context syntax can be used to create mem efficient immutables for example

**basic**

Notice that `base.a.b.c === instance.a.b.c` is true but the paths are different

```javascript
const base = require('brisky-base')

const obj = base({
  key: 'base'
  a: { b: { c: 'its c' } }
})
const instance = new obj.Constructor({
  key: 'instance'
})
console.log(base.a.b.c === instance.a.b.c) // → true
console.log(instance.a.b.c.path()) // → [ 'instance', 'a', 'b', 'c' ]
console.log(base.a.b.c.path()) // → [ 'base', 'a', 'b', 'c' ]
```

**store and apply context**

Allows storage and restoration of context.
Usefull for edge cases where you need to make a handle to a nested field in a certain context

Consists of 2 methods
- applyContext(context)
- storeContext()

```javascript
const base = require('brisky-base')

const obj = base({
  key: 'base'
  a: { b: { c: 'its c' } }
})
const instance = new obj.Constructor({
  key: 'instance'
})
const b = instance.a.b
const context = b.storeContext()
console.log(obj.a.b.c) // this will remove the context "instance", and replace it with base
b.applyContext(context) // will reset the context of b to instance
```

Apply context can return 3 different types
- `undefined` Context is restored without any differences
- `Base` A set has happened in the path leading to the target of apply context
- `null` A remove has happened in the path leading to the target of apply co  ntext


-
###Get
Get by path, get with a default

```javascript
const base = require('brisky-base')

const obj = base({
  a: { b: { c: 'c!' } }
})

var c = obj.get('a.b.c') // get c
c = obj.get(['a', 'b', 'c']) // also gets c
c = obj.get('[0][0][0]') // also get c (gets first key of every object)
c = obj.get('[-1][-1][-1]') // also get c (gets last key of every object)

const d = obj.get('a.b.d', {}) // creates new property d with as a default value an empty object
```

-
###Each
Loop trough values of a base object

```javascript
const base = require('brisky-base')
const obj = base({
  key: 'base'
  a: {},
  b: {}
})

obj.each(p => {
  console.log(p) // iterates over each key
  // returning a value in each will break the each loop -- this is usefull for performance
})
```