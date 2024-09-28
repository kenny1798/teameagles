import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from '../../api/axios';
import { useAdminContext } from '../../hooks/useAdminContext';

function AdminEditUser({setNavbar, props}) {

    const {user} = useParams();
    const navigate = useNavigate();
    const [msg, setMsg] = useState("");
    const {admin} = useAdminContext();
    const [uid, setUid] = useState(null);
    const [username, setUsername] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [subscription, setSubscription] = useState("");


    useEffect(() => {
        axios.get(`/api/admin/getuser/${user}`, {headers: {
            adminToken : admin.token.adminToken
        }}).then((response) => {
            if(!response.data.error){
            const json = response.data;
                setUid(json.id)
                setUsername(json.username)
                setPhoneNumber(json.phoneNumber)
                setEmail(json.email)
                setSubscription(json.subscription)
            }
        })
    } ,[])

    const submitEdit = () =>{
        const data = {username: user, phoneNumber: phoneNumber, email:email, subscription:subscription}
        axios.put('/api/admin/user/update', data, {headers: {
            adminToken: admin.token.adminToken
        }}).then((response) => {
          if(!response.data.error){
            setMsg(response.data.status);
            const delay = () => {
              navigate('/admin/users')
            }
            setTimeout(delay, 2000);
          }
        })
    }

    const deleteUser = () =>{
      const confirmDelete = window.confirm('Are you sure you want to delete this user?')

      if(confirmDelete){
        axios.get(`/api/admin/delete/approval/${uid}`, {headers: {
          adminToken: admin.token.adminToken
      }}).then((response) => {
        if(!response.data.error){
          setMsg("User deleted");
          const delay = () => {
            navigate('/admin/users')
          }
          setTimeout(delay, 2000);
        }
      }).catch(err => {
        console.log(err)
      })
      }

  }
    
  return (
    <div className='App'>
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-lg-12 mb-4 text-center">
        <h1 className="mt-4 header-title text-center">EDIT USER</h1>
        <Link to={'/admin'}>Admin Panel</Link> / <Link to={'/admin/users'}>Users List</Link>  <span>/ Edit User</span>
        </div>
        <div className='col-md-5'>
        
          {msg && (<div class="alert alert-success" role="alert"> {msg} </div>)}
          
          <label>Username</label>
          <input type="text" className='form-control shadow-none' defaultValue={username} readOnly disabled />
          <label className='mt-3'>Phone Number</label>
          <input type="text" className='form-control shadow-none' defaultValue={phoneNumber} onChange={(event) =>{setPhoneNumber(event.target.value)}}/>
          <label className='mt-3'>Email</label>
          <input type="text" className='form-control shadow-none' defaultValue={email} onChange={(event) =>{setEmail(event.target.value)}}/>
          <div className="d-grid gap-2 mt-4">
            <button className="btn btn-primary mt-3" onClick={submitEdit}>Submit</button>
          </div>
          <div className="d-grid gap-2 my-2">
            <button className="btn btn-danger mt-3" onClick={deleteUser}>Delete</button>
          </div>
        </div>
        </div>
        </div>
        </div>
  )
}

export default AdminEditUser
