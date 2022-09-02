import React, { useContext, useState, useEffect } from "react";
import { Context } from "../Context";
import { Link, useNavigate, useParams } from "react-router-dom";

function Evaluate() {
  const { sDData, currentstartDate, currentendDate } = useContext(Context);

  // create exact date string for the appointments
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  useEffect(() => {
    if (currentendDate !== undefined && currentstartDate !== undefined) {
      if (
        new Date(currentstartDate).toISOString().split("T")[0] !==
          new Date(currentendDate).toISOString().split("T")[0] ||
        new Date(currentstartDate).toISOString().split("T")[0] !==
          new Date().toISOString().split("T")[0]
      ) {
        const start = new Date(currentstartDate);
        start.setDate(start.getDate() + 1);
        setStartDate(start.toISOString().split("T")[0] + "T00:00:00.000Z");

        const end = new Date(currentendDate);

        end.setDate(end.getDate() + 1);
        setEndDate(end.toISOString().split("T")[0] + "T23:59:00.000Z");
      } else {
        setStartDate(
          new Date(currentstartDate).toISOString().split("T")[0] +
            "T00:00:00.000Z"
        );
        setEndDate(
          new Date(currentendDate).toISOString().split("T")[0] +
            "T23:59:00.000Z"
        );
      }
    }
  }, [currentendDate, currentstartDate]);
  const { id } = useParams();
  const [carer, setCarer] = useState({});
  useEffect(() => {
    sDData
      .getCarer(id)
      .then((res) => setCarer(res.carers))
      .catch((err) => console.log(err));
  }, [id]);
  // Get the metrics from the database
  const [metrics, setMetrics] = useState([]);
  useEffect(() => {
    sDData.getMetrics().then((res) => setMetrics(res.metrics));
  }, []);
  // create the errors instence in state and set it to an empty array
  const [errors, setErrors] = useState([]);
  // store the useNavigate method to a constant
  const navigate = useNavigate();
  // Save the input value to the state

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

  // RATING POST
  const [ratingInput, setInput] = useState({
    metricID: "",
    startDate: "",
    endDate: "",
    ratingID: "",
    carerID: "",
  });
  ratingInput.carerID = carer.carerID;
  ratingInput.startDate = startDate;
  ratingInput.endDate = endDate;
  const handleSelect = (e) => {
    e.stopPropagation();
    const { name, value } = e.target;
    setInput((ratingInput) => ({
      ...ratingInput,
      [name]: parseInt(value),
    }));
    setInput((ratingInput) => ({
      ...ratingInput,
      metricID: parseInt(e.target.id),
    }));
  };

  // ccreate arr to push every rating checked
  const [checkedRating, setCheckedRating] = useState([]);
  useEffect(() => {
    if (ratingInput.ratingID) {
      setCheckedRating([...checkedRating, ratingInput]);
    }
  }, [ratingInput]);

  // COMPLIED
  const [complied, setcomplied] = useState({
    metricID: "",
    startDate: "",
    endDate: "",
    compliedID: "",
    carerID: "",
  });
  complied.carerID = carer.carerID;
  complied.startDate = startDate;
  complied.endDate = endDate;
  const select = (e) => {
    e.stopPropagation();
    const { name, value } = e.target;
    setcomplied((complied) => ({
      ...complied,
      [name]: parseInt(value),
    }));
    setcomplied((complied) => ({
      ...complied,
      metricID: parseInt(e.target.id),
    }));
  };

  // ccreate arr to push every rating checked
  const [checkedComplied, setCheckedComplied] = useState([]);
  useEffect(() => {
    if (complied.compliedID) {
      setCheckedComplied([...checkedComplied, complied]);
    }
  }, [complied]);

  // COMMENT POST

  // Declare a timer
  let timer;
  const [comment, setComment] = useState([]);
  // Create a function to handle the comment post
  const handleComment = (e) => {
    e.preventDefault();
    clearTimeout(timer);
    // wait for 1 second before posting the comment
    timer = setTimeout(() => {
      const { name, value } = e.target;
      setComment((comment) => ({
        ...comment,
        [name]: value,
      }));
    }, 500);
  };

  // create an object to store the comment data
  const [commentData, setCommentData] = useState([]);
  useEffect(() => {
    // set the comment data to an object
    // if the comment is not empty
    if (Object.entries(comment).length !== 0) {
      setCommentData([
        ...Object.entries(comment).map(([key, value]) => {
          // rename all the keys from integers to "comment"
          return {
            comment: value,
            metricID: parseInt(key),
            startDate: startDate,
            endDate: endDate,
            carerID: carer.carerID,
          };
        }),
      ]);
    }
  }, [comment]);

  // Post the client_calls to the database
  const submit = (e) => {
    e.preventDefault();
    // wait for the user to finish tying before you can save the comment
    sDData.createMetricRatings(
      checkedRating.filter(
        (value, index, self) =>
          index ===
          self.findIndex(
            (t) => t.carerID === value.carerID && t.metricID === value.metricID
          )
      )
    );
    sDData.createMetricComplied(
      checkedComplied.filter(
        (value, index, self) =>
          index ===
          self.findIndex(
            (t) => t.carerID === value.carerID && t.metricID === value.metricID
          )
      )
    );
    sDData
      .createComments(commentData)
      //  then if there is any errors
      .then((errors) => {
        // set the errors array to display them
        setErrors(
          errors.length ||
            (checkedRating.length < metrics.length &&
              checkedComplied.length < metrics.length &&
              commentData.length < metrics.length)
            ? [
                "Please select a rating for each metric",
                "Please select a complied for each metric",
                "Please add a comment for each metric",
              ]
            : errors.length ||
              (checkedComplied.length < metrics.length &&
                commentData.length < metrics.length &&
                checkedRating.length === metrics.length)
            ? [
                "Please select a complied for each metric",
                "Please add a comment for each metric",
              ]
            : errors.length ||
              (commentData.length < metrics.length &&
                checkedRating.length < metrics.length &&
                checkedComplied.length === metrics.length)
            ? [
                "Please add a comment for each metric",
                "Please select a rating for each metric",
              ]
            : errors.length || commentData.length < metrics.length
            ? ["Please add a comment for each metric"]
            : errors.length || checkedRating.length < metrics.length
            ? ["Please select a rating for each metric"]
            : errors.length || checkedComplied.length < metrics.length
            ? ["Please select a complied for each metric"]
            : navigate(`/carers/${id}/assessed/select`)
        );
      })

      // catch any errors thrown by the api and log them to the console
      .catch((err) => {
        console.log(err);
        // navigate to the /error
        navigate("/error");
      });
  };

  return (
    <div className="form--centered">
      <h2>
        Assess {carer.forename} {carer.surname}
      </h2>
      <form onSubmit={submit}>
        {metrics.map((metric) => (
          <>
            <p>
              <span>{metric.metricNameID}:</span>
              {metric.performanceMetric}
            </p>
            <div className="ratingCompliedBox">
              <div>
                <label htmlFor="rating">Rating</label>
                <select
                  name="ratingID"
                  id={metric.metricNameID}
                  onChange={handleSelect}
                >
                  <option value="">Select Rating</option>
                  {ratings.map((rating) => (
                    <option key={rating.ratingID} value={rating.ratingID}>
                      {rating.rating}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="compliedNotComplied">
                  Complied/Not Complied
                </label>
                <select
                  name="compliedID"
                  id={metric.metricNameID}
                  onChange={select}
                >
                  <option value="">Select Complied...</option>
                  {complaints.map((complaint) => (
                    <option
                      key={complaint.compliedID}
                      value={complaint.compliedID}
                    >
                      {complaint.compliedNotComplied}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <label htmlFor="comments">Comments</label>
            <textarea
              name={metric.metricNameID}
              onChange={handleComment}
              id={metric.metricNameID}
            ></textarea>
          </>
        ))}
        {errors.length ? (
          <>
            <div className="validation--errors">
              <h3>Validation errors</h3>
              <ul>
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          <></>
        )}
        <button type="submit" className="button button-primary">
          Save
        </button>
        <Link
          to={`/carers/${id}/appointment`}
          className="button button-secondary"
        >
          Back
        </Link>
      </form>
    </div>
  );
}

export default Evaluate;
