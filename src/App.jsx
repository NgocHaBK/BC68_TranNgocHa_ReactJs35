import { useState } from "react";
import "./App.css";
import BookingMovie from "./component/BookingMovie/BookingMovie";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <BookingMovie />
    </>
  );
}

export default App;
