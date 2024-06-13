import React, { Component } from "react";
import "./App.css";

class RatesExchange extends Component {
  constructor(props) {
    super(props);
    this.state = {
      baseCurrency: "USD",
      rates: {},
      currencies: [
        "USD",
        "EUR",
        "JPY",
        "GBP",
        "AUD",
        "CAD",
        "CHF",
        "SEK",
        "HKD",
        "NZD",
      ],
    };

    this.handleBaseCurrencyChange = this.handleBaseCurrencyChange.bind(this);
    this.fetchExchangeRates = this.fetchExchangeRates.bind(this);
  }

  componentDidMount() {
    this.fetchExchangeRates();
  }

  fetchExchangeRates() {
    const { baseCurrency, currencies } = this.state;
    const url = `https://api.frankfurter.app/latest?amount=1&from=${baseCurrency}&to=${currencies.join(
      ","
    )}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        this.setState({ rates: data.rates });
      })
      .catch((error) => console.error("Error:", error));
  }

  handleBaseCurrencyChange(event) {
    this.setState(
      { baseCurrency: event.target.value },
      this.fetchExchangeRates
    );
  }

  render() {
    const { baseCurrency, rates, currencies } = this.state;

    return (
      <div className="container">
        <div className="container-rates-exchange">
          <form>
            <div>
              <label>
                <h3 className="label-title">Currency</h3>

                <select
                  value={baseCurrency}
                  onChange={this.handleBaseCurrencyChange}
                >
                  {currencies.map((currency) => (
                    <option key={currency} value={currency}>
                      {currency}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </form>

          <div>
            <div className="list-header">
              <span className="label-title">{baseCurrency}</span>
              <span className="label-title">1.000</span>
            </div>
            <div>
              <ul className="list-currencies">
                {Object.keys(rates).map((currency) => (
                  <li key={currency}>
                    <span>{currency}</span>
                    <span>{rates[currency]}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default RatesExchange;
