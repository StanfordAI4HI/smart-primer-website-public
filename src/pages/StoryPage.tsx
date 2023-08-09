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
import ChapterOne1 from "../components/ChapterOne1";
import ChapterOne2 from "../components/ChapterOne2";
import ChapterOne3 from "../components/ChapterOne3";
import ChapterOne4 from "../components/ChapterOne4";
import ChapterOne5 from "../components/ChapterOne5";

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

export default function StoryPage() {
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
    if (data && data?.user?.[0]?.condition !== "D") {
      if (page === 5) {
        history.replace("/summary");
      } else {
        history.replace("/tasks/1");
      }
    }
  }, [data, error, history, page]);

  const props = {
    name: data?.user?.[0]?.name,
    gender: data?.user?.[0]?.gender,
    monsterName: data?.user?.[0]?.monster_name,
  };

  return (
    <div className={styles.root}>
      <Container className={styles.flexColumn}>
        <StyledProgress
          variant="determinate"
          value={
            page >= 4 ? ((page - 3 + 18) / 21) * 100 : ((page + 7) / 21) * 100
          }
        />
        <div className={styles.task}>
          <Switch>
            <Route path="/story/1">
              <ChapterOne1 {...props} />
            </Route>
            <Route path="/story/2">
              <ChapterOne2 {...props} />
            </Route>
            <Route path="/story/3">
              <ChapterOne3 {...props} />
            </Route>
            <Route path="/story/4">
              <ChapterOne4 {...props} />
            </Route>
            <Route path="/story/5">
              <ChapterOne5 {...props} />
            </Route>
            <Redirect to="/story/1" />
          </Switch>
        </div>
        <div className={styles.toolbar}>
          <IconButton
            style={{
              visibility: page === 1 || page === 4 ? "hidden" : "visible",
            }}
            component={Link}
            replace
            to={`/story/${page - 1 >= 1 ? page - 1 : 1}`}
          >
            <LeftArrow width={50} height={50} />
          </IconButton>
          <IconButton
            component={Link}
            replace
            to={
              page === 5
                ? "/summary"
                : page === 3
                ? "/tasks/1"
                : `/story/${page + 1}`
            }
          >
            <RightArrow width={50} height={50} />
          </IconButton>
        </div>
      </Container>
    </div>
  );
}
