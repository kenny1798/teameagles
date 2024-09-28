import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import { REGISTER_URL } from '../../api/url';
import { useAuthContext } from '../../hooks/useAuthContext';
import { Link } from 'react-router-dom';

function RegisterPage() {

    const {dispatch} = useAuthContext();
    const [errMsg, setErrMsg] = useState("");
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [manager, setManager] = useState("");
    const [getManager, setGetManager] = useState([]);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [showBtn, setShowBtn] = useState("");

    useEffect(() => {
      axios.get(`/api/user/public/manager`).then((response) => {
        setGetManager(response.data.data)
      })
    }, [])


    const onSubmit = (e) => {
        e.preventDefault();
        setShowBtn("submitted")
        const data = {username: username, name: name, managerId: manager, password: password, confirmPassword: confirmPassword, email: email, phoneNumber: phoneNumber}
        axios.post(REGISTER_URL, data).then ( async (response) =>{
            const json = await response.data;
            if (response.data.error) {
                setErrMsg(response.data.error)
                setShowBtn("")
              }else if (!response.data.token2){
                localStorage.setItem("accessToken", JSON.stringify(json))
                dispatch({type: 'LOGIN', payload: json})
              }else{
                localStorage.setItem("accessToken", JSON.stringify(json))
                dispatch({type: 'LOGIN', payload: json})
              }
        })
    }

  return (
            <div className='mt-3'>

                {errMsg && (<div class="alert alert-danger" role="alert">
                {errMsg}
                </div>)}

                <form onSubmit={onSubmit}>

                  <div className="row">

                    <div className="col">
                      <div className='mb-2'>
                        <label>Name</label>
                        <input type='text' name='name' className="form-control shadow-none" onChange={(event) => {setName(event.target.value)}} required />
                      </div>
                    </div>

                  </div>


                  <div className="row">

                    <div className="col">
                      <div className='mb-3'>
                        <label >LG Code</label>
                        <input type='text' name='username' className="form-control shadow-none" onChange={(event) => {setUsername(event.target.value)}} required />
                      </div>
                    </div>

                    <div className="col">
                      <div className='mb-3'>
                        <label >Manager</label>
                        <select className="form-control shadow-none" name="manager" onChange={(event) => {setManager(event.target.value)}} required >
                          {!manager ? (<option value="">Select Manager..</option>) : (<></>)}           
                          {getManager.map(val => {
                            return(<option value={val.id}>{val.name}</option>)
                          })}
                        </select>
                      </div>
                    </div>

                  </div>

                    <div className='mb-3'>
                    <label >Password</label>
                    <input type='password' name='password' className="form-control shadow-none" onChange={(event) => {setPassword(event.target.value)}} required />
                    </div>

                    <div className='mb-3'>
                    <label >Confirm Password</label>
                    <input type='password' name='confirmPassword' className="form-control shadow-none" onChange={(event) => {setConfirmPassword(event.target.value)}} required />
                    </div>

                    <div className='mb-3'>
                    <label >Email Address</label>
                    <input type='email' name='email' className="form-control shadow-none" onChange={(event) => {setEmail(event.target.value)}} required />
                    </div>

                    <div className='mb-3'>
                    <label >Phone Number</label>
                    <input type='number' name='mobile' className="form-control shadow-none" onChange={(event) => {setPhoneNumber(event.target.value)}} required />
                    </div>

                    {showBtn === "" ? (<>
                    {!username || !name || !manager || !password || !confirmPassword || !email || !phoneNumber ? (<>
                      <div class="d-grid gap-2 mt-5">
                    <button className="btn btn-dark" type="submit" disabled>Register Now</button>
                    </div>
                    </>) : (<>
                    <div class="d-grid gap-2 mt-5">
                    <button className="btn btn-dark" type="submit">Register Now</button>
                    </div>
                    </>)}

                    <p className='my-4 text-center'>Already have an account? | <Link className='link' to='/login'>Sign In Now!</Link></p>

                    </>) : (<></>)}

                    
                    
                </form>
            </div>
  )
}

export default RegisterPage