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

function MonthlyBarMetric({ carer, metrics, fiteredRating, date }) {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

  const options = {
    indexAxis: "y",
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    responsive: true,
    plugins: {
      legend: {
        position: "right",
      },
      title: {
        display: true,
        text: ` Performance for ${carer.forename} ${carer.surname} on ${date}`,
      },
    },
  };

  const labels = [...metrics.map((metric) => metric.performanceMetric)];

  // give each carer a unique dark color
  const color = `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(
    Math.random() * 255
  )}, ${Math.floor(Math.random() * 255)})`;

  const data = {
    labels,
    datasets: [
      {
        label: `${carer.forename} ${carer.forename}${carer.surname}`,
        data: fiteredRating,
        borderColor: color,
        backgroundColor: color,
      },
    ],
  };
  return <Bar options={options} data={data} />;
}

export default MonthlyBarMetric;
