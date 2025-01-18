import { configureStore } from "@reduxjs/toolkit";
import foodMenuReducer from "./slice/ToggleSlice";
import foodCartReducer from "./slice/foodCartSlice";

const store = configureStore({
    reducer: {
        foodMenu: foodMenuReducer, 
        foodCart: foodCartReducer,
    },
});

export default store;
