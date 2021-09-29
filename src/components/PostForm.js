import React, { useState } from 'react'
import { useQuery, gql } from '@apollo/client'
import { useMutation } from '@apollo/react-hooks'
import { Form, Button } from 'semantic-ui-react'
import { useGlobalContext } from '../util/context'

// gql query stucture
import { FETCH_POSTS_QUERY } from '../util/graphql'

const PostForm = () => {
  const [errors, setErrors] = useState()
  const { user, onSubmit, onChange, inputValue } = useGlobalContext()

  const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
    variables: inputValue,
    update(proxy, result) {
      const data = proxy.readQuery({
        query: FETCH_POSTS_QUERY,
      })
      data.getPosts = [result.data.createPost, ...data.getPosts]
      proxy.writeQuery({ query: FETCH_POSTS_QUERY, data })
      inputValue.body = ''
    },
    onError(err) {
      setErrors(err)
    },
  })

  const handlerClick = () => {
    setErrors(null)
    createPost()
  }

  return (
    <>
      <Form onSubmit={onSubmit}>
        <h2>Create a post:</h2>
        <Form.Field>
          <Form.Input
            placeholder='What on your mind?'
            name='body'
            onChange={onChange}
            valur={inputValue.body}
          />
          <Button type='submit' color='teal' onClick={handlerClick}>
            Submit
          </Button>
        </Form.Field>
      </Form>
      {errors && (
        <div className='ui error message' style={{ marginBottom: 20 }}>
          <ul className='list'>
            <li>Posting empty post? Are you ok?</li>
          </ul>
        </div>
      )}
    </>
  )
}

const CREATE_POST_MUTATION = gql`
  mutation createPost($body: String!) {
    createPost(body: $body) {
      id
      body
      createdAt
      username
      likes {
        id
        username
        createdAt
      }
      likeCount
      comments {
        id
        body
        username
        createdAt
      }
      commentCount
    }
  }
`

export default PostForm
