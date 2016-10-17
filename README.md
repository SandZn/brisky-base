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

**remove**

Remove a base object

```javascript
const base = require('brisky-base')
const b = base({ a: true, b: true, })
b.a.remove() //  → removes a and all nested properties
b.set({ b: null }) //  → same as .remove()
b.set(null) // removes b and all nested properties
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

**move**

Move a property to another property

```javascript
const base = require('brisky-base')
const b = base({ a: true, b: true, })
b.move('a', 'b') // move a to b → 100
```

**inject**

Like a set but only called once, used for composition of modules and behaviour

```javascript
const base = require('brisky-base')
const b = base()

const someModule = require('someModule')
// somemodule is { a: 'hello' }

const otherModule = require('someModule')
// otherModule is { b: 'bye' }

b.inject(someModule, otherModule) // calls a set for both modules
b.set({
  inject: [ someModule, otherModule ] // set notation
})
// when inject gets called again, and module is allready
// set will not do it again, this is usefull for inheritance / nested deps
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
- `applyContext(context)`
- `storeContext()`

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
Simple get api, usefull when dealing with defaults

**basic**

```javascript
const base = require('brisky-base')
const obj = base({ a: { b: { c: 'c!' } } })
var c = obj.get('a.b.c') // get c
c = obj.get(['a', 'b', 'c']) // also gets c
```

**default**

```javascript
const base = require('brisky-base')
const obj = base({ a: { b: { c: 'c!' } } })
const d = obj.get('a.b.d', {}) // creates new property d with as a value an empty object
const c = obj.get('a.b.c', 'default!') // gets a.b.c, does not set it to "default!""
```

**index**

```javascript
const base = require('brisky-base')
const obj = base({ a: { b: { c: 'c!' } } })
c = obj.get('[0][0][0]') // also get c (gets first key of every object)
c = obj.get('[-1][-1][-1]') // also get c (gets last key of every object)
c = obj.get('[2]') // returns undefined (tries to get the 3rd key)
```

-
###Iteration

Base exposes as much standard apis for iteration as possible, `.each` is the exception

**array**

Like standard array methods, but iterating over base properties

[map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map),
[filter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter),
[reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce),
[forEach](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach)

**push**

Similair to array push, but generates a key based on current time, does not support multiple arguments

```javascript
const base = require('brisky-base')
base.push('hello') // creates a key based on `Date.now()`  → { 21321232323: 'hello' }
base.push('hello') // pushing at the same time adds a decimal → {   '21321232323.1': 'hello'  }
base.push('x', 111) // second argument is stamp, does not support multiple values
```

**each**

Loop trough values of a base object, differs slightly from `forEach`

```javascript
const base = require('brisky-base')
const obj = base({
  key: 'base'
  a: {},
  b: {},
  c: { keyType: 'hello' }

obj.each(p => {
  console.log(p) // iterates over each key
  // returning a value in each will break the each loop and return the value
})

obj.each(p => {
  // iterates over keyType 'hello'
}, 'hello')
```


-
###Types

Use the types api to reduce complexity of dealing with classes, prototypes and components.
Especialy usefull for composition when combined with inject

**basic**

```javascript
const base = require('brisky-base')

const article = {
  types: {
    article: {
      text: 'some text',
      title: 'hello'
    }
  }
}

base({
  field: { type: 'article' }, // will make field into an instance of article,
  bla: { type: 'article' }, // will make bla into an instance of article
  nested: {
    types: {
      article: { text: 'lullz special article' },
    },
    something: { type: 'article' } // will get the fist "types.article" it can find in a parent
  }
})
```

Big advantage of this system is that it allows you to change types not as dependents but as extensions, bit smilair to for example web components.


-
###Compute

Compute is used to return the computed value of a base object - this allows for special hooks and, for example function support

**basic**

```javascript
const base = require('brisky-base')
const a = base(() => Date.now())
a.compute() // → "return the current date"
```


-
###References

Serializable references, this is handy for, for example dealing with server/client side or multiple processes.

**basic**

```javascript
const base = require('brisky-base')
const a = base('a')
const b = base(a)
console.log(b.compute()) // → "a"
a.set('A!')
console.log(b.compute()) // → "A!"
```

**string notation**

```javascript
const base = require('brisky-base')
const obj = base({
  a: '$root.b', // creates b on the root when its not there
  c: {
    d: '$.parent.parent.a', // gets a
    e: '$.parent.d' // gets the parent object "d"
  }
})
obj.set({ b: 'its b!' })
console.log(a.c.e.compute()) // → returns "its b!"
```

-
###Serialize
Serialize base objects to normal objects

**basic**

```javascript
const base = require('brisky-base')
const obj = base({
  a: 'a!',
  b: {
    val: 'b!',
    c: true
  }
})
obj.set({ d: obj.a })
obj.serialize() // → { a: 'a!', b: { val: 'b!', c: true }, d: '$root.a' }
```

**compute**

Computes values instead of making them into set objects

```javascript
const base = require('brisky-base')
const obj = base({
  a: {
    val: 'hello',
    b: true
  },
  b: '$root.a'
})
obj.serialize(true) // → { a: 'hello', b: 'hello' }
```

**filter**

Computes values instead of making them into set objects

```javascript
const base = Base({
  yuzi: {
    james: {
      marcus: true,
      secret: true
    }
  }
})
base.serialize(false, (prop) => prop.key !== 'secret') // → { yuzi: { james: { marcus: true } } },
```
