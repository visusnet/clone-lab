deepClone.js
===

[![npm version](https://badge.fury.io/js/deep-clone-js.svg)](https://badge.fury.io/js/deep-clone-js)

Deeply clone arrays, maps, sets, plain objects and class instances.

## Install

With npm:
```bash
npm i --save deep-clone-js```
Or with yarn:
```bash
yarn add -D deep-clone-js
```

## Example

```javascript
// @flow
import deepClone from 'deep-clone-js';

class Person {
    name: string;

    constructor(name: string) {
        this.name = name;
    }
}

class Parent extends Person {
    dateOfBirth: Date;
    character: Set<string>;

    constructor(name: string, dateOfBirth: Date, character: Set<string>) {
        super(name);
        this.dateOfBirth = dateOfBirth;
        this.character = character;
    }
}

class Child extends Person {
    parents: Map<string, Parent> = new Map();
}

const child = new Child('Holly');
const mother = new Parent('Offred', new Date('1970-01-01T03:24:00'), new Set(['kind', 'devotional']));
const father = new Parent('Nick', new Date('1975-01-01T05:12:00'), new Set(['calm', 'brave']));
child.parents.set('mother', mother);
child.parents.set('father', father);

const clonedChild = deepClone(child);
```

## Limitations

Cycles are not supported at this moment, i.e. this does not work:
```javascript
class Node {
    next: Node;
}

const node = new Node();
node.next = node;

deepClone(node); // error
```

## License

MIT
