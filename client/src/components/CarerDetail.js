// Displays a course's details from /api/courses/:id
// Renders a "Delete Course" button for deleting a course
// Renders a "Edit Course" button for editing a course

import React, { useState, useContext, useCallback } from "react";
import { Context } from "../Context";
import { Collapse } from "react-collapse";
import ClientBox from "./ClientBox";
import { Link, useNavigate } from "react-router-dom";

function CarerDetail() {
  const {
    currentstartDate,
    currentendDate,
    currentCarer,
    currentCarerNPC,
    sDData,
  } = useContext(Context);

  const accessibilityIds = {
    checkbox: "accessible-marker-example1",
    button: "accessible-marker-example2",
  };

  const navigate = useNavigate();
  const [isButtonCollapseOpen, setIsButtonCollapseOpen] = useState(false);

  const onClick = useCallback(
    () => setIsButtonCollapseOpen(!isButtonCollapseOpen),
    [isButtonCollapseOpen]
  );

  const sdate = new Date(currentstartDate).toDateString();
  const edate = new Date(currentendDate).toDateString();

  // Get current Carer Regions
  const regionsName =
    currentCarer.regions.length >= 1
      ? currentCarer.regions.map((regions) => {
          if (regions.name.includes("Schedule")) {
            return ` ${regions.name.split(" ").pop()}`;
          } else {
            return ` ${regions.name}`;
          }
        })
      : null;

  // Get Current carer Name
  const carerName = `${currentCarer.forename} ${currentCarer.surname}`;
  // Get Current carer Initials
  const carerInitials = `${currentCarer.forename[0]}${currentCarer.surname[0]}`;

  // create an errors instance in state and set it to an empty array
  const [errors, setErrors] = useState([]);
  // create a calls Object
  const [calls] = useState(["Breakfast", "Lunch", "Tea", "Dinner"]);
  console.log(calls);
  const submit = () => {
    sDData
      .createCalls(calls)
      .then((errors) => {
        if (errors.length) {
          setErrors(errors);
        }
      })
      .catch((err) => {
        console.log(err);
        // navigate("/");
      });
  };
  return (
    <>
      <div className="config">
        <button
          aria-controls={accessibilityIds.button}
          aria-expanded={isButtonCollapseOpen}
          onClick={onClick}
          type="button"
          id="button-collapse"
        >
          View Carer
        </button>
      </div>
      <Collapse isOpened={isButtonCollapseOpen}>
        <div className="carerName-details" id={accessibilityIds.button}>
          <form className="innerForm-wrapper">
            <div>
              <label>Carer Name</label>
              <input value={carerName} disabled />
            </div>
            <div>
              <label>Carer Initials</label>
              <input
                type="text"
                className="initial"
                value={carerInitials}
                disabled
              />
            </div>
            <div>
              <label>NPC</label>
              <input type="text" value={currentCarerNPC} disabled />
            </div>
            <div className="date-wrapper">
              <label>Start Date</label>
              <input type="text" value={sdate} disabled placeholder="se" />
            </div>
            <div className="date-wrapper">
              <label>End Date</label>
              <input type="text" value={edate} disabled placeholder="se" />
            </div>
            <div>
              <label>Schedule</label>
              <input type="text" value={regionsName} disabled />
            </div>
          </form>
        </div>
      </Collapse>
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
      <div className="wrap main--grid">
        <ClientBox currentCarerSchedule={regionsName} />
      </div>

      <div className="btn-container">
        <form onSubmit={submit}>
          {calls.map((call, i) => (
            <input type="hidden" key={i} id="call" name="call" value={call} />
          ))}
          <button
            type="submit"
            onClick={() => navigate("/evaluate/1")}
            className="button btn-primary btn"
          >
            Assess
          </button>
        </form>

        <Link to="/carers/1/date" className="button button-secondary btn">
          Back
        </Link>
      </div>
    </>
  );
}

export default CarerDetail;
