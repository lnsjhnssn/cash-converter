import React, { Component } from "react";
import Chart from "chart.js";
import swapIcon from "./assets/images/swap.svg";
import currencies from "./utils/currencies";
import "./App.css";

class CurrencyConverter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: 1,
      fromCurrency: "USD",
      toCurrency: "CHF",
      result: null,
      loading: false,
    };
    this.chartRef = React.createRef();
    this.handleAmountChange = this.handleAmountChange.bind(this);
    this.handleFromCurrencyChange = this.handleFromCurrencyChange.bind(this);
    this.handleToCurrencyChange = this.handleToCurrencyChange.bind(this);
    this.fetchConversionRate = this.fetchConversionRate.bind(this);
    this.handleSwapCurrencies = this.handleSwapCurrencies.bind(this);
  }

  componentDidMount() {
    this.fetchConversionRate();
    this.getHistoricalRates(this.state.fromCurrency, this.state.toCurrency);
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.fromCurrency !== this.state.fromCurrency ||
      prevState.toCurrency !== this.state.toCurrency
    ) {
      this.fetchConversionRate();
      this.getHistoricalRates(this.state.fromCurrency, this.state.toCurrency);
    }
  }

  fetchConversionRate() {
    const { amount, fromCurrency, toCurrency } = this.state;

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

  getHistoricalRates(base, quote) {
    const endDate = new Date().toISOString().split("T")[0];
    const startDate = new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    this.setState({ loading: true });

    fetch(
      `https://api.frankfurter.app/${startDate}..${endDate}?from=${base}&to=${quote}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          throw new Error(data.error);
        }

        const chartLabels = Object.keys(data.rates);
        const chartData = Object.values(data.rates).map((rate) => rate[quote]);
        const chartLabel = `${base}/${quote}`;
        this.buildChart(chartLabels, chartData, chartLabel);
        this.setState({ loading: false });
      })
      .catch((error) => {
        console.error(error.message);
        this.setState({ loading: false });
      });
  }

  buildChart(labels, data, label) {
    const chartRef = this.chartRef.current.getContext("2d");

    if (typeof this.chart !== "undefined") {
      this.chart.destroy();
    }

    this.chart = new Chart(chartRef, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: label,
            data,
            fill: false,
            tension: 0,
          },
        ],
      },
      options: {
        responsive: true,
      },
    });
  }

  handleAmountChange(event) {
    this.setState({ amount: event.target.value }, this.fetchConversionRate);
  }

  handleFromCurrencyChange(event) {
    this.setState({ fromCurrency: event.target.value }, () => {
      this.fetchConversionRate();
      this.getHistoricalRates(this.state.fromCurrency, this.state.toCurrency);
    });
  }

  handleToCurrencyChange(event) {
    this.setState({ toCurrency: event.target.value }, () => {
      this.fetchConversionRate();
      this.getHistoricalRates(this.state.fromCurrency, this.state.toCurrency);
    });
  }

  handleSwapCurrencies() {
    this.setState(
      (prevState) => ({
        fromCurrency: prevState.toCurrency,
        toCurrency: prevState.fromCurrency,
      }),
      () => {
        this.fetchConversionRate();
        this.getHistoricalRates(this.state.fromCurrency, this.state.toCurrency);
      }
    );
  }

  render() {
    const { amount, fromCurrency, toCurrency, result, loading } = this.state;

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
        <div className="historical-rates-chart">
          {loading ? <p>Loading...</p> : <canvas ref={this.chartRef} />}
        </div>
      </div>
    );
  }
}

export default CurrencyConverter;
