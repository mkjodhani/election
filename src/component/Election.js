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
import ShowResults from "./ShowResults";
import Layout from "./Layout";
import ElectionRequests from "./ElectionRequests";
import Loading from "./Loading";

class Election extends Component {
  constructor(props) {
    super(props);
    const voterObj = {voterId: "0", name: "", voterAddress: "0x0", authenticated: false, voted: false}
    this.state = {
      loading: false,
      errorFlag: false,
      value: -1,
      ready: false,
      error: "Default Error!",
      address: "",
      admin: "",
      candidateCount: "",
      description: "",
      name: "",
      candidates: "",
      candidatesList: [],
      isAdmin: false,
      isResults: false,
      currentAccount: "",
      total_requests: 0,
      requests: [],
      voterObj
    };
  }

  async componentDidMount() {
    const accounts = await web3.eth.getAccounts();
    const address = this.props.match.params.address;
    const electionContract = ElectionFetch(address);
    const admin = await electionContract.methods.admin().call();
    const candidateCount = await electionContract.methods
      .candidateCount()
      .call();
    const description = await electionContract.methods.description().call();
    const name = await electionContract.methods.name().call();
    const total_requests = await electionContract.methods.requestCount().call();
    const isAdmin = admin === accounts[0];
    let candidates = [],candidatesList = [],requests = [];
    for (var index = 1; index <= candidateCount; index++) {
      const cand = await electionContract.methods.candidates(index).call();
      const { name, voteCount, id } = cand;
      candidates.push({ name, voteCount, id });
    }
    if(isAdmin)
    {
      for (var index = 1; index <= total_requests; index++) {
        const request = await electionContract.methods.getRequests(index).call({
          from:accounts[0]
        });
        console.log({ "address":request["0"],"accepted":request["1"],"name":request["2"] });
        requests.push({ "voterId":index,"address":request["0"],"accepted":request["1"],"name":request["2"] });
      }
      requests = requests.filter(req => !req.accepted);
    }
    else{
      const voter = await electionContract.methods.voters(accounts[0]).call();
      console.log(voter);
      this.setState({voterObj:voter});
    }
    console.log(accounts[0]); 
    console.log(admin);
    console.log (admin == accounts[0]);
    this.setState({
      address,
      admin,
      candidateCount,
      description,
      name,
      isAdmin,
      candidates,
      candidatesList,
      total_requests,
      requests
    });
    this.setState({
      ready:true,
      currentAccount:accounts[0],
    });
  }
  render() {
    window.ethereum.on("update", async () => {});
    const makeCandidateList = () => {
      let list = [];
      for (var i in this.state.candidates) {
        const { id, name } = this.state.candidates[i];
        list.push({ id: id, value: id, text: name });
      }
      return list;
    };
    const vote = async () => {
      try {
        if (this.state.value !== -1) {
          const accounts = await web3.eth.getAccounts();
          const address = this.state.address;
          const election = ElectionFetch(address);
          await election.methods.vote(parseInt(this.state.value)).send({
            from: accounts[0],
          });
        } else {
          this.setState({ errorFlag: true, error: "Select The Candidate!" });
        }
      } catch (error) {
        this.setState({ errorFlag: true, error: error.message });
      }
    };
    const seeResults = async (event) => {
      if (event.target.textContent === "Results") {
        const accounts = await web3.eth.getAccounts();
        if (accounts[0] === this.state.admin) {
          event.target.textContent = "Hide Results";
          event.target.style.backgroundColor = "red";
          this.setState({ isResults: true });
        } else alert("You are not authoeized to see results");
      } else {
        this.setState({ isResults: false });
        event.target.textContent = "Results";
        event.target.style.backgroundColor = "#21ba45";
      }
    };
    return (
      <Layout>
        {!this.state.ready && <Loading />}
        {this.state.ready && (
          <>
            <Container textAlign="left">
            {this.state.isAdmin && <>
              <Button
                color="green"
                floated="right"
                onClick={(event) =>seeResults(event)}
                content="Results"
              ></Button>
            </>}
            {!this.state.isAdmin && this.state.voterObj.voterId == "0" &&<>
              <Container>
                <Link to={`/election/${this.state.address}/register`}>
                  <Button
                      color="green"
                      floated="right"
                      icon="add"
                      content="Register"
                    />
                </Link>
              </Container>
            </>
            }
            {!this.state.isAdmin && this.state.voterObj.voterId != "0" &&<>
              <Container>
                  <Button
                      color="green"
                      floated="right"
                      icon="user"
                      content={` ${this.state.voterObj.name}`}
                    />
              </Container>
            </>
            }
            <Container textAlign="left">
              <Link to="/">
                <Button primary  style={{ marginRight: "50px" }} floated="left" content="Back" />
              </Link>
            </Container>
              <h1 style={{textAlign:'center'}}>Election Name: {`${this.state.name}`}</h1>
            </Container>
            <Divider />
            {/* description */}
            <Container textAlign="left">
              <h1 style={{textAlign:'left'}}>Description:</h1>
            </Container>
            <br />
            <Container textAlign="justified" style={{ paddingLeft: "30px" }}>
              <h3>{this.state.description}</h3>
            </Container>
            <Container textAlign="left">
              <h1 style={{textAlign:'left'}}>Manager Address:</h1>
            </Container>
            <br />
            <Container textAlign="justified" style={{ paddingLeft: "30px" }}>
              <h3>{this.state.admin}</h3>
            </Container>
            {this.state.isResults && <ShowResults candidates={this.state.candidates} />}
            <br />
            {/* Candidate List */}
            <Container textAlign="center">
              <h1 style={{textAlign:'left'}}>Candidates</h1>
            </Container>
            <Container textAlign="center">
            {this.state.isAdmin && <>
              <Link to={`/election/${this.state.address}/newCandidate`}>
                <Button
                  content="Add Candidate"
                  primary
                  icon="add circle"
                  floated="right"
                />
              </Link></>}
              <Candidates candidates={this.state.candidates} />
            </Container>
            
            {!this.state.isAdmin && this.state.voterObj.authenticated && !this.state.voterObj.voted  &&<>
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
            </>}
            {this.state.isAdmin && this.state.requests.length != 0&& <>
              <Container textAlign="center" style={{ paddingTop: "20px" }}>
                  <ElectionRequests requests={this.state.requests} address={this.state.address}></ElectionRequests>
              </Container>
              </>
            }
            <Container textAlign="center" style={{ padding: "50px" }}>
              <p>Account Address:  <b>{this.state.currentAccount}</b> </p>
            </Container>
          </>
        )}
      </Layout>
    );
  }
}
export default withRouter(Election);
