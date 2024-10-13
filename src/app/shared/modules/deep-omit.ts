import _ from 'lodash';

export function deepOmit(obj: Record<string, any>, keysToOmit: string | Array<string>): Record<string, any> {
  var keysToOmitIndex =  _.keyBy(Array.isArray(keysToOmit) ? keysToOmit : [keysToOmit] ); // create an index object of the keys that should be omitted

  function omitFromObject(obj: Record<string, any>) { // the inner function which will be called recursivley
    return _.transform(obj, function(result: Record<string, any>, value, key) { // transform to a new object
      if (key in keysToOmitIndex) { // if the key is in the index skip it
        return;
      }

      result[key] = _.isObject(value) ? omitFromObject(value) : value; // if the key is an object run it through the inner function - omitFromObject
    });
  }

  return omitFromObject(obj); // return the inner function result
}