import React, { useEffect, useState } from 'react'
import { useAuthContext } from '../../hooks/useAuthContext';
import axios, { msmartAxios } from '../../api/axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import countries from '../../components/country';
import Select from 'react-select';

function ManageLeads() {

  const {user} = useAuthContext();
  const {teamId} = useParams();
  const [dbData, setDbData] = useState([]);
  const [error, setError] = useState("");
  const [createError, setCreateError] = useState("");
  const [editError, setEditError] = useState("");
  const [search, setSearch] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [editDBId, setEditDBId] = useState(0);
  const [deleteDbId, setDeleteDbId] = useState(0);
  const navigate = useNavigate();
  const [filteredData, setFilteredData] = useState([]);
  const [filterKey, setFilterKey] = useState('phone');
  const [filterValue, setFilterValue] = useState('');
  const [test, setTest] = useState([]);

  


  //create
  const [createName, setCreateName] = useState("");
  const [createCountry, setCreateCountry] = useState("");
  const [createMobile, setCreateMobile] = useState("");
  const [createStatus, setCreateStatus] = useState("");
  const [createRemarks, setCreateRemarks] = useState("");
  const [createFollowUp, setCreateFollowUp] = useState("");

  //edit
  const [editId, setEditId] = useState("");
  const [editName, setEditName] = useState("");
  const [editCountry, setEditCountry] = useState("");
  const [editMobile, setEditMobile] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [editRemarks, setEditRemarks] = useState("");
  const [editFollowUp, setEditFollowUp] = useState("");

  const options = countries.map(country => ({
    value: country.dialCode,
    label: (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img src={country.flag} alt={country.name} style={{ width: '20px', marginRight: '5px' }} />
        {country.isoCode}
      </div>
    ),
    name: country.name,
    isoCode: country.isoCode,
  }));

  const filterOption = (option, inputValue) => {
    return (
      option.data.name.toLowerCase().includes(inputValue.toLowerCase()) || // Carian ikut nama
      option.data.isoCode.toLowerCase().includes(inputValue.toLowerCase()) // Carian ikut kod ISO
    );
  };

  useEffect(() => {
    if (editCountry) {
      const selectedCountry = options.find(option => option.value === editCountry);
      if (selectedCountry) {
        setEditCountry(selectedCountry);
      }
    }
  }, [editCountry]);

  useEffect(() => {
    msmartAxios.get(`/api/msmart/leads/all/${teamId}`, {
      headers: {
        accessToken: user.token
      }
    }).then((response) => {
      const resdata = response.data;
      if (resdata.error) {
        setError(resdata.error);
      } else {
        setDbData(resdata);
      }
    }).catch((err) => {
      setError("Error fetching data");
    });
  }, [teamId, user.token]);

  useEffect(() => {
    if (filterValue) {
      const filtered = dbData.filter(item => item[filterKey]?.toString().toLowerCase().includes(filterValue.toLowerCase()));
      setFilteredData(filtered);
    } else {
      setFilteredData(dbData);
    }
  }, [filterKey, filterValue, dbData]);


  const handleChange = (option) => {
    setEditCountry(option); // Kemaskini state dengan pilihan baru
  };

  const handleCreateChange = (option) => {
    setCreateCountry(option.value); // Kemaskini state dengan pilihan baru
  };


  const createDb = (e) => {
    e.preventDefault()
    const data = {team:teamId, name: createName, country: createCountry, phone: createMobile, status: createStatus, remarks: createRemarks, followUp: createFollowUp}
    msmartAxios.post(`/api/msmart/lead`, data, {headers: {
      accessToken:user.token
    }}).then((response) => {
      if(response.data.status){
        window.location.reload()
      }
      if(response.data.error){
        setCreateError(response.data.error)
      }
    }).catch((err) => {
      setEditError("No response from server, please try again")
    })
  }


  const deleteDB = (e) => {
    e.preventDefault();
    msmartAxios.delete(`/api/msmart/lead/${deleteDbId}`, {headers: {
      accessToken: user.token
    }}).then((response) => {
      if(response.data.succ){
        document.getElementById('deleteConfirm').click();
        window.location.reload();
      }else{
        document.getElementById('deleteConfirm').click();
        setError("Unable to delete database");
        const delay = () => {
          setError("");
        }
        setTimeout(delay, 2000)
      }
    })
  }

  const cancelDelete = () => {
    setDeleteDbId(0);
  }

  const editSingle = (id) => {
    msmartAxios.get(`/api/msmart/lead/${id}`, {headers: {
      accessToken: user.token
    }}).then((response) => {
      const json = response.data.db
      if(json){
        console.log(json)
        setEditId(json.id);
        setEditName(json.name);
        setEditMobile(json.phone);
        setEditCountry(json.country);
        setEditStatus(json.status);
        setEditRemarks(json.remark);
        setEditFollowUp(new Date(json.followUpDate.toString()));
      }
    }).catch((err) => {
      setEditError("No response from server, please try again")
    })
  }
  

  const submitEdit = (e) => {
    e.preventDefault();
    const data = {name: editName, country: editCountry.value, phone: editMobile, status: editStatus, remark: editRemarks, followUp: editFollowUp}
    msmartAxios.put(`/api/msmart/lead/${teamId}/${editId}`, data, {headers: {
      accessToken: user.token
    }}).then((response) => {
      if(response.data.error){
        setEditError(response.data.error);
      }else if(response.data.success){
        window.location.reload()
      }
    }).catch((err) => {
      setEditError("No response from server, please try again")
    })
  }

  console.log(typeof editFollowUp)


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
            <div class="alert alert-danger text-center" role="alert">
              {error}
            </div>)}
            
           
            
            <div className='text-end mx-1'><button className='btn btn-sm btn-success' data-bs-toggle="modal" data-bs-target="#createDB">+New Database</button></div>
            <div className="row">
              <div className="col-3">
              <select className='form-control shadow-none my-3' onClick={(e) => setFilterValue('')}  onChange={(e) => {setFilterKey(e.target.value)}}>
                <option value='phone'>Phone Number</option>
                <option value='name'>Name</option>
                <option value='status'>Status</option>
                <option value='followUpDate'>Follow Up Date</option>
              </select>
              </div>
              {filterKey === 'status' ? (<>
               <div className="col">
               <select className='form-control shadow-none my-3' onChange={(e) => setFilterValue(e.target.value)}>
               <option value=''>All</option>
                <option style={{color:'#b00202'}} value="Rejected">Rejected</option>
                <option style={{color:'#b89404'}} value="Booking">Booking</option>
                <option style={{color:'#238204'}} value="Closed">Closed</option>
              </select>
               </div>
              </>) : filterKey === 'followUpDate' ? (<>
              <div className="col">
                <input className='form-control shadow-none my-3' type='date'  value={filterValue} onChange={(e) => setFilterValue(e.target.value)} />
              </div>
              </>) : (<>
              <div className="col">
              <input className='form-control shadow-none my-3' type='text'  value={filterValue} onChange={(e) => setFilterValue(e.target.value)} />
              </div>
              </>) }
              
            </div>
            
            
              
                <div className='card'>
                  <div className='table-responsive'>
                  <table class="table table-hover">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">Phone No.</th>
                        <th scope="col">Status</th>
                        <th scope="col"></th>
                      </tr>
                    </thead>
                    {filteredData.map((value, key) => {

                      let bgColour;

                      if(value.status === 'Rejected'){
                        bgColour = '#ff6363'
                      }else if(value.status === 'Booking'){
                        bgColour = '#ffd863'
                      }else if(value.status === 'Closed'){
                        bgColour = '#87ff63'
                      }else{
                        bgColour = 'ffffff'
                      }
                      

                      return(
                        <tbody style={{backgroundColor: bgColour}}>
                      <tr>
                        <th scope="row">{key+1}</th>
                        <td>{value.name}</td>
                        <td>{value.country}{value.phone}</td>
                        <td>{value.status}</td>
                        <td >
                          <div className='d-flex gap-2 justify-content-center'><a className='btn btn-sm btn-success' href={`https://api.whatsapp.com/send?phone=${value.country + value.phone}`}><i class="bi bi-whatsapp"></i></a> <button className='btn btn-sm btn-light' onClick={() => {editSingle(value.id)}} data-bs-toggle="modal" data-bs-target="#EditDB"><i class="bi bi-pencil-fill"></i></button> <button className='btn btn-sm btn-light' onClick={() => {setDeleteDbId(value.id)}} data-bs-toggle="modal" data-bs-target="#deleteDB">X</button></div></td>
                      </tr>
                    </tbody>
                      )
                    })}
                    
                  </table>
                  </div>
                </div>


<div class="modal fade" id="deleteDB" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content yellow-100" >
      <div class="modal-header">
        <button type="button" class="btn-close" id='deleteConfirm' onClick={cancelDelete} data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <h5>Are you sure you want to delete this database?</h5>
        <br/>
        <button type="button" class="btn btn-sm btn-secondary mx-1" data-bs-dismiss="modal">Cancel</button>
        <button type="button" class="btn btn-sm btn-danger mx-1" onClick={deleteDB}>Delete</button>
      </div>
    </div>
  </div>
</div>

<div class="modal fade" id="EditDB" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalLabel"><strong>Edit Database</strong></h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">

      {!editError ? (<></>) : (
            <div class="alert alert-danger text-center" role="alert">
              {editError}
            </div>)}

      <form onSubmit={submitEdit}>

      <div class="mb-3 text-start">
        <label className='mx-1'>Name</label>
        <input type="text" class="form-control" value={editName} onChange={(event) => {setEditName(event.target.value)}} required />
      </div>

      <div className='mb-3 text-start'>
      <label className='mx-1'>Phone Number</label>
      <div class="input-group">
      <div class="input-group-text">
      <Select 
        options={options} 
        onChange={handleChange}
        filterOption={filterOption}
        value={editCountry}
        required
      />
      </div>
      <input type="text" class="form-control" value={editMobile} onChange={(event) => {setEditMobile(event.target.value)}} required/>
    </div>
    <span className='mx-2' style={{fontSize: '80%'}}>Phone Number: {editCountry.value + editMobile}</span>
      </div>




      <div class="mb-3 text-start">
        <label className='mx-1'>Status</label>
        <select type="text" class="form-control" onChange={(event) => {setEditStatus(event.target.value)}} required>
          <option value={editStatus}>{editStatus}</option>
          <option style={{color:'#b00202'}} value="Rejected">Rejected</option>
          <option style={{color:'#b89404'}} value="Booking">Booking</option>
          <option style={{color:'#238204'}} value="Closed">Closed</option>
        </select>
      </div>

      <div class="mb-3 text-start">
        <label className='mx-1'>Remarks</label>
        <textarea type="text" class="form-control" value={editRemarks}  onChange={(event) => {setEditRemarks(event.target.value)}} />
      </div>

      <div class="mb-3 text-start">
        <label className='mx-1'>Follow Up Date</label>
        <input type="datetime-local" class="form-control" min={new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0,16)} defaultValue={editFollowUp} onChange={(event) => {setEditFollowUp(event.target.value)}} />
        {editFollowUp < new Date(Date.now()) ? (<></>) : typeof editFollowUp === 'string' ? (<><p>upcoming Follow Up Date: <strong style={{color:'green'}}>{new Date(editFollowUp).toString().substr(4,11)} ({new Date(editFollowUp).toString().substr(16,17)})</strong></p></>) : (<><p>upcoming Follow Up Date: <strong style={{color:'green'}}>{editFollowUp.toString().substr(4,11)} ({editFollowUp.toString().substr(16,17)})</strong></p></>)}
        
      </div>

      <div className='d-flex gap-2 justify-content-center'><button type="submit" class="btn btn-primary mx-5 my-3">Save changes</button></div>
      
      </form>
      </div>
    </div>
  </div>
</div>

<div class="modal fade" id="createDB" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalLabel"><strong>New Database</strong></h1>
        <button id='closeCreate' type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">

      {!createError ? (<></>) : (
            <div class="alert alert-danger text-center" role="alert">
              {createError}
            </div>)}

      <form onSubmit={createDb}>

      <div class="mb-3 text-start">
        <label className='mx-1'>Name</label>
        <input type="text" class="form-control" onChange={(event) => {setCreateName(event.target.value)}} required />
      </div>

      
      <div className='mb-3 text-start'>
      <label className='mx-1'>Phone Number</label>
      <div class="input-group">
      <div class="input-group-text">
      <Select 
        options={options} 
        onChange={handleCreateChange}
        filterOption={filterOption}
        required
      />
      </div>
      <input type="text" class="form-control" onChange={(event) => {setCreateMobile(event.target.value)}} required/>
    </div>
    <span className='mx-2' style={{fontSize: '80%'}}>Phone Number: {createCountry+createMobile}</span>
      </div>

      <div class="mb-3 text-start">
        <label className='mx-1'>Status</label>
        <select type="text" class="form-control"  onChange={(event) => {setCreateStatus(event.target.value)}} required>
          <option value=''></option>
          <option style={{color:'#b00202'}} value="Rejected">Rejected</option>
          <option style={{color:'#b89404'}} value="Booking">Booking</option>
          <option style={{color:'#238204'}} value="Closed">Closed</option>
        </select>
      </div>

      <div class="mb-3 text-start">
        <label className='mx-1'>Remarks</label>
        <textarea type="text" class="form-control"  onChange={(event) => {setCreateRemarks(event.target.value)}} />
      </div>

      <div class="mb-3 text-start">
        <label className='mx-1'>Follow Up Date</label>
        <input type="datetime-local" class="form-control"  onChange={(event) => {setCreateFollowUp(event.target.value)}} />
      </div>

      <div className='d-flex gap-2 justify-content-center'><button type="submit" class="btn btn-primary mx-5 my-3">Add New Database</button></div>
      
      </form>

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

export default ManageLeads