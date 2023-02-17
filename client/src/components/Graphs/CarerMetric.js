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
import { Context } from "../../Context";
import CarerBarMetric from "./CarerBar";
import { useParams } from "react-router-dom";
export const CarerMetrics = React.forwardRef((props, ref) => {
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
  const { noAuth, carerDateRange } = useContext(Context);

  // get the carer date
  const [startDate, setStartDate] = useState();
  useEffect(() => {
    const start = new Date(carerDateRange.selection.startDate);
    if (start.getTimezoneOffset() === 0) {
      start.setDate(start.getDate());
    } else {
      start.setDate(start.getDate() + 1);
    }
    setStartDate(start.toISOString().split("T")[0]);
  }, [carerDateRange]);

  // when the component is mounted
  useEffect(() => {
    noAuth.getCarer(id).then((carer) => setCarer(carer.carers));
  }, []);

  // get the metrics from the database
  const [metrics, setMetrics] = useState([]);
  useEffect(() => {
    noAuth.getMetrics().then((res) => setMetrics(res.metrics));
  }, []);

  // Get the ratings from the database
  const [ratings, setRatings] = useState([]);
  useEffect(() => {
    noAuth.getRatings().then((res) => setRatings(res.ratings));
  }, []);

  // get all metricRating
  const [metricRating, setMetricRating] = useState([]);
  useEffect(() => {
    noAuth.getMetricRatings().then((res) => setMetricRating(res.metric));
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
            if (rateDate !== null && rateDate !== undefined) {
              return metrics.map((metric) =>
                rateDate.metricID === metric.metricNameID
                  ? {
                      metricName: metric.performanceMetric,
                      metricID: rateDate.metricID,
                      ratingName: ratings.filter((rating) =>
                        rating !== null && rating !== undefined
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
  }, [ratingDate, metrics, ratings]);

  // prepare rating data for the chart
  const [ratingData, setRatingData] = useState([]);
  useEffect(() => {
    rate && rate !== null && rate !== undefined ? (
      setRatingData(
        rate.map((rater) => {
          if (
            rater !== null &&
            rater !== undefined &&
            rater.length > 0 &&
            rater !== []
          ) {
            return rater.map((r) => {
              if (r !== null && r !== undefined && r !== [] && r.ratingName) {
                return r.ratingName[0] && r.ratingName !== []
                  ? r.ratingName[0].rating
                  : null;
              }
            });
          }
        })
      )
    ) : (
      <></>
    );
  }, [rate]);
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
      <CarerBarMetric
        carer={carer}
        metrics={metrics}
        fiteredRating={fiteredRating}
        date={startDate}
      />
    </div>
  );
});
