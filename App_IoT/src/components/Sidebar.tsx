import type { FC } from "react";
import "../styles/Sidebar.css";

interface SidebarProps {
  onSelect: (view: string) => void;
  currentView: string;
}

const Sidebar: FC<SidebarProps> = ({ onSelect, currentView }) => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1>APLICACIÓN DE IOT</h1>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li className={currentView === "dashboard" ? "active" : ""}>
            <button onClick={() => onSelect("dashboard")}>Dashboard</button>
          </li>
          <li className={currentView === "parcelas-eliminadas" ? "active" : ""}>
            <button onClick={() => onSelect("parcelas-eliminadas")}>Parcelas Eliminadas</button>
          </li>
        </ul>
      </nav>
      <div className="sidebar-footer">
        <button className="logout-button">Salir</button>
      </div>
    </div>
  );
};

export default Sidebar;
