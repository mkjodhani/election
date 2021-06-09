import React ,{Component} from 'react';
import { Icon, Card, Grid } from 'semantic-ui-react';
import ElectionCard from '../component/ElectionCard';

class Election extends Component{
    render(){
        var elections = [
            {
                address:"0xB437f19C38badA5B3704cC53B6416f3BBD61B399",
                name:"election",
                description:"description",
                totalVoters:"3"
            },
            {
                address:"0xB437f19C38badA5B3704cC53B6416f3BBD61B399",
                name:"election",
                description:"description",
                totalVoters:"3"
            },
            {
                address:"0xB437f19C38badA5B3704cC53B6416f3BBD61B399",
                name:"election",
                description:"description",
                totalVoters:"3"
            },
            {
                address:"0xB437f19C38badA5B3704cC53B6416f3BBD61B399",
                name:"election",
                description:"description",
                totalVoters:"3"
            },
            {
                address:"0xB437f19C38badA5B3704cC53B6416f3BBD61B399",
                name:"election",
                description:"description",
                totalVoters:"3"
            },
            {
                address:"0xB437f19C38badA5B3704cC53B6416f3BBD61B399",
                name:"election",
                description:"description",
                totalVoters:"3"
            },
            {
                address:"0xB437f19C38badA5B3704cC53B6416f3BBD61B399",
                name:"election",
                description:"description",
                totalVoters:"3"
            },
            {
                address:"0xB437f19C38badA5B3704cC53B6416f3BBD61B399",
                name:"election",
                description:"description",
                totalVoters:"3"
            },
            
        ]
        return(
            <Grid style={{marginTop:"20px"}}>
                {elections.map(election => <Grid.Column width={4}><ElectionCard id="1" name={election.name} description={election.description} totalVoters={election.totalVoters}/></Grid.Column>)}
            </Grid>
        );
    }
}
export default Election;