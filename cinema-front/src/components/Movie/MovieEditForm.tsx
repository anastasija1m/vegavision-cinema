import { FormEvent, useEffect, useState } from 'react';
import styled from 'styled-components';
import MovieForm from './MovieForm';
import { isNullOrEmpty, isValidUrl } from '../../utils/Validator';
import { Genre } from '../../models/Genre';
import { GenreService } from '../../services/GenreService';
import { MovieCreate } from '../../models/MovieCreate';
import { Movie } from '../../models/Movie';

interface MovieEditFormProps {
  onConfirm: (movie: MovieCreate) => void;
  onCancel: () => void;
  initialMovie: Movie;
}

const MovieEditFormStyled = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 5px;
`;

const genreService = new GenreService();

export default function MovieEditForm({ onConfirm, onCancel, initialMovie }: MovieEditFormProps) {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<number[]>(initialMovie.genres ? initialMovie.genres.map(genre => genre.id) : []);
  const [movieFormData, setMovieFormData] = useState({
    posterUrl: initialMovie.posterUrl,
    name: initialMovie.name,
    originalName: initialMovie.originalName,
    duration: initialMovie.duration,
    genreIds: initialMovie.genres
  });
  
  const [errors, setErrors] = useState({
    name: '',
    originalName: '',
    posterUrl: '',
    duration: '',
    genre: ''
  });

  useEffect(() => {
    fetchGenres();
  }, []);

  const fetchGenres = async () => {
    try {
      const genres = await genreService.getAllGenres();
      setGenres(genres);
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  };

  const validateMovieData = () => {
    const { name, originalName, posterUrl, duration } = movieFormData;
    const newErrors = {
      name: isNullOrEmpty(name) ? 'Name is required.' : '',
      originalName: isNullOrEmpty(originalName) ? 'Original Name is required.' : '',
      posterUrl: isNullOrEmpty(posterUrl) ? 'Poster URL is required.' : !isValidUrl(posterUrl) ? 'Please enter a valid URL for the movie poster.' : '',
      duration: duration <= 0 ? 'Duration must be greater than 0.' : '',
      genre: selectedGenres.length === 0 ? 'Please select at least one genre.' : ''
    };

    setErrors(newErrors);
    return Object.values(newErrors).every(error => error === '');
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

  const onSubmit = (editMovieSubmitEvent: FormEvent<HTMLFormElement>) => {
    editMovieSubmitEvent.preventDefault();
    
    if (!validateMovieData())
      return;

    const movie : MovieCreate = {
      id: initialMovie.id,
      posterUrl: movieFormData.posterUrl,
      name: movieFormData.name,
      originalName: movieFormData.originalName,
      duration: movieFormData.duration,
      genreIds: selectedGenres
    };
    
    onConfirm(movie);
  };

  return (
    <MovieEditFormStyled>
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
    </MovieEditFormStyled>
  );
}