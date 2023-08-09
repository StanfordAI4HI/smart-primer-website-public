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

export default function Task7(props: TaskProps) {
  const styles = useStyles();

  const { answer } = props;

  const [input, setInput] = useState(
    props.answer.weight ? props.answer.weight.toString() : ""
  );
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    try {
      const inputWeight = parseFloat(input);

      if (Number.isNaN(inputWeight)) {
        setMessage("Please fill out the answer.");
        return;
      }

      if (
        inputWeight.toFixed(1) ===
        (answer.height! * answer.length! * answer.width! * 2).toFixed(1)
      ) {
        props.onSubmit?.({ weight: inputWeight });
        setMessage("Correct! You may proceed to the next page.");
      } else {
        setMessage("Sorry, that’s not quite right. Please try again.");
      }
      reportAnswer("/tasks/7", props.userId, {
        ...props.answer,
        weight: inputWeight,
      });
    } catch {
      setMessage("Please fill out the answer.");
    }
  };

  return (
    <div className={styles.root}>
      <Typography component="p" gutterBottom>
        We know that each piece of chocolate weighs <b>2</b> ounces and that
        there are <b>{answer.total}</b> chocolates in the box.
      </Typography>
      <Box answer={answer} variant="3d" />
      <Typography component="p" gutterBottom>
        How much does the box of chocolates weigh?
      </Typography>
      <div className={styles.flexRow}>
        <Input
          type="number"
          inputProps={{ min: 0 }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        ounces
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
