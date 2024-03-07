import styled from "styled-components";

const MovieCardStyled = styled.div`
  display: flex;
  border: 1px solid #ccc;
  margin-bottom: 20px;
  margin: 20px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  width: 96%;
`;

export default function MovieCard ({ children } : any)  {
  return <MovieCardStyled>{children}</MovieCardStyled>;
};