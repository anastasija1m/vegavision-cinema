import { useState } from "react";
import styled from "styled-components";
import { Button } from "../shared/Button";
import Input from "../shared/Input";
import { isNullOrEmpty } from "../../utils/Validator";
import { UserService } from "../../services/UserService";
import { FaEye, FaEyeSlash } from 'react-icons/fa';

interface LoginFormProps {
  closeModal: () => void;
  handleLogin: (data: any) => void;
  showSnackbar: (message: string) => void;
}

const LoginFormStyled = styled.div`
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
  color: #12372a;
`;

const EmailFormGroupStyled = styled.div`
  margin-bottom: 15px;
  text-align: center;
`;

const PasswordFormGroupStyled = styled.div`
  margin-bottom: 15px;
  text-align: center;
  margin-left: 20px;
`;

const LabelStyled = styled.label`
  display: block;
  margin-bottom: 5px;
  color: #12372a;
`;

const ButtonContainerStyled = styled.div`
  text-align: center;
`;

const ErrorMessageStyled = styled.p`
  color: red;
  font-size: 12px;
  text-align: center;
  margin-top: 10px;
`;

const PasswordResetLinkStyled = styled.span`
  display: block;
  margin-top: 10px;
  text-align: center;
  color: #adbc9f;
  cursor: pointer;
  font-size: 15px;
`;

const PasswordVisibilityIcon = styled.i`
  cursor: pointer;
  margin-left: 5px;
`;

const InputStyled = styled(Input)`
  margin-left: 20px;
`;

export default function LoginForm({
  closeModal,
  handleLogin,
  showSnackbar,
}: LoginFormProps) {
  const [loginFormData, setLoginFormData] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isNullOrEmpty(loginFormData.email) || isNullOrEmpty(loginFormData.password)) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    try {
      const data = await UserService.login(loginFormData);
      handleLogin(data);
      closeModal();
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };

  const handlePasswordReset = async () => {
    if (!loginFormData.email) {
      setErrorMessage("Please provide your email address for password change.");
      return;
    }

    try {
      await UserService.resetPasswordByUser(loginFormData.email);
      showSnackbar(
        "Link for resetting password has been sent to your email address."
      );
      closeModal();
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };

  return (
    <LoginFormStyled>
      <FormStyled onSubmit={handleSubmit}>
        <TitleStyled>Login</TitleStyled>
        <EmailFormGroupStyled>
          <LabelStyled>Email</LabelStyled>
          <Input
            type="email"
            name="email"
            value={loginFormData.email}
            onChange={handleChange}
          />
        </EmailFormGroupStyled>
        <PasswordFormGroupStyled>
          <LabelStyled>Password</LabelStyled>
          <InputStyled
            type={showPassword ? "text" : "password"}
            name="password"
            value={loginFormData.password}
            onChange={handleChange}
          />

          <PasswordVisibilityIcon
            as={showPassword ? FaEye : FaEyeSlash}
            onClick={() => setShowPassword(!showPassword)}
          />
        </PasswordFormGroupStyled>
        {errorMessage && (
          <ErrorMessageStyled>{errorMessage}</ErrorMessageStyled>
        )}
        <PasswordResetLinkStyled onClick={handlePasswordReset}>
          Forgot your password? Reset it here.
        </PasswordResetLinkStyled>
        <ButtonContainerStyled>
          <Button text="Login" type="submit" />
          <Button onClick={closeModal} text="Cancel" />
        </ButtonContainerStyled>
      </FormStyled>
    </LoginFormStyled>
  );
}