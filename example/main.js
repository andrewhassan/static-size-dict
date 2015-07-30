var StaticDict = require('../index');

var dict = new StaticDict(5);

console.log(dict.count()); // 0

dict.add(1, 1);
dict.add(2, 1);
dict.add(3, 1);
dict.add(4, 1);
dict.add(5, 1);

console.log(dict.count()); // 5
console.log(dict.dictionary()); // { '1': 1, '2': 1, '3': 1, '4': 1, '5': 1 }

dict.add(6, 1);

console.log(dict.count()); // 5
console.log(dict.dictionary()); // { '2': 1, '3': 1, '4': 1, '5': 1, '6': 1 }

dict.add(6, 2);

console.log(dict.count()); // 5
console.log(dict.dictionary()); // { '2': 1, '3': 1, '4': 1, '5': 1, '6': 2 }

console.log(dict.find(1)); // undefined
console.log(dict.find(6)); // 2

dict.remove(4);
console.log(dict.count()); // 4
console.log(dict.dictionary()); // { '2': 1, '3': 1, '5': 1, '6': 2 }

dict.removeAll();
console.log(dict.count()); // 0
console.log(dict.dictionary()); // {}

dict.add(5, 1);
dict.add(4, 1);
dict.add(3, 1);
dict.add(2, 1);
dict.add(1, 1);
dict.add(0, 1); // Removes 5 because it's the first in
console.log(dict.count()); // 5
console.log(dict.dictionary()); // { '0': 1, '1': 1, '2': 1, '3': 1, '4': 1 }

dict.setEvictionPolicy(StaticDict.dropFirstEvictionPolicy);

dict.add(6, 1); // Might remove 0 if it's the the first in the dict

console.log(dict.count()); // 0
console.log(dict.dictionary()); // { '0': 1, '1': 1, '2': 1, '3': 1, '4': 1 }