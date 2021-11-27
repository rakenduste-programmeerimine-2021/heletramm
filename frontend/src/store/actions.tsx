export const USER_LOGIN = "USER_LOGIN";
export const USER_LOGOUT = "USER_LOGOUT";

// hetkel type any ajutiselt testimiseks
export const loginUser = (data: any) => ({
    type: USER_LOGIN,
    payload: data
})

export const logoutUser = () => ({
    type: USER_LOGOUT
})