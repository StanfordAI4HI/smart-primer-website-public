import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Typography,
  Button,
  CircularProgress,
  Snackbar,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory, useLocation } from "react-router-dom";
import { useLazyQuery, gql } from "@apollo/client";
import paperPencil from "../assets/PaperPencil.gif";
import zoomOut from "../assets/ZoomOut.gif";
import breaks from "../assets/Breaks.gif";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },
  flexColumn: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  title: {
    color: "#23baab",
    fontWeight: "bold",
    marginTop: "10vh",
    marginBottom: 0,
  },
  graphic: {
    width: "15vh",
    height: "15vh",
  },
  bigGraphic: {
    height: "28vh",
    margin: "-3vh",
  },
  reminders: {
    paddingTop: "calc(10vh + 100px) ",
  },
  list: {
    display: "flex",
    alignItems: "center",
    margin: "0",
  },
}));

const LOGIN = gql`
  {
    user {
      id
      username
    }
  }
`;

export default function LoginPage() {
  const styles = useStyles();

  const [message, setMessage] = useState("");
  const location = useLocation();

  const [username, setUsername] = useState("");
  const [token, setToken] = useState(
    localStorage.getItem("token") || location.pathname.split("/")[2] || ""
  );

  const [login, { loading, data, error }] = useLazyQuery(LOGIN, {
    fetchPolicy: "network-only",
  });

  const handleLogin = async () => {
    if (!username || !token) {
      setMessage("Please complete the credentials.");
      return;
    }

    if (username === "admin") {
      localStorage.setItem("x-hasura-admin-secret", token);
      await new Promise((r) => setTimeout(r, 500));
      history.replace("/manage");
      return;
    } else {
      localStorage.removeItem("x-hasura-admin-secret");
    }

    localStorage.setItem("token", token);
    login();
  };

  const history = useHistory();

  useEffect(() => {
    if (
      data &&
      data.user &&
      data.user[0] &&
      data.user[0].username === username
    ) {
      history.replace("/progress?start=true");
    } else if (data) {
      setMessage("Login error.");
    }
  }, [data, history, username]);

  useEffect(() => {
    if (error) {
      setMessage("Login error.");
    }
  }, [error]);

  return (
    <Container className={styles.root} maxWidth="md">
      <div className={styles.flexColumn}>
        <Typography className={styles.title} variant="h1" gutterBottom>
          Smart Primer
        </Typography>
        <div className={styles.list}>
          <img
            className={styles.bigGraphic}
            src={zoomOut}
            alt="Zoom out instructions"
          />
          <Typography gutterBottom>
            Make sure to zoom out your window to 100% before the study by
            pressing
            <strong> Ctrl+0</strong> on PC or <strong> command+0</strong> on
            Mac.
          </Typography>
        </div>
        <div className={styles.list}>
          <div className={styles.list}>
            <img
              className={styles.graphic}
              src={paperPencil}
              alt="Paper and pencil"
            />
            <Typography gutterBottom>
              You can use scratch paper to help solve the problems, but
              calculators are not allowed.
            </Typography>
          </div>
          <div className={styles.list}>
            <img className={styles.graphic} src={breaks} alt="Clock cartoon" />
            <Typography gutterBottom>
              You can take breaks at any time during the study. You can also
              stop and leave the study at any time.
            </Typography>
          </div>
        </div>

        <TextField
          label="Username"
          variant="outlined"
          color="primary"
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="Token"
          variant="outlined"
          color="primary"
          fullWidth
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />
        <Button
          variant="outlined"
          color="primary"
          fullWidth
          disabled={loading}
          onClick={handleLogin}
        >
          START
        </Button>
        {loading && <CircularProgress />}
      </div>
      <Snackbar
        open={message ? true : false}
        message={message}
        onClose={(e, reason) => {
          if (reason === "clickaway") {
            return;
          }
          setMessage("");
        }}
        autoHideDuration={3000}
      />
    </Container>
  );
}
