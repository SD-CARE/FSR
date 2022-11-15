import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { DailyMetric } from "./DailyMetric";
import { Link, useNavigate } from "react-router-dom";
function PrintDaily() {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const navigate = useNavigate();
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignContent: "center",
          flexWrap: "wrap",
          marginBottom: "20px",
        }}
      >
        <h2>Daily Average Performance Metrics</h2>

        <div
          className="btn-container"
          style={{ margin: "20px 0", display: "flex", flexWrap: "wrap" }}
        >
          <button
            onClick={() => navigate(`/monthlymetrics`)}
            className="button button-primary"
            style={{
              cursor: "pointer",
              maxHeight: "80px",
              fontSize: ".9rem",
            }}
          >
            Monthly Metrics
          </button>
          <button onClick={handlePrint} className="button btn-primary btn">
            Print
          </button>
          <Link to="/" className="button button-secondary ">
            Back
          </Link>
        </div>
      </div>
      <DailyMetric ref={componentRef} />
    </div>
  );
}

export default PrintDaily;
