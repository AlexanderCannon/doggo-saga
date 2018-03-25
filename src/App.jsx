import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { API_CALL_REQUEST } from './constants/actions'

import logo from './logo.svg'
import './App.css'

class App extends PureComponent {
  componentWillMount() {
    this.props.onRequestDog()
  }
  render() {
    const {
      fetching,
      dog,
      onRequestDog,
      error,
    } = this.props
    return (
      <div className="App">
        <header className="App-header">
          <img src={dog || logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to Doggo Saga!</h1>
        </header>
        {dog
          ? (<p className="App-intro">Click for more doggos!</p>)
          : (<p className="App-intro">Click for your first doggo!</p>)
        }
        {
          fetching
            ? (<button disabled>Coming...</button>)
            : (<button onClick={onRequestDog}>Here boy!</button>)
        }
        {error && <p>No Doggo found!</p>}
      </div>
    )
  }
}

App.propTypes = {
  fetching: PropTypes.bool,
  dog: PropTypes.string,
  onRequestDog: PropTypes.func.isRequired,
  error: PropTypes.string,
}

App.defaultProps = {
  fetching: false,
  dog: null,
  error: null,
}

const mapStateToProps = ({ fetching, dog, error }) => ({
  fetching,
  dog,
  error,
})

const mapDispatchToProps = dispatch => ({
  onRequestDog: () => dispatch({ type: API_CALL_REQUEST }),
})


export default connect(mapStateToProps, mapDispatchToProps)(App)
