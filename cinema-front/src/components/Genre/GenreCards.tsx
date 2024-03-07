import { Genre } from '../../models/Genre';
import GenreCard from './GenreCard';
import styled from 'styled-components';

interface GenreCardsProps {
  genres: Genre[];
  onDelete: (id: number) => void;
  onEdit: (genre: Genre) => void;
  userRole: string;
}

const GenreCardsStyled = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  margin-top: 15px;
  margin-bottom: 15px;
  margin-left: 15px;
`;

export default function GenreCards({ genres, onDelete, onEdit, userRole }: GenreCardsProps) {
  return (
    <GenreCardsStyled>
      {genres.map(genre => (
        <GenreCard
          key={genre.id}
          genre={genre}
          onDelete={onDelete}
          onEdit={onEdit}
          userRole={userRole}
        />
      ))}
    </GenreCardsStyled>
  );
}
