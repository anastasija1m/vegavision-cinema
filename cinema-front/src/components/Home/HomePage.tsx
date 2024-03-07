import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { MovieService } from '../../services/MovieService';
import { MovieScreeningService } from '../../services/MovieScreeningService';
import MovieInfo from './MovieInfo';
import MovieScreenings from './MovieScreeningCards';
import MovieCard from './MovieCard';
import HomeFilterMenu from './HomeFilterMenu';
import { GenreService } from '../../services/GenreService';
import { Movie } from '../../models/Movie';
import { Genre } from '../../models/Genre';
import { MovieScreening } from '../../models/MovieScreening';

const HomePageContainerStyled = styled.div`
  overflow: hidden;
  margin-bottom: 70px;
`;

const ImageStyled = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const movieService = new MovieService();
const genreService = new GenreService();

export default function HomePage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [movieScreenings, setMovieScreenings] = useState<MovieScreening[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);

  useEffect(() => {
    fetchMovies();
    fetchGenres();
  }, []);

  useEffect(() => {
    fetchMovieScreenings();
  }, [selectedDate, selectedGenres]);

  const fetchMovies = async () => {
    try {
      const moviesData = await movieService.getAllMovies();
      setMovies(moviesData);
    } catch (error) {
      handleError(error);
    }
  };

  const fetchGenres = async () => {
    try {
      const fetchedGenres = await genreService.getAllGenres();
      setGenres(fetchedGenres);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const fetchMovieScreenings = async () => {
    try {
      const response = await MovieScreeningService.getAllFiltered(selectedDate ?? undefined, selectedGenres.length > 0 ? selectedGenres : undefined);
      const movieScreeningsData = response.movieScreenings;
      setMovieScreenings(movieScreeningsData);
      const movieIds = response.movieIds;
      if (movieIds && movieIds.length > 0) {
        const moviesData = await movieService.fetchMoviesByIds(movieIds);
        setMovies(moviesData);
      }
    } catch (error) {
      console.error('Error fetching movie screenings: ', error);
    }
  };

  const handleError = (error: any) => {
    setError(error.message);
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
  };

  const handleMovieSortChange = (order: "asc" | "desc") => {
    sortMoviesAlphabetically(order);
  };

  const handleScreeningSortChange = (order: "asc" | "desc") => {
    sortScreeningsChronologically(order);
  };

  const sortMoviesAlphabetically = (order: "asc" | "desc") => {
    const sortedMovies = [...movies].sort((a, b) => {
      if (order === "asc") {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });
    setMovies(sortedMovies);
  };

  const sortScreeningsChronologically = (order: "asc" | "desc") => {
    const sortedScreenings = [...movieScreenings].sort((a, b) => {
      const dateA = new Date(a.screeningDateTime).getTime();
      const dateB = new Date(b.screeningDateTime).getTime();
      if (order === "asc") {
        return dateA - dateB;
      } else {
        return dateB - dateA;
      }
    });
    setMovieScreenings(sortedScreenings);
  };

  const formatScreeningDate = (dateString: Date) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    };
    return date.toLocaleString('en-US', options);
  };

  const handleGenreSelection = (genreId: number) => {
    setSelectedGenres(prevState => {
      if (prevState.includes(genreId)) {
        return prevState.filter(id => id !== genreId);
      } else {
        return [...prevState, genreId]; 
      }
    });
  };

  const today = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);

  const todayFormatted = today.toISOString().split('T')[0];
  const nextWeekFormatted = nextWeek.toISOString().split('T')[0];

  return (
    <>
      <ImageStyled src="/home_page.jpg" alt="Home page welcome" />
      <HomePageContainerStyled>
        <HomeFilterMenu
          selectedDate={selectedDate}
          handleDateChange={handleDateChange}
          todayFormatted={todayFormatted}
          nextWeekFormatted={nextWeekFormatted}
          genres={genres}
          selectedGenres={selectedGenres}
          handleGenreSelection={handleGenreSelection}
          handleMovieSortChange={handleMovieSortChange}
          handleScreeningSortChange={handleScreeningSortChange}
        />
        {movies.map((movie) => (
          <MovieCard key={movie.id}>
            <MovieInfo movie={movie} />
            <MovieScreenings
              screenings={movieScreenings.filter((screening) => screening.movieId === movie.id)}
              formatScreeningDate={formatScreeningDate}
            />
          </MovieCard>
        ))}
        {error && <p>Error: {error}</p>}
      </HomePageContainerStyled>
    </>
  );
};