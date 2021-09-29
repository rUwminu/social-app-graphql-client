import React, { useState } from 'react'
import { Form } from 'semantic-ui-react'
import { gql } from '@apollo/client'
import { useMutation } from '@apollo/react-hooks'
import { useGlobalContext } from '../util/context'

const Login = (props) => {
  const { onChange, onSubmit, inputValue, login } = useGlobalContext()
  const [errors, setErrors] = useState({})

  // if (localStorage.getItem('jwtToken')) {
  //   props.history.push('/')
  // }

  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    update(_, { data: { login: userData } }) {
      login(userData)
      props.history.push('/')
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors)
    },
    variables: inputValue,
  })

  const handlerClick = () => {
    loginUser()
  }

  return (
    <div className='form-container'>
      <form
        className={loading ? 'ui form loading' : 'ui form'}
        onSubmit={onSubmit}
      >
        <h1>Login</h1>
        <div className={`field ${errors.username ? 'error' : ''}`}>
          <label>Username</label>
          <input
            type='text'
            name='username'
            value={inputValue.username}
            errors={errors.username ? true : false}
            onChange={onChange}
            placeholder='Username'
          />
        </div>
        <div className={`field ${errors.password ? 'error' : ''}`}>
          <label>Password</label>
          <input
            type='password'
            name='password'
            value={inputValue.password}
            errors={errors.password ? true : false}
            onChange={onChange}
            placeholder='Username'
          />
        </div>
        <button className='ui button' type='submit' onClick={handlerClick}>
          Login
        </button>
      </form>
      {Object.keys(errors).length > 0 && (
        <div className='ui error message'>
          <ul className='list'>
            {Object.values(errors).map((value, index) => (
              <li key={index}>{value}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

const LOGIN_USER = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      email
      username
      createdAt
      token
    }
  }
`

export default Login
