# cycle-import-check

[![CircleCI](https://circleci.com/gh/Soontao/cycle-import-check.svg?style=shield)](https://circleci.com/gh/Soontao/cycle-import-check)
[![codecov](https://codecov.io/gh/Soontao/cycle-import-check/branch/master/graph/badge.svg)](https://codecov.io/gh/Soontao/cycle-import-check)
[![npm version](https://badge.fury.io/js/cycle-import-check.svg)](https://badge.fury.io/js/cycle-import-check)

ES6 cycle import check tool, suuport js, ts, jsx, tsx and mjs, will ignore all `node_modules` files.

## Why ?

In Javascirpt ES6, we use `import` & `export` in modules, but if files cycle import each other, some exported objects will be `undefined` in runtime.

The best practice is **one-way dependence**, and I wrote this tool to ensure no cycle-dependency in projects.

## Cycle dependency sample

Let's look at a circular dependency example: 

file1.js

```javascript
// file2 is really imported, all script runned
// and console will be first triggered in file2
import { value2 } from "./file2"; 
export const value1 = "value1"
// value2 is 'value2'
console.log("value2 in file1: " + value2) 
setTimeout(() => {
  // value2 is 'value2'
  console.log("delay 200ms, value2 in file1: " + value2)
}, 200)

```

file2.js

```javascript
// file1 is not really imported, no script runned
import { value1 } from "./file1"; 
export const value2 = "value2"  
// value1 is undefined
console.log("value1 in file2: " + value1) 
setTimeout(() => {
  console.log("delay 200ms, value1 in file2: " + value1) // value1 is 'value1'
}, 200)

```

```bash
> babel-node --presets es2015 file1.js

value1 in file2: undefined
value2 in file1: value2
delay 200ms, value1 in file2: value1
delay 200ms, value2 in file1: value2

```

If we only have two documents, this is a good judgment. 

However, if we have a large project with thousands of files, it is difficult to determine whether there is a circular dependency between each file.

## install

```bash
npm i -g cycle-import-check
```

## usage

```bash
iscan [a directory path]
```

## result

```text
> iscan tests/testproject4

Circular dependency existed in tests/testproject4

cycle 1, size (2):

  tests/testproject4/file2.js
  tests/testproject4/file1.js

```

or

```text
> iscan tests/testproject2

Congratulation, no import cycle founded in tests/testproject2
```