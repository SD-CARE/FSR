/* eslint-disable react-hooks/exhaustive-deps */
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
      // eslint-disable-next-line array-callback-return
      regions.filter((reg) => {
        // looping over the currentCarerRegionID
        currentCarerRegionID.carer_regions.forEach((cr) => {
          // if the currentCarerRegionID's carerID matches the the current carer's ID
          if (cr.regionID === reg.regionID && cr.carerID === carer.carerID) {
            // push that region's name and CPID to the currentCarerRegion array and the regObj array respectively
            currentCarerRegion.push(reg.regionName);
          }
        });
      });
    }
  }, [currentCarerRegionID, regions]);

  // create an errors instance in state and set it to an empty array
  const [errors, setErrors] = useState([]);

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
        //  if it is winter time keep the time as it is
        if (start.getTimezoneOffset() === 0) {
          start.setDate(start.getDate());
        } else {
          // if it is summer time add 1 hour to the time
          start.setDate(start.getDate() + 1);
        }
        setStartDate(start.toISOString().split("T")[0] + "T00:00:00.000Z");
        const end = new Date(currentendDate);
        if (end.getTimezoneOffset() === 0) {
          end.setDate(end.getDate());
        } else {
          // if it is summer time add 1 hour to the time
          end.setDate(end.getDate() + 1);
        }
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
  const [clients, setClients] = useState([]);
  const [clientID, setClientID] = useState([]);

  // Get all clients IDs for the current carer
  useEffect(() => {
    // call the "getcarers" method from the data
    if (region.length >= 1) {
      cPData
        .appointments(
          carer.CPID,
          startDate,
          endDate,
          region.length === 1
            ? `"${region[0]}"`
            : region.map((reg) => `"${reg}"`),
          true
        )
        .then((res) => {
          setClientID(
            res.length > 1 ? res.map((client) => client.client) : res[0].client
          );
        })
        // catch any errors returned by the Rest Api
        .catch((err) => console.log(err));
    }
  }, [region]);
  // compare the clientID with the clients from cpData
  const [filterOutDisabledClients, setFilterOutDisabledClients] = useState([]);
  useEffect(() => {
    cPData.getAllClients().then((res) => setClients(res));
  }, []);

  useEffect(() => {
    if (clientID.length >= 1 && clients.length >= 1) {
      setFilterOutDisabledClients(
        clients.filter((client) => clientID.includes(client.identifier))
      );
    }
  }, [clientID, clients]);

  // Get the current carer's clients from the database
  const [currentCarerClients, setCurrentCarerClients] = useState([]);
  useEffect(() => {
    // If the clientID exists in the database
    if (clientID.length >= 1) {
      // call the getClients function in the context
      sDData
        .getClients()
        .then((res) => {
          //  setCurrentCarerClients to an array of the clients that match the clientID
          setCurrentCarerClients(
            res.clients.filter((client) => clientID.includes(client.CPID))
          );
        })
        .catch((err) => console.log(err));
    }
  }, [clientID]);

  const [filteredClients, setFilteredClients] = useState([]);
  useEffect(() => {
    if (filterOutDisabledClients.length >= 1) {
      setFilteredClients(
        //  compare the currentCarerClients with the filterOutDisabledClients and return the currentCarerClients that match the filterOutDisabledClients
        currentCarerClients.filter((client) =>
          filterOutDisabledClients.some(
            (filteredClient) => filteredClient.identifier === client.CPID
          )
        )
      );
    }
  }, [currentCarerClients, filterOutDisabledClients]);

  // POST THE CALLS TO THE DATABASE
  const [unchecked, setUnchecked] = useState({
    callID: "",
    clientID: "",
  });
  const [postCalls, setPostCalls] = useState({
    callID: "",
    clientID: "",
    startDate: "",
    endDate: "",
    carerID: "",
  });
  postCalls.startDate = startDate;
  postCalls.endDate = endDate;
  postCalls.carerID = carer.carerID;
  // create the change function
  const change = (e) => {
    e.stopPropagation();
    // create the name and value constants to store events from the inputs
    const { name, value } = e.target;
    // set the user to take the data from the inputs as key value pairs
    // spreading the already exiting contents
    // save each e.target.value to postCalls
    if (e.target.checked) {
      setPostCalls((postCalls) => ({ ...postCalls, [name]: parseInt(value) }));
      setPostCalls((postCalls) => ({
        ...postCalls,
        clientID: parseInt(e.target.id),
      }));
    } else {
      setUnchecked({
        callID: parseInt(value),
        clientID: parseInt(e.target.id),
      });
    }
  };

  const [selectedpoc, setSelectedpoc] = useState({
    clientID: "",
    POC_ID: "",
    startDate: "",
    endDate: "",
    carerID: "",
  });
  selectedpoc.startDate = startDate;
  selectedpoc.endDate = endDate;
  selectedpoc.carerID = carer.carerID;
  const handleSelect = (e) => {
    e.stopPropagation();
    const { name, value } = e.target;
    setSelectedpoc((selectedpoc) => ({
      ...selectedpoc,
      [name]: parseInt(value),
    }));
    setSelectedpoc((selectedpoc) => ({
      ...selectedpoc,
      clientID: parseInt(e.target.id),
    }));
  };

  // ccreate arr to push every postCalls checked
  const [checkedCalls, setCheckedCalls] = useState([]);
  useEffect(() => {
    if (postCalls.callID) {
      setCheckedCalls([...checkedCalls, postCalls]);
    }
  }, [postCalls]);

  // unchecked calls array to push every unchecked call
  const [uncheckedCalls, setUncheckedCalls] = useState([]);
  useEffect(() => {
    if (unchecked.callID) {
      setUncheckedCalls([...uncheckedCalls, unchecked]);
    }
  }, [unchecked]);

  const [filterCalls, setFilterCalls] = useState();
  useEffect(() => {
    // filter the outPutCall to remove the unchecked calls
    if (uncheckedCalls) {
      //  filter the checkedCalls to remove the unchecked calls from the array
      setFilterCalls(
        checkedCalls.filter((call) => {
          return !uncheckedCalls.some((unchecked) => {
            return (
              unchecked.callID === call.callID &&
              unchecked.clientID === call.clientID
            );
          });
        })
      );
    }
  }, [checkedCalls, uncheckedCalls]);
  useEffect(() => {
    if (filterCalls) {
      setUncheckedCalls([]);
    }
  }, []);

  // create arr to push every selectedpoc
  // ccreate arr to push every postCalls checked
  const [pocArr, setPocArr] = useState([]);
  useEffect(() => {
    if (selectedpoc.POC_ID) {
      setPocArr([...pocArr, selectedpoc]);
    }
  }, [selectedpoc]);

  // get the last pocID incase the user changes the poc
  const lastPoc = pocArr.reduce((acc, cur, i) => {
    acc[cur.clientID] = { i: cur };
    return acc;
  }, {});

  const outPutPoc = Object.values(lastPoc)
    .sort((a, b) => a.i - b.i)
    .map(({ i: val }) => val);

  //  get the last callID incase the user changes the call
  let outPutCall = [];
  if (filterCalls) {
    const lastCall = filterCalls.reduce((acc, cur, i) => {
      acc[cur.clientID] = { i: cur };
      return acc;
    }, {});

    outPutCall = Object.values(lastCall)
      .sort((a, b) => a.i - b.i)
      .map(({ i: val }) => val);
  }

  const [clientRegions, setClientRegions] = useState([]);
  useEffect(() => {
    sDData.getRegions().then((res) => setClientRegions(res.regions));
  }, []);

  // set the carer's clients
  const [carerClients, setCarerClients] = useState([]);
  useEffect(() => {
    setCarerClients([
      ...Object.entries(filteredClients).map(([key, value]) => {
        return {
          id: value.clientID,
          CPID: value.CPID,
          forename: value.forename,
          surname: value.surname,
          regions: clients.filter((client) => {
            return client.identifier === value.CPID;
          }),
        };
      }),
    ]);
  }, [clients, filteredClients]);

  // set the current clients's regionIDs
  const [currentClientRegionID, setCurrentClientRegionID] = useState([]);
  useEffect(() => {
    setCurrentClientRegionID([
      ...Object.entries(carerClients).map(([key, value]) => {
        // check if value.regions[0].identifier is undefine

        if (value.CPID === value.regions[0].identifier && value.regions[0]) {
          return {
            regionID:
              // if value.regions[0].regions.length > 1
              value.regions[0].regions.length > 1
                ? value.regions[0].regions.map((reg) =>
                    clientRegions.filter((re) => reg.identifier === re.CPID)
                  )
                : // otherwise return the regionID of the first region
                  clientRegions.filter((region) =>
                    value.regions[0].regions[0].identifier === region.CPID
                      ? region
                      : null
                  ),
            clientID: value.id,
          };
        }
      }),
    ]);
  }, [carerClients]);

  const [filteredRegions, setFilteredRegions] = useState([]);
  // Clean up the currentClientRegionID make it ready for the database
  useEffect(() => {
    // make sure the currentClientRegionID is not empty
    if (currentClientRegionID.length >= 1) {
      // create a new object for each regionID
      setFilteredRegions([
        ...currentClientRegionID.map((region) => {
          return {
            regionID:
              region.regionID.length > 1
                ? region.regionID.map((reg) => ({
                    regionID: reg[0].regionID,
                    clientID: region.clientID,
                    startDate: startDate,
                    endDate: endDate,
                  }))
                : region.regionID[0].regionID,
            clientID: region.clientID,
            startDate: startDate,
            endDate: endDate,
          };
        }),
      ]);
    }
  }, [currentClientRegionID]);
  // Create array to hold filtered regionsID

  useEffect(() => {
    let array = [];
    // If filteredRegions is not empty
    if (filteredRegions.length > 0) {
      // Find the regionIDs that are more than one
      filteredRegions.find((reg) =>
        // and push them into the array
        reg.regionID.length > 1 ? array.push(...reg.regionID) : null
      );
      // now filter the filteredRegions to remove the regionIDs that are more than one
      filteredRegions.filter((reg) =>
        // and push the ones that are not into the array
        !reg.regionID.length ? array.push(reg) : null
      );
    }
    // Post the filteredRegions to the database
    sDData.setClientRegion(array);
  }, [filteredRegions]);

  // get all calls from the database
  const [calls, setCalls] = useState([]);
  useEffect(() => {
    sDData.getCalls().then((res) => setCalls(res.calls));
  }, []);

  // get all poc from the database
  const [poc, setPOC] = useState([]);
  useEffect(() => {
    sDData.getPOC().then((res) => setPOC(res.poc));
  }, []);

  // create array to hold clientIDs, carerIDs, start and end dates
  const [carerClientDates, setCarerClientDates] = useState([]);
  useEffect(() => {
    // if carerClients is not empty
    if (carerClients.length > 0) {
      setCarerClientDates(
        Object.entries(carerClients).map(([key, value]) => {
          return {
            clientID: value.id,
            carerID: carer.carerID,
            startDate: startDate,
            endDate: endDate,
          };
        })
      );
    }
  }, [carerClients]);

  const submit = (e) => {
    e.preventDefault();
    if (
      carerClientDates.length > 0 &&
      outPutPoc.length === currentCarerClients.length &&
      outPutCall.length >= currentCarerClients.length
    ) {
      // post the calls to the database
      sDData.createClientCalls(outPutCall);
      // post the POC to the database
      sDData.createClientPOC(outPutPoc);
      sDData
        .setCarerClients(carerClientDates)
        //  then if there is any errors
        .then((errors) => {
          // set the errors array to display them
          setErrors(errors.length);
        })
        .then(() => navigate(`/carers/${id}/assess`))
        // catch any errors thrown by the api and log them to the console
        .catch((err) => {
          console.log(err);
          // navigate to the /error
          navigate("/error");
        });
    } else {
      setErrors([
        "Please select calls for each client",
        "Please select Package of Care for each client",
      ]);
    }
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
          <div className="innerForm-wrapper">
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
          </div>
        </div>
      </Collapse>

      <form onSubmit={submit}>
        <div className="wrap main--grid">
          <ClientBox
            select={handleSelect}
            change={change}
            clients={filteredClients}
            carer={carer}
            startDate={startDate}
            endDate={endDate}
            calls={calls}
            poc={poc}
            carerClients={carerClients}
          />
        </div>
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

        <div className="btn-container">
          <button type="submit" className="button btn-primary btn">
            Assess
          </button>

          <Link
            to={`/carers/${id}/date`}
            className="button button-secondary btn"
          >
            Back
          </Link>
        </div>
      </form>
    </>
  );
}

export default CarerDetail;
