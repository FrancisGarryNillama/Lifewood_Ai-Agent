const MAX_FILE_SIZE = 5 * 1024 * 1024;
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone) => {
  const re = /^[0-9]{10,11}$/;
  return re.test(phone.replace(/[-\s]/g, ''));
};

export const validateFileType = (file) => {
  return file && (file.type === 'image/jpeg' || file.type === 'image/png');
};

export const validateFileSize = (file, maxSize = MAX_FILE_SIZE) => {
  return file && file.size <= maxSize;
};

export const validateRequired = (value) => {
  return value && value.toString().trim().length > 0;
};