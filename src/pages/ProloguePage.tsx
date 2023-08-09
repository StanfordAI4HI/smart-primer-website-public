import React, { useEffect } from "react";
import { Container, LinearProgress, IconButton } from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { ReactComponent as LeftArrow } from "../assets/left-arrow.svg";
import { ReactComponent as RightArrow } from "../assets/right-arrow.svg";
import {
  Switch,
  Route,
  Redirect,
  useLocation,
  Link,
  useHistory,
} from "react-router-dom";
import { useQuery, gql } from "@apollo/client";
import Prologue1 from "../components/Prologue1";
import Prologue2 from "../components/Prologue2";
import Prologue3 from "../components/Prologue3";
import Prologue4 from "../components/Prologue4";
import Prologue5 from "../components/Prologue5";
import Prologue6 from "../components/Prologue6";

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
    justifyContent: "space-between",
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
  {
    user {
      id
      username
      condition
      name
      gender
      monster_kind
      monster_name
    }
  }
`;

export default function ProloguePage() {
  const { data, error } = useQuery(LOGIN, {
    fetchPolicy: "network-only",
  });

  const styles = useStyles();

  const location = useLocation();
  const history = useHistory();

  const page = parseInt(location.pathname.split("/")[2], 10);

  useEffect(() => {
    if (error && !data) {
      history.replace("/");
    }
  }, [data, error, history]);

  useEffect(() => {
    if (
      data &&
      (data?.user?.[0]?.condition !== "D" ||
        (data?.user?.[0]?.monster_kind && data?.user?.[0]?.monster_name))
    ) {
      history.replace("/tutorial");
    }
  }, [data, error, history]);

  const props = {
    name: data?.user?.[0]?.name,
    gender: data?.user?.[0]?.gender,
  };

  return (
    <div className={styles.root}>
      <Container className={styles.flexColumn}>
        <StyledProgress variant="determinate" value={(page / 21) * 100} />
        <div className={styles.task}>
          <Switch>
            <Route path="/prologue/1">
              <Prologue1 {...props} />
            </Route>
            <Route path="/prologue/2">
              <Prologue2 {...props} />
            </Route>
            <Route path="/prologue/3">
              <Prologue3 {...props} />
            </Route>
            <Route path="/prologue/4">
              <Prologue4 {...props} />
            </Route>
            <Route path="/prologue/5">
              <Prologue5 {...props} />
            </Route>
            <Route path="/prologue/6">
              <Prologue6 {...props} />
            </Route>
            <Redirect to="/prologue/1" />
          </Switch>
        </div>
        <div className={styles.toolbar}>
          <IconButton
            style={{ visibility: page === 1 ? "hidden" : "visible" }}
            component={Link}
            replace
            to={`/prologue/${page - 1 >= 1 ? page - 1 : 1}`}
          >
            <LeftArrow width={50} height={50} />
          </IconButton>
          <IconButton
            component={Link}
            replace
            to={
              page === 6
                ? data &&
                  (data?.user?.[0]?.condition !== "D" ||
                    (data?.user?.[0]?.monster_kind &&
                      data?.user?.[0]?.monster_name))
                  ? "/tutorial"
                  : "/monsters"
                : `/prologue/${page + 1}`
            }
          >
            <RightArrow width={50} height={50} />
          </IconButton>
        </div>
      </Container>
    </div>
  );
}
