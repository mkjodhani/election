import React,{Component} from "react";
import { Grid,Card } from "semantic-ui-react";
class Candidates extends Component
{
    constructor(props){
        super(props);
        this.state = {candidateList:props.candidates}
    }
    render(){
        return(
            <Grid>
                {this.state.candidateList.map((cand) =>{
                    return(<Grid.Column width={3} key={cand.id}>
                        <Card
                            header={cand.name}
                            image='https://react.semantic-ui.com/images/avatar/large/elliot.jpg'
                            key={cand.id}
                        />
                    </Grid.Column>)
                })}
            </Grid>
        )
    }
}
export default Candidates;