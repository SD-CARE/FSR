import React, { useContext, useEffect, useState } from "react";
import {
  PDFDownloadLink,
  Page,
  Text,
  View,
  Document,
  StyleSheet,
} from "@react-pdf/renderer";
import { Context } from "../Context";
const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#E4E4E4",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});

const MyDoc = ({ date, carer, rating }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text>{`Monthly rating average for ${carer} during ${date} assesement`}</Text>
        <Text style={{ marginTop: "30px", fontSize: "15px" }}></Text>
        <Text
          style={{
            color: "red",
            border: "2px solid black",
            padding: "10px",
          }}
        >
          Average Rating: {rating}
        </Text>
      </View>
    </Page>
  </Document>
);

function App({ currentCarer, currentDate }) {
  const { noAuth } = useContext(Context);

  // get all metricRating
  const [metricRating, setMetricRating] = useState([]);
  const [filteredRating, setFilteredRating] = useState();
  useEffect(() => {
    noAuth.getMetricRatings().then((res) => {
      setMetricRating(
        res.metric.filter((carerRating) =>
          carerRating.carerID === currentCarer.carerID ? carerRating : ""
        )
      );
    });
  }, []);

  useEffect(() => {
    // map through the metricRating
    // create a new date from the startDate and compare it to the new created date from currentDate
    // just comparing the month
    setFilteredRating(
      metricRating?.map((rating) => {
        let splitDateForRating = rating.startDate?.split("-"),
          splitDateForCurrentDate = currentDate?.split("-");
        let newDateForRating = `${splitDateForRating[1]}/${splitDateForRating[0]}`,
          newDateForCurrentDate = `${splitDateForCurrentDate[1]}/${splitDateForCurrentDate[0]}`;

        if (newDateForRating === newDateForCurrentDate) {
          return rating;
        }
      })
    );
  }, [metricRating]);
  // console.log(filteredRating);

  // Get the ratings from the database
  const [ratings, setRatings] = useState();
  useEffect(() => {
    let allRatingsThatAreNotUndefined = [];
    filteredRating?.map((rating) => {
      if (rating !== undefined) {
        allRatingsThatAreNotUndefined.push(rating);
      }
    });
    noAuth.getRatings().then((res) => {
      setRatings(
        allRatingsThatAreNotUndefined.map((allRatingThatAreNotUndefined) => {
          return res.ratings.filter(
            (rating) =>
              rating.ratingID === allRatingThatAreNotUndefined.ratingID
          );
        })
      );
    });
  }, [filteredRating]);

  // console.log(ratings.map((rating) => rating[0].rating));
  const [averageRating, setAverageRating] = useState();
  const [manyCarersRating] = useState([]);
  let maxValue = 12;
  let newArray = [];
  useEffect(() => {
    if (
      ratings !== null &&
      ratings !== undefined &&
      ratings.length > maxValue &&
      ratings.map((item) => item !== null && item !== undefined)
    ) {
      // dont push if all the ratings have been pushed  already
      while (ratings.length) {
        manyCarersRating.push(ratings.splice(0, maxValue));
      }
    } else if (
      ratings !== null &&
      ratings !== undefined &&
      ratings.length === maxValue
    ) {
      ratings.map((item) => {
        item.map((item) => newArray.push(item?.rating));
        setAverageRating(
          Math.ceil(newArray.reduce((acc, arr) => acc + arr) / maxValue)
        );
      });
    }

    if (manyCarersRating.length > 0) {
      manyCarersRating.map((item) => {
        item.map((item) => newArray.push(item[0].rating));
        setAverageRating(
          Math.ceil(
            newArray.reduce((acc, arr) => acc + arr) /
              maxValue /
              manyCarersRating.length
          )
        );
      });
    }
  }, [ratings]);

  let splitDateForCurrentDate = currentDate?.split("-"),
    newDateForCurrentDate = `${splitDateForCurrentDate[1]}/${splitDateForCurrentDate[0]}`;

  return (
    <div className="App">
      <PDFDownloadLink
        document={
          <MyDoc
            rating={averageRating}
            carer={currentCarer.forename + " " + currentCarer.surname}
            date={newDateForCurrentDate}
          />
        }
        fileName="Monthly.pdf"
      >
        {({ blob, url, loading, error }) =>
          loading
            ? "Loading document..."
            : `Download ${newDateForCurrentDate} Average`
        }
      </PDFDownloadLink>
    </div>
  );
}

export default App;
