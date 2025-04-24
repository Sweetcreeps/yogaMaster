import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import RequireAuth from './components/RequireAuth';
import RequireAdmin from './components/RequireAdmin';


import Header from './components/Header';
import Footer from './components/Footer';

import Home from './pages/Home';
import Login from './pages/Login';
import Schedule from './pages/Schedule';
import Contact from './pages/Contact';
import Pricing from './pages/Pricing';
import Checkout from './pages/Checkout';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Announcements from './pages/Announcements';
import AdminAnnouncements from './pages/AdminAnnouncements';


export default function App() {
  return(
    <Router>
    <AuthProvider>
      <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
        <Header />

        <main className="flex-grow-1">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/announcements" element={<Announcements />} />1

            {/* Routes requiring login */}
            <Route element={<RequireAuth />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/adminAnnouncements" element={<AdminAnnouncements />} />
            </Route>

            {/* Admin‑only routes */}
            <Route element={<RequireAdmin />}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </AuthProvider>
  </Router>

    


); 
 
}





{/* <div className="App">
        
        <BrowserRouter>
       <div
         className="d-flex flex-column"
         style={{ minHeight: '100vh' }}
       >
         
         <Header />
 
       
         <main className="flex-grow-1">
           <Routes>
             <Route path="/" element={<Home />} />
             <Route path="/login" element={<Login />}/>
             <Route path="/schedule" element={<Schedule />} />
             <Route path="/contact" element={<Contact />} />
             <Route path="/pricing" element={<Pricing />} />
             <Route path="/checkout" element={<Checkout />} />
             <Route path="/signup" element={<Signup />} />
             <Route path="/dashboard" element={<Dashboard />} />
             <Route path="/adminDashboard" element={<AdminDashboard />} />
             
           </Routes>
         </main>
 
       
         <Footer />
       </div>
     </BrowserRouter>
 
     </div>

 */}
