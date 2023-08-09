import React, { useState } from "react";
import { Typography, Button, Snackbar } from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Box from "./Box";
import Input from "./Input";
import { reportAnswer } from "../api";

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

export const SnackbarWithOffset = withStyles({
  root: {
    paddingRight: "380px",
    paddingBottom: "30px",
    zIndex: 0,
  },
})(Snackbar);

export interface Answer {
  height?: number;
  length?: number;
  width?: number;
  total?: number;
  weight?: number;
  yes?: boolean;
}

export interface Task2Props {
  answer: Answer;
  onSubmit?: (answer: Answer) => void;
  userId: number;
}

export default function Task3(props: Task2Props) {
  const styles = useStyles();

  const [input, setInput] = useState(
    props.answer.height ? props.answer.height.toString() : ""
  );
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    try {
      const inputHeight = parseInt(input, 10);

      if (Number.isNaN(inputHeight)) {
        setMessage("Please fill out the answer.");
        return;
      }

      if (inputHeight === 3) {
        props.onSubmit?.({ height: inputHeight });
        setMessage("Correct! You may proceed to the next page.");
      } else {
        setMessage("Sorry, that’s not quite right. Please try again.");
      }
      reportAnswer("/tasks/3", props.userId, {
        ...props.answer,
        height: inputHeight,
      });
    } catch {
      setMessage("Please fill out the answer.");
    }
  };

  return (
    <div className={styles.root}>
      <Typography component="p" gutterBottom>
        Let’s start off by figuring out the total number of chocolates in the
        box. Let’s do this by estimating the height first.
      </Typography>
      <Box answer={props.answer} variant="height" />
      <Typography component="p" gutterBottom>
        How many chocolates fit along the <b>height</b>?
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
