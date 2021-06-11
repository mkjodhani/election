import React ,{Component} from 'react'
import { Button, Container } from 'semantic-ui-react'
import Elections from './component/Elections'
import Layout from './component/Layout'
import { Link } from 'react-router-dom'
import ElectionFactory from './assets/eth/ElectionFactory'
class App extends Component
{
  constructor(props){
    super(props);
    this.state ={manager:'',totalElections:0,elections:'',ready:false}
  }
  async componentDidMount(){
    const manager = await ElectionFactory.methods.manager().call();
    const totalElections = await ElectionFactory.methods.totalElections().call();
    let elections = [];
    for(var  i=1;i<=totalElections;i++)
    {
      const election = await ElectionFactory.methods.elections(i).call();
      elections.push(election);
    }
    this.setState({manager:manager,totalElections:totalElections,elections:elections,ready:true});
  }
  render(){
    return(
      <Layout>
        <h1>DashBoard</h1>
        <hr/>
        {/* {<h1>{  JSON.stringify(this.state)}</h1>} */}
        {this.state.ready  &&<Elections key={0} elections={this.state.elections}></Elections>}
        <Container textAlign='center' style={{margin:'20px'}}>
          <Link to='/election/new'>
            <Button primary content="Create Election" icon="add circle" ></Button>
          </Link>
        </Container>
      </Layout>
    )
  }
}
export default App;
