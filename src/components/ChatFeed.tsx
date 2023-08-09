import React, { useRef, useEffect, useState } from "react";
import ChatBubble from "../components/ChatBubble";
import { List, ListItem, CircularProgress, Snackbar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useSubscription, useMutation, gql } from "@apollo/client";

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    overflow: "auto",
  },
  list: {
    padding: "5px 20px",
  },
  listItem: {
    padding: "6px 0",
  },
}));

const SUBSCRIBE_MESSAGES = gql`
  subscription GetMessages($from: Int!, $to: Int!) {
    message(
      order_by: { created_at: asc }
      where: {
        _or: [
          { _and: { from: { _eq: $from }, to: { _eq: $to } } }
          { _and: { from: { _eq: $to }, to: { _eq: $from } } }
        ]
      }
    ) {
      created_at
      tutorial
      from
      id
      payload
      to
      feedback_training
      response {
        positive_feedback
      }
    }
  }
`;

const UPDATE_FEEDBACK = gql`
  mutation UpdateFeedback($messageId: uuid!, $feedback: Boolean!) {
    update_response(
      where: { output_message_id: { _eq: $messageId } }
      _set: { positive_feedback: $feedback }
    ) {
      returning {
        id
      }
    }
  }
`;

export interface ChatFeedProps {
  from: number;
  to: number;
  fromBubbleColor?: string;
  toBubbleColor?: string;
  onFeedbackTraningComplete?: () => void;
}

const ChatFeed: React.FC<ChatFeedProps> = ({
  from,
  to,
  fromBubbleColor,
  toBubbleColor,
  onFeedbackTraningComplete,
}) => {
  const styles = useStyles();

  const scrollViewRef = useRef<HTMLDivElement>(null);

  const { data, loading, error } = useSubscription(SUBSCRIBE_MESSAGES, {
    variables: { from, to },
    skip: !(from && to),
  });

  const [snackMessage, setSnackMessage] = useState("");

  useEffect(() => {
    if (error && !loading) {
      setSnackMessage(
        "Failed to connect to the ChatBot. The page will refresh now."
      );
      setTimeout(() => window.location.reload(), 3000);
    }
  }, [error, loading]);

  useEffect(() => {
    if (data && !loading && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        top: scrollViewRef.current.scrollHeight,
        behavior: "smooth",
      });
      setTimeout(() => {
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollTo({
            top: scrollViewRef.current.scrollHeight,
            behavior: "smooth",
          });
        }
        setTimeout(() => {
          if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({
              top: scrollViewRef.current.scrollHeight,
              behavior: "smooth",
            });
          }
        }, 500);
      }, 500);
    }
  }, [data, loading]);

  const [updateFeedback, { loading: feedbackLoading }] = useMutation(
    UPDATE_FEEDBACK
  );

  const handleFeedback = (messageId: string, positive: boolean) => {
    updateFeedback({
      variables: {
        messageId,
        feedback: positive,
      },
    });
  };

  const [feedbackTrainingComplete, setFeedbackTrainingComplete] = useState(
    false
  );

  const handleFeedbackTraining = () => {
    setFeedbackTrainingComplete(true);
    onFeedbackTraningComplete?.();
  };

  return (
    <div className={styles.root} ref={scrollViewRef}>
      <List className={styles.list}>
        {data &&
          data.message &&
          data.message.map((message: any) => (
            <ListItem key={message.id} className={styles.listItem}>
              <ChatBubble
                position={message.from === from ? "right" : "left"}
                text={JSON.parse(message.payload).text}
                image={JSON.parse(message.payload).image}
                fromBubbleColor={fromBubbleColor}
                toBubbleColor={toBubbleColor}
                positiveFeedback={
                  message.feedback_training
                    ? feedbackTrainingComplete
                    : message.response?.positive_feedback
                }
                onFeedback={(positive) =>
                  message.feedback_training
                    ? handleFeedbackTraining()
                    : handleFeedback(message.id, positive)
                }
                tutorial={message.tutorial}
                feedbackTraining={message.feedback_training}
              />
            </ListItem>
          ))}
        {(loading || feedbackLoading) && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              bottom: 20,
              left: 0,
              right: 0,
              position: "absolute",
            }}
          >
            <CircularProgress color="secondary" />
          </div>
        )}
      </List>
      <Snackbar
        open={snackMessage ? true : false}
        message={snackMessage}
        onClose={(e, reason) => {
          if (reason === "clickaway") {
            return;
          }
          setSnackMessage("");
        }}
      />
    </div>
  );
};

export default ChatFeed;
