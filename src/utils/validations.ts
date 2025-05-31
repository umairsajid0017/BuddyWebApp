export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

// Name validation
export const validateName = (name: string): ValidationResult => {
  if (!name.trim()) {
    return { isValid: false, message: "Name is required" };
  }
  
  if (name.trim().length < 2) {
    return { isValid: false, message: "Name must be at least 2 characters long" };
  }
  
  if (name.trim().length > 50) {
    return { isValid: false, message: "Name must be less than 50 characters" };
  }
  
  if (!/^[a-zA-Z\s]+$/.test(name.trim())) {
    return { isValid: false, message: "Name can only contain letters and spaces" };
  }
  
  return { isValid: true };
};

// Email validation
export const validateEmail = (email: string): ValidationResult => {
  if (!email.trim()) {
    return { isValid: false, message: "Email is required" };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, message: "Please enter a valid email address" };
  }
  
  return { isValid: true };
};

// Phone validation - +968 followed by exactly 8 digits
export const validatePhone = (phone: string): ValidationResult => {
  if (!phone.trim()) {
    return { isValid: false, message: "Phone number is required" };
  }
  
  if (!phone.startsWith("+968")) {
    return { isValid: false, message: "Phone number must start with +968" };
  }
  
  const phoneWithoutPrefix = phone.slice(4); // Remove +968
  
  if (phoneWithoutPrefix.length !== 8) {
    return { isValid: false, message: "Phone number must be exactly 8 digits after +968" };
  }
  
  if (!/^\d{8}$/.test(phoneWithoutPrefix)) {
    return { isValid: false, message: "Phone number must contain only digits after +968" };
  }
  
  return { isValid: true };
};

// Password validation (less strict)
export const validatePassword = (password: string): ValidationResult => {
  if (!password) {
    return { isValid: false, message: "Password is required" };
  }
  
  if (password.length < 8) {
    return { isValid: false, message: "Password must be at least 8 characters long" };
  }
  
  if (!/[A-Za-z]/.test(password)) {
    return { isValid: false, message: "Password must contain at least one letter" };
  }
  
  if (!/[0-9!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { isValid: false, message: "Password must contain at least one number or special character" };
  }
  
  return { isValid: true };
};

// Password requirements for UI display
export interface PasswordRequirement {
  text: string;
  validator: (password: string) => boolean;
  isMet: boolean;
}

export const getPasswordRequirements = (): PasswordRequirement[] => [
  { 
    text: "At least 8 characters", 
    validator: (pass) => pass.length >= 8,
    isMet: false 
  },
  { 
    text: "At least one letter", 
    validator: (pass) => /[A-Za-z]/.test(pass),
    isMet: false 
  },
  { 
    text: "At least one number or special character", 
    validator: (pass) => /[0-9!@#$%^&*(),.?":{}|<>]/.test(pass),
    isMet: false 
  },
];

// Calculate password strength percentage
export const calculatePasswordStrength = (password: string): number => {
  if (!password) return 0;
  
  const requirements = getPasswordRequirements();
  const metRequirements = requirements.filter(req => req.validator(password)).length;
  return (metRequirements / requirements.length) * 100;
};

// Get password strength color class
export const getPasswordStrengthColor = (strength: number): string => {
  if (strength <= 33) return "bg-red-500";
  if (strength <= 66) return "bg-yellow-500";
  return "bg-green-500";
};

// Get password strength text
export const getPasswordStrengthText = (strength: number): string => {
  if (strength <= 33) return "Weak";
  if (strength <= 66) return "Medium";
  return "Strong";
}; 