import React, { useEffect, useRef, useState } from "react";
import axios, { muAxios } from "../../api/axios";
import { useAuthContext } from "../../hooks/useAuthContext";
import { Link, useNavigate } from "react-router-dom";

function Courses() {

  const {user} = useAuthContext();
  const [courses,setCourses] = useState([]);
  const [errMsg,setErrMsg] = useState("");
  const [progress,setProgress] = useState([]);
  const [manager, setManager] = useState(false)
  const nav = useNavigate();

  useEffect(() => {
    axios.get('/api/user/check/ismanager', {headers: {
      accessToken: user.token
    }}).then((response) => {
      response.status === 200 && setManager(true)
    })
    
  }, [user.token])
  

  useEffect(() => {
    muAxios.get('/api/mu/get/courses', {headers: {
      accessToken: user.token
    }}).then((response) => {
      if(response.data){
        setCourses(response.data)
      }else{
        setErrMsg("Cannot access courses at this moment. Please try again later.")
      }
    })
  }, [])

  useEffect(() => {
    muAxios.get(`/api/mu/get/progress`, {headers: {
        accessToken: user.token
    }}).then((response) => {
        const json = response.data
        if(json){
            setProgress(json.progress)
        }
    })
}, []);


console.log(manager)

const test = progress[0];

  return (
    <div className="App">
      <div className="container-fluid mt-3">
        <div className="row justify-content-center text-center">
          <div className="col-lg-8">
            <h1 className="mt-4 header-title">EAGLES TRAINING CENTRE</h1>
            <p className="mb-5" style={{fontSize:"1rem"}}>“Wisdom is not a product of schooling but of the lifelong attempt to acquire it.” — <b>Albert Einstein</b></p>

              {errMsg ? (<>
                <div class="alert alert-danger" role="alert">
                  {errMsg}
                </div>
              </>): (<></>)}

              {manager === true && (<div className="alert alert-info"> <p>Team Training Monitoring: </p><Link to={'/courses/manage'} className="btn btn-sm btn-dark">Monitor Here</Link></div>)}



          {courses.map((val,i) => {
            let thisButton = 1;
            let thisProgress = 0;
            const toCourse = `/courses/${val.shortlink}`;
            const logo = process.env.REACT_APP_MU + val.logoFile
            const shortlink = val.shortlink;

            const registerCourse = (course) => {
              muAxios.get(`/api/mu/register/${course}`, {headers: {
                accessToken: user.token
              }}).then((response) => {
                if(response.data.succ){
                  window.location.reload();
                }else if(response.data.err){
                  setErrMsg(response.data.err);
                }
                else{
                  setErrMsg("Failed to register to course. Please try again");
                  const delay = () => {
                    setErrMsg("");
                  }
                  setTimeout(delay, 3000)
                }
              }).catch((err) => {
                setErrMsg("Failed to register to course. Please try again");
                const delay = () => {
                  setErrMsg("");
                }
                setTimeout(delay, 3000)
              })
            }

            return (
              <div class="card my-3">
              <div class="row">
  
                <div class="col-md-4 d-flex justify-content-center align-items-center">
                  <img src={logo} width="300" class="img-fluid rounded-start my-2" alt={shortlink} />
                </div>
                <div class="col-md-8 d-flex justify-content-center align-items-center">
                  <div class="card-body">
                    <h5 class="card-title">{val.courseName}</h5>
                    <p style={{marginTop:'25px', textAlign:'justify'}}>
                      {val.description}
                    </p>
                    <div className="d-grid gap-2">
                      {progress.map((val,i) => {
                        if(val.shortlink === shortlink){
                          thisProgress = 1
                        }
                      })}
                      {thisButton === 1 ? (<>{thisProgress === 1 ? (<Link className="btn btn-primary mt-3" to={toCourse}>View Chapters</Link>) : thisProgress === 0 ? (<button className="btn btn-success mt-3" onClick={() => {registerCourse(val.shortlink)}}>Enroll Now</button>) : (<></>)}</>) : (<></>)}
                      
                      
                      
                     
                      </div>
                     
              
                  </div>
 
                </div>
                
              </div>
            </div>
            )
          })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Courses;
