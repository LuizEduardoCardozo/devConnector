import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../actions/auth';

import { Link } from 'react-router-dom';

function Navbar({ auth: { isAuthenticated, loading }, logout }) {

  const authLinks = (
    <ul>
      <li>
        <Link onClick={logout} to="/">
          <i className="fas fa-user">{' '}</i>  
          <span className="hide-sm">Dashboard</span>
        </Link>
      </li>
      <li>
        <Link onClick={logout} to="/">
          <i className="fas fa-sign-out-alt">{' '}</i>  
          <span className="hide-sm">Logout</span>
        </Link>
      </li>
    </ul>
  );

  const guestLinks = (
    <ul>
      <li><Link to="/profiles">Developers</Link></li>
      <li><Link to="/register">Register</Link></li>
      <li><Link to="/login">Login</Link></li>
    </ul>

  );
  

  return (
        <nav class="navbar bg-dark">
        <h1>
            <Link to="/"><i class="fas fa-code"></i> DevConnector</Link>
        </h1>
        { !loading && (<>{ !isAuthenticated ? guestLinks : authLinks }</>) }
    </nav>
  );
}

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth  : PropTypes.object.isRequired,
} 

const mapStateToProps = state => ({
  auth: state.auth,
})

export default connect(mapStateToProps, { logout })(Navbar);