import React ,{Component} from 'react'
import { Button } from 'semantic-ui-react'
import Election from './component/Elections'
import Layout from './component/Layout'
import { Link } from 'react-router-dom'
class App extends Component
{
  render(){
    return(
      <Layout>
        <Link to='/election/new'>
          <Button primary content="Create Election" icon="add circle" floated='right'></Button>
        </Link>
        <h1>DashBoard</h1>
        <hr/>
        <Election></Election>
      </Layout>
    )
  }
}
export default App;
