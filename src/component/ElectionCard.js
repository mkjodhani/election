import React, { Component }  from 'react'
import { Icon, Card } from 'semantic-ui-react'
import {Link} from 'react-router-dom'
import Election from '../assets/eth/Election'
class ElectionCard extends Component
{
    constructor(props){
        super(props);
        this.state ={address:'',election:[]}
    }
    async componentDidMount() {
        console.log("Elections Card JS : "+this.props.address);
        const electionContract = Election(this.props.address);
        const admin = await electionContract.methods.admin().call();
        const candidateCount = await electionContract.methods.candidateCount().call();
        const description = await electionContract.methods.description().call();
        const name = await electionContract.methods.name().call();
        console.log({admin,candidateCount,description,name});
        this.setState({address: this.props.address,election:{admin,candidateCount,description,name}});
    }
    render(){
        //  return(<h1>Election:{this.state.address}</h1>)
        const {admin,candidateCount,description,name} = this.state.election;
        if(this.state.election)
        {
            return(
                <Link to={`election/${this.state.address}`}>
                    <Card key={this.props.id} >
                        <Card.Content header={`${this.props.id} : ${name}`}/>
                        <Card.Content description={`${description}`}/>    
                        <Card.Content extra><Icon name='user'></Icon> {`${candidateCount}`} Candidates</Card.Content>
                    </Card>
                </Link> 
            );
        }
        return(<>NOthind</>);
    }
}
export default ElectionCard;