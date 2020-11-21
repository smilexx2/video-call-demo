import React from "react";
import Typography from "@material-ui/core/Typography";
import styled from "styled-components";

const Footer = styled.footer`
  text-align: center;
  margin-bottom: 16px;
`;

const AppFooter: React.FunctionComponent = () => {
  return (
    <Footer>
      <Typography
        variant="body2"
        color="textSecondary"
        component="p"
        gutterBottom
      >
        Powered by <a href="https://www.agora.io">agora.io</a>
      </Typography>
      <Typography variant="caption" color="textSecondary" component="p">
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
      </Typography>
    </Footer>
  );
};

export default AppFooter;
