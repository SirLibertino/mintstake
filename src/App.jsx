import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import WHYCommon from "./whycommon";
import Dashboard from "./dashboard";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import WHYUncommon from "./whyuncommon";
import WHYTrip from "./whytrip";
import WHYLegendary from "./whylegendary";

function App() {
  return (
      <Router basename="/">
        <div>
          <nav class="navbar navapp gotham navbarglow navbar-expand-md navbar-dark">
            <div class="container-fluid">
            <Link to="/">
              <a
                class="navbar-brand px-3"
              >
                <img src="why-logo.png" width="11%" alt="whylogo" />
              </a>
              </Link>
              <button
                class="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarCollapse"
                aria-controls="navbarCollapse"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span class="navbar-toggler-icon"></span>
              </button>
              <div class="collapse navbar-collapse" id="navbarCollapse">
                <ul
                  class="navbar-nav me-auto gotham mb-2 mb-md-0"
                  style={{ fontSize: "20px" }}
                ><Link to="/">
                    <a class="nav-link active" aria-current="page">
                      Home
                    </a>
                  </Link>
                  <Link to="/whycommon">
                    <a
                      class="nav-link active px-4"
                      aria-current="page"
                    >
                      WHY Common
                    </a>
                    </Link>
                    <Link to="/whyuncommon">
                    <a
                      class="nav-link active px-4"
                      aria-current="page"
                    >
                      WHY Uncommon
                    </a>
                    </Link>
                    <Link to="/whytrip">
                    <a
                      class="nav-link active px-4"
                      aria-current="page"
                    >
                      WHY Trip
                    </a>
                    </Link>
                    <Link to="/whylegendary">
                    <a
                      class="nav-link active px-4"
                      aria-current="page"
                    >
                      WHY Legendary
                    </a>
                    </Link>
                </ul>
              </div>
            </div>
          </nav>
        </div>
        <Routes>
          <Route exact path="/" element={<Dashboard />} />
          <Route path="/whycommon" element={<WHYCommon />} />
          <Route path="/whyuncommon" element={<WHYUncommon />} />
          <Route path="/whytrip" element={<WHYTrip />} />
          <Route path="/whylegendary" element={<WHYLegendary />} />
        </Routes>
      </Router>
  );
}

export default App;
