import axios from 'axios';
// import { setAlert } from './alert';

import { GET_PROFILE, PROFILE_ERROR } from './types';


// Get Current User's profile
export const getCurrentProfile = () => async dispatch => {

    try {
        
        const res = await axios.get('http://localhost:3001/api/profile/me');
        console.log(res);
        dispatch({ type: GET_PROFILE, payload: res.data });

    } catch (error) {

        const { statusText , status} = error.response;
        dispatch({type: PROFILE_ERROR, payload: {msg: statusText, status} })
 
    }

}
