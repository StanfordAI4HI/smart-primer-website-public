import React, { useEffect, useRef, useState } from "react";
import { Container, CircularProgress, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useQuery, gql } from "@apollo/client";
import { useHistory, useLocation } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingTop: 150,
  },
}));

const LOGIN = gql`
  {
    user {
      id
      username
      condition
      monster_kind
      monster_name
      finish_tutorial
    }
  }
`;

export default function FormPage() {
  const styles = useStyles();

  const history = useHistory();
  const location = useLocation();

  const isSurvey =
    new URLSearchParams(location.search).get("survey") === "true";
  const firstTime =
    new URLSearchParams(location.search).get("first") === "true";
  const incomplete = sessionStorage.getItem("incomplete") === "true";

  const { data, error } = useQuery(LOGIN);

  const userId = data?.user?.[0]?.id;
  const skipPrologueAndMonster =
    data &&
    (data?.user?.[0]?.condition !== "D" ||
      (data?.user?.[0]?.monster_kind && data?.user?.[0]?.monster_name));
  const skipTutorial =
    data &&
    (data?.user?.[0]?.condition !== "D" || data?.user?.[0]?.finish_tutorial);
  const condition = data?.user?.[0]?.condition;

  useEffect(() => {
    if (error && !data) {
      history.replace("/");
    }
    if (data && !userId) {
      history.replace("/");
    }
  }, [data, error, history, userId]);

  const formRef = useRef<HTMLIFrameElement | null>(null);
  const [formSrcChange, setFormSrcChange] = useState(0);

  const handleIframeLoad = () => {
    setFormSrcChange((i) => i + 1);
    window.scrollTo({
      top: 0,
    });
  };

  useEffect(() => {
    const iframe = formRef.current;
    if (userId && iframe) {
      iframe.addEventListener("load", handleIframeLoad);
    }
    return () => iframe?.removeEventListener("load", handleIframeLoad);
  }, [userId]);

  return (
    <Container className={styles.root} maxWidth="md">
      {userId ? (
        isSurvey ? (
          firstTime ? (
            condition === "A" ? (
              <iframe
                ref={formRef}
                style={{
                  border: 0,
                  height: formSrcChange === 1 ? 5950 : 300,
                  width: 700,
                }}
                title="form"
                /* condition A, pre-study survey */
                src={`https://docs.google.com/forms/d/e/1FAIpQLScy42HFKNOPZ7F_Uow9oVxhF7DT8dhWDJz2LIwE0ocnTCJWHQ/viewform?usp=pp_url&entry.609573976=${userId}&embedded=true`}
              >
                Loading…
              </iframe>
            ) : (
              <iframe
                ref={formRef}
                style={{
                  border: 0,
                  height: formSrcChange === 1 ? 7130 : 300,
                  width: 700,
                }}
                title="form"
                /* condition D, pre-study survey */
                src={`https://docs.google.com/forms/d/e/1FAIpQLScwY_PDSjczAvpaJqEVKLSEtr51CgaXKrnelVB_lO4uMqZaWQ/viewform?usp=pp_url&entry.609573976=${userId}&embedded=true`}
              >
                Loading…
              </iframe>
            )
          ) : condition === "A" ? (
            incomplete ? (
              <iframe
                ref={formRef}
                style={{
                  border: 0,
                  height: "calc(100vh - 150px)",
                  width: 700,
                }}
                title="form"
                /* condition A, not finished, post-study survey */
                src={`https://docs.google.com/forms/d/e/1FAIpQLSeFfhanZhaBQQoRCyqkZtb1fwtRFx1xxuhd5yeej72YM57D0g/viewform?usp=pp_url&entry.1940360637=${userId}&embedded=true`}
              >
                Loading…
              </iframe>
            ) : (
              <iframe
                ref={formRef}
                style={{
                  border: 0,
                  height: "calc(100vh - 150px)",
                  width: 700,
                }}
                title="form"
                /* condition A, finished, post-study survey */
                src={`https://docs.google.com/forms/d/e/1FAIpQLSc6ydvWkeQ6DjP_vEaEgKRCseaLsqinVfhAKHQ-JjPdC1L6EA/viewform?usp=pp_url&entry.1940360637=${userId}&embedded=true`}
              >
                Loading…
              </iframe>
            )
          ) : incomplete ? (
            <iframe
              ref={formRef}
              style={{
                border: 0,
                height: "calc(100vh - 150px)",
                width: 700,
              }}
              title="form"
              /* condition D, not finished, post-study survey */
              src={`https://docs.google.com/forms/d/e/1FAIpQLSc_uX4aNzek-K9rYNaorbpNo2AdTdSbhOiin7AZiQllWh2I-g/viewform?usp=pp_url&entry.1940360637=${userId}&embedded=true`}
            >
              Loading…
            </iframe>
          ) : (
            <iframe
              ref={formRef}
              style={{
                border: 0,
                height: "calc(100vh - 150px)",
                width: 700,
              }}
              title="form"
              /* condition D, finished, post-study survey */
              src={`https://docs.google.com/forms/d/e/1FAIpQLScJUkWfrSrmgBLHodK58ns2NSxUQKMLS3kBTzjGxs_KtfL0bA/viewform?usp=pp_url&entry.1940360637=${userId}&embedded=true`}
            >
              Loading…
            </iframe>
          )
        ) : (firstTime && Math.abs(userId % 2) === 1) ||
          (!firstTime && userId % 2 === 0) ? (
          <iframe
            ref={formRef}
            style={{
              border: 0,
              height: formSrcChange > 1 ? 300 : 4300,
              width: 700,
            }}
            title="form"
            /* pre-study quiz for odd user id; post-study quiz for even user id */
            src={`https://docs.google.com/forms/d/e/1FAIpQLSdMcuLLQRbEvgp3GYtegT4XVtqhB607ZBMs26n5KE_2vIrh1Q/viewform?usp=pp_url&entry.1449005772=${userId}&embedded=true`}
          >
            Loading…
          </iframe>
        ) : (
          <iframe
            ref={formRef}
            style={{
              border: 0,
              height: formSrcChange > 1 ? 300 : 4450,
              width: 700,
            }}
            title="form"
            /* post-study quiz for odd user id; pre-study quiz for even user id */
            src={`https://docs.google.com/forms/d/e/1FAIpQLSfS5IOC66RN8GvIFZdpgjC1N_JuLZCfS-bsx7xou9R9tCDpnA/viewform?usp=pp_url&entry.1449005772=${userId}&embedded=true`}
          >
            Loading…
          </iframe>
        )
      ) : (
        <CircularProgress />
      )}
      {formSrcChange > 1 && !(isSurvey && !firstTime) && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setFormSrcChange(0);
            if (firstTime && isSurvey) {
              history.replace("/form?survey=false&first=true");
            }
            if (firstTime && !isSurvey) {
              if (skipPrologueAndMonster && skipTutorial) {
                history.replace("/tasks/1");
              } else if (skipPrologueAndMonster && !skipTutorial) {
                history.replace("/tutorial");
              } else {
                history.replace("/prologue");
              }
            }
            if (!firstTime && !isSurvey) {
              history.replace("/form?survey=true&first=false");
            }
            if (!firstTime && isSurvey) {
              history.replace("/progress?end=true");
            }
          }}
        >
          Proceed
        </Button>
      )}
    </Container>
  );
}
