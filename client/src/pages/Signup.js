import React from 'react';
import RegisterPage from './parts/RegisterPage';

function Signup() {
  return (
    <div className='App'>
    <div className="container mt-3">
      <div className="row justify-content-center">
          <h1 className="my-4 header-title text-center">SIGN UP</h1>
            <div className="col-md-5">
              <RegisterPage/>
            </div>
      </div>
    </div>
    </div>
  )
}

export default Signup