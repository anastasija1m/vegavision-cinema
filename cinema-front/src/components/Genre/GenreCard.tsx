import { Button } from '../shared/Button';
import styled from 'styled-components';
import { Genre } from '../../models/Genre';
import ConfirmationDialog from '../shared/ConfirmationDialog';
import { useState } from 'react';

interface GenreCardProps {
  genre: Genre;
  onDelete: (id: number) => void;
  onEdit: (genre: Genre) => void;
  userRole: string;
}

const GenreCardStyled = styled.div`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 16px;
  margin-right: 16px;
  margin-bottom: 16px;
  width: 200px;
`;

const GenreNameStyled = styled.p`
  margin: 0;
`;

export default function GenreCard({ genre, onDelete, onEdit, userRole }: GenreCardProps) {
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  const openConfirmation = () => {
    setIsConfirmationOpen(true);
  };

  const closeConfirmation = () => {
    setIsConfirmationOpen(false);
  };

  const handleDelete = () => {
    if (genre.id) {
      onDelete(genre.id);
      closeConfirmation();
    }
  };

  return (
    <GenreCardStyled>
      <GenreNameStyled>{genre.name}</GenreNameStyled>
      {userRole === 'ADMIN' &&
        <>
          <Button
            onClick={openConfirmation}
            text="Delete" />
          <Button
            onClick={() => onEdit(genre)}
            text="Edit" />
        </>
      }
      <ConfirmationDialog
        isOpen={isConfirmationOpen}
        message="Are you sure you want to delete this genre?"
        onConfirm={handleDelete}
        onCancel={closeConfirmation}
      />
    </GenreCardStyled>
  );
}