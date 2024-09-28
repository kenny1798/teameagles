import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios, { msmartAxios } from '../../../../api/axios';
import { useAuthContext } from '../../../../hooks/useAuthContext';

function SuperTeamActivity() {

    const { user } = useAuthContext();
    const { teamId } = useParams();
    const [error, setError] = useState("");
    const [succ, setSucc] = useState("");
    const [activity, setActivity] = useState([]);
    const [team, setTeam] = useState([]);
    const [lead, setLead] = useState([]);
    
    
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0'); 
    const formattedDate = `${year}-${month}-${day}`;
  
    const [filteredActivityData, setFilteredActivityData] = useState([]);
    const [filterDate, setFilterDate] = useState(formattedDate);
    const [selectedLead, setSelectedLead] = useState(null);

    useEffect(() => {
        const data = {date:filterDate}
        msmartAxios.post(`/api/msmart/supermanager/get/activity/${teamId}`, data, {
          headers: {
            accessToken: user.token
          }
        }).then((response) => {
          setLead(response.data.lead)
          setActivity(response.data.activity);
          setTeam(response.data.team);

          console.log(response.data)
        }).catch((error) => {
          setError("Unable to fetch activities.");
          console.log(error)
        });
      }, []);

      const getData = async (e, value) => {
        e.preventDefault();
        setActivity([]);
        setFilterDate(value)
        const data = {date:value}
        await msmartAxios.post(`/api/msmart/supermanager/get/activity/${teamId}`, data, {
          headers: {
            accessToken: user.token
          }
        }).then((response) => {
          setLead(response.data.lead)
          setActivity(response.data.activity);
          setTeam(response.data.team);

          console.log(response.data)
      
        }).catch((error) => {
          setError("Unable to fetch activities.");
          console.log(error)
        });
      }
    
      const handleLeadClick = (leadId) => {
        const foundLead = lead.find(val => val.id === leadId);
        setSelectedLead(foundLead);
      };


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
        <div className='col-lg-8 text-center'>
          <div className='container'>

            {error && (
              <div className="alert alert-danger text-center mb-3" role="alert">
                {error}
              </div>
            )}

            {succ && (
              <div className="alert alert-success text-center mb-3" role="alert">
                {succ}
              </div>
            )}

            <nav aria-label="Page navigation example">
              <ul className="pagination justify-content-center">
              <li className="page-item"><Link className="page-link" to={`/msmart/team/admin/manager/${teamId}`}>Managers</Link></li>
                <li className="page-item"><Link className="page-link" to={`/msmart/team/admin/member/${teamId}`}>Members</Link></li>
                <li className="page-item"><span className="page-link disabled">Activities</span></li>
              </ul>
            </nav>

            <div className="row">
              <div className="col"></div>
              <div className="col"></div>
              <div className="col">
                <input
                  className='form-control shadow-none my-3'
                  type='date'
                  defaultValue={formattedDate}
                  onChange={(e) => {getData(e, e.target.value)}}
                />
              </div>
            </div>

            <div className='card'>
              <div className='table-responsive'>
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Member</th>
                      <th scope="col">Activity</th>
                      <th scope="col">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activity.map((item, index) => {
                        const name = team.find(val => val.username === item.username);
                        
                        return(
                      <tr key={item.id}>
                        <td>{index + 1}</td>
                        <td>{name.nameInTeam}</td>
                        <td>{item.activity}</td>
                        <td><button type="button" class="btn btn-sm btn-primary" onClick={() => {handleLeadClick(item.msmartleadId)}} data-bs-toggle="modal" data-bs-target="#leadDetail">
                        <i class="bi bi-list"></i>
                          </button></td>
                      </tr>
                    )})}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </div>

<div class="modal fade" id="leadDetail" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Database Details</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
      {selectedLead ? (
    <div>
      <p><strong>Name:</strong> {selectedLead.name}</p>
      <p><strong>Phone:</strong> {selectedLead.country}{selectedLead.phone}</p>
      <p><strong>Status:</strong> {selectedLead.status}</p>
      <p><strong>Remark:</strong> {selectedLead.remark}</p>
      {selectedLead.followUpDate === selectedLead.createdAt ? (<></>) : (<>
        <p><strong>Follow-Up Date:</strong> {new Date(selectedLead.followUpDate).toDateString().slice(4)} ({new Date(selectedLead.followUpDate).toTimeString().slice(0,5)}:00)</p>
      </>)}    
      <p><strong>Last Update:</strong> {new Date(selectedLead.updatedAt).toDateString().slice(4)} ({new Date(selectedLead.updatedAt).toTimeString().slice(0,5)}:00)</p>
      <p><strong>Created:</strong> {new Date(selectedLead.createdAt).toDateString().slice(4)} ({new Date(selectedLead.createdAt).toTimeString().slice(0,5)}:00)</p>
    </div>
  ) : (
    <p>No details available.</p>
  )}
      </div>
    </div>
  </div>
</div>

    </div>
  )
}

export default SuperTeamActivity