import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { useGlobalContext } from '../util/context'

const AuthRoute = ({ children, ...rest }) => {
  const { user, login, logout } = useGlobalContext()

  return (
    <Route
      {...rest}
      render={() => {
        return user ? <Redirect to='/' /> : children
      }}
    />
  )
}

export default AuthRoute
