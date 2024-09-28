import { Link } from "react-router-dom";
import logo from './eagleslogo_black.png';
import { useAuthContext } from "../hooks/useAuthContext";
import { useLogout } from "../hooks/useLogout";
import { useEffect, useState } from "react";
import axios from "../api/axios";


function Navbar() {

  const {logout} = useLogout()
  const {user} = useAuthContext()
  const [manager, setManager] = useState(false)

 
    useEffect(() => {
      if(user){
      axios.get('/api/user/check/ismanager', {headers: {
        accessToken: user.token
      }}).then((response) => {
        response.status === 200 && setManager(true)
      })
    }
      
    }, [])
  


  const handleClick = () => {
    document.getElementById('hamburger').click()
    logout()
  }

  const handleLinkClick = () => {
    document.getElementById('hamburger').click()
  }
  

  return(

<div className="topnav">
        <div className='topnav-conteiner conteiner'>
        <img alt='Mirads Marketing' className='logo' src={logo} height="40" />
        <input type="checkbox" name="" id="hamburger" />
          <div class="hamburger-lines">
              <span class="line line1"></span>
              <span class="line line2"></span>
              <span class="line line3"></span>
          </div>
          <div className="menu-items">

        {!user && (<>
        <Link to="/login" onClick={handleLinkClick}>Login</Link>
        <Link to="/signup" onClick={handleLinkClick}>Sign Up</Link>
        </>)}
        {user && (<>
        <Link to="/" onClick={handleLinkClick}>Home</Link>
        <Link to="/tools" onClick={handleLinkClick}>Tools</Link>
        <Link to="/courses" onClick={handleLinkClick}>Training Centre</Link>
        {!manager ? (<></>) : (<Link to="/admin" onClick={handleLinkClick}>Admin Panel</Link>)}
        <Link onClick={handleClick} to="/login">Logout ({user.username})</Link>   
        </>)}
        </div>
        </div>
      </div>
)}

export default Navbar
