import React from "react";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import boat from "../assets/boat.png";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(6),
    "& > p": {
      fontSize: "3.2vh",
    },
  },
}));

export interface PrologueProps {
  name: string;
  gender: string;
  monsterName: string;
}

export default function ChapterOne1(props: PrologueProps) {
  const styles = useStyles();

  const { name, monsterName } = props;

  return (
    <div className={styles.root}>
      <Typography component="p" gutterBottom>
        <b>{monsterName}</b>: The northern forest is currently facing a wildfire
        that is destroying the wildlife and villages. To stop the fire from
        spreading, we need to reach a meadow — the core — in the middle of the
        forest.
      </Typography>
      <Typography component="p" gutterBottom>
        <b>{monsterName}</b>: But first, we need to cross this river.
      </Typography>
      <Typography component="p">
        {name} looks around, but can’t find a bridge across the river.{" "}
        {monsterName} points in the direction of a boat secured at the dock.
      </Typography>
      <div style={{ textAlign: "center" }}>
        <img height="200" src={boat} alt="boat" />
      </div>
    </div>
  );
}
