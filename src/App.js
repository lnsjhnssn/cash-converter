import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import NavBar from "./NavBar";
import Footer from "./Footer";
import CurrencyConverter from "./CurrencyConverter";
import RatesExchange from "./RatesExchange";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="App app-container">
        <header>
          <NavBar />
        </header>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<CurrencyConverter />} />
            <Route path="ratesexchange" element={<RatesExchange />} />
          </Routes>
        </main>
        <footer>
          <Footer />
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
