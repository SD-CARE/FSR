/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Context } from "../Context";
import NPC from "../NPC.json";
import Metrics from "../metrics";
function Landing() {
  const { sDData, cPData } = useContext(Context);

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
  }, []);

  // POST ALL CARERS
  const [carer, setCarer] = useState([]);
  const [carersWithNPC, setCarersWithNPC] = useState({
    CPID: "",
    forename: "",
    surname: "",
    NPC: "",
    initials: "",
  });

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

  useEffect(() => {
    setCarer([
      ...Object.entries(allCarers).map(([key, value]) => {
        return {
          CPID: value.identifier,
          forename: value.forename,
          surname: value.surname,
          initials: `${value.forename.charAt(0)}${value.surname.charAt(0)}`,
        };
      }),
    ]);
  }, [allCarers]);
  // Compare Names in Carer with NPC object
  const handleChange = (e) => {
    if (e.length > 0 && e !== []) {
      e.filter((carer) => {
        const name = `${carer.forename} ${carer.surname}`;
        NPC.forEach((npc) => {
          if (npc["Staff Name"] === name) {
            carer.NPC = npc["Employee No"].split(" ").pop();
          }
        });
      });
      setCarersWithNPC([
        ...Object.entries(e).map(([key, value]) => {
          if (e[key].NPC !== undefined) {
            return {
              CPID: value.CPID,
              forename: value.forename,
              surname: value.surname,
              initials: `${value.forename.charAt(0)}${value.surname.charAt(0)}`,
              NPC: value.NPC,
            };
          }
        }),
      ]);
    }
  };
  useEffect(() => {
    handleChange(carer);
  }, [carer]);

  useEffect(() => {
    if (carersWithNPC.length !== undefined) {
      sDData.createCarers(
        carersWithNPC.filter((carer) => {
          return carer !== undefined;
        })
      );
    }
  }, [carersWithNPC]);

  // POST ALL CLIENTS
  const [client, setClient] = useState({
    forename: "",
    surname: "",
    CPID: "",
  });

  useEffect(() => {
    setClient([
      ...Object.entries(clients).map(([key, value]) => {
        return {
          forename: value.forename,
          surname: value.surname,
          CPID: value.identifier,
        };
      }),
    ]);
  }, [clients]);

  useEffect(() => {
    client ? sDData.createClients(client) : console.log("No clients");
  }, [client]);

  // Metrics create
  const [metrics, setMetrics] = useState([]);
  useEffect(() => {
    setMetrics([
      ...Object.entries(Metrics).map(([key, value]) => {
        return {
          performanceMetric: value["Performance Metrics"],
        };
      }),
    ]);
  }, []);
  useEffect(() => {
    if (metrics.length >= 1) {
      sDData.createMetrics(metrics);
    }
  }, [metrics]);

  // Create POC
  // Create an arrary of Package Of Care
  const [poc, setPoc] = useState([]);
  const [pocObject, setPocObject] = useState({});
  useEffect(() => {
    setPoc([
      "OM",
      "BD",
      "TDS",
      "QDS",
      "DH-OM",
      "DH-BD",
      "DH-TDS",
      "DH-QDS",
      "SIT-IN",
    ]);
  }, []);

  useEffect(() => {
    if (poc.length >= 1) {
      setPocObject(
        Object.entries(poc).map(([key, value]) => {
          return {
            PackageOfCare: value,
          };
        })
      );
    }
  }, [poc]);

  useEffect(() => {
    if (pocObject.length >= 1) sDData.createPOC(pocObject);
  }, [pocObject]);

  // Create calls
  const [calls, setCalls] = useState([]);
  useEffect(() => {
    setCalls(["Breakfast", "Lunch", "Dinner", "Tea"]);
  }, []);
  const [callsObject, setCallsObject] = useState({});
  useEffect(() => {
    if (calls.length >= 1) {
      setCallsObject(
        Object.entries(calls).map(([key, value]) => {
          return {
            call: value,
          };
        })
      );
    }
  }, [calls]);

  useEffect(() => {
    if (callsObject.length >= 1) {
      sDData.createCalls(callsObject);
    }
  }, [callsObject]);

  // Create Ratings
  const [ratings, setRatings] = useState([]);
  useEffect(() => {
    setRatings(["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]);
  }, []);
  const [ratingsObject, setRatingsObject] = useState({});
  useEffect(() => {
    if (ratings.length >= 1) {
      setRatingsObject(
        Object.entries(ratings).map(([key, value]) => {
          return {
            rating: value,
          };
        })
      );
    }
  }, [ratings]);

  useEffect(() => {
    if (ratingsObject.length >= 1) {
      sDData.createRatings(ratingsObject);
    }
  }, [ratingsObject]);

  // Create Complied
  const [complied, setComplied] = useState([]);
  useEffect(() => {
    setComplied(["Complied", "Not Complied"]);
  }, []);
  const [compliedObject, setCompliedObject] = useState({});
  useEffect(() => {
    if (complied.length >= 1) {
      setCompliedObject(
        Object.entries(complied).map(([key, value]) => {
          return {
            compliedNotComplied: value,
          };
        })
      );
    }
  }, [complied]);

  useEffect(() => {
    if (compliedObject.length >= 1) {
      sDData.createComplied(compliedObject);
    }
  }, [compliedObject]);

  return (
    <div className="landing--container">
      <div className="client-carer-container">
        <Link to="/clients" className="carer--module course--link landing">
          Clients
        </Link>
        <Link to="/carers" className="carer--module course--link landing">
          Carers
        </Link>
      </div>
      <div className="performance-metrics-container">
        <Link
          to="/annualmetrics"
          className="carer--module course--link landing"
        >
          Performance Metrics
        </Link>
      </div>
    </div>
  );
}

export default Landing;
