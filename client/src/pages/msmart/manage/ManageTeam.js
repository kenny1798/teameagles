import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios, { msmartAxios } from '../../../api/axios';
import { useAuthContext } from '../../../hooks/useAuthContext';

function ManageTeam() {

  const {user} = useAuthContext();
  const {teamId} = useParams();
  const [dbData, setDbData] = useState([]);
  const [error, setError] = useState("");
  const [succ, setSucc] = useState("");
  const [search, setSearch] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();



useEffect(() => {

  msmartAxios.get(`/api/msmart/manager/get/team/member/${teamId}`, {headers: {
    accessToken: user.token
  }}).then((response) => {
    if(response.data.team){
      setDbData(response.data.team)
    }else{
      setError("Unable to retrieve data")
    }
  })

}, [])

  const deleteMember = (id, e) => {
    setSucc('');
    setError('');
    e.preventDefault();

    const confirmed = window.confirm('Are you sure you want to delete this member request?')
    
    if(confirmed){
      msmartAxios.delete(`/api/msmart/manager/member/${id}`, {headers: {
        accessToken: user.token
      }}).then((response) => {
        if(response.data.succ){
          setSucc(response.data.succ)
          const delay = () =>{
            window.location.reload()
          }
          setTimeout(delay, 2000)
        }else{
          setError("Unable to delete member request")
          const delay = () =>{
            window.location.reload()
          }
          setTimeout(delay, 2000)
        }
      }).catch((err) => {
          setError("Unable to delete member request")
          const delay = () =>{
            window.location.reload()
          }
          setTimeout(delay, 2000)
          console.log(err)
      })
    }

  }

  const approveMember = (id, e) => {
    setSucc('');
    setError('');

    const data = {id: id}

    e.preventDefault();

    msmartAxios.put(`/api/msmart/manager/approve/member`, data, {headers: {
      accessToken: user.token
    }}).then((response) => {
      if(response.data.succ){
        setSucc(response.data.succ)
        const delay = () =>{
          window.location.reload()
        }
        setTimeout(delay, 2000)
      }else{
        setError("Unable to approve member request")
        const delay = () =>{
          window.location.reload()
        }
        setTimeout(delay, 2000)
      }
    }).catch((err) => {
        setError("Unable to approve member request")
        const delay = () =>{
          window.location.reload()
        }
        setTimeout(delay, 2000)
        console.log(err)
    })
  }

  


  return (
    <div className='App'>
    <div className="container mt-3">
      <div className="row justify-content-center text-center">
        <div className="col-lg-12">
        <h1 className="mt-4 header-title">M-SMART</h1>
        <p style={{fontSize:"1rem"}}>No more 1000 files on your desk and desktop. Say hello to M-Smart 😎</p>
        </div>
        </div>
        </div>

        
        
        
        <div className='row justify-content-center mt-3'>
          <div className='col-lg-6 text-center'>
            <div className='container'>
            {!error ? (<></>) : (
            <div class="alert alert-danger text-center mb-3" role="alert">
              {error}
            </div>)}

            

            {!succ ? (<></>) : (
            <div class="alert alert-success text-center mb-3" role="alert">
              {succ}
            </div>)}

            <nav aria-label="Page navigation example">
              <ul class="pagination justify-content-center">
                <li class="page-item"><span class="page-link disabled" aria-disabled="true" >Members</span></li>
                <li class="page-item"><Link class="page-link" to={`/msmart/team/activity/${teamId}`} >Activity</Link></li>
              </ul>
            </nav>

                <div className='card'>
                  <div className='table-responsive'>
                  <table class="table">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Username</th>
                        <th scope="col">Name</th>
                        <th scope="col">Pos</th>
                        <th scope="col">Status</th>
                      </tr>
                    </thead>

                        <tbody>
                      
                        {dbData.map((val,key) => {
                          return(
                            <tr>
                        <th scope="row">{key +1}</th>
                        <td>{val.username}</td>
                        <td>{val.nameInTeam}</td>
                        <td>{val.position}</td>
                        <td>{val.isVerified === true ? (<> <span style={{color:'green'}}>Verified</span> <button className='btn btn-sm btn-primary mx-2' ><i class="bi bi-pencil"></i></button></>): (<>
                          <div className='d-flex gap-2 justify-content-center'>
                            <button className='btn btn-sm btn-success' onClick={(e) => {approveMember(val.id, e)}}><i class="bi bi-check-lg"></i></button>
                            <button className='btn btn-sm btn-danger' onClick={(e) => {deleteMember(val.id, e)}}><i class="bi bi-trash"></i></button></div>
                        
                        </>)}</td>
                      </tr>
                          )
                        })}
                        
                    </tbody>

                    
                  </table>
                  </div>
                </div>

            </div>
            </div>
          </div>    
        </div>
  )
}

export default ManageTeam