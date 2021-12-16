import { USER_LOGIN, USER_LOGOUT } from "./actions";

const authReducer = (state: any, action: { type: any; payload: { token: any, user: any; id: number; email: any }; }) => {
    switch(action.type) {
        case USER_LOGIN:
            console.log(action.payload.email);
            console.log(action.payload.user);
            return {
                ...state,
                token: action.payload.token,
                user: action.payload.user,
                id: action.payload.id
            }
        case USER_LOGOUT:
            return {
                ...state,
                token: "",
                user: "",
                id: ""
            }
        default:
            return state    
    }  

}

export { authReducer }