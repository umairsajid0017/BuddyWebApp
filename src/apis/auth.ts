import { LoginType } from "@/constants/constantValues";
import { Endpoints } from './endpoints';
import { http } from './httpMethods';
import { LoginResponse, RegisterResponse } from './api-response-types';

// Common interface for auth data
interface BaseAuthData {
  email: string;
  password: string;
  name?: string;
  phone?: string;
}

// Common interface for auth methods
interface AuthMethods {
  register: (data: BaseAuthData) => Promise<RegisterResponse>;
  login: (data: BaseAuthData) => Promise<LoginResponse>;
}

// Base auth implementation
const createAuth = (loginType: LoginType): AuthMethods => ({
  register: async (authData: BaseAuthData) => {
    const formData = new FormData();
    formData.append('name', authData.name || authData.email?.split('@')[0] || "User");
    formData.append('email', authData.email);
    formData.append('password', authData.password);
    formData.append('phone', authData.phone || "");
    formData.append('login_type', loginType);
    formData.append('role', 'customer');

    const { data } = await http.post<RegisterResponse>(Endpoints.REGISTER, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },

  login: async (authData: BaseAuthData) => {
    const formData = new FormData();
    formData.append('email', authData.email);
    formData.append('password', authData.password);
    formData.append('login_type', loginType);
    formData.append('role', 'customer');

    const { data } = await http.post<LoginResponse>(Endpoints.LOGIN, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },
});

// Guest Authentication
export const guestAuth = createAuth(LoginType.GUEST);

// Google Authentication
export const googleAuth = {
  ...createAuth(LoginType.GOOGLE),
  
  // Override register method to handle Google-specific data
  register: async (userData: {
    email: string;
    displayName: string;
    uid: string;
    photoURL: string;
    providerData: any[];
  }) => {
    const googleId = userData.providerData?.[0]?.uid;
    if (!googleId) {
      throw new Error('Google ID not found');
    }

    return createAuth(LoginType.GOOGLE).register({
      email: userData.email,
      password: googleId,
      name: userData.displayName,
      phone: "+968" + (googleId.slice(-8)),
    });
  },

  // Override login method to handle Google-specific data
  login: async (userData: {
    email: string;
    displayName: string;
    uid: string;
    photoURL: string;
    providerData: any[];
  }) => {
    const googleId = userData.providerData?.[0]?.uid;
    if (!googleId) {
      throw new Error('Google ID not found');
    }

    return createAuth(LoginType.GOOGLE).login({
      email: userData.email,
      password: googleId,
    });
  },
}; 