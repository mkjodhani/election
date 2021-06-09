import React ,{Component} from 'react'
import { Button } from 'semantic-ui-react'
import Election from './component/Elections'
import Layout from './component/Layout'
class App extends Component
{
  render(){
    return(
      <Layout>
        <Button primary content="Create Election" icon="add circle" floated='right'></Button>
        <h1>DashBoard</h1>
        <hr/>
        <Election></Election>
      </Layout>
    )
  }
}
export default App;
