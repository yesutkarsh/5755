import { configureStore } from "@reduxjs/toolkit";
import foodMenuReducer from "./slice/ToggleSlice";
import foodCartReducer from "./slice/foodCartSlice";
import userReducer from "./slice/userSlice";

const store = configureStore({
    reducer: {
        foodMenu: foodMenuReducer, 
        foodCart: foodCartReducer,
        user: userReducer,
    },
});

export default store;
