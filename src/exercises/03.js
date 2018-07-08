// Flexible Compound Components with context

import React from 'react'
import {Switch} from '../switch'

var ToggleContext = React.createContext()

function ToggleConsumer({children}) {
  return (
    <ToggleContext.Consumer>
      {context => {
        if (!context) {
          throw new Error(
            'Toggle compound components can not be used outside the Toggle component',
          )
        }
        return children(context)
      }}
    </ToggleContext.Consumer>
  )
}

class Toggle extends React.Component {
  // Compound components
  static On = ({children}) => (
    <ToggleConsumer>
      {({on}) => (on ? children : null)}
    </ToggleConsumer>
  )
  static Off = ({children}) => (
    <ToggleConsumer>
      {({on}) => (on ? null : children)}
    </ToggleConsumer>
  )
  static Button = props => (
    <ToggleConsumer>
      {({on, toggle}) => (
        <Switch on={on} onClick={toggle} {...props} />
      )}
    </ToggleConsumer>
  )

  toggle = () =>
    this.setState(
      ({on}) => ({on: !on}),
      () => this.props.onToggle(this.state.on),
    )

  // I am adding the toggle() method to state to prevent unnecessary rerenders
  // Whether a component needs to be rerendered is determined by a shallow
  // equality check of the current against the previous props passed.
  // If we create a new object inside the render() method, this check
  // will always be false and thereby cause all components to be rendered
  // every time.
  state = {on: false, toggle: this.toggle}

  render() {
    return (
      <ToggleContext.Provider value={this.state}>
        {this.props.children}
      </ToggleContext.Provider>
    )
  }
}

// Don't make changes to the Usage component. It's here to show you how your
// component is intended to be used and is used in the tests.
// You can make all the tests pass by updating the Toggle component.
function Usage({
  onToggle = (...args) => console.log('onToggle', ...args),
}) {
  return (
    <Toggle onToggle={onToggle}>
      <Toggle.On>The button is on</Toggle.On>
      <Toggle.Off>The button is off</Toggle.Off>
      <div>
        <Toggle.Button />
      </div>
    </Toggle>
  )
}
Usage.title = 'Flexible Compound Components'

export {Toggle, Usage as default}
