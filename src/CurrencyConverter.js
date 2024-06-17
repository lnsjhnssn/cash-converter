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
      error: null,
    };
    this.chartRef = React.createRef();
    this.chart = null;
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

  componentWillUnmount() {
    if (this.chart) {
      this.chart.destroy();
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
        if (data.error) {
          throw new Error(data.error);
        }
        const result = data.rates[toCurrency];
        this.setState({ result, error: null });
      })
      .catch((error) => {
        console.error("Error fetching conversion rate:", error);
        this.setState({
          error: "Error fetching conversion rate",
          result: null,
        });
      });
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
        this.setState({ loading: false, error: null });
      })
      .catch((error) => {
        console.error("Error fetching historical rates:", error);
        this.setState({
          loading: false,
          error: "Error fetching historical rates",
        });
      });
  }

  buildChart(labels, data, label) {
    const chartRef = this.chartRef.current.getContext("2d");

    if (this.chart) {
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
            borderColor: "#083A84",
            tension: 0.1,
          },
        ],
      },
      options: {
        responsive: true,
        title: {
          display: true,
          text: "Exchange rates for the last 30 days",
        },
      },
    });
  }

  handleAmountChange(event) {
    const amount = event.target.value;
    this.setState({ amount }, () => {
      this.fetchConversionRate();
    });
  }

  handleFromCurrencyChange(event) {
    const fromCurrency = event.target.value;
    this.setState({ fromCurrency }, () => {
      this.fetchConversionRate();
      this.getHistoricalRates(this.state.fromCurrency, this.state.toCurrency);
    });
  }

  handleToCurrencyChange(event) {
    const toCurrency = event.target.value;
    this.setState({ toCurrency }, () => {
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
    const { amount, fromCurrency, toCurrency, result, loading, error } =
      this.state;

    return (
      <div className="container-currency-converter">
        <form>
          <div className="div-left">
            <label>
              <h3 className="label-title">Amount</h3>
              <input
                type="number"
                min="1"
                value={amount}
                onChange={this.handleAmountChange}
              />
            </label>
            <div className="div-result result-large-screen">
              {result && (
                <p>
                  {amount} {fromCurrency} = {result} {toCurrency}
                </p>
              )}
            </div>
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
        <div className="div-result result-mobile-screen">
          {result && (
            <p>
              {amount} {fromCurrency} = {result} {toCurrency}
            </p>
          )}
        </div>
        <div className="historical-chart-container">
          <div className="historical-chart-table">
            {loading ? <p>Loading...</p> : null}
            {error ? <p>{error}</p> : null}
            <canvas ref={this.chartRef} />
          </div>
        </div>
      </div>
    );
  }
}

export default CurrencyConverter;
