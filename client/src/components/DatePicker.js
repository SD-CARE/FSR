/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import { Context } from "../Context";
import { DateRange } from "react-date-range";
import { Link, useNavigate, useParams } from "react-router-dom";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file

function DatePicker() {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const { setCurrentEndDate, setCurrentStartDate, sDData } =
    useContext(Context);

  const selectionRange = {
    startDate: startDate,
    endDate: endDate,
    key: "selection",
  };

  const navigate = useNavigate();
  const { id } = useParams();

  const handleSelect = (ranges) => {
    setStartDate(ranges.selection.startDate);
    setEndDate(ranges.selection.endDate);
  };

  startDate ? setCurrentStartDate(startDate) : setCurrentStartDate(null);
  endDate ? setCurrentEndDate(endDate) : setCurrentEndDate(null);

  const [carer, setCarer] = useState({});
  // Get the current carer from the our api
  useEffect(() => {
    sDData
      .getCarer(id)
      .then((res) => setCarer(res.carers))
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <div className="wrap">
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
        <div className="date-container">
          <div className="datepicker-container">
            <div className="datePicker">
              <DateRange
                ranges={[selectionRange]}
                rangeColors={["#5e3a98"]}
                onChange={handleSelect}
              />
              <div className="btn-container">
                <button
                  className="button btn-primary btn"
                  onClick={() => navigate(`/carers/${id}/appointment`)}
                >
                  Continue
                </button>
                <Link
                  to={`/carers/${id}/assessed/select`}
                  className="button button-secondary btn"
                >
                  Back
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DatePicker;
