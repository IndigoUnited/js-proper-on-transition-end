# proper-on-transition-end

[![Greenkeeper badge](https://badges.greenkeeper.io/IndigoUnited/js-proper-on-transition-end.svg)](https://greenkeeper.io/)

[![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][coveralls-image]][coveralls-url] [![Dependency status][david-dm-image]][david-dm-url] [![Dev Dependency status][david-dm-dev-image]][david-dm-dev-url]

[npm-url]:https://npmjs.org/package/proper-on-transition-end
[downloads-image]:http://img.shields.io/npm/dm/proper-on-transition-end.svg
[npm-image]:http://img.shields.io/npm/v/proper-on-transition-end.svg
[travis-url]:https://travis-ci.org/IndigoUnited/js-proper-on-transition-end
[travis-image]:http://img.shields.io/travis/IndigoUnited/js-proper-on-transition-end/master.svg
[coveralls-url]:https://coveralls.io/r/IndigoUnited/js-proper-on-transition-end
[coveralls-image]:https://img.shields.io/coveralls/IndigoUnited/js-proper-on-transition-end/master.svg
[david-dm-url]:https://david-dm.org/IndigoUnited/js-proper-on-transition-end
[david-dm-image]:https://img.shields.io/david/IndigoUnited/js-proper-on-transition-end.svg
[david-dm-dev-url]:https://david-dm.org/IndigoUnited/js-proper-on-transition-end?type=dev
[david-dm-dev-image]:https://img.shields.io/david/dev/IndigoUnited/js-proper-on-transition-end.svg

Cross-browser `transitionend` event listener.

This module is based on [on-transition-end](https://github.com/jshanson7/on-transition-end), which no longer seems to be maintained and is not working properly. Also, it automatically infers the timeout based on the transition duration.

```js
import onTransitionEnd from 'proper-on-transition-end';
// or
const onTransitionEnd = window.onTransitionEnd;

const element = document.getElementById('transitioning-element');

onTransitionEnd(element, () => console.log('done'));
```

## Installation

`$ npm install proper-on-transition-end`

## Usage

```js
onTransitionEnd(element, [options,] callback)
```

- `element`: The element that is transitioning.
- `options`: You can pass a few options here:
    - `timeout`: This is automatically calculated for you, based on the longest transition of the element, using [`longest-transition`](https://github.com/IndigoUnited/js-longest-transition). Still, you can override that and pass the `timeout` in milliseconds.
    - `gracePeriod`: There is an implicit grace period of `100` milliseconds before the event times out, but you can tweak it using this option.
- `callback`: The callback that is called when the transition ends.

## Tests

`$ npm test`   
`$ npm test-cov` to get coverage report

## License

Released under the [MIT License](http://www.opensource.org/licenses/mit-license.php).
