import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { MovieScreening } from '../../models/MovieScreening';

interface MovieScreeningCardProps {
  screening: MovieScreening;
  formatScreeningDate: (dateString: Date) => string;
}

const MovieScreeningCardStyled = styled.div`
  border: 1px solid #ccc;
  padding: 10px;
  margin-right: 10px;
  margin-bottom: 10px;
  height: 160px;
  width: 140px;
  box-shadow: 0 5px 5px rgba(0, 0, 0, 0.1);
  cursor: pointer;
`;

export default function MovieScreeningCard({ screening, formatScreeningDate }: MovieScreeningCardProps) {
  return (
    <Link to={`/reservation/${screening.id}`} style={{ textDecoration: 'none' }}>
      <MovieScreeningCardStyled>
        <p>{formatScreeningDate(screening.screeningDateTime)}</p>
        <p>{screening.ticketPrice} $</p>
      </MovieScreeningCardStyled>
    </Link>
  );
};
