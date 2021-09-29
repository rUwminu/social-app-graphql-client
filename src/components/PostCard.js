import React from 'react'
import { Card, Icon, Label, Button, Popup } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import moment from 'moment'
import { useGlobalContext } from '../util/context'

// Compoment
import LikeButton from './LikeButton'
import DeleteButton from './DeleteButton'

const PostCard = ({ post }) => {
  const { id, body, username, createdAt, likeCount, commentCount, likes } = post
  const { user } = useGlobalContext()

  return (
    <div className='ui card fluid'>
      <div className='content'>
        <img
          className='right floated mini ui image'
          src='https://semantic-ui.com/images/avatar/large/jenny.jpg'
        />
        <div className='header'>{username}</div>
        <Card.Meta as={Link} to={`/posts/${id}`}>
          {moment(createdAt).fromNow()}
        </Card.Meta>
        <div className='description'>{body}</div>
      </div>
      <div className='extra content'>
        <LikeButton post={{ id, likes, likeCount }} />
        <Popup
          content='Comment on Post'
          trigger={
            <Button
              className='ui labeled button'
              tabIndex='0'
              as={Link}
              to={`/posts/${id}`}
            >
              <div className='ui blue button basic'>
                <i className='comments icon'></i>
              </div>
              <a className='ui basic blue left pointing label'>
                {commentCount}
              </a>
            </Button>
          }
        />
        {user && user.username === username && <DeleteButton postId={id} />}
      </div>
    </div>
  )
}

export default PostCard
