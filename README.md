# React to JSX

Generates a JSX string representation of React elements. Takes a React Element (or an array of React Elements). Useful for generating React component style guides. 

## Usage

```
npm install react-to-jsx
```

```js
var reactToJsx = require('react-to-jsx');

var jsxString = reactToJsx(
  <Button
    type="submit"
    size="large">
    Cool Button
  </Button>
);

// <Button
//   type="submit"
//   size="large">
//   Cool Button
// </Button>

console.log(jsxString);
```
