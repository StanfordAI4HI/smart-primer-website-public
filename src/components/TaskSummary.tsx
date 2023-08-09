import React from "react";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import volume_multiplication from "../assets/volume_multiplication.png";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
    "& > p": {
      fontSize: "2.8vh",
    },
  },
}));

export default function TaskSummary() {
  const styles = useStyles();

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
        Summary
      </Typography>
      <Typography component="p" gutterBottom>
        In this mission, we wanted you to learn about the concept of volume.{" "}
        <b>Volume</b> is the amount of three-dimensional space an object or
        substance occupies. It is also its capacity.
      </Typography>
      <Typography component="p" gutterBottom>
        Through your mission, we wanted you to observe how the volume of objects
        can be measured using certain formulas. For example, the volume of a
        rectangular box would be: <b>Length × Width × Height</b>. You discovered
        this relation between the volume of an object and its dimensions
        yourself by the way you counted chocolates.
      </Typography>
      <div style={{ textAlign: "center" }}>
        <img
          src={volume_multiplication}
          alt="volume_multiplication"
          height="200"
        />
      </div>
    </div>
  );
}
