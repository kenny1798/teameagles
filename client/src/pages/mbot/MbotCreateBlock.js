import React, { useState, useEffect } from 'react';
import axios, { mbotAxios, fileServerAxios } from '../../api/axios';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useNavigate, useParams } from 'react-router-dom';



function MbotCreateBlock() {

  const {id} = useParams();
  const {user} = useAuthContext();
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState("");
  const [flowBlocks, setFlowBlocks] = useState([])
  const [flowName, setFlowName] = useState("");
  const [contentType, setContentType] = useState("Text");
  const [content, setContent] = useState("");
  const [isDelay, setIsDelay] = useState(0);
  const [delayPeriod, setDelayPeriod] = useState(0);
  const [buttonText, setButtonText] = useState("Add Blocks");
  const [showBtn, setShowBtn] = useState(true);
  const [progress, setProgress] = useState(0);
  const [subStatus, setSubStatus] = useState("");
  const [subMessage, setSubMessage ] = useState("");
  const sortedFlow = flowBlocks.sort((a,b) => a.delayPeriod - b.delayPeriod);
  const navigate = useNavigate();

  useEffect(() => {
    mbotAxios.get(`/api/broadcast/get/flow/${id}`, {headers:{
      accessToken: user.token
    }}).then((response) => {
      setFlowBlocks(response.data)
      mbotAxios.get(`/api/broadcast/get/flowname/${id}`, {headers: {
        accessToken: user.token
      }}).then((response) => {
        setFlowName(response.data)
      })
    })
  }, [id, user.token])

  const addBlocks = () => {
    setShowBtn(false);
    setButtonText("Cancel");
  }

  const cancelAdd = () => {
    setShowBtn(true)
    setButtonText("Add Blocks")
  }
  const delayReload = () => {
    window.location.reload();
  }

  const submitBlock = (e) => {
    e.preventDefault();
    const formData = new FormData()
    formData.append('flowName', flowName);
    formData.append('contentType', contentType);
    formData.append('content', content);
    formData.append('isDelay', isDelay);
    formData.append('delayPeriod', delayPeriod);
    fileServerAxios.post('/api/broadcast/create/flow/block', formData, {headers:{
      accessToken:user.token
    }, onUploadProgress: data => {
      setProgress(Math.round(100 * (data.loaded/data.total)))
    }
  }).catch(error => {
    const code = error?.response?.data?.code
    switch(code){
        case "LIMIT_FILE_SIZE":
        setErrMsg("File size cannot exceed 5MB");
        break;
        case "GENERIC_ERROR":
        setErrMsg("Only .jpg, .jpeg, .png and .mp4 files are allowed");
        break;
        case "Total block delay cannot exceed 3600 seconds @ 1 hour":
        setErrMsg("Total block delay of this flow cannot exceed 3600 seconds @ 1 hour");
        break;
      default:
        setErrMsg("Something went wrong")
    }
  }).then((response) => {
    if(response.data.message){
      setErrMsg("")
      setSuccess(response.data.message)
      const showComponents = () => {
      setShowBtn(true)
      setButtonText("Add Blocks")
      }
      setTimeout(showComponents, 2000)
      setTimeout(delayReload, 3000)
      
    }
      
    })
  }
  
  const deleteBlock = (id) => {
    mbotAxios.get(`/api/broadcast/delete/flow/block/${id}`, {headers:{
      accessToken:user.token
    }}).then((response) => {
      if(response.data){
        window.location.reload()
      }
    })
  }
  

  const toggleSchedule = () => {
    if(isDelay === 0){
      setIsDelay(1)
    }else{
      setIsDelay(0)
    }
  }

  const addBold = (e) => {
    e.preventDefault();
    setContent(content + '*Insert 𝗕𝗢𝗟𝗗 text here*')

  }

  const addItalic = (e) => {
    e.preventDefault();
    setContent(content + '_Insert 𝐼𝑇𝐴𝐿𝐼𝐶 text here_')

  }

  const addStrike = (e) => {
    e.preventDefault();
    setContent(content + '~Insert S̶T̶R̶I̶K̶E̶T̶H̶R̶O̶U̶G̶H text here~')

  }

  const addMono = (e) => {
    e.preventDefault();
    setContent(content + '```Insert 𝙼𝙾𝙽𝙾𝚂𝙿𝙰𝙲𝙴 text here```')

  }

  useEffect(() => {
    axios.get('/api/user/mbot/check/subscription', {headers: {
      accessToken: user.token
    }}).then((response) => {
      const json = response.data;
      if(json.Nothing){
        navigate('/mbot')
      }
      else if(json.status){
        setSubStatus(json.status);
        setSubMessage(json.message);
      }else{
        setSubStatus("");
      }
    })
  }, [navigate, user.token])

  return (
    <div className='App'>
    <div className="container mt-3">
      <div className="row justify-content-center text-center">
        <div className="col-lg-12">
        <h1 className="mt-4 header-title">M-BOT</h1>
        <p>WhatsApp Automation</p>
        </div>
        </div>
    <div className='row justify-content-center'>

    {subStatus === "" ? (<></>) 
      : subStatus === "Subscription" ? (<>
      <div className="col-sm-8">
  {sortedFlow.map((value, key) => {

    if(value.contentType === 'Text'){
      var contentValue = `${value.content}`;
      contentValue = contentValue.replace(/(?<![{[?}\]])\*(?!\s)(.+?)\*/g, '<b>$1</b>');
      contentValue = contentValue.replace(/(?<![{[?}\]])_(?!\s)(.+?)_/g, '<i>$1</i>');
      contentValue = contentValue.replace(/(?<![{[?}\]])~(?!\s)(.+?)~/g, '<s>$1</s>');
      contentValue = contentValue.replace(/(?<![{[?}\]])```(?!\s)(.+?)```/g, '<code>$1</code>');

    }

    console.log(contentValue)
    const image = process.env.REACT_APP_FILE_SERVER + value.content;
    return (
      <div className='row justify-content-center'>
      <div className="col-sm-8">
    <div className='card text-center'>
    <div className='mt-2'><strong >Chat {key+1}:</strong></div>
    <div className='justify-content-center'>
    {value.contentType === 'Text' ? (<div className='text-start mx-4 my-4' style={{whiteSpace: 'pre-wrap'}}><span dangerouslySetInnerHTML={{__html: contentValue}}></span></div>) : value.contentType === 'Image' ? (
      <img src={image} alt='content' className='mgen-image-header'/>
    ) : value.contentType === 'Video' && (
  <video width="320" height="240" src={image} controls />
    )}
    </div>
    <div className='card-header'>
    <div className='d-flex justify-content-between'>
      <div className='my-2 mx-2' style={{color: '#454545', fontSize:'0.8rem'}}>
      Delay: {value.delayPeriod} sec
      </div>
      <div><button className='btn btn-sm btn-danger text-end my-2 mx-2' onClick={() => {deleteBlock(value.id)}}>Delete</button></div>
      </div>
      </div>
    </div>
    
    </div>
    </div>
    )
  })}

  {showBtn === true ? (<></>) : (<div className='card'>
  <div className='row justify-content-center'>
    <div className="col-md-8">
    <form encType='multipart/form-data'>
  <div className='container'>
  <div className='row justify-content-center'>

  {subStatus === "" ? (<></>) 
      : subStatus === "Subscription" ? (<>
          </>) 
        : subStatus === "Expired" && (<>
        <div className='row justify-content-center text-center mb-2'>
          <div className='col-lg-6'>
            <div class="alert alert-danger" role="alert">
              {subMessage}
            </div>
          </div>
        </div>
        </>)}


  <div className='col-md-8'>
  {errMsg && (<div class="alert alert-danger text-center mt-4" role="alert">
        {errMsg}
        </div>)}
        {success && (<div class="alert alert-success text-center mt-4" role="alert">
        {success}
        </div>)}
          <label className='mt-4'><strong>Content Type</strong></label>
          <select className='form-control shadow-none' onChange={(event) => {setContentType(event.target.value)}} required>
  <option value="Text">Text</option>
  <option value="Image">Image</option>
  <option value="Video">Video</option>
</select>

          {contentType === 'Text' ? (<><label className='mt-5'><strong>Text Content</strong></label>
          <textarea style={{whiteSpace: 'pre-wrap'}} type="textarea" value={content} className='form-control shadow-none' onChange={(event) => {setContent(event.target.value)}} required maxLength="10000" />
          <button className='btn btn-sm btn-secondary mt-1 mx-1' onClick={addBold} title='Add 𝗕𝗢𝗟𝗗 text'>𝗕</button>
          <button className='btn btn-sm btn-secondary mt-1 mx-1' onClick={addItalic} title='Add 𝐼𝑇𝐴𝐿𝐼𝐶 text'>𝑖&nbsp;</button>
          <button className='btn btn-sm btn-secondary mt-1 mx-1' onClick={addStrike} title='Add S̶T̶R̶I̶K̶E̶T̶H̶R̶O̶U̶G̶H̶T text'>S̶</button>
          <button className='btn btn-sm btn-secondary mt-1 mx-1' onClick={addMono} title='Add MONOSPACE text'>M</button><br/>
          </>) : (<><label className='mt-5'><strong>File Content</strong></label>
          <input type="file" className='form-control shadow-none' onChange={(event) => {setContent(event.target.files[0])}}></input></>)}
          {progress >= 1 ? (<div class="progress my-3">
          <div class="progress-bar" role="progressbar" style={{width:`${progress}%`}} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">{progress}</div>
          </div>) : (<></>) }
          <input type="checkbox" className='mt-5' onClick={toggleSchedule} />
          <label className='mx-5 '>Delay this block</label><br></br>
          {isDelay === 0 ? (<></>) : (<div><label className='mt-5'>Delay Period</label><br/>
          <input type="number" className='form-control shadow-none' max="24" onChange={(event) => {setDelayPeriod(event.target.value)}}/>Sec</div>)}
          
          <div className="d-grid my-3 gap-2">
          {!content || !contentType ? (<button className='btn btn-secondary mt-2'>Create Block</button>) : (<button className='btn btn-primary mt-2' onClick={submitBlock}>Create Block</button>)}
          
          </div>
          
          
  </div>
  </div>
  </div>
</form>
</div>
    </div>
    </div>)}

{showBtn === true ? (<div className="d-grid mx-5 my-3 gap-2">
          <button className='btn btn-lg btn-primary mt-2'onClick={addBlocks}><strong>{buttonText}</strong></button>
          </div>) : (<div className="d-grid mx-5 my-3 gap-2">
          <button className='btn btn-lg btn-danger mt-2'onClick={cancelAdd}><strong>{buttonText}</strong></button>
          </div>)}

  
    </div>
          </>) 
        : subStatus === "Expired" && (<>
        <div className='row justify-content-center text-center mb-2'>
          <div className='col-lg-6'>
            <div class="alert alert-danger" role="alert">
              {subMessage}
            </div>
          </div>
        </div>
        </>)}

    
    </div>
    </div>
    </div>
  )
}

export default MbotCreateBlock
