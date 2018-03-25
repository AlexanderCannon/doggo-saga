import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'

import { connect } from 'react-redux'
import { API_CALL_REQUEST } from './constants/actions'

class App extends Component {
  render() {
    const { fetching, dog, onRequestDog, error } = this.props
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

const mapStateToProps = ({ fetching, dog, error }) => {
  return {
    fetching,
    dog,
    error,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onRequestDog: () => dispatch({ type: API_CALL_REQUEST })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
