import axios from 'axios';
import { setAlert } from './alert';

import { REGISTER_SUCCESS, REGISTER_FAIL } from './types';

// Register user
export const register = ({name, email, password}) => async dispatch => {

    const config = { headers: { 'Content-type':'application/json' } }
    const body = JSON.stringify({ name, email, password })

    try {
        
        const res = await axios.post('http://localhost:3001/api/users',body,config);
        dispatch({ type: REGISTER_SUCCESS, payload: res.data });
        dispatch( setAlert("Usuário cadastrado com sucesso!", 'success', 1500));

    } catch ( err ) {

        const errs = err.response.data.err;

        if ( errs ) {
            dispatch( setAlert(errs, 'danger', 5000));
        }

        dispatch({ type: REGISTER_FAIL });

    }

}
