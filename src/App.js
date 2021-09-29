import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'

// Semantic ui
import { Container } from 'semantic-ui-react'

// Components
import MenuBar from './components/MenuBar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import AuthRoute from './util/AuthRoute'
import SinglePost from './pages/SinglePost'

import 'semantic-ui-css/semantic.min.css'
import './App.css'

const App = () => {
  return (
    <Router>
      <Container>
        <MenuBar />
        <Route exact path='/' component={Home} />
        <AuthRoute>
          <Route exact path='/login' component={Login} />
          <Route exact path='/register' component={Register} />
        </AuthRoute>
        <Route exact path='/posts/:postId' component={SinglePost} />
      </Container>
    </Router>
  )
}

export default App
