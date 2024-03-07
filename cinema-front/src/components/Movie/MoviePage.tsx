import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Movie } from "../../models/Movie";
import MovieCards from "./MovieCards";
import MovieMenu from "./MovieMenu";
import MovieAddForm from "./MovieAddForm";
import MovieEditForm from "./MovieEditForm";
import { MovieService } from "../../services/MovieService";
import { MovieCreate } from "../../models/MovieCreate";

interface MoviePageProps {
  openModal: (element: React.ReactNode) => void;
  closeModal: () => void;
  userRole: string;
}

const MoviePageStyled = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 60px;
`;

const ErrorMessageStyled = styled.div`
  color: red;
  margin-bottom: 10px;
`;

const movieService = new MovieService();

export default function MoviePage({ openModal, closeModal, userRole }: MoviePageProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const moviesData = await movieService.getAllMovies();
      setMovies(moviesData);
    } catch (error) {
      handleError(error);
    }
  };

  const handleError = (error: any) => {
    setError(error.message);
  };

  const handleOperation = async (operation: Promise<any>) => {
    try {
      await operation;
      fetchMovies();
      closeModal();
    } catch (error) {
      handleError(error);
    }
  };

  const addMovie = (movie: MovieCreate) => {
    handleOperation(movieService.addMovie(movie));
  };

  const editMovie = (updatedMovie: MovieCreate) => {
    if (updatedMovie.id === undefined) {
      setError('Error editing movie. Please try again later.');
      return;
    }
    
    handleOperation(movieService.editMovie(updatedMovie.id, updatedMovie));
  };

  const deleteMovie = (id: number) => {
    handleOperation(movieService.deleteMovie(id));
  };

  const openAddModal = () => {
    openModal(<MovieAddForm onConfirm={addMovie} onCancel={closeModal} />);
  };

  const openEditModal = (movie: Movie) => {
    openModal(<MovieEditForm onConfirm={editMovie} onCancel={closeModal} initialMovie={movie} />);
  };

  return (
    <MoviePageStyled>
      {error && <ErrorMessageStyled>{error}</ErrorMessageStyled>}
      {userRole === 'ADMIN' && (
        <MovieMenu openAddModal={openAddModal} />
      )}
      <MovieCards
        movies={movies}
        onDelete={deleteMovie}
        onEdit={openEditModal}
        userRole={userRole} />
    </MoviePageStyled>
  );
}