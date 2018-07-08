// prop getters

import React from 'react'
import {Switch} from '../switch'

function mergePropsAndFunctions(...objects) {
  return objects.reduce((accumulator, current) =>
    Object.assign(
      {},
      accumulator,
      ...Object.keys(current).map(
        key =>
          isFunction(current[key]) && isFunction(accumulator[key])
            ? {[key]: callAll(accumulator[key], current[key])}
            : {[key]: current[key]},
      ),
    ),
  )
}

function isFunction(obj) {
  return typeof obj === 'function'
}

function callAll(...functions) {
  return (...args) => functions.forEach(fn => fn && fn(...args))
}

class Toggle extends React.Component {
  state = {on: false}
  toggle = () =>
    this.setState(
      ({on}) => ({on: !on}),
      () => this.props.onToggle(this.state.on),
    )
  getTogglerProps = props => {
    const defaultProps = {
      'aria-pressed': this.state.on,
      onClick: this.toggle,
    }
    return mergePropsAndFunctions(defaultProps, props)
  }
  getStateAndHelpers() {
    return {
      on: this.state.on,
      toggle: this.toggle,
      getTogglerProps: this.getTogglerProps,
    }
  }
  render() {
    return this.props.children(this.getStateAndHelpers())
  }
}

// Don't make changes to the Usage component. It's here to show you how your
// component is intended to be used and is used in the tests.
// You can make all the tests pass by updating the Toggle component.
function Usage({
  onToggle = (...args) => console.log('onToggle', ...args),
  onButtonClick = () => console.log('onButtonClick'),
}) {
  return (
    <Toggle onToggle={onToggle}>
      {({on, getTogglerProps}) => (
        <div>
          <Switch {...getTogglerProps({on})} />
          <hr />
          <button
            {...getTogglerProps({
              'aria-label': 'custom-button',
              onClick: onButtonClick,
              id: 'custom-button-id',
            })}
          >
            {on ? 'on' : 'off'}
          </button>
        </div>
      )}
    </Toggle>
  )
}
Usage.title = 'Prop Getters'

export {Toggle, Usage as default}
