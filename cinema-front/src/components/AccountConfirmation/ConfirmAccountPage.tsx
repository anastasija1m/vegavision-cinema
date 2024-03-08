import { useLocation } from 'react-router-dom';
import AccountConfirmation from './AccountConfirmation';
import { UserService } from '../../services/UserService';

export default function ConfirmationPage() {
  const location = useLocation();
  const token = new URLSearchParams(location.search).get('token');

  if (token) {
    UserService.confirmAccount(token)
      .catch(error => {
        console.error("Error confirming account:", error);
      });
  }

  return (
    <div>
      <AccountConfirmation />
    </div>
  );
};