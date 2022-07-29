import React from "react";
import { Link } from "react-router-dom";
function Landing() {
  return (
    <div className="landing--container">
      <div className="client-carer-container">
        <Link to="/clients" className="carer--module course--link landing">
          Clients
        </Link>
        <Link to="/carers" className="carer--module course--link landing">
          Carers
        </Link>
      </div>
      <div className="performance-metrics-container">
        <Link
          to="/annualmetrics"
          className="carer--module course--link landing"
        >
          Performance Metrics
        </Link>
      </div>
    </div>
  );
}

export default Landing;
