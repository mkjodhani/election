import React, { Component } from "react";
import { Container, Grid } from "semantic-ui-react";
import { Bar, Pie, Line } from "react-chartjs-2";
class ShowResults extends Component {
  constructor(props) {
    super(props);
    const label = props.candidates.map((cand) => cand.name);
    const counts = props.candidates.map(
      (cand, index) => parseInt(cand.voteCount) + index * 2 + 2
    );
    this.state = {
      chartData: {
        labels: label,
        datasets: [
          {
            label: "Votes",
            data:counts,
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
      <Container textAlign="center" style={{ width: "50%" }}>
        {this.state.chartData.labels.length <= 5 && (
          <>
            <Bar
              data={this.state.chartData}
              options={{
                title: {
                  display: true,
                  text: "Votes",
                  fontSize: 50,
                },
                legend: {
                  display: true,
                  position: "right",
                },
                backgroundColor: colors,
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
