import { useState } from 'react';
import styled from 'styled-components';
import { Genre } from '../../models/Genre';
import GenreForm from './GenreForm';
import { isNullOrEmpty } from '../../utils/Validator';

interface GenreEditFormProps {
  onConfirm: (genre: Genre) => void;
  onCancel: () => void;
  initialGenre: Genre;
}

const GenreEditFormStyled = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 5px;
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  width: 300px;
  height: 200px;
`;

export default function GenreEditForm({ onConfirm, onCancel, initialGenre }: GenreEditFormProps) {
  const [genreName, setGenreName] = useState(initialGenre.name);
  const [error, setError] = useState<string>('');

  const handleGenreNameChange = (genreName: string) => {
    setGenreName(genreName);
    setError(''); 
  };

  const onSubmit = () => {
    if (isNullOrEmpty(genreName)) {
      setError('Please enter a valid genre name.');
      return;
    }

    const updatedGenre = {
      id: initialGenre.id,
      name: genreName.trim()
    };

    onConfirm(updatedGenre);
  };

  return (
    <GenreEditFormStyled>
      <GenreForm
        genreName={genreName}
        handleGenreNameChange={handleGenreNameChange}
        onSubmit={onSubmit}
        onCancel={onCancel}
        error={error}
      />
    </GenreEditFormStyled>
  );
}