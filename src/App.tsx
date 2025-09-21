import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import KingsCupLanding from "./pages/KingsCupLanding";
import KingsCupPlay from "./pages/KingsCupPlay";
import KingsCupRules from "./pages/KingsCupRules";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/kingscup" element={<KingsCupLanding />} />
        <Route path="/kingscup/play" element={<KingsCupPlay />} />
        <Route path="/kingscup/rules" element={<KingsCupRules />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
