import React, { useContext, useState, useEffect } from "react";
import { Context } from "../Context";
import { useNavigate } from "react-router-dom";

function ClientBox({ clients, carer, change, select, startDate, endDate }) {
  const { sDData, cPData } = useContext(Context);
  const navigate = useNavigate();
  // get all client regions from the database
  const [clientRegions, setClientRegions] = useState([]);
  useEffect(() => {
    sDData.getRegions().then((res) => setClientRegions(res.regions));
  }, []);

  // get all clients
  const [allClients, setAllClients] = useState([]);
  useEffect(() => {
    cPData.getAllClients().then((res) => setAllClients(res));
  }, []);

  const [carerClients, setCarerClients] = useState({});
  useEffect(() => {
    setCarerClients([
      ...Object.entries(clients).map(([key, value]) => {
        return {
          id: value.clientID,
          CPID: value.CPID,
          forename: value.forename,
          surname: value.surname,
          regions: allClients.filter((client) => {
            return client.identifier === value.CPID;
          }),
        };
      }),
    ]);
  }, [allClients, clients]);

  // set the current clients's regionIDs
  const [currentClientRegionID, setCurrentClientRegionID] = useState([]);
  useEffect(() => {
    setCurrentClientRegionID([
      ...Object.entries(carerClients).map(([key, value]) => {
        if (value.CPID === value.regions[0].identifier) {
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
                  }))
                : region.regionID[0].regionID,
            clientID: region.clientID,
          };
        }),
      ]);
    }
  }, [currentClientRegionID]);
  // Create array to hold filtered regionsID
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

  // Post the filteredRegions to the database
  useEffect(() => {
    sDData.setClientRegion(array);
  }, [array]);

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

  // Post the carerClientDates to the database
  useEffect(() => {
    // if carerClientDates is not empty
    if (carerClientDates.length > 0) sDData.setCarerClients(carerClientDates);
  }, [carerClientDates]);

  return (
    <>
      {carerClients.length >= 1 ? (
        carerClients.map((client, index) => (
          <div key={index} className="client-box-item">
            <div className="client-name-schedule">
              <h2 className="carer--label">
                {client.forename} {client.surname}
              </h2>
              <span className="client--schedule">
                {client.regions[0].regions.length === 1
                  ? client.regions[0].regions[0].name.includes("Schedule")
                    ? client.regions[0].regions[0].name.split(" ")[1]
                    : client.regions[0].regions[0].name
                  : client.regions[0].regions.map((region, i) => {
                      return region.name.includes("Schedule")
                        ? `${region.name.split(" ")[1]} | `
                        : region.name;
                    })}
              </span>
            </div>
            <div className="client-calls">
              <div className="clientData">
                <div className="calls">
                  <span>Calls:</span>
                  {calls.map((call, i) => {
                    return (
                      <>
                        <input
                          key={i}
                          type="checkbox"
                          onChange={change}
                          value={call.callID}
                          name="callID"
                          id={client.id}
                        />
                        <label>{call.call[0]}</label>
                      </>
                    );
                  })}
                </div>
                <select
                  className="POC"
                  onChange={select}
                  name="POC_ID"
                  id={client.id}
                >
                  <option value="">Package Of Carer...</option>
                  {poc.map((p, i) => {
                    return (
                      <option key={i} value={p.POC_ID}>
                        {p.PackageOfCare}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
          </div>
        ))
      ) : (
        <h3 className="noClients">
          {carer.forename + " " + carer.surname} has no client appointments for
          the selected date
        </h3>
      )}
    </>
  );
}

export default ClientBox;
