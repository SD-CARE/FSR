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
  const { setCurrentEndDate, setCurrentStartDate, sDData, cPData } =
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
  const [region, setRegion] = useState("");

  useEffect(() => {
    carer.CPID
      ? cPData
          .getCarer(`"${carer.CPID}"`)
          .then((res) =>
            setRegion(
              res[0].regions.length >= 1
                ? res[0].regions.map((region) => region.identifier)
                : res[0].regions[0].identifier
            )
          )
      : setRegion("");
  }, [carer]);

  // COMPARE THE REGIONS ID IN THE DATABASE WITH THE ONE COMING FROM THE API

  // get the regions from the database
  const [regions, setRegions] = useState([]);
  useEffect(() => {
    if (region.length >= 1) {
      sDData.getRegions().then((res) => setRegions(res.regions));
    }
  }, [region]);

  const [currentRegions, setCurrentRegions] = useState([]);
  useEffect(() => {
    setCurrentRegions(
      regions.map((reg) => {
        if (region.length > 1 && region.includes(reg.CPID)) {
          return reg.regionID;
        } else if (region.length === 1 && reg.CPID === region.toString()) {
          return reg.regionID;
        }
      })
    );
  }, [regions]);
  // convert the regions array into an object
  const [regionObject, setRegionObject] = useState({});
  useEffect(() => {
    if (currentRegions.length >= 1) {
      const filteredRegions = currentRegions.filter((reg) => reg !== undefined);
      filteredRegions.length >= 1
        ? setRegionObject(filteredRegions)
        : console.log("no regions");
    }
  }, [currentRegions]);

  // SET CARER_REGION
  const [carer_region, setCarer_region] = useState([]);

  useEffect(() => {
    if (regionObject.length >= 1 && carer !== undefined) {
      const filter = regionObject.map((reg) => ({ regionID: reg }));
      setCarer_region([
        ...Object.entries(filter).map(([key, value]) => {
          return {
            regionID: value.regionID,
            carerID: carer.carerID,
          };
        }),
      ]);
    }
  }, [regionObject, carer]);

  useEffect(() => {
    if (carer_region !== undefined) sDData.setCarerRegion(carer_region);
  }, [carer_region, sDData]);

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
                // minDate={new Date()}
              />
              <div className="btn-container">
                <button
                  type="submit"
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
