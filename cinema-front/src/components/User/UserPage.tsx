import { useState, useEffect } from "react";
import styled from "styled-components";
import { UserService } from "../../services/UserService";
import { RegisteredUser } from "../../models/RegisteredUser";
import { Button } from "../shared/Button";
import ConfirmationDialog from "../shared/ConfirmationDialog";
import Input from "../shared/Input";

interface UserListProps {
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

export default function UserPage({ showSnackbar }: UserListProps) {
  const [users, setUsers] = useState<RegisteredUser[]>([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [page, size]);

  const fetchUsers = async () => {
    try {
      const response = await UserService.findAll(page, size);
      setUsers(response.content);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Error fetching users:", error);
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

  const openConfirmation = (userId: number) => {
    setSelectedUserId(userId);
    setIsConfirmationOpen(true);
  };

  const closeConfirmation = () => {
    setSelectedUserId(null);
    setIsConfirmationOpen(false);
  };

  const blockUser = async () => {
    if (selectedUserId === null) {
      showSnackbar("There was an error blocking user. Try again later.");
      return;
    }
  
    try {
      await UserService.blockUser(selectedUserId);
      showSnackbar("User blocked successfully.");
      closeConfirmation();
      fetchUsers();
    } catch (error: any) {
      showSnackbar(error.response.data);
      closeConfirmation();
    }
  };
  
  const resetUserPassword = async (id: number) => {
    if (!id) {
      showSnackbar("Invalid user email. Try again later");
      return;
    }

    try {
      await UserService.resetPasswordByAdmin(id);
      showSnackbar(`Link for resetting password has been sent to the user.`);
    } catch (error: any) {
      showSnackbar(error.message);
    }
  };

  return (
    <WrapperStyled>
      <TitleStyled>Registered Users</TitleStyled>
      <SelectStyled id="pageSize" value={size} onChange={handleSizeChange}>
        <option value={5}>5 per page</option>
        <option value={10}>10 per page</option>
        <option value={20}>20 per page</option>
      </SelectStyled>
      <TableStyled>
        <thead>
          <tr>
            <ThStyled>Name</ThStyled>
            <ThStyled>Surname</ThStyled>
            <ThStyled>Username</ThStyled>
            <ThStyled>Email</ThStyled>
            <ThStyled>Blocked account</ThStyled>
            <ThStyled>Block</ThStyled>
            <ThStyled>Reset Password</ThStyled>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <TdStyled>{user.name}</TdStyled>
              <TdStyled>{user.surname}</TdStyled>
              <TdStyled>{user.username}</TdStyled>
              <TdStyled>{user.email}</TdStyled>
              <TdStyled>{user.blocked ? "Blocked" : "Not blocked"}</TdStyled>
              <TdStyled>
                <Button
                  text="Block"
                  onClick={() => openConfirmation(user.id)}
                  disabled={user.blocked}
                />
              </TdStyled>
              <TdStyled>
                <Button
                  text="Send Reset Link"
                  onClick={() => resetUserPassword(user.id)}
                />
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
        message="Are you sure you want to block this user?"
        onConfirm={blockUser}
        onCancel={closeConfirmation}
      />
    </WrapperStyled>
  );
};