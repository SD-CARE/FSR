import React from "react";

export const ComponentToPrint = React.forwardRef((props, ref) => {
  const { carer, startDate, array, arrx, arrPOC, currentPerformance } = props;
  return (
    <div ref={ref}>
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
      </div>
      <div>
        <h3 style={{ textAlign: "center", marginTop: "15px" }}>
          Client List for {startDate}
        </h3>
      </div>
      <table class="minimalistBlack">
        <thead>
          <tr>
            <th>Client Name</th>
            <th>schedule</th>
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
                  <td>{client.regionName}</td>
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
      <div>
        <h3 style={{ textAlign: "center", marginTop: "15px" }}>
          Performance Metric for {startDate}
        </h3>
      </div>
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
    </div>
  );
});
