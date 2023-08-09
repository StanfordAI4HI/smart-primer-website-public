import React, { useEffect, useState } from "react";
import {
  Container,
  LinearProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  DialogContentText,
} from "@material-ui/core";
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
import Task1 from "../components/Task1";
import Task2 from "../components/Task2";
import Task3, { Answer } from "../components/Task3";
import Task4 from "../components/Task4";
import Task5 from "../components/Task5";
import Task6 from "../components/Task6";
import Task7 from "../components/Task7";
import Task8 from "../components/Task8";
import Chat from "../components/Chat";
import { useQuery, gql } from "@apollo/client";
import { client, reportGiveUpAttempt } from "../api";

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
    [theme.breakpoints.down("md")]: {
      padding: "4vh 5vh 1vh 5vh",
    },
    position: "relative",
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
      name
      username
      condition
      monster_kind
      monster_name
    }
  }
`;

const SET_COMPLETE_TASK = gql`
  mutation SetCompleteTask($id: Int!, $complete: Boolean!) {
    update_user_by_pk(
      pk_columns: { id: $id }
      _set: { complete_task: $complete }
    ) {
      id
    }
  }
`;

export default function TaskPage() {
  const { data, error } = useQuery(LOGIN, {
    fetchPolicy: "network-only",
  });

  const styles = useStyles();

  const location = useLocation();
  const history = useHistory();

  const page = parseInt(location.pathname.split("/")[2], 10);

  const [pass, setPass] = useState(false);

  useEffect(() => {
    setPass(false);
  }, [page]);

  const [answer, setAnswer] = useState<Answer>({});

  const handleSubmit = (newAnswer: Answer) => {
    setPass(true);
    setAnswer({ ...answer, ...newAnswer });
    if (newAnswer.yes) {
      setDialogOpen(true);
      client.mutate({
        mutation: SET_COMPLETE_TASK,
        variables: {
          id: userId,
          complete: true,
        },
      });
    }
  };

  const userId = data?.user?.[0]?.id;

  const props = {
    onSubmit: handleSubmit,
    answer,
    userId,
    condition: data?.user?.[0]?.condition,
    name: data?.user?.[0]?.name,
    monsterName: data?.user?.[0]?.monster_name,
  };

  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  useEffect(() => {
    if (error && !data) {
      history.replace("/");
    }
  }, [data, error, history]);

  useEffect(() => {
    if (
      data &&
      data?.user?.[0]?.condition === "D" &&
      (!data?.user?.[0]?.monster_kind || !data?.user?.[0]?.monster_name)
    ) {
      history.replace("/prologue");
    }
  }, [data, error, history]);

  const [giveUpDialogOpen, setGiveUpDialogOpen] = useState(false);

  const handleGiveUpDialogClose = () => {
    setGiveUpDialogOpen(false);
  };

  return (
    <div className={styles.root}>
      <Container className={styles.flexColumn}>
        <StyledProgress
          variant="determinate"
          value={
            data?.user?.[0]?.condition === "D"
              ? ((page + 10) / 21) * 100
              : (page / 9) * 100
          }
        />
        <div className={styles.task}>
          <Switch>
            <Route path="/tasks/1">
              <Task1
                name={data?.user?.[0]?.name}
                condition={data?.user?.[0]?.condition}
              />
            </Route>
            <Route path="/tasks/2">
              <Task2 condition={data?.user?.[0]?.condition} />
            </Route>
            <Route path="/tasks/3">
              <Task3 {...props} />
            </Route>
            <Route path="/tasks/4">
              <Task4 {...props} />
            </Route>
            <Route path="/tasks/5">
              <Task5 {...props} />
            </Route>
            <Route path="/tasks/6">
              <Task6 {...props} />
            </Route>
            <Route path="/tasks/7">
              <Task7 {...props} />
            </Route>
            <Route path="/tasks/8">
              <Task8 {...props} />
            </Route>
            <Redirect to="/tasks/1" />
          </Switch>
        </div>
        <div className={styles.toolbar}>
          <IconButton
            style={{
              visibility: page === 1 ? "hidden" : "visible",
            }}
            component={Link}
            replace
            to={
              data?.user?.[0]?.condition === "D" && page === 1
                ? "/story/3"
                : `/tasks/${page - 1 >= 1 ? page - 1 : 1}`
            }
          >
            <LeftArrow width={50} height={50} />
          </IconButton>
          <IconButton
            style={{
              visibility:
                !pass && page !== 1 && page !== 2 ? "hidden" : "visible",
            }}
            component={Link}
            replace
            to={
              page === 8
                ? data?.user?.[0]?.condition === "D"
                  ? "/story/4"
                  : "/summary"
                : `/tasks/${page + 1}`
            }
          >
            <RightArrow width={50} height={50} />
          </IconButton>
        </div>
        <button
          style={{
            position: "absolute",
            bottom: 0,
            textDecoration: "underline",
            border: 0,
            backgroundColor: "transparent",
            cursor: "pointer",
            fontSize: 16,
          }}
          onClick={() => {
            setGiveUpDialogOpen(true);
            reportGiveUpAttempt(location.pathname, userId);
          }}
        >
          I want to stop playing
        </button>
        <Dialog open={giveUpDialogOpen} onClose={handleGiveUpDialogClose}>
          <DialogTitle>Confirm</DialogTitle>
          <DialogContent>
            <DialogContentText>
              If you want to quit playing, click <b>Quit</b>. This will end the
              task permanently! If you’d like to return to the task, click{" "}
              <b>Go Back</b>.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleGiveUpDialogClose} color="primary" autoFocus>
              Go back
            </Button>
            <Button
              onClick={async () => {
                await client.mutate({
                  mutation: SET_COMPLETE_TASK,
                  variables: {
                    id: userId,
                    complete: false,
                  },
                });
                sessionStorage.setItem("incomplete", "true");
                history.replace("/progress?halfway=true");
              }}
              color="primary"
            >
              Quit
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog open={dialogOpen} onClose={handleDialogClose}>
          <DialogTitle>Congratulations!</DialogTitle>
          <DialogContent>
            <img
              src={`https://smart-primer.s3-us-west-1.amazonaws.com/monsters/${
                data?.user?.[0]?.monster_kind === "cyclops"
                  ? "purple"
                  : data?.user?.[0]?.monster_kind === "yeti"
                  ? "blue"
                  : "yellow"
              }loop.gif`}
              alt="congrats"
            />
            <DialogActions>
              <Button
                autoFocus
                variant="contained"
                color="primary"
                onClick={() =>
                  data?.user?.[0]?.condition === "D"
                    ? history.replace("/story/4")
                    : history.replace("/summary")
                }
              >
                Next
              </Button>
            </DialogActions>
          </DialogContent>
        </Dialog>
      </Container>
      {data?.user?.[0]?.condition === "D" && (
        <Chat
          containerStyle={{ display: page > 2 ? "flex" : "none" }}
          tutorial={false}
        />
      )}
    </div>
  );
}
