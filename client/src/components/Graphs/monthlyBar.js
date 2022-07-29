import React, { useContext } from "react";
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
import { Context } from "../../Context";

function MonthlyBarMetric() {
  const { currentCarer } = useContext(Context);

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
        text: `Overall Performance for ${currentCarer.forename} ${currentCarer.surname} 2022`,
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

  const data = {
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
  return <Bar options={options} data={data} />;
}

export default MonthlyBarMetric;
