import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  id: null,
  email: null,
  family_name: null,
  given_name: null,
  picture: null,
  username: null,
  phone_number: null,
  latitude: null, // Initialize with null or default value
  longitude: null, // Initialize with null or default value
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      return { ...state, ...action.payload };
    },
    setLocation: (state, action) => {
      state.latitude = action.payload.latitude;
      state.longitude = action.payload.longitude;
    },
  },
});

export const { setUser, setLocation } = userSlice.actions;
export default userSlice.reducer;
