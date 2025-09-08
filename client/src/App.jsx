import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Signup from './pages/Signup';
import Login from './pages/Login';
import FounderDashboard from './pages/FounderDashboard';
import InvestorDashboard from './pages/InvestorDashboard';
import DeckUpload from './pages/DeckUpload';
import DeckView from './pages/DeckView';
import ProtectedRoute from './components/ProtectedRoute';

export default function App(){
  return (
    <div>
      <Navbar />
      <div className="container py-4">
        <Routes>
          <Route path="/" element={<Landing/>} />
          <Route path="/signup" element={<Signup/>} />
          <Route path="/login" element={<Login/>} />

          <Route path="/founder" element={<ProtectedRoute role="founder"><FounderDashboard/></ProtectedRoute>} />
          <Route path="/founder/upload" element={<ProtectedRoute role="founder"><DeckUpload/></ProtectedRoute>} />

          <Route path="/investor" element={<ProtectedRoute role="investor"><InvestorDashboard/></ProtectedRoute>} />
          <Route path="/deck/:id" element={<ProtectedRoute><DeckView/></ProtectedRoute>} />
        </Routes>
      </div>
    </div>
  );
}
