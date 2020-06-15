import axios from 'axios';
import { setAlert } from './alert';

import { GET_PROFILE, PROFILE_ERROR } from './types';


// Get Current User's profile
export const getCurrentProfile = () => async dispatch => {

    try {
        
        const res = await axios.get('http://localhost:3001/api/profile/me');
        dispatch({ type: GET_PROFILE, payload: res.data });

    } catch (error) {
        
        const { statusText , status} = error.response;
        dispatch({type: PROFILE_ERROR, payload: {msg: statusText, status} })
 
    }

}

// Create or update a profile
export const createProfile = (formData, hisory, edit = false) => async dispatch => {

    const config = {
        headers: {
            'Content-type': 'application/json',
        },
    };
    
    try {
        
        const res = await axios.post('http://localhost:3001/api/profile',formData, config);
        dispatch({type: GET_PROFILE, payload: res.data});
        
        dispatch( setAlert(edit ? 'Profile updated' : 'Profile created', 'success', edit ? 7000 : 3000) );

        if( !edit ) {
            hisory.push('/dashboard');
        }

    } catch ( err ) {
        const erors = err.response.data.errors;
        erors.forEach(error => dispatch( setAlert(error.msg, 'danger', 5000) ));
        
    }



}
