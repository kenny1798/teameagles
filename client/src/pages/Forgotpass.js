import React, { useState } from 'react'
import axios from '../api/axios';


function Forgotpass() {

  const [email, setEmail] = useState('');
  const [colour, setColour] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`/api/user/forgot-password`, { email });
      setMessage(response.data.message);
      response.data.message && setColour('green')
    } catch (error) {
      console.log(error)
      setMessage('Error sending email');
      setColour('red')
    }
  };

  return (
    <div className='App'>
    <div className="container mt-3">
      <div className="row justify-content-center text-center">
        <div className="col-lg-12">
        <h1 className="my-4 header-title">FORGOT PASSWORD</h1>
        </div>
        <div class="row justify-content-center text-start mt-3">
  <div class="col-sm-6">
    <div className='card'>
      <div className='card-body'>
      <form onSubmit={handleSubmit}>
        <input
          className='form-control'
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <div className='d-grid'>
        <button className='btn btn-sm btn-dark mt-2' type="submit">Send Reset Link</button>
        </div>
        
      </form>
      {message && <p className='mt-4' style={{color: colour}}>{message}</p>}
      </div>
    </div>
    </div>
    </div>
    </div>
    </div>
    </div>
  )
}

export default Forgotpass