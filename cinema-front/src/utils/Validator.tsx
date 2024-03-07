const isValidUrl = (url: string): boolean => {
  const urlRegex = /^(https?|http):\/\/.*\.(?:png|jpg|jpeg)/;
  return urlRegex.test(url);
};

const isNullOrEmpty = (value: string | null | undefined): boolean => {
  return value == null || value.trim() === '';
};

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

export { isValidUrl, isNullOrEmpty, isValidEmail, isValidDate }