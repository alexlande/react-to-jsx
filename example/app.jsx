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
      <div className="example">
        <div className="description">{this.props.children}</div>

        <pre className="sample">{markup}</pre>
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
            cool={true}
            type="primary"
            size="large"
            friends={["john", "mark"]}
            style={{backgroundColor: "red", border: "1px solid blue"}}
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
