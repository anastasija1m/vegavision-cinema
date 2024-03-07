import './App.css';
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MoviePage from './components/Movie/MoviePage';
import GenrePage from './components/Genre/GenrePage';
import Navbar from './components/Navbar/Navbar';
import Modal from './components/shared/Modal';
import Footer from './components/Footer/Footer';
import Snackbar from '@mui/material/Snackbar';
import PasswordChangePage from './components/PasswordChange/PasswordChangePage';
import UserPage from './components/User/UserPage';
import { handleLogOut, saveAccessToken, saveUserData } from './utils/storageUtils';
import UserProfilePage from './components/User/UserProfilePage';
import decodeToken from './authentication/AuthProvider';
import { User } from './models/User';
import MovieScreeningsPage from './components/MovieScreenings/MovieScreeningsPage';
import HomePage from './components/Home/HomePage';
import ReservationPage from './components/Reservation/ReservationPage';

export default function App() {
  const [modal, setModal] = useState<React.ReactNode>();
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string>('');

  const openModal = (element: React.ReactNode) => {
    setModal(element);
  }

  const closeModal = () => {
    setModal(null);
  }

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setOpenSnackbar(true);
  };

  const handleLogin = (data: any) => {
    setIsLoggedIn(true);

    const token = data.access_token;
    saveAccessToken(token);

    const decodedToken = decodeToken(token) as User;
    saveUserData(decodedToken);

    setUserRole(decodedToken.role);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    handleLogOut();
    setUserRole('');
  };

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      setIsLoggedIn(true);
      const decodedToken = decodeToken(accessToken) as User;
      setUserRole(decodedToken.role);
    }
  }, []);

  return (
    <BrowserRouter>
      <Navbar userRole={userRole} isLoggedIn={isLoggedIn} openModal={openModal} closeModal={closeModal} showSnackbar={showSnackbar} handleLogout={handleLogout} handleLogin={handleLogin} />
      <Routes>
        <Route path='' element={<HomePage />} />
        <Route path='movies' element={<MoviePage openModal={openModal} closeModal={closeModal} userRole={userRole} />} />
        <Route path='genres' element={<GenrePage openModal={openModal} closeModal={closeModal} userRole={userRole} />} />
        <Route path='change-password/:token' element={<PasswordChangePage />} />
        <Route path='users' element={<UserPage showSnackbar={showSnackbar} />} />
        <Route path='user-profile' element={<UserProfilePage showSnackbar={showSnackbar} />} />
        <Route path='movie-screenings' element={<MovieScreeningsPage openModal={openModal} closeModal={closeModal} userRole={userRole} showSnackbar={showSnackbar} />} />
        <Route path='reservation/:screeningId' element={<ReservationPage isLoggedIn={isLoggedIn} showSnackbar={showSnackbar} />} />
      </Routes>
      {
        modal && <Modal>{modal}</Modal>
      }
      {
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          message={snackbarMessage}
        />
      }
      <Footer />
    </BrowserRouter>
  );
}