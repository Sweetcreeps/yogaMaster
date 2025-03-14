import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link, BrowserRouter } from 'react-router-dom';
import Home from './Home';


export default function App() {
  return(
    <div className="App">
        
        <BrowserRouter>

                   
                
            <Routes>
                <Route path="/" element={<Home />}/>
               
            </Routes>
            


        </BrowserRouter>

    </div>

    


);
 
}


