import React, { useState } from "react";
import { Typography, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Box from "./Box";
import Input from "./Input";
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
}

export default function Task5(props: TaskProps) {
  const styles = useStyles();

  const [input, setInput] = useState(
    props.answer.length ? props.answer.length.toString() : ""
  );
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    try {
      const inputLength = parseInt(input, 10);

      if (Number.isNaN(inputLength)) {
        setMessage("Please fill out the answer.");
        return;
      }

      if (inputLength === 6) {
        props.onSubmit?.({ length: inputLength });
        setMessage("Correct! You may proceed to the next page.");
      } else {
        setMessage("Sorry, that’s not quite right. Please try again.");
      }
      reportAnswer("/tasks/5", props.userId, {
        ...props.answer,
        length: inputLength,
      });
    } catch {
      setMessage("Please fill out the answer.");
    }
  };

  return (
    <div className={styles.root}>
      <Typography component="p" gutterBottom>
        Good job! Hang in there, we're almost done with the measurements. Our
        last measurement to estimate is the <b>length</b>.
      </Typography>
      <Box answer={props.answer} variant="length" />
      <Typography component="p" gutterBottom>
        How many chocolates fit along the <b>length</b>?
      </Typography>
      <div className={styles.flexRow}>
        <Input
          type="number"
          inputProps={{ min: 0 }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        chocolates
        <div style={{ flex: 1, textAlign: "center" }}>
          <Button onClick={handleSubmit}>
            <img src="/submit.svg" height={50} alt="submit" />
          </Button>
        </div>
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
