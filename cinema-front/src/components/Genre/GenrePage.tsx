import { useEffect, useState } from 'react';
import GenreCards from './GenreCards';
import styled from 'styled-components';
import { Genre } from '../../models/Genre';
import GenreEditForm from './GenreEditForm';
import GenreAddForm from './GenreAddForm';
import GenreFilterMenu from './GenreFilterMenu';
import { GenreService } from '../../services/GenreService';

interface GenrePageProps {
  openModal: (element: React.ReactNode) => void;
  closeModal: () => void;
  userRole: string;
}

const GenrePageStyled = styled.div`
  display: flex;
`;

const ErrorMessageStyled = styled.div`
  color: red;
  margin-bottom: 10px;
`;

const genreService = new GenreService();

export default function GenrePage({ openModal, closeModal, userRole }: GenrePageProps) {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGenres();
  }, []);

  const fetchGenres = async () => {
    try {
      const fetchedGenres = await genreService.getAllGenres();
      setGenres(fetchedGenres);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleAddGenre = async (newGenre: Genre) => {
    try {
      if (genres.some(genre => genre.name.toLowerCase() === newGenre.name.toLowerCase())) {
        throw new Error(`Genre with name ${newGenre.name} already exists.`);
      }

      await genreService.addGenre(newGenre);
      fetchGenres();
      closeModal();
    } catch (error: any) {
      setError(error.message);
      closeModal();
    }
  };

  const handleEditGenre = async (updatedGenre: Genre) => {
    try {
      if (genres.some(genre => genre.name.toLowerCase() === updatedGenre.name.toLowerCase())) {
        throw new Error(`Genre with name ${updatedGenre.name} already exists.`);
      }

      await genreService.editGenre(updatedGenre.id, updatedGenre);
      fetchGenres();
      closeModal();
    } catch (error: any) {
      setError(error.message);
      closeModal();
    }
  };

  const handleDeleteGenre = async (id: number) => {
    try {
      await genreService.deleteGenre(id);
      setGenres(genres.filter(genre => genre.id !== id));
    } catch (error: any) {
      setError(error.message);
    }
  };

  const openAddModal = () => {
    openModal(<GenreAddForm onConfirm={handleAddGenre} onCancel={closeModal} />);
  };

  const openEditModal = (genre: Genre) => {
    openModal(<GenreEditForm onConfirm={handleEditGenre} onCancel={closeModal} initialGenre={genre} />);
  };

  return (
    <GenrePageStyled>
      {error && <ErrorMessageStyled>{error}</ErrorMessageStyled>}
      <GenreCards
        genres={genres}
        onDelete={handleDeleteGenre}
        onEdit={openEditModal}
        userRole={userRole}
      />
      {userRole === 'ADMIN' &&
        <GenreFilterMenu
          openAddModal={openAddModal} />
      }
    </GenrePageStyled>
  );
};