import { HashRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import NavBar from "./NavBar";
import Footer from "./Footer";
import CurrencyConverter from "./CurrencyConverter";
import RatesExchange from "./RatesExchange";

import "./App.css";

function App() {
  return (
    <Router>
      <div className="App app-container">
        <header>
          <NavBar />
        </header>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<CurrencyConverter />} />
            <Route path="/ratesexchange" element={<RatesExchange />} />
            <Route path="*" element={<CurrencyConverter />} />
          </Routes>
        </main>
        <footer>
          <Footer />
        </footer>
      </div>
    </Router>
  );
}

export default App;
