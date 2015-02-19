var _ = require('lodash');
var jstoxml = require('jstoxml');

var componentToJson = function (component) {
  var componentJson = {};
  var componentArray = [];
  var name;

  if (_.isArray(component)) {
    _.forEach(component, function (item) {
      componentArray.push(componentToJson(item));
    });

    return componentArray;
  }

  if (component.type && component.type.displayName) {
    name = component.type.displayName;
  } else if (component.type) {
    name = component.type;
  } else {
    return component;
  }

  var children;

  if (component.props && component.props.children) {
    children = _.clone(component.props.children);
    children = _.isArray(children) ? children : [children];
    children = _.map(children, componentToJson);
  }

  var props = _.chain(component.props)
    .omit('children')
    .transform(function (result, prop, key) {
      if (_.isString(prop)) {
        result[key] = prop;
      } else if (_.isFunction(prop)) {
        result[key] = 'LITERAL!function!LITERAL';
      } else {
        result[key] = 'LITERAL!' + JSON.stringify(prop) + '!LITERAL';
      }
    })
    .value();

  componentJson = {
    _name: name,
    _attrs: props,
    _content: children
  };

  return componentJson;
}

var ReactToJsx = function (component) {
  var componentXml = jstoxml.toXML(componentToJson(component), {
    indent: '\t'
  });

  componentXml = componentXml
    .replace(/"LITERAL!/g, '{')
    .replace(/!LITERAL"/g, '}')

  var componentArray = componentXml.split('\n');

  componentArray = _.map(componentArray, function (line) {
    var attributeMatcher = /\s+(?=\S*=)/g;

    if ((line.match(attributeMatcher) || []).length < 2) {
      return line;
    }

    var indentDepth = (line.match(/\t/g) || []).length;
    var newlineString = '\n\t';

    for (var i = 0; i < indentDepth; i++) {
      newlineString += '\t';
    }

    line = line.replace(attributeMatcher, newlineString);

    return line;
  });

  componentXml = componentArray.join('\n');

  return componentXml;
};

module.exports = ReactToJsx;
