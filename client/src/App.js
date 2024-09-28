//Packages import
import React, {useState} from 'react';
import {useLocation, Navigate } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext';
import { useValidContext } from './hooks/useValidContext';
import { useAdminContext } from './hooks/useAdminContext';
import { CookiesProvider } from 'react-cookie';


//Server
import Home from './pages/Home';
import Login from './pages/Login';
import AccAuth from './pages/AccAuth';
import Signup from './pages/Signup';
import Tools from './pages/Tools';
import Autocopy from './pages/Autocopy';
import ChangeEmail from './pages/ChangeEmail';
import Changepass from './pages/Changepass';
import Resetpass from './pages/Resetpass';
import Forgotpass from './pages/Forgotpass';
import Navbar from './components/Navbar';
import NotFound from './pages/NotFound';
import Footer from './components/Footer';

//Admin
import AdminLogin from './pages/admin/AdminLogin';
import AdminPanel from './pages/admin/AdminPanel';
import AdminUserList from './pages/admin/AdminUserList';
import AdminEditUser from './pages/admin/AdminEditUser';
import AdminMuRegister from './pages/admin/AdminMuRegister';
import AdminManagerRegister from './pages/admin/AdminManagerRegister';

//Msmart
import Msmart from './pages/msmart/Msmart';
import JoinTeam from './pages/msmart/JoinTeam';
import Dashboard from './pages/msmart/Dashboard';
import ManageLeads from './pages/msmart/ManageLeads';
import CreateLead from './pages/msmart/CreateLead';
import SingleLeads from './pages/msmart/SingleLeads';

import JoinAsManager from './pages/msmart/manage/JoinAsManager';
import ManagerDashboard from './pages/msmart/manage/ManagerDashboard';
import ManageTeam from './pages/msmart/manage/ManageTeam';
import TeamActivity from './pages/msmart/manage/TeamActivity';
import SingleTeam from './pages/msmart/manage/SingleTeam';

import CreateTeam from './pages/msmart/manage/supermanager/CreateTeam';
import SuperManageTeam from './pages/msmart/manage/supermanager/SuperManageTeam';
import SuperTeamActivity from './pages/msmart/manage/supermanager/SuperTeamActivity';
import SuperManageManager from './pages/msmart/manage/supermanager/SuperManageManager';


//MU
import Courses from './pages/mu/Courses';
import SingleCourse from './pages/mu/SingleCourse';
import Chapter from './pages/mu/Chapter';
import Lesson from './pages/mu/Lesson';
import Data from './pages/mu/Data';
import CompiledScript from './pages/mu/CompiledScript';
import Autocopyform from './pages/Autocopyform';
import MuMonitor from './pages/mu/MuMonitor';

//MCHAT
// import Mchat from './pages/mchat/Mchat';
// import Mchat_Block from './pages/mchat/Mchat_Block';
// import Mchat_Chat from './pages/mchat/Mchat_Chat';
// import Mchat_Flow from './pages/mchat/Mchat_Flow';
// import Mchat_design from './pages/mchat/Mchat_design';
// import Mchat_SDesign from './pages/mchat/Mchat_SDesign';
// import Mchat_Data from './pages/mchat/Mchat_Data';
// import Mchat_SingleData from './pages/mchat/Mchat_SingleData';
// import Mchat_Link from './pages/mchat/Mchat_Link';


function App() {

  const { user } = useAuthContext();
  const { valid } = useValidContext();
  const { admin } = useAdminContext();
  let location = useLocation();
  const [showNav, setShowNav] = useState(true);
  const [showFoo, setShowFoo] = useState(true);

  if(location.pathname === '/change-password'){
    location = '/'
  }
  

  return (
    <CookiesProvider>
    <div className='app-content'>
      {showNav ? <Navbar /> : null}
      <div className='content-wrapper'>
        <Routes>

          <Route path='/' element={!user ? <Navigate to="/login" state={{from: location}} replace /> : user && !valid ? <Navigate to="/auth" state={{from: location}} replace /> : user && valid && <Home />}/>
          
          <Route path='*' element={<NotFound setNavbar={setShowNav} />} />
          

          <Route path='/login' element={user ? <Navigate to="/" state={{from: location}} replace /> : <Login/>  } />

          <Route path='/signup' element={user ? <Navigate to="/" state={{from: location}} replace /> : <Signup/> } />

          <Route path='/forgot-password' element={user ? <Navigate to="/" state={{from: location}} replace /> : <Forgotpass/> } />

          <Route path='/reset-password/:token' element={user ? <Navigate to="/" state={{from: location}} replace /> : <Resetpass/> } />

          <Route path='/change-email' element={!user ? <Navigate to="/login" state={{from: location}} replace /> : user && valid ? <Navigate to="/" state={{from: location}} replace /> : <ChangeEmail/> } />

          <Route path='/auth' element={!user ? <Navigate to="/login" state={{from: location}} replace /> : user && valid ? <Navigate to="/" state={{from: location}} replace /> : user && !valid && <AccAuth/> } />

          <Route path='/tools' element={!user ? <Navigate to="/login" state={{from: location}} replace /> : user && !valid ? <Navigate to="/auth" state={{from: location}} replace /> : user && valid && <Tools />} />

          <Route path='/mace' element={!user ? <Navigate to="/login" state={{from: location}} replace /> : user && !valid ? <Navigate to="/auth" state={{from: location}} replace /> : user && valid && <Autocopy />} />

          <Route path='/mace/access' element={!user ? <Navigate to="/login" state={{from: location}} replace /> : user && !valid ? <Navigate to="/auth" state={{from: location}} replace /> : user && valid && <Autocopyform />} />

          <Route path='/change-password' element={!user ? <Navigate to="/login" state={{from: location}} replace /> : user && !valid ? <Navigate to="/auth" state={{from: location}} replace /> : user && valid && <Changepass />} />


          <Route path='/msmart' element={!user ? <Navigate to="/login" state={{from: location}} replace /> : user && !valid ? <Navigate to="/auth" state={{from: location}} replace /> : user && valid && <Msmart />} />

          <Route path='/msmart/team/join' element={!user ? <Navigate to="/login" state={{from: location}} replace /> : user && !valid ? <Navigate to="/auth" state={{from: location}} replace /> : user && valid && <JoinTeam />} />

          <Route path='/msmart/dashboard/:teamId' element={!user ? <Navigate to="/login" state={{from: location}} replace /> : user && !valid ? <Navigate to="/auth" state={{from: location}} replace /> : user && valid && <Dashboard />} />

          <Route path='/msmart/db/create/:teamId' element={!user ? <Navigate to="/login" state={{from: location}} replace /> : user && !valid ? <Navigate to="/auth" state={{from: location}} replace /> : user && valid && <CreateLead />} />

          <Route path='/msmart/db/manage/:teamId' element={!user ? <Navigate to="/login" state={{from: location}} replace /> : user && !valid ? <Navigate to="/auth" state={{from: location}} replace /> : user && valid && <ManageLeads />} />
          
          <Route path='/msmart/db/manage/:teamId/:id' element={!user ? <Navigate to="/login" state={{from: location}} replace /> : user && !valid ? <Navigate to="/auth" state={{from: location}} replace /> : user && valid && <SingleLeads />} />


          <Route path='/msmart/team/join/manager' element={!user ? <Navigate to="/login" state={{from: location}} replace /> : user && !valid ? <Navigate to="/auth" state={{from: location}} replace /> : user && valid && <JoinAsManager />} />

          <Route path='/msmart/team/dashboard/:teamId' element={!user ? <Navigate to="/login" state={{from: location}} replace /> : user && !valid ? <Navigate to="/auth" state={{from: location}} replace /> : user && valid && <ManagerDashboard />} />

          <Route path='/msmart/team/manage/:teamId' element={!user ? <Navigate to="/login" state={{from: location}} replace /> : user && !valid ? <Navigate to="/auth" state={{from: location}} replace /> : user && valid && <ManageTeam />} />
          
          <Route path='/msmart/team/activity/:teamId' element={!user ? <Navigate to="/login" state={{from: location}} replace /> : user && !valid ? <Navigate to="/auth" state={{from: location}} replace /> : user && valid && <TeamActivity />} />

          <Route path='/msmart/team/manage/:teamId/:username' element={!user ? <Navigate to="/login" state={{from: location}} replace /> : user && !valid ? <Navigate to="/auth" state={{from: location}} replace /> : user && valid && <SingleTeam />} />


          <Route path='/msmart/team/create' element={!user ? <Navigate to="/login" state={{from: location}} replace /> : user && !valid ? <Navigate to="/auth" state={{from: location}} replace /> : user && valid && <CreateTeam />} />

          <Route path='/msmart/team/admin/member/:teamId' element={!user ? <Navigate to="/login" state={{from: location}} replace /> : user && !valid ? <Navigate to="/auth" state={{from: location}} replace /> : user && valid && <SuperManageTeam />} />

          <Route path='/msmart/team/admin/manager/:teamId' element={!user ? <Navigate to="/login" state={{from: location}} replace /> : user && !valid ? <Navigate to="/auth" state={{from: location}} replace /> : user && valid && <SuperManageManager />} />
          
          <Route path='/msmart/team/admin/activity/:teamId' element={!user ? <Navigate to="/login" state={{from: location}} replace /> : user && !valid ? <Navigate to="/auth" state={{from: location}} replace /> : user && valid && <SuperTeamActivity />} />


          <Route path='/courses' element={!user ? <Navigate to="/login" state={{from: location}} replace /> : user && !valid ? <Navigate to="/auth" state={{from: location}} replace /> : user && valid && <Courses />} />

          <Route path='/courses/manage' element={!user ? <Navigate to="/login" state={{from: location}} replace /> : user && !valid ? <Navigate to="/auth" state={{from: location}} replace /> : user && valid && <MuMonitor />} />
          
          <Route path='/courses/:course' element={!user ? <Navigate to="/login" state={{from: location}} replace /> : user && !valid ? <Navigate to="/auth" state={{from: location}} replace /> : user && valid && <SingleCourse />} />

          <Route path='/courses/:course/script' element={!user ? <Navigate to="/login" state={{from: location}} replace /> : user && !valid ? <Navigate to="/auth" state={{from: location}} replace /> : user && valid && <CompiledScript />} />

          <Route path='/courses/:course/:chapter' element={!user ? <Navigate to="/login" state={{from: location}} replace /> : user && !valid ? <Navigate to="/auth" state={{from: location}} replace /> : user && valid && <Chapter />} />

          <Route path='/courses/:course/:chapter/:lesson' element={!user ? <Navigate to="/login" state={{from: location}} replace /> : user && !valid ? <Navigate to="/auth" state={{from: location}} replace /> : user && valid && <Lesson />} />



          {/* <Route path='/mbot' element={!user ? <Navigate to="/login" state={{from: location}} replace /> : user && !valid ? <Navigate to="/auth" state={{from: location}} replace /> : user && valid && <Mbot />}/>

          <Route path='/mbot/auth' element={!user ? <Navigate to="/login" state={{from: location}} replace /> : user && !valid ? <Navigate to="/auth" state={{from: location}} replace /> : user && valid && <MbotAuth />}/>

          <Route path='/mbot/flow' element={!user ? <Navigate to="/login" state={{from: location}} replace /> : user && !valid ? <Navigate to="/auth" state={{from: location}} replace /> : user && valid && <MbotFlow />}/>

          <Route path='/mbot/campaign' element={!user ? <Navigate to="/login" state={{from: location}} replace /> : user && !valid ? <Navigate to="/auth" state={{from: location}} replace /> : user && valid && <MbotCampaign />}/>

          <Route path='/mbot/flow/:id' element={!user ? <Navigate to="/login" state={{from: location}} replace /> : user && !valid ? <Navigate to="/auth" state={{from: location}} replace /> : user && valid && <MbotCreateBlock />}/>

          <Route path='/mbot/create/flow' element={!user ? <Navigate to="/login" state={{from: location}} replace /> : user && !valid ? <Navigate to="/auth" state={{from: location}} replace /> : user && valid && <MbotCreateFlow />}/>

          <Route path='/mbot/create/campaign' element={!user ? <Navigate to="/login" state={{from: location}} replace /> : user && !valid ? <Navigate to="/auth" state={{from: location}} replace /> : user && valid && <MbotCreateCampaign />}/> */}


          
          {/* <Route path='/chat/:link/:chatId' element={<Mchat_Link setNavbar={setShowNav} setFoo={setShowFoo} />} />

          <Route path='/mchat' element={!user ? <Navigate to="/login" state={{from: location}} replace /> : user && !valid ? <Navigate to="/auth" state={{from: location}} replace /> : user && valid && <Mchat />} />

          <Route path='/mchat/chat' element={!user ? <Navigate to="/login" state={{from: location}} replace /> : user && !valid ? <Navigate to="/auth" state={{from: location}} replace /> : user && valid && <Mchat_Chat />} />

          <Route path='/mchat/chat/design' element={!user ? <Navigate to="/login" state={{from: location}} replace /> : user && !valid ? <Navigate to="/auth" state={{from: location}} replace /> : user && valid && <Mchat_design />} />

          <Route path='/mchat/chat/design/:id' element={!user ? <Navigate to="/login" state={{from: location}} replace /> : user && !valid ? <Navigate to="/auth" state={{from: location}} replace /> : user && valid && <Mchat_SDesign />} />

          <Route path='/mchat/chat/data' element={!user ? <Navigate to="/login" state={{from: location}} replace /> : user && !valid ? <Navigate to="/auth" state={{from: location}} replace /> : user && valid && <Mchat_Data />} />

          <Route path='/mchat/chat/data/:id' element={!user ? <Navigate to="/login" state={{from: location}} replace /> : user && !valid ? <Navigate to="/auth" state={{from: location}} replace /> : user && valid && <Mchat_SingleData />} />

          <Route path='/mchat/chat/:id' element={!user ? <Navigate to="/login" state={{from: location}} replace /> : user && !valid ? <Navigate to="/auth" state={{from: location}} replace /> : user && valid && <Mchat_Flow />} />

          <Route path='/mchat/chat/flow/:id' element={!user ? <Navigate to="/login" state={{from: location}} replace /> : user && !valid ? <Navigate to="/auth" state={{from: location}} replace /> : user && valid && <Mchat_Block />} /> */}



          <Route path='/admin/login' element={admin ? <Navigate to="/admin/" state={{from: location}} replace /> : <AdminLogin setNavbar={setShowNav} />} />

          <Route path='/admin/' element={!admin ? <Navigate to="/admin/login" state={{from: location}} replace /> : <AdminPanel setNavbar={setShowNav} />}  />
          
          <Route path='/admin/users' element={!admin ? <Navigate to="/admin/login" state={{from: location}} replace /> : <AdminUserList setNavbar={setShowNav} />} />

          <Route path='/admin/users/edit/:user' element={!admin ? <Navigate to="/admin/login" state={{from: location}} replace /> : <AdminEditUser setNavbar={setShowNav} />} />

          <Route path='/admin/register/mu' element={!admin ? <Navigate to="/admin/login" state={{from: location}} replace /> : <AdminMuRegister setNavbar={setShowNav} />} />

          <Route path='/admin/register/manager' element={!admin ? <Navigate to="/admin/login" state={{from: location}} replace /> : <AdminManagerRegister setNavbar={setShowNav} />} />

          <Route path='/admin/mu/data/:course' element={!admin ? <Navigate to="/admin/login" state={{from: location}} replace /> : <Data setNavbar={setShowNav} />} />

        </Routes>
        </div>
        {showNav ? <Footer /> : null}
      
        </div>
        </CookiesProvider>
      
  );
}

export default App;
