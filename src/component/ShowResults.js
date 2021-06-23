import React, { Component } from "react";
import { Container } from "semantic-ui-react";
import { Bar, Pie } from "react-chartjs-2";
class ShowResults extends Component {
  constructor(props) {
    super(props);
    const label = props.candidates.map((cand) => cand.name);
    const counts = props.candidates.map(
      (cand, index) => parseInt(cand.voteCount)
    );
    this.state = {
      chartData: {
        labels: label,
        datasets: [
          {
            label: "Votes",
            data: counts,
          },
        ],
      },
    };
  }
  async componentDidMount() {
    console.log(this.state.label);
  }
  render() {
    var dynamicColors = function () {
      var r = Math.floor(Math.random() * 255);
      var g = Math.floor(Math.random() * 255);
      var b = Math.floor(Math.random() * 255);

      return "rgb(" + r + "," + g + "," + b + ")";
    };
    const colors = this.state.chartData.labels.map((ele) => dynamicColors());
    return (
      <Container textAlign="center" style={{ width: "75%", color: "white" }}>
        {this.state.chartData.labels.length <= 5 && (
          <>
            <Bar
              data={this.state.chartData}
              options={{
                title: {
                  display: true,
                  text: "Votes of Election",
                  fontSize: 50,
                },
                legend: {
                  display: true,
                  position: "right",
                },
                backgroundColor: colors,
                scales: {
                  y: {
                    max: Math.max(...this.state.chartData.datasets[0].data) + 5,
                    min: 0,
                    ticks: {
                      stepSize: 1,
                    },
                  },
                },
              }}
            />
          </>
        )}
        {this.state.chartData.labels.length > 5 && (
          <>
            <Pie
              data={this.state.chartData}
              height={1}
              options={{
                legend: {
                  display: true,
                  position: "right",
                },
                backgroundColor: colors,
              }}
            />
          </>
        )}
      </Container>
    );
  }
}
export default ShowResults;
