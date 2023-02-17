/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import { Context } from "../Context";
import { Link, useParams, useNavigate } from "react-router-dom";
import MetricEvaluated from "./MetricEvaluated";
import { ComponentToPrint } from "./ComponentToPrint";
import DownloadAve from "./DownloadCarerAv";
export const Evaluated = React.forwardRef((props, ref) => {
  const {
    noAuth,
    carerDateRange,
    authenticatedUser,
    setContinueAssessEndDate,
    setContinueAssessStartDate,
  } = useContext(Context);
  const { id } = useParams();
  const navigate = useNavigate();
  // create "isEditing" to hold the boolean value in state
  const [isEditing, setIsEditing] = useState(false);
  // GET THE CARER
  const [carer, setCarer] = useState();
  useEffect(() => {
    noAuth
      .getCarer(id)
      .then((res) => setCarer(res?.carers))
      .catch((err) => console.log(err));
  }, [id]);

  // get all clients from the database
  const [clients, setClients] = useState([]);
  useEffect(() => {
    noAuth.getClients().then((res) => setClients(res?.clients));
  }, []);

  // get client_regions
  const [clientRegion, setClientRegions] = useState();
  useEffect(() => {
    noAuth
      .getClientRegion()
      .then((res) => setClientRegions(res?.client_regions));
  }, []);

  // Get all the regions from the database
  const [regions, setRegions] = useState([]);
  useEffect(() => {
    noAuth.getRegions().then((res) => setRegions(res?.regions));
    setRegions([]);
  }, []);

  // get all carer_clients
  const [carerClients, setCarerClients] = useState();
  useEffect(() => {
    noAuth
      .getCarerClients()
      .then((res) =>
        setCarerClients(
          res?.carer_clients.filter(
            (value, index, self) =>
              index ===
              self.findIndex(
                (t) =>
                  t.clientID === value.clientID &&
                  t.startDate === value.startDate &&
                  t.endDate === value.endDate &&
                  t.carerID === value.carerID
              )
          )
        )
      );
  }, []);

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

  const [endDate, setEndDate] = useState();
  useEffect(() => {
    const end = new Date(carerDateRange.selection.endDate);
    if (end.getTimezoneOffset() === 0) {
      end.setDate(end.getDate());
    } else {
      end.setDate(end.getDate() + 1);
    }
    setEndDate(end.toISOString().split("T")[0]);
  }, [carerDateRange]);

  useEffect(() => {
    if (startDate && endDate) {
      setContinueAssessStartDate(startDate + "T00:00:00.000Z");
      setContinueAssessEndDate(endDate + "T23:59:00.000Z");
    }
  }, [startDate, endDate]);

  // compair  start date with carerClients start date
  const [date, setDate] = useState([]);
  useEffect(() => {
    carerClients !== undefined && carerClients !== null
      ? setDate(
          carerClients.map((client) =>
            client.startDate.split("T")[0] === startDate &&
            client.carerID === parseInt(id)
              ? client
              : null
          )
        )
      : setDate([]);
  }, [carerClients]);

  // Date filter for clients
  const [dateFilter, setDateFilter] = useState([]);
  useEffect(() => {
    date !== undefined && date !== null
      ? setDateFilter(date.filter((client) => client))
      : setDateFilter([]);
  }, [date]);
  //   Put clientID into an array
  let arr = [];
  dateFilter.map((date) => arr.push(date.clientID));

  const [currentClients, setCurrentClients] = useState([]);
  useEffect(() => {
    setCurrentClients(
      clients.filter((client) => arr.includes(client.clientID))
    );
  }, [dateFilter, clients]);

  //   Get all the client_Regions that match the date range
  const [clientRegionDate, setClientRegionDate] = useState([]);
  useEffect(() => {
    clientRegion !== undefined &&
    clientRegion !== null &&
    clientRegion &&
    startDate !== null &&
    startDate !== undefined
      ? setClientRegionDate(
          clientRegion.map((region) =>
            region.startDate.split("T")[0] === startDate ? region : null
          )
        )
      : setClientRegionDate([]);
  }, [clientRegion, startDate]);
  // Match the clientRegionDate with the currentClients
  const [clientRegionFilter, setClientRegionFilter] = useState([]);
  useEffect(() => {
    clientRegionDate !== undefined &&
    clientRegionDate !== null &&
    currentClients
      ? setClientRegionFilter(
          currentClients.map((client) =>
            clientRegionDate.filter((region) =>
              region !== null ? client.clientID === region.clientID : null
            )
          )
        )
      : setClientRegionFilter([]);
  }, [clientRegionDate, currentClients]);

  // add the regionName from the regions to the clientRegionFilter
  const [regionName, setRegionName] = useState([]);
  useEffect(() => {
    clientRegionFilter !== undefined && clientRegionFilter !== null
      ? setRegionName(
          clientRegionFilter.map((client) => {
            return regions.map((region) => {
              return client.map((client) =>
                client.regionID === region.regionID
                  ? {
                      regionName: region.regionName,
                      clientID: client.clientID,
                      regionsID: region.regionID,
                      startDate: client.createdAt,
                    }
                  : null
              );
            });
          })
        )
      : setRegionName([]);
  }, [clientRegionFilter, regions]);

  // Add forename and surname to the regionName array from the currentClients
  const [clientName, setClientName] = useState([]);
  useEffect(() => {
    let array = [];
    regionName.concat.apply([], regionName).map((region) => {
      if (region !== null) {
        array.push(...region);
      }
    });
    currentClients !== undefined && currentClients !== null
      ? setClientName(
          array.map((client) => {
            if (client !== null) {
              return currentClients.map((name) =>
                client.clientID === name.clientID
                  ? {
                      clientID: client.clientID,
                      regionName: client.regionName,
                      regionsID: client.regionsID,
                      startDate: client.startDate,
                      forename: name.forename,
                      surname: name.surname,
                    }
                  : null
              );
            }
          })
        )
      : setClientName([]);
  }, [currentClients, regionName]);

  // get all the calls from the database
  const [calls, setCalls] = useState();
  useEffect(() => {
    noAuth.getCalls().then((res) => setCalls(res.calls));
  }, []);

  // get all client_calls from the database
  const [clientCalls, setClientCalls] = useState();
  useEffect(() => {
    noAuth.getClientCalls().then((res) => setClientCalls(res.client_calls));
  }, []);

  // compare the clientCalls with the current carer
  const [carerClientCalls, setCarerClientCalls] = useState();
  useEffect(() => {
    clientCalls !== undefined && clientCalls !== null
      ? setCarerClientCalls(
          clientCalls.filter((call) => call.carerID === parseInt(id))
        )
      : setCarerClientCalls([]);
  }, [clientCalls]);

  // get all the client_calls that match the start date
  const [clientCallsDate, setClientCallsDate] = useState([]);
  useEffect(() => {
    carerClientCalls !== undefined &&
    carerClientCalls !== null &&
    carerClientCalls
      ? setClientCallsDate(
          carerClientCalls.map((call) =>
            call.startDate.split("T")[0] === startDate ? call : null
          )
        )
      : setClientCallsDate([]);
  }, [carerClientCalls, startDate]);

  // match the clientCallsDate with the currentClients
  const [clientCallsFilter, setClientCallsFilter] = useState([]);
  useEffect(() => {
    clientCallsDate !== undefined && clientCallsDate !== null
      ? setClientCallsFilter(
          currentClients.map((client) =>
            clientCallsDate.filter((calls) =>
              calls !== null ? client.clientID === calls.clientID : null
            )
          )
        )
      : setClientCallsFilter([]);
  }, [clientCallsDate, currentClients]);

  // add the call from calls to the clientCallsFilter
  const [call, setCall] = useState([]);
  useEffect(() => {
    clientCallsFilter !== undefined && clientCallsFilter !== null && calls
      ? setCall(
          clientCallsFilter.map((client) => {
            return calls.map((call) => {
              return client.map((client) =>
                client.callID === call.callID
                  ? {
                      callID: call.callID,
                      clientID: client.clientID,
                      startDate: client.startDate,
                      callName: call.call,
                    }
                  : null
              );
            });
          })
        )
      : setCall([]);
  }, [clientCallsFilter, calls]);

  // get all  the packageOfCare from the database
  const [packageOfCare, setPackageOfCare] = useState();
  useEffect(() => {
    noAuth.getPOC().then((res) => setPackageOfCare(res.poc));
  }, []);

  // get all the client_poc from the database
  const [clientPOC, setClientPOC] = useState();
  useEffect(() => {
    noAuth.getClientPOC().then((res) => setClientPOC(res.client_poc));
  }, []);

  // compare the clientCalls with the current carer
  const [carerClientPOC, setCarerClientPOC] = useState();
  useEffect(() => {
    clientPOC !== undefined && clientPOC !== null
      ? setCarerClientPOC(
          clientPOC.filter((poc) =>
            poc !== null ? poc.carerID === parseInt(id) : null
          )
        )
      : setCarerClientPOC([]);
  }, [clientPOC]);

  // get all the client_calls that match the start date
  const [clientPOCDate, setClientPOCDate] = useState([]);
  useEffect(() => {
    carerClientPOC !== undefined && carerClientPOC !== null && carerClientPOC
      ? setClientPOCDate(
          carerClientPOC.map((poc) =>
            poc.startDate.split("T")[0] === startDate ? poc : null
          )
        )
      : setClientPOCDate([]);
  }, [carerClientPOC, startDate]);

  // match the clientPOCDate with the currentClients
  const [clientPOCFilter, setClientPOCFilter] = useState([]);
  useEffect(() => {
    clientPOCDate !== undefined && clientPOCDate !== null
      ? setClientPOCFilter(
          currentClients.map((client) =>
            clientPOCDate.filter((poc) =>
              poc !== null ? client.clientID === poc.clientID : null
            )
          )
        )
      : setClientPOCFilter([]);
  }, [clientPOCDate, currentClients]);
  // add the POC from packageOfCare and add it to the clientPOCFilter
  const [poc, setPOC] = useState([]);
  useEffect(() => {
    clientPOCFilter !== undefined && clientPOCFilter !== null && packageOfCare
      ? setPOC(
          clientPOCFilter.map((client) => {
            return packageOfCare.map((poc) => {
              return client.map((client) =>
                client.POC_ID === poc.POC_ID
                  ? {
                      POC_ID: poc.POC_ID,
                      clientID: client.clientID,
                      startDate: client.startDate,
                      POCName: poc.PackageOfCare,
                    }
                  : null
              );
            });
          })
        )
      : setPOC([]);
  }, [clientPOCFilter, packageOfCare]);

  let arrPOC = [];
  poc.concat.apply([], poc).map((clientPOC) => {
    arrPOC.push(...clientPOC);
    // filter out the null values
    arrPOC = arrPOC.filter((item) => item !== null);
    // filter out the duplicates
    arrPOC = arrPOC.filter(
      (thing, index, self) =>
        index ===
        self.findIndex(
          (t) => t.POC_ID === thing.POC_ID && t.clientID === thing.clientID
        )
    );
  });

  let arrx = [];
  call.concat.apply([], call).map((clientCall) => {
    arrx.push(...clientCall);
    // filter out the null values
    arrx = arrx.filter((x) => x !== null);
    // filter out the duplicates
    arrx = arrx.filter(
      (thing, index, self) =>
        index ===
        self.findIndex(
          (t) => t.callID === thing.callID && t.clientID === thing.clientID
        )
    );
  });

  let array = [];
  clientName.concat.apply([], clientName).map((client) => {
    if (client !== null && client !== undefined) {
      array.push(client);
    }
  });

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
  const [metricRating, setMetricRating] = useState();
  const [carerRating, setCareRating] = useState();
  useEffect(() => {
    noAuth.getMetricRatings().then((res) => {
      setMetricRating(res.metric);
    });
  }, [isEditing]);

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
    carerRating !== undefined && carerRating !== null && carerRating !== []
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
    ratingDate.length > 0 &&
    metrics &&
    ratingDate !== null &&
    metrics !== null &&
    ratingDate !== undefined &&
    metrics !== undefined
      ? setRate(
          ratingDate.map((rateDate) => {
            if (rateDate !== null && rateDate !== undefined) {
              return metrics.map((metric) =>
                rateDate.metricID === metric.metricNameID &&
                rateDate.ratingID !== null &&
                rateDate.ratingID !== undefined
                  ? {
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
  const [compliedMetric, setCompliedMetric] = useState();
  const [carerComplied, setCareComplied] = useState();
  useEffect(() => {
    noAuth.getMetricComplied().then((res) => {
      setCompliedMetric(res.metric);
    });
    // }
  }, [isEditing]);

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
  }, [isEditing]);

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
    if (comment !== null && comment !== undefined) {
      currentPerformance.push(comment);
      // filter out duplicates
      currentPerformance = currentPerformance.filter(
        (thing, index, self) =>
          index ===
          self.findIndex((t) => {
            if (t !== undefined) {
              return t.metricID === thing.metricID;
            }
          })
      );
    }
  });

  // as soon as the app mounts to the DOM
  useEffect(() => {
    if (currentPerformance && authenticatedUser) {
      currentPerformance.filter((user) =>
        user !== null &&
        user !== undefined &&
        user.userID === authenticatedUser.id
          ? setIsEditing(true)
          : setIsEditing(false)
      );
    }
    // populate the array with info that is used in the useEffect
  }, [currentPerformance, authenticatedUser]);

  //create an updateCourse function that navigates to the the update page for
  // the course selected
  const updateCarer = () => navigate(`/carers/${id}/assessed/update`);

  return carer && currentClients.length > 0 ? (
    <div>
      <div className="wrapper">
        <div className="carerName">
          <div className="carerInitials-name">
            <h3>
              {carer.forename} {carer.surname}
            </h3>
            <span className="initial">{carer.initials}</span>
          </div>
          <div className="npc">
            <span>NPC: {carer.NPC}</span>
          </div>
          <div className="downloadAverageBtn">
            <DownloadAve currentCarer={carer} currentDate={startDate} />
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
      >
        <h3
          style={{
            color: "#5e3a98",
            margin: "30px 0",
            textDecoration: "underline",
          }}
        >
          Client List for {startDate}
        </h3>

        <div
          className="btn-container"
          style={{ margin: "20px 0", display: "flex", flexWrap: "wrap" }}
        >
          {isEditing ? ( //if "isEditing" is true display the update and delete buttons
            <>
              <button className="button" onClick={updateCarer}>
                Edit Carer
              </button>
            </>
          ) : (
            <></>
          )}
          {currentPerformance === null ||
          currentPerformance === undefined ||
          currentPerformance.length === 0 ||
          currentPerformance === [] ? (
            <button
              className="button button-primary"
              style={{
                cursor: "pointer",
                maxHeight: "50px",
              }}
              onClick={() => navigate(`/carers/${id}/continueassessment`)}
            >
              Assess Carer
            </button>
          ) : (
            <></>
          )}
          <button
            onClick={() => navigate(`/carers/${id}/performance`)}
            className="button button-primary"
            style={{
              cursor: "pointer",
              maxHeight: "50px",
            }}
          >
            View Charts
          </button>
          <button
            onClick={props.handlePrint}
            className="button btn-primary btn"
          >
            Print
          </button>

          <Link
            to={`/carers/${id}/assessed/select`}
            className="button button-secondary"
            style={{ maxHeight: "50px" }}
          >
            Back
          </Link>
        </div>
      </div>
      <div className="wrap main--grid">
        {array.length > 0 ? (
          array
            .filter(
              (value, index, self) =>
                index === self.findIndex((t) => t.clientID === value.clientID)
            )
            .map((client, index) => (
              <div key={index} className="client-box-item">
                <div className="client-name-schedule">
                  <h2 className="carer--label">
                    {client.forename} {client.surname}
                  </h2>
                  <span className="client--schedule">{client.regionName}</span>
                </div>
                <div className="client-calls">
                  <div className="clientData">
                    <div
                      style={{
                        display: "flex",
                        color: "#fff",
                        alignContent: "center",
                      }}
                    >
                      <span
                        style={{
                          marginTop: "10px",
                          marginRight: "3px",
                          fontWeight: "100",
                          fontSize: "17px",
                        }}
                      >
                        Calls:
                      </span>
                      {arrx.length > 0 ? (
                        arrx.map((call, i) =>
                          call !== null && call.clientID === client.clientID ? (
                            <div key={i} className="call">
                              <p
                                style={{
                                  margin: "0 5px",
                                  backgroundColor: "#fff",
                                  color: "#000",
                                  padding: "3px",
                                  borderRadius: "5px",
                                  fontWeight: "400",
                                  fontSize: "17px",
                                }}
                              >
                                {call.callName}
                              </p>
                            </div>
                          ) : null
                        )
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    color: "#fff",
                    alignContent: "center",
                  }}
                >
                  <span
                    style={{
                      color: "#fff",
                      fontWeight: "100",
                      fontSize: "17px",
                      marginTop: "12px",
                    }}
                  >
                    Package Of Care:
                  </span>
                  {arrPOC.length > 0 ? (
                    arrPOC.map((poc, i) =>
                      poc !== null && poc.clientID === client.clientID ? (
                        <div key={i} className="poc">
                          <p
                            style={{
                              margin: "0 5px",

                              fontWeight: "400",
                              fontSize: "17px",
                            }}
                          >
                            {poc.POCName}
                          </p>
                        </div>
                      ) : null
                    )
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            ))
        ) : (
          <p>{array.forename}</p>
        )}
      </div>
      <div>
        <MetricEvaluated currentPerformance={currentPerformance} />
      </div>
      {/* FOR PRINT FORMAT ONLY */}
      <div style={{ display: "none" }}>
        <ComponentToPrint
          ref={ref}
          carer={carer}
          startDate={startDate}
          arrx={arrx}
          array={array}
          arrPOC={arrPOC}
          currentPerformance={currentPerformance}
        />
      </div>
      {/* END OF PRINT FORMAT */}
    </div>
  ) : carer ? (
    <div>
      <h2 style={{ textAlign: "center", fontSize: "20px", fontWeight: "bold" }}>
        No Clients Assessed for {carer.forename} {carer.surname} on {startDate}
      </h2>
      <div style={{ display: "flex" }}>
        <Link
          to={`/carers/${id}/assessed/select`}
          className="button button-primary"
          style={{ margin: "0 auto", maxHeight: "50px" }}
        >
          Back
        </Link>
      </div>
    </div>
  ) : (
    <></>
  );
});
