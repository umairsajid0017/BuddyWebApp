import { LoginType, RoleType } from "@/constants/constantValues";
import { Endpoints } from './endpoints';
import { http } from './httpMethods';
import { LoginResponse, RegisterResponse } from './api-response-types';

// Common interface for auth data
interface BaseAuthData {
  email: string;
  password: string;
  name?: string;
  phone?: string;
  login_type?: LoginType;
  role?: string;
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
    formData.append('role', authData.role || RoleType.CUSTOMER);

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
    formData.append('login_type', authData.login_type || LoginType.GUEST);
    formData.append('role', authData.role || RoleType.CUSTOMER);

    console.log("formData", formData);
    console.log("authData", authData);

    const { data } = await http.post<LoginResponse>(Endpoints.LOGIN, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log("data", data);
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
    password: string;
  }) => {

    console.log("register userData", userData);

    const phone = "+968" + userData.uid.slice(0, 8);
    console.log("phone", phone);
    return createAuth(LoginType.GOOGLE).register({
      email: userData.email,
      password: userData.password,
      name: userData.displayName,
      phone: phone,
    });
  },

  login: async (userData: {
    email: string;
    displayName: string;
    uid: string;
    photoURL: string;
    providerData: any[];
    password: string;
  }) => {
    console.log("userData", userData);

    return createAuth(LoginType.GOOGLE).login({
      email: userData.email,
      password: userData.password,
      login_type: LoginType.GOOGLE,
      role: RoleType.CUSTOMER,
    });
  },
}; 