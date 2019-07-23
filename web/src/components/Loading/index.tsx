import React, { FC } from "react";
import styled from "@emotion/styled";

interface Props {
  error?: any;
}

export const Loading: FC<Props> = props => {
  if (props.error) {
    console.error(props.error);
    return <Container>Load error</Container>;
  }

  return (
    <Container>
      <Spin>
        <div />
        <div />
        <div />
        <div />
      </Spin>
    </Container>
  );
};

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Spin = styled.div`
  display: inline-block;
  position: relative;
  width: 64px;
  height: 64px;

  @keyframes lds-ring {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  div {
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: 51px;
    height: 51px;
    margin: 6px;
    border: 6px solid beige;
    border-radius: 50%;
    animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: beige transparent transparent transparent;
  }
  div:nth-of-type(1) {
    animation-delay: -0.45s;
  }
  div:nth-of-type(2) {
    animation-delay: -0.3s;
  }
  div:nth-of-type(3) {
    animation-delay: -0.15s;
  }
`;

export default Loading;
