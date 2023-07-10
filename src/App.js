import { Route, Routes } from "react-router-dom";
import Mockman from "mockman-js";

import './App.css';
import { Home } from "./pages/Home/Home";
import { Landing } from "./pages/Landing/Landing";
import { SignUp } from "./pages/SignUp/SignUp";
import { Explore } from "./pages/Explore/Explore";
import { BookMarks } from "./pages/Bookmarks/Bookmarks";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/mockman' element={<Mockman />} />
        <Route path='/' element={<Landing />} />
        <Route path='/explore' element={<Explore />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/bookmarks' element={<BookMarks />} />
        <Route path='/home' element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
