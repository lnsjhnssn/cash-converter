import { NavLink } from "react-router-dom";
import icon from "./assets/images/CashChange.svg";

function NavBar() {
  return (
    <nav>
      <h1>
        <img src={icon} alt="Cash Change" class="w-50 h-20" />
      </h1>
      <ul>
        <li>
          <h2>
            <NavLink
              to="/"
              style={({ isActive }) => ({
                textDecoration: isActive ? "underline" : "none",
              })}
            >
              Converter
            </NavLink>
          </h2>
        </li>
        <li>
          <h2>
            <NavLink
              to="ratesexchange"
              style={({ isActive }) => ({
                textDecoration: isActive ? "underline" : "none",
              })}
            >
              Rates
            </NavLink>
          </h2>
        </li>
        <li>
          <h2>
            <NavLink
              to="historicalrateschart"
              style={({ isActive }) => ({
                textDecoration: isActive ? "underline" : "none",
              })}
            >
              Historical Rates Chart
            </NavLink>
          </h2>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;
