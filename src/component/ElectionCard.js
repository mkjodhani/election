import React ,{Component} from 'react'
import { Icon, Card } from 'semantic-ui-react'
class ElectionCard extends Component
{
    selectElection = () =>
    {
        console.log(`/election/`);
        window.history.pushState({},`/election/${this.props.address}`);
        window.location.replace(`/election/${this.props.address}`);
    }
    render(){
        return( 
        <Card key={this.props.id} onClick={this.selectElection} >
            <Card.Content header={`${this.props.name}`}/>
            <Card.Content description={`${this.props.description}`}/>    
            <Card.Content extra><Icon name='user'></Icon> {`${this.props.totalVoters}`} Candidates</Card.Content>
        </Card>);
    }
}
export default ElectionCard;