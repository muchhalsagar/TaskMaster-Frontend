import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/home"
import AddTask from "./components/addTask";
import EditTask from "./components/editTask";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/addtask" element={<AddTask />} />
        <Route path="/edittask/:id" element={<EditTask />} />
      </Routes>
    </Router>
  )
}

export default App
