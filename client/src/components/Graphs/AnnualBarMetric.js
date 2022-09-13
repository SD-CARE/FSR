import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

function AnnualBarMetric({ carers }) {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: true,
        text: "Overall Carers' Performance for 2022",
      },
    },
  };

  const labels = ["January"];

  let data = {
    labels,
    datasets: [],
  };
  carers.forEach((carer, i) => {
    // give each carer a unique dark color
    const color = `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(
      Math.random() * 255
    )}, ${Math.floor(Math.random() * 255)})`;

    data.datasets.push({
      label: carer.forename + " " + carer.initials,
      data: labels.map(() => Math.random() * 10),
      borderColor: color,
      backgroundColor: color,
    });
  });
  return <Bar options={options} data={data} />;
}

export default AnnualBarMetric;
