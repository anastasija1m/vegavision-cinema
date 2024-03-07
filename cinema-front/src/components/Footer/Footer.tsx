import styled from 'styled-components';

const FooterStyled = styled.footer`
  background-color: #333;
  color: #fff;
  padding: 20px 0;
  text-align: center;
  position: fixed;
  bottom: 0;
  width: 100%;
`;

const CopyrightStyled = styled.div`
  font-size: 14px;
`;

export default function Footer(){
  return (
    <FooterStyled>
      <CopyrightStyled>
        &copy; {new Date().getFullYear()} VegaVision Cinema. All Rights Reserved.
      </CopyrightStyled>
    </FooterStyled>
  );
};