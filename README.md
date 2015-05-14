# react-native-TouchableSetActive
Touchable component for [React Native](https://github.com/facebook/react-native) that enables more advanced styling by setting an active state. Most useful for building your own touchable/button components on top of.

## Install
```sh
$ npm install react-native-touchable-set-active --save
```

## Usage
First, require the `TouchableSetActive` component in your project.
```javascript
var TouchableSetActive = require('react-native-TouchableSetActive');
```

There are two different ways you can use this component. They both involve passing a value to the `setActive` property on `TouchableSetActive`.

###setActive={this}
The simplest implementation is achieved by just passing `this`. The component will set an `active` state (using `this.setState`) on the parent component. To toggle a style, set one conditionally in the style property that is dependent on `this.state.active`.

```javascript
class ExampleButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
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

## Additional Props
`TouchableSetActive` is just like any other [Touchable component](https://facebook.github.io/react-native/docs/touchablewithoutfeedback.html) in that it supports the following properties:
```javascript
onPressIn
onPressOut
onPress
onLongPress
```

It also supports touchable delay properties that are (*hopefully*) landing in React Native core soon (via [\#1255](https://github.com/facebook/react-native/pull/1255)):
```javascript
/**
 * Delay in ms, from the release of the touch, before onPress is called.
 */
delayOnPress: React.PropTypes.number,
/**
 * Delay in ms, from the start of the touch, before onPressIn is called.
 */
delayOnPressIn: React.PropTypes.number,
/**
 * Delay in ms, from the release of the touch, before onPressOut is called.
 */
delayOnPressOut: React.PropTypes.number,
/**
 * Delay in ms, from onPressIn, before onLongPress is called.
 */
delayOnLongPress: React.PropTypes.number,
```
*Support for `delayOnLongPress` is dependent on some underlying changes to the `Touchable` library. Unfortunately, it won't be available until those changes are committed. If you really need it now, take a look at [the PR](https://github.com/facebook/react-native/pull/1255) or [my branch](https://github.com/jmstout/react-native/tree/touchable-custom-delays) which adds this functionality. It should also be noted that until this PR lands, `delayOnPressIn` can be set to a maximum of `249` ms before throwing an error.*

Additionally, the props `delayActive` and `delayInactive` can be used to decouple the active state from the press events.
```javascript
/**
 * Delay in ms, from the start of the touch, before the active state is shown.
 */
delayActive: React.PropTypes.number,
/**
 * Delay in ms, from the start of the active state, before it becomes inactive.
 */
delayInactive: React.PropTypes.number,
```

## License
MIT © [Jeff Stout](http://jmstout.com)