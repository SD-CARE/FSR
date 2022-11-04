import React from "react";

function MetricEvaluated({ currentPerformance }) {
  return (
    <div className="metric-container ">
      {currentPerformance !== null && currentPerformance.length > 0 ? (
        currentPerformance.map((metric, index) =>
          metric !== null && metric !== undefined ? (
            <div key={index}>
              <p className="metricName-evaluated">
                <span>{metric.metricID}:</span>
                {metric.metricName}
              </p>
              <div className="metricRatingComplied-evaluated">
                <div className="metricRating-evaluated">
                  <span>Rating:</span>
                  <p>
                    {metric.ratingName.length > 0
                      ? metric.ratingName[0].rating
                      : null}
                  </p>
                </div>
                <div className="metricComplied-evaluated">
                  <span>Complied/Not Complied:</span>
                  <p>
                    {metric.compliedName.length > 0
                      ? metric.compliedName[0].compliedNotComplied
                      : null}
                  </p>
                </div>
              </div>

              <div className="metricComment-evaluated">
                <span>Comment:</span>
                <p>{metric.comment}</p>
              </div>
            </div>
          ) : null
        )
      ) : (
        <></>
      )}
    </div>
  );
}

export default MetricEvaluated;
