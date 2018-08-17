// @flow

export function iterableToArray<T>(iter: Iterator<T>): T[] {
    return [...iter];
}

// eslint-disable-next-line max-statements,complexity
export function deepClone<T: Object>(originalObject: T): T {
    if (!originalObject) {
        return originalObject;
    } else if (Array.isArray(originalObject)) {
        return originalObject.map(e => deepClone(e));
    }
    if (originalObject instanceof Date) {
        return new Date(originalObject.getTime());
    } else if (originalObject instanceof Map) {
        const entries: any = iterableToArray(originalObject.entries()).map(e => deepClone(e));
        return (new Map(entries): any);
    } else if (originalObject instanceof Set) {
        const values: any = deepClone((iterableToArray(originalObject.values()): any));
        return (new Set(values): any);
    } else if (typeof originalObject === 'string' || typeof originalObject === 'number'
        || typeof originalObject === 'boolean') {
        return originalObject;
    }
    const copiedObject = Object.create(
        Object.getPrototypeOf(originalObject),
        Object.getOwnPropertyNames(originalObject).reduce(
            (object, propertyName) => {
                const propertyDescriptor = Object.getOwnPropertyDescriptor(originalObject, propertyName);
                if (propertyDescriptor && typeof propertyDescriptor.value !== 'undefined'
                    && typeof originalObject[propertyName] === 'object') {
                    propertyDescriptor.value = deepClone(propertyDescriptor.value);
                }
                object[propertyName] = propertyDescriptor;
                return object;
            },
            {}
        )
    );
    if (!Object.isExtensible(originalObject)) {Object.preventExtensions(copiedObject);}
    if (Object.isSealed(originalObject)) {Object.seal(copiedObject);}
    if (Object.isFrozen(originalObject)) {Object.freeze(copiedObject);}
    return copiedObject;
}
