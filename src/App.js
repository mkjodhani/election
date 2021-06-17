import React, { Component } from "react";
import { Button, Container } from "semantic-ui-react";
import Elections from "./component/Elections";
import Layout from "./component/Layout";
import { Link } from "react-router-dom";
import Loading from './component/Loading'
import ElectionFactory from "./assets/eth/ElectionFactory";
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      manager: "",
      totalElections: 0,
      elections: "",
      ready: false,
    };
  }
  async componentDidMount() {
    const manager = await ElectionFactory.methods.manager().call();
    const totalElections = await ElectionFactory.methods
      .totalElections()
      .call();
    let elections = [];
    for (var i = 0; i <= totalElections; i++) {
        const election = await ElectionFactory.methods.elections(i).call();
        elections.push(election);
    }
    elections = elections.filter(
      (address) => address !== "0x0000000000000000000000000000000000000000"
    );
    this.setState({
      manager: manager,
      totalElections: totalElections,
      elections: elections,
      ready: true,
    });
  }
  render() {
    return (
      <Layout>
        {/* {<h1>{  JSON.stringify(this.state)}</h1>} */}
        {!this.state.ready && <Loading/>}
        <Container textAlign="center">
        <h1 style={{float:'left'}} >DashBoard</h1>
          <Link  to="/election/new">
            <Button floated='right'
              style={{marginBottom:'200px'}}
              primary
              content="Create Election"
              icon="add circle"
            ></Button>
          </Link>
        <br/><br/>
        <hr />
        {this.state.ready && (
          <Elections key={0}  elections={this.state.elections}></Elections>
          )}
        </Container>
      </Layout>
    );
  }
}
export default App;
