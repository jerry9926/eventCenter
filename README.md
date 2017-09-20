# eventCenter
[![License](https://img.shields.io/badge/License-MIT-lightgrey.svg)](https://github.com/jerry9926/eventCenter)
[![Platform](https://img.shields.io/badge/platform-javascript-brightgreen.svg)](https://github.com/jerry9926/eventCenter)

A eventCenter with publish subscribe model in javascript

## Including EventCenter

As a script, copy file `dist/eventCenter.js` and add a script label in html.
```
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <!-- including eventCenter file -->
    <script src="eventCenter.js"></script>
</head>
</html>
```

Use AMD or Webpack

Copy file `src/eventCenter.js` and require.
```
var EventCenter = require('./path/eventCenter');
```

Use ES6(ES2015)
Copy file `src/eventCenter.js` and import.
```
import EventCenter from './path/eventCenter';
```

## Usage
```
var eventCenter = new EventCenter();

// emitEvent
eventCenter.emitEvent('login', {
    username: 'Peter'
});

// add EventListener
eventCenter.addEventListener('login', 'header', function (data) {
    // do something
});

// remove Event
eventCenter.removeEvent('login');
```

See more in `demo`

## Author

Kuler Huang, jerry9926@163.com

## License

eventCenter is available under the MIT license. See the LICENSE file for more info.