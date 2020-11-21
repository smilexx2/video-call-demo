import React from "react";
import MuiContainer from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import styled from "styled-components";
import { ReactComponent as LaptopSvg } from "../assets/laptop.svg";

const IconWrapper = styled.div`
  padding: 40px;
  display: flex;
  justify-content: center;
`;

const MainIcon = styled(LaptopSvg)`
  width: 160px;
  height: 160px;
`;

const Container = styled(MuiContainer)`
  flex: 1;
  align-items: center;
  display: flex;
`;

const ChannelCard: React.FunctionComponent<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <Container maxWidth="xs">
      <Grid container direction="column" spacing={3}>
        <Grid item xs={12}>
          <IconWrapper>
            <MainIcon />
          </IconWrapper>
        </Grid>
        <Grid item xs={12}>
          {children}
        </Grid>
      </Grid>
    </Container>
  );
};

export default ChannelCard;
