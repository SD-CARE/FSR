/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import CircularProgress from "@mui/material/CircularProgress";

function ClientBox({ carerClients, change, select, calls, poc }) {
  return (
    <>
      {carerClients &&
      carerClients.length >= 1 &&
      carerClients !== null &&
      carerClients !== undefined ? (
        carerClients.map((client, index) => (
          <div key={index} className="client-box-item">
            <div className="client-name-schedule">
              <h2 className="carer--label">
                {client.forename} {client.surname}
              </h2>
              <span className="client--schedule">
                {client.regions[0] !== undefined && client.regions[0] !== null
                  ? client.regions[0].regions.length === 1
                    ? client.regions[0].regions[0].name.includes("Schedule")
                      ? client.regions[0].regions[0].name.split(" ")[1]
                      : client.regions[0].regions[0].name
                    : client.regions[0].regions.map((region, i) => {
                        return region.name.includes("Schedule") ? (
                          <div style={{ display: "inline" }} key={i}>{`${
                            region.name.split(" ")[1]
                          } | `}</div>
                        ) : (
                          region.name
                        );
                      })
                  : null}
              </span>
            </div>
            <div className="client-calls">
              <div className="clientData">
                <div className="calls">
                  <span>Calls: </span>
                  {/* {calls.map((call, i) => {
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
                  })} */}
                  <select
                    // className="POC"
                    style={{
                      marginBottom: "0px",
                      marginLeft: "10px",
                      padding: "5px",
                    }}
                    onChange={change}
                    name="callID"
                    id={client.id}
                  >
                    <option value="">Choose...</option>
                    {calls.map((call, i) => {
                      return (
                        <option key={i} value={call.callID}>
                          {call.call}
                        </option>
                      );
                    })}
                  </select>
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
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
          }}
        >
          <CircularProgress style={{ color: "#5e3a98" }} />
        </div>
      )}
    </>
  );
}

export default ClientBox;
