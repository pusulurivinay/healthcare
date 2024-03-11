export const setAuthToken = (token, user) => { 
  const { userName, phoneNumber, email, password } = user;
  localStorage.setItem('token', token);
  localStorage.setItem(
    'user',
    JSON.stringify({ userName, phoneNumber, email, password })
  );
  
};

export const getAuthToken = () => {
  return localStorage.getItem('token');
};

export const getUserDetails = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const removeAuthToken = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};