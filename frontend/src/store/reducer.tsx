import { USER_LOGIN, USER_LOGOUT } from "./actions";

const authReducer = (state: any, action: { type: any; payload: { token: String; }; }) => {
    switch(action.type) {
        case USER_LOGIN:
            return {
                ...state,
                token: action.payload.token,
                
            }
        case USER_LOGOUT:
            return {
                ...state,
                token: null,
                
            }
        default:
            return state    
    }  

}

export {authReducer}