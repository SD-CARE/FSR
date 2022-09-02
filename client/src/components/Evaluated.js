import React, { useContext, useEffect, useState } from "react";
import { Context } from "../Context";
import { Link, useParams } from "react-router-dom";
import MetricEvaluated from "./MetricEvaluated";
function Evaluated() {
  const { sDData, carerDateRange } = useContext(Context);
  const { id } = useParams();
  // GET THE CARER
  const [carer, setCarer] = useState();
  useEffect(() => {
    sDData
      .getCarer(id)
      .then((res) => setCarer(res.carers))
      .catch((err) => console.log(err));
  }, [id]);

  // get all clients from the database
  const [clients, setClients] = useState([]);
  useEffect(() => {
    sDData.getClients().then((res) => setClients(res.clients));
  }, []);

  // get client_regions
  const [clientRegion, setClientRegions] = useState();
  useEffect(() => {
    sDData
      .getClientRegion()
      .then((res) => setClientRegions(res.client_regions));
  }, []);

  // Get all the regions from the database
  const [regions, setRegions] = useState([]);
  useEffect(() => {
    sDData.getRegions().then((res) => setRegions(res.regions));
    setRegions([]);
  }, []);

  // get all carer_clients
  const [carerClients, setCarerClients] = useState();
  useEffect(() => {
    sDData
      .getCarerClients()
      .then((res) =>
        setCarerClients(
          res.carer_clients.filter(
            (value, index, self) =>
              index ===
              self.findIndex(
                (t) =>
                  t.clientID === value.clientID &&
                  t.startDate === value.startDate &&
                  t.endDate === value.endDate
              )
          )
        )
      );
  }, []);

  const [startDate, setStartDate] = useState();
  useEffect(() => {
    const start = new Date(carerDateRange.selection.startDate);
    start.setDate(start.getDate() + 1);
    setStartDate(start.toISOString().split("T")[0]);
  }, [carerDateRange]);
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
      : console.log("no clientRegionDate");
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
    sDData.getCalls().then((res) => setCalls(res.calls));
  }, []);

  // get all client_calls from the database
  const [clientCalls, setClientCalls] = useState();
  useEffect(() => {
    sDData.getClientCalls().then((res) => setClientCalls(res.client_calls));
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
    sDData.getPOC().then((res) => setPackageOfCare(res.poc));
  }, []);

  // get all the client_poc from the database
  const [clientPOC, setClientPOC] = useState();
  useEffect(() => {
    sDData.getClientPOC().then((res) => setClientPOC(res.client_poc));
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
  });

  let arrx = [];
  call.concat.apply([], call).map((clientCall) => {
    arrx.push(...clientCall);
  });

  let array = [];
  clientName.concat.apply([], clientName).map((client) => {
    if (client !== null && client !== undefined) {
      array.push(client);
    }
  });

  return carer && currentClients.length > 0 ? (
    <>
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
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignContent: "center",
          flexWrap: "wrap",
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
        <Link
          to={`/carers/${id}/assessed/select`}
          className="button button-secondary"
          style={{ margin: "20px 0 20px 20px", maxHeight: "50px" }}
        >
          Back
        </Link>
      </div>
      <div className="wrap main--grid">
        {array.length > 1 ? (
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
        <MetricEvaluated
          carer={carer}
          startDate={startDate}
          sDData={sDData}
          id={id}
        />
      </div>
    </>
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
}

export default Evaluated;
