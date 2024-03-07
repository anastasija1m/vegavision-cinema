import React, { useState, useEffect } from "react";
import { MovieService } from "../../services/MovieService";
import MovieScreeningForm from "./MovieScreeningForm";
import { MovieScreening } from "../../models/MovieScreening";
import { Movie } from "../../models/Movie";
import styled from "styled-components";

interface MovieScreeningAddFormProps {
  onConfirm: (formData: MovieScreeningFormData) => void;
  onCancel: () => void;
}

interface MovieScreeningFormData {
  ticketPrice: number;
  screeningDateTime: Date;
  rows: number;
  columns: number;
  movieId: number;
}

const MovieScreeningAddFormStyled = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 5px;
`;

export default function MovieScreeningAddForm({ onConfirm, onCancel }: MovieScreeningAddFormProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  const [formData, setFormData] = useState<MovieScreeningFormData>({
    ticketPrice: 0,
    screeningDateTime: new Date(),
    rows: 0,
    columns: 0,
    movieId: 0
  });

  const [errors, setErrors] = useState({
    ticketPrice: '',
    screeningDateTime: '',
    rows: '',
    columns: '',
    movieId: ''
  });

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const movieService = new MovieService();
      const moviesData = await movieService.getAllMovies();
      setMovies(moviesData);
    } catch (error) {
      console.error("Error fetching movies: ", error);
    }
  };

  const validateMovieScreeningData = () => {
    const { ticketPrice, screeningDateTime, rows, columns, movieId } = formData;
    const errors = {
      ticketPrice: ticketPrice <= 0 ? 'Ticket price has to be greater than 0.' : '',
      screeningDateTime: !screeningDateTime ? 'Please select a date and time.' : '',
      rows: rows <= 0 ? 'Rows must be greater than 0.' : '',
      columns: columns <= 0 ? 'Columns must be greater than 0.' : '',
      movieId: !movieId ? 'Please select a movie.' : ''
    };
  
    setErrors(errors);
    return Object.values(errors).every(error => error === '');
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const movieId = parseInt(event.target.value);
    setSelectedMovieId(movieId === selectedMovieId ? null : movieId);
    setFormData({
      ...formData,
      movieId: movieId
    });
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    if (!validateMovieScreeningData()) return;
  
    const movieScreening: MovieScreening = {
      ticketPrice: formData.ticketPrice,
      screeningDateTime: formData.screeningDateTime,
      rows: formData.rows,
      columns: formData.columns,
      movieId: formData.movieId
    };
    onConfirm(movieScreening);
  };

  return (
    <MovieScreeningAddFormStyled>
      <MovieScreeningForm
        formData={formData}
        movies={movies}
        selectedMovieId={selectedMovieId}
        errors={errors}
        onInputChange={handleInputChange}
        onCheckboxChange={handleCheckboxChange}
        onSubmit={onSubmit}
        onCancel={onCancel}
        disableCheckbox={false}
      />
    </MovieScreeningAddFormStyled>
  );
};