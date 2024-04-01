# iterable
![logo](https://avatars1.githubusercontent.com/u/31987273?v=4&s=100)

wrap an async/sync Iterable as async Iterable. 

[![NPM version][npm-image]][npm-url]
[![Travis Status][travis-image]][travis-url]
[![Travis Status][codecov-image]][codecov-url]

## Usage

_package requires a system that supports async-iteration, either natively or via down-compiling_

### Install
```
npm install @async-generators/iterable --save
yarn add @async-generators/iterable
```

This package's `main` entry points to a `commonjs` distribution. 

Additionally, the `module` entry points to a `es2015` distribution, which can be used by build systems, such as webpack, to directly use es2015 modules. 

## Api

### iterable(source)

<code>iterable()</code> checks to see if source is iterable (either async of sync) and returns an object with `[Symbol.asyncIterator]` that wraps the source iterable. 

`source` must have a `[Symbol.asyncIterator]` or `[Symbol.iterator]` property. If both are present only `[Symbol.asyncIterator]` is used. If none are present then an error is thrown. 

## Example

example.js
```js
const iterable = require('@async-generators/iterable').default;

function* source() {
  yield 1; yield 2; yield* [3, 4];
}

async function main(){
  for await (let item of iterable(source())){
     console.log(item);
  }
}

main();
```

Execute with the latest node.js: 

```
node --harmony-async-iteration example.js
```

output:
```
1
2
3
4
```
## Typescript

This library is fully typed and can be imported using: 

```ts
import iterable from '@async-generators/iterable');
```

It is also possible to directly execute your [properly configured](https://stackoverflow.com/a/43694282/1657476) typescript with [ts-node](https://www.npmjs.com/package/ts-node):

```
ts-node --harmony_async_iteration example.ts
```

[npm-url]: https://npmjs.org/package/@async-generators/iterable
[npm-image]: https://img.shields.io/npm/v/@async-generators/iterable.svg
[npm-downloads]: https://img.shields.io/npm/dm/@async-generators/iterable.svg
[travis-url]: https://travis-ci.org/async-generators/iterable
[travis-image]: https://img.shields.io/travis/async-generators/iterable/master.svg
[codecov-url]: https://codecov.io/gh/async-generators/iterable
[codecov-image]: https://codecov.io/gh/async-generators/iterable/branch/master/graph/badge.svg
