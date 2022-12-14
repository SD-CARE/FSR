import React, { useState, useEffect } from "react";
import SDData from "./SDData";
import CPData from "./CPData";
import Cookies from "js-cookie";

export const Context = React.createContext();

export const Provider = (props) => {
  // create a userCookies instance in the state and set it to get the cookies
  const [userCookies] = useState(Cookies.get("userCookies"));
  const [sDate] = useState(Cookies.get("sDate"));
  const [eDate] = useState(Cookies.get("eDate"));
  const [careDate] = useState(Cookies.get("careDate"));
  const [continueStartDate] = useState(Cookies.get("continueStartDate"));
  const [continueEndDate] = useState(Cookies.get("continueEndDate"));

  // create an authenticatedUser instance in state and set it to userCookies if there any
  // else set it to null
  const [authenticatedUser, setAuthenticatedUser] = useState(
    userCookies ? JSON.parse(userCookies) : null
  );

  const [currentstartDate, setCurrentStartDate] = useState(
    sDate ? JSON.parse(sDate) : null
  );

  const [currentendDate, setCurrentEndDate] = useState(
    eDate ? JSON.parse(eDate) : null
  );

  const [carerDateRange, setCarerDateRange] = useState(
    careDate ? JSON.parse(careDate) : null
  );

  const [continueAssessStartDate, setContinueAssessStartDate] = useState(
    continueStartDate ? JSON.parse(continueStartDate) : null
  );

  const [continueAssessEndDate, setContinueAssessEndDate] = useState(
    continueEndDate ? JSON.parse(continueEndDate) : null
  );

  //   when the component mounts
  // setup Cookies instance for authenticated user
  useEffect(() => {
    if (authenticatedUser) {
      Cookies.set("userCookies", JSON.stringify(authenticatedUser), {
        expires: 1,
        secure: true,
      });
    }
    if (currentstartDate) {
      Cookies.set("sDate", JSON.stringify(currentstartDate), {
        expires: 1,
      });
    }
    if (currentendDate) {
      Cookies.set("eDate", JSON.stringify(currentendDate), {
        expires: 1,
      });
    }
    if (carerDateRange) {
      Cookies.set("careDate", JSON.stringify(carerDateRange), {
        expires: 1,
      });
    }
    if (continueAssessStartDate) {
      Cookies.set(
        "continueStartDate",
        JSON.stringify(continueAssessStartDate),
        {
          expires: 1,
        }
      );
    }
    if (continueAssessEndDate) {
      Cookies.set("continueEndDate", JSON.stringify(continueAssessEndDate), {
        expires: 1,
      });
    }
  }, [
    authenticatedUser,
    currentstartDate,
    currentendDate,
    carerDateRange,
    continueAssessStartDate,
    continueAssessEndDate,
  ]);
  //   store the Data class component in a constant
  // SDData = local database
  // CPData = careplaer database
  const sDData = new SDData();
  const cPData = new CPData();

  //   create a signIn async function with emailAddress and password as params
  const signIn = async (emailAddress, password) => {
    //   create a user async function waiting to getUser
    const user = await sDData.getUser(emailAddress, password);
    // if the user is not null
    if (user !== null) {
      // set password to the password from user method
      user.password = password;
      //   set the authenticatedUser state to user data
      setAuthenticatedUser(user);
    }
  };
  const [regionsName, setRegionsName] = useState([]);

  //   create a signOut function
  const signOut = () => {
    // set the authenticated user to null and remove the cookies
    setAuthenticatedUser(null);
    setContinueAssessStartDate(null);
    setContinueAssessEndDate(null);
    setCurrentStartDate(null);
    setCurrentEndDate(null);
    setCarerDateRange(null);
    Cookies.remove("userCookies");
    Cookies.remove("sDate");
    Cookies.remove("eDate");
    Cookies.remove("carerCookies");
    Cookies.remove("careDate");
    Cookies.remove("continueStartDate");
    Cookies.remove("continueEndDate");
  };

  // NPC Data
  const [NPC, setNPC] = useState([]);
  useEffect(() => {
    sDData.getCarerNPC().then((res) => setNPC(res));
  }, []);

  return (
    <Context.Provider
      value={{
        signIn,
        signOut,
        cPData,
        sDData,
        carerDateRange,
        authenticatedUser,
        setCurrentStartDate,
        setCarerDateRange,
        currentstartDate,
        setCurrentEndDate,
        currentendDate,
        setRegionsName,
        regionsName,
        NPC,
        continueAssessStartDate,
        setContinueAssessStartDate,
        continueAssessEndDate,
        setContinueAssessEndDate,
      }}
    >
      {props.children}
    </Context.Provider>
  );
};
