import React, { useContext, useState, useEffect } from "react";
import { Context } from "../Context";
import { DateRange } from "react-date-range";
import { Link, useNavigate } from "react-router-dom";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import NPC from "../NPC.json";

function DatePicker() {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const {
    setCurrentEndDate,
    setCurrentStartDate,
    currentCarer,
    setCurrentCarerNPC,
    currentCarerNPC,
    sDData,
    carers,
  } = useContext(Context);

  const selectionRange = {
    startDate: startDate,
    endDate: endDate,
    key: "selection",
  };
  const navigate = useNavigate();
  const handleSelect = (ranges) => {
    setStartDate(ranges.selection.startDate);
    setEndDate(ranges.selection.endDate);
  };

  startDate ? setCurrentStartDate(startDate) : setCurrentStartDate(null);
  endDate ? setCurrentEndDate(endDate) : setCurrentEndDate(null);

  // Save carer Info in the database as soon as the component mounts

  useEffect(() => {
    currentCarer
      ? NPC.forEach((npc) => {
          if (
            npc["Staff Name"].includes(currentCarer.forename) &&
            npc["Staff Name"].includes(currentCarer.surname)
          ) {
            setCurrentCarerNPC(npc["Employee No"].split(" ").pop());
          }
        })
      : setCurrentCarerNPC("");
  }, [currentCarer, setCurrentCarerNPC]);

  // Create a carer Intance
  const [carer, setCarer] = useState({
    forename: currentCarer.forename,
    surname: currentCarer.surname,
    initials: `${currentCarer.forename[0]}${currentCarer.surname[0]}`,
    NPC: "",
  });

  carer.NPC = currentCarerNPC;
  // console.log(carers);
  // // when component mounts
  // useEffect(() => {
  //   NPC
  //     ? NPC.find((npc) => {
  //         setCurrentCarerNPC(
  //           carers.map((carer) => {
  //             const name = `${carer.forename} ${carer.surname}`;
  //             if (name.indexOf(npc["Staff Name"]) !== -1) {
  //               return npc["Employee No"];
  //             }
  //           })
  //         );
  //       })
  //     : console.log("no carers");
  // }, []);

  // console.log(currentCarerNPC);
  // create an errors instance in state and set it to an empty array
  const [errors, setErrors] = useState([]);

  const change = (e) => {
    const { name, value } = e.target;
    setCarer((carer) => ({ ...carer, [name]: value }));
  };
  const submit = (e) => {
    e.preventDefault();
    sDData
      .createCarer(carer)
      .then((errors) => {
        if (errors.length) {
          setErrors(errors);
        } else {
          // navigate("/carers/1");
        }
      })
      .catch((err) => {
        console.log(err);
        // navigate("/");
      });
    // navigate("/carers/1");
  };

  return (
    <div className="wrap">
      <form onSubmit={submit}>
        <div className="carerName">
          <div className="carerInitials-name">
            <h3>
              {carer.forename} {carer.surname}
              <input
                type="hidden"
                name="forename"
                id="forename"
                value={carer.forename}
              />
              <input
                type="hidden"
                name="surname"
                id="surname"
                value={carer.surname}
              />
            </h3>
            <span className="initial">{carer.initials}</span>
            <input
              type="hidden"
              name="initials"
              id="initials"
              value={carer.initials}
            />
          </div>
          <div className="npc">
            <span>NPC:</span>
            <span>{carer.NPC}</span>
            <input type="hidden" name="npc" id="npc" value={carer.NPC} />
          </div>
        </div>

        {errors.length ? (
          <>
            <div className="validation--errors">
              <h3>Validation errors</h3>
              <ul>
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          <></>
        )}
        <div className="date-container">
          <div className="datepicker-container">
            <div className="datePicker">
              <DateRange
                ranges={[selectionRange]}
                // minDate={new Date()}
                rangeColors={["#5e3a98"]}
                onChange={handleSelect}
              />
              <div className="btn-container">
                <button
                  type="submit"
                  className="button btn-primary btn"
                  onClick={() => navigate("/carers/1")}
                >
                  Continue
                </button>
                {/* <Link to="/carers/1" className="button btn-primary btn">
                  Continue
                </Link> */}
                <Link to="/carers" className="button button-secondary btn">
                  Back
                </Link>
              </div>
              <button
                onClick={() => navigate("/carers/1/monthlymetric")}
                className="carer--module course--link view-monthlymetric"
              >
                View Performance Metrics
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default DatePicker;
