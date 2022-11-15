import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { MonthlyAve } from "./MonthlyAve";
import { Link, useNavigate } from "react-router-dom";
function MonthlyPrint() {
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
        <h2>Monthly Average Performance Metrics</h2>

        <div
          className="btn-container"
          style={{ margin: "20px 0", display: "flex", flexWrap: "wrap" }}
        >
          <button
            onClick={() => navigate(`/dailymetrics`)}
            className="button button-primary"
            style={{
              cursor: "pointer",
              maxHeight: "80px",
            }}
          >
            Daily Metrics
          </button>
          <button onClick={handlePrint} className="button btn-primary btn">
            Print
          </button>
          <Link to="/" className="button button-secondary ">
            Back
          </Link>
        </div>
      </div>
      <MonthlyAve ref={componentRef} />
    </div>
  );
}

export default MonthlyPrint;
