// Retrieve all courses from /api/ carer
// Each course is a link to / carer/:id
// Renders a link to "Create carer"

import React, { useContext, useState, useEffect } from "react";
import { Context } from "../Context";
import CircularProgress from "@mui/material/CircularProgress";

function Clients() {
  // pull in the data from the context api
  const { setRegionsName, cPData } = useContext(Context);
  const [query, setQuery] = useState("");

  // GET ALL CLIENTS
  const [clients, setclients] = useState([]);

  // These are the clients from the careplanner API
  useEffect(() => {
    // call the "getclients" method from the data
    cPData
      .getAllClients()
      // then set the clients in state with the "res" from the api
      .then((res) => setclients(res))
      // catch any errors returned by the Rest Api
      .catch((err) => console.log(err));
  }, [cPData]);

  // set loading time for the spinner
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 2000);
    }
  }, [loading]);

  return (
    <>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search..."
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className={`wrap  ${clients.length > 0 ? "main--grid" : ""} `}>
        {clients.length > 0 ? (
          clients
            .filter(
              (client) =>
                client.forename.toLowerCase().includes(query.toLowerCase()) ||
                client.surname.toLowerCase().includes(query.toLowerCase())
            )
            .map((client, index) => (
              <form>
                <div key={index} className="carer--module">
                  <h2 className="carer--label">
                    {client.forename} {client.surname}
                  </h2>
                  <h6 className="carer--schedule">
                    Schedules:
                    {client.regions.length >= 1
                      ? client.regions.map((regions) => {
                          if (regions.name.includes("Schedule")) {
                            setRegionsName(` ${regions.name.split(" ").pop()}`);
                            return ` ${regions.name.split(" ").pop()}`;
                          } else {
                            setRegionsName(` ${regions.name}`);
                            return ` ${regions.name}`;
                          }
                        })
                      : null}
                  </h6>
                  <h6 className="carer--schedule">
                    Address:
                    {client.address.address}
                  </h6>
                </div>
              </form>
            ))
        ) : loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignContent: "center",
            }}
          >
            <CircularProgress style={{ color: "#5e3a98" }} />
          </div>
        ) : (
          <div>
            <h2>No Clients Found</h2>
          </div>
        )}
      </div>
    </>
  );
}

export default Clients;
