var React = require('react');

var ReactToJsx = require('../index');

var TestSection = React.createClass({
  render: function () {
    return (
      <section>
        {this.props.children}
      </section>
    );
  }
});

var CoolButton = React.createClass({
  render: function () {
    return (
      <button>{this.props.children}</button>
    );
  }
})

var Example = React.createClass({
  render: function () {
    var children = this.props.children;

    var markup = ReactToJsx(children);

    return (
      <div>
        <div>{this.props.children}</div>

        <pre>{markup}</pre>
      </div>
    )
  }
});

var App = React.createClass({
  render: function () {
    return (
      <div>
        <Example>
          <TestSection
            type="primary"
            size="large"
          >
            <h1>This is a section</h1>

            <CoolButton>Button!</CoolButton>
          </TestSection>
        </Example>
      </div>
    );
  }
});

React.render(<App />, document.getElementById('app'));
