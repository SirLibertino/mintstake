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
      <Router>
        <div>
          <nav class="navbar navapp gotham navbarglow navbar-expand-md navbar-dark">
            <div class="container-fluid">
              <a
                class="navbar-brand px-3"
                href="/"
              >
                <img src="why-logo.png" width="11%" alt="whylogo" />
              </a>
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
                  class="navbar-nav me-auto mb-2 mb-md-0"
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
                  <li class="nav-item">
                    <a
                      class="nav-link active px-4"
                      aria-current="page"
                      href="/whyuncommon"
                    >
                      WHY Uncommon
                    </a>
                  </li>
                  <li class="nav-item">
                    <a
                      class="nav-link active px-4"
                      aria-current="page"
                      href="/whytrip"
                    >
                      WHY Trip
                    </a>
                  </li>
                  <li class="nav-item">
                    <a
                      class="nav-link active px-4"
                      aria-current="page"
                      href="/whylegendary"
                    >
                      WHY Legendary
                    </a>
                  </li>
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
