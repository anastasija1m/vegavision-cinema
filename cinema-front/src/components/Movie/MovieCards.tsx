import styled from 'styled-components';
import { Movie } from '../../models/Movie';
import MovieCard from './MovieCard';
import { Button } from '../shared/Button';
import { useRef } from 'react';

interface MovieCardsProps {
  movies: Movie[];
  onDelete: (id: number) => void;
  onEdit: (movie: Movie) => void;
  userRole: string;
}

const MovieCardsStyled = styled.div`
  display: flex;
  overflow-x: auto;
  height: auto;
  scroll-behavior: smooth;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const CardsListStyled = styled.div`
  flex: 0 0 auto;
`;

const ScrollButtonsStyled = styled.div`
  display: flex;
  align-items: center;
`;

export default function MovieCards({ movies, onDelete, onEdit, userRole }: MovieCardsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft -= 575;
    }
  };

  const handleScrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft += 575;
    }
  };

  return (
    <>
      <ScrollButtonsStyled>
        <Button onClick={handleScrollLeft} text='<' />
        <MovieCardsStyled ref={containerRef}>
          {movies.map(movie => (
            <CardsListStyled key={movie.id}>
              <MovieCard
                movie={movie}
                onDelete={onDelete}
                onEdit={onEdit}
                userRole={userRole}
              />
            </CardsListStyled>
          ))}
        </MovieCardsStyled>
        <Button onClick={handleScrollRight} text='>' />
      </ScrollButtonsStyled>
    </>
  );
}