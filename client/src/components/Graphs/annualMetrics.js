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
import { Line } from "react-chartjs-2";
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
  const optionsLine = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Overall Carers Performance for 2022",
      },
    },
  };

  const labels = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let dataLine = {
    labels,
    datasets: [],
  };
  carers.forEach((carer, i) => {
    // give each carer a unique dark color
    const color = `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(
      Math.random() * 255
    )}, ${Math.floor(Math.random() * 255)})`;

    dataLine.datasets.push({
      label: carer.forename + " " + carer.initials,
      data: labels.map(() => Math.random() * 10),
      borderColor: color,
      backgroundColor: color,
    });
  });

  // Horizontal Bar Chart

  return (
    <div ref={ref} className="wrap">
      <h2>Annual Performance Metrics</h2>
      <Line options={optionsLine} data={dataLine} />
      <div className="months">
        <AnnualBarMetric />
      </div>
    </div>
  );
});
