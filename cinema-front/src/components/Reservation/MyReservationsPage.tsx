import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { ReservationService } from "../../services/ReservationService";
import { getUserData } from "../../utils/storageUtils";
import { Button } from "../shared/Button";
import Input from "../shared/Input";
import ConfirmationDialog from "../shared/ConfirmationDialog";
import { ReservationGet } from "../../models/ReservationGet";
import { MovieScreening } from "../../models/MovieScreening";
import { MyReservationsGet } from "../../models/MyReservationsGet";

interface MyReservationsPageProps {
  showSnackbar: (message: string) => void;
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

export default function MyReservationsPage({ showSnackbar }: MyReservationsPageProps) {
  const [reservations, setReservations] = useState<MyReservationsGet[]>([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [reservationType, setReservationType] = useState('future');
  const [selectedReservationId, setSelectedReservationId] = useState<number | null>(null);
  const [userId, setUserId] = useState<number>(0);

  useEffect(() => {
    const fetchUserDataAndReservations = async () => {
      try {
        const userFromStorage = getUserData();
        if (userFromStorage) {
          setUserId(userFromStorage.id);
          await fetchReservations(userFromStorage.id);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserDataAndReservations();
  }, [page, size, reservationType]);

  const fetchReservations = async (userId: number) => {
    try {
      const response = await ReservationService.findAll(userId, page, size, reservationType);
      console.log(response);
      setReservations(response.content);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Error fetching reservations:", error);
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

  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setReservationType(event.target.value);
  };

  const openConfirmation = (reservationId: number | undefined) => {
    if (reservationId) {
      setSelectedReservationId(reservationId);
      setIsConfirmationOpen(true);
    }
  };

  const closeConfirmation = () => {
    setIsConfirmationOpen(false);
  };

  const cancelReservation = async () => {
    try {
      if (selectedReservationId)
        await ReservationService.cancelReservation(selectedReservationId);
      showSnackbar("Reservation cancelled successfully!");
      closeConfirmation();
      fetchReservations(userId);
    } catch (error) {
      console.error("Error cancelling reservation:", error);
    }
  };

  const formatScreeningDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    return date.toLocaleString("en-US", options);
  };

  const calculateSeatNumber = (seatRow: number, seatColumn: number, columns: number) => {
    return (seatRow - 1) * columns + seatColumn;
  };

  return (
    <WrapperStyled>
      <TitleStyled>My Reservations</TitleStyled>
      <SelectStyled id="pageSize" value={size} onChange={handleSizeChange}>
        <option value={5}>5 per page</option>
        <option value={10}>10 per page</option>
        <option value={20}>20 per page</option>
      </SelectStyled>
      <SelectStyled id="reservationType" value={reservationType} onChange={handleTypeChange}>
        <option value="future">Future Reservations</option>
        <option value="passed">Past Reservations</option>
      </SelectStyled>
      <TableStyled>
        <thead>
          <tr>
            <ThStyled>Total Price</ThStyled>
            <ThStyled>Discount Percent</ThStyled>
            <ThStyled>Total</ThStyled>
            <ThStyled>Cancellation</ThStyled>
            <ThStyled>Screening information</ThStyled>
            <ThStyled>Movie</ThStyled>
            <ThStyled>Reserved seats</ThStyled>
          </tr>
        </thead>
        <tbody>
          {reservations.map((reservation) => (
            <tr key={reservation.id}>
              <TdStyled>{reservation.totalPrice.toFixed(2)}</TdStyled>
              <TdStyled>{reservation.discountPercent !== null ? `${reservation.discountPercent}%` : '0%'}</TdStyled>
              <TdStyled>{(reservation.totalPrice - (reservation.totalPrice * reservation.discountPercent) / 100).toFixed(2)}</TdStyled>
              <TdStyled>
                {reservationType === "future" ? (
                  reservation.cancelled ? (
                    <span>Cancelled</span>
                  ) : (
                    <Button onClick={() => openConfirmation(reservation.id)} text="Cancel" />
                  )
                ) : (
                  <span>{reservation.cancelled ? "Cancelled" : "Not Cancelled"}</span>
                )}
              </TdStyled>

              <TdStyled>
                <div>
                  <div>{formatScreeningDate(reservation.movieScreeningGetDto?.screeningDateTime)}</div>
                </div>
              </TdStyled>
              <TdStyled>
                <div>
                  <img src={reservation.movieScreeningGetDto?.movieGetDto?.posterUrl} alt={reservation.movieScreeningGetDto?.movieGetDto?.name} width="100" height="150" />
                  <div>{reservation.movieScreeningGetDto?.movieGetDto?.name}</div>
                </div>
              </TdStyled>
              <TdStyled>
                <div>
                  {reservation.reservedSeats.map((seat, index) => (
                    <span key={index}>{`Seat ${calculateSeatNumber(seat.seatRow, seat.seatColumn, reservation.movieScreeningGetDto?.columns || 0)} `}</span>
                  ))}
                </div>
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
        message="Are you sure you want to cancel this reservation?"
        onConfirm={cancelReservation}
        onCancel={closeConfirmation}
      />
    </WrapperStyled>
  );
};