import React, { useEffect } from "react";
import { Collapse } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { ReactComponent as DragonAvatar } from "../assets/dragon-avatar.svg";
import LoginPage from "./LoginPage";
import { useLocation, Switch, Route, useHistory } from "react-router-dom";
import TaskPage from "./TaskPage";
import MonsterPage from "./MonsterPage";
import ManagePage from "./ManagePage";
import FormPage from "./FormPage";
import ProgressPage from "./ProgressPage";
import ProloguePage from "./ProloguePage";
import TutorialPage from "./TutorialPage";
import StoryPage from "./StoryPage";
import SummaryPage from "./SummaryPage";
import { useMutation, useQuery, gql } from "@apollo/client";

const useStyles = makeStyles((theme) => ({
  banner: {
    width: "100%",
    position: "fixed",
    top: 0,
    backgroundColor: "#23baab",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingRight: theme.spacing(2),
  },
}));

const ADD_EVENT = gql`
  mutation AddEvent(
    $type: String!
    $page: String!
    $userId: Int!
    $data: String!
  ) {
    insert_event(
      objects: { type: $type, page: $page, user_id: $userId, data: $data }
    ) {
      affected_rows
    }
  }
`;

const LOGIN = gql`
  {
    user {
      id
      username
    }
  }
`;

export default function MainPage() {
  const styles = useStyles();

  const location = useLocation();
  const hasBanner =
    !location.pathname.split("/")[1] ||
    location.pathname.split("/")[1] === "form" ||
    location.pathname.split("/")[1] === "progress" ||
    location.pathname.split("/")[1] === "login";

  const { data: loginData } = useQuery(LOGIN);
  const userId = loginData?.user?.[0]?.id;

  const [addEvent] = useMutation(ADD_EVENT);

  const history = useHistory();

  useEffect(() => {
    const oldLocation = location.pathname + location.search;
    const then = Date.now();
    const unsub = history.listen(() => {
      if (userId) {
        addEvent({
          variables: {
            type: "engagement",
            page: oldLocation,
            userId,
            data: JSON.stringify({
              time: (Date.now() - then) / 1000,
            }),
          },
        });
      }
    });
    return () => unsub();
  }, [addEvent, history, location.pathname, location.search, userId]);

  return (
    <>
      <Collapse className={styles.banner} in={hasBanner}>
        <DragonAvatar width={120} height={120} />
      </Collapse>
      <Switch location={location}>
        <Route path="/" exact component={LoginPage} />
        <Route path="/login" component={LoginPage} />
        <Route path="/progress" component={ProgressPage} />
        <Route path="/form" component={FormPage} />
        <Route path="/prologue" component={ProloguePage} />
        <Route path="/monsters" component={MonsterPage} />
        <Route path="/tutorial" component={TutorialPage} />
        <Route path="/story" component={StoryPage} />
        <Route path="/tasks" component={TaskPage} />
        <Route path="/summary" component={SummaryPage} />
        <Route path="/manage" component={ManagePage} />
      </Switch>
    </>
  );
}
