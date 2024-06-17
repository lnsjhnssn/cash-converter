import React from "react";
import Chart from "chart.js";

class HistoricalRatesChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
    this.chartRef = React.createRef();
  }

  componentDidMount() {
    const { baseAcronym, quoteAcronym } = this.props;
    this.getHistoricalRates(baseAcronym, quoteAcronym);
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.baseAcronym !== this.props.baseAcronym ||
      prevProps.quoteAcronym !== this.props.quoteAcronym
    ) {
      this.getHistoricalRates(this.props.baseAcronym, this.props.quoteAcronym);
    }
  }

  getHistoricalRates = (base, quote) => {
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
  };

  buildChart = (labels, data, label) => {
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
  };

  render() {
    const { loading } = this.state;

    return (
      <div className="historical-rates-chart">
        {loading ? <p>Loading...</p> : <canvas ref={this.chartRef} />}
      </div>
    );
  }
}

export default HistoricalRatesChart;
