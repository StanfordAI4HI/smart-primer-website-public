import React, { useEffect } from "react";
import { Container, LinearProgress, IconButton } from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { ReactComponent as LeftArrow } from "../assets/left-arrow.svg";
import { ReactComponent as RightArrow } from "../assets/right-arrow.svg";
import { Link, useHistory } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";
import TaskSummary from "../components/TaskSummary";

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

export default function SummaryPage() {
  const { data, error } = useQuery(LOGIN, {
    fetchPolicy: "network-only",
  });

  const styles = useStyles();

  const history = useHistory();

  useEffect(() => {
    if (error && !data) {
      history.replace("/");
    }
  }, [data, error, history]);

  return (
    <div className={styles.root}>
      <Container className={styles.flexColumn}>
        <StyledProgress variant="determinate" value={100} />
        <div className={styles.task}>
          <TaskSummary />
        </div>
        <div className={styles.toolbar}>
          <IconButton
            style={{
              visibility:
                data?.user?.[0]?.condition !== "D" ? "hidden" : "visible",
            }}
            component={Link}
            replace
            to={"/story/5"}
          >
            <LeftArrow width={50} height={50} />
          </IconButton>
          <IconButton component={Link} replace to="/progress?halfway=true">
            <RightArrow width={50} height={50} />
          </IconButton>
        </div>
      </Container>
    </div>
  );
}
