import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import GraficosPage from "./pages/GraficosPage";
import ParcelasEliminadasPage from "./pages/ParcelasEliminadasPage";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />}>
          <Route path="graficos" element={<GraficosPage />} />
          <Route path="parcelas-eliminadas" element={<ParcelasEliminadasPage parcelas={[]} loading={false} />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;


