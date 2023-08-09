import React from "react";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import monsterC from "../assets/monster_c.png";

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

export default function Prologue5(props: PrologueProps) {
  const styles = useStyles();

  return (
    <div className={styles.root}>
      <Typography component="p" gutterBottom>
        <b>Yeti</b>: That’s why we want to stabilize the world’s landscapes.
        We’ve heard that, at the heart of every area, there’s a “core” that’ll
        let us to stop these natural disasters.
      </Typography>
      <div style={{ textAlign: "center" }}>
        <img src={monsterC} alt="yeti" />
      </div>
    </div>
  );
}
