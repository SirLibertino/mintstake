import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import WHYCommon from './whycommon';
import Dashboard from './dashboard';
import { BrowserRouter as Router, Routes, Route}
    from 'react-router-dom';
import WHYUncommon from './whyuncommon';
import WHYTrip from './whytrip';
import WHYLegendary from './whylegendary';

function App() {
  return (
      <Router>
      <div>
    <nav class="navbar navbarfont navbarglow navbar-expand-md navbar-dark bg-dark">
          <div class="container-fluid">
            <a class="navbar-brand px-3" style={{ fontWeight: "800", fontSize: '25px' }} href="/"><img src="why-logo.png" width="17%" alt="whylogo"/></a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
              <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarCollapse">
              <ul class="navbar-nav me-auto mb-2 mb-md-0" style={{ fontSize: "20px" }}>
              <li class="nav-item">
                  <a class="nav-link active" aria-current="page" href="/">Home</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link active px-4" aria-current="page" href="/whycommon">WHY Common</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link active px-4" aria-current="page" href="/whyuncommon">WHY Uncommon</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link active px-4" aria-current="page" href="/whytrip">WHY Trip</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link active px-4" aria-current="page" href="/whylegendary">WHY Legendary</a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
    </div>
      <Routes>
          <Route exact path='/' exact element={<Dashboard />} />
          <Route path='/whycommon' element={<WHYCommon/>} />
          <Route path='/whyuncommon' element={<WHYUncommon/>} />
          <Route path='/whytrip' element={<WHYTrip/>} />
          <Route path='/whylegendary' element={<WHYLegendary/>} />
      </Routes>
      </Router>
  );
  }

export default App;