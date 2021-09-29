import React, { useState } from 'react'
import { Menu } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { useGlobalContext } from '../util/context'

const MenuBar = () => {
  const pathname = window.location.pathname
  const path = pathname === '/' ? 'home' : pathname.substr(1)
  const { user, login, logout } = useGlobalContext()

  const [activeItem, setActiveItem] = useState(path)

  const handleItemClick = (e, { name }) => {
    setActiveItem(name)
  }

  const menuBar = user ? (
    <Menu pointing secondary size='massive' color='teal'>
      <Menu.Item
        active={activeItem === 'home'}
        name={user.username}
        onClick={handleItemClick}
        as={Link}
        to='/'
      />
      <Menu.Menu position='right'>
        <Menu.Item name='logout' onClick={logout} as={Link} />
      </Menu.Menu>
    </Menu>
  ) : (
    <Menu pointing secondary size='massive' color='teal'>
      <Menu.Item
        active={activeItem === 'home'}
        name='home'
        onClick={handleItemClick}
        as={Link}
        to='/'
      />
      <Menu.Menu position='right'>
        <Menu.Item
          active={activeItem === 'login'}
          name='login'
          onClick={handleItemClick}
          as={Link}
          to='/login'
        />
        <Menu.Item
          active={activeItem === 'register'}
          name='register'
          onClick={handleItemClick}
          as={Link}
          to='/register'
        />
      </Menu.Menu>
    </Menu>
  )

  return menuBar
}

export default MenuBar
