import React, {
  useState,
  useEffect,
  CSSProperties,
  useRef,
  useCallback,
} from "react";
import { makeStyles } from "@material-ui/core/styles";
import { InputBase, CircularProgress, Snackbar } from "@material-ui/core";
import ChatFeed from "./ChatFeed";
import { useQuery, useMutation, gql } from "@apollo/client";
import { convertToRaw, ContentState } from "draft-js";
import { useLocation } from "react-router-dom";
import { getIdleResponse, IDLE_INTERVAL } from "../config";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    width: 400,
    display: "flex",
    flexDirection: "column",
  },
  header: {
    background: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  imgBackground: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%",
    backgroundColor: "#BCDFD5",
    padding: theme.spacing(2),
  },
  main: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#A2D0C7",
    flex: 1,
    overflow: "auto",
  },
  inputContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#BCDFD5",
    padding: "15px 10px",
  },
  input: {
    flex: 1,
    resize: "none",
    border: 0,
    borderRadius: 5,
    fontSize: 18,
    padding: 12,
  },
  buttonContainer: {
    width: 60,
    display: "flex",
    justifyContent: "center",
  },
}));

const LOGIN = gql`
  {
    user {
      id
      username
      name
      monster_kind
      monster_name
    }
  }
`;

const FINISH_TUTORIAL = gql`
  mutation finishTutorial($id: Int!) {
    update_user(where: { id: { _eq: $id } }, _set: { finish_tutorial: true }) {
      returning {
        id
      }
    }
  }
`;

const ADD_MESSAGE = gql`
  mutation(
    $from: Int!
    $to: Int!
    $payload: String!
    $tutorial: Boolean
    $step: String
    $feedback_training: Boolean
  ) {
    insert_message(
      objects: {
        from: $from
        payload: $payload
        to: $to
        tutorial: $tutorial
        step: $step
        feedback_training: $feedback_training
      }
    ) {
      returning {
        id
      }
    }
  }
`;

export interface ChatProps {
  tutorial?: boolean;
  containerStyle?: CSSProperties;
}

export default function Chat(props: ChatProps) {
  const styles = useStyles();

  const location = useLocation();
  const pageNo = location.pathname.split("/")[2];
  const step =
    pageNo === "3"
      ? "height"
      : pageNo === "4"
      ? "width"
      : pageNo === "5"
      ? "length"
      : pageNo === "6"
      ? "volume"
      : pageNo === "7"
      ? "weight"
      : pageNo === "8"
      ? "comparison"
      : undefined;

  const { tutorial } = props;

  const { data } = useQuery(LOGIN);
  const user = data?.user?.[0];
  const monsterKind = user?.monster_kind;
  const [addMessage, { loading, error }] = useMutation(ADD_MESSAGE);
  const [finishTutorial] = useMutation(FINISH_TUTORIAL);

  const [text, setText] = useState("");
  const [snackMessage, setSnackMessage] = useState("");

  useEffect(() => {
    if (error) {
      setSnackMessage("Failed to send the message.");
    }
  }, [error]);

  const [replyCount, setReplyCount] = useState(0);

  const timer = useRef<NodeJS.Timeout | null>(null);

  const idleAlert = useCallback(() => {
    addMessage({
      variables: {
        from: 1,
        to: user?.id,
        payload: JSON.stringify({
          text: JSON.stringify(
            convertToRaw(ContentState.createFromText(getIdleResponse()))
          ),
        }),
        tutorial: true,
      },
    });
  }, [addMessage, user]);

  useEffect(() => {
    if (tutorial === false) {
      addMessage({
        variables: {
          from: 1,
          to: user?.id,
          payload: JSON.stringify({
            text: JSON.stringify(
              convertToRaw(
                ContentState.createFromText(
                  "Remember, you can chat with me if you’re stuck, so we can come up with ideas together!"
                )
              )
            ),
          }),
          tutorial: true,
        },
      });
      timer.current = setInterval(idleAlert, IDLE_INTERVAL);
    }
  }, [addMessage, idleAlert, tutorial, user]);

  useEffect(() => {
    if (user && tutorial) {
      const send = async (
        text: string,
        delay?: number,
        feedbackTraining?: boolean
      ) => {
        //#region delay code
        const wait = new Promise((res, rej) => {
          setTimeout(() => res(), delay);
        });

        if (delay != null && delay > 0) {
          await wait;
        }
        //#endregion

        addMessage({
          variables: {
            from: 1,
            to: user?.id,
            payload: JSON.stringify({
              text: JSON.stringify(
                convertToRaw(ContentState.createFromText(text))
              ),
            }),
            tutorial: true,
            feedback_training: feedbackTraining,
          },
        });
      };
      switch (replyCount) {
        case 0:
          send(`Hi ${user.name}! My name is ${user.monster_name}.`);
          break;
        case 1:
          const text =
            user.monster_kind === "cyclops"
              ? "I’m a cyclops, and I love running and reading novels."
              : user.monster_kind === "yeti"
              ? "I’m a yeti, and I can speak and write four languages fluently."
              : "I’m a dragon, and I love flying and photography.";
          send(
            `${text} What about you? Tell me a little about yourself.`,
            1000
          );
          break;
        case 2:
          send("Great! I'm so happy to meet you.", 1000);
          break;
        case 3:
          send(
            "Hold on, we need to make sure we stay safe! What do you think about putting on a face mask?",
            1000
          );
          break;
        case 4:
          send(
            "Awesome! We'll be working together to stop the natural disasters. Chat with me so we can come up with ideas together!",
            1000
          );
          // Sends 5 seconds after the first message
          send(
            "If you find any of my hints helpful, let me know by clicking the “Helpful” button next to the hint.",
            4000
          );
          // Sends 7 seconds after the first message
          send("Give it a try!", 7000, true);
          break;
      }
    }
  }, [addMessage, finishTutorial, replyCount, tutorial, user]);

  const [feedbackTrained, setFeedbackTrained] = useState(false);

  useEffect(() => {
    if (feedbackTrained) {
      addMessage({
        variables: {
          from: 1,
          to: user?.id,
          payload: JSON.stringify({
            text: JSON.stringify(
              convertToRaw(
                ContentState.createFromText(
                  "Great job! Now you know that I’m always here to help. Are you ready for our mission? Click the Right Arrow button that just appeared, and we’ll get started!"
                )
              )
            ),
          }),
          tutorial: true,
        },
      });
      finishTutorial({
        variables: {
          id: user?.id,
        },
      });
    }
  }, [addMessage, finishTutorial, feedbackTrained, user]);

  const sendMessage = async (
    e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    if (e.key !== "Enter") return;

    if (!text) return;

    e.preventDefault();

    await addMessage({
      variables: {
        from: user?.id,
        to: 1,
        payload: JSON.stringify({
          text: JSON.stringify(convertToRaw(ContentState.createFromText(text))),
        }),
        tutorial,
        step,
      },
    });

    if (!tutorial) {
      timer.current && clearInterval(timer.current);
      timer.current = setInterval(idleAlert, IDLE_INTERVAL);
    }

    if (tutorial) {
      setReplyCount((replyCount) => replyCount + 1);
    }

    setText("");
  };

  return (
    <div style={props.containerStyle} className={styles.root}>
      <div className={styles.header}>
        <div className={styles.imgBackground}>
          <img
            src={
              monsterKind === "dragon"
                ? "/dragon-avatar.svg"
                : monsterKind === "yeti"
                ? "/yeti-avatar.svg"
                : "/cyclops-avatar.svg"
            }
            style={{ width: "30%" }}
            alt="avatar"
          />
        </div>
      </div>
      <div className={styles.main}>
        <ChatFeed
          from={user?.id}
          to={1}
          fromBubbleColor="#C4F7E9"
          toBubbleColor={
            monsterKind === "dragon"
              ? "#FFFFEE"
              : monsterKind === "yeti"
              ? "#E3FBFF"
              : "#F4F3FF"
          }
          onFeedbackTraningComplete={() => setFeedbackTrained(true)}
        />
        <div className={styles.inputContainer}>
          {loading ? (
            <CircularProgress style={{ margin: "2.5px auto" }} />
          ) : (
            <InputBase
              className={styles.input}
              placeholder="Type here. Enter ⏎ to send."
              multiline
              rowsMax={5}
              autoCapitalize="on"
              autoFocus
              value={text}
              onChange={(e) =>
                !e.target.value.endsWith("\n") && setText(e.target.value)
              }
              onKeyUp={sendMessage}
            />
          )}
        </div>
      </div>
      <Snackbar
        open={snackMessage ? true : false}
        message={snackMessage}
        onClose={(e, reason) => {
          if (reason === "clickaway") {
            return;
          }
          setSnackMessage("");
        }}
        autoHideDuration={3000}
      />
    </div>
  );
}
