# React to JSX

Generates a JSX string representation of React elements. Takes a React Element (or an array of React Elements). Useful for generating React component style guides.

## Usage

### Install

```
npm install react-to-jsx
```

### Basic Usage

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

### Options

`reactToJsx` takes an optional `options` object: `reactToJsx(reactElement, options)`.

#### Indent

Type: `String` Default: `'\t'` (Tab)

Sets the indent string for returned JSX. Should probably match your preferred
code style. Two spaces? Four? Three? The choice is yours, friend.
