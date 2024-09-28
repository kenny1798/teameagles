import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import header1 from '../../components/images/msmart1.jpg';
import header2 from '../../components/images/msmart2.jpg';
import header3 from '../../components/images/msmart3.jpg';
import { useAuthContext } from '../../hooks/useAuthContext';
import { msmartAxios } from '../../api/axios';

function Msmart() {

const {user} = useAuthContext();
const [ownerObj, setOwnerObj] = useState([]);
const [managerObj, setManagerObj] = useState([]);
const [memberObj, setMemberObj] = useState([]);
const [teamObj, setTeamObj] = useState([]);
const [verify, setVerify] = useState("");
const [errMsg, setErrMsg] = useState("");

useEffect(() => {
  msmartAxios.get('/api/msmart/get/team/all', {headers: {
    accessToken: user.token
  }}).then((response) => {
    setOwnerObj(response.data.owner);
    setManagerObj(response.data.manager);
    setMemberObj(response.data.member);
  })
}, [user.token]);

useEffect(() => {
  msmartAxios.get('/api/msmart/get/team/list', {headers: {
    accessToken: user.token
  }}).then((response) => {
    setTeamObj(response.data)
  })
}, [])

console.log(memberObj)

  return (
    <div className='App'>
    <div className="container mt-3">
      <div className="row justify-content-center text-center">
        <div className="col-lg-12">
        <h1 className="mt-4 header-title">M-SMART</h1>
        <p style={{fontSize:"1rem"}}>No more 1000 files on your desk and desktop. Say hello to M-Smart 😎</p>
        </div>
        </div>

<div className='row justify-content-center'>
  <div className="col-lg-4">
  <div className="card text-center my-3">
  <div className="card-header">
    <img src={header1} alt='Mgen-Header' className='image-header'/>
  </div>
  <div className="card-body">
    <h5 className="card-title">Create Team</h5>
    <p className="card-text">Create a team now!</p>
    {ownerObj.length === 0 ? (<></>): (<table class="table">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">Team</th>
      <th scope="col"></th>
    </tr>
  </thead>
  <tbody>
  {ownerObj.map((value, key) => {
    return(
    <tr>
    <th scope="row">{key+1}</th>
    <td>{value.teamName}</td>
    <td><Link className='btn btn-sm' to={`/msmart/team/admin/manager/${value.id}`}>➡️</Link></td>
  </tr>
  )
  })} 
  </tbody>
</table>)}
    <div className="d-grid gap-2 mt-4 mx-auto">
    <Link className='btn btn-success' to="/msmart/team/create">Create Now</Link>
    </div>
  </div>
  </div>
</div>


<div className="col-lg-4">
<div className="card text-center my-3">
  <div className="card-header">
  <img src={header2} alt='Mgen-Header' className='image-header'/>
  </div>
  <div className="card-body">
    <h5 className="card-title">Join As Manager</h5>
    <p className="card-text">Join a team as a manager now!</p>
    {managerObj.length === 0 ? (<></>): (<table class="table">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">Team</th>
      <th scope="col">Status</th>
      <th scope="col"></th>
    </tr>
  </thead>
  <tbody>
  {managerObj.map((value, key) => {
    const linkManager = `/msmart/team/manage/${value.teamId}`
    const team = teamObj.find(team => team.id === parseInt(value.teamId, 10));
    const teamName = team.teamName
    return(
    <tr>
    <th scope="row">{key+1}</th>
    <td>{teamName}</td>
    <td>{value.isVerified === false ? (<div style={{color:"red"}}>Pending Verify</div>) : (<div style={{color:"green"}}>Verified</div>) }</td>
    <td>{value.isVerified === false ? (<></>):(<Link className='btn btn-sm' to={linkManager}>➡️</Link>)}</td>
  </tr>
  )
  })} 
  </tbody>
</table>)}
    
    <div className="d-grid gap-2 mt-4 mx-auto">
    <Link className='btn btn-primary' to="/msmart/team/join/manager">Join Now</Link>
    </div>
  </div>
</div>
</div>

  <div className="col-lg-4">
  <div className="card text-center my-3">
  <div className="card-header">
    <img src={header3} alt='Mgen-Header' className='image-header'/>
  </div>
  <div className="card-body">
    <h5 className="card-title">Join A Team</h5>
    <p className="card-text">Join any team and manager now!</p>
    {memberObj.length === 0  ? (<></>) : (<table class="table">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">Team</th>
      <th scope="col">Status</th>
      <th scope="col">View</th>
    </tr>
  </thead>
  <tbody>
  {memberObj.map((value, key) => {

    const memberLink = `/msmart/db/manage/${value.teamId}`;
    const team = teamObj.find(team => team.id === parseInt(value.teamId, 10));
    const teamName = team.teamName

    return(
    <tr>
    <th scope="row">{key+1}</th>
    <td>{teamName}</td>
    <td>{value.isVerified === false ? (<div style={{color:"red"}}>Pending Verify</div>) : (<div style={{color:"green"}}>Verified</div>) }</td>
    <td>{value.isVerified === false ? (<></>):(<Link className='btn btn-sm' to={memberLink}>➡️</Link>)}</td>
  </tr>
  )
  })} 
  </tbody>
</table>)}
    <div className="d-grid gap-2 mt-4 mx-auto">
    <Link className='btn btn-primary' to="/msmart/team/join">Join Now</Link>
    </div>
  </div>
  </div>
</div>
</div>
        
        </div>
      </div>
  )
}

export default Msmart