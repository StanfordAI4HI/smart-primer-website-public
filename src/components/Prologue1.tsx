import React from "react";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

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
}

export default function Prologue1(props: PrologueProps) {
  const styles = useStyles();

  const { name } = props;

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
        Prologue
      </Typography>
      <Typography component="p" gutterBottom>
        It happens on a muggy August day while {name} is listening to the
        evening news on the radio.
      </Typography>
      <Typography component="p" gutterBottom>
        <b>Newscaster</b>: As the sea level continues to rise on the western
        coast, we’ve received reports that the wildfire in the northern forest
        continues to rage, drawing close to civilization.
      </Typography>
      <Typography component="p">
        This is no surprise to {name}. It’s been getting harder to breathe for
        the past month, and the sky is almost constantly an angry shade of red.
        In the distance, plumes of smoke rise in the air, something {name} could
        have, in any other world, mistaken for mountains.
      </Typography>
    </div>
  );
}
