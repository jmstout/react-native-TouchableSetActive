# react-native-TouchableSetActive
Touchable component for [React Native](https://github.com/facebook/react-native) that enables more advanced styling by setting an active state.

## Install
```sh
$ npm install react-native-TouchableSetActive --save
```

## Usage
First, require the component in your project.
```javascript
var TouchableSetActive = require('react-native-TouchableSetActive');
```

There are a few different ways you can use this component. They all are centered around passing a value to the `setActive` property on `TouchableSetActive`.

###setActive={this}
This simplest implementation is achieved by just passing `this`. The component will set an `active` state (using this.setState) on the parent component:
```javascript
class ExampleButton extends React.Component {
  render() {
    return(
    <TouchableSetActive
      setActive={this}
      style={[
        styles.inactiveButton,
        this.state.active && styles.activeButton
      ]}
    >
      <Text>Example Button</Text>
    </TouchableSetActive>
    );
  }
}
```

## License
MIT © [Jeff Stout](http://jmstout.com)