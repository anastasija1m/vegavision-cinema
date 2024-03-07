import React from "react";
import styled from "styled-components";
import { Button } from "../shared/Button";
import Input from "../shared/Input";
import { FormEvent } from "react";

interface Genre {
  id: number;
  name: string;
}

interface MovieFormProps {
  movieFormData: any;
  genres: Genre[];
  selectedGenres: number[];
  errors: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleGenreChange: (genreId: number) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}

const ModalContentStyled = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  width: 500px;
  height: 550px;
`;

const FormStyled = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 200px;
`;

const LabelStyled = styled.label`
  margin: 10px 0 5px;
`;

const ErrorStyled = styled.span`
  color: red;
  font-size: 12px;
`;

const CheckboxContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 10px;
`;

const CheckboxLabel = styled.label`
  margin-right: 20px;
`;

const ButtonsContainerStyled = styled.div`
  display: flex;
  margin-top: 10px;
  justify-content: center;
`;

export default function MovieForm({
  movieFormData,
  genres,
  selectedGenres,
  errors,
  handleChange,
  handleGenreChange,
  onSubmit,
  onCancel,
}: MovieFormProps) {

  return (
    <ModalContentStyled>
      <FormStyled onSubmit={onSubmit}>
        <LabelStyled>Movie poster</LabelStyled>
        <Input
          name="posterUrl"
          type="text"
          value={movieFormData.posterUrl}
          onChange={handleChange}
        />
        <ErrorStyled>{errors.posterUrl}</ErrorStyled>
        <LabelStyled>Movie name</LabelStyled>
        <Input
          name="name"
          type="text"
          value={movieFormData.name}
          onChange={handleChange}
        />
        <ErrorStyled>{errors.name}</ErrorStyled>
        <LabelStyled>Original name</LabelStyled>
        <Input
          name="originalName"
          type="text"
          value={movieFormData.originalName}
          onChange={handleChange}
        />
        <ErrorStyled>{errors.originalName}</ErrorStyled>
        <LabelStyled>Duration</LabelStyled>
        <Input
          name="duration"
          type="number"
          value={movieFormData.duration}
          onChange={handleChange}
        />
        <ErrorStyled>{errors.duration}</ErrorStyled>
        <LabelStyled>Genres</LabelStyled>
        <CheckboxContainer>
          {genres.map((genre) => (
            <CheckboxLabel key={genre.id}>
              <input
                type="checkbox"
                value={genre.id}
                checked={selectedGenres.includes(genre.id)}
                onChange={() => handleGenreChange(genre.id)}
              />
              {genre.name}
            </CheckboxLabel>
          ))}
        </CheckboxContainer>
        <ErrorStyled>{errors.genre}</ErrorStyled>
        <ButtonsContainerStyled>
          <Button type="submit" text="Confirm" />
          <Button onClick={onCancel} text="Cancel" />
        </ButtonsContainerStyled>
      </FormStyled>
    </ModalContentStyled>
  );
}
