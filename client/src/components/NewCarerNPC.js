/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useState, useEffect } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { Context } from "../Context";

function NewCarerNPC() {
  const { noAuth, cPData } = useContext(Context);

  const [currentCarer, setCurrentCarer] = useState();
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    cPData.getCarer(`"${id}"`).then((data) => setCurrentCarer(data[0]));
  }, []);
  const [carer, setCarer] = useState({
    forename: "",
    surname: "",
    initials: "",
    CPID: "",
    NPC: "",
  });

  if (
    currentCarer !== undefined &&
    currentCarer !== null &&
    currentCarer !== ""
  ) {
    carer.forename = currentCarer.forename;
    carer.surname = currentCarer.surname;
    carer.initials = `${currentCarer.forename.charAt(
      0
    )}${currentCarer.surname.charAt(0)}`;
    carer.CPID = currentCarer.identifier;
  }
  // create the change function
  const change = (e) => {
    // create the name and value constants to store events from the inputs
    const { name, value } = e.target;
    // set the carer to take the data from the inputs as key value pairs
    // spreading the already exiting contents
    setCarer((carer) => ({ ...carer, [name]: value }));
  };

  const [errors, setErrors] = useState([]);
  const submit = (e) => {
    e.preventDefault();

    noAuth
      .createCarers([carer])
      .then((errors) => {
        // set the errors array to display them
        setErrors(errors);
      })
      // catch any errors thrown by the api and log them to the console
      .catch((err) => {
        console.log(err);
        // navigate to the /error
        navigate("/error");
      });
    if (location.state?.from) {
      // navigate back to that location
      navigate(location.state.from);
      // else navigate to the root /
    } else {
      navigate("/");
    }
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
        <label htmlFor="forename">forename</label>
        <input
          id="forename"
          name="forename"
          type="text"
          onChange={change}
          value={carer.forename}
        />
        <label htmlFor="surname">Surname</label>
        <input
          id="surname"
          name="surname"
          type="text"
          onChange={change}
          value={carer.surname}
        />
        <label htmlFor="NPC">NPC</label>
        <input
          id="NPC"
          name="NPC"
          type="text"
          onChange={change}
          value={carer.NPC}
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
