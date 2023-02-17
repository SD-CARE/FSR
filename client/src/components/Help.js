import React from "react";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import { styled, useTheme } from "@mui/material/styles";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DailyMetric from "./imgs/dailymetric.png";
import Landing from "./imgs/landing.png";
import Carers from "./imgs/carers.png";
import CarerName from "./imgs/carername.png";
import AssessBack from "./imgs/assessback.png";
import BlueDate from "./imgs/bluedate.png";
import AssessCalender from "./imgs/assesscalender.png";
import ClientList from "./imgs/clientlist.png";
import ClientError from "./imgs/clienterror.png";
import MetricDetails from "./imgs/metricdetail.png";
import MetricError from "./imgs/metricerror.png";
import AssessedPage from "./imgs/assessedpage.png";
import AssessedCarer from "./imgs/assessedcarer.png";
import AddNPC from "./imgs/npcpage.png";
import WrongRoute from "./imgs/wrongroute.png";
const drawerWidth = 385;

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-start",
}));

function Help() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Box sx={{ "& > :not(style)": { m: 1 } }} className="help--container">
        <Fab
          color="secondary"
          aria-label="add"
          onClick={handleDrawerOpen}
          sx={{ ...(open && { display: "none" }) }}
        >
          <QuestionMarkIcon />
        </Fab>
      </Box>

      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
          },
        }}
        variant="persistent"
        anchor="right"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
          <h2 style={{ marginLeft: "40px" }}>USER MANUAL</h2>
        </DrawerHeader>
        <Divider />
        <List
          style={{
            width: "90%",
            marginLeft: "20px",
          }}
        >
          <div style={{ borderBottom: "2px solid black" }}>
            <h3>What the app does</h3>
            <p style={{ marginTop: "10px" }}>
              The SD Care Field Supervison App is a web based single page
              application used for tracking and recording the quality of care
              through a series of weekly Supervisons
            </p>
            <p>
              The carers are given a rating from one to ten which the app uses
              to create a data visualistion bar chart with the average of the
              overall performance per carer using the twelve metrics of the
              quality standard of care.
            </p>
            <img src={DailyMetric} alt="" style={{ width: "350px" }} />

            <p style={{ marginTop: "10px" }}>
              The app uses three different bar charts namely the daily, weekly
              and monthly charts to show the average performance of each carer
              based on the 12 performance metrics{" "}
              <a href="/carers/1/assess">View Here</a>.
            </p>

            <p>
              The rating is collected using a form that has two other parts;
              Complied and Comments. The Complied part is a yes or no question
              that asks if the carer complied with the metric. The Comments part
              is a text area that allows the user to add comments about the
              carer's performance.
            </p>

            <p>
              The app has a print function that allows the user to print the
              assessed carer's details, the comments made, the complied status
              and the rating as well as the date of the assessment and the bar
              charts. The print function also contains a signature box that
              allows the document to be checked and signed off by the
              appropriate authority.
            </p>

            <p>
              The app maintains an upto date of the company data by connecting
              to the Care Planner API used by the company to schedule and assign
              carers to clients. This API is constantly updated with the latest
              data and hence keeps this app up to date.
            </p>
          </div>
          <div style={{ borderBottom: "2px solid black" }}>
            <h3 style={{ marginTop: "20px" }}>How to use the app</h3>
            <h4 style={{ marginTop: "10px" }}>
              {" "}
              1. Go to the{" "}
              <a href="https://run-sql-hrhtsex5mq-nw.a.run.app/">APP</a>
            </h4>
            <p style={{ marginTop: "10px" }}>
              The landing page has three sections; Clients: This section
              displays all SD Care Clients, their names, addressesses and
              schedules. Carers: This section displays all the SD Care carers,
              their names and schedules. Performance Metrics: This section
              displays the Daily and Monthly Performance of all assessed carers
              on a bar chart by rating average.
            </p>
            <img src={Landing} alt="" style={{ width: "350px" }} />
          </div>
          <div style={{ marginTop: "20px", borderBottom: "2px solid black" }}>
            <h4>2. Click on the Carers tab</h4>
            <p style={{ marginTop: "10px" }}>
              This section displays all the SD Care carers, their names and
              schedules. Carers with a{" "}
              <span style={{ color: "green" }}>Green</span> indicator have NPC
              numbers and are therefore eligible for assessment. Carers with a{" "}
              <span style={{ color: "red" }}>Red</span> indicator do not have
              NPC numbers and are therefore not eligible for assessment unless
              they are given an NPC number.
            </p>
            <img src={Carers} alt="" style={{ width: "350px" }} />

            <p>
              Click on the carer's name to view their client schedule and assess
              them. or Search for a carer by name in the search bar.
            </p>
          </div>
          <div style={{ marginTop: "20px", borderBottom: "2px solid black" }}>
            <h4>3. Click on the carer's name</h4>
            <p style={{ marginTop: "10px" }}>
              At the top of the page you will see the carer's name, their NPC
              number and initials.
            </p>
            <img src={CarerName} alt="" style={{ width: "350px" }} />

            <p style={{ marginTop: "10px" }}>
              Below the carer's name you will see the Assess and Back buttons.
            </p>
            <img src={AssessBack} alt="" style={{ width: "350px" }} />
            <p style={{ marginTop: "10px" }}>
              At the bottom of the page is a calender that displays all the
              dates the particular carer has been assessed. These dates are
              shown with a <span style={{ color: "blue" }}>BLUE</span>{" "}
              highlight.
            </p>
            <img
              src={BlueDate}
              alt=""
              style={{ width: "350px", marginBottom: "20px" }}
            />
          </div>

          <div style={{ marginTop: "20px", borderBottom: "2px solid black" }}>
            <h4>4. Click on the Assess button</h4>
            <p style={{ marginTop: "10px" }}>
              This will take you to the assessment page where you will see the
              carer's name, their NPC number and initials at the top and a
              calender at the bottom. Choose the date you want to assess the
              carer from the calender and click on the Continue button.
            </p>
            <p
              style={{ color: "red", fontSize: "16px", fontWeight: "lighter" }}
            >
              Please Note that if there are no calls assigned to the carer for
              the selected date, then there will be no clients displayed
            </p>
            <img src={AssessCalender} alt="" style={{ width: "350px" }} />
          </div>
          <div style={{ marginTop: "20px", borderBottom: "2px solid black" }}>
            <h4>5. Click on the Continue button</h4>
            <p style={{ marginTop: "10px" }}>
              This will take you to the client data page where you will see the
              "View Carer" dropdown button at the top which when clicked
              displays the carer details for the current carer, below that is
              the list of clients, their names, schedules and each client has
              two dropdown menues namely; Calls and Package Of Care. The Calls
              dropdown menu displays the calls assigned to the carer for the
              selected date and the Package Of Care dropdown menu displays the
              package of care assigned to the client.
            </p>
            <img src={ClientList} alt="" style={{ width: "350px" }} />
            <p style={{ marginTop: "10px" }}>
              Each client will require both calls and package of care to be
              selected before the assessment can be completed.
            </p>
            <p
              style={{ color: "red", fontSize: "16px", fontWeight: "lighter" }}
            >
              Please Note that if there are any missing calls or package of care
              for the selected date, then the app with display an error message.
            </p>
            <img src={ClientError} alt="" style={{ width: "350px" }} />
          </div>
          <div style={{ marginTop: "20px", borderBottom: "2px solid black" }}>
            <h4>6. Click Assess after all Calls and POC select</h4>
            <p style={{ marginTop: "10px" }}>
              This will take you to the assessment page where you will see the
              carer's name and the Performance Metric Form. The form contains 12
              sections;
            </p>
            <p style={{ marginTop: "10px" }}>
              Each section contains a Metric Name, a Metric Description, a
              Metric Rating, Metric Complied and a Metric Comment. The Metric
              rating is a dropdown menu that contains 10 options. The Metric
              Complied is a dropdown that contains yes or no, and The Metric
              Comment is a text area where you can add comments about the
              carer's performance. The Metric Rating, Complied and Metric
              Comment are required for each section before the assessment can be
              completed.
            </p>
            <img src={MetricDetails} alt="" style={{ width: "350px" }} />
            <p
              style={{
                marginTop: "10px",
                color: "red",
                fontSize: "16px",
                fontWeight: "lighter",
              }}
            >
              Please Note that if there are any missing Metric Rating, Complied
              or Metric Comment, then the app with display an error message.{" "}
              <span style={{ color: "black" }}>
                Else if everything is filled in correctly, then click Save
              </span>
            </p>
            <img src={MetricError} alt="" style={{ width: "350px" }} />
          </div>
          <div style={{ marginTop: "20px", borderBottom: "2px solid black" }}>
            <h4>7. To view Assessed Carer data</h4>
            <p style={{ marginTop: "10px" }}>
              Navigate to the Carers page and click on the carer's name. At the
              bottom of the page is a calender that displays all the dates the
              particular carer has been assessed. These dates are shown with a{" "}
              <span style={{ color: "blue" }}>BLUE</span> highlight. Select the
              date you want to view the assessment data for and click. This will
              take you to the assessment page where you will see the carer's
              details, assessement date, client list with each client's calls
              and package of care, and the Performance Metric Form which
              contains the Metric Name, Metric Description, Metric Rating,
              Metric Complied and Metric Comment.
            </p>
            <img src={AssessedPage} alt="" style={{ width: "350px" }} />

            <p style={{ marginTop: "10px" }}>
              The page also contains a button that allows you to print or
              download the assessment data as a PDF, view the carer bar chart
              which displays the carer's daily metric performance and a back
              button.
            </p>
            <img src={AssessedCarer} alt="" style={{ width: "350px" }} />
            <p style={{ marginTop: "10px" }}>
              If you are the author of the assessment, you will also see an edit
              button which allows you to edit the assessment data.
            </p>
          </div>
          <div style={{ marginTop: "20px", borderBottom: "2px solid black" }}>
            <h4>8. To Add an NPC number</h4>
            <p style={{ marginTop: "10px" }}>
              Navigate to the Carers page and click on the carer's name whose
              NPC number you want to add. A form page will appear where you can
              add the NPC number and click Create NPC. Click Cancel if you which
              to cancel the action.
            </p>
            <img src={AddNPC} alt="" style={{ width: "350px" }} />
          </div>
          <div style={{ marginTop: "20px", borderBottom: "2px solid black" }}>
            <h4>Side Notes</h4>
            <p style={{ marginTop: "10px" }}>
              Please Note that you might encounter this error page if you try to
              refill client information for a carer that has already been
              assessed. This is because the app does not allow duplicate data.
              If you want to add an assessment, you will have to select a date
              that has not been assessed yet and if you make a mistake and want
              to edit the record then Navigate to the assessed record and click
              Edit
            </p>
            <img src={WrongRoute} alt="" style={{ width: "350px" }} />
          </div>
          <div style={{ marginTop: "20px", borderBottom: "2px solid black" }}>
            <h4>Root Navigation</h4>
            <p style={{ marginTop: "10px" }}>
              At any point in time, you can navigate to any page by clicking on
              the menu icon at the top left of the page and selecting the page
              you want to navigate to.
            </p>
          </div>
        </List>
      </Drawer>
    </>
  );
}

export default Help;
