import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItemText,
  ListItem,
  CircularProgress,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Popover,
  Container,
  Tooltip,
} from "@material-ui/core";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import Editor from "draft-js-plugins-editor";
import createInlineToolbarPlugin from "draft-js-inline-toolbar-plugin";
import createImagePlugin from "draft-js-image-plugin";
import "draft-js-inline-toolbar-plugin/lib/plugin.css";
import "draft-js-image-plugin/lib/plugin.css";
import { useSubscription, useMutation, gql } from "@apollo/client";
import {
  convertToRaw,
  EditorState,
  ContentState,
  convertFromRaw,
} from "draft-js";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useHistory } from "react-router-dom";
dayjs.extend(relativeTime);

const imagePlugin = createImagePlugin();
const inlineToolbarPlugin = createInlineToolbarPlugin();
const { InlineToolbar } = inlineToolbarPlugin as any;

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    secondDrawer: {
      left: drawerWidth,
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
    toolbar: theme.mixins.toolbar,
    editor: {
      margin: "24px auto",
      borderColor: "#eee",
      borderWidth: 1,
      borderStyle: "solid",
      height: "30vh",
      overflow: "auto",
      padding: theme.spacing(2),
    },
    paper: {
      padding: 8,
    },
    response: {
      display: "flex",
      alignItems: "center",
      "& > *": {
        margin: theme.spacing(2),
      },
    },
  })
);

const GET_STEPS = gql`
  subscription {
    step(order_by: { name: asc }) {
      id
      name
    }
  }
`;

const ADD_STEP = gql`
  mutation NewStep($name: String!) {
    insert_step(objects: { name: $name }) {
      returning {
        id
      }
    }
  }
`;

const ADD_HINT = gql`
  mutation NewHint($name: String!, $answer: String!, $stepId: Int!) {
    insert_hint(
      objects: {
        name: $name
        answer: $answer
        step_id: $stepId
        questions: "[]"
      }
    ) {
      returning {
        id
      }
    }
  }
`;

const ADD_QUESTION = gql`
  mutation AddQuestion($hintId: Int!, $questions: String!) {
    update_hint(
      where: { id: { _eq: $hintId } }
      _set: { questions: $questions }
    ) {
      returning {
        id
      }
    }
  }
`;

const GET_CATEGORIES = gql`
  subscription GET_CATEGORIES($stepId: Int!) {
    hint_aggregate(where: { step_id: { _eq: $stepId } }) {
      nodes {
        id
        step_id
        name
        answer
        questions
      }
    }
  }
`;

const GET_RESPONSES = gql`
  subscription GET_RESPONSES($hintId: Int!) {
    response_aggregate(
      where: { hint_id: { _eq: $hintId } }
      order_by: { created_at: desc }
    ) {
      nodes {
        id
        input_message {
          payload
          from_user {
            username
          }
          created_at
        }
        output_message {
          payload
        }
        positive_feedback
      }
    }
  }
`;

const DELETE_STEP = gql`
  mutation DeleteStep($id: Int!) {
    delete_step(where: { id: { _eq: $id } }) {
      returning {
        id
      }
    }
  }
`;

const DELETE_HINT = gql`
  mutation DeleteHint($id: Int!) {
    delete_hint(where: { id: { _eq: $id } }) {
      returning {
        id
      }
    }
  }
`;

export default function ManagePage() {
  const classes = useStyles();

  const { data: steps, loading: stepLoading, error } = useSubscription(
    GET_STEPS
  );
  const [addStep, { loading: newStepLoading }] = useMutation(ADD_STEP);

  const history = useHistory();

  useEffect(() => {
    if (error && !steps) {
      history.replace("/");
    }
  }, [steps, error, history]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [stepName, setStepName] = useState("");

  const handleDialogClose = () => {
    setDialogOpen(false);
    setStepName("");
  };

  const handleNewStep = () => {
    if (!stepName) {
      return;
    }
    addStep({
      variables: {
        name: stepName,
      },
    });
    handleDialogClose();
  };

  const [currentStepId, setCurrentStepId] = useState<number | null>(null);
  const { data: categories, loading: hintLoading } = useSubscription(
    GET_CATEGORIES,
    {
      variables: { stepId: currentStepId },
      skip: !currentStepId,
    }
  );

  const [hintDialogOpen, setHintDialogOpen] = useState(false);
  const [hint, setHint] = useState("");
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const [imageUrl, setImageUrl] = useState("");

  const handleHintDialogClose = () => {
    setHintDialogOpen(false);
    setHint("");
  };

  const [addHint, { loading: newHintLoading }] = useMutation(ADD_HINT);

  const handleImageAdd = () => {
    if (imageUrl) {
      setEditorState(imagePlugin.addImage(editorState, imageUrl));
      setImageUrl("");
      setAnchorEl(null);
    }
  };

  const handleNewHint = () => {
    if (!hint || !editorState.getCurrentContent().hasText()) {
      return;
    }

    addHint({
      variables: {
        name: hint,
        answer: JSON.stringify(convertToRaw(editorState.getCurrentContent())),
        stepId: currentStepId,
      },
    });

    setHint("");
    setEditorState(EditorState.createEmpty());
    setHintDialogOpen(false);
  };

  const [currentHint, setCurrentHint] = useState<any | null>(null);

  useEffect(() => {
    if (currentHint && categories?.hint_aggregate?.nodes) {
      setCurrentHint(
        categories?.hint_aggregate?.nodes.find(
          (i: any) => i.id === currentHint.id
        )
      );
    }
  }, [categories, currentHint]);

  const { data: responses, loading: responseLoading } = useSubscription(
    GET_RESPONSES,
    {
      variables: {
        hintId: currentHint?.id,
      },
      skip: !currentHint,
    }
  );

  const [question, setQuestion] = useState("");
  const [questionDialogOpen, setQuestionDialogOpen] = useState(false);

  const [addQuestion, { loading: addQuestionLoading }] = useMutation(
    ADD_QUESTION
  );

  const handleQuestionDialogClose = () => {
    setQuestionDialogOpen(false);
    setQuestion("");
  };

  const handleNewQuestion = () => {
    if (!question) {
      return;
    }
    addQuestion({
      variables: {
        hintId: currentHint!.id,
        questions: JSON.stringify([
          ...JSON.parse(currentHint!.questions),
          question,
        ]),
      },
    });
    handleQuestionDialogClose();
  };

  const handleQuestionDelete = (question: string) => {
    addQuestion({
      variables: {
        hintId: currentHint!.id,
        questions: JSON.stringify(
          JSON.parse(currentHint!.questions).filter((i: any) => i !== question)
        ),
      },
    });
  };

  const [deleteStep] = useMutation(DELETE_STEP);
  const [deleteHint] = useMutation(DELETE_HINT);

  const handleStepDelete = (stepId: number) => {
    deleteStep({
      variables: {
        id: stepId,
      },
    });
  };

  const handleHintDelete = (hintId: number) => {
    deleteHint({
      variables: {
        id: hintId,
      },
    });
  };

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" noWrap style={{ color: "white" }}>
            Manage
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.toolbar} />
        <List>
          {steps?.step?.map((step: any) => (
            <ListItem
              button
              selected={step.id === currentStepId}
              key={step.id}
              onClick={() => setCurrentStepId(parseInt(step.id, 10))}
            >
              <Tooltip
                title={
                  <Button
                    size="small"
                    onClick={() => handleStepDelete(step.id)}
                  >
                    Remove
                  </Button>
                }
                interactive
                placement="right"
              >
                <ListItemText primary={step.name} />
              </Tooltip>
            </ListItem>
          ))}
          {(newStepLoading || stepLoading) && (
            <div style={{ textAlign: "center", margin: 16 }}>
              <CircularProgress />
            </div>
          )}
          <ListItem button key="new-step" onClick={() => setDialogOpen(true)}>
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>
            <ListItemText primary="New Step" />
          </ListItem>
        </List>
      </Drawer>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
          paperAnchorLeft: classes.secondDrawer,
        }}
      >
        <div className={classes.toolbar} />
        <List>
          {categories?.hint_aggregate?.nodes?.map((hint: any) => (
            <ListItem
              button
              key={hint.id}
              selected={hint.id === currentHint?.id}
              onClick={() => setCurrentHint(hint)}
            >
              <Tooltip
                title={
                  <Button
                    size="small"
                    onClick={() => handleHintDelete(hint.id)}
                  >
                    Remove
                  </Button>
                }
                interactive
                placement="right"
              >
                <ListItemText primary={hint.name} />
              </Tooltip>
            </ListItem>
          ))}
          {(hintLoading || newHintLoading) && (
            <div style={{ textAlign: "center", margin: 16 }}>
              <CircularProgress />
            </div>
          )}
          {currentStepId && (
            <ListItem
              button
              key="new-hint"
              onClick={() => setHintDialogOpen(true)}
            >
              <ListItemIcon>
                <AddIcon />
              </ListItemIcon>
              <ListItemText primary="New Hint" />
            </ListItem>
          )}
        </List>
      </Drawer>
      <Container maxWidth="md" className={classes.content} id="img-container">
        <div className={classes.toolbar} />
        <Typography variant="h4" gutterBottom>
          Hint
        </Typography>
        <Typography variant="body1" style={{ marginBottom: "1em" }}>
          {currentHint?.name}
        </Typography>
        <Typography variant="h4" gutterBottom>
          Sample Questions
        </Typography>
        {currentHint?.questions && (
          <>
            <ul>
              {JSON.parse(currentHint?.questions).map((question: any) => (
                <Tooltip
                  key={question}
                  title={
                    <Button
                      size="small"
                      onClick={() => handleQuestionDelete(question)}
                    >
                      Remove
                    </Button>
                  }
                  interactive
                  placement="left"
                >
                  <li>
                    <Typography>{question}</Typography>
                  </li>
                </Tooltip>
              ))}
            </ul>
            <Button
              variant="outlined"
              onClick={() => setQuestionDialogOpen(true)}
            >
              Add Question
            </Button>
          </>
        )}
        {addQuestionLoading && (
          <div style={{ margin: 16 }}>
            <CircularProgress />
          </div>
        )}
        <Typography style={{ marginTop: 24 }} variant="h4" gutterBottom>
          Answer
        </Typography>
        <Editor
          editorState={
            currentHint?.answer
              ? EditorState.createWithContent(
                  convertFromRaw(JSON.parse(currentHint?.answer))
                )
              : EditorState.createWithContent(ContentState.createFromText(""))
          }
          readOnly
          onChange={() => {}}
          plugins={[imagePlugin, inlineToolbarPlugin]}
        />
        <Typography style={{ marginTop: 24 }} variant="h4" gutterBottom>
          Question History
        </Typography>
        <List>
          {responseLoading && (
            <div style={{ textAlign: "center", margin: 16 }}>
              <CircularProgress />
            </div>
          )}
          {responses?.response_aggregate?.nodes?.map((response: any) => (
            <ListItem key={response.id} className={classes.response}>
              {response.positive_feedback === true ? (
                <img src="/lightbulb_on.svg" height={25} alt="helpful" />
              ) : (
                <img
                  src="/lightbulb_off.svg"
                  height={25}
                  alt="helpfulness unknown"
                />
              )}
              <div style={{ minWidth: 80 }}>
                <Typography variant="body2" style={{ fontWeight: "bold" }}>
                  {response.input_message.from_user.username}
                </Typography>
                <Typography variant="caption" style={{ fontStyle: "italic" }}>
                  {dayjs(response.input_message.created_at).fromNow()}
                </Typography>
              </div>
              <Editor
                editorState={EditorState.createWithContent(
                  convertFromRaw(
                    JSON.parse(JSON.parse(response.input_message.payload).text)
                  )
                )}
                readOnly
                onChange={() => {}}
                plugins={[imagePlugin, inlineToolbarPlugin]}
              />
            </ListItem>
          ))}
        </List>
      </Container>
      <Dialog open={dialogOpen} onClose={handleDialogClose} fullWidth>
        <DialogTitle>New Step</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Step Name"
            fullWidth
            onChange={(e) => setStepName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleNewStep} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={hintDialogOpen} onClose={handleHintDialogClose} fullWidth>
        <DialogTitle>New Hint</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            onChange={(e) => setHint(e.target.value)}
          />
          <div className={classes.editor}>
            <Editor
              editorState={editorState}
              onChange={setEditorState}
              plugins={[imagePlugin, inlineToolbarPlugin]}
            />
            <InlineToolbar />
          </div>
          <Button
            variant="contained"
            onClick={(e) => {
              setAnchorEl(e.currentTarget);
            }}
          >
            Add Image
          </Button>
          <Popover
            classes={{
              paper: classes.paper,
            }}
            open={anchorEl ? true : false}
            anchorEl={anchorEl}
            onClose={() => {
              setAnchorEl(null);
              setImageUrl("");
            }}
            anchorOrigin={{
              vertical: "center",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "center",
              horizontal: "left",
            }}
          >
            <TextField
              autoFocus
              margin="dense"
              label="Image Url"
              fullWidth
              onChange={(e) => setImageUrl(e.target.value)}
            />
            <Button variant="contained" onClick={handleImageAdd}>
              Add
            </Button>
          </Popover>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleHintDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleNewHint} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={questionDialogOpen}
        onClose={handleQuestionDialogClose}
        fullWidth
      >
        <DialogTitle>New Question</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Question"
            fullWidth
            onChange={(e) => setQuestion(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleQuestionDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleNewQuestion} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
