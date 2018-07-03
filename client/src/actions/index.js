import axios from 'axios';
import { AUTH_USER, AUTH_ERROR } from './types';

export const signup = (formProps, callback) => async dispatch => {
    // formProps : email, password

    if (callback) {
        try {
            const res = await axios.post('http://localhost:3090/signup', formProps).catch(e => {
                console.error("I'm in catch code.");
                // console.error(e);
                return dispatch({ type : AUTH_ERROR, payload : 'email in use' });
            });
            dispatch({ type : AUTH_USER, payload : res.data.token });
            localStorage.setItem('token', res.data.token);
            callback();
        } catch (e) {
            return dispatch({ type : AUTH_ERROR, payload : 'error occured in signup2.' });
        }
    } else {
        return new Promise(async (resolve, reject) => {
            try {
                const res = await axios.post('http://localhost:3090/signup', formProps);
                dispatch({ type : AUTH_USER, payload : res.data.token });
                localStorage.setItem('token', res.data.token);
                resolve();
            } catch (e) {
                dispatch({ type : AUTH_ERROR, payload : 'error occured in signup2.' });
                reject(e);
            }
        });
    }


    // try {
    // } catch (e) {
    //     dispatch({ type : AUTH_ERROR, payload : 'error occured in signup.' });
    // }
    // if (!res.) {
    //     dispatch({ type : AUTH_ERROR, payload : 'error occured in signup.' });
    // } else {
    //     dispatch({ type : AUTH_USER, payload : res.data.token });
    // }

    // if (res) {
    //     console.log(JSON.stringify(res, null, 2));
    //     dispatch({ type : AUTH_USER, payload : res.data.token });
    // }

    // try {
    // } catch (e) {
    //     return dispatch({ type : AUTH_ERROR, payload : 'error occured in signup2.' });
    // }
};

export const signout = () => {
    localStorage.removeItem('token');

    return {
        type : AUTH_USER,
        payload : ''
    }
};

export const signin = (formProps, callback) => async dispatch => {

    if (callback) {
        try {
            const res = await axios.post('http://localhost:3090/signin', formProps).catch(e => {
                // console.error("I'm in catch code.");
                // console.error(e);
                return dispatch({ type : AUTH_ERROR, payload : 'invalid login credentials' });
            });
            dispatch({ type : AUTH_USER, payload : res.data.token });
            localStorage.setItem('token', res.data.token);
            callback();
        } catch (e) {
            return dispatch({ type : AUTH_ERROR, payload : 'error occured in signin.' });
        }
    } else {
        return new Promise(async (resolve, reject) => {
            try {
                const res = await axios.post('http://localhost:3090/signin', formProps);
                dispatch({ type : AUTH_USER, payload : res.data.token });
                localStorage.setItem('token', res.data.token);
                resolve();
            } catch (e) {
                dispatch({ type : AUTH_ERROR, payload : 'error occured in signin.' });
                reject(e);
            }
        });
    }
};