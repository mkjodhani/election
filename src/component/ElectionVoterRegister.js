import { Component } from "react";
import { withRouter} from "react-router-dom";
import {
  Form,
  Input,
  Button,
  Header,
  Container,
  Message,
  Label,
  Radio,
} from "semantic-ui-react";
import Layout from "./Layout";
import ElectionFetch from "../assets/eth/Election";
import web3 from "../assets/eth/web3";

class ElectionVoterRegister extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: this.props.match.params.address,
      loading: false,
      errorFlag: false,
      value: "",
      error: "Default Error!",
      gender: -1,
    };
  }
  render() {
    const registerVoter = async () => {
      try {
        this.setState({ loading: true, errorFlag: false });
        if (this.state.value === "" || this.state.gender === -1) {
          this.setState({
            loading: false,
            errorFlag: true,
            error: ` ${
              this.state.value === ""
                ? "Enter The Voter Name"
                : " You haven't sepcify Gender"
            }`,
          });
        } else {
          const address = this.state.address;
          const election = ElectionFetch(address);
          await election.methods.registerVoter(this.state.value).send({
            from:window.ethereum.selectedAddress
          });
        }
        this.setState({ loading: false });
      } catch (error) {
        this.setState({
          loading: false,
          errorFlag: true,
          error: error.message,
        });
      }
    };
    return (
      <>
        <Layout >
          <Container style={{ width: "50vw",paddingTop:"5%" }}>
            <Header textAlign="center" size="huge" style={{marginBottom:'50px'}}>
              <Button secondary icon="user" content="New Voter" />
            </Header>
            <Form onSubmit={registerVoter}>
              <Form.Field required>
                <Input
                  label="Voter Name:"
                  value={this.state.value}
                  onChange={(event) => {
                    this.setState({ value: event.target.value });
                  }}
                />
              </Form.Field>
              <Form.Field>
                <Label style={{ marginRight: "45px" ,fontSize:'14.5px'}} content="Gender" />
                <Radio
                  style={{ margin: "10px" }}
                  label="Male"
                  name="gender"
                  value={0}
                  checked={this.state.gender === 0}
                  onClick={(event, data) => {
                    this.setState({ gender: data.value });
                  }}
                />
                <Radio
                  style={{ margin: "10px" }}
                  label="Female"
                  value={1}
                  name="gender"
                  checked={this.state.gender === 1}
                  onClick={(event, data) => {
                    this.setState({ gender: data.value });
                  }}
                />
                <Radio
                  style={{ margin: "10px" }}
                  label="Other"
                  name="gender"
                  checked={this.state.gender === 2}
                  value={2}
                  onClick={(event, data) => {
                    this.setState({ gender: data.value });
                  }}
                />
              </Form.Field>
              <Button
                content="Register"
                loading={this.state.loading}
                color='green'
                floated="right"
                icon="add circle"
              />
            </Form>
            <br />
            <br />
            {this.state.errorFlag && (
              <Message error content={this.state.error} header="Oops!" />
            )}
          </Container>
        </Layout>
      </>
    );
  }
}

export default withRouter(ElectionVoterRegister);