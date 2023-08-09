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

export default function Prologue6(props: PrologueProps) {
  const styles = useStyles();

  const { name } = props;

  return (
    <div className={styles.root}>
      <Typography component="p" gutterBottom>
        <b>Cyclops</b>: These cores are portals that will reverse the natural
        disasters destroying the land. For example, reaching the core of the
        northern forests will trigger rainfall and put out the wildfires.
      </Typography>
      <Typography component="p" gutterBottom>
        <b>Dragon</b>: However, an explorer needs bravery and curiosity to reach
        the core.
      </Typography>
      <Typography component="p" gutterBottom>
        <b>Yeti</b>: That’s why we need you to go on this journey and help us
        save our world. Want to go on an adventure?
      </Typography>
      <Typography component="p" gutterBottom>
        {name} agrees. {name} wants to stop these natural disasters just as much
        as anyone else in this city does.
      </Typography>
      <Typography component="p" gutterBottom>
        <b>Yeti</b>: However, only one of us can go on the adventure so the rest
        of us can return to our villages and protect our families.
      </Typography>
    </div>
  );
}
