import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { MovieScreening } from '../../models/MovieScreening';

interface MovieScreeningCardProps {
  screening: MovieScreening;
  formatScreeningDate: (dateString: Date) => string;
}

const MovieScreeningCardStyled = styled.div<{ hasPassed: boolean }>`
  border: 1px solid ${({ hasPassed }) => hasPassed ? '#D24545' : '#ccc'};
  padding: 10px;
  margin-right: 10px;
  margin-bottom: 10px;
  height: 160px;
  width: 140px;
  box-shadow: 0 5px 5px rgba(0, 0, 0, 0.1);
  cursor: ${({ hasPassed }) => hasPassed ? 'not-allowed' : 'pointer'};
  pointer-events: ${({ hasPassed }) => hasPassed ? 'none' : 'auto'};
  position: relative;
`;

const Sticker = styled.div`
  position: absolute;
  top: 90px;
  left: 10px;
  background-color: #D24545;
  color: #fff;
  padding: 5px;
  font-weight: bold;
`;

export default function MovieScreeningCard({ screening, formatScreeningDate }: MovieScreeningCardProps) {
  const screeningDateTime = new Date(screening.screeningDateTime);

  const hasPassed = screeningDateTime < new Date();

  return (
    <Link to={hasPassed ? '#' : `/reservation/${screening.id}`} style={{ textDecoration: 'none' }}>
      <MovieScreeningCardStyled hasPassed={hasPassed}>
        {hasPassed && <Sticker>Not available for reservation</Sticker>}
        <p>{formatScreeningDate(screening.screeningDateTime)}</p>
        <p>{screening.ticketPrice} $</p>
      </MovieScreeningCardStyled>
    </Link>
  );
};
