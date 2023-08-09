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

export interface TutorialProps {
  name: string;
  monsterName: string;
}

export default function Tutorial(props: TutorialProps) {
  const styles = useStyles();

  const { name, monsterName } = props;

  return (
    <div className={styles.root}>
      <Typography
        variant="h2"
        gutterBottom
        style={{
          fontWeight: "bold",
          fontStyle: "italic",
          textAlign: "center",
          marginBottom: 24,
        }}
      >
        Tutorial
      </Typography>
      <Typography component="p" gutterBottom>
        Hi, {name}!
      </Typography>
      <Typography component="p" gutterBottom>
        As you embark on your journey with {monsterName}, you’ll have the
        opportunity to talk to {monsterName} through the chat box on the right.
        You can talk to {monsterName} about anything you want.
      </Typography>
      <Typography component="p" gutterBottom>
        Ready to begin? Awesome! Type in the chat box and send hello to{" "}
        {monsterName} to get started.
      </Typography>
    </div>
  );
}
