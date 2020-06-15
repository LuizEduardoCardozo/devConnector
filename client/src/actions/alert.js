import uuid from 'uuid';

import {SET_ALERT, REMOVE_ALERT} from './types';

export const setAlert = ( msg, alertType, timeout = 1500 ) => dispatch => {
    const id = uuid.v4();
    try {
        dispatch({
            type: SET_ALERT,
            payload: {
                msg,
                alertType,
                id
            },
            
        });
    
        setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), timeout);
    } catch ( err ) {

        if ( err ) throw err.message; 
        
    }
}
