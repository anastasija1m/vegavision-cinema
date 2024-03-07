import styled from "styled-components";
import { Movie } from "../../models/Movie";

interface MovieInfoProps {
  movie: Movie;
}

const MovieInfoContainerStyled = styled.div`
  display: flex;
`;

const MovieInfoStyled = styled.div`
  margin-right: 500px;
  padding: 5px;
`;

const MovieImageStyled = styled.img`
  width: 200px;
  height: auto;
  object-fit: cover;
  border-radius: 4px;
  padding: 30px;
`;

const GenresListStyled = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const MovieDurationStyled = styled.p``;

export default function MovieInfo({ movie }: MovieInfoProps) {
  return (
    <MovieInfoContainerStyled>
      <MovieImageStyled src={movie.posterUrl} alt={movie.name} />
      <MovieInfoStyled>
        <h2>{movie.name}</h2>
        <p>{movie.originalName}</p>
        <MovieDurationStyled>Duration: {movie.duration} minutes</MovieDurationStyled>
        <GenresListStyled>
          {movie.genres &&
            movie.genres.map((genre: any, index: any) => <li key={index}>{genre.name}</li>)}
        </GenresListStyled>
      </MovieInfoStyled>
    </MovieInfoContainerStyled>
  );
};