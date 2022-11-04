/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
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

function DailyBarMetric({ carers, date, rating }) {
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

  const [manyCarersRating] = useState([]);
  let maxValue = 12;
  const [filteredRating, setFilteredRating] = useState([]);
  useEffect(() => {
    if (
      rating !== null &&
      rating !== undefined &&
      rating.length > maxValue &&
      rating.map((item) => item !== null && item !== undefined)
    ) {
      while (rating.length) {
        manyCarersRating.push(rating.splice(0, maxValue));
      }
    } else if (
      rating !== null &&
      rating !== undefined &&
      rating.length === maxValue
    ) {
      setFilteredRating(
        Math.floor(rating.reduce((acc, arr) => acc + arr) / maxValue)
      );
    }
  }, [rating]);

  // const manyCarersRatingNoDuplicates = [...new Set(manyCarersRating)];
  const [reducedRate, setReduceRate] = useState([]);
  useEffect(() => {
    setReduceRate(
      manyCarersRating.map((rate) => {
        if (rate !== undefined && rate !== null && rate.length === maxValue)
          return Math.floor(rate.reduce((acc, val) => acc + val) / maxValue);
      })
    );
  }, [manyCarersRating]);

  carers.length > 1 && carers !== null && carers !== undefined
    ? carers.map((carer, i) => {
        // give each carer a unique dark color
        // reduce the rating and / the sum by 12
        carer[0] !== null && carer[0] !== undefined
          ? data.datasets.push({
              label: `${carer[0].forename} ${carer[0].initials}`,
              data: [reducedRate[i]],
              borderColor: color,
              backgroundColor: [
                `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(
                  Math.random() * 255
                )}, ${Math.floor(Math.random() * 255)})`,
              ],
            })
          : console.log("carer is null");
      })
    : data.datasets.push({
        label: carers.map((carer) =>
          carer[0] !== null && carer[0] !== undefined
            ? carer[0].forename + " " + carer[0].initials
            : null
        ),
        data: [filteredRating],
        borderColor: color,
        backgroundColor: color,
      });

  return <Bar options={options} data={data} />;
}

export default DailyBarMetric;
