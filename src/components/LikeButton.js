import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Popup } from 'semantic-ui-react'
import { gql } from '@apollo/client'
import { useMutation } from '@apollo/react-hooks'
import { useGlobalContext } from '../util/context'

const LikeButton = ({ post, props }) => {
  const { id, likes, likeCount } = post

  const [errors, setErrors] = useState()
  const [liked, setLiked] = useState(false)
  const { user } = useGlobalContext()

  useEffect(() => {
    if (user && likes.find((like) => like.username === user.username)) {
      setLiked(true)
    } else {
      setLiked(false)
    }
  }, [user, likes])

  const [likePost] = useMutation(LIKE_POST_MUTATION, {
    variables: { postId: id },
    onError(err) {
      setErrors(err)
    },
  })

  const handlerLike = () => {
    likePost()

    if (errors) {
      props.history.push('/login')
    }
  }

  const likeButton = user ? (
    liked ? (
      <Popup
        content='Like Post'
        trigger={
          <div className='ui red button'>
            <i className='heart icon'></i>
          </div>
        }
      />
    ) : (
      <Popup
        content='Like Post'
        trigger={
          <div className='ui red button basic'>
            <i className='heart icon'></i>
          </div>
        }
      />
    )
  ) : (
    <Popup
      content='Like Post'
      trigger={
        <Button as={Link} to='/login' color='red' basic>
          <i className='heart icon'></i>
        </Button>
      }
    />
  )

  return (
    <>
      <div className='ui labeled button' tabIndex='0' onClick={handlerLike}>
        {likeButton}
        <a className='ui basic red left pointing label'>{likeCount}</a>
      </div>
    </>
  )
}

const LIKE_POST_MUTATION = gql`
  mutation likePost($postId: ID!) {
    likePost(postId: $postId) {
      id
      likes {
        id
        username
      }
      likeCount
    }
  }
`

export default LikeButton
