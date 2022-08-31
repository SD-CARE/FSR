import React, { useContext, useEffect, useState } from "react";
import { Context } from "../Context";
import { Link, useParams, useNavigate } from "react-router-dom";

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

  //   compare startDate with startDate in client Region
  const [clientRegionDate, setClientRegionDate] = useState([]);
  useEffect(() => {
    clientRegion !== undefined && clientRegion !== null && clientRegion
      ? setClientRegionDate(
          clientRegion.map((client) =>
            client.createdAt.split("T")[0] === startDate ? client : null
          )
        )
      : console.log("no client region");
  }, [clientRegion, startDate]);

  return carer ? (
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
      <div className="client-box">
        <h3>Client List for {startDate}</h3>
        {currentClients.length > 1 ? (
          currentClients.map((client, index) => (
            <p key={index}>
              {client.forename} {client.surname}
            </p>
          ))
        ) : (
          <p>{currentClients.forename}</p>
        )}
      </div>
      <Link
        to={`/carers/${id}/assessed/select`}
        className="button button-secondary"
      >
        Back
      </Link>
    </div>
  ) : (
    <div>Loading...</div>
  );
}

export default Evaluated;
