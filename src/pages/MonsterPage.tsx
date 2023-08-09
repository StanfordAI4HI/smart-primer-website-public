import React, { useState, useEffect } from "react";
import {
  Container,
  Button,
  Typography,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Fade,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import yeti from "../assets/yeti-selected.png";
import yetiGray from "../assets/yeti-not-selected.png";
import cyclops from "../assets/cyclops-selected.png";
import cyclopsGray from "../assets/cyclops-not-selected.png";
import dragon from "../assets/dragon-selected.png";
import dragonGray from "../assets/dragon-not-selected.png";
import { useMutation, useQuery, gql } from "@apollo/client";

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
    padding: "4vh 20vh",
  },
  columns: {
    backgroundImage: "url(/background.svg)",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center center",
    flex: 1,
    width: "100%",
    height: "100%",
    overflow: "auto",
    borderRadius: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  monsters: {
    backgroundColor: "#23baab",
    width: "30%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
    "& > img": {
      height: "30%",
      cursor: "pointer",
    },
    "& > #not-selected": {
      "&:hover": {
        filter: "brightness(150%)",
      },
    },
  },
  introductionBackground: {
    backgroundColor: "white",
    opacity: "0.8",
    position: "absolute",
    left: "30%",
    right: 0,
    top: 0,
    bottom: 0,
  },
  introduction: {
    zIndex: 100,
    height: "100%",
    overflow: "auto",
    flex: 1,
    paddingLeft: "8%",
    paddingRight: "8%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    "& > *": {
      color: "#23baab",
      filter: "brightness(60%)",
    },
  },
  toolbar: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    width: "100%",
  },
  background: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 101,
    backgroundColor: "#23baab",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  bgText: {
    color: "white",
    fontWeight: "bold",
    maxWidth: "40vw",
    textAlign: "center",
  },
}));

const LOGIN = gql`
  {
    user {
      id
      username
      condition
      monster_kind
      monster_name
    }
  }
`;

const CHOOSE_MONSTER = gql`
  mutation ChooseMonster(
    $id: Int!
    $monsterKind: String!
    $monsterName: String!
  ) {
    update_user(
      where: { id: { _eq: $id } }
      _set: { monster_kind: $monsterKind, monster_name: $monsterName }
    ) {
      returning {
        id
      }
    }
  }
`;

export default function MonsterPage() {
  const styles = useStyles();

  const history = useHistory();

  const { data: loginData, error: loginError } = useQuery(LOGIN, {
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (loginError && !loginData) {
      history.replace("/");
    }
  }, [loginData, loginError, history]);

  useEffect(() => {
    if (
      loginData &&
      (loginData?.user?.[0]?.condition !== "D" ||
        (loginData?.user?.[0]?.monster_kind &&
          loginData?.user?.[0]?.monster_name))
    ) {
      history.replace("/tutorial");
    }
  }, [loginData, loginError, history]);

  const [snackMessage, setSnackMessage] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const [monster, setMonster] = useState<string | null>(null);

  const handleChoose = () => {
    if (!monster) {
      setSnackMessage("Please choose your monster before the journey starts!");
      return;
    }
    setDialogOpen(true);
  };

  const [monsterName, setMonsterName] = useState("");
  const [chooseMonster, { data, loading, error }] = useMutation(CHOOSE_MONSTER);

  const handleMonsterName = () => {
    if (!monsterName) {
      setSnackMessage("Please name your monster first.");
      return;
    }

    chooseMonster({
      variables: {
        id: loginData?.user?.[0]?.id,
        monsterKind: monster,
        monsterName,
      },
    });
  };

  useEffect(() => {
    if (error) {
      setSnackMessage("Failed to name your monster. Please try again.");
    }
  }, [error]);

  useEffect(() => {
    if (data) {
      history.replace("/tutorial");
    }
  }, [data, history]);

  const [showBg, setShowBg] = useState(true);

  useEffect(() => {
    setTimeout(() => setShowBg(false), 3000);
  }, []);

  return (
    <div className={styles.root}>
      <Fade in={showBg}>
        <div className={styles.background}>
          <Typography variant="h2" className={styles.bgText}>
            Who do you choose as your companion for the journey?
          </Typography>
        </div>
      </Fade>
      <Container className={styles.flexColumn}>
        <div className={styles.columns}>
          <div className={styles.monsters}>
            <img
              id={monster === "yeti" ? "selected" : "not-selected"}
              src={monster === "yeti" ? yeti : yetiGray}
              alt="yeti"
              onClick={() => setMonster("yeti")}
            />
            <img
              id={monster === "cyclops" ? "selected" : "not-selected"}
              src={monster === "cyclops" ? cyclops : cyclopsGray}
              alt="cyclops"
              onClick={() => setMonster("cyclops")}
            />
            <img
              id={monster === "dragon" ? "selected" : "not-selected"}
              src={monster === "dragon" ? dragon : dragonGray}
              alt="dragon"
              onClick={() => setMonster("dragon")}
            />
          </div>
          <div className={styles.introductionBackground} />
          <div className={styles.introduction}>
            {monster === "yeti" ? (
              <>
                <Typography
                  variant="h1"
                  style={{ fontWeight: "bold" }}
                  gutterBottom
                >
                  Yeti
                </Typography>
                <Typography variant="h4" style={{ marginBottom: 36 }}>
                  Interests/Hobbies: swimming, studying math and history,
                  learning new languages
                </Typography>
                <Typography variant="h4">
                  Background: “I’m from the northern forests, which is being
                  destroyed by wildfire. I want to do everything I can to stop
                  these natural disasters from destroying our homes.”
                </Typography>
              </>
            ) : monster === "cyclops" ? (
              <>
                <Typography
                  variant="h1"
                  style={{ fontWeight: "bold" }}
                  gutterBottom
                >
                  Cyclops
                </Typography>
                <Typography variant="h4" style={{ marginBottom: 36 }}>
                  Interests/Hobbies: running, reading novels, drinking hot
                  chocolate
                </Typography>
                <Typography variant="h4">
                  Background: “I’m the youngest of five siblings. My family has
                  always tried to protect me from the dangers of the world, but
                  I want to be an adventurer. I won’t get the chance to unless
                  our world is saved from disaster.”
                </Typography>
              </>
            ) : monster === "dragon" ? (
              <>
                <Typography
                  variant="h1"
                  style={{ fontWeight: "bold" }}
                  gutterBottom
                >
                  Dragon
                </Typography>
                <Typography variant="h4" style={{ marginBottom: 36 }}>
                  Interests/Hobbies: flying, being immersed in the natural
                  world, photography
                </Typography>
                <Typography variant="h4">
                  Background: “I’m the botanist in my village, and I grew up
                  surrounded by plants and wildlife. I want to help save this
                  world from the natural disasters that are threatening to
                  destroy it.”
                </Typography>
              </>
            ) : (
              <Typography
                variant="h4"
                style={{ textAlign: "center" }}
                gutterBottom
              >
                Tap the monsters on the left to learn more about them. You can
                choose one to be your companion for future adventures!
              </Typography>
            )}
          </div>
        </div>
        <div className={styles.toolbar}>
          <Button onClick={handleChoose}>
            <img src="/confirm.svg" height={50} alt="confirm" />
          </Button>
        </div>
      </Container>
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Name your monster</DialogTitle>
        <DialogContent>
          <img
            src={
              monster === "yeti"
                ? "https://smart-primer.s3-us-west-1.amazonaws.com/monsters/blueloop.gif"
                : monster === "cyclops"
                ? "https://smart-primer.s3-us-west-1.amazonaws.com/monsters/purpleloop.gif"
                : "https://smart-primer.s3-us-west-1.amazonaws.com/monsters/yellowloop.gif"
            }
            alt="monster"
          />
        </DialogContent>
        <TextField
          style={{ margin: 24 }}
          placeholder="Type your monster's name here"
          value={monsterName}
          onChange={(e) => setMonsterName(e.target.value)}
        ></TextField>
        <DialogActions>
          <Button
            autoFocus
            color="primary"
            onClick={() => {
              setDialogOpen(false);
              setMonsterName("");
            }}
          >
            I want to choose another monster
          </Button>
          <Button color="primary" onClick={handleMonsterName}>
            Confirm
          </Button>
          {loading && <CircularProgress color="primary" />}
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackMessage ? true : false}
        message={snackMessage}
        onClose={(e, reason) => {
          if (reason === "clickaway") {
            return;
          }
          setSnackMessage("");
        }}
      />
    </div>
  );
}
