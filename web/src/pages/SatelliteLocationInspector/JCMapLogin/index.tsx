import React, { FC, useCallback, useState, useContext } from "react";
import Button from "@material-ui/core/ButtonGroup";
import Snackbar from "@material-ui/core/Snackbar";
import Toolbar from "@material-ui/core/Toolbar";
import TextField from "@material-ui/core/TextField";
import styled from "@emotion/styled";
import { AppContext } from "../../../AppContext";

interface Props {
  onSuccess: (token: string) => void;
  onClose: () => void;
}

export const JCMapLogin: FC<Props> = props => {
  const { setJcmapToken } = useContext(AppContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [feedback, setFeedback] = useState("");

  const login = useCallback(
    async ({ username, password }: { username: string; password: string }) => {
      try {
        const res = await fetch("https://jcmap.jcbel.com/apis/token", {
          method: "POST",
          headers: {
            "content-type": "application/json"
          },
          body: JSON.stringify({
            grant_type: "password",
            username,
            password
          })
        });
        const payload = await res.json();
        setJcmapToken(payload.access_token);
        props.onSuccess && props.onSuccess(payload.access_token);
      } catch (err) {
        setFeedback(err.message);
      }
    },
    [props, setJcmapToken]
  );

  return (
    <Container>
      <h2>登录JCMap</h2>
      <TextField
        type="text"
        label="Email / Username"
        onChange={evt => setUsername(evt.target.value)}
      />
      <TextField
        type="password"
        label="Password"
        onChange={evt => setPassword(evt.target.value)}
      />
      <Toolbar>
        <Button onClick={() => login({ username, password })}>Login</Button>
        <Button onClick={() => props.onClose()}>Cancel</Button>
      </Toolbar>

      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center"
        }}
        open={!!feedback}
        autoHideDuration={6000}
        message={feedback}
      />
    </Container>
  );
};

export default JCMapLogin;

const Container = styled.div`
  z-index: 9;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
