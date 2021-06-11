import { Component, useState } from "react";
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

class Election extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      errorFlag: false,
      value: "",
      ready: false,
      error: "Default Error!",
      address: "",
      admin: "",
      candidateCount: "",
      description: "",
      name: "",
      candidates: "",
      candidatesList:[],
      text:''
    };
  }
  vote() {
    //voting system...
  }
  makeCandidateList()
  {
    let list = [];
    for (var i in this.state.candidates) 
    {
        const {id,name} = this.state.candidates[i];
        list.push({"id":id,"value":id,"text":name})
    }
    console.log(list);
    return list;
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
    let candidates = [],candidatesList =[];
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
      candidatesList
    });
    this.setState({ ready: true });
  }
  render() {
    return (
      <>
        {this.state.ready && <>
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
        <Container>
          <h2>Candidates</h2>
        </Container>
        <Container textAlign="center" children={<Candidates candidates={this.state.candidates} />}></Container>
        <br />
        {/* <Container textAlign="center" children={<ElectionChart/>}></Container> */}
        <br />
        <Container style={{ margin: "auto" }}>
          <Form onSubmit={this.vote}>
                 <Form.Field>
                     <h3>Select Candidate</h3>
                     
                     {/* <Dropdown
                        
                        button
                        className='icon'
                        floating
                        labeled
                        fluid
                        icon='user'
                        value={this.state.value}
                        options={this.makeCandidateList()}
                        text= {this.state.text || 'Select Candidate'}
                        search
                        onChange={(event,data) => this.setState({value:data.value,text:data.text})}
                    /> */}
                     <Dropdown placeholder='Select Candidate'
                         fluid
                         selection
                         options={this.makeCandidateList()} onChange={(event,data) => this.setState({value:data.value,text:data.text})}/>
                 </Form.Field>
                 <Button primary loading={this.state.loading} floated='right' icon="add" content="Vote"/>
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
        </>}
      </>
    );
  }
}
export default withRouter(Election);
