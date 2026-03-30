export type AuthFormErrors = Partial<{ name: string; email: string; password: string }>; 

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateLogin(data: { email: string; password: string }): AuthFormErrors {
  const errors: AuthFormErrors = {};

  if (!data.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!emailRegex.test(data.email)) {
    errors.email = 'Please enter a valid email.';
  }

  if (!data.password) {
    errors.password = 'Password is required.';
  } else if (data.password.length < 8) {
    errors.password = 'Password should be at least 8 characters.';
  } else if (!/[0-9]/.test(data.password) || !/[!@#$%^&*]/.test(data.password)) {
    errors.password = 'Password must include a number and a symbol.';
  }

  return errors;
}

export function validateRegister(data: { name: string; email: string; password: string }): AuthFormErrors {
  const errors = validateLogin({ email: data.email, password: data.password });

  if (!data.name.trim()) {
    errors.name = 'Full name is required.';
  }

  return errors;
}
