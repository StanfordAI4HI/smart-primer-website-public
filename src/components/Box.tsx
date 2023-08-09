import React from "react";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import box from "../assets/box-3d.png";
import boxHeight from "../assets/box-height.png";
import boxLength from "../assets/box-length.png";
import boxWidth from "../assets/box-width.png";
import { Answer } from "./Task3";
import "./Box.css";

const useStyles = makeStyles((theme) => ({
  text: {
    position: "absolute",
  },
}));

export interface BoxProps {
  answer: Answer;
  variant?: "height" | "length" | "width" | "3d";
}

export default function Box(props: BoxProps) {
  const styles = useStyles();

  const { height, length, width } = props.answer;
  const { variant } = props;

  return (
    <div
      style={{
        textAlign: "center",
      }}
    >
      {variant === "height" && (
        <div
          style={{
            position: "relative",
            display: "inline-block",
          }}
        >
          <img src={boxHeight} alt="Box" id="box" width="321" height="220" />
          <Typography
            className={styles.text}
            variant="h5"
            component="span"
            style={{
              bottom: 80,
              right: 300,
            }}
          >
            {height || "Height"}
          </Typography>
        </div>
      )}
      {variant === "width" && (
        <div
          style={{
            position: "relative",
            display: "inline-block",
          }}
        >
          <img src={boxWidth} alt="Box" id="box" width="300" />
          <Typography
            className={styles.text}
            variant="h5"
            component="span"
            style={{
              bottom: 6,
              left: 0,
              right: 0,
            }}
          >
            {width || "Width"}
          </Typography>
        </div>
      )}
      {variant === "length" && (
        <div
          style={{
            position: "relative",
            display: "inline-block",
          }}
        >
          <img src={boxLength} alt="Box" id="box" width="303" />
          <Typography
            className={styles.text}
            variant="h5"
            component="span"
            style={{
              bottom: 6,
              left: 0,
              right: 0,
            }}
          >
            {length || "Length"}
          </Typography>
        </div>
      )}
      {variant === "3d" && (
        <div
          style={{
            position: "relative",
            display: "inline-block",
          }}
        >
          <img src={box} alt="Box" width="321" height="220" />
          <Typography
            className={styles.text}
            variant="h5"
            component="span"
            style={{
              bottom: 146,
              right: 310,
            }}
          >
            {height || "Height"}
          </Typography>
          <Typography
            className={styles.text}
            variant="h5"
            component="span"
            style={{
              bottom: 50,
              right: 268,
            }}
          >
            {width || "Width"}
          </Typography>
          <Typography
            className={styles.text}
            variant="h5"
            component="span"
            style={{
              bottom: 20,
              left: 215,
            }}
          >
            {length || "Length"}
          </Typography>
        </div>
      )}
    </div>
  );
}
