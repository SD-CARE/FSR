// Displays a course's details from /api/courses/:id
// Renders a "Delete Course" button for deleting a course
// Renders a "Edit Course" button for editing a course

import React, { useState, useContext, useCallback, useEffect } from "react";
import { Context } from "../Context";
import { Collapse } from "react-collapse";
import ClientBox from "./ClientBox";
import { Link, useNavigate, useParams } from "react-router-dom";

function CarerDetail() {
  const { currentstartDate, currentendDate, sDData, cPData } =
    useContext(Context);

  const accessibilityIds = {
    checkbox: "accessible-marker-example1",
    button: "accessible-marker-example2",
  };

  const navigate = useNavigate();
  const { id } = useParams();
  const [isButtonCollapseOpen, setIsButtonCollapseOpen] = useState(false);
  const [carer, setCarer] = useState({});
  const onClick = useCallback(
    () => setIsButtonCollapseOpen(!isButtonCollapseOpen),
    [isButtonCollapseOpen]
  );

  const sdate = new Date(currentstartDate).toDateString();
  const edate = new Date(currentendDate).toDateString();

  // GET THE CARER
  useEffect(() => {
    sDData
      .getCarer(id)
      .then((res) => setCarer(res.carers))
      .catch((err) => console.log(err));
  }, [id]);

  // Get Current carer Name
  const carerName = `${carer.forename} ${carer.surname}`;
  // Get Current carer Initials
  const carerInitials = carerName
    .split(" ")
    .map((name) => name[0])
    .join("");
  const [region, setRegion] = useState("");

  // Get the current carer's region from care planner
  useEffect(() => {
    // If the CPID exists in the database
    carer.CPID
      ? // call the getCarer function in the context
        cPData
          .getCarer(`"${carer.CPID}"`)
          // then set the region to the carer's region identifier
          .then((res) =>
            setRegion(
              // if there is more than one region, map it out
              res[0].regions.length >= 1
                ? res[0].regions.map((region) => region.identifier)
                : // otherwise set the region to the first region identifier
                  res[0].regions[0].identifier
            )
          )
      : // if there is no CPID, set the region to the default region ""
        setRegion("");
  }, [carer]);

  // Get all the regions from the database
  const [regions, setRegions] = useState([]);
  useEffect(() => {
    // If the region exists in care planner
    region.length >= 1
      ? // call the getRegions function in the context
        sDData.getRegions().then((res) => setRegions(res.regions))
      : // otherwise set the regions to the default region ""
        setRegions([]);
  }, [region]);

  // Get all the regions saved for all the carers from the database
  const [currentCarerRegionID, setCurrentCarerRegionID] = useState([]);
  useEffect(() => {
    //call the getCarerRegions function in the context
    sDData.getCarerRegion().then((res) => setCurrentCarerRegionID(res));
  }, []);

  const [currentCarerRegion] = useState([]);
  const [regObj] = useState([]);
  // Get current carer regions by comparing regions and currentCarerRegionID
  useEffect(() => {
    // If the currentCarerRegionID exists in the database
    // or if the currentCarerRegionID is not empty
    // and the regions exists in the database
    if (
      currentCarerRegionID.length >= 1 ||
      (currentCarerRegionID !== undefined && regions !== undefined)
    ) {
      // filter the regions by the currentCarerRegionID
      regions.filter((reg) => {
        // looping over the currentCarerRegionID
        currentCarerRegionID.carer_regions.forEach((cr) => {
          // if the currentCarerRegionID's carerID matches the the current carer's ID
          if (cr.regionID === reg.regionID && cr.carerID === carer.carerID) {
            // push that region's name and CPID to the currentCarerRegion array and the regObj array respectively
            console.log([cr]);
          }
        });
      });
    }
  }, [currentCarerRegionID, regions, regObj]);
  // create an errors instance in state and set it to an empty array
  const [errors, setErrors] = useState([]);

  // create exact date string for the appointments
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  useEffect(() => {
    if (currentendDate !== undefined && currentstartDate !== undefined) {
      if (
        new Date(currentstartDate).toISOString().split("T")[0] !==
        new Date(currentendDate).toISOString().split("T")[0]
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

  // Get the current carer's clients
  const [clientID, setClientID] = useState([]);
  // Get all clients IDs for the current carer
  useEffect(() => {
    // call the "getcarers" method from the data
    if (
      regObj.length > 0 &&
      carer !== undefined &&
      startDate !== undefined &&
      endDate !== undefined
    ) {
      cPData
        .appointments(
          carer.CPID,
          startDate,
          endDate,
          [...new Set(regObj)].length > 1
            ? [...new Set(regObj.map((cr) => `"${cr}"`))]
            : [`"${regObj[0]}"`]
        )
        .then((res) => setClientID(res))
        // catch any errors returned by the Rest Api
        .catch((err) => console.log(err));
    }
  }, [regObj, startDate, endDate, carer]);

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
              <input value={carerName} readOnly />
            </div>
            <div>
              <label>Carer Initials</label>
              <input
                type="text"
                className="initial"
                value={carerInitials}
                readOnly
              />
            </div>
            <div className="date-wrapper">
              <label>Start Date</label>
              <input type="text" value={sdate} readOnly />
            </div>
            <div className="date-wrapper">
              <label>End Date</label>
              <input type="text" value={edate} readOnly />
            </div>
            <div>
              <label>Schedules</label>
              <input
                type="text"
                value={[...new Set(currentCarerRegion)].join(", ")}
                readOnly
              />
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
        <ClientBox
          regions={regions}
          carer={carer}
          currentstartDate={currentstartDate}
          currentendDate={currentendDate}
        />
      </div>

      <div className="btn-container">
        <button
          type="submit"
          onClick={() => navigate(`/evaluate/${id}`)}
          className="button btn-primary btn"
        >
          Assess
        </button>

        <Link to={`/carers/${id}/date`} className="button button-secondary btn">
          Back
        </Link>
      </div>
    </>
  );
}

export default CarerDetail;
