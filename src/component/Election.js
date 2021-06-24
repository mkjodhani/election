import { Component } from "react";
import {
  Container,
  Divider,
  Button,
  Form,
  Message,
  Dropdown,
  Grid,
  Card,Image,Icon
} from "semantic-ui-react";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";
import ElectionFetch from "../assets/eth/Election";
import Candidates from "../component/Candidates";
import web3 from "../assets/eth/web3";
import ShowResults from "./ShowResults";
import Layout from "./Layout";
import ElectionRequests from "./ElectionRequests";
import Loading from "./Loading";
import QRCode from 'qrcode.react'
class Election extends Component {
  constructor(props) {
    super(props);
    const voterObj = {
      voterId: "0",
      name: "",
      voterAddress: "0x0",
      authenticated: false,
      voted: false,
    };
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
      currentAccount: "Not Found",
      total_requests: 0,
      requests: [],
      voterObj,
      electionContract: undefined,
      active:false
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
    const active = await electionContract.methods.active().call();
    const description = await electionContract.methods.description().call();
    const name = await electionContract.methods.name().call();
    const total_requests = await electionContract.methods.requestCount().call();
    const isAdmin = admin === accounts[0];
    let candidates = [],
      candidatesList = [],
      requests = [];
    for (var index = 1; index <= candidateCount; index++) {
      const cand = await electionContract.methods.candidates(index).call();
      const { name, voteCount, id } = cand;
      candidates.push({ name, voteCount, id });
    }
    if (isAdmin) {
      for (index = 1; index <= total_requests; index++) {
        const request = await electionContract.methods.getRequests(index).call({
          from: accounts[0],
        });
        requests.push({
          voterId: index,
          address: request["0"],
          accepted: request["1"],
          name: request["2"],
        });
      }
      requests = requests.filter((req) => !req.accepted);
    } else {
      if (typeof accounts[0] !== "undefined") {
        const voter = await electionContract.methods.voters(accounts[0]).call();
        console.log(voter);
        this.setState({ voterObj: voter });
      }
    }
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
      requests,
      electionContract,
      active
    });
    this.setState({
      ready: true,
      currentAccount: accounts[0],
    });
  }
  makeCandidateList(){
    let list = [];
    for (var i in this.state.candidates) {
      const { id, name } = this.state.candidates[i];
      list.push({ id: id, value: id, text: name });
    }
    return list;
  };
  vote = async () =>{
    try {
      this.setState({ errorFlag: false });
      if (this.state.value !== -1) {
        const accounts = await web3.eth.getAccounts();
        const election = this.state.electionContract;
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
  seeResults = async  (event) =>{
    this.setState({ errorFlag: false});
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
  closeElection = async (event) => {
    try {
      this.setState({ errorFlag: false});
      event.target.textContent = "Closing Election";
      const accounts = await web3.eth.getAccounts();
      const election = this.state.electionContract;
      await election.methods.closeElection().send({
        from: accounts[0],
      });
      event.target.textContent = "Election Closed";
    } catch(error)
    {
      this.setState( { errorFlag: true, error:error.message});
    }
  }
  fetchVoter(){
    const {voterId,name,voterAddress,authenticated,voted} = this.state.voterObj; 
    return {voterId,name,voterAddress,authenticated,voted};
  }
  fetchElectionInfo(){
    const {address,admin,description,name,active} = this.state;
    return {"Election Address":address,"Election Manager":admin,"Election Descripription":description,"Election Name":name,"Eelction Active":active};
  }
  makeQrCode =()=>{
    const person = this.state.isAdmin?{"admin":true,"address":this.state.admin}:this.fetchVoter();
    const election = this.fetchElectionInfo()
    const text = JSON.stringify({"User":person,"Election":election},null,4)
    return text;
  }
  downloadQR = () =>{
    const canvas = document.getElementById('qrCanvas');
    const link = document.createElement('a');
    link.href = canvas.toDataURL();
    link.download  = "QrCode.png"
    link.click()
  }
  render() {
    return (
      <Layout>
        {!this.state.ready && <Loading />}
        {this.state.ready && (
          <>
            <Container >
              {this.state.isAdmin && (
                <>
                  <Button
                    color={this.state.active? "grey":'red'}
                    floated="right"
                    onClick={(event) => {
                      this.closeElection(event);
                    }}
                    content={this.state.active? "Close Election":"Election Closed"}
                  ></Button>
                  <Button
                    color="green"
                    floated="right"
                    onClick={(event) => this.seeResults(event)}
                    content="Results"
                  ></Button>
                </>
              )}
              {!this.state.isAdmin && this.state.voterObj.voterId === "0" && (
                <>
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
              )}
              {!this.state.isAdmin && this.state.voterObj.voterId !== "0" && (
                <>
                    <Button
                      color="green"
                      floated="right"
                      icon="user"
                      content={` ${this.state.voterObj.name}`}
                    />
                </>
              )}
              <Container textAlign="left">
                <Link to="/">
                  <Button
                    primary
                    style={{ marginRight: "50px" }}
                    floated="left"
                    content="Back"
                  />
                </Link>
                <h1 style={{ textAlign: "center" }}>
                  Election : {`${this.state.name}`}
                </h1>
              </Container>
            <Divider />
            {this.state.errorFlag && (
              <Message
                style={{ marginTop: "25px" }}
                error
                header="Oops!"
                content={this.state.error}
              ></Message>
            )}
            {/* description */}
            <p>
              <span style={{ textAlign: "left",fontSize:"x-large",fontWeight:"bolder" }}>Description: </span >
              <span style={{fontWeight:"bolder",fontSize:"large"}}>&nbsp; {this.state.description}</span>
            </p>
            <p>
              <span style={{ textAlign: "left",fontSize:"x-large",fontWeight:"bolder" }}>Manager Address: </span >
              <span style={{fontWeight:"bolder",fontSize:"large"}}>&nbsp; {this.state.admin}</span>
            </p>
            {(this.state.isResults || !this.state.active) && (
              <ShowResults candidates={this.state.candidates} />
              )}
            {/* Candidate List */}
            <h1 style={{ textAlign: "left" }}>Candidates</h1>
            {this.state.isAdmin && (
              <>
                <Link to={`/election/${this.state.address}/newCandidate`}>
                  <Button
                    content="Add Candidate"
                    primary
                    icon="add circle"
                    floated="right"
                  />
                </Link>
              </>
            )}
            <Candidates candidates={this.state.candidates} />
            {(this.state.isAdmin || this.state.voterObj.voterId !== "0") && ( 
            <Container >
              <h1>Profile:</h1>
              <Grid>
                <Grid.Column width={6} style={{'padding':"20px"}}>
                <Card
                  style={{wordWrap:'break-word'}}>
                  <Image src='https://react.semantic-ui.com/images/avatar/large/daniel.jpg' wrapped ui={false} />
                  <Card.Content>
                    <Card.Header>{this.state.voterObj.name}</Card.Header>
                    <Card.Meta>{this.state.isAdmin ? "Admin":"Voter"}</Card.Meta>
                    <Card.Description>
                      {`Election :- ${this.state.description}`}
                    </Card.Description>
                  </Card.Content>
                  <Card.Content extra>
                    <a>
                      <Icon name='user' />
                      {this.state.isAdmin?"Admin can't vote.":(this.state.voterObj.voted?"Already Voted":"Haven't Voted yet.")}
                    </a>
                  </Card.Content>
                </Card>
                </Grid.Column>
                <Grid.Column width={8}>
                  <Container>
                    <QRCode
                      id="qrCanvas"
                      value={`${this.makeQrCode()}`}
                      size="350"
                      level={"H"}
                      includeMargin={true}
                      onClick={this.downloadQR}
                    />
                  </Container>
                </Grid.Column>
              </Grid>
            </Container>
            )}
            {!this.state.isAdmin &&
              this.state.voterObj.authenticated &&
              !this.state.voterObj.voted &&
              this.state.active && (
                <>
                  <br />
                    <Form onSubmit={this.vote}>
                      <Form.Field required>
                        <h3>Select Candidate</h3>
                        <Dropdown
                          placeholder="Select Candidate"
                          fluid
                          selection
                          options={this.makeCandidateList()}
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
                </>
              )}
            {this.state.isAdmin && this.state.requests.length !== 0 && (
              <>
                <Container textAlign="center" style={{ paddingTop: "20px" }}>
                  <ElectionRequests
                    requests={this.state.requests}
                    address={this.state.address}
                    ></ElectionRequests>
                </Container>
              </>
            )}
            <p style={{  textAlign:"center",paddingTop:'20px'}}>Account Address : &nbsp;<b>{this.state.currentAccount || "Not Found!"}</b></p>
            </Container>
          </>
        )}
      </Layout>
    );
  }
}
export default withRouter(Election);
