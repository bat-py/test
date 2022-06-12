import {
    ACTION_SET_IS_AUTH,
    ACTION_SET_USER_DATA
} from '../actions/UserAction'

const initialState = {
    user: {},
    isAuth: false,
};


const userReducer = (state = initialState, action) => {
    switch(action.type) {
        case ACTION_SET_IS_AUTH: return { ...state, isAuth: action.payload };
        case ACTION_SET_USER_DATA: return { ...state, user: action.payload };
        default: return state;
    }
}

export default userReducer