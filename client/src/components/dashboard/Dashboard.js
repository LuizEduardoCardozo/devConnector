import React, { useEffect } from 'react';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import DashboardActions from './DashboardActions';

import Spinner from '../Layout/Spinner';

import { getCurrentProfile } from '../../actions/profiles';
import { Link } from 'react-router-dom';

// import { Container } from './styles';

const Dashboard = ({getCurrentProfile, auth, profile }) => {

  useEffect(() => {
    getCurrentProfile()
  },[]);

  let name = '';
  
  try {

      name = auth.user.name;
    
  } catch ( err ) {

    name = "Not Found!";
    
  }

  return (
    profile.loading && profile === null ? < Spinner /> : 
    <>
      <h1 className="large textPrimary">DashBoard</h1>
      <p className="lead">
        <i className="fas fa-user">Welcome {name}</i>
      </p>
      { profile.profile !== null ? 
      <>
        <DashboardActions />
      </> : 
      <>
        <p>You have not setup a profile yet :( Please, click here and add some info</p>
        <Link to="/create-profile" className="btn btn-primary my-1">Create profile</Link>
      </> }    
    </>
  );
}

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
  
  auth: state.auth,
  profile: state.profile,

})

export default connect(mapStateToProps, { getCurrentProfile })(Dashboard);
