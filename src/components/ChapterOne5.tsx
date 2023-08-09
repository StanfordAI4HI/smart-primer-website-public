import React from "react";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import village_scene from "../assets/village_scene.png";

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

export default function ChapterOne5(props: PrologueProps) {
  const styles = useStyles();

  const { name, monsterName } = props;

  return (
    <div className={styles.root}>
      <Typography component="p" gutterBottom>
        {name} and {monsterName} board the boat with the chocolate box and sail
        across the river. They see the entrance of a small village in the
        distance, where their journey awaits.
      </Typography>
      <div style={{ textAlign: "center" }}>
        <img src={village_scene} alt="village" height="300" />
      </div>
      <Typography component="p" gutterBottom>
        <i>To be continued…</i>
      </Typography>
    </div>
  );
}
