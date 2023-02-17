// Displays a course's details from /api/courses/:id
// Renders a "Delete Course" button for deleting a course
// Renders a "Edit Course" button for editing a course

import React, { useState, useContext, useEffect } from "react";
import { Context } from "../Context";
import { useParams, useNavigate, Link } from "react-router-dom";

function UpdateEvaluate() {
  const {
    noAuth,
    carerDateRange,
    authenticatedUser,
    updateComments,
    updateMetricComplied,
    updateMetricRating,
  } = useContext(Context);
  const { id } = useParams();
  const navigate = useNavigate();
  // create the errors instence in state and set it to an empty array
  const [errors, setErrors] = useState([]);
  // GET THE CARER

  const [carer, setCarer] = useState();
  useEffect(() => {
    noAuth
      .getCarer(id)
      .then((res) => setCarer(res.carers))
      .catch((err) => console.log(err));
  }, [id]);
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

  // Get the metrics from the database
  const [metrics, setMetrics] = useState([]);
  useEffect(() => {
    noAuth.getMetrics().then((res) => setMetrics(res.metrics));
  }, []);

  // Get the ratings from the database
  const [ratings, setRatings] = useState([]);
  useEffect(() => {
    noAuth.getRatings().then((res) => setRatings(res.ratings));
  }, []);

  // Get the complaints from the database
  const [complaints, setComplaints] = useState([]);
  useEffect(() => {
    noAuth.getComplied().then((res) => setComplaints(res.complied));
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
            if (rateDate !== null) {
              return metrics.map((metric) =>
                rateDate.metricID === metric.metricNameID
                  ? {
                      metricRatingID: rateDate.metricRatingID,
                      userID: rateDate.userID,
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
  }, [ratingDate, metrics, ratings]);

  // get all the compliedMetric
  const [compliedMetric, setCompliedMetric] = useState([]);
  useEffect(() => {
    noAuth.getMetricComplied().then((res) => setCompliedMetric(res.metric));
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
    compliedDate.length > 0 && currentMetrics.length > 0 && currentMetrics
      ? setComplied(
          currentMetrics.map((metric) => {
            if (metric !== null && metric !== undefined) {
              return compliedDate.map((complyDate) =>
                complyDate !== null && complyDate !== undefined
                  ? complyDate.metricID === metric.metricID
                    ? {
                        metricCompliedID: complyDate.metricCompliedID,
                        metricRatingID: metric.metricRatingID,
                        userID: metric.userID,
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
            }
          })
        )
      : setComplied([]);
  }, [compliedDate, rate, complaints]);

  // get all the metricsComments
  const [metricsComments, setMetricComments] = useState([]);
  useEffect(() => {
    noAuth.getComments().then((res) => setMetricComments(res.comments));
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
    commentDate.length > 0 && currentComplied.length > 0 && currentComplied
      ? setComments(
          commentDate.map((date) => {
            if (date !== null && date !== undefined) {
              return currentComplied.map((complied) =>
                complied !== null && complied !== undefined
                  ? date.metricID === complied.metricID
                    ? {
                        metricCompliedID: complied.metricCompliedID,
                        metricRatingID: complied.metricRatingID,
                        userID: complied.userID,
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
            }
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

  const [updateRating, setUpdateRating] = useState({
    metricRatingID: "",
    startDate: "",
    metricID: "",
    endDate: "",
    ratingID: "",
    carerID: "",
    userID: authenticatedUser.id,
  });
  updateRating.carerID = carer ? carer.carerID : null;
  updateRating.startDate = carerDateRange.selection.startDate;
  updateRating.endDate = carerDateRange.selection.endDate;
  const handleSelect = (e) => {
    e.stopPropagation();
    const { name, value } = e.target;
    setUpdateRating((updateRating) => ({
      ...updateRating,
      [name]: parseInt(value),
    }));
    setUpdateRating((updateRating) => ({
      ...updateRating,
      metricRatingID: parseInt(e.target.id),
      metricID: parseInt(e.target.className),
    }));
  };

  // ccreate arr to push every rating checked
  const [checkedRating, setCheckedRating] = useState([]);
  useEffect(() => {
    if (updateRating.ratingID) {
      setCheckedRating([...checkedRating, updateRating]);
    }
  }, [updateRating]);

  // get the last ratingID incase the user changes the poc
  const lastRating = checkedRating.reduce((acc, cur, i) => {
    acc[cur.metricID] = { i: cur };
    return acc;
  }, {});

  const outPutRating = Object.values(lastRating)
    .sort((a, b) => a.i - b.i)
    .map(({ i: val }) => val);

  const [updateComplied, setUpdateComplied] = useState({
    metricCompliedID: "",
    startDate: "",
    metricID: "",
    endDate: "",
    carerID: "",
    userID: authenticatedUser.id,
  });
  updateComplied.carerID = carer ? carer.carerID : null;
  updateComplied.startDate = carerDateRange.selection.startDate;
  updateComplied.endDate = carerDateRange.selection.endDate;
  const handleSelectComplied = (e) => {
    e.stopPropagation();
    const { name, value } = e.target;
    setUpdateComplied((updateComplied) => ({
      ...updateComplied,
      [name]: parseInt(value),
    }));
    setUpdateComplied((updateComplied) => ({
      ...updateComplied,
      metricCompliedID: parseInt(e.target.id),
      metricID: parseInt(e.target.className),
    }));
  };

  // ccreate arr to push every rating checked
  const [checkedComplied, setCheckedComplied] = useState([]);
  useEffect(() => {
    if (updateComplied && updateComplied.compliedID) {
      setCheckedComplied([...checkedComplied, updateComplied]);
    }
  }, [updateComplied]);

  // get the last compliedID incase the user changes the poc
  const lastComplied = checkedComplied.reduce((acc, cur, i) => {
    acc[cur.metricID] = { i: cur };
    return acc;
  }, {});

  const outPutComplied = Object.values(lastComplied)
    .sort((a, b) => a.i - b.i)
    .map(({ i: val }) => val);

  // COMMENT POST

  const [comment, setComment] = useState([]);
  const [currentMetric, setCurrentMetric] = useState();
  // Create a function to handle the comment post
  const handleComment = (e) => {
    e.preventDefault();

    const { name, value } = e.target;
    setComment((comment) => ({
      ...comment,
      [name]: value,
    }));
    setCurrentMetric(parseInt(e.target.id));
  };

  // create an object to store the comment data
  const [commentData, setCommentData] = useState([]);
  useEffect(() => {
    // set the comment data to an object
    setCommentData([
      ...Object.entries(comment).map(([key, value]) => {
        // rename all the keys from integers to "comment"
        return {
          comment: value,
          commentID: parseInt(key.split(" ")[1]),
          startDate: carerDateRange.selection.startDate,
          endDate: carerDateRange.selection.endDate,
          carerID: carer.carerID,
          userID: authenticatedUser.id,
          metricID: currentMetric,
        };
      }),
    ]);
  }, [comment]);

  const submit = (e) => {
    e.preventDefault();
    // wait for the user to finish tying before you can save the comment
    updateMetricRating(outPutRating);
    updateMetricComplied(outPutComplied);
    if (commentData.length > 0) updateComments(commentData);
    navigate(`/carers/${id}/assessed/detail`)
      .then((errors) => {
        // set the errors array to display them
        setErrors(errors.length);
      })
      .catch((err) => {
        console.log(err);
        // navigate to the /error
        navigate("/error");
      });
  };
  return carer ? (
    <>
      <div className="wrapper">
        <div className="carerName">
          <div className="carerInitials-name">
            <h3>
              {carer?.forename} {carer?.surname}
            </h3>
            <span className="initial">{carer.initials}</span>
          </div>
          <div className="npc">
            <span>NPC: {carer.NPC}</span>
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignContent: "center",
          flexWrap: "wrap",
          marginBottom: "20px",
        }}
      ></div>
      <form onSubmit={submit}>
        <div className="metric-container ">
          {currentPerformance !== null && currentPerformance.length > 0 ? (
            currentPerformance.map((metric, index) =>
              metric !== null && metric !== undefined ? (
                <>
                  <p key={index} className="metricName-evaluated">
                    <span>{metric.metricID}:</span>
                    {metric.metricName}
                  </p>
                  <div className="metricRatingComplied-evaluated">
                    <div>
                      <label>Rating:</label>
                      <select
                        onChange={handleSelect}
                        name="ratingID"
                        id={metric.metricRatingID}
                        className={metric.metricID}
                      >
                        {ratings.map((rating) => (
                          <option
                            key={rating.ratingID}
                            value={rating.ratingID}
                            selected={
                              metric.ratingName.length > 0
                                ? rating.rating === metric.ratingName[0].rating
                                : null
                            }
                          >
                            {rating.rating}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label>Complied/Not Complied:</label>
                      <select
                        name="compliedID"
                        id={metric.metricCompliedID}
                        className={metric.metricID}
                        onChange={handleSelectComplied}
                      >
                        {complaints.map((complaint) => (
                          <option
                            key={complaint.compliedID}
                            value={complaint.compliedID}
                            selected={
                              metric.compliedName.length > 0
                                ? complaint.compliedNotComplied ===
                                  metric.compliedName[0].compliedNotComplied
                                : null
                            }
                          >
                            {complaint.compliedNotComplied}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div style={{ margin: "0 20px" }}>
                    <label>Comment:</label>
                    <textarea
                      name={`comment ${metric.commentID}`}
                      onChange={handleComment}
                      id={metric.metricID}
                    >
                      {metric.comment}
                    </textarea>
                  </div>
                </>
              ) : null
            )
          ) : (
            <></>
          )}
        </div>
        <div className="btn-container">
          <button className="button button-primary" type="submit">
            Save
          </button>
          <Link
            to={`/carers/${id}/assessed/detail`}
            className="button button-secondary"
          >
            Cancel
          </Link>
        </div>
      </form>
    </>
  ) : (
    <></>
  );
}

export default UpdateEvaluate;
