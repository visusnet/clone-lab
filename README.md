Clone Lab
===

[![npm version](https://badge.fury.io/js/clone-lab.svg)](https://badge.fury.io/js/clone-lab)

Deeply clone arrays, maps, sets, dates, plain objects, and class instances.

## Install

With npm:
```bash
npm i --save clone-lab```
Or with yarn:
```bash
yarn add -D clone-lab
```

## Example

```javascript
// @flow
import deepClone from 'clone-lab';

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
