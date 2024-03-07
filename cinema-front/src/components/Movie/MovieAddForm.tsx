import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { MovieCreate } from '../../models/MovieCreate';
import MovieForm from './MovieForm';
import { isNullOrEmpty, isValidUrl } from '../../utils/Validator';
import { GenreService } from '../../services/GenreService';
import { Genre } from '../../models/Genre';

interface MovieAddFormProps {
  onConfirm: (movie: MovieCreate) => void;
  onCancel: () => void;
}

const GenreAddFormStyled = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 5px;
`;

const genreService = new GenreService();

export default function MovieAddForm({ onConfirm, onCancel } : MovieAddFormProps) {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);

  const [movieFormData, setMovieFormData] = useState<MovieCreate>({
    posterUrl: '',
    name: '',
    originalName: '',
    duration: 0,
    genreIds: []
  });

  const [errors, setErrors] = useState({
    name: '',
    originalName: '',
    posterUrl: '',
    duration: '',
    genre: ''
  });

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genres = await genreService.getAllGenres();
        setGenres(genres);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };

    fetchGenres();
  }, []);

  const validateMovieData = () => {
    const { name, originalName, posterUrl, duration } = movieFormData;

    const errors = {
      name: isNullOrEmpty(name) ? 'Name is required.' : '',
      originalName: isNullOrEmpty(originalName) ? 'Original Name is required.' : '',
      posterUrl: isNullOrEmpty(posterUrl) ? 'Poster URL is required.' : !isValidUrl(posterUrl) ? 'Please enter a valid URL for the movie poster.' : '',
      duration: duration <= 0 ? 'Duration must be greater than 0.' : '',
      genre: selectedGenres.length === 0 ? 'Please select at least one genre.' : ''
    };

    setErrors(errors);
    return Object.values(errors).every(error => error === '');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMovieFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleGenreChange = (genreId: number) => {
    const updatedSelectedGenres = selectedGenres.includes(genreId)
      ? selectedGenres.filter(id => id !== genreId)
      : [...selectedGenres, genreId];
    setSelectedGenres(updatedSelectedGenres);
    setMovieFormData(prevData => ({
      ...prevData,
      genres: updatedSelectedGenres
    }));
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateMovieData()) return;

    const movie: MovieCreate = {
      posterUrl: movieFormData.posterUrl,
      name: movieFormData.name,
      originalName: movieFormData.originalName,
      duration: movieFormData.duration,
      genreIds: selectedGenres
    };

    onConfirm(movie);
  };

  return (
    <GenreAddFormStyled>
      <MovieForm
        movieFormData={movieFormData}
        genres={genres}
        selectedGenres={selectedGenres}
        errors={errors}
        handleChange={handleChange}
        handleGenreChange={handleGenreChange}
        onSubmit={onSubmit}
        onCancel={onCancel}
      />
    </GenreAddFormStyled>
  );
};