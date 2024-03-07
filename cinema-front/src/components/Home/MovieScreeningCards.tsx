import styled from 'styled-components';
import MovieScreeningCard from './MovieScreeningCard';
import { MovieScreening } from '../../models/MovieScreening';

interface MovieScreeningCardsProps {
  screenings: MovieScreening[];
  formatScreeningDate: (dateString: Date) => string;
}

const MovieScreeningCardsStyled = styled.div`
  flex: 1;
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
`;

export default function MovieScreeningCards({ screenings, formatScreeningDate }: MovieScreeningCardsProps) {
  return (
    <MovieScreeningCardsStyled>
      {screenings.map((screening: MovieScreening) => (
        <MovieScreeningCard key={screening.id} screening={screening} formatScreeningDate={formatScreeningDate} />
      ))}
    </MovieScreeningCardsStyled>
  );
};