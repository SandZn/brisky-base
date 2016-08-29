# vigour-base
<!-- VDOC.badges travis; standard; npm; coveralls -->
<!-- DON'T EDIT THIS SECTION (including comments), INSTEAD RE-RUN `vdoc` TO UPDATE -->
[![Build Status](https://travis-ci.org/vigour-io/base.svg?branch=master)](https://travis-ci.org/vigour-io/base)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![npm version](https://badge.fury.io/js/vigour-base.svg)](https://badge.fury.io/js/vigour-base)
[![Coverage Status](https://coveralls.io/repos/github/vigour-io/base/badge.svg?branch=master)](https://coveralls.io/github/vigour-io/base?branch=master)

<!-- VDOC END -->
Extendable object constructors, build for speed, low memory consumption and simplicity
- set method
- easy extendable property defintions
- deep, memory efficient prototypes
- parent and key fields
- types (easy inheritance)
- inject pattern

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
var base = new Base({
  properties: {
    normal: true,
    special (val, stamp) {
      this.special = val * 10
    },
    base: { nested: true }
  }
})

base.set({
  normal: 'hello', // → 'hello'
  special: 10, // → 100
  base: 'a base' // → Base { val: 'a base', nested: true }
})

base.set({
  properties: {
    normal: null
    // removes property defintion and removes "normal"
  }
})
```

**set**
```javascript
var special = new Base({
  type: 'special'
})

var base = new Base({
  properties: {
    // uses "noReference" for a base
    special: special
  }
})

base.set({
  special: 10 // → Special 10
})

// add something to the "special" property
base.set({
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
var base = new Base({
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

base.set({
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

**basic**

Notice that `base.a.b.c === instance.a.b.c` is true but the paths are different

```javascript
const base = new Base({
  key: 'base'
  a: { b: { c: 'its c' } }
})
const instance = new base.Constructor({
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
const base = new Base({
  key: 'base'
  a: { b: { c: 'its c' } }
})
const instance = new base.Constructor({
  key: 'instance'
})
const b = instance.a.b
const context = b.storeContext()
console.log(base.a.b.c) // this will remove the context "instance", and replace it with base
b.applyContext(context) // will reset the context of b to instance
```

Apply context can return 3 different types
- `undefined` Context is restored without any differences
- `Base` A set has happened in the path leading to the target of apply context
- `null` A remove has happened in the path leading to the target of apply co  ntext
