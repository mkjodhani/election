import React,{Component} from "react";
import { Grid,Card } from "semantic-ui-react";
class Candidates extends Component
{
    render(){
        const candidateList =['Mayur' ,'Sachin' ,'Meet'];
        return(
            <Grid>
                {candidateList.map(name =>{
                    return(<Grid.Column width={5}>
                        <Card
                            image='https://react.semantic-ui.com/images/avatar/large/elliot.jpg'
                            header={name}
                            meta='Candidate'
                            description={`${name} is a Candidate for the Election`}
                        />
                    </Grid.Column>)
                })}
            </Grid>
        )
    }
}
export default Candidates;