import React, { useEffect } from "react";
import { Container, LinearProgress, IconButton } from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { ReactComponent as RightArrow } from "../assets/right-arrow.svg";
import { Link, useHistory } from "react-router-dom";
import Chat from "../components/Chat";
import { useSubscription, gql } from "@apollo/client";
import Tutorial from "../components/Tutorial";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    height: "100vh",
    backgroundColor: "#f0e58c",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  flexColumn: {
    height: "100vh",
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    "& > *": {
      margin: theme.spacing(1),
    },
    padding: "4vh 20vh 1vh 20vh",
  },
  task: {
    backgroundColor: "#fff",
    flex: 1,
    width: "100%",
    height: "100%",
    overflow: "auto",
    borderRadius: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  toolbar: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    width: "100%",
  },
}));

const StyledProgress = withStyles({
  root: {
    height: 30,
    width: "100%",
    borderRadius: 10,
  },
  bar: {
    borderRadius: 10,
    backgroundColor: "#23baab",
  },
})(LinearProgress);

const LOGIN = gql`
  subscription User {
    user {
      id
      username
      name
      condition
      monster_kind
      monster_name
      finish_tutorial
    }
  }
`;

export default function TutorialPage() {
  const { data, error } = useSubscription(LOGIN);

  const styles = useStyles();

  const history = useHistory();

  useEffect(() => {
    if (error && !data) {
      history.replace("/");
    }
  }, [data, error, history]);

  useEffect(() => {
    if (data && data?.user?.[0]?.condition !== "D") {
      history.replace("/tasks");
    } else if (
      data &&
      (!data?.user?.[0]?.monster_kind || !data?.user?.[0]?.monster_name)
    ) {
      history.replace("/prologue");
    }
  }, [data, error, history]);

  const pass = data?.user?.[0]?.finish_tutorial;

  const props = {
    name: data?.user?.[0]?.name,
    monsterName: data?.user?.[0]?.monster_name,
  };

  return (
    <div className={styles.root}>
      <Container className={styles.flexColumn}>
        <StyledProgress variant="determinate" value={(7 / 21) * 100} />
        <div className={styles.task}>
          <Tutorial {...props} />
        </div>
        <div className={styles.toolbar}>
          <IconButton
            style={{
              visibility: !pass ? "hidden" : "visible",
            }}
            component={Link}
            replace
            to="/story/1"
          >
            <RightArrow width={50} height={50} />
          </IconButton>
        </div>
      </Container>
      {data?.user?.[0]?.condition === "D" && <Chat tutorial />}
    </div>
  );
}
