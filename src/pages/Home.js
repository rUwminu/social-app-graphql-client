import React, { useState, useEffect } from 'react'
import { useQuery, gql } from '@apollo/client'
import { Grid, Transition } from 'semantic-ui-react'
// import { useQuery } from '@apollo/react-hooks'
// import gql from 'graphql-tag'
import { useGlobalContext } from '../util/context'

// gql query stucture
import { FETCH_POSTS_QUERY } from '../util/graphql'

// components
import PostCard from '../components/PostCard'
import PostForm from '../components/PostForm'

const Home = (props) => {
  const { loading, data } = useQuery(FETCH_POSTS_QUERY)
  const { user } = useGlobalContext()

  // if (!localStorage.getItem('jwtToken')) {
  //   props.history.push('/login')
  // }

  return (
    <Grid columns={3}>
      <Grid.Row className='page-title'>
        <h1>Recent Posts</h1>
      </Grid.Row>
      <Grid.Row className='mb'>
        {user && (
          <Grid.Column>
            <PostForm />
          </Grid.Column>
        )}
        {loading ? (
          <h1>Loading Posts...</h1>
        ) : (
          <Transition.Group>
            {data &&
              data.getPosts.map((post, index) => (
                <Grid.Column className='mb'>
                  <PostCard
                    post={post}
                    key={post.id}
                    style={{ marginBottom: 20 }}
                  />
                </Grid.Column>
              ))}
          </Transition.Group>
        )}
      </Grid.Row>
    </Grid>
  )
}

export default Home
