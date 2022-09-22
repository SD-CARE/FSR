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
import AnnualBarMetric from "./AnnualBarMetric";
import { Context } from "../../Context";
export const AnnualMetrics = React.forwardRef((props, ref) => {
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
  const { sDData, carerDateRange } = useContext(Context);

  // when the component is mounted
  useEffect(() => {
    sDData
      .getCarers()
      .then((carer) => setCarers(carer.carers.map((carer) => carer)));
  }, [sDData]);

  // Get the ratings from the database
  const [ratings, setRatings] = useState([]);
  useEffect(() => {
    sDData.getRatings().then((res) => setRatings(res.ratings));
  }, []);

  // get all metricRating
  const [metricRating, setMetricRating] = useState([]);
  useEffect(() => {
    sDData.getMetricRatings().then((res) => setMetricRating(res.metric));
  }, []);

  // create all date graphs
  const [data, setData] = useState([]);
  useEffect(() => {
    metricRating
      ? setData([
          metricRating.map((rating) => {
            const date = new Date(rating.startDate);
            const year = date.getFullYear();
            const month = date.getMonth();
            const day = date.getDate();
            return {
              year: year,
              month: month,
              day: day,
            };
          }),
        ])
      : setData([]);
  }, [metricRating]);

  // filter out duplicate dates
  const [uniqueDates, setUniqueDates] = useState([]);
  useEffect(() => {
    data && data.length > 0
      ? setUniqueDates(
          data[0].filter(
            (date, index, self) =>
              index ===
              self.findIndex(
                (t) =>
                  t.year === date.year &&
                  t.month === date.month &&
                  t.day === date.day
              )
          )
        )
      : setUniqueDates([]);
  }, [data]);
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
              rating: ratings.filter(
                (rate) => rating.ratingID === rate.ratingID
              ),
            };
          })
        )
      : setCarerRatings([]);
  }, [carerRating]);

  //  group all ratings by carerID and startDate in an array
  const [carerRatingsGrouped, setCarerRatingsGrouped] = useState([]);
  useEffect(() => {
    carerRatings !== undefined && carerRatings !== null
      ? setCarerRatingsGrouped(
          carerRatings.reduce((r, a) => {
            r[a.startDate] = r[a.startDate] || [];
            r[a.startDate].push(a);

            return r;
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
    startDate: [],
  });
  useEffect(() => {
    setAllTheRatingDates([
      Object.entries(carerRatingsGrouped).map(([key, value]) => {
        let carers = [];
        value.map((carer) =>
          currcarer.filter((c) =>
            c.carerID === carer.carerID ? carers.push(c) : null
          )
        );
        let ratings = [];
        value.map((rating) =>
          ratings.push({
            rating: rating.rating[0].rating ? rating.rating[0].rating : null,
            carerID: rating.carerID,
          })
        );
        return {
          rating: ratings,
          carer: carers.filter(
            (c, index, self) =>
              index ===
              self.findIndex(
                (t) =>
                  t.carerID === c.carerID &&
                  t.startDate === c.startDate &&
                  t.endDate === c.endDate
              )
          ),

          date: key,
        };
      }),
    ]);
  }, [carerRatingsGrouped]);
  console.log(allTheRatingDates[0]);
  return currcarer !== undefined &&
    currcarer !== null &&
    currcarer.length > 0 ? (
    <div ref={ref} className="wrap">
      <h2>Annual Performance Metrics</h2>
      <div className="months">
        {allTheRatingDates[0] !== undefined &&
        allTheRatingDates[0] !== null &&
        allTheRatingDates[0].length > 0
          ? allTheRatingDates[0].map((date, i) => (
              <AnnualBarMetric
                carers={date.carer}
                date={date.date}
                key={i}
                rating={date.rating}
              />
            ))
          : null}
      </div>
    </div>
  ) : null;
});
