import React, { useState } from "react";
import { Typography, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Box from "./Box";
import { Answer } from "./Task3";
import { reportAnswer } from "../api";
import { SnackbarWithOffset } from "./Task3";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
    "& > *": {
      fontSize: "3.2vh",
    },
  },
  flexRow: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-around",
    "& > *": {
      margin: theme.spacing(2),
    },
  },
}));

export interface TaskProps {
  answer: Answer;
  onSubmit?: (answer: Answer) => void;
  userId: number;
  condition: string;
  name: string;
  monsterName: string;
}

export default function Task8(props: TaskProps) {
  const styles = useStyles();

  const { answer, condition, name, monsterName } = props;

  const [message, setMessage] = useState("");

  const handleYes = () => {
    props.onSubmit?.({ yes: true });
    reportAnswer("/tasks/8", props.userId, {
      ...props.answer,
      yes: true,
    });
  };

  const handleNo = () => {
    setMessage("Sorry, that’s not quite right. Please try again.");
    reportAnswer("/tasks/8", props.userId, {
      ...props.answer,
      yes: false,
    });
  };

  return (
    <div className={styles.root}>
      {condition === "D" ? (
        <Typography component="p" gutterBottom>
          Lastly, can {name} and {monsterName} safely board the boat? Note that
          the boat can hold at most <b>200</b> ounces of chocolates.
        </Typography>
      ) : (
        <Typography component="p" gutterBottom>
          We know that <b>{answer.total}</b> chocolates weigh{" "}
          <b>{answer.weight}</b> ounces in total. Do the chocolates weigh less
          than <b>200</b> ounces?
        </Typography>
      )}
      <Box answer={answer} variant="3d" />
      <div className={styles.flexRow}>
        <Button onClick={handleYes}>
          <img src="/yes.svg" height={50} alt="yes" />
        </Button>
        <Button onClick={handleNo}>
          <img src="/no.svg" height={50} alt="no" />
        </Button>
      </div>
      <SnackbarWithOffset
        open={message ? true : false}
        message={message}
        onClose={(e, reason) => {
          if (reason === "clickaway") {
            return;
          }
          setMessage("");
        }}
        autoHideDuration={3000}
      />
    </div>
  );
}
