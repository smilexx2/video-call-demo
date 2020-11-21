import React from "react";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import styled from "styled-components";
import { ReactComponent as Empty } from "../assets/laptop.svg";

const EmptyWrapper = styled.div`
  padding: 40px;
  display: flex;
  justify-content: center;
`;

const StyledEmpty = styled(Empty)`
  width: 160px;
  height: 160px;
`;

const ChannelCard: React.FunctionComponent<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <Container maxWidth="xs">
      <Grid container direction="column" spacing={3}>
        <Grid item xs={12}>
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
        </Grid>
        <Grid item xs={12}>
          {children}
        </Grid>
      </Grid>
    </Container>
  );
};

export default ChannelCard;
