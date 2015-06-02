var _ = require('lodash');
var jstoxml = require('jstoxml');
var React = require('react/addons');

var componentToJson = function (component, config) {
  var componentJson = {};
  var componentArray = [];
  var name;

  if (_.isArray(component)) {
    _.forEach(component, function (item) {
      componentArray.push(componentToJson(item, config));
    });

    return componentArray;
  }

  if (component.type && (component.type.displayName || component.type.name)) {
    name = component.type.displayName || component.type.name;
  } else if (component.type) {
    name = component.type;
  } else {
    return component;
  }

  var children;

  if (component.props && component.props.children) {
    children = component.props.children;
    children = _.isArray(children) ? children : [children];
    children = _.map(children, function (child, config) {
      var result = componentToJson(child, config);

      return result;


      return componentToJson(child, config);
    });
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
      if (_.isUndefined(prop)) {
        return;
      } else if (_.isNull(prop) && !config.includeNull) {
        return;
      } else if (config.exclude && config.exclude.indexOf(key) !== -1) {
        return;
      } else if (_.isString(prop)) {
        result[key] = prop;
      } else if (_.isFunction(prop)) {
        result[key] = 'LITERAL!function!LITERAL';
      } else if (React.addons.TestUtils.isElement(prop)) {
        result[key] = 'LITERAL!' + reactToJsx(prop) + '!LITERAL';
      } else {
          var stringified;
          try {
              stringified = JSON.stringify(prop);
          } catch(e) {
              stringified = '[Circular JSON]';
          }

        result[key] = 'LITERAL!' + stringified + '!LITERAL';
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
    indent: '\t',
    includeNull: true,
    exclude: []
  };

  var config = _.extend({}, defaults, options);

  var componentXml = jstoxml.toXML(componentToJson(component, config), {
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
