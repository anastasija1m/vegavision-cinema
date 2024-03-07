import { useState } from 'react';
import styled from 'styled-components';
import { Genre } from '../../models/Genre';
import GenreForm from './GenreForm';
import { isNullOrEmpty } from '../../utils/Validator';

interface GenreAddFormProps {
  onConfirm: (genre: Genre) => void;
  onCancel: () => void;
}

const GenreAddFormStyled = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 5px;
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  width: 300px;
  height: 200px;
`;

export default function GenreAddForm({ onConfirm, onCancel }: GenreAddFormProps) {
  const [genreName, setGenreName] = useState('');
  const [error, setError] = useState('');

  const handleGenreNameChange = (genreName: string) => {
    setGenreName(genreName);
    setError('');
  };

  const onSubmit = () => {
    if (isNullOrEmpty(genreName)) {
      setError('Please enter a valid genre name.');
    } else {
      const genre = {
        id: Date.now(),
        name: genreName.trim()
      };
      onConfirm(genre);
    }
  };

  return (
    <GenreAddFormStyled>
      <GenreForm
        genreName={genreName}
        handleGenreNameChange={handleGenreNameChange}
        onSubmit={onSubmit}
        onCancel={onCancel}
        error={error}
      />
    </GenreAddFormStyled>
  );
}