import React, { useState, useRef } from 'react'
import moment from 'moment'
import { Grid, Card, Button, Icon, Form } from 'semantic-ui-react'
import { gql } from '@apollo/client'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { useGlobalContext } from '../util/context'

import LikeButton from '../components/LikeButton'
import DeleteButton from '../components/DeleteButton'

const SinglePost = (props) => {
  const postId = props.match.params.postId
  const [errors, setErrors] = useState(null)
  const [comment, setComment] = useState('')
  const commentInputRef = useRef(null)

  const { user } = useGlobalContext()

  const { data } = useQuery(FETCH_POST_QUERY, {
    variables: { postId },
  })

  const [createComment] = useMutation(CREATE_COMMENT_MUTATION, {
    update() {
      setComment('')
      commentInputRef.current.blur()
    },
    onError(err) {
      setErrors(err)
    },
    variables: {
      postId,
      body: comment,
    },
  })

  let postMarkup

  const deletePostCallback = () => {
    props.history.push('/')
  }

  if (!data) {
    postMarkup = <p>Loading...</p>
  } else {
    const {
      id,
      body,
      createdAt,
      username,
      comments,
      likes,
      likeCount,
      commentCount,
    } = data.getPost

    const reversedComment = comments.reverse()

    postMarkup = (
      <Grid>
        <Grid.Row>
          <Grid.Column width={2}>
            <img
              className='right floated small ui image'
              src='https://semantic-ui.com/images/avatar/large/jenny.jpg'
            />
          </Grid.Column>
          <Grid.Column width={10}>
            <Card fluid>
              <Card.Content>
                <Card.Header>{username}</Card.Header>
                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                <Card.Description>{body}</Card.Description>
              </Card.Content>
              <hr />
              <Card.Content extra>
                <LikeButton post={{ id, likeCount, likes }} />
                <Button className='ui labeled button' tabIndex='0' as='div'>
                  <div className='ui blue button basic'>
                    <i className='comments icon'></i>Commnents
                  </div>
                  <a className='ui basic blue left pointing label'>
                    {commentCount}
                  </a>
                </Button>
                {user && user.username === username && (
                  <DeleteButton postId={id} callbacks={deletePostCallback} />
                )}
              </Card.Content>
            </Card>
            {user && (
              <Card fluid>
                <Card.Content>
                  <p>Post a Comment</p>
                  <Form>
                    <div className='ui action input fluid'>
                      <input
                        type='text'
                        placeholder='Comment...'
                        name='comment'
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        ref={commentInputRef}
                      />
                      <button
                        type='submit'
                        className='ui button teal'
                        disabled={comment.trim() === ''}
                        onClick={createComment}
                      >
                        Submit
                      </button>
                    </div>
                  </Form>
                </Card.Content>
              </Card>
            )}
            {comments.map((comment) => (
              <Card fluid key={comment.id}>
                <Card.Content>
                  {user && user.username === comment.username && (
                    <DeleteButton postId={id} commentId={comment.id} />
                  )}
                  <Card.Header>{comment.username}</Card.Header>
                  <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                  <Card.Description>{comment.body}</Card.Description>
                </Card.Content>
              </Card>
            ))}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }

  return <div>{postMarkup}</div>
}

const FETCH_POST_QUERY = gql`
  query ($postId: ID!) {
    getPost(postId: $postId) {
      id
      body
      createdAt
      username
      likeCount
      likes {
        username
      }
      commentCount
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`

const CREATE_COMMENT_MUTATION = gql`
  mutation ($postId: ID!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id
      comments {
        id
        body
        createdAt
        username
      }
      commentCount
    }
  }
`

export default SinglePost
