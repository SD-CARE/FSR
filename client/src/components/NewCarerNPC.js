import React, { useContext, useState, useEffect } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { Context } from "../Context";
import NPC from "../NPC.json";

function NewCarerNPC() {
  const { sDData, cPData } = useContext(Context);
  const [currentCarer, setCurrentCarer] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    cPData.getCarer(`"${id}"`).then((data) => setCurrentCarer(data[0]));
  }, []);

  const [carer, setCarer] = useState({
    Item: "",
    "Staff Name": "",
    "Employee No": "NPC",
  });
  carer.Item = NPC.length + 1;
  carer["Staff Name"] = currentCarer.forename + " " + currentCarer.surname;

  // create the change function
  const change = (e) => {
    // create the name and value constants to store events from the inputs
    const { name, value } = e.target;
    // set the carer to take the data from the inputs as key value pairs
    // spreading the already exiting contents
    setCarer((carer) => ({ ...carer, [name]: value }));
  };
  const [errors, setError] = useState([]);
  const submit = (e) => {
    e.preventDefault();
    NPC.filter((item) => {
      if (item["Employee No"] === carer["Employee No"]) {
        setError(["Employee No already exists"]);
      } else if (item["Staff Name"] === carer["Staff Name"]) {
        setError(["Staff Name already exists"]);
      } else {
        setError([]);
      }
    });
    sDData
      .createCarerNPC(carer)
      .then(() => {
        if (location.state?.from) {
          // navigate back to that location
          navigate(location.state.from);
          // else navigate to the root /
        } else {
          navigate("/");
        }
      })
      // catch any errors throw by the api and console log them
      .catch((err) => {
        console.log(err);
        // then navigate to /error
        navigate("/error");
      });
  };

  return currentCarer !== undefined ? (
    <div className="form--centered">
      <h2>Create the Carer's NPC</h2>
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
        <>
          <p className="validation--errors npc--error--message">
            Fill In these fields Carefully, Once created you cannot undo change
          </p>
        </>
      )}
      <form onSubmit={submit}>
        <label htmlFor="Staff Name">Staff Name</label>
        <input
          id="Staff Name"
          name="Staff Name"
          type="text"
          onChange={change}
          value={carer["Staff Name"]}
        />
        <label htmlFor="Employee No">Employee No</label>
        <input
          id="Employee No"
          name="Employee No"
          type="text"
          onChange={change}
          value={carer["Employee No"]}
        />
        <button
          type="submit"
          className=" button button-primary npc--save--button"
        >
          Create NPC
        </button>
        <Link to="/carers" className="button button-secondary">
          Cancel
        </Link>
      </form>
    </div>
  ) : (
    <></>
  );
}

export default NewCarerNPC;
