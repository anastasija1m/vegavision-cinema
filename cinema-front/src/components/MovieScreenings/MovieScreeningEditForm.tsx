import React, { useState, useEffect, FormEvent } from "react";
import { MovieService } from "../../services/MovieService";
import MovieScreeningForm from "./MovieScreeningForm";
import { MovieScreening } from "../../models/MovieScreening";
import { Movie } from "../../models/Movie";
import styled from "styled-components";

interface MovieScreeningEditFormProps {
  onConfirm: (movieScreening: MovieScreening) => void;
  onCancel: () => void;
  initialMovieScreening: MovieScreening;
}

const MovieScreeningEditFormStyled = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 5px;
`;

export default function MovieScreeningEditForm({ onConfirm, onCancel, initialMovieScreening }: MovieScreeningEditFormProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(initialMovieScreening.movieId);
  const [formData, setFormData] = useState({
    id: initialMovieScreening.id,
    ticketPrice: initialMovieScreening.ticketPrice,
    screeningDateTime: (initialMovieScreening.screeningDateTime),
    rows: initialMovieScreening.rows,
    columns: initialMovieScreening.columns,
    movieId: initialMovieScreening.movieId
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
      movieId: movieId === null ? 'Please select a movie.' : ''
    };
    
    setErrors(errors);
    return Object.values(errors).every(error => error === '');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const movieId = parseInt(event.target.value);
    setSelectedMovieId(movieId === selectedMovieId ? null : movieId);
    setFormData({
      ...formData,
      movieId: movieId
    });
};

  const onSubmit = (editMovieScreeningSubmitEvent: FormEvent<HTMLFormElement>) => {
    editMovieScreeningSubmitEvent.preventDefault();
  
    if (!validateMovieScreeningData()) 
      return;
    
    const formattedDateTime = new Date(formData.screeningDateTime);

    const movieScreening: MovieScreening = {
      id: initialMovieScreening.id,
      ticketPrice: formData.ticketPrice,
      screeningDateTime: formattedDateTime,
      rows: formData.rows,
      columns: formData.columns,
      movieId: formData.movieId
    };

    onConfirm(movieScreening);
  };

  return (
    <MovieScreeningEditFormStyled>
      <MovieScreeningForm
        formData={formData}
        movies={movies}
        selectedMovieId={selectedMovieId}
        errors={errors}
        onInputChange={handleChange}
        onCheckboxChange={handleCheckboxChange}
        onSubmit={onSubmit}
        onCancel={onCancel}
        disableCheckbox={true}
      />
    </MovieScreeningEditFormStyled>
  );
};