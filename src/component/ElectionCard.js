import React ,{Component} from 'react'
import { Icon, Card } from 'semantic-ui-react'
import {Link} from 'react-router-dom'
class ElectionCard extends Component
{
    render(){
        return(
            <Link to={`election/${this.props.id}`}>
                <Card key={this.props.id} >
                    <Card.Content header={`${this.props.id} : ${this.props.name}`}/>
                    <Card.Content description={`${this.props.description}`}/>    
                    <Card.Content extra><Icon name='user'></Icon> {`${this.props.totalVoters}`} Candidates</Card.Content>
                </Card>
            </Link> 
        );
    }
}
export default ElectionCard;