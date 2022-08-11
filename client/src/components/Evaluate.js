import React, { useContext, useState, useEffect } from "react";
import Form from "./Form";
import { Context } from "../Context";
import { Link, useNavigate, useParams } from "react-router-dom";

function Evaluate() {
  const { sDData, signIn } = useContext(Context);
  // create a user instence in the component state and set it to an object

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
  const [input, setInput] = useState({
    performanceMetrics: "",
    comment: "",
    rating: "",
    compliedNotComplied: "",
  });
  // create the change function
  const change = (e) => {
    // create the name and value constants to store events from the inputs
    const { name, value } = e.target;
    // set the user to take the data from the inputs as key value pairs
    // spreading the already exiting contents
    setInput((input) => ({ ...input, [name]: value }));
  };

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

  return (
    <div className="form--centered">
      <h2>
        Assess {carer.forename} {carer.surname}
      </h2>
      <form>
        {metrics.map((metric) => (
          <>
            <p>
              <span>{metric.metricNameID}:</span>
              {metric.performanceMetric}
            </p>
            <div className="ratingCompliedBox">
              <div>
                <label htmlFor="rating">Rating</label>
                <select name="rating" id="rating">
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
                <select name="compliedNotComplied" id="compliedNotComplied">
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
            <textarea name="comment"></textarea>
          </>
        ))}

        <button
          type="submit"
          onClick={() => navigate("/")}
          className="button button-primary"
        >
          Save
        </button>
        <Link to={`/carers/${id}`} className="button button-secondary">
          Back
        </Link>
      </form>
    </div>
  );
}

export default Evaluate;
