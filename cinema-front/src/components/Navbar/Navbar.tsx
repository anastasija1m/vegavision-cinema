import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from '../shared/Button';
import LoginForm from '../Login/LoginForm';
import RegistrationForm from '../Registration/RegistrationForm';

interface NavbarProps {
  openModal: (element: React.ReactNode) => void;
  closeModal: () => void;
  showSnackbar: (message: string) => void;
  isLoggedIn: boolean;
  handleLogout: () => void;
  handleLogin: (data: any) => void;
  userRole: string;
}

const NavbarStyled = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  background-color: #12372A;
  color: white;
`;

const NavbarLinks = styled.div`
  display: flex;
  gap: 20px;
  flex: 1;
  justify-content: center;
`;

const ButtonsContainerStyled = styled.div`
  margin-left: auto;
`;

const LogoStyled = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const LogoImageStyled = styled.img`
  height: 40px;
`;

const LogoTextStyled = styled.p`
  margin: 0;
  color: white;
`;

export default function Navbar({ openModal, closeModal, showSnackbar, userRole, isLoggedIn, handleLogout, handleLogin }: NavbarProps) {

  const openLoginModal = () => {
    openModal(<LoginForm closeModal={closeModal} handleLogin={handleLogin} showSnackbar={showSnackbar} />);
  }

  const openRegistrationModal = () => {
    openModal(<RegistrationForm closeModal={closeModal} showSnackbar={showSnackbar} />);
  };

  return (
    <NavbarStyled>
      <LogoStyled>
        <Link to="/">
          <LogoImageStyled src="/favicon.ico" alt="Logo" />
        </Link>
        <Link to="/">
          <LogoTextStyled>VegaVision Cinema</LogoTextStyled>
        </Link>
      </LogoStyled>
      <NavbarLinks>
        <LinkStyled to="">Repertoire</LinkStyled>
        <LinkStyled to="/movies">Movies</LinkStyled>
        {userRole === 'ADMIN' &&
          <>
            <LinkStyled to="/genres">Genres</LinkStyled>
            <LinkStyled to="/users">Users</LinkStyled>
            <LinkStyled to="/movie-screenings">Movie Screenings</LinkStyled>
          </>
        }
      </NavbarLinks>
      <ButtonsContainerStyled>
        {isLoggedIn ? (
          <>
            <Link to="/user-profile">
              <Button
                text="My Profile"
                color="#436850" />
            </Link>
            <Button
              text="Logout"
              onClick={handleLogout} />
          </>
        ) : (
          <>
            <Button
              text="Login"
              color="#436850"
              onClick={openLoginModal}
            />
            <Button
              text="Register"
              onClick={openRegistrationModal}
            />
          </>
        )}
      </ButtonsContainerStyled>
    </NavbarStyled>
  );
}

const LinkStyled = styled(Link)`
  color: white;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;
