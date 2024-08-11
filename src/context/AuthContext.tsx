import { toast } from "@/components/ui/use-toast";
import { formatJWTTokenToUser } from "@/lib/utils";
import api from "@/services/api.services";
import { createContext, useEffect, useState, ReactNode } from "react";

export interface IAddress {
  city: string;
  street: string;
  number: number;
  floor: number;
  appartment: number;
}

export interface IRoom {
  _id?: string;
  title: string;
  address: IAddress;
  location: {
    lng: number;
    lat: number;
  };
  description: string;
  image?: string[];
  capacity: number;
  ownerId: string;
  available: boolean;
  accessible: boolean;
  isPublic: boolean;
  createdAt?: string;
}

export interface User {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  profilePic: string;
  safeRooms: IRoom[];
  favorites: IRoom[];
  createdAt?: string;
}

export interface IUserLoginData {
  email: FormDataEntryValue | null;
  password: FormDataEntryValue | null;
}

export interface AuthContextProps {
  loggedInUser: User | null;
  login: (token: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && loggedInUser === null) {
      createLoggedInUser(token);
    }
  }, []);

  async function createLoggedInUser(token: string) {
    if (token) {
      try {
        const { _id }: any = formatJWTTokenToUser(token);
        const { data } = await api.get(`/auth/${_id}`);
        const { user } = data;

        setLoggedInUser({
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          profilePic: user.profilePic,
          safeRooms: user.safeRooms,
          favorites: user.favorites,
          createdAt: user.createdAt,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        logout(); // Log out user if there's an error fetching data
      }
    }
  }

  const login = async (token: string) => {
    localStorage.setItem("token", token);
    try {
      console.log(formatJWTTokenToUser(token));

      const { _id }: any = formatJWTTokenToUser(token);
      console.log(_id);

      const { data } = await api.get(`/auth/${_id}`);
      const { user } = data;

      setLoggedInUser({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        profilePic: user.profilePic,
        safeRooms: user.safeRooms,
        favorites: user.favorites,
        createdAt: user.createdAt,
      });
      toast({
        title: "Logged in successfully",
        description: `${user.firstName} ${user.lastName}`,
      });
    } catch (error) {
      toast({
        title: "Failed to Login",
        description: "Please check your credentials and try again.",
      });
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setLoggedInUser(null);
  };

  return (
    <AuthContext.Provider value={{ loggedInUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
