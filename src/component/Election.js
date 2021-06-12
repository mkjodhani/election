import { Component } from "react";
import {
  Container,
  Divider,
  Button,
  Form,
  Message,
  Dropdown,
} from "semantic-ui-react";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";
import ElectionFetch from "../assets/eth/Election";
// import ElectionChart from '../component/ElectionChart'
import Candidates from "../component/Candidates";
import web3 from "../assets/eth/web3";

class Election extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      errorFlag: false,
      value:-1,
      ready: false,
      error: "Default Error!",
      address: "",
      admin: "",
      candidateCount: "",
      description: "",
      name: "",
      candidates: "",
      candidatesList: [],
    };
  }
 
  async componentDidMount() {
    const address = this.props.match.params.address;
    const electionContract = ElectionFetch(address);
    const admin = await electionContract.methods.admin().call();
    const candidateCount = await electionContract.methods
      .candidateCount()
      .call();
    const description = await electionContract.methods.description().call();
    const name = await electionContract.methods.name().call();
    let candidates = [],
      candidatesList = [];
    for (var index = 1; index <= candidateCount; index++) {
      const cand = await electionContract.methods.candidates(index).call();
      const { name, voteCount, id } = cand;
      candidates.push({ name, voteCount, id });
    }
    this.setState({
      address,
      admin,
      candidateCount,
      description,
      name,
      candidates,
      candidatesList,
    });
    this.setState({ ready: true });
  }
  render() {
    const makeCandidateList = ()=> 
    {
      let list = [];
      for (var i in this.state.candidates) {
        const { id, name } = this.state.candidates[i];
        list.push({ id: id, value: id, text: name });
      }
      return list;
    }
    const vote = async () => {
      alert(this.state.value);
      try {
        if(this.state.value !== -1)
        {const accounts = await web3.eth.getAccounts();
        const address = this.state.address;
        const election = ElectionFetch(address);
        await election.methods.vote(parseInt(this.state.value)).send({
          from: accounts[0],
        });}
        else
        {
          this.setState({ errorFlag: true, error: "Select The Candidate!" });
        }
      } catch (error) {
        this.setState({ errorFlag: true, error: error.message });
      }
    };
    return (
      <>
        {this.state.ready && (
          <>
            {/* Header */}
            <Divider />
            <Container textAlign="center">
              <h1>Election : {`${this.state.name}`}</h1>
            </Container>
            <Divider />
            <br />
            {/* Back Button */}
            <Container textAlign="left" style={{ marginBottom: "25px" }}>
              <Link to="/">
                <Button primary floated="left" content="Back" />
              </Link>
            </Container>
            <br />
            {/* description */}
            <Container textAlign="left">
              <h2>Description:</h2>
            </Container>
            <br />
            <Container textAlign="justified" style={{ paddingLeft: "30px" }}>
              <h3>{this.state.description}</h3>
            </Container>
            <br />
            <Container textAlign="center">
              <h2>Candidates</h2>
            </Container>
            {/* Candidate List */}
            <Container
              textAlign="center"
              children={
                <>
                  <Link to={`/election/${this.state.address}/newCandidate`}>
                    <Button
                      content="Add Candidate"
                      primary
                      icon="add circle"
                      floated="right"
                      />
                  </Link>
                  <Candidates 
                  candidates={this.state.candidates} />
                </>
              }
            ></Container>
            <br />
            {/* <Container textAlign="center" children={<ElectionChart/>}></Container> */}
            <br />
            <Container style={{ margin: "auto" }}>
              <Form onSubmit={vote}>
                <Form.Field required>
                  <h3>Select Candidate</h3>
                  <Dropdown
                    placeholder="Select Candidate"
                    fluid
                    selection
                    options={makeCandidateList()}
                    onChange={(event, data) =>
                      this.setState({ value: data.value })
                    }
                  />
                </Form.Field>
                <Button
                  primary
                  loading={this.state.loading}
                  floated="right"
                  icon="add"
                  content="Vote"
                />
              </Form>
              <br />
              {this.state.errorFlag && (
                <Message
                  style={{ marginTop: "25px" }}
                  error
                  header="Oops!"
                  content={this.state.error}
                ></Message>
              )}
            </Container>
            <Container textAlign="center" style={{ padding: "50px" }}>
              <p>Account Address: ___________</p>
            </Container>
          </>
        )}
      </>
    );
  }
}
export default withRouter(Election);
