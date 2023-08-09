import React from "react";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import box_and_chocolate from "../assets/box-and-chocolate.png";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
    "& > *": {
      fontSize: "3.2vh",
    },
  },
}));

export default function Task1(props: { name: string; condition: string }) {
  const styles = useStyles();

  const { name, condition } = props;

  return (
    <div className={styles.root}>
      {condition === "D" ? (
        <>
          {" "}
          <Typography component="p" gutterBottom>
            Using these observations, how can {name} prove that all three of you
            can safely cross the river by approximating the total weight of the
            package? How can {name} find the weight of the package without
            actually counting the chocolates?
          </Typography>
          <Typography component="p" gutterBottom>
            Notice that {name} can use the box and the chocolate, provided as
            images, to solve this problem.
          </Typography>
          <div style={{ textAlign: "center" }}>
            <img src={box_and_chocolate} alt="Box and chocolate" height="200" />
          </div>
          <Typography component="p" gutterBottom>
            The width, height, and length of each chocolate is the same.
          </Typography>
        </>
      ) : (
        <>
          <Typography component="p">
            Assume you have a box and some chocolates that are roughly
            cube-shaped. Suppose that each piece of chocolate weighs exactly{" "}
            <b>2</b> ounces, and that the weight of the box itself can be
            ignored.
          </Typography>
          <div style={{ textAlign: "center" }}>
            <img
              src={box_and_chocolate}
              alt="Box and chocolate"
              width="427"
              height="200"
            />
          </div>
          <Typography component="p">
            The width, height, and length of each chocolate is the same.
          </Typography>
        </>
      )}
    </div>
  );
}
