import React, { useContext, useState, useEffect } from "react";
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

function AnnualBarMetric() {
  const [carers, setCarers] = useState([]);
  const { sDData } = useContext(Context);

  // when the component is mounted
  useEffect(() => {
    sDData
      .getCarers()
      .then((carer) => setCarers(carer.carers.map((carer) => carer)));
  }, [sDData]);
  console.log(carers);
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
