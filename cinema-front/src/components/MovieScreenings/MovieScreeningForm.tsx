import React, { FormEvent } from "react";
import styled from "styled-components";
import { Movie } from "../../models/Movie";
import Input from "../shared/Input";
import { Button } from "../shared/Button";

interface MovieScreeningFormProps {
  formData: any;
  movies: Movie[];
  selectedMovieId: number | null;
  errors: any;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onCheckboxChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
  disableCheckbox: boolean;
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
  height: 50px;
`;

export default function MovieScreeningForm({ formData, movies, selectedMovieId, errors, onInputChange, onCheckboxChange, onSubmit, onCancel, disableCheckbox }: MovieScreeningFormProps) {
  return (
    <ModalContentStyled>
      <FormStyled onSubmit={onSubmit}>
        <LabelStyled>Ticket Price:</LabelStyled>
        <Input
          type="number"
          name="ticketPrice"
          value={formData.ticketPrice}
          onChange={onInputChange}
        />
        <ErrorStyled>{errors.ticketPrice}</ErrorStyled>
        <LabelStyled>Date and Time:</LabelStyled>
        <Input
          type="datetime-local"
          name="screeningDateTime"
          value={formData.screeningDateTime}
          onChange={onInputChange}
        />
        <ErrorStyled>{errors.screeningDateTime}</ErrorStyled>
        <LabelStyled>Rows:</LabelStyled>
        <Input
          type="number"
          name="rows"
          value={formData.rows}
          onChange={onInputChange}
        />
        <ErrorStyled>{errors.rows}</ErrorStyled>
        <LabelStyled>Columns:</LabelStyled>
        <Input
          type="number"
          name="columns"
          value={formData.columns}
          onChange={onInputChange}
        />
        <ErrorStyled>{errors.columns}</ErrorStyled>
        <LabelStyled>Movie: </LabelStyled>
        <CheckboxContainer>
          {movies.map(movie => (
            <CheckboxLabel key={movie.id}>
              <input
                type="checkbox"
                id={`movie-${movie.id}`}
                name="movieId"
                value={movie.id}
                checked={selectedMovieId === movie.id}
                onChange={onCheckboxChange}
                disabled={disableCheckbox}
              />
              <LabelStyled htmlFor={`movie-${movie.id}`}>{movie.name}</LabelStyled>
            </CheckboxLabel>
          ))}
        </CheckboxContainer>
        <ErrorStyled>{errors.movieId}</ErrorStyled>
        <ButtonsContainerStyled>
          <Button type="submit" text="Confirm" />
          <Button onClick={onCancel} text="Cancel" />
        </ButtonsContainerStyled>
      </FormStyled>
    </ModalContentStyled>
  );
}