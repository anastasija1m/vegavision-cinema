import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { MovieScreening } from "../../models/MovieScreening";
import { MovieScreeningService } from "../../services/MovieScreeningService";
import { Movie } from "../../models/Movie";
import { Button } from "../shared/Button";
import Input from "../shared/Input";
import { format } from 'date-fns';
import ConfirmationDialog from "../shared/ConfirmationDialog";
import { MovieService } from "../../services/MovieService";
import MovieScreeningAddForm from "./MovieScreeningAddForm";
import MovieScreeningEditForm from "./MovieScreeningEditForm";

interface MovieScreeningProps {
  openModal: (element: React.ReactNode) => void;
  closeModal: () => void;
  showSnackbar: (message: string) => void;
  userRole: string;
}

const WrapperStyled = styled.div`
  margin-top: 20px;
`;

const TitleStyled = styled.h2`
  font-size: 24px;
  margin-bottom: 10px;
  margin-left: 10px;
`;

const SelectStyled = styled.select`
  font-size: 16px;
  padding: 8px;
  margin-left: 10px;
`;

const TableStyled = styled.table`
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #ddd;
  margin-top: 20px;
`;

const ThStyled = styled.th`
  padding: 8px;
  text-align: left;
  border-bottom: 1px solid #ddd;
`;

const TdStyled = styled.td`
  padding: 8px;
  border-bottom: 1px solid #ddd;
`;

const PaginationStyled = styled.div`
  margin-top: 10px;
  margin-bottom: 60px;
`;

const PageInfoStyled = styled.span`
  margin-left: 10px;
`;

const movieService = new MovieService();

export default function MovieScreeningsPage({ openModal, closeModal, userRole, showSnackbar }: MovieScreeningProps) {
  const [movieScreenings, setMovieScreenings] = useState<MovieScreening[]>([]);
  const [movies, setMovies] = useState<Record<number, Movie>>({});
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [selectedMovieScreeningId, setSelectedMovieScreeningId] = useState<number | null>(null);

  useEffect(() => {
    fetchMovies();
    fetchMovieScreenings();
  }, [page, size]);

  const fetchMovies = async () => {
    try {
      const moviesData = await movieService.getAllMovies();
      const moviesMap: Record<number, Movie> = {};
      console.log(moviesMap);
      moviesData.forEach(movie => {
        if (movie.id !== undefined) {
          moviesMap[movie.id] = movie;
        }
      });
      setMovies(moviesMap);
    } catch (error) {
      console.error("Error fetching movies: ", error);
    }
  };

  const fetchMovieScreenings = async () => {
    try {
      const response = await MovieScreeningService.findAll(page, size);
      setMovieScreenings(response.content);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Error fetching movie screenings: ", error);
    }
  };

  const handlePageNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const pageNumber = parseInt(event.target.value);
    if (!isNaN(pageNumber) && pageNumber > 0 && pageNumber <= totalPages) {
      setPage(pageNumber - 1);
    }
  };

  const handleSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = parseInt(event.target.value);
    setSize(newSize);
    setPage(0);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const deleteMovieScreening = async () => {
    if (selectedMovieScreeningId === null) {
      showSnackbar("There was an error deleting movie screening. Try again later.");
      return;
    }

    try {
      await MovieScreeningService.deleteMovieScreening(selectedMovieScreeningId);
      showSnackbar("Movie screening deleted successfully.");
      closeConfirmation();
      fetchMovieScreenings();
    } catch (error: any) {
      showSnackbar(error.response.data);
      closeConfirmation();
    }
  };

  const openConfirmation = (movieScreeningId: number) => {
    setSelectedMovieScreeningId(movieScreeningId);
    setIsConfirmationOpen(true);
  };

  const closeConfirmation = () => {
    setSelectedMovieScreeningId(null);
    setIsConfirmationOpen(false);
  };

  const handleError = (error: any) => {
    showSnackbar(error.message);
  };

  const handleOperation = async (operation: Promise<any>) => {
    try {
      await operation;
      fetchMovieScreenings();
      closeModal();
    } catch (error) {
      handleError(error);
    }
  };

  const openAddModal = () => {
    openModal(<MovieScreeningAddForm onConfirm={addMovieScreening} onCancel={closeModal} />);
  };

  const addMovieScreening = (movieScreening: MovieScreening) => {
    handleOperation(MovieScreeningService.addMovieScreening(movieScreening));
  }

  const openEditModal = (movieScreening: MovieScreening) => {
    openModal(<MovieScreeningEditForm onConfirm={editMovieScreening} onCancel={closeModal} initialMovieScreening={movieScreening} />);
  };

  const editMovieScreening = (updatedMovieScreening: MovieScreening) => {
    if (updatedMovieScreening.id === undefined) {
      showSnackbar('Error editing movie screening. Please try again later.');
      return;
    }

    handleOperation(MovieScreeningService.editMovieScreening(updatedMovieScreening.id, updatedMovieScreening));
  };
  
  return (
    <WrapperStyled>
      <TitleStyled>Movie Screenings</TitleStyled>
      {userRole === 'ADMIN' &&
        <Button onClick={openAddModal} text="Add movie screening" />
      }
      <SelectStyled id="pageSize" value={size} onChange={handleSizeChange}>
        <option value={5}>5 per page</option>
        <option value={10}>10 per page</option>
        <option value={20}>20 per page</option>
      </SelectStyled>
      <TableStyled>
        <thead>
          <tr>
            <ThStyled>Ticket price</ThStyled>
            <ThStyled>Screening date</ThStyled>
            <ThStyled>Screening time</ThStyled>
            <ThStyled>Movie name</ThStyled>
            <ThStyled>Original movie name</ThStyled>
            <ThStyled>Number of seats</ThStyled>
            <ThStyled>Delete</ThStyled>
            <ThStyled>Edit</ThStyled>
          </tr>
        </thead>
        <tbody>
          {movieScreenings.map((movieScreening) => (
            <tr key={movieScreening.id}>
              <TdStyled>{movieScreening.ticketPrice} $</TdStyled>
              <TdStyled>{format(new Date(movieScreening.screeningDateTime), 'MM.dd.yyyy.')}</TdStyled>
              <TdStyled>{format(new Date(movieScreening.screeningDateTime), 'HH:mm')}</TdStyled>
              <TdStyled>{movies[movieScreening.movieId]?.name}</TdStyled>
              <TdStyled>{movies[movieScreening.movieId]?.originalName}</TdStyled>
              <TdStyled>{movieScreening.columns * movieScreening.rows}</TdStyled>
              <TdStyled>
                <Button onClick={() => movieScreening.id && openConfirmation(movieScreening.id)} text="Delete" />
              </TdStyled>
              <TdStyled>
                <Button onClick={() => openEditModal(movieScreening)} text="Edit" />
              </TdStyled>
            </tr>
          ))}
        </tbody>
      </TableStyled>
      <PaginationStyled>
        <Button onClick={() => handlePageChange(page - 1)} disabled={page === 0} text="Previous" />
        <Button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages - 1} text="Next" />
        <PageInfoStyled>
          <span>Page:</span>
          <Input type="number" value={page + 1} onChange={handlePageNumberChange} name={"number"} />
          <span>of {totalPages}</span>
        </PageInfoStyled>
      </PaginationStyled>
      <ConfirmationDialog
        isOpen={isConfirmationOpen}
        message="Are you sure you want to delete this movie screening?"
        onConfirm={deleteMovieScreening}
        onCancel={closeConfirmation}
      />
    </WrapperStyled>
  );
}