import React from "react";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import monsterA from "../assets/monster_a.png";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(6),
    "& > *": {
      fontSize: "3.2vh",
    },
  },
}));

export interface PrologueProps {
  name: string;
  gender: string;
}

export default function Prologue3(props: PrologueProps) {
  const styles = useStyles();

  const { name, gender } = props;

  return (
    <div className={styles.root}>
      <Typography component="p" gutterBottom>
        <b>Cyclops</b>: Hi there! Do you enjoy solving problems and learning new
        things?
      </Typography>
      <div style={{ textAlign: "center" }}>
        <img src={monsterA} alt="cyclops" />
      </div>
      <Typography component="p" gutterBottom>
        {name} confirms that {gender === "boy" ? "he" : "she"} does, and takes
        the gap in the conversation to remind them about the face masks.
      </Typography>
    </div>
  );
}
