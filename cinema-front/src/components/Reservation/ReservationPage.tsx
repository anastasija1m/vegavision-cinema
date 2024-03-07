import { useEffect, useState } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { MovieScreening } from "../../models/MovieScreening";
import { MovieScreeningService } from "../../services/MovieScreeningService";
import { MdEventSeat } from "react-icons/md";
import { ReservationService } from "../../services/ReservationService";
import { ReservedSeat } from "../../models/ReservedSeat";
import { getUserData } from "../../utils/storageUtils";
import { UserService } from "../../services/UserService";
import { RegisteredUser } from "../../models/RegisteredUser";
import { Button } from "../shared/Button";
import ConfirmationDialog from "../shared/ConfirmationDialog";
import Input from "../shared/Input";

interface ReservationPageProps {
  isLoggedIn: boolean;
  showSnackbar: (message: string) => void;
}

const MovieScreeningContainerStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: left;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 5px;
  margin-bottom: 100px;
`;

const ScreeningInfoStyled = styled.div`
  margin-bottom: 30px;
`;

const SeatRowStyled = styled.div`
  display: flex;
  gap: 5px;
  margin-bottom: 5px;
`;

const SeatStyled = styled.div`
  position: relative;
  margin-bottom: 20px;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: ${({ onClick }) => (onClick ? "pointer" : "default")};
  background-color: ${({ color }) => color};

  &:hover {
    background-color: ${({ onClick }) => (onClick ? "orange" : "red")};
  }

  span {
    position: absolute;
    bottom: -20px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 10px;
  }
`;

const TotalPriceStyled = styled.div`
  margin-top: 20px;
`;

const DiscountLinkStyled = styled.span`
  display: block;
  margin-top: 10px;
  text-align: center;
  color: #adbc9f;
  cursor: pointer;
  font-size: 15px;
`;

const reservationService = new ReservationService();

export default function ReservationPage({ isLoggedIn, showSnackbar }: ReservationPageProps) {
  const { screeningId } = useParams<{ screeningId: string }>();
  const [movieScreening, setMovieScreening] = useState<MovieScreening>();
  const [reservedSeats, setReservedSeats] = useState<ReservedSeat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<{ row: number; col: number }[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [userData, setUserData] = useState<RegisteredUser | null>(null);
  const [userInputEmail, setUserInputEmail] = useState<string>('');
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  useEffect(() => {
    fetchMovieScreening();
    fetchReservedSeats();
    fetchUserData();
  }, [isLoggedIn]);

  useEffect(() => {
    if (selectedSeats.length > 0 && movieScreening) {
      let totalPrice = selectedSeats.length * movieScreening.ticketPrice;
      if (isLoggedIn) {
        totalPrice *= 0.95;
      }
      setTotalPrice(totalPrice);
    }
  }, [selectedSeats, movieScreening, isLoggedIn]);

  const fetchUserData = async () => {
    try {
      const userFromStorage = getUserData();

      if (userFromStorage) {
        const fetchedUserData = await UserService.findById(userFromStorage.id);
        setUserData(fetchedUserData);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchMovieScreening = async () => {
    try {
      if (screeningId) {
        const response = await MovieScreeningService.findById(parseInt(screeningId));
        setMovieScreening(response);
      }
    } catch (error) {
      console.error("Error fetching movie screenings: ", error);
    }
  };

  const fetchReservedSeats = async () => {
    try {
      if (screeningId) {
        const response = await reservationService.getAllReservedSeatsForScreening(parseInt(screeningId));
        setReservedSeats(response);
      }
    } catch (error) {
      console.log("Error fetching reserved seats: ", error);
    }
  };

  const formatScreeningDate = (dateString: Date) => {
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

  const renderSeats = () => {
    if (!movieScreening) return null;
    const seats = [];

    for (let row = 1; row <= movieScreening.rows; row++) {
      const rowSeats = [];

      for (let col = 1; col <= movieScreening.columns; col++) {
        const isReserved = reservedSeats.some((seat) => seat.seatRow === row && seat.seatColumn === col);
        const isSelected = selectedSeats.some((seat) => seat.row === row && seat.col === col);

        const seatColor = isReserved ? "red" : isSelected ? "orange" : "green";
        const seatClickHandler = isReserved ? undefined : () => handleSeatClick(row, col);

        const seatNumber = (row - 1) * movieScreening.columns + col;

        rowSeats.push(
          <SeatStyled
            key={`seat-${row}-${col}`}
            onClick={seatClickHandler}
            color={seatColor}
          >
            <span>{seatNumber}</span>
            <MdEventSeat />
          </SeatStyled>
        );
      }

      seats.push(<SeatRowStyled key={`seat-row-${row}`}>{rowSeats}</SeatRowStyled>);
    }

    return seats;
  };

  const handleSeatClick = (row: number, col: number) => {
    const isSeatSelected = selectedSeats.some((seat) => seat.row === row && seat.col === col);
    if (isSeatSelected) {
      const updatedSelectedSeats = selectedSeats.filter((seat) => !(seat.row === row && seat.col === col));
      setSelectedSeats(updatedSelectedSeats);
    } else {
      setSelectedSeats([...selectedSeats, { row, col }]);
    }
  };

  const handleCheckout = () => {
    if (!isLoggedIn) {
      const email = userInputEmail || '';
      if (email) {
        makeReservation(email, selectedSeats);
      }
    } else {
      if (userData?.email) {
        makeReservation(userData.email, selectedSeats);
      }
    }
  };

  const handleUserInputEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInputEmail(event.target.value);
  };

  const makeReservation = async (email: string, selectedSeats: { row: number; col: number }[]) => {
    try {
      if (screeningId && movieScreening && selectedSeats.length > 0) {
        const reservationData = {
          userEmail: email,
          screeningId: parseInt(screeningId),
          totalPrice: selectedSeats.length * movieScreening.ticketPrice,
          reservedSeats: selectedSeats.map(seat => ({ seatRow: seat.row, seatColumn: seat.col }))
        };
        await reservationService.reserve(reservationData);
        setSelectedSeats([]);
        fetchReservedSeats();
        showSnackbar("You have successfully reserved tickets. Check your email for reservation information.");
        closeConfirmation();
        setUserInputEmail('');
      }
    } catch (error) {
      console.error("Error making reservation:", error);
    }
  };

  const openConfirmation = () => {
    setIsConfirmationOpen(true);
  };

  const closeConfirmation = () => {
    setIsConfirmationOpen(false);
  };

  const openDiscoundSnackbar = () => {
    showSnackbar("For 5% discount, register or log into the system.");
  }

  return (
    <MovieScreeningContainerStyled>
      <h2>Movie Screening Information</h2>
      {movieScreening && (
        <ScreeningInfoStyled>
          <div>
            <strong>Ticket Price:</strong> ${movieScreening.ticketPrice}
          </div>
          <div>
            <strong>Screening Date Time:</strong>{" "}
            {formatScreeningDate(movieScreening.screeningDateTime)}
          </div>
        </ScreeningInfoStyled>
      )}
      {renderSeats()}
      {selectedSeats.length > 0 && movieScreening && (
        <>
          <TotalPriceStyled>
            <strong>Total Price:</strong> ${totalPrice.toFixed(2)}
            {isLoggedIn && <span>(5% discount applied)</span>}
          </TotalPriceStyled>
          {!isLoggedIn && (
            <>
              <Input
                type="email"
                value={userInputEmail}
                onChange={handleUserInputEmailChange}
                placeholder="Enter your email"
                name="email"
              />
              <DiscountLinkStyled onClick={openDiscoundSnackbar}>
                Want 5% discount?
              </DiscountLinkStyled>
            </>
          )}
          <Button onClick={openConfirmation} text="Checkout" disabled={selectedSeats.length === 0} />
        </>
      )}
      <ConfirmationDialog
        isOpen={isConfirmationOpen}
        message="Are you sure you want to make a reservation?"
        onConfirm={handleCheckout}
        onCancel={closeConfirmation}
      />
    </MovieScreeningContainerStyled>
  );
}