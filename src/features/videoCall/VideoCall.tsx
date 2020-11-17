import React from "react";
import MuiButton from "@material-ui/core/Button";
import MuiCard from "@material-ui/core/Card";
import MuiCardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import styled from "styled-components";
import { ReactComponent as Empty } from "../../assets/laptop.svg";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const EmptyWrapper = styled.div`
  padding: 40px;
  text-align: center;
`;

const StyledEmpty = styled(Empty)`
  width: 160px;
  height: 160px;
`;

const Card = styled(MuiCard)`
  max-width: 400px;
  width: 100%;
`;

const VideoCall: React.FunctionComponent = () => {
  return (
    <Container>
      <Card>
        <MuiCardContent>
          <Grid container direction="column">
            <EmptyWrapper>
              <StyledEmpty />
              <p style={{ display: "none" }}>
                Icons made by{" "}
                <a
                  href="https://www.flaticon.com/free-icon/laptop_3492203?term=video%20conference&page=2&position=57"
                  title="catkuro"
                >
                  catkuro
                </a>{" "}
                from{" "}
                <a href="https://www.flaticon.com/" title="Flaticon">
                  {" "}
                  www.flaticon.com
                </a>
              </p>
            </EmptyWrapper>
            <MuiButton color="primary">Join Channel</MuiButton>
          </Grid>
        </MuiCardContent>
      </Card>
    </Container>
  );
};

export default VideoCall;
