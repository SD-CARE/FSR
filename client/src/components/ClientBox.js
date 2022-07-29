import React, { useEffect, useContext, useState } from "react";
import { Context } from "../Context";

function ClientBox({ currentCarerSchedule }) {
  const { currentstartDate, currentendDate, currentCarer, cPData, poc } =
    useContext(Context);
  // create exact date string for the appointments
  const start = currentstartDate.getTimezoneOffset() * 60000; //offset in milliseconds
  const end = currentendDate.getTimezoneOffset() * 60000; //offset in milliseconds
  const startISO =
    new Date(currentstartDate - start).toISOString().split("T")[0] +
    "T00:00:00.000Z";
  const endISO =
    new Date(currentendDate - end).toISOString().split("T")[0] +
    "T23:59:00.000Z";
  // get the current carer's appointments for the selected date
  const [regionsID, setRegionsID] = useState([]);
  const [clientID, setClientID] = useState([]);
  useEffect(() => {
    // Get regions/schedule identifiers
    if (currentCarer.regions.length > 1) {
      setRegionsID(
        currentCarer.regions.map((regions) => `"${regions.identifier}"`)
      );
    } else {
      setRegionsID(`"${currentCarer.regions[0].identifier}"`);
    }
  }, [currentCarer.regions]);

  // Get all clients IDs for the current carer
  useEffect(() => {
    // call the "getcarers" method from the data
    if (regionsID) {
      cPData
        .appointments(currentCarer.identifier, startISO, endISO, regionsID)
        // then set the carers in state with the "res" from the api
        .then((res) => {
          setClientID(res.map((appointment) => `"${appointment.client}"`));
        })
        // catch any errors returned by the Rest Api
        .catch((err) => console.log(err));
    } else {
      console.log("No regions");
    }
  }, [cPData, currentCarer, startISO, endISO, regionsID]);

  // Get client information using the client ID
  const [clients, setClients] = useState([]);

  // Get client Name
  useEffect(() => {
    cPData
      .getClients(clientID)
      // Get the clients' Name
      .then((res) => {
        setClients(res.map((clients) => clients));
      });
  }, [cPData, clientID]);

  // Set loading
  // const [loading, setLoading] = useState(true);
  // useEffect(() => {
  //   if (clients.length > 0) {
  //     setLoading(false);
  //   }
  // }, [clients]);

  return (
    <>
      {clients.length >= 1 ? (
        clients.map((client, i) => (
          <div key={i} className="client-box-item">
            <div className="client-name-schedule">
              <h2 className="carer--label">
                {client.forename} {client.surname}
              </h2>
              <span className="client--schedule">
                {client.regions[0].name.split(" ").pop()}
              </span>
            </div>

            <form className="client-calls">
              <table>
                <tbody className="clientData">
                  <tr>
                    <div className="calls">
                      <td>Calls:</td>
                      <td className="call-select">
                        <div className="calls">
                          <input
                            type="checkbox"
                            name="breakfast"
                            id="breakfast"
                          />
                          <label for="breakfast">B</label>
                        </div>
                        <div className="calls">
                          <input
                            type="checkbox"
                            name="breakfast"
                            id="breakfast"
                          />
                          <label for="breakfast">L</label>
                        </div>
                        <div className="calls">
                          <input
                            type="checkbox"
                            name="breakfast"
                            id="breakfast"
                          />
                          <label for="breakfast">T</label>
                        </div>
                        <div className="calls">
                          <input
                            type="checkbox"
                            name="breakfast"
                            id="breakfast"
                          />
                          <label for="breakfast">D</label>
                        </div>
                      </td>
                    </div>
                  </tr>
                  <tr className="poc">
                    <td>POC:</td>
                    <td>
                      <select name="poc" id="poc">
                        <option value="">Choose...</option>
                        {poc.map((poc, i) => (
                          <option key={i} value={poc}>
                            {poc}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                  <tr className="dateOfCare"></tr>
                </tbody>
              </table>
            </form>
          </div>
        ))
      ) : (
        <h3 className="noClients">
          {currentCarer.forename} has no client appointments for the selected
          date
        </h3>
      )}
    </>
  );
}

export default ClientBox;
