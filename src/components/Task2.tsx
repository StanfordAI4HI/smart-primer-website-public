import React from "react";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import hoverGif from "../assets/hoverGif.png";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
    "& > *": {
      fontSize: "3.2vh",
    },
  },
}));

export default function Task2(props: { condition: string }) {
  const styles = useStyles();

  const { condition } = props;

  return (
    <div className={styles.root}>
      {condition === "D" ? (
        <>
          {" "}
          <Typography component="p" gutterBottom>
            To see how big the chocolate is relative to the box, simply move
            your mouse over the box:
          </Typography>
          <div style={{ textAlign: "center" }}>
            <img src={hoverGif} alt="hover mouse over the box" height="250" />
          </div>
          <Typography component="p" gutterBottom>
            You will have the opportunity to try this in the next page.
          </Typography>
        </>
      ) : (
        <>
          <Typography component="p" gutterBottom>
            Using these observations, figure out if the total weight is less
            than <b>200</b> ounces.
          </Typography>
          <Typography component="p" gutterBottom>
            Notice that you can use the box and the chocolate, provided as
            images, to solve this problem. To see how big the chocolate is
            relative to the box, simply move your mouse over the box:
          </Typography>
          <div style={{ textAlign: "center" }}>
            <img src={hoverGif} alt="hover mouse over the box" height="250" />
          </div>
          <Typography component="p" gutterBottom>
            You will have the opportunity to try this in the next page.
          </Typography>
        </>
      )}
    </div>
  );
}
