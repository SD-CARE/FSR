// Retrieve all courses from /api/ carer
// Each course is a link to / carer/:id
// Renders a link to "Create carer"

import React, { useContext, useState, useEffect } from "react";
import { Context } from "../Context";
import { Link } from "react-router-dom";

function Carers() {
  // pull in the data from the context api
  const { setRegionsName, sDData, cPData } = useContext(Context);
  const [query, setQuery] = useState("");

  // get all the carers from the api
  const [carers, setCarers] = useState();
  useEffect(() => {
    sDData.getCarers().then((carers) => {
      setCarers(carers.carers);
    });
  }, []);
  // GET ALL CARERS
  const [allCarers, setAllCarers] = useState([]);
  // These are the carers from the careplanner API
  useEffect(() => {
    // call the "getcarers" method from the data
    cPData
      .getAllCarers()
      // then set the carers in state with the "res" from the api
      .then((res) => setAllCarers(res))
      // catch any errors returned by the Rest Api
      .catch((err) => console.log(err));
  }, []);
  const cpid = carers ? carers.map((carer) => carer.CPID) : [];

  useEffect(() => {
    sDData.getCarers();
  });

  // merge allCarers and carers into one object
  const [mergedCarers] = useState([]);
  useEffect(() => {
    Object.entries(allCarers).filter(([key, value]) => {
      carers.forEach((carer) =>
        carer.CPID === value.identifier
          ? mergedCarers.push({
              carerID: carer.carerID,
              forename: value.forename,
              surname: value.surname,
              regions: value.regions,
            })
          : null
      );
    });
  }, [allCarers, carers]);

  // merge allcarers and carers into one array of objects
  const [arr, setArr] = useState([]);
  useEffect(() => {
    setArr([...mergedCarers, ...allCarers]);
  }, [mergedCarers, allCarers]);

  // GET ALL regions
  const [regions, setRegions] = useState([]);
  // These are the schedules from the careplanner API
  useEffect(() => {
    // call the "getSchedules" method from the data
    cPData
      .allRegions()
      // then set the schedules in state with the "res" from the api
      .then((res) =>
        setRegions(
          [...new Set(res)].map((item) => {
            return {
              CPID: item.identifier,
              regionName:
                item.name.split(" ")[0] === "Schedule"
                  ? item.name.split(" ")[1]
                  : item.name,
            };
          })
        )
      )
      // catch any errors returned by the Rest Api
      .catch((err) => console.log(err));
  }, []);

  // CREATE ALL REGIONS IN OUR DATABASE
  useEffect(() => {
    regions.length >= 1
      ? sDData.createRegions(regions)
      : console.log("no regions");
  }, [regions]);

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
        {arr.length > 0 && arr.filter((r) => r.carerID !== null) ? (
          arr
            .filter(
              (carer, index, self) =>
                index ===
                self.findIndex(
                  (t) =>
                    t.forename === carer.forename && t.surname === carer.surname
                )
            )
            .filter(
              (carer) =>
                carer.forename.toLowerCase().includes(query) ||
                carer.surname.toLowerCase().includes(query)
            )
            .map((carer, index) => (
              <form key={index}>
                <Link
                  to={`/carers/${
                    carer.carerID
                      ? carer.carerID + "/assessed/select"
                      : `NPC/create/${carer.identifier}`
                  }`}
                  className={`carer--module ${
                    carer.carerID ? "active" : "not-active"
                  }`}
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
                  <svg
                    className="carer--icon"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 31.955 31.955"
                  >
                    <g fill="#030104">
                      <path d="M27.25 4.655c-6.254-6.226-16.37-6.201-22.594.051-6.227 6.254-6.204 16.37.049 22.594 6.256 6.226 16.374 6.203 22.597-.051 6.224-6.254 6.203-16.371-.052-22.594z" />
                      <path d="M13.288 23.896l-1.768 5.207c2.567.829 5.331.886 7.926.17l-.665-5.416a8.382 8.382 0 01-5.493.039zM8.12 13.122l-5.645-.859a13.856 13.856 0 00.225 8.143l5.491-1.375a8.391 8.391 0 01-.071-5.909zm20.643-1.789l-4.965 1.675a8.39 8.39 0 01-.247 6.522l5.351.672a13.868 13.868 0 00-.139-8.869zm-17.369-8.45l1.018 5.528a8.395 8.395 0 016.442-.288l1.583-5.137a13.855 13.855 0 00-9.043-.103z" />
                      <circle cx="15.979" cy="15.977" r="6.117" />
                    </g>
                  </svg>
                </Link>
              </form>
            ))
        ) : (
          <h1>loading...</h1>
        )}
      </div>
    </>
  );
}

export default Carers;
