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
    special: (val, stamp) {
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
  x: 10 // → z: 10
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
      hello: {
        // moves the field "bye" to "hello"
        key: null
      }
    }
  }
})
```