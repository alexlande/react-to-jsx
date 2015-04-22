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
    children = component.props.children;
    children = _.isArray(children) ? children : [children];
    children = _.clone(children);
    children = _.map(children, componentToJson);
  }

  var matchingProps;

  if (component.type && component.type.defaultProps) {
    matchingProps = _.omit(component.props, function (val, key) {
      return component.type.defaultProps[key] === component.props[key];
    });
  } else {
    matchingProps = component.props;
  }

  var props = _.chain(matchingProps)
    .omit(['children'])
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

var reactToJsx = function (component, options) {
  var defaults = {
    indent: '\t'
  };

  var config = _.extend({}, defaults, options);

  var componentXml = jstoxml.toXML(componentToJson(component), {
    indent: config.indent
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

    var indentRegex = new RegExp(config.indent, 'g');

    var indentDepth = (line.match(indentRegex) || []).length;
    var newlineString = '\n' + config.indent;

    for (var i = 0; i < indentDepth; i++) {
      newlineString += config.indent;
    }

    line = line.replace(attributeMatcher, newlineString);

    return line;
  });

  componentXml = componentArray.join('\n');

  return componentXml;
};

module.exports = reactToJsx;
