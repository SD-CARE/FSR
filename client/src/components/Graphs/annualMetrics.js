import React, { useContext, useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import AnnualBarMetric from "./AnnualBarMetric";
import { Context } from "../../Context";
export const AnnualMetrics = React.forwardRef((props, ref) => {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );
  const [carers, setCarers] = useState([]);
  const { sDData } = useContext(Context);

  // when the component is mounted
  useEffect(() => {
    sDData
      .getCarers()
      .then((carer) => setCarers(carer.carers.map((carer) => carer)));
  }, [sDData]);
  console.log(carers);
  return (
    <div ref={ref} className="wrap">
      <h2>Annual Performance Metrics</h2>
      <div className="months">
        <AnnualBarMetric carers={carers} />
      </div>
    </div>
  );
});
