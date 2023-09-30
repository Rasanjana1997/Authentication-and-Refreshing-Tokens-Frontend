import React, {useContext} from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../context/AuthContext'

function Header() {
  
  let {user} = useContext(AuthContext);

  console.log(user);
  
  return (
    <div>
        <Link to='/home' >Home</Link>
        <span> | </span>
        <Link to='/' >Login</Link>

        {user && <p>Hi! welcome {user.username}</p>}
    </div>
  )
}

export default Header