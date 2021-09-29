import React, { useState, useEffect } from 'react'
import { Form } from 'semantic-ui-react'
import { gql } from '@apollo/client'
import { useMutation } from '@apollo/react-hooks'
import { useGlobalContext } from '../util/context'

const Register = (props) => {
  const [errors, setErrors] = useState({})

  // if (localStorage.getItem('jwtToken')) {
  //   props.history.push('/')
  // }

  const { onChange, onSubmit, inputValue } = useGlobalContext()

  const [addUser, { loading }] = useMutation(REGISTER_USER, {
    update(_, result) {
      props.history.push('/login')
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors)
    },
    variables: inputValue,
  })

  const handlerClick = () => {
    addUser()
  }

  return (
    <div className='form-container'>
      <form
        onSubmit={onSubmit}
        className={loading ? 'ui form loading' : 'ui form'}
      >
        <h1>Register</h1>
        <div className={`field ${errors.username ? 'error' : ''}`}>
          <label>Username</label>
          <input
            type='text'
            name='username'
            onChange={onChange}
            placeholder='Username'
          />
        </div>
        <div className={`field ${errors.email ? 'error' : ''}`}>
          <label>Email</label>
          <input
            type='text'
            name='email'
            onChange={onChange}
            placeholder='Username'
          />
        </div>
        <div className={`field ${errors.password ? 'error' : ''}`}>
          <label>Password</label>
          <input
            type='password'
            name='password'
            onChange={onChange}
            placeholder='Username'
          />
        </div>
        <div className={`field ${errors.confirmPassword ? 'error' : ''}`}>
          <label>Confirm Password</label>
          <input
            type='password'
            name='confirmPassword'
            onChange={onChange}
            placeholder='Username'
          />
        </div>
        <button className='ui button' type='submit' onClick={handlerClick}>
          Submit
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

const REGISTER_USER = gql`
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      registerInput: {
        username: $username
        email: $email
        password: $password
        confirmPassword: $confirmPassword
      }
    ) {
      id
      email
      username
      createdAt
      token
    }
  }
`

export default Register
