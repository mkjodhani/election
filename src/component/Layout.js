import React ,{Component} from 'react'
import { Container } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css'
class Layout extends Component
{
    render(){
    return(
        <Container style={{padding:"20px",paddingTop:"50px"}}>
            {this.props.children}
        </Container>
    )
    }
}
export default Layout;
