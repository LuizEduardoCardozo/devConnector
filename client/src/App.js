import React, { useEffect } from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import Navbar from './components/Layout/Navbar';
import Landing from './components/Layout/Landing';
import Alert from './components/Layout/Alert';

import Register from './components/auth/Register';
import Login from './components/auth/Login';

import Dashboard from './components/dashboard/Dashboard';

import PrivateRoute from './components/dashboard/privateRoute';

import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './actions/auth';

import { setAuthToken } from './utils/setAuthToken';

import './index.css';

if(localStorage.token) {
  setAuthToken(localStorage.token)
}

function App() {

  useEffect(() => {

    store.dispatch(loadUser());

  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Navbar />
        <Route exact path="/" component={Landing} />
        <section className="container">
          <Alert />
          <Switch >
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
            <PrivateRoute exact path="/dashboard" component={Dashboard} />
          </Switch>
        </section>
      </Router>
    </Provider>
  );
}

export default App;
