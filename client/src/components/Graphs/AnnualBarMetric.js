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

  const color = `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(
    Math.random() * 255
  )}, ${Math.floor(Math.random() * 255)})`;

  const labels = [new Date(date)];
  let data = {
    labels,
    datasets: [],
  };

  let filteredRating = [];
  let manyCarersRating = [];
  let maxValue = 12;
  // console.log(delta);
  if (rating !== null && rating !== undefined && rating.length > maxValue) {
    while (rating.length) {
      manyCarersRating.push(rating.splice(0, maxValue));
    }
  } else if (
    rating !== null &&
    rating !== undefined &&
    rating.length <= maxValue
  ) {
    filteredRating.push(
      Math.floor(rating.reduce((acc, arr) => acc + arr) / 12)
    );
  }
  // const manyCarersRatingNoDuplicates = [...new Set(manyCarersRating)];
  let reducedRate = [];
  manyCarersRating.map((rate) => {
    rate !== undefined && rate !== null
      ? reducedRate.push(
          Math.floor(rate.reduce((acc, val) => acc + val) / maxValue)
        )
      : (reducedRate = []);
  });

  carers.length > 1
    ? carers.map((carer, i) => {
        // give each carer a unique dark color
        // reduce the rating and / the sum by 12

        data.datasets.push({
          label: `${carer.forename} ${carer.initials}`,
          data: [reducedRate[i]],
          borderColor: [color],
          backgroundColor: [color],
        });
      })
    : data.datasets.push({
        label: `${carers[0].forename} ${carers[0].initials}`,
        data: filteredRating,
        borderColor: color,
        backgroundColor: color,
      });

  return <Bar options={options} data={data} />;
}

export default AnnualBarMetric;
