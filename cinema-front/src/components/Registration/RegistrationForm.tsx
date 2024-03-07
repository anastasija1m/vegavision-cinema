import { useState } from "react";
import styled from "styled-components";
import { Button } from "../shared/Button";
import Input from "../shared/Input";
import { isNullOrEmpty, isValidDate } from "../../utils/Validator";
import { UserService } from "../../services/UserService";

interface RegistrationFormProps {
  closeModal: () => void;
  showSnackbar: (message: string) => void; 
}

const RegistrationFormStyled = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const FormStyled = styled.form`
  width: 350px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
  box-shadow: 0 10px 10px rgba(0, 0, 0, 0.1);
  align-items: center;
`;

const TitleStyled = styled.h2`
  margin-top: 0;
  text-align: center;
  color: #12372A;
`;

const FormGroupStyled = styled.div`
  margin-bottom: 15px;
  text-align: center;
`;

const LabelStyled = styled.label`
  display: block;
  margin-bottom: 5px;
  color: #12372A;
`;

const ErrorStyled = styled.div`
  color: red;
  font-size: 12px;
`;

const ButtonContainerStyled = styled.div`
  text-align: center;
`;

export default function RegistrationForm({ closeModal, showSnackbar }: RegistrationFormProps) {
  
  const [registrationForm, setRegistrationForm] = useState({
    name: '',
    surname: '',
    email: '',
    username: '',
    dateOfBirth: '',
    password: ''
  });

  const [errors, setErrors] = useState({
    name: '',
    surname: '',
    email: '',
    username: '',
    dateOfBirth: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegistrationForm(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const isInputValid = () => {
    const newErrors = {
      name: isNullOrEmpty(registrationForm.name) ? 'Name is required' : '',
      surname: isNullOrEmpty(registrationForm.surname) ? 'Surname is required' : '',
      email: isNullOrEmpty(registrationForm.email) ? 'Invalid email' : '',
      username: isNullOrEmpty(registrationForm.username) ? 'Username is required' : '',
      dateOfBirth: isNullOrEmpty(registrationForm.dateOfBirth) || !isValidDate(registrationForm.dateOfBirth) ? 'Invalid date of birth' : '',
      password: isNullOrEmpty(registrationForm.password) ? 'Password is required' : ''
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isInputValid()) {
      return;
    }

    try {
      await UserService.register({
        name: registrationForm.name,
        surname: registrationForm.surname,
        email: registrationForm.email,
        username: registrationForm.username,
        dateOfBirth: registrationForm.dateOfBirth,
        password: registrationForm.password
      });

      showSnackbar('Registration successful. Check your email for confirmation link.');
      closeModal();
    } catch (error: any) {
      showSnackbar(error.message);
    }
  };

  return (
    <RegistrationFormStyled>
      <FormStyled onSubmit={handleSubmit}>
        <TitleStyled>Registration</TitleStyled>
        <FormGroupStyled>
          <LabelStyled>Name</LabelStyled>
          <Input
            type="text"
            name="name"
            value={registrationForm.name}
            onChange={handleChange}
          />
          <ErrorStyled>{errors.name}</ErrorStyled>
        </FormGroupStyled>
        <FormGroupStyled>
          <LabelStyled>Surname</LabelStyled>
          <Input
            type="text"
            name="surname"
            value={registrationForm.surname}
            onChange={handleChange}
          />
          <ErrorStyled>{errors.surname}</ErrorStyled>
        </FormGroupStyled>
        <FormGroupStyled>
          <LabelStyled>Email</LabelStyled>
          <Input
            type="email"
            name="email"
            value={registrationForm.email}
            onChange={handleChange}
          />
          <ErrorStyled>{errors.email}</ErrorStyled>
        </FormGroupStyled>
        <FormGroupStyled>
          <LabelStyled>Username</LabelStyled>
          <Input
            type="text"
            name="username"
            value={registrationForm.username}
            onChange={handleChange}
          />
          <ErrorStyled>{errors.username}</ErrorStyled>
        </FormGroupStyled>
        <FormGroupStyled>
          <LabelStyled>Date of Birth</LabelStyled>
          <Input
            type="date"
            name="dateOfBirth"
            value={registrationForm.dateOfBirth}
            onChange={handleChange}
          />
          <ErrorStyled>{errors.dateOfBirth}</ErrorStyled>
        </FormGroupStyled>
        <FormGroupStyled>
          <LabelStyled>Password</LabelStyled>
          <Input
            type="password"
            name="password"
            value={registrationForm.password}
            onChange={handleChange}
          />
          <ErrorStyled>{errors.password}</ErrorStyled>
        </FormGroupStyled>
        <ButtonContainerStyled>
          <Button
            text="Register"
            type="submit"
          />
          <Button
            onClick={closeModal}
            text="Cancel"
          />
        </ButtonContainerStyled>
      </FormStyled>
    </RegistrationFormStyled>
  );
}