/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";

function ClientBox({ carerClients, carer, change, select, calls, poc }) {
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
                        return region.name.includes("Schedule")
                          ? `${region.name.split(" ")[1]} | `
                          : region.name;
                      })
                  : null}
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
      ) : carer !== undefined ? (
        <h3 className="noClients">
          {carer.forename + " " + carer.surname} has no client appointments for
          the selected date
        </h3>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
}

export default ClientBox;
