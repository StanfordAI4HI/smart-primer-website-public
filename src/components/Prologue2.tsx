import React from "react";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

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

export default function Prologue2(props: PrologueProps) {
  const styles = useStyles();

  const { name, gender } = props;

  return (
    <div className={styles.root}>
      <Typography component="p" gutterBottom>
        <b>Newscaster</b>: The city recommends that its citizens prepare to
        relocate to our neighboring cities in the south. In the meantime, all
        residents should wear face masks when going outside, since air pollution
        has reached uninhabitable levels.
      </Typography>
      <Typography component="p" gutterBottom>
        A face mask — that’s something that {name} still needs to get. Rising up
        from the sofa, {name} heads out for a trip to the nearest convenience
        store.
      </Typography>
      <Typography component="p" gutterBottom>
        It’s while {name} is at the cashier that{" "}
        {gender === "boy" ? "he" : "she"} spots three monsters huddled over a
        map outside the store. {name} approaches them to remind them to wear
        face masks — after all, air pollution can be deadly. One of the monsters
        — a cyclops, {name} realizes — notices{" "}
        {gender === "boy" ? "him" : "her"} first.
      </Typography>
    </div>
  );
}
