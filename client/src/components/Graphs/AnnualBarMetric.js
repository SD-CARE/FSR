import React, { useState, useEffect } from "react";
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

function AnnualBarMetric({ carers, date, rating }) {
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
      },
    },
  };

  const labels = [date];
  let data = {
    labels,
    datasets: [],
  };
  const color = `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(
    Math.random() * 255
  )}, ${Math.floor(Math.random() * 255)})`;

  carers.forEach((carer, i) => {
    // give each carer a unique dark color

    data.datasets.push({
      label: `${carer.forename} ${carer.initials}`,
      data:
        carer.length > 1
          ? carer.map((care) =>
              rating.filter((rate) => rate.carerID === care.carerID)
            )
          : rating.filter((rate) => rate.carerID === carer.carerID),
      borderColor: color,
      backgroundColor: color,
    });
  });

  return <Bar options={options} data={data} />;
}

export default AnnualBarMetric;
