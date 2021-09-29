import React, { useState } from 'react'
import { Icon, Button, Confirm, Popup } from 'semantic-ui-react'
import { gql } from '@apollo/client'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { useGlobalContext } from '../util/context'

import { FETCH_POSTS_QUERY } from '../util/graphql'

const DeleteButton = ({ postId, commentId, callbacks }) => {
  const [confirmOpen, setConfirmOpen] = useState(false)

  const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION

  const [deletePostOrComment] = useMutation(mutation, {
    update(proxy) {
      if (!commentId) {
        setConfirmOpen(false)
        const data = proxy.readQuery({
          query: FETCH_POSTS_QUERY,
        })
        data.getPosts = data.getPosts.filter((p) => p.id !== postId)
        proxy.writeQuery({ query: FETCH_POSTS_QUERY, data })
      }
      if (callbacks) callbacks()
    },
    variables: { postId, commentId },
  })

  const handlerClick = () => {
    setConfirmOpen(false)
    deletePostOrComment()
  }

  return (
    <>
      <Popup
        content={commentId ? 'Delete Comment' : 'Delete Post'}
        trigger={
          <Button
            as='div'
            color='red'
            floated='right'
            onClick={() => setConfirmOpen(true)}
          >
            <Icon name='trash' style={{ margin: 0 }} />
          </Button>
        }
      />

      <Confirm
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handlerClick}
      />
    </>
  )
}

const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($postId: ID!, $commentId: ID!) {
    deleteComment(postId: $postId, commentId: $commentId) {
      id
      comments {
        id
        username
        createdAt
        body
      }
      commentCount
    }
  }
`

export default DeleteButton
