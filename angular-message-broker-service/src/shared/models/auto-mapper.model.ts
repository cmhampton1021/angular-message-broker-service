export class AutoMapper {

    private logWarnings: boolean = false;
    private reservedNames: string[] = [
        'reflectionData',
        'constructor',
        'reduce',
        'mapObject',
        'mapItem',
        'deepCopy',
        'log',
        'logWarnings',
        'reservedProperties'
    ];

    constructor() {
    }

    public mapObject(obj: any, logWarnings?: boolean) {

        // If the logWarnings variable is being overridden...
        if (typeof logWarnings !== 'undefined') {
            this.logWarnings = logWarnings;
        }

        // If the object that was passed in is an array, parse each item individually and return them in an array.
        if (Array.isArray(obj)) {
            return obj.map(item => this.deepCopy(this.mapObject(item), []));
        }

        // Get an array of the keys in this object.
        const keys = Object.keys(this);

        // Iterate through each key.
        keys.forEach(keyName => {

            // Only process the property if it is not one of the helper properties or methods.
            if (this.reservedNames.indexOf(keyName) < 0) {

                if (obj.hasOwnProperty(keyName)) {
                    this[keyName] = this.mapItem(obj[keyName], keyName);
                }
                else {

                    // If the key is not a function and is not the reflectionData object, notify the console that is was missing from the supplied object.
                    if (typeof this[keyName] !== 'function' && keyName !== 'reflectionData') {
                        
                        // Get the type of object we are processing and use regex to remove the parameter definition.
                        const type = this.constructor.toString().split(' ')[1].replace(/(\([A-Za-z, ]*\))/g, '');
                        this.log(`The property '${keyName} declared in ${type} does not exist in the object.`);
                    }
                }
            }
        });

        return this;

    }

    // Returns an object with only the properties requested.
    public reduce(properties: string[]) {
        const retObj = {};

        properties.forEach(property => {
            if (this.hasOwnProperty(property)) {
                retObj[property] = this[property];
            }
        });

        return retObj;
    }

    // https://medium.com/@tkssharma/objects-in-javascript-object-assign-deep-copy-64106c9aefab
    private deepCopy(obj: any, exclusions: string[]) {
        let clone = {};
        for (const keyName in obj) {
            if (obj[keyName] !== null && typeof obj[keyName] === 'object') {
                clone[keyName] = this.deepCopy(obj[keyName], []); // We don't need to worry about exclusions on the child objects.
            }
            else {
                clone[keyName] = obj[keyName];
            }
        }

        return clone;
    }

    private log(a, b?) {
        console.log(a);
        if (typeof b !== 'undefined') {
            console.log(b);
        }
    }

    private mapItem(item: any, keyName?: string) {
        let retVal;
        const type = Array.isArray(item) ? 'array' : typeof item;

        switch(type) {

            case 'object':

                // Check to see if this object has an entry in the reflectionData object.
                if (this.hasOwnProperty('reflectionData') && this['reflectionData'].hasOwnProperty(keyName)) {
                    
                    // If it does, use the deep copy method to create a new instance of the object type.
                    const object = this.deepCopy(this['reflectionData'][keyName].type, []);
                    retVal = object['mapObject'](item);

                }

                // Otherwise, throw a warning that the object does not have a type declared, and return it as is.
                else {
                    this.log(`WARNING: The property '${keyName} does not have a type and is being added as a generic object.`);
                    retVal = item;
                }

                break;

            case 'array':

                retVal = item.map(childItem => {
                    if (['string', 'number', 'boolean'].indexOf(typeof childItem) >= 0) {
                        return childItem;
                    }
                    else {

                        // We need to make sure that this object has extended the AutoMapper class.
                        if (childItem.hasOwnProperty('mapObject')) {
                            const clone = this.deepCopy(this['reflectionData'][keyName], []);
                            return clone['mapObject'](childItem);
                        }

                        else {
                            return this.mapItem(childItem, keyName);
                        }
                    }
                });

                break;

            case 'boolean':
            case 'string':
            case 'number':
                retVal = item
                break;

            default:
                this.log(`WARNING: ${keyName} is not a known type.`);
        }

        return retVal;
    }

}