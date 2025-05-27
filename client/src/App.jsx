import React from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Home from './pages/Home'
import About from './pages/About'
import Profile from './pages/Profile'
import Header from './components/Header'
import ProtectedRoute from './components/ProtectedRoute'
import CreateListing from './pages/CreateListing'

export default function App() {
  return (
    <Router>
      <Header/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route element={<ProtectedRoute/>}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-listing" element={<CreateListing />} />
        </Route>
      </Routes>
    </Router>
  )
}
