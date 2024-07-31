import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  booking: [],
};

const MovieReducer = createSlice({
  name: "booking",
  initialState,
  reducers: {
    updateBooking: function (state, actions) {
      state.booking = actions.payload;
      localStorage.setItem("booking", JSON.stringify(actions.payload));
    },
  },
});
export const ShitInformation = (state) => state.booking;
export const { updateBooking } = MovieReducer.actions;

export default MovieReducer.reducer;
