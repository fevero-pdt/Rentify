import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    message: '',
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser(state, action) {
            state.user = action.payload;
        },
        setMessage(state, action) {
            state.message = action.payload;
        },
        clearUser(state) {
            state.user = null;
            state.message = '';
        },
    },
});

// Export actions to be used in components
export const { setUser, setMessage, clearUser } = userSlice.actions;

// Export the reducer to be used in the store
export default userSlice.reducer;
