import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import GraficosPage from "./pages/GraficosPage";
import ParcelasEliminadasPage from "./pages/ParcelasEliminadasPage";
import "./App.css";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />}>
          <Route path="Graficos" element={<GraficosPage />} />
          <Route path="Parcelas-eliminadas" element={<ParcelasEliminadasPage parcelas={[]} loading={false} />} />
        </Route>
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;


