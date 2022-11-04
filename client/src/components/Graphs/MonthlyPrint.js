import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { MonthlyAve } from "./MonthlyAve";
import { Link } from "react-router-dom";
function MonthlyPrint() {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  return (
    <div>
      <MonthlyAve ref={componentRef} />
      <div className="btn-container print-btn">
        <button onClick={handlePrint} className="button btn-primary btn">
          Print
        </button>
        <Link to="/" className="button button-secondary btn">
          Back
        </Link>
      </div>
    </div>
  );
}

export default MonthlyPrint;
