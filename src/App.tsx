import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { WebSocketProvider } from "@/providers/WebSocketProvider";
import { Admin, Home } from "./pages";

const App = () => {
  return (
    <WebSocketProvider>
      <Router>
        <div className="p-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </div>
      </Router>
    </WebSocketProvider>
  );
};

export default App;
