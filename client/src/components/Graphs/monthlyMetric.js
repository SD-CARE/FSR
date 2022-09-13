/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
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
import { Context } from "../../Context";
import MonthlyBarMetric from "./monthlyBar";
import { useParams } from "react-router-dom";
export const MonthlyMetrics = React.forwardRef((props, ref) => {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );
  const { id } = useParams();
  const [carer, setCarer] = useState([]);
  const { sDData, carerDateRange } = useContext(Context);

  // get the carer date
  const [startDate, setStartDate] = useState();
  useEffect(() => {
    const start = new Date(carerDateRange.selection.startDate);
    start.setDate(start.getDate() + 1);
    setStartDate(start.toISOString().split("T")[0]);
  }, [carerDateRange]);

  // when the component is mounted
  useEffect(() => {
    sDData.getCarer(id).then((carer) => setCarer(carer.carers));
  }, []);

  // get the metrics from the database
  const [metrics, setMetrics] = useState([]);
  useEffect(() => {
    sDData.getMetrics().then((res) => setMetrics(res.metrics));
  }, []);

  // Get the ratings from the database
  const [ratings, setRatings] = useState([]);
  useEffect(() => {
    sDData.getRatings().then((res) => setRatings(res.ratings));
  }, []);

  // get all metricRating
  const [metricRating, setMetricRating] = useState([]);
  useEffect(() => {
    sDData.getMetricRatings().then((res) => setMetricRating(res.metric));
  }, []);

  // compare the metricRating with the current carer
  const [carerRating, setCareRating] = useState();
  useEffect(() => {
    metricRating !== undefined && metricRating !== null
      ? setCareRating(
          metricRating.filter((rating) =>
            rating !== null ? rating.carerID === parseInt(id) : null
          )
        )
      : setCareRating([]);
  }, [metricRating]);

  // get all the client_calls that match the start date
  const [ratingDate, setRatingDate] = useState([]);
  useEffect(() => {
    carerRating !== undefined && carerRating !== null && carerRating
      ? setRatingDate(
          carerRating.map((poc) =>
            poc.startDate.split("T")[0] === startDate ? poc : null
          )
        )
      : setRatingDate([]);
  }, [carerRating, startDate]);

  // add the POC from packageOfCare and add it to the clientPOCFilter
  const [rate, setRate] = useState([]);
  useEffect(() => {
    ratingDate.length > 0 && metrics
      ? setRate(
          ratingDate.map((rateDate) => {
            if (rateDate !== null) {
              return metrics.map((metric) =>
                rateDate.metricID === metric.metricNameID
                  ? {
                      metricName: metric.performanceMetric,
                      metricID: rateDate.metricID,
                      ratingName: ratings.filter((rating) =>
                        rating !== null
                          ? rateDate.ratingID === rating.ratingID
                          : null
                      ),
                    }
                  : null
              );
            }
          })
        )
      : setRate([]);
  }, [ratingDate, metrics]);

  // prepare rating data for the chart
  const [ratingData, setRatingData] = useState([]);
  useEffect(() => {
    rate ? (
      setRatingData(
        rate.map((rate) => {
          if (rate !== null && rate !== undefined) {
            return rate.map((r) => {
              if (r !== null && r !== undefined) {
                return r.ratingName[0].rating;
              }
            });
          }
        })
      )
    ) : (
      <></>
    );
  }, [rate]);
  console.log();
  const fiteredRating = [];

  ratingData.length > 0 ? (
    ratingData.concat
      .apply([], ratingData)
      .map((r) =>
        r !== null && r !== undefined ? fiteredRating.push(r) : null
      )
  ) : (
    <></>
  );

  return (
    <div ref={ref} className="wrap">
      <h2>Performance Metrics</h2>
      <MonthlyBarMetric
        carer={carer}
        metrics={metrics}
        fiteredRating={fiteredRating}
        date={startDate}
      />
    </div>
  );
});
