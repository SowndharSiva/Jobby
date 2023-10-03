import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'
import './index.css'

const websiteLogoInForm =
  'https://assets.ccbp.in/frontend/react-js/logo-img.png'

class LoginForm extends Component {
  state = {
    username: '',
    password: '',
    errorMsg: '',
    showSubmitError: false,
  }

  onGetUsername = event => this.setState({username: event.target.value})

  onGetPassword = event => this.setState({password: event.target.value})

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30, path: '/'})
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({showSubmitError: true, errorMsg})
  }

  onSubmitLoginForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    console.log(response)
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  render() {
    const {username, password, errorMsg, showSubmitError} = this.state
    const webToken = Cookies.get('jwt_token')
    if (webToken !== undefined) {
      return <Redirect path="/" />
    }
    console.log(errorMsg)
    return (
      <div className="login-container">
        <form
          className="login-form-container"
          onSubmit={this.onSubmitLoginForm}
        >
          <div className="form-logo-container">
            <img src={websiteLogoInForm} alt="website logo" />
          </div>
          <label htmlFor="username" className="form-label">
            USERNAME
          </label>
          <br />
          <input
            type="text"
            className="form-input"
            value={username}
            id="username"
            placeholder="Username"
            onChange={this.onGetUsername}
          />
          <br />
          <br />
          <label className="form-label" htmlFor="password">
            PASSWORD
          </label>
          <br />
          <input
            type="password"
            value={password}
            className="form-input"
            id="password"
            placeholder="password"
            onChange={this.onGetPassword}
          />
          <br />
          <br />
          <button className="form-submit-button" type="submit">
            Login
          </button>
          {showSubmitError && <p className="error-message">*{errorMsg}</p>}
        </form>
      </div>
    )
  }
}

export default LoginForm
