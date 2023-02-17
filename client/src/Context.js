import React, { useState, useEffect } from "react";
import noAuthRoutes from "./NoAuthRoutes";
import CPData from "./CPData";
import Cookies from "js-cookie";
import axios from "axios";
import { api } from "./Config";
import jwtDecode from "jwt-decode";

export const Context = React.createContext();

export const Provider = (props) => {
  // create a userCookies instance in the state and set it to get the cookies
  const [userCookies] = useState(Cookies.get("userCookies"));
  const [sDate] = useState(Cookies.get("sDate"));
  const [eDate] = useState(Cookies.get("eDate"));
  const [careDate] = useState(Cookies.get("careDate"));
  const [continueStartDate] = useState(Cookies.get("continueStartDate"));
  const [continueEndDate] = useState(Cookies.get("continueEndDate"));
  const [user, setUser] = useState();

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

  //   when the component mounts
  // setup Cookies instance for authenticated user
  useEffect(() => {
    if (authenticatedUser) {
      Cookies.set("userCookies", JSON.stringify(authenticatedUser), {
        // expires: "session",
        secure: true,
        sameSite: "Lax",
      });
    }
  }, [authenticatedUser]);

  const axiosJWT = axios.create();

  axiosJWT.interceptors.request.use(
    async (config) => {
      let currentDate = new Date();
      const decodeToken = jwtDecode(authenticatedUser.accessToken);
      if (decodeToken.exp * 1000 < currentDate.getTime()) {
        const data = await Promise.resolve(user).then((res) => res);
        config.headers["Authorization"] = "Bearer " + data?.accessToken;
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  useEffect(() => {
    const intervalId = setInterval(async () => {
      try {
        const res = await axios.post(`${api.apiBaseUrl}/refresh`, {
          token: authenticatedUser.refreshToken,
          tokenType: "Bearer",
        });
        setUser(res.data);

        setAuthenticatedUser({
          ...authenticatedUser,
          accessToken: res.data.accessToken,
          refreshToken: res.data.refreshToken,
        });
        return res.data;
      } catch (e) {
        if (e.response?.status === 403 || e.response?.status === 401) {
          setAuthenticatedUser(null);
          Cookies.remove("userCookies");
          window.location.href = "/signin";
        }
        console.log(e);
      }
    }, 1000 * 60 * 30);

    return () => clearInterval(intervalId);
  }, [authenticatedUser]);

  //   store the Data class component in a constant

  const noAuth = new noAuthRoutes();

  //   create a signIn async function with emailAddress and password as params
  const signIn = async (emailAddress, password) => {
    //   create a user async function waiting to getUser
    const user = await noAuth.getUser(emailAddress, password);

    if (user !== null) {
      //   set the authenticatedUser state to user data
      setAuthenticatedUser(user);
    }
  };

  // ROUTES THAT NEED AUTHENTICATION
  // update the metric_complied
  const updateMetricComplied = async (metricComplied) => {
    try {
      const response = await axiosJWT.put(
        `${api.apiBaseUrl}/metric_complied`,
        metricComplied,
        {
          headers: {
            Authorization: `Bearer ${authenticatedUser.accessToken}`,
          },
        }
      );
      // if the response is ok
      if (response.status === 204) {
        // return empty array
        return [];
      }
    } catch (e) {
      if (e.response.status === 400) {
        return e.response.data.errors;
      }
    }
  };

  // update the metric_complied
  const updateComments = async (comment) => {
    try {
      const response = await axiosJWT.put(
        `${api.apiBaseUrl}/comments`,
        comment,
        {
          headers: {
            Authorization: `Bearer ${authenticatedUser.accessToken}`,
          },
        }
      );
      // if the response is ok
      if (response.status === 204) {
        // return empty array
        return [];
      }
    } catch (e) {
      if (e.response.status === 400) {
        return e.response.data.errors;
      }
    }
  };

  // update the metric_rating
  const updateMetricRating = async (metricRating) => {
    try {
      const response = await axiosJWT.put(
        `${api.apiBaseUrl}/metric_rating`,
        metricRating,
        {
          headers: {
            Authorization: `Bearer ${authenticatedUser.accessToken}`,
          },
        }
      );
      // if the response is ok
      if (response.status === 204) {
        // return empty array
        return [];
      }
    } catch (e) {
      if (e.response.status === 400) {
        return e.response.data.errors;
      }
    }
  };
  // END OF ROUTES THAT NEED AUTH

  //   store the Data class component in a constant
  // noAuth = local database
  // CPData = careplaer database
  const cPData = new CPData();

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
    noAuth.getCarerNPC().then((res) => setNPC(res));
  }, []);

  // create an object of performance metrics explaining what each metric is
  const metricsExplained = {
    1: [
      "Does the Care Worker check the Service Users Care plan on arrival?",
      "Does the Care Worker check the Service Users Visit Notes upon arrival?",
      "Does the Care Worker seek the Service Users consent before delivering any aspect of care?",
      "Does the Care Worker know the type of care the Service Users needs?",
    ],
    2: [
      "Where electronic monitoring is used, has the Care Worker logged in correctly?",
      "Is the Metidication Administration Report(MAR) completed correctly?",
      "Does the Care Worker follow the 6 Rights of Medication correctly?",
      "Does the Care Worker accurately record on the care records the activities that have been undertaken?",
      "Does the Care Worker log out correctly if electronic monitoring is used?",
    ],
    3: [
      "Does the Care Worker wash their hands before and after providing care and support?",
      "Does the Care Worker use PPE correctly?",
      "Is the Care Worker vigilant for hazards in the home?",
      "Is any food handled correctly and hygienically?",
      "Is the working area kept clean and tidy and is any PPE disposed of correctly?",
    ],
    4: [
      "Does the Care Worker introduce themselves and say 'Hello' to the Service User and call them by the name they have asked to be called in the Care Plan?",
      "Does the Care Worker communicate well with the Service User and evidence compassionate care?",
      "Does the Care Worker work in enabling way?",
    ],
    5: [
      "Does the Care Worker respect the privacy of the Service User?",
      "Does the Care Worker respect the dignity of the Service User?",
      "Does the Care Worker allow the Service User to make their own choices?",
    ],
    6: [
      "Does the Care Worker have an ID Badge that is current and valid and if they are not known to the Service User do they show the ID badge?",
    ],
    7: [
      "Does the Care Worker arrive at the Service USers home on time?",
      "Does the Care Worker have the Keys/Key safe number and alert the Service User upon arrival?",
    ],
    8: [
      "Compliments and complaints from the Service User, Next Of Keen(NOK) and also Professional Commissiners as well as Do District Nurses(DN), General Practitioners(GPs), Community Nurses etc?",
    ],
    9: [
      "Does the Care Worker understand the Manoeuvre and can they use the Equipment to the best standard?",
    ],

    10: [
      "Does the Care Worker understand polices and procedures necessary for carrying out any tasks?",
    ],
    11: [
      "Has the Care Worker completed and utilised their skills and trainings while performing care inline with relevant policies and procedures?",
    ],
    12: ["Initiative to adopt new technology and improve skills?"],
  };

  return (
    <Context.Provider
      value={{
        signIn,
        signOut,
        cPData,
        noAuth,
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
        metricsExplained,
        updateComments,
        updateMetricComplied,
        updateMetricRating,
      }}
    >
      {props.children}
    </Context.Provider>
  );
};
