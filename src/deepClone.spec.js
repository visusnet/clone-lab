// @flow
import {deepClone, iterableToArray} from './deepClone';

class Dummy {
    _child: ?Dummy;
    constructorValue: number;
    value: string;

    constructor(constructorValue: number) {
        this.constructorValue = constructorValue;
    }

    set child(child: ?Dummy) {this._child = child;}

    get child() {return this._child;}

    // noinspection JSMethodCanBeStatic
    doSomething() {
        return 'something done';
    }

    doSomethingElse = () => {
        return 'something else done';
    };
}

describe('deepClone should', () => {
    it('create an object of the same prototype', () => {
        const originalDummy = new Dummy(1);
        const copiedDummy = deepClone(originalDummy);
        expect(copiedDummy).toBeInstanceOf(Dummy);
    });

    it('create an object with the same properties', () => {
        const originalDummy = new Dummy(1);
        const child = new Dummy(2);
        originalDummy.child = child;
        originalDummy.value = 'value';
        const copiedDummy = deepClone(originalDummy);
        expect(copiedDummy.child).toBeInstanceOf(Dummy);
        expect(copiedDummy.child).toEqual(child);
        expect(copiedDummy.constructorValue).toEqual(1);
    });

    it('create an object with the same functions', () => {
        const originalDummy = new Dummy(1);
        const copiedDummy = deepClone(originalDummy);
        expect(copiedDummy.doSomething()).toEqual(originalDummy.doSomething());
        expect(copiedDummy.doSomethingElse()).toEqual(originalDummy.doSomethingElse());
    });

    it('create an object with the same nested functions', () => {
        const originalDummy = new Dummy(1);
        originalDummy.child = new Dummy(2);
        const copiedDummy = deepClone(originalDummy);
        expect(copiedDummy.child).toBeDefined();
        expect(copiedDummy.child && copiedDummy.child.doSomething())
            .toEqual(originalDummy.child && originalDummy.child.doSomething());
        expect(copiedDummy.child && copiedDummy.child.doSomethingElse())
            .toEqual(originalDummy.child && originalDummy.child.doSomethingElse());
    });

    it('create an object which is not extensible', () => {
        const originalDummy = new Dummy(1);
        Object.preventExtensions(originalDummy);
        const copiedDummy = deepClone(originalDummy);
        expect(Object.isExtensible(copiedDummy)).toBe(false);
    });

    it('create a sealed object', () => {
        const originalDummy = new Dummy(1);
        Object.seal(originalDummy);
        const copiedDummy = deepClone(originalDummy);
        expect(Object.isSealed(copiedDummy)).toBe(true);
    });

    it('create a frozen object', () => {
        const originalDummy = new Dummy(1);
        Object.freeze(originalDummy);
        const copiedDummy = deepClone(originalDummy);
        expect(Object.isFrozen(copiedDummy)).toBe(true);
    });

    it('create an object with cloned properties', () => {
        const originalDummy = new Dummy(1);
        const child = new Dummy(2);
        const childChild = new Dummy(3);
        child.child = childChild;
        originalDummy.child = child;

        const copiedDummy = deepClone(originalDummy);

        // Referential equality must not be given for cloned child properties.
        expect(copiedDummy.child).not.toBe(originalDummy.child);
        expect(copiedDummy.child && copiedDummy.child.child).not.toBe(originalDummy.child && originalDummy.child.child);

        // Methods should still work.
        expect(copiedDummy.child && copiedDummy.child.doSomething()).toEqual('something done');
        expect(copiedDummy.child && copiedDummy.child.child && copiedDummy.child.child.doSomething())
            .toEqual('something done');

        // Modifications to the original object should not be reflected in the clone.
        child.constructorValue = 4;
        childChild.constructorValue = 5;
        expect(copiedDummy.child && copiedDummy.child.constructorValue).not.toBe(4);
        expect(copiedDummy.child && copiedDummy.child.child && copiedDummy.child.child.constructorValue).not.toBe(5);
    });

    it('create a Date object', () => {
        const date = new Date();
        const milliseconds = date.getMilliseconds();
        const copiedDate = deepClone(date);
        expect(copiedDate).toBeInstanceOf(Date);
        expect(copiedDate.getMilliseconds()).toEqual(milliseconds);
    });

    it('create a Map object', () => {
        const map = new Map();
        map.set('a', '1');
        map.set('b', '2');
        const copiedMap = deepClone(map);
        expect(copiedMap).toBeInstanceOf(Map);
        expect(copiedMap.get('a')).toEqual('1');
        expect(copiedMap.get('b')).toEqual('2');
    });

    it('create a Set object', () => {
        const set = new Set();
        set.add('a');
        set.add('b');
        const copiedSet = deepClone(set);
        expect(copiedSet).toBeInstanceOf(Set);
        const values = iterableToArray(copiedSet.values());
        expect(values).toContainEqual('a');
        expect(values).toContainEqual('b');
    });

    it('clone example', () => {
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
        expect(clonedChild).toEqual(child);
        expect(clonedChild.name).toEqual(child.name);
        expect(clonedChild.parents).toEqual(child.parents);
        expect(clonedChild.parents.get('mother')).toEqual(child.parents.get('mother'));
        expect(clonedChild.parents.get('father')).toEqual(child.parents.get('father'));
    });

    it('fail for cycles', done => {
        // If you see this and think this should be changes: Pull requests are always welcome!
        class Node {
            next: Node;
        }

        const node = new Node();
        node.next = node;

        try {
            deepClone(node);
            // $FlowFixMe fail is not provided by flow-typed.
            fail();
        } catch (e) {
            done();
        }
    });
});
