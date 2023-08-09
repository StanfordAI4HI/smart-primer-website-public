import React from "react";
import { EditorState, convertFromRaw } from "draft-js";
import { makeStyles } from "@material-ui/core/styles";
import { IconButton, Typography } from "@material-ui/core";
import Editor from "draft-js-plugins-editor";
import createInlineToolbarPlugin from "draft-js-inline-toolbar-plugin";
import createImagePlugin from "draft-js-image-plugin";
import "./ChatBubble.css";

const imagePlugin = createImagePlugin();
const inlineToolbarPlugin = createInlineToolbarPlugin();

export interface ChatBubbleProps {
  text?: string;
  image?: string;
  position: "left" | "right";
  fromBubbleColor?: string;
  toBubbleColor?: string;
  positiveFeedback?: boolean | null;
  onFeedback?: (positive: boolean) => void;
  tutorial?: boolean;
  feedbackTraining?: boolean;
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
  },
  feedback: {
    margin: theme.spacing(1),
    display: "flex",
    flexDirection: "column",
    justifyItems: "center",
    alignItems: "center",
    "& > *": {
      marginRight: theme.spacing(1),
    },
  },
}));

const ChatBubble: React.FC<ChatBubbleProps> = ({
  text,
  image,
  position,
  fromBubbleColor,
  toBubbleColor,
  positiveFeedback,
  onFeedback,
  tutorial,
  feedbackTraining,
}) => {
  const styles = useStyles();

  const bubbleColor =
    (position === "left" ? toBubbleColor : fromBubbleColor) || "#eee";

  return (
    <div
      className={styles.root}
      style={{
        justifyContent: position === "left" ? "flex-start" : "flex-end",
      }}
    >
      {image ? (
        <div
          style={{
            backgroundColor: bubbleColor,
            borderRadius: 15,
            maxWidth: "70%",
            padding: 10,
          }}
        >
          <img
            style={{
              borderRadius: 15,
              width: "100%",
              objectFit: "contain",
            }}
            alt="chat-bubble"
            src={image}
          />
        </div>
      ) : (
        <div
          id="img-container"
          style={{
            backgroundColor: bubbleColor,
            borderRadius: 15,
            maxWidth: "70%",
            padding: 10,
          }}
        >
          <Editor
            editorState={EditorState.createWithContent(
              convertFromRaw(JSON.parse(text!))
            )}
            readOnly
            onChange={() => {}}
            plugins={[imagePlugin, inlineToolbarPlugin]}
          />
        </div>
      )}
      {position === "left" && (!tutorial || feedbackTraining) && (
        <div className={styles.feedback}>
          <IconButton size="small" onClick={() => onFeedback?.(true)}>
            {positiveFeedback === true ? (
              <img src="/lightbulb_on.svg" height={25} alt="helpful" />
            ) : (
              <img
                src="/lightbulb_off.svg"
                height={25}
                alt="helpfulness unknown"
              />
            )}
          </IconButton>
          {positiveFeedback === true ? (
            <Typography variant="caption">Helpful!</Typography>
          ) : (
            <Typography variant="caption" style={{ fontStyle: "italic" }}>
              Helpful?
            </Typography>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatBubble;
