var React = require('react');
var _ = require('lodash');
var jstoxml = require('jstoxml');

var componentToJson = function (component) {
  var componentJson = {};
  var componentXml;

  var name;

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
    children = _.map(children, componentToJson);
  }

  var props = _.chain(component.props)
    .omit('children')
    .transform(function (result, prop, key) {
      if (_.isString(prop)) {
        result[key] = prop;
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
  componentXml = jstoxml.toXML(componentToJson(component), {
    indent: '\t'
  });

  console.log(componentXml);

  componentXml = componentXml.replace(/"LITERAL!/gi, '{');
  componentXml = componentXml.replace(/!LITERAL"/gi, '}');

  return componentXml;
};

module.exports = ReactToJsx;
