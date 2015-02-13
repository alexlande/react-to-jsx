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

  componentJson = {
    _name: name,
    _attrs: _.omit(component.props, 'children'),
    _content: children
  };

  return componentJson;
}

var ReactToJsx = function (component) {
  componentXml = jstoxml.toXML(componentToJson(component), {
    indent: String.fromCharCode(9)
  });

  return componentXml;
};

module.exports = ReactToJsx;
