import { Container,Divider,Select,Button,Form } from 'semantic-ui-react';
import {useParams} from 'react-router-dom'
import ElectionChart from '../component/ElectionChart'
import Candidates from '../component/Candidates'
import { Link } from 'react-router-dom';
const Election =  () =>{
    const params = useParams()
    const candidate = [
        {key:"1",value:"1",text:"Mayur"},
        {key:"2",value:"2",text:"Sachin",},
        {key:"3",value:"3",text:"Meet"}
    ]
    return(
       <>
        <Divider/>
        <Container textAlign="center"><h1>Election : Name of Election</h1></Container>
        <Divider/>
        <br/>
        <Container textAlign="left" style={{marginBottom:"25px"}}>
            <Link to="/">
                <Button primary floated='left'  content="Back"/>
            </Link>
        </Container>
        <br/>
        <Container textAlign="left">
            <h2>Description:</h2>
        </Container>
        <br/>
        <Container textAlign="justified" style={{paddingLeft:'30px'}}><p>description of the election</p></Container>
        <br/>
        <Container textAlign="center" children={<Candidates/>}></Container>
        <br/>
        <Container textAlign="center" children={<ElectionChart/>}></Container>
        <br/>
        <Container style={{margin:"auto"}}>

        <Form>
            <Form.Field>
                <h3>Select Candidate</h3>
                <Select placeholder="Select Candidate" options={candidate}></Select>
            </Form.Field>
            <Button primary floated='right' icon="add" content="Vote"/>
        </Form>
        </Container>
        <Container textAlign="center" style={{paddingTop:'50px'}}><p>Account Address: ___________</p></Container>
       </>
    )
}
export default Election;