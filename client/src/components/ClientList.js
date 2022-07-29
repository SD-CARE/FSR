// Retrieve all courses from /api/ carer
// Each course is a link to / carer/:id
// Renders a link to "Create carer"

import React, { useContext, useState, useEffect } from "react";
import { Context } from "../Context";
import { Link } from "react-router-dom";

function Clients() {
  // pull in the data from the context api
  const { setCurrentCarer, setRegionsName, cPData } = useContext(Context);
  const [query, setQuery] = useState("");

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
  }, []);

  return (
    <>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search..."
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className="wrap main--grid">
        {clients
          .filter(
            (carer) =>
              carer.forename.toLowerCase().includes(query) ||
              carer.surname.toLowerCase().includes(query)
          )
          .map((carer, index) => (
            <Link
              to="/clients/1"
              key={index}
              className="carer--module course--link"
              onClick={() => {
                carer ? setCurrentCarer(carer) : setCurrentCarer(null);
              }}
            >
              <h2 className="carer--label">
                {carer.forename} {carer.surname}
              </h2>
              <h6 className="carer--schedule">
                Schedules:
                {carer.regions.length >= 1
                  ? carer.regions.map((regions) => {
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
            </Link>
          ))}
        <Link to={`/create`} className="carer--add--module carer--module">
          <span className="carer--add--title">
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              viewBox="0 0 13 13"
              className="add"
            >
              <polygon points="7,6 7,0 6,0 6,6 0,6 0,7 6,7 6,13 7,13 7,7 13,7 13,6 "></polygon>
            </svg>
            New Carer
          </span>
        </Link>
      </div>
    </>
  );
}

export default Clients;
