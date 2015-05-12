# react-native-TouchableSetActive
Touchable component for [React Native](https://github.com/facebook/react-native) that enables more advanced styling by setting an active state. Most useful for building your own touchable/button components on top of.

## Install
```sh
$ npm install react-native-TouchableSetActive --save
```

## Usage
First, require the `TouchableSetActive` component in your project.
```javascript
var TouchableSetActive = require('react-native-TouchableSetActive');
```

There are a few different ways you can use this component. They all are centered around passing a value to the `setActive` property on `TouchableSetActive`.

###setActive={this}
The simplest implementation is achieved by just passing `this`. The component will set an `active` state (using `this.setState`) on the parent component:
```javascript
class ExampleButton extends React.Component {
  render() {
    return(
      <TouchableSetActive
        setActive={this}
        style={[
          styles.inactiveButton,
          this.state.active && styles.activeButton,
        ]}
      >
        <Text
          style={this.state.active && styles.activeText}
        >
          Example Button
        </Text>
      </TouchableSetActive>
    );
  }
}
```

###setActive={*function*}
Instead of passing `this`, you can provide a function. It will be called whenever the component's active state changes, with a boolean value representing the active state as the only argument.
```javascript
class ExampleButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
    };
  }
  render() {
    return(
      <TouchableSetActive
        setActive={(isActive) => {
          this.setState({active: isActive});
        }}
        style={[
          !this.state.active && styles.inactiveButton,
          this.state.active && styles.activeButton,
        ]}
      >
        <Text
          style={this.state.active && styles.activeText}
        >
          Example Button
        </Text>
      </TouchableSetActive>
    );
  }
}
```


###setActive={*style*}
Lastly, you can pass styles directly to `setActive`. It should be noted that if you want to apply active styles to children of `TouchableSetActive`, you should use one of the above methods instead.
```javascript
class ExampleButton extends React.Component {
  render() {
    return(
      <TouchableSetActive
        setActive={styles.activeButton}
      >
        <Text> Example Button </Text>
      </TouchableSetActive>
    );
  }
}
```

## License
MIT © [Jeff Stout](http://jmstout.com)