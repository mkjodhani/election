import {Component} from "react";
import Layout from "../component/Layout";
import { Form ,Input,Button,Message,Container} from 'semantic-ui-react';
import { Link } from 'react-router-dom'
import ElectionFactory from "../assets/eth/ElectionFactory";

class NewElection extends Component
{
    state = {loading:false,isError:false,error:"Default Error!",nameValue:"",descValue:""}
    createElection = async ()=>
    {
        try {
            this.setState({loading:true,isError:false})
            console.log(ElectionFactory);
            await ElectionFactory.methods.addElection(this.state.nameValue,this.state.descValue)
            .send({from:window.ethereum.selectedAddress});
            this.setState({loading:false})
        } catch (error) {
            this.setState({loading:false,isError:true,error:error.message})            
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
                        <Form.Field>
                            <Input label= "Name" value={this.state.nameValue} onChange={(event) => this.setState({nameValue:event.target.value})} ></Input>
                        </Form.Field>
                        <Form.Field>
                            <Input label="Description" value={this.state.descValue} onChange={(event) => this.setState({descValue:event.target.value})}></Input>
                        </Form.Field>
                        <Button primary loading={this.state.loading}   icon="add circle" content="Create" floated='right'/>
                    </Form>
                    <br/>
                    {this.state.isError && <Message style={{marginTop:'25px'}} error header="Oops!" content={this.state.error}></Message>}
                </Container>
            </Layout>
        );
    }
}

export default NewElection;