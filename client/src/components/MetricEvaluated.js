import React, { useEffect, useState } from "react";

function MetricEvaluated({ carer, sDData, startDate, id }) {
  // Get the metrics from the database
  const [metrics, setMetrics] = useState([]);
  useEffect(() => {
    sDData.getMetrics().then((res) => setMetrics(res.metrics));
  }, []);

  // Get the ratings from the database
  const [ratings, setRatings] = useState([]);
  useEffect(() => {
    sDData.getRatings().then((res) => setRatings(res.ratings));
  }, []);

  // Get the complaints from the database
  const [complaints, setComplaints] = useState([]);
  useEffect(() => {
    sDData.getComplied().then((res) => setComplaints(res.complied));
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
    ratingDate !== undefined && ratingDate !== null && metrics
      ? setRate(
          ratingDate.map((rateDate) => {
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
          })
        )
      : setRate([]);
  }, [ratingDate, metrics]);

  // get all the compliedMetric
  const [compliedMetric, setCompliedMetric] = useState([]);
  useEffect(() => {
    sDData.getMetricComplied().then((res) => setCompliedMetric(res.metric));
  }, []);

  // compare the metricRating with the current carer
  const [carerComplied, setCareComplied] = useState();
  useEffect(() => {
    compliedMetric !== undefined && compliedMetric !== null
      ? setCareComplied(
          compliedMetric.filter((complied) =>
            complied !== null ? complied.carerID === parseInt(id) : null
          )
        )
      : setCareComplied([]);
  }, [compliedMetric]);

  // get all the client_calls that match the start date
  const [compliedDate, setCompliedDate] = useState([]);
  useEffect(() => {
    carerComplied !== undefined && carerComplied !== null && carerComplied
      ? setCompliedDate(
          carerComplied.map((complied) =>
            complied.startDate.split("T")[0] === startDate ? complied : null
          )
        )
      : setCompliedDate([]);
  }, [carerComplied, startDate]);

  // add the POC from packageOfCare and add it to the clientPOCFilter
  const [complied, setComplied] = useState([]);
  useEffect(() => {
    let currentMetrics = [];
    rate.concat.apply([], rate).map((metric) => {
      currentMetrics.push(metric);
    });
    compliedDate !== undefined && compliedDate !== null && currentMetrics
      ? setComplied(
          compliedDate.map((complyDate) => {
            return currentMetrics.map((metric) =>
              metric !== null
                ? complyDate.metricID === metric.metricID
                  ? {
                      metricName: metric.metricName,
                      metricID: complyDate.metricID,
                      ratingName: metric.ratingName,
                      compliedID: complyDate.compliedID,
                      compliedName: complaints.filter((comply) =>
                        comply !== null
                          ? complyDate.compliedID === comply.compliedID
                          : null
                      ),
                    }
                  : null
                : null
            );
          })
        )
      : setComplied([]);
  }, [compliedDate, rate]);

  // get all the metricsComments
  const [metricsComments, setMetricComments] = useState([]);
  useEffect(() => {
    sDData.getComments().then((res) => setMetricComments(res.comments));
  }, []);

  // compare the metricRating with the current carer
  const [carerComments, setCareComments] = useState();
  useEffect(() => {
    metricsComments !== undefined && metricsComments !== null
      ? setCareComments(
          metricsComments.filter((comment) =>
            comment !== null ? comment.carerID === parseInt(id) : null
          )
        )
      : setCareComments([]);
  }, [metricsComments]);

  // get all the client_calls that match the start date
  const [commentDate, setcommentDate] = useState([]);
  useEffect(() => {
    carerComments !== undefined && carerComments !== null && carerComments
      ? setcommentDate(
          carerComments.map((comment) =>
            comment.startDate.split("T")[0] === startDate ? comment : null
          )
        )
      : setcommentDate([]);
  }, [carerComments, startDate]);

  // add the POC from packageOfCare and add it to the clientPOCFilter
  const [comments, setComments] = useState([]);
  useEffect(() => {
    let currentComplied = [];
    complied.concat.apply([], complied).map((comply) => {
      if (comply !== null) {
        currentComplied.push(comply);
      }
    });
    commentDate !== undefined && commentDate !== null && currentComplied
      ? setComments(
          commentDate.map((date) => {
            return currentComplied.map((complied) =>
              complied !== null
                ? date.metricID === complied.metricID
                  ? {
                      metricName: complied.metricName,
                      metricID: date.metricID,
                      ratingName: complied.ratingName,
                      compliedID: complied.compliedID,
                      compliedName: complied.compliedName,
                      commentID: date.commentID,
                      comment: date.comment,
                    }
                  : null
                : null
            );
          })
        )
      : setComments([]);
  }, [commentDate, complied]);

  let currentPerformance = [];
  comments.concat.apply([], comments).map((comment) => {
    if (comment !== null) {
      currentPerformance.push(comment);
    }
  });
  console.log(currentPerformance);
  return (
    <div>
      {currentPerformance ? (
        currentPerformance.map((metric, index) => (
          <>
            <p key={index} style={{ textAlign: "center" }}>
              <span>{metric.metricID}:</span>
              {metric.metricName}
            </p>
            <div style={{ textAlign: "center" }}>
              <span>Rating:</span>
              <p style={{ display: "inline-block" }}>
                {metric.ratingName[0].rating}
              </p>
            </div>
            <div style={{ textAlign: "center" }}>
              <span>Complied/Not Complied:</span>
              <p style={{ display: "inline-block" }}>
                {metric.compliedName[0].compliedNotComplied}
              </p>
            </div>
            <div style={{ textAlign: "center" }}>
              <span>Comment:</span>
              <p style={{ display: "inline-block" }}>{metric.comment}</p>
            </div>
          </>
        ))
      ) : (
        <></>
      )}
    </div>
  );
}

export default MetricEvaluated;
