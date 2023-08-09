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

export default function ChapterOne4(props: PrologueProps) {
  const styles = useStyles();

  const { name, monsterName } = props;

  return (
    <div className={styles.root}>
      <Typography component="p" gutterBottom>
        <b>Captain</b>: Hm, I guess you’re right! This all checks out!
      </Typography>
      <Typography component="p" gutterBottom>
        <b>{name}</b>: I knew we could do it!
      </Typography>
      <Typography component="p" gutterBottom>
        <b>Captain</b>: As a token of thanks, here are a few coins to help you
        continue your journey.
      </Typography>
      <Typography component="p" gutterBottom>
        <b>{name}</b>: Wow, thanks so much!
      </Typography>
      <Typography component="p" gutterBottom>
        <b>Captain</b>: If it’s not too much of a bother, could you pass the
        chocolate box on to my kids? They live in the village across from here.
        Just ask for Sandy and Patrick.
      </Typography>
      <Typography component="p" gutterBottom>
        <b>{monsterName}</b>: Of course, it’s no problem at all.
      </Typography>
    </div>
  );
}
