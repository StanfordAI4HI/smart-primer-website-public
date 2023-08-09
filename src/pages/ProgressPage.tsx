import React from "react";
import { Container, Button, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory, useLocation } from "react-router-dom";
import quitPlaying from "../assets/quitPlaying.png";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    paddingTop: 150,
    paddingBottom: 150,
    "& > *": {
      margin: theme.spacing(2),
    },
  },
}));

export default function ProgressPage() {
  const styles = useStyles();

  const history = useHistory();
  const location = useLocation();

  const isHalfway =
    new URLSearchParams(location.search).get("halfway") === "true";
  const isEnd = new URLSearchParams(location.search).get("end") === "true";

  return (
    <Container className={styles.root} maxWidth="md">
      {isEnd ? (
        <Typography variant="h5" gutterBottom>
          Congratulations! You’re all done. Thanks so much for your
          participation! We will send a $30 gift card to the email address you
          provided within two weeks of receiving your response. Please don’t
          hesitate to reach out to us at{" "}
          <a
            style={{ color: "#23baab" }}
            href="mailto:smartest.primer@gmail.com"
          >
            smartest.primer@gmail.com
          </a>{" "}
          if you have any questions.
        </Typography>
      ) : isHalfway ? (
        <>
          <Typography variant="h5" gutterBottom>
            This concludes the website part of the task. You’re more than
            half-way there! Now we’d like to ask you a few more questions, and
            you’ll be done.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => history.replace("/form?survey=false&first=false")}
          >
            Proceed
          </Button>
        </>
      ) : (
        <>
          <Typography variant="h5" gutterBottom>
            Hello! We are the Smart Primer research group from Stanford
            University. <br></br>
            <br></br>
            During today's task, please{" "}
            <b>
              do not receive help from parents, siblings, or any outside
              sources!
            </b>{" "}
            If you get stuck, there is a button on each page to stop playing.
            <div style={{ textAlign: "center" }}>
              <img
                src={quitPlaying}
                alt="hover mouse over the box"
                height="40"
              />
            </div>
          </Typography>
          <Typography variant="h5" gutterBottom>
            Please only use this button if you have to. If you end the task
            early, don't worry! There is no penalty to the gift card that you
            receive, and we won't reveal your results to anyone. If you have any
            questions, please feel free to email us at{" "}
            <a
              style={{ color: "#23baab" }}
              href="mailto:smartest.primer@gmail.com"
            >
              smartest.primer@gmail.com
            </a>
            .
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => history.replace("/form?survey=true&first=true")}
          >
            Proceed
          </Button>
        </>
      )}
    </Container>
  );
}
