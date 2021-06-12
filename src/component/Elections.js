import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';
import ElectionCard from '../component/ElectionCard';
class Elections extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {elections:[]}
    }
    async componentDidMount() {
        this.setState( {elections:this.props.elections});
    }
    render(){
        return(
            <Grid style={{marginTop:"20px"}}>
                {this.state.elections.map((election,index) => {
                    return <Grid.Column key={index +1}  width={4}><ElectionCard id={index+1} address={election}/></Grid.Column>
                })}
            </Grid>
        );
    
    }
}
export default Elections;