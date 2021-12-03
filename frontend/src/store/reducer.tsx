import { USER_LOGIN, USER_LOGOUT } from "./actions";

const authReducer = (state: any, action: { type: any; payload: { token: any, user: any; }; }) => {
    switch(action.type) {
        case USER_LOGIN:
            return {
                ...state,
                token: action.payload.token,
                user: action.payload.user
                
            }
        case USER_LOGOUT:
            return {
                ...state,
                token: "",
                user: ""
                
            }
        default:
            return state    
    }  

}

export { authReducer }