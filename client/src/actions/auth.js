import axios from 'axios';
import { setAlert } from './alert';

import { setAuthToken } from '../utils/setAuthToken';

import { REGISTER_SUCCESS, REGISTER_FAIL, LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT, USER_LOADED, AUTH_ERROR } from './types';

// Load a user to memory :)
export const loadUser = () => async dispatch => {

    if(localStorage.token) {
        setAuthToken(localStorage.token)
    }

    try {

        const res = await axios.get('http://localhost:3001/api/auth');
        dispatch({type: USER_LOADED, payload: res.data});

    } catch ( err ) {

        if( err ) throw err.message;
        dispatch({ type: AUTH_ERROR });

    }

}


// Register user
export const register = ({name, email, password}) => async dispatch => {

    const config = { headers: { 'Content-type' : 'application/json' } }
    const body = JSON.stringify({ name, email, password })

    try {
        
        loadUser()
        const res = await axios.post('http://localhost:3001/api/users',body,config);
        dispatch({ type: REGISTER_SUCCESS, payload: res.data });
        dispatch( setAlert("Usuário cadastrado com sucesso!", 'success', 1500));
        // dispatch( loadUser() );

    } catch ( err ) {

        const errs = err.response.data.err;

        if ( errs ) {
            dispatch( setAlert(errs, 'danger', 5000));
            dispatch( { type: REGISTER_FAIL, payload: errs } );
        }

        dispatch({ type: REGISTER_FAIL });

    }

}

// Login user -> auth
export const login = (email, password) => async dispatch => {

    const config = { headers: { 'Content-type' : 'application/json' }};
    const body = JSON.stringify({ email, password });

    try {

        const res = await axios.post('http://localhost:3001/api/auth', body, config);
        loadUser()
        dispatch({ type: LOGIN_SUCCESS, payload: res.data });
        // dispatch( loadUser() );

    } catch ( err ) {
        // console.log("error", err);
        dispatch( setAlert('Invalid credentials!', 'danger') );
        dispatch( { type: LOGIN_FAIL, payload: err } );

    }

}

export const logout = () => dispatch => {

    dispatch({ type: LOGOUT });
    
}

