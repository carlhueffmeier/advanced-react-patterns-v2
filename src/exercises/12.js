// The provider pattern
import React, {Fragment} from 'react'
import hoistNonReactStatics from 'hoist-non-react-statics'
import {Switch} from '../switch'

const ToggleContext = React.createContext()

class Toggle extends React.Component {
  static Consumer = ToggleContext.Consumer
  toggle = () =>
    this.setState(
      ({on}) => ({on: !on}),
      () => this.props.onToggle(this.state.on),
    )
  state = {on: false, toggle: this.toggle}
  render() {
    return (
      <ToggleContext.Provider value={this.state} {...this.props} />
    )
  }
}

function withToggle(Component) {
  // Set useful display name for easier debugging
  const name = Component.displayName || Component.name
  Wrapper.displayName = `withToggle(${name})`
  // Hoist statics and forward references
  return hoistNonReactStatics(React.forwardRef(Wrapper), Component)

  function Wrapper(props, ref) {
    return (
      <Toggle.Consumer>
        {context => (
          <Component {...props} toggle={context} ref={ref} />
        )}
      </Toggle.Consumer>
    )
  }
}

// Don't make changes to the Usage component. It's here to show you how your
// component is intended to be used and is used in the tests.
// You can make all the tests pass by updating the Toggle component.
const Layer1 = () => <Layer2 />
const Layer2 = withToggle(({toggle: {on}}) => (
  <Fragment>
    {on ? 'The button is on' : 'The button is off'}
    <Layer3 />
  </Fragment>
))
const Layer3 = () => <Layer4 />
const Layer4 = withToggle(({toggle: {on, toggle}}) => (
  <Switch on={on} onClick={toggle} />
))

function Usage({
  onToggle = (...args) => console.log('onToggle', ...args),
}) {
  return (
    <Toggle onToggle={onToggle}>
      <Layer1 />
    </Toggle>
  )
}
Usage.title = 'Higher Order Components'

export {Toggle, withToggle, Usage as default}
