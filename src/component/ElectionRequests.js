import React, { Component } from "react";
import { Button, Card, Image, Message } from "semantic-ui-react";
import ElectionFetch from "../assets/eth/Election";
import web3 from "../assets/eth/web3";

class ElectionRequests extends Component {
  constructor(props) {
    super(props);
    const requests = props.requests
    const address = props.address;
    this.state = {
      name: "",
      voterId: "",
      isReady: false,
      requests,
      address,
      loading: false,
      errorFlag: false,
      error: "Default Error!",
    };
  }

  async requestAccept(id) {
    try {
      this.setState({ loading: true, errorFlag: false });
      const accounts = await web3.eth.getAccounts();
      const address = this.state.address;
      const election = await ElectionFetch(address);
      await election.methods.authenticateVoter(id).send({
        from: accounts[0],
      });
      this.setState({ loading: false });
    } catch (error) {
      this.setState({
        loading: false,
        errorFlag: true,
        error: error.message,
      });
    }
  };
  async deleteRequest(id) {
    try {
      this.setState({ loading: true, errorFlag: false });
      const newRequests = this.state.requests.filter(
        (req) => req.voterId !== id
      );
      this.setState({ requests: newRequests });
      this.setState({ loading: false });
    } catch (error) {
      this.setState({
        loading: false,
        errorFlag: true,
        error: error.message,
      });
    }
  };
  render() {
    return (
      <>
        <h1 style={{ textAlign: "left" }}>Requests</h1>
        <Card.Group>
          {this.state.requests.map((request) => {
            return (
              <>
                <Card key={request.voterId}>
                  <Card.Content>
                    <Image
                      floated="right"
                      size="mini"
                      src="https://react.semantic-ui.com/images/avatar/large/elliot.jpg"
                    />
                    <Card.Header textAlign="left">{request.name}</Card.Header>
                    <Card.Meta textAlign="left">
                      Voter ID : {request.voterId}
                    </Card.Meta>
                    <Card.Description textAlign="left">
                      <strong>{request.address.substr(0, 30) + ".."}</strong>
                    </Card.Description>
                  </Card.Content>
                  <Card.Content extra>
                    <div className="ui two buttons">
                      <Button
                        basic
                        color="green"
                        onClick={() => this.requestAccept(request.voterId)}
                      >
                        Approve
                      </Button>
                      <Button
                        basic
                        color="red"
                        onClick={() => this.deleteRequest(request.voterId)}
                      >
                        Decline
                      </Button>
                    </div>
                  </Card.Content>
                </Card>
              </>
            );
          })}
        </Card.Group>
        {this.state.errorFlag && (
          <Message error content={this.state.error} header="Oops!" />
        )}
      </>
    );
  }
}
export default ElectionRequests;
