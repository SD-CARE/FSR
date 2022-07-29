import React, { forwardRef, useContext } from "react";
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
import { Context } from "../../Context";
import MonthlyBarMetric from "./monthlyBar";
export const MonthlyMetrics = forwardRef((props, ref) => {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

  const { currentCarer } = useContext(Context);
  const optionsLine = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `Overall Performance Metrics for ${currentCarer.forename} ${currentCarer.surname} 2022`,
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

  // give each carer a unique dark color
  const color = `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(
    Math.random() * 255
  )}, ${Math.floor(Math.random() * 255)})`;

  const dataLine = {
    labels,
    datasets: [
      {
        label: `${currentCarer.forename} ${currentCarer.forename[0]}${currentCarer.surname[0]}`,
        data: labels.map(() => Math.random() * 10),
        borderColor: color,
        backgroundColor: color,
      },
    ],
  };

  // Horizontal Bar Chart

  return (
    <div ref={ref} className="wrap">
      <h2>Annual Performance Metrics</h2>
      <MonthlyBarMetric />
      <Line options={optionsLine} data={dataLine} />
    </div>
  );
});
