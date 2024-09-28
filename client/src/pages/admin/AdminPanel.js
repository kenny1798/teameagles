import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import { useAdminContext } from '../../hooks/useAdminContext';

function AdminPanel({setNavbar, props}) {

  const {admin} = useAdminContext();
  const [active, setActive] = useState(false);
  const [activeMsg, setActiveMsg] = useState("");
  const [allreq, setallreq] = useState([])
  const navigate = useNavigate();
  

useEffect(() => {
  axios.get('/api/admin/get/unvalidate/users', {headers: {
    adminToken: admin.token.adminToken
  }}).then((response) => {
    if(response.data.users){
      setallreq(response.data.users)
    }
  }).catch((err) => console.log(err))
}, []);

const approveReq = (id) => {
  axios.get(`/api/admin/approve/${id}`, {headers: {
    adminToken: admin.token.adminToken
  }}).then((response) => {
    if(response.data.success){
      window.location.reload();
    }else if(response.data.error){
      console.log(response.data.error)
    }
  }).catch((err) => {
    console.log(err.message)
  })
}

const deleteReq = (id) => {
  axios.get(`/api/admin/delete/approval/${id}`, {headers: {
    adminToken: admin.token.adminToken
  }}).then((response) => {
    if(response.data.success){
      window.location.reload();
    }else if(response.data.error){
      console.log(response.data.error)
    }
  }).catch((err) => {
    console.log(err.message)
  })
}



  return (
    <div className='App'>
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-lg-12 mb-4">
        <h1 className="mt-4 header-title text-center">ADMIN PANEL</h1>
        </div>
        </div>
        <div className='row justify-content-center'>
          <div className='col-md-6 text-center'>
          <div class="card">
            <div class="card-body">
              Users List
              <div className="d-grid my-3 gap-2">
                  <Link className='btn btn-sm btn-primary mt' to='/admin/users'>Go To List</Link>
                </div>
            </div>
          </div>
          </div>
          <div className='col-md-6 text-center'>
          <div class="card">
            <div class="card-body">
              Manager Register
              <div className="d-grid my-3 gap-2">
                  <Link className='btn btn-sm btn-primary mt' to='/admin/register/manager'>Register</Link>
                </div>
            </div>
          </div>
          </div>
          <div className='col-md-12 text-center'>
          <div class="card">
            <div class="card-body">
              Approve User
              <div className="d-grid my-3 gap-2">
                <div className="table-responsive">
                <table class="table table-striped">
                        <thead>
                          <tr>
                            <th scope="col">#</th>
                            <th scope="col">Username</th>
                            <th scope="col">Name</th>
                            <th scope="col">Action</th>
                          </tr>
                        </thead>
                  {allreq.map((val,key) => {
                    
                    return (

                        <tbody>
                          <tr>
                            <th scope="row">{key+1}</th>
                            <td>{val.username}</td>
                            <td>{val.name}</td>
                            <td><div className="d-flex justify-content-center">
                            <button className='btn btn-sm btn-success mx-1' onClick={() => {approveReq(val.id)}}><i class="bi bi-check-lg"></i></button>
                            <button className='btn btn-sm btn-danger mx-1' onClick={() => {deleteReq(val.id)}}><i class="bi bi-x-lg"></i></button>
                            </div>
                            </td>
                          </tr>
                        </tbody>

                    )
                  })}
                                      </table>
                </div>

                </div>
            </div>
          </div>
          </div>
        </div>
        </div>
        </div>
  )
}

export default AdminPanel
