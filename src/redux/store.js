import { configureStore } from "@reduxjs/toolkit";
import MovieReducer from "./MovieReducer";

const store = configureStore({
  reducer: {
    booking: MovieReducer,
  },
});

export default store;
