import React from "react";

export const ComponentToPrint = React.forwardRef((props, ref) => {
  const { carer, startDate, array, arrx, arrPOC, currentPerformance } = props;
  return (
    <div ref={ref}>
      <div className="wrapper">
        <div className="carerName">
          <div className="carerInitials-name">
            <span>
              {carer.forename} {carer.surname}
            </span>
            <span
              style={{
                border: "2px solid black",
                padding: "8px",
                borderRadius: "30%",
              }}
            >
              {carer.initials}
            </span>
          </div>
          <div className="npc">
            <span>NPC: {carer.NPC}</span>
          </div>
        </div>
      </div>
      <div>
        <h3 style={{ textAlign: "center", marginTop: "15px" }}>
          Field Supervision Report for {startDate}
        </h3>
      </div>
      <table class="minimalistBlack">
        <thead>
          <tr>
            <th>Client Name</th>
            <th>Region</th>
            <th>Calls</th>
            <th>packageOfCare</th>
          </tr>
        </thead>
        <tbody>
          {array.length > 0 ? (
            array
              .filter(
                (value, index, self) =>
                  index === self.findIndex((t) => t.clientID === value.clientID)
              )
              .map((client, index) => (
                <tr key={index}>
                  <td>
                    {client.forename} {client.surname}
                  </td>
                  <td>Schedule {client.regionName}</td>
                  {arrx.length > 0 ? (
                    arrx.map((call, i) =>
                      call !== null && call.clientID === client.clientID ? (
                        <td key={i}>{call.callName}</td>
                      ) : null
                    )
                  ) : (
                    <></>
                  )}
                  {arrPOC.length > 0 ? (
                    arrPOC.map((poc, i) =>
                      poc !== null && poc.clientID === client.clientID ? (
                        <td key={i}>{poc.POCName}</td>
                      ) : null
                    )
                  ) : (
                    <></>
                  )}
                </tr>
              ))
          ) : (
            <p>{array.forename}</p>
          )}
        </tbody>
      </table>
      {/* Performance Metric Table */}

      <table class="minimalistBlack">
        <thead>
          <tr>
            <th>Number</th>
            <th>Metric Name</th>
            <th>Rating</th>
            <th>Complied/Not Complied</th>
            <th>Comment</th>
          </tr>
        </thead>
        <tbody>
          {currentPerformance.map((metric, index) => (
            <tr key={index}>
              <td>{metric.metricID}</td>
              <td>{metric.metricName}</td>
              <td>
                {metric.ratingName.length > 0
                  ? metric.ratingName[0].rating
                  : null}
              </td>
              <td>
                {metric.compliedName.length > 0
                  ? metric.compliedName[0].compliedNotComplied
                  : null}
              </td>
              <td>{metric.comment}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <span
          style={{
            display: "flex",
            justifyContent: "space-around",
            marginTop: "20px",
          }}
        >
          <p>Approved by: ___________________</p>
          <p>Checked by: ___________________</p>
        </span>
        <p style={{ marginLeft: "40px" }}>Prepared by: ___________________</p>
      </div>
    </div>
  );
});
