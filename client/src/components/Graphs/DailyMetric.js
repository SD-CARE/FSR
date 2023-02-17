/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import DailyBarMetric from "./DailyBarMetric";
import { Context } from "../../Context";
import CircularProgress from "@mui/material/CircularProgress";
export const DailyMetric = React.forwardRef((props, ref) => {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );
  const [carers, setCarers] = useState([]);
  const { noAuth } = useContext(Context);

  // when the component is mounted
  useEffect(() => {
    noAuth
      .getCarers()
      .then((carer) => setCarers(carer.carers.map((carer) => carer)));
  }, [noAuth]);

  // Get the ratings from the database
  const [ratings, setRatings] = useState([]);
  useEffect(() => {
    noAuth.getRatings().then((res) => setRatings(res.ratings));
  }, []);

  // get all metricRating
  const [metricRating, setMetricRating] = useState([]);
  useEffect(() => {
    noAuth.getMetricRatings().then((res) => setMetricRating(res.metric));
  }, []);

  // compare the metricRating with the current carer
  const [carerRating, setCareRating] = useState();
  useEffect(() => {
    metricRating !== undefined && metricRating !== null
      ? setCareRating(
          metricRating.filter((rating) =>
            rating !== null
              ? carers.map((id) => rating.carerID === id.carerID)
              : null
          )
        )
      : setCareRating([]);
  }, [metricRating]);

  // get the ratings and carerID for each carer using carerRating
  const [carerRatings, setCarerRatings] = useState([]);
  useEffect(() => {
    carerRating !== undefined && carerRating !== null
      ? setCarerRatings(
          carerRating.map((rating) => {
            return {
              startDate: rating.startDate,
              carerID: rating.carerID,
              rating: ratings.filter((rate) => {
                if (rate !== null && rate !== undefined) {
                  return rating.ratingID === rate.ratingID;
                }
              }),
            };
          })
        )
      : setCarerRatings([]);
  }, [carerRating, ratings]);

  //  group all ratings by carerID and startDate in an array
  const [carerRatingsGrouped, setCarerRatingsGrouped] = useState();
  useEffect(() => {
    carerRatings !== undefined && carerRatings !== null
      ? setCarerRatingsGrouped(
          carerRatings.reduce((r, a) => {
            // if the a is not null and not undefined
            if (
              a.rating !== null &&
              a.rating !== undefined &&
              a.rating.length > 0
            ) {
              r[a.startDate] = r[a.startDate] || [];
              r[a.startDate].push(a);

              return r;
            }
          }, Object.create(null))
        )
      : setCarerRatingsGrouped([]);
  }, [carerRatings]);

  // get all the client_calls that match the start date
  const [carerID, setCarerID] = useState([]);
  useEffect(() => {
    carerRating !== undefined && carerRating !== null && carerRating
      ? setCarerID(
          carerRating.map((id) => {
            return {
              carerID: id.carerID,
            };
          })
        )
      : setCarerID([]);
  }, [carerRating]);

  // filter out duplicate carerID
  const [uniqueCarerID, setUniqueCarerID] = useState([]);
  useEffect(() => {
    carerID && carerID.length > 0
      ? setUniqueCarerID(
          carerID.filter(
            (id, index, self) =>
              index === self.findIndex((t) => t.carerID === id.carerID)
          )
        )
      : setUniqueCarerID([]);
  }, [carerID]);

  // filter through all carers get carer by carerID
  let currcarer = [];

  uniqueCarerID && uniqueCarerID.length > 0
    ? uniqueCarerID.map((id) => {
        return carers.filter((carer) => {
          if (carer.carerID === id.carerID) {
            currcarer.push(carer);
          }
        });
      })
    : currcarer.push([]);

  const [allTheRatingDates, setAllTheRatingDates] = useState({
    rating: [],
    carer: [],
    date: [],
  });
  let carer;
  useEffect(() => {
    if (carerRatingsGrouped !== undefined && carerRatingsGrouped !== null) {
      const allTheRatingDates = Object.keys(carerRatingsGrouped).map((key) => {
        carer = carerRatingsGrouped[key].map((carer) => carer.carerID);
        // filter out duplicate carerID
        carer = carer.filter(
          (id, index, self) => index === self.findIndex((t) => t === id)
        );

        return {
          date: key,
          rating: carerRatingsGrouped[key].map((rating) => {
            if (
              rating.rating[0] !== undefined &&
              rating.rating[0] !== null &&
              rating !== null &&
              rating !== undefined
            ) {
              return rating.rating[0].rating;
            }
          }),
          carer: carer.map((id) => {
            return carers.filter((carerName) =>
              carerName.carerID === id ? carerName : null
            );
          }),
        };
      });
      setAllTheRatingDates(allTheRatingDates);
    }
  }, [carerRatingsGrouped, carers, carer]);

  return currcarer !== undefined &&
    currcarer !== null &&
    currcarer.length > 0 ? (
    <div ref={ref} className="wrap">
      <div className="months">
        {allTheRatingDates !== undefined &&
        allTheRatingDates !== null &&
        allTheRatingDates.length > 0
          ? allTheRatingDates.map((date, i) =>
              date !== undefined ? (
                <DailyBarMetric
                  carers={date.carer}
                  date={date.date}
                  key={i}
                  rating={date.rating}
                />
              ) : (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignContent: "center",
                  }}
                >
                  <CircularProgress style={{ color: "#5e3a98" }} />
                </div>
              )
            )
          : null}
      </div>
    </div>
  ) : null;
});
