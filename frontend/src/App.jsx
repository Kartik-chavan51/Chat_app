import { useQuery } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { Navigate, Route, Routes } from 'react-router'
import { axiosInstance } from './lib/axios.js'
import CallPage from './pages/CallPage.jsx'
import ChatPage from './pages/ChatPage.jsx'
import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import NotificationPage from './pages/NotificationPage.jsx'
import OnbordingPage from './pages/OnbordingPage.jsx'
import SignupPage from './pages/SignupPage.jsx'
const App = () => {


  const {data:authData, isLoading,error}=useQuery({
    queryKey:["authUser"],

    queryFn:async()=>{
      const res=await axiosInstance.get("/auth/me");
      return res.data;
    },
    retry:false,
  })

  const authUser=authData?.user;

  
  return (
    <div className=" h-screen text-red p-4" data-theme="winter">
      
      <Routes>
        <Route path="/" element={authUser ? <HomePage/> : <Navigate to="/login"/>}/>
        <Route path="/call" element={authUser ?<CallPage/> : <Navigate to="/login"/>}/>
        <Route path="/chat" element={authUser ?<ChatPage/> : <Navigate to="/login"/>}/>
        <Route path="/login" element={!authUser ?<LoginPage/>  : <Navigate to="/"/>}/>
        <Route path="/notification" element={authUser ?<NotificationPage/> : <Navigate to="/login"/>}/>
        <Route path="/onboarding" element={authUser ? <OnbordingPage/>  : <Navigate to="/login"/>}/>
        <Route path="/signup" element={!authUser ?<SignupPage/> : <Navigate to="/"/>}/>
        
      </Routes>

      <Toaster/>
    </div>
  )
}

export default App
