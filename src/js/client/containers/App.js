import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Explore from '../components/Explore'
import { resetErrorMessage } from '../actions'
import {
  ReduxRouter,
  routerStateReducer,
  reduxReactRouter,
  pushState,
} from 'redux-router';
// to support await/async
import "babel-polyfill"
import prepareFun from '../lib/prepareFun'
//prepareFun()
@connect(state => {
  return {errorMessage: state.errorMessage,resetErrorMessage,inputValue: '' }
})

export default
class App extends Component {
  static propTypes = {
     // Injected by React Redux
      errorMessage: PropTypes.string,
      resetErrorMessage: PropTypes.func.isRequired,
      inputValue: PropTypes.string.isRequired,
      // Injected by React Router
      children: PropTypes.node
  }
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.handleDismissClick = this.handleDismissClick.bind(this)
  }

  handleDismissClick(e) {
    this.props.resetErrorMessage()
    e.preventDefault()
  }

  handleChange(nextValue) {
    const { dispatch } = this.props;
    dispatch(pushState(null, `/${nextValue}`));
  }

  renderErrorMessage() {
    const { errorMessage } = this.props
    if (!errorMessage) {
      return null
    }

    return (
      <p style={{ backgroundColor: '#e99', padding: 10 }}>
        <b>{errorMessage}</b>
        {' '}
        (<a href="#"
            onClick={this.handleDismissClick}>
          Dismiss
        </a>)
      </p>
    )
  }

  render() {
    const { children, inputValue } = this.props
    return (
      <div>
        <Explore value={inputValue}
                 onChange={this.handleChange} />
        <hr />
        {this.renderErrorMessage()}
        {children}
      </div>
    )
  }
}

