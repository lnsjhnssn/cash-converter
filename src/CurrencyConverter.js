import React, { Component } from "react";
import swapIcon from "./assets/images/swap.svg";
import "./App.css";

class CurrencyConverter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: 1,
      fromCurrency: "USD",
      toCurrency: "CHF",
      result: null,
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

    this.handleAmountChange = this.handleAmountChange.bind(this);
    this.handleFromCurrencyChange = this.handleFromCurrencyChange.bind(this);
    this.handleToCurrencyChange = this.handleToCurrencyChange.bind(this);
    this.fetchConversionRate = this.fetchConversionRate.bind(this);
    this.handleSwapCurrencies = this.handleSwapCurrencies.bind(this);
  }

  componentDidMount() {
    this.fetchConversionRate();
  }

  fetchConversionRate() {
    const { amount, fromCurrency, toCurrency } = this.state;

    // if formCurrency and toCurrency are the same, return amount as result
    if (fromCurrency === toCurrency) {
      this.setState({ result: amount });
      return;
    }

    const url = `https://api.frankfurter.app/latest?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const result = data.rates[toCurrency];
        this.setState({ result });
      })
      .catch((error) => console.error("Error:", error));
  }

  handleAmountChange(event) {
    this.setState({ amount: event.target.value }, this.fetchConversionRate);
  }

  handleFromCurrencyChange(event) {
    this.setState(
      { fromCurrency: event.target.value },
      this.fetchConversionRate
    );
  }

  handleToCurrencyChange(event) {
    this.setState({ toCurrency: event.target.value }, this.fetchConversionRate);
  }

  handleSwapCurrencies() {
    this.setState(
      (prevState) => ({
        fromCurrency: prevState.toCurrency,
        toCurrency: prevState.fromCurrency,
      }),
      this.fetchConversionRate
    );
  }

  render() {
    const { amount, fromCurrency, toCurrency, result, currencies } = this.state;

    return (
      <div className="container-currency-converter">
        <form>
          <div className="div-amount">
            <label>
              <h3 className="label-title">Amount</h3>
              <input
                type="number"
                min="1"
                value={amount}
                onChange={this.handleAmountChange}
              />
            </label>
          </div>
          <div>
            <div>
              <label>
                <h3 className="label-title">From</h3>
                <select
                  value={fromCurrency}
                  onChange={this.handleFromCurrencyChange}
                >
                  {currencies.map((currency) => (
                    <option key={currency} value={currency}>
                      {currency}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="div-swap">
              <button type="button" onClick={this.handleSwapCurrencies}>
                <img
                  src={swapIcon}
                  alt="Swap Currencies"
                  className="swap-icon"
                />
              </button>
            </div>
            <div>
              <label>
                <h3 className="label-title">To</h3>
                <select
                  value={toCurrency}
                  onChange={this.handleToCurrencyChange}
                >
                  {currencies.map((currency) => (
                    <option key={currency} value={currency}>
                      {currency}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        </form>
        <div className="div-result">
          {result && (
            <p>
              {amount} {fromCurrency} = {result} {toCurrency}
            </p>
          )}
        </div>
      </div>
    );
  }
}

export default CurrencyConverter;
