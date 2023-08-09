import React from "react";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import captain from "../assets/captain.png";

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

export default function ChapterOne2(props: PrologueProps) {
  const styles = useStyles();

  const { name, monsterName } = props;

  return (
    <div className={styles.root}>
      <Typography component="p" gutterBottom>
        <b>{monsterName}</b>: Let’s ask the captain if we can take the boat
        across.
      </Typography>
      <Typography component="p" gutterBottom>
        {name} and {monsterName} approach the boat and greet the captain,
        explaining their situation.
      </Typography>
      <Typography component="p">
        <b>Captain</b>: I’d love to take you both on the boat, but I also need
        to get this box of chocolates across to my kids. If my boat takes the
        box of chocolates, plus the two of you, the boat will surely sink!
      </Typography>
      <div style={{ textAlign: "center" }}>
        <img height="200" src={captain} alt="captain" />
      </div>
    </div>
  );
}
