import { createSlice } from "@reduxjs/toolkit";

const foodMenuSlice = createSlice({
    name: "foodMenu", 
    initialState: {
        isMenuVisible: false, 
    },
    reducers: {
        toggleMenuVisibility: (state) => { 
            state.isMenuVisible = !state.isMenuVisible;
        },
    },
});

export const { toggleMenuVisibility } = foodMenuSlice.actions;
export default foodMenuSlice.reducer;
