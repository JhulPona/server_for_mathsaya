import "./App.css";
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import StudentAuth from "./pages/StudentAuth";
import TeacherAuth from "./pages/TeacherAuth";
import TeacherPortal from "./pages/TeacherPortal";
import PhaserGame from "./pages/PhaserGame";
import VideoPlayer from "./VideoPlayer";

function App() {
  const [isPhaserGameActive, setIsPhaserGameActive] = useState(false);

  return (
    <BrowserRouter>
      {window.location.pathname !== "/mathsaya-game" && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/teacherauth" element={<TeacherAuth />} />
        <Route path="/studentauth" element={<StudentAuth />} />
        <Route path="/teacherportal" element={<TeacherPortal />} />
        <Route
          path="/mathsaya-game"
          element={<PhaserGame setIsPhaserGameActive={setIsPhaserGameActive} />}
        />
        <Route element={<NotFound />} />
        <Route path="/test" element={<VideoPlayer />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
