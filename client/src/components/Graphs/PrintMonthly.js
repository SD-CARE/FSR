import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { MonthlyMetrics } from "./monthlyMetric";
import { Link, useParams } from "react-router-dom";
function PrintMonthly() {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const { id } = useParams();
  return (
    <div>
      <MonthlyMetrics ref={componentRef} />
      <div className="btn-container print-btn">
        <button onClick={handlePrint} className="button btn-primary btn">
          Print
        </button>
        <Link
          to={`/carers/${id}/assessed/select`}
          className="button button-secondary btn"
        >
          Back
        </Link>
      </div>
    </div>
  );
}

export default PrintMonthly;
