**Important: `react-to-jsx` is deprecated and unmaintained. Use [react-element-to-jsx-string](https://github.com/algolia/react-element-to-jsx-string) instead!.**

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

#### `indent`

Type: `String` Default: `'\t'` (Tab)

Sets the indent string for returned JSX. Should probably match your preferred
code style. Two spaces? Four? Three? The choice is yours, friend.

#### `includeNull`

Type: 'Boolean' Default: `true`

Determines whether to include props with a value of `null` in the returned JSX.

#### `exclude`

Type: `Array` Default: `[]`

Array of props to exclude from the returned JSX. Hide those weird props, they shouldn't be in your docs anyway.
