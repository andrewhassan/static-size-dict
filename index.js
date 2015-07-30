var _ = require('lodash');

/**
 * StaticDict
 *
 * This library allows you to create a dictionary that has a set size limit.
 * You can push, find, and remove from the dictionary. When the dictionary
 * reaches the size limit, it will use an eviction policy to decide which
 * element to remove.
 *
 * @param {integer} max_size
 * @param {function} eviction_policy
 */
function StaticDict(max_size, eviction_policy) {
  eviction_policy = eviction_policy || StaticDict.fifoEvictionPolicy;

  this._count = 0;
  this._dict = {};
  this.max_size = max_size;
  this._insertion_array = [];
  this.eviction_policy = eviction_policy;
}

/**
 * FIFO Eviction Policy
 *
 * This eviction policy will remove the elements in FIFO order.
 *
 * @param {StaticDict} static_dict
 */
StaticDict.fifoEvictionPolicy = function(static_dict) {
  var index_to_drop = static_dict._insertion_array.shift();
  delete static_dict._dict[index_to_drop];
  static_dict._count--;
};

/**
 * Drop First Eviction Policy
 *
 * This policy will always drop the first element in the dictionary. Note that
 * the Javascript object key order is not defined.
 *
 * @param {StaticDict} static_dict
 */
StaticDict.dropFirstEvictionPolicy = function() {
  throw new Error('Not implemented yet');
};

/**
 * Drop Random Eviction Policy
 *
 * Drops a random key-value pair.
 *
 * @param {StaticDict} static_dict
 */
StaticDict.dropRandomEvictionPolicy = function() {
  throw new Error('Not implemented yet');
};

/***** API *****/
/**
 * Adds a key-value pair to the dictionary. If the size limit has been reached
 * then an element will be evicted from the dictionary before adding this new
 * one. Returns true if successful, or false if not.
 *
 * @param {?} key
 * @param {?} value
 * @returns {boolean}
 */
StaticDict.prototype.add = function(key, value) {
  // If the key already exists, then we replace that object and update the
  // insertion order
  if (key in this._dict) {
    this._dict[key] = value;
    _.remove(this._insertion_array, function(index) {
      return index === key;
    });
    this._insertion_array.push(key);
    return true;
  }

  if (this._count === this.max_size) {
    this.eviction_policy(this);
  }

  this._insertion_array.push(key);
  this._dict[key] = value;
  this._count++;
  return true;
};

/**
 * Finds the value for a specific key. If the key does not exist, `undefined`
 * will be returned.
 *
 * @param {?} key
 * @returns {?} value
 */
StaticDict.prototype.find = function(key) {
  return this._dict[key];
};

/**
 * Removes an element from the dictionary based on the key. Returns true if the
 * element was successfully removed, or false if the key doesn't exist.
 *
 * @param {?} key
 * @returns {boolean}
 */
StaticDict.prototype.remove = function(key) {
  if (key in this._dict) {
    delete this._dict[key];
    _.remove(this._insertion_array, function(index) {
      return index === key;
    });
    this._count--;

    return true;
  }

  return false;
};

/**
 * Returns the whole dictionary
 *
 * @returns {object}
 */
StaticDict.prototype.dictionary = function() {
  return this._dict;
};

/**
 * Returns the current number of elements in the dictionary.
 *
 * @returns {integer}
 */
StaticDict.prototype.count = function() {
  return this._count;
};

/**
 * Clears all entries in the dictionary
 *
 * @returns {boolean}
 */
StaticDict.prototype.removeAll = function() {
  this._count = 0;
  this._dict = {};
  this._insertion_array = [];
};

/**
 * Sets the eviction policy
 *
 * @param {function} eviction_policy
 */
StaticDict.prototype.setEvictionPolicy = function(eviction_policy) {
  this.eviction_policy = eviction_policy || StaticDict.fifoEvictionPolicy;
};

module.exports = StaticDict;