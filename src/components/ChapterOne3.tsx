import React from "react";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

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

export default function ChapterOne3(props: PrologueProps) {
  const styles = useStyles();

  const { name, monsterName } = props;

  return (
    <div className={styles.root}>
      <Typography component="p" gutterBottom>
        <b>{monsterName}</b>: I’m sure we can all cross the river on this boat
        safely.
      </Typography>
      <Typography component="p" gutterBottom>
        <b>Captain</b>: I doubt it. Excluding the combined weight of the two of
        you, the weight of the box of chocolates can’t be more than <b>200</b>{" "}
        ounces.
      </Typography>
      <Typography component="p">
        Looking at the box, {name} notices that it is about the size of a
        package box, and that each chocolate is roughly cube-shaped. The captain
        knows that each piece of chocolate weighs exactly <b>2</b> ounces, and
        that the weight of the box itself can be ignored.
      </Typography>
    </div>
  );
}
