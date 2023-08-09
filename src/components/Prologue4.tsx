import React from "react";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import monsterB from "../assets/monster_b.png";

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

export default function Prologue4(props: PrologueProps) {
  const styles = useStyles();

  return (
    <div className={styles.root}>
      <Typography component="p" gutterBottom>
        <b>Dragon</b>: Oh, don’t worry, we aren’t staying here for long! We’re
        going to travel and stop these natural disasters from destroying our
        world. I want to preserve the wildlife in my home village, but with
        these wildfires ruining the forests, there might not be anything left to
        preserve soon!
      </Typography>
      <div style={{ textAlign: "center" }}>
        <img src={monsterB} alt="dragon" />
      </div>
    </div>
  );
}
