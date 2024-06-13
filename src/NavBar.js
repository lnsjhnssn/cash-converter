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
            <NavLink to="/">Currency Converter</NavLink>
          </h2>
        </li>
        <li>
          <h2>
            <NavLink to="ratesexchange">Rates Exchange</NavLink>
          </h2>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;
