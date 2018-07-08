// control props

import React from 'react'
import {Switch} from '../switch'

function pickBy(obj, predicate) {
  return Object.entries(obj).reduce(
    (acc, [key, val]) =>
      predicate(key, val) ? acc : {...acc, [key]: val},
    {},
  )
}

function omit(obj, keysToOmit) {
  return pickBy(obj, key => keysToOmit.includes(key))
}

function pipe(firstFn = f => f, ...fns) {
  return (...args) =>
    fns.reduce((acc, fn) => fn(acc), firstFn(...args))
}

class Toggle extends React.Component {
  static stateChangeTypes = {
    toggle: '__Toggle_toggle__',
  }
  static defaultProps = {
    onStateChange: () => {},
    onToggle: () => {},
  }
  state = {on: false}

  isControlled(prop) {
    return this.props[prop] !== undefined
  }

  getState(state = this.state) {
    return Object.keys(state).reduce(
      (combinedState, prop) => ({
        ...combinedState,
        [prop]: this.isControlled(prop)
          ? this.props[prop]
          : state[prop],
      }),
      {},
    )
  }

  internalSetState(changes, callback) {
    var allChanges
    this.setState(
      pipe(
        // Create object containing all changes
        prevState => {
          allChanges =
            typeof changes === 'function'
              ? // allow user to pass `null` or `false` signifying no changes
                changes(this.getState(prevState)) || {} // ↲
              : changes
          return allChanges
        },
        c => omit(c, 'type'),
        // Pass along only uncontrolled changes (those are stored in state)
        c => pickBy(c, key => this.isControlled(key)),
        // Prevent rerender when there are no changes
        c => (Object.keys(c).length > 0 ? c : null),
      ),
      () => {
        this.props.onStateChange(allChanges)
        callback()
      },
    )
  }

  toggle = ({
    on: newState,
    type = Toggle.stateChangeTypes.toggle,
  } = {}) => {
    this.internalSetState(
      ({on}) => ({
        type,
        on: typeof newState === 'boolean' ? newState : !on,
      }),
      () => {
        this.props.onToggle(this.getState().on)
      },
    )
  }
  render() {
    const {on} = this.getState()
    // Prevent onClick accidentaly passing `type` to toggle
    // by wrapping it in a function
    return <Switch on={on} onClick={() => this.toggle()} />
  }
}

// Don't make changes to the Usage component. It's here to show you how your
// component is intended to be used and is used in the tests.
// You can make all the tests pass by updating the Toggle component.
class Usage extends React.Component {
  state = {bothOn: false}
  handleStateChange = changes => {
    this.setState(
      state =>
        changes.on !== state.bothOn ? {bothOn: changes.on} : null,
    )
  }
  render() {
    const {bothOn} = this.state
    const {toggle1Ref, toggle2Ref} = this.props
    return (
      <div>
        <Toggle
          on={bothOn}
          onStateChange={this.handleStateChange}
          ref={toggle1Ref}
        />
        <Toggle
          on={bothOn}
          onStateChange={this.handleStateChange}
          ref={toggle2Ref}
        />
      </div>
    )
  }
}
Usage.title = 'Control Props'

export {Toggle, Usage as default}
