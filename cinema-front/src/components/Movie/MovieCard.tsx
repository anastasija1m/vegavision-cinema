import { useState } from 'react';
import styled from 'styled-components';
import { Movie } from '../../models/Movie';
import { Button } from '../shared/Button';
import ConfirmationDialog from '../shared/ConfirmationDialog';

interface MovieCardProps {
  movie: Movie;
  onDelete: (id: number) => void;
  onEdit: (movie: Movie) => void;
  userRole: string;
}

const MovieCardStyled = styled.div`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  padding: 16px;
  width: 500px;
  margin: 30px;
`;

const MovieNameStyled = styled.h1`
  margin: 0;
`;

const MovieOriginalNameStyled = styled.p`
  margin: 0;
`;

const MovieImageStyled = styled.img`
  width: 100%;
  height: auto;
  border-radius: 4px;
`;

const MovieDurationStyled = styled.p``;

const GenresListStyled = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const GenreStyled = styled.li`
  margin-right: 8px;
  display: inline;
`;

export default function MovieCard({ movie, onDelete, onEdit, userRole }: MovieCardProps) {
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  const openConfirmation = () => setIsConfirmationOpen(true);
  const closeConfirmation = () => setIsConfirmationOpen(false);

  const handleDelete = () => {
    if (movie.id) {
      onDelete(movie.id);
      closeConfirmation();
    }
  };

  return (
    <MovieCardStyled>
      <MovieImageStyled src={movie.posterUrl} alt={movie.name} />
      <MovieNameStyled>{movie.name}</MovieNameStyled>
      <MovieOriginalNameStyled>{movie.originalName}</MovieOriginalNameStyled>
      <MovieDurationStyled>Duration: {movie.duration} minutes</MovieDurationStyled>
      <GenresListStyled>
        {movie.genres && movie.genres.map((genre, index) => (
          <GenreStyled key={index}>{genre.name}</GenreStyled>
        ))}
      </GenresListStyled>
      {userRole === 'ADMIN' && (
        <>
          <Button onClick={openConfirmation} text="Delete" />
          <Button onClick={() => onEdit(movie)} text="Edit" />
        </>
      )}
      <ConfirmationDialog
        isOpen={isConfirmationOpen}
        message="Are you sure you want to delete this movie?"
        onConfirm={handleDelete}
        onCancel={closeConfirmation}
      />
    </MovieCardStyled>
  );
}
