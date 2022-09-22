/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Context } from "../Context";
import { DateRangePicker } from "react-date-range";
import { addDays } from "date-fns";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import ReactTooltip from "react-tooltip";
function Carer() {
  const [startDate] = useState(new Date());
  const [endDate] = useState(new Date());
  const { sDData, setCarerDateRange } = useContext(Context);
  const { id } = useParams();
  const navigate = useNavigate();

  const selectionRange = {
    startDate: startDate,
    endDate: endDate,
    key: "selection",
  };

  const handleSelect = (ranges) => {
    setCarerDateRange(ranges);
    navigate(`/carers/${id}/assessed/detail`);
  };

  // GET THE CARER
  const [carer, setCarer] = useState();
  useEffect(() => {
    sDData
      .getCarer(id)
      .then((res) => setCarer(res.carers))
      .catch((err) => console.log(err));
  }, [id]);

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

  const [filteredCarerClients, setFilters] = useState([]);
  useEffect(() => {
    carerClients
      ? setFilters(
          carerClients.filter((client, index, self) => {
            return (
              index ===
              self.findIndex(
                (t) =>
                  t.startDate === client.startDate && parseInt(id) === t.carerID
              )
            );
          })
        )
      : setFilters([]);
  }, [carerClients]);

  const [state, setState] = useState([]);
  useEffect(() => {
    filteredCarerClients
      ? setState(
          filteredCarerClients.map((client, index) => {
            return {
              selection: {
                startDate: addDays(new Date(client.startDate), 0),
                endDate: addDays(new Date(client.endDate), -1),
                key: `selection${index}`,
              },
            };
          })
        )
      : setState([]);
  }, [filteredCarerClients]);

  return carer && state ? (
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
      <div className="top-bar-btn">
        <Link
          to={`/carers/${id}/date`}
          className="button button-primary"
          data-tip="Click here to select an appointment date to assess"
        >
          Assess
        </Link>

        <ReactTooltip place="top" type="dark" effect="solid" />
        <Link to={`/carers`} className="button btn button-secondary">
          Back
        </Link>
      </div>

      <div className="carer-detail-date">
        <h4
          style={{
            marginTop: "30px",
            paddingBottom: "30px",
            borderBottom: "2px solid black",
            textAlign: "center",
          }}
        >
          Please select date below to view Carer Detail
        </h4>
        <div className="date-container">
          <div className="datepicker-container">
            <div className="datePicker">
              <DateRangePicker
                ranges={[
                  selectionRange,
                  ...state.map((range) => range.selection),
                ]}
                rangeColors={["#5e3a98"]}
                onChange={handleSelect}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
}

export default Carer;
