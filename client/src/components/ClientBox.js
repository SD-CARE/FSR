import React, { useEffect, useContext, useState } from "react";
import { Context } from "../Context";

function ClientBox({ regions, carer, currentendDate, currentstartDate }) {
  const { cPData, poc, sDData } = useContext(Context);

  // // Get current carer regions
  // const [currentCarerRegionID, setCurrentCarerRegionID] = useState([]);
  // useEffect(() => {
  //   sDData.getCarerRegion().then((res) => setCurrentCarerRegionID(res));
  // }, []);
  // const [currentCarerRegion] = useState([]);
  // // Get current carer regions by comparing regions and currentCarerRegionID
  // useEffect(() => {
  //   if (
  //     currentCarerRegionID.length >= 1 ||
  //     currentCarerRegionID !== undefined
  //   ) {
  //     regions.filter((reg) => {
  //       currentCarerRegionID.carer_regions.forEach((cr) => {
  //         if (cr.regionID === reg.regionID && cr.carerID === carer.carerID) {
  //           currentCarerRegion.push(reg.CPID);
  //         }
  //       });
  //     });
  //   }
  // }, [currentCarerRegion, regions]);
  // Get CLients for the current carer from cPData

  // Get client information using the client ID
  const [clients, setClients] = useState([]);

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
          {carer.forename + " " + carer.surname} has no client appointments for
          the selected date
        </h3>
      )}
    </>
  );
}

export default ClientBox;
