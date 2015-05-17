/**
 * Copyright (c) 2015 Jeff Stout
 * MIT License
 *
 * The TouchableSetActive component was adapted from a fork of React Native's
 * original Touchable components. Therefore, the following license notice also
 * applies to parts of this source code.
 * See http://github.com/facebook/react-native for the files it refers to.
 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule TouchableSetActive
 */
'use strict';

var React = require('react-native');
var ReactIOSViewAttributes = require('ReactIOSViewAttributes');
var TimerMixin = require('react-timer-mixin');
var Touchable = require('Touchable');
var TouchableWithoutFeedback = require('TouchableWithoutFeedback');
var View = require('View');

var cloneWithProps = require('cloneWithProps');
var merge = require('merge');
var onlyChild = require('onlyChild');

var DEFAULT_HIDE_MS = 150;
var DEFAULT_ACTIVE_MS = 120;
var DEFAULT_LONG_PRESS_MS = 400;

var DEFAULT_PROPS = {
  delayOnPressOut: DEFAULT_HIDE_MS,
};

var TouchableSetActive = React.createClass({
  propTypes: {
    ...TouchableWithoutFeedback.propTypes,
    style: View.propTypes.style,
    /**
     * Required property used for setting the active state.
     * Accepts a React component class (this) or function.
     */
    setActive: function(props, propName, componentName) {
      if (!props[propName] || typeof(props[propName]) !== 'function' ||
        !React.addons.TestUtils.isCompositeComponent(props[propName])) {
        return new Error(
          componentName + ': prop type `' + propName + '` is ' +
          (props[propName] ? 'invalid' : 'missing') +
          '; it must be a React component class (this) or function.'
        );
      }
    },
    /**
     * Delay in ms, from the start of the touch, before the active state is shown.
     */
    delayActive: React.PropTypes.number,
    /**
     * Delay in ms, from the start of the active state, before it becomes inactive.
     */
    delayInactive: React.PropTypes.number,

    // Note: remove the following delay props when they land in core

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
  },

  mixins: [TimerMixin, Touchable.Mixin],

  getDefaultProps: () => DEFAULT_PROPS,

  _computeState: function(props) {
    return {
      setActive: props.setActive,
      componentStyle: props.style,
    };
  },

  getInitialState: function() {
    return merge(
      this.touchableGetInitialState(), this._computeState(this.props)
    );
  },

  componentDidMount: function() {
    this._activeType = this._getActiveType();
    this._delayActive = !!(this.props.delayActive ||
      this.props.delayActive === 0);
    this._delayInactive = !!(this.props.delayInactive ||
      this.props.delayInactive === 0);
  },

  componentWillReceiveProps: function(nextProps) {
    if (nextProps.setActive !== this.props.setActive ||
        nextProps.style !== this.props.style) {
      this.setState(this._computeState(nextProps));
    }
  },

  _getActiveType: function() {
    var type;
    var activeProp = this.state.setActive || this.props.setActive;
    if (typeof(activeProp) === 'function') type = 'func';
    else if (React.addons.TestUtils.isCompositeComponent(activeProp)) {
      type = 'class';
    } else type = false;
    return type;
  },

  /**
   * `Touchable.Mixin` self callbacks. The mixin will invoke these if they are
   * defined on your component.
   */
  touchableHandleActivePressIn: function() {
    this._fromPressIn = true;
    this.clearTimeout(this._hideTimeout);
    this._hideTimeout = null;
    !this._delayActive && this._showActive();
    if (this._delayInactive) {
      this._hideTimeout = this.setTimeout(this._hideActive,
        this.props.delayInactive);
    }
    this.props.onPressIn && this.props.onPressIn();
  },

  touchableHandleActivePressOut: function() {
    if (this.props.delayOnPressOut) {
      this._onPressOutTimeout = this.setTimeout(function() {
        this._onPressOut();
      }, this.props.delayOnPressOut);
    } else {
      this._onPressOut();
    }
  },

  _onPressOut: function() {
    if (!this._hideTimeout && !this._delayInactive) {
      this._isHiding = true;
      this._hideActive();
    }
    this.props.onPressOut && this.props.onPressOut();
  },

  touchableHandlePress: function() {
    if (this.props.delayOnPress) {
      if (!this._onPressTimeout) {
        this._onPressTimeout = this.setTimeout(function() {
          this.clearTimeout(this._onPressTimeout);
          this._onPressTimeout = null;
          this._onPress();
        }, this.props.delayOnPress);
      }
    } else {
      this._onPress();
    }
  },

  _onPress: function() {
    if (!this._fromPressIn) {
      !this._delayActive && this._showActive();
      this._isHiding = true;
      this._hideTimeout = this.setTimeout(this._hideActive,
        this._delayInactive ? this.props.delayInactive :
        this.props.delayOnPressOut || DEFAULT_HIDE_MS);
    }
    this.props.onPress && this.props.onPress();
  },

  touchableHandleLongPress: function() {
    this.props.onLongPress && this.props.onLongPress();
  },

  touchableGetPressRectOffset: function() {
    return PRESS_RECT_OFFSET;   // Always make sure to predeclare a constant!
  },

  touchableGetHighlightDelayMS: function() {
    return this.props.delayOnPressIn === 0 ? 0 :
      this.props.delayOnPressIn || DEFAULT_ACTIVE_MS;
  },

  touchableGetLongPressDelayMS: function() {
    return this.props.delayOnLongPress === 0 ? 0 :
      this.props.delayOnLongPress || DEFAULT_LONG_PRESS_MS;
  },

  _showActive: function() {
    if (!this._activeStatus) {
      this._activeStatus = true;
      if (this._activeType === 'class') {
        this.state.setActive.setState({active: true});
      } else if (this._activeType === 'func') {
        this.state.setActive(true);
      }
    }
  },

  _hideActive: function() {
    if (this._activeStatus) {
      this._activeStatus = false;
      this.clearTimeout(this._hideTimeout);
      this._hideTimeout = null;
      if (this._activeType === 'class') {
        this.state.setActive.setState({active: false});
      } else if (this._activeType === 'func') {
        this.state.setActive(false);
      }
    }
  },

  _componentHandleResponderGrant: function(e, dispatchID) {
    this._fromPressIn = false;
    this._isHiding = false;
    this.clearTimeout(this._onPressOutTimeout);
    this._onPressOutTimeout = null;
    this.clearTimeout(this._hideTimeout);
    this._hideTimeout = null;
    if (this._delayActive && !this._showTimeout) {
      this._showTimeout = this.setTimeout(function() {
        this.clearTimeout(this._showTimeout);
        this._showTimeout = null;
        this._showActive();
        if (this._delayInactive || this._isHiding) {
          this._isHiding && this.clearTimeout(this._hideTimeout);
          this._hideTimeout = this.setTimeout(this._hideActive,
            this._delayInactive ? this.props.delayInactive :
            this.props.delayOnPressOut || DEFAULT_HIDE_MS);
        }
      }, this.props.delayActive);
    }
    this.touchableHandleResponderGrant(e, dispatchID);
  },

  render: function() {
    return React.cloneElement(onlyChild(this.props.children), {
      style: [this.state.componentStyle, this.props.children.props.style],
      accessible: true,
      testID: this.props.testID,
      onStartShouldSetResponder: this.touchableHandleStartShouldSetResponder,
      onResponderTerminationRequest: this.touchableHandleResponderTerminationRequest,
      onResponderGrant: this._componentHandleResponderGrant,
      onResponderMove: this.touchableHandleResponderMove,
      onResponderRelease: this.touchableHandleResponderRelease,
      onResponderTerminate: this.touchableHandleResponderTerminate,
    });
  }
});

var PRESS_RECT_OFFSET = {top: 20, left: 20, right: 20, bottom: 30};

module.exports = TouchableSetActive;
