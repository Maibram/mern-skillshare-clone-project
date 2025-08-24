import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Skills from "./pages/Skills";
import CourseDetails from "./pages/CourseDetails";
import LessonPlayer from "./pages/LessonPlayer";
import ProtectedRoute from "./Components/ProtectedRoute";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
// --- 1. Import the new CreateCourse component ---
import CreateCourse from "./pages/CreateCourse"; // Assuming you place it in the 'pages' folder

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/course/:id" element={<CourseDetails />} />
          <Route path="/course/:id/lesson/:lessonId" element={<LessonPlayer />} />
          <Route path="/about" element={<About />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

          {/* --- 2. Add the new protected route for creating a course --- */}
          {/* This ensures only logged-in users can access the course creation page */}
          <Route 
            path="/create-course" 
            element={
              <ProtectedRoute>
                <CreateCourse />
              </ProtectedRoute>
            } 
          />

          <Route path="/protected" element={<ProtectedRoute><div>Protected Content</div></ProtectedRoute>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
