import React, { useState, useContext, useReducer } from 'react'

import AppReducer from './AppReducer'
import jwtDecode from 'jwt-decode'

// Create Context
const GlobalContext = React.createContext()

const AppProvider = ({ children }) => {
  const loginState = {
    user: null,
    login: (userData) => {},
    logout: () => {},
  }
  const InputState = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  }
  const [state, dispatch] = useReducer(AppReducer, loginState)
  const [inputValue, setInputValue] = useState(InputState)

  if (localStorage.getItem('jwtToken')) {
    const decodedToken = jwtDecode(localStorage.getItem('jwtToken'))

    if (decodedToken.exp * 1000 < Date.now()) {
      localStorage.removeItem('jwtToken')
    } else {
      loginState.user = decodedToken
    }
  }

  const onChange = (e) => {
    setInputValue({ ...inputValue, [e.target.name]: e.target.value })
  }

  const onSubmit = (e) => {
    e.preventDefault()
  }

  const login = (userData) => {
    localStorage.setItem('jwtToken', userData.token)
    dispatch({
      type: 'LOGIN',
      payload: userData,
    })
  }

  const logout = () => {
    localStorage.removeItem('jwtToken')
    dispatch({
      type: 'LOGOUT',
    })
  }

  return (
    <GlobalContext.Provider
      value={{
        onChange,
        onSubmit,
        inputValue,
        user: state.user,
        login,
        logout,
      }}
    >
      {children}
    </GlobalContext.Provider>
  )
}

export const useGlobalContext = () => {
  return useContext(GlobalContext)
}

export { GlobalContext, AppProvider }
