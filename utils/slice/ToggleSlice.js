import { createSlice } from "@reduxjs/toolkit";

const foodMenuSlice = createSlice({
    name: "foodMenu", 
    initialState: {
        isMenuVisible: false,
        isCheckoutVisible: false,
    },
    reducers: {
        toggleMenuVisibility: (state) => { 
            state.isMenuVisible = !state.isMenuVisible;
        },
        toggleCheckoutVisibility: (state) => { 
            state.isCheckoutVisible = !state.isCheckoutVisible;
        },
    },
});

export const { toggleMenuVisibility, toggleCheckoutVisibility } = foodMenuSlice.actions;
export default foodMenuSlice.reducer;
