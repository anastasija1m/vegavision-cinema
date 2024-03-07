import styled from "styled-components";
import Input from "../shared/Input";
import { Button } from "../shared/Button";

interface GenreFormProps {
  genreName: string;
  handleGenreNameChange: (genreName: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  error: string;
}

const LabelStyled = styled.label`
  margin-bottom: 5px;
`;

const ButtonsContainerStyled = styled.div`
  margin-top: 25px;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const ErrorMessage = styled.span`
  color: red;
  font-size: 12px;
  margin-top: 70px;
  position: absolute;
`;

export default function GenreForm({ genreName, handleGenreNameChange, onSubmit, onCancel, error }: GenreFormProps) {
  return (
    <>
      <LabelStyled>Genre name</LabelStyled>
      <Input
        name="genreName"
        type='text'
        value={genreName}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleGenreNameChange(e.target.value)}
      />
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <ButtonsContainerStyled>
        <Button
          onClick={onSubmit}
          text="Confirm"
        />
        <Button
          onClick={onCancel}
          text="Cancel"
        />
      </ButtonsContainerStyled>
    </>
  );
}
