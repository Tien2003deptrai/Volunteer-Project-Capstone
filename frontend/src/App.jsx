import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './components/Home'
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import AdminOrganizations from './components/admin/Organizations'
import AdminDuties from './components/admin/AdminDuties'
import Applicants from './components/admin/Applicants'
import ProtectedRoute from './components/admin/ProtectedRoute'
import Dashboard from './components/admin/Dashboard'
import AdminUsers from './components/admin/AdminUsers'
import AdminPosts from './components/admin/AdminPosts'
import AdminGroups from './components/admin/AdminGroups'
import AdminReports from './components/admin/AdminReports'
import Duties from './components/Duties'
import Browse from './components/Browse'
import DutyDescription from './components/DutyDescription'
import Profile from './components/Profile'
import UpcomingEvents from './components/UpcomingEvents'
import Messages from './components/Messages'
import About from './components/About'
import CommunityGallery from './components/CommunityGallery'
import Friends from './components/Friends'

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/duties' element={<Duties />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/upcoming" element={<UpcomingEvents />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/about" element={<About />} />
          <Route path="/gallery" element={<CommunityGallery />} />
          <Route path="/description/:id" element={<DutyDescription />} />
          <Route path="/friends" element={<Friends />} />
          {/* Admin routes */}
          <Route path="/admin/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute><AdminUsers /></ProtectedRoute>} />
          <Route path="/admin/organizations" element={<ProtectedRoute><AdminOrganizations /></ProtectedRoute>} />
          <Route path="/admin/duties" element={<ProtectedRoute><AdminDuties /></ProtectedRoute>} />
          <Route path="/admin/duties/:id/applicants" element={<ProtectedRoute><Applicants /></ProtectedRoute>} />
          <Route path="/admin/groups" element={<ProtectedRoute><AdminGroups /></ProtectedRoute>} />
          <Route path="/admin/posts" element={<ProtectedRoute><AdminPosts /></ProtectedRoute>} />
          <Route path="/admin/reports" element={<ProtectedRoute><AdminReports /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
