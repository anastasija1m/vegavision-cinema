import styled from 'styled-components';

const Container = styled.div`
  max-width: 600px;
  margin: 50px auto;
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  color: #12372A;
`;

const Paragraph = styled.p`
  margin: 20px 0;
`;

export default function AccountConfirmation() {
  return (
    <Container>
      <Title>Account Successfully Confirmed</Title>
      <Paragraph>Your account has been successfully confirmed.</Paragraph>
      <a className="back-link" href="http://localhost:3000/">Go to homepage</a>
    </Container>
  );
};