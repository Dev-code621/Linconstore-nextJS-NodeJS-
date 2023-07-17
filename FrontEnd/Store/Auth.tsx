import {createSlice} from "@reduxjs/toolkit";

interface IAuth {
    isLoggedIn: boolean,
    token: string,
    adminToken: string
}
const initialState : IAuth = {
           isLoggedIn : false,
            token : '',
            adminToken: ''
}

const auth = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginHandler(state: IAuth){
            state.isLoggedIn = true
        },
        logoutHandler(state : IAuth) {
            state.isLoggedIn = false
        },
        insertToken(state: IAuth, action){
            state.token = action.payload.token
        },
        loginAdmin(state: IAuth, action) {
            state.adminToken = action.payload.token;
        },
        deleteToken(state: IAuth){
            state.token = ''
        }
    }
})
export const {loginHandler, loginAdmin, insertToken, deleteToken,  logoutHandler} = auth.actions;

export default auth.reducer