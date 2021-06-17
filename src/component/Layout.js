import React, { Component } from "react";
import { Container } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
class Layout extends Component {
  render() {
    return (
      <Container
        style={{
          padding: "5%",
          minWidth: "100vw",
          minHeight: "100vh",
        }}
      >
        {this.props.children}
      </Container>
    );
  }
}
export default Layout;
