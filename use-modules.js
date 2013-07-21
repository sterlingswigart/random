#!/usr/bin/env node

var fib = require('./fib.js');
var rw = require('./rand-word-gen.js');

console.log("The 200th fibonacci number is: " + fib.fast_fib(200));

var gen = new rw.RandWordGenerator(["SUNNY", "SUNSET", "UNDERWATER", "SAVE", "INIDIGO"]);
console.log("Random word of the day is: " + gen.getRandomWord());
