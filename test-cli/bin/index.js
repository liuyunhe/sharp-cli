#!/usr/bin/env node

const lib = require('test-cli-lib')

console.log(lib.sum(1,2))

console.log("Hello World, this is my first CLI tool!!!!");

const argv = require('process').argv

console.log(argv)

const [option, param1, param2] = argv.slice(2)

if (option === 'sum') {
  console.log(lib.sum(param1, param2))
} else { 
  console.log('Invalid option')
}