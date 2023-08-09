import React from "react";
import { InputBase, InputBaseProps } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#23baab",
    width: 300,
    height: 50,
    paddingLeft: 16,
    paddingRight: 16,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
  },
  input: {
    caretColor: "#fff",
    color: "#fff",
    fontSize: 24,
    "::placeholder": {
      color: "#fefefe",
    },
  },
}));

export interface InputProps extends InputBaseProps {}

export default function Input(props: InputProps) {
  const styles = useStyles();

  return (
    <div className={styles.root}>
      <InputBase
        className={styles.input}
        placeholder="Answer here"
        fullWidth
        {...props}
      />
    </div>
  );
}
