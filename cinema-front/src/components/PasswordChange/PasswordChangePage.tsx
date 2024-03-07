import React, { FormEvent, useState } from 'react';
import styled from 'styled-components';
import { Button } from '../shared/Button';
import Input from '../shared/Input';
import { UserService } from '../../services/UserService';
import { Link, useParams } from 'react-router-dom';
import { PasswordChangeViaEmail } from '../../models/PasswordChangeViaEmail';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
  margin-top: 40px;
  width: 400px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 20px;
  position: relative;
`;

const ErrorStyled = styled.span`
  color: red;
  font-size: 12px;
  position: absolute;
  bottom: -50px;
`;

const Label = styled.label`
  margin: 10px 0 5px;
`;

const ButtonContainer = styled.div`
  margin-top: 35px;
`;

const SuccessMessage = styled.div`
  color: green;
  font-size: 16px;
`;

const PasswordVisibilityIcon = styled.i`
  position: absolute;
  right: -20px;
  top: 75%;
  transform: translateY(-50%);
  cursor: pointer;
`;

export default function PasswordChangePage() {
  const { token } = useParams<{ token: string }>();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { password, confirmPassword } = formData;
    if (password === confirmPassword) {
      const passwordChange: PasswordChangeViaEmail = {
        password,
        token: token || ''
      };
      console.log(passwordChange);
      try {
        await UserService.changePasswordViaEmail(passwordChange);
        setSuccess(true);
      } catch (error) {
        setError('Failed to change password. Please try again later.');
      }
    } else {
      setError('Passwords do not match. Please re-enter.');
    }
  };

  return (
    <Container>
      {!success && (
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              name="password"
            />
            <PasswordVisibilityIcon
              as={showPassword ? FaEye : FaEyeSlash}
              onClick={() => setShowPassword(!showPassword)}
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleChange}
              name="confirmPassword"
            />
            <PasswordVisibilityIcon
              as={showConfirmPassword ? FaEye : FaEyeSlash}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            />
            {error && <ErrorStyled>{error}</ErrorStyled>}
          </FormGroup>
          <ButtonContainer>
            <Button type="submit" text="Change Password" />
          </ButtonContainer>
        </Form>
      )}
      {success && (
        <SuccessMessage>
          Password changed successfully. <Link to="/">Return to home page</Link>
        </SuccessMessage>
      )}
    </Container>
  );
}