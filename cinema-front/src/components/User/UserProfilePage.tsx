import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { RegisteredUser } from '../../models/RegisteredUser';
import { getUserData } from '../../utils/storageUtils';
import { UserService } from '../../services/UserService';
import Input from '../shared/Input';
import { PasswordChangeViaProfile } from '../../models/PasswordChangeViaProfile';
import { Button } from '../shared/Button';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

interface UserProfileProps {
  showSnackbar: (message: string) => void;
}

const UserProfileContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
`;

const UserProfileCard = styled.div`
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const FieldStyled = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const LabelStyled = styled.span`
  font-weight: bold;
  margin-right: 10px;
`;

const ValueStyled = styled.span`
  margin-left: 10px;
`;

const PasswordChangeMenuStyled = styled.div``;

const PasswordVisibilityIcon = styled.i`
  cursor: pointer;
  margin-left: 5px;
`;

export default function UserProfilePage({ showSnackbar }: UserProfileProps) {
  const [userData, setUserData] = useState<RegisteredUser | null>(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userFromStorage = getUserData();

        if (userFromStorage) {
          const fetchedUserData = await UserService.findById(userFromStorage.id);
          setUserData(fetchedUserData);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleChangePassword = async () => {
    try {
      if (!currentPassword || !newPassword) {
        throw new Error('Please fill in both current and new passwords.');
      }

      const passwordChangeData: PasswordChangeViaProfile = {
        currentPassword: currentPassword,
        newPassword: newPassword,
      };

      await UserService.changePasswordViaProfile(userData!.id, passwordChangeData);
      showSnackbar('Password changed successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setMenuVisible(!menuVisible);
    } catch (error: any) {
      showSnackbar('Error changing password:' + error.message);
    }
  };

  return (
    <UserProfileContainer>
      <h1>User Profile</h1>
      {userData && (
        <UserProfileCard>
          <FieldStyled>
            <LabelStyled>Name:</LabelStyled>
            <ValueStyled>{userData.name}</ValueStyled>
          </FieldStyled>
          <FieldStyled>
            <LabelStyled>Surname:</LabelStyled>
            <ValueStyled>{userData.surname}</ValueStyled>
          </FieldStyled>
          <FieldStyled>
            <LabelStyled>Email:</LabelStyled>
            <ValueStyled>{userData.email}</ValueStyled>
          </FieldStyled>
          <FieldStyled>
            <LabelStyled>Blocked:</LabelStyled>
            <ValueStyled>{userData.blocked ? 'Yes' : 'No'}</ValueStyled>
          </FieldStyled>
          <FieldStyled>
            <LabelStyled>Username:</LabelStyled>
            <ValueStyled>{userData.username}</ValueStyled>
          </FieldStyled>
          <Button
            onClick={() => setMenuVisible(!menuVisible)}
            text={menuVisible ? 'Hide Password Change' : 'Change Password'}
          />
          {menuVisible && (
            <PasswordChangeMenuStyled>
              <FieldStyled>
                <LabelStyled>Current Password:</LabelStyled>
                <Input
                  type={showCurrentPassword ? 'text' : 'password'}
                  name="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <PasswordVisibilityIcon
                  as={showCurrentPassword ? FaEye : FaEyeSlash}
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                />
              </FieldStyled>
              <FieldStyled>
                <LabelStyled>New Password:</LabelStyled>
                <Input
                  type={showNewPassword ? 'text' : 'password'}
                  name="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <PasswordVisibilityIcon
                  as={showNewPassword ? FaEye : FaEyeSlash}
                  onClick={() => setShowNewPassword(!showNewPassword)}
                />
              </FieldStyled>
              <Button onClick={handleChangePassword} text="Submit" />
            </PasswordChangeMenuStyled>
          )}
        </UserProfileCard>
      )}
    </UserProfileContainer>
  );
}