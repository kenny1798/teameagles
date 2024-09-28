import React, { useState } from 'react'

function CreateLead() {

const [tab1,setTab1] = useState("nav-link");
const [tab2,setTab2] = useState("nav-link active");

const clickTab1 = () => {
  setTab1("nav-link active")
  setTab2("nav-link")
}

const clickTab2 = () => {
  setTab1("nav-link")
  setTab2("nav-link active")
}


  return (
    <div className='App'>
    <div className="container mt-3">
      <div className="row justify-content-center text-center">
        <div className="col-lg-12">
        <h1 className="mt-4 header-title">M-SMART</h1>
        <p style={{fontSize:"1rem"}}>No more 1000 files on your desk and desktop. Say hello to M-Smart 😎</p>
        </div>
        <div className='row justify-content-center my-2'>
    <div className='col-md-8'>
  <div class="alert alert-success text-center" role="alert">
        </div><div class="alert alert-danger text-center" role="alert">
        </div>
  <div className='card'>
  <div className='row justify-content-center mb-5'>
    <div className="col-md-12">

    <ul class="nav nav-tabs">
  <li class="nav-item">
    <button onClick={clickTab1} className={tab1}>Single</button>
  </li>
  <li class="nav-item">
    <button onClick={clickTab2} className={tab2}>Bulk</button>
  </li>
</ul>
      <div className='row g-3 my-3 justify-content-center'>
  <div className="col-lg-8">
  </div>
  </div>
  
  <div className='container'>
  <div className='row justify-content-center text-start'>
  <div className='col-lg-8'>
    {tab1 === 'nav-link active' ? (<div><label><strong>Name</strong></label>
          <input type="text" class="form-control" id="exampleFormControlInput1" placeholder="name@example.com" />

          <label className='mt-4'><strong>Phone Number</strong></label>
          <input type="text" class="form-control" id="exampleFormControlInput1" placeholder="name@example.com" />

          <div className="d-grid my-3 gap-2">
          <button className='btn btn-primary mt-5'>Add Database</button>
          </div></div>) : tab2 === 'nav-link active' ? (<div><label><strong>Upload Excel File</strong></label>
          <input class="form-control mb-3" type="file" id="formFile" />

          <a href='#'> Click here to get file template </a>

          <div className="d-grid my-3 gap-2">
          <button className='btn btn-primary mt-5'>Add Form</button>
          </div>  </div>) : (<></>)}
          

          
  </div>
  </div>
  </div>
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

export default CreateLead