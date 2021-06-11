import {Component} from "react";
import Layout from "../component/Layout";
import { Form ,Input,Button,Message,Container} from 'semantic-ui-react';
import { Link } from 'react-router-dom'

class NewElection extends Component
{
    state = {loading:false,isError:false,error:"Default Error!"}
    createElection = ()=>
    {
        try {
            this.setState({loading:true,isError:false})
            alert("created!");
            this.setState({loading:false})
        } catch (error) {
            this.state({isError:true,error:error.message})            
        }
    }
    render()
    {
        return(
            <Layout>
                <h1 style={{textAlign:'center'}}>Election Form</h1>
                <hr/>
                <Link to='/'>
                    <Button  style={{marginBottom:'10px'}} primary content="BacK" ></Button>
                </Link>
                <Container style={{width:'50vw'}} >
                    <Form onSubmit={this.createElection}>
                        <Form.Field required>
                            <Input label= "Name"></Input>
                        </Form.Field>
                        <Form.Field required>
                            <Input label="Description"></Input>
                        </Form.Field>
                        <Button primary loading={this.state.loading} icon="add circle" content="Create" floated='right'/>
                    </Form>
                    <br/>
                    {this.state.isError && <Message style={{marginTop:'25px'}} error header="Oops!" content={this.state.error}></Message>}
                </Container>
            </Layout>
        );
    }
}

export default NewElection;