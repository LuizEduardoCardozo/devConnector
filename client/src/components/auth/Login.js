import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {login} from '../../actions/auth';

// import { Container } from './styles';

function Login({ login, isAuthenticated }) {

  const [loginForm, setLoginForm] = useState({
      email: '',
      password: '',
  });

  const onChange = (e) => setLoginForm({...loginForm, [e.target.name]: e.target.value});
  const onSubmit = (e) => {
      e.preventDefault();
      console.log(loginForm);
      login(email, password);

  }

  const {email,password,} = loginForm;

  // Redirect if logged in

  if(isAuthenticated) {
    return <Redirect to='/dashboard' />
  }

  return (

    <section class="container">
      <div class="alert alert-danger">
        Invalid credentials
      </div>
      <h1 class="large text-primary">Sign In</h1>
      <p class="lead"><i class="fas fa-user"></i> Sign into Your Account</p>
      <form class="form" action="dashboard.html" onSubmit={(e) => onSubmit(e)}>
        <div class="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            required
            value={email}
            onChange={(e) => onChange(e)}
          />
        </div>
        <div class="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={(e) => onChange(e)}
          />
        </div>
        <input type="submit" class="btn btn-primary" value="Login" />
      </form>
      <p class="my-1">
        Don't have an account? <Link to="register">Sign Up</Link>
      </p>
    </section>

  );
}

login.PropTypes = {

  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,

};

const mapStateToProp = state => ({

  isAuthenticated: state.auth.isAuthenticated,

});

export default connect( mapStateToProp, { login } )(Login);