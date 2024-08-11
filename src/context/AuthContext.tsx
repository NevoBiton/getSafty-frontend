import { toast } from "@/components/ui/use-toast";
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
  roomId?: string;
  title: string;
  address: IAddress;
  location: {
    lng: number;
    lat: number;
  };
  description: string;
  image: string[];
  capacity: number;
  ownerId: string;
  available: boolean;
  accessible: boolean;
  isPublic: boolean;
  createdAt?: string;
}

export interface User {
  userId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  profilePic: string;
  safeRooms: IRoom[];
  favorites: IRoom[];
  createdAt?: string;
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
      createLoggedInUser();
    }
  }, []);

  async function createLoggedInUser() {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const { data } = await api.get("/users");
        setLoggedInUser({
          userId: data._id,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phoneNumber: data.phoneNumber,
          profilePic: data.profilePic,
          safeRooms: data.safeRooms,
          favorites: data.favorites,
          createdAt: data.createdAt,
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
      const { data } = await api.get("/users");
      setLoggedInUser({
        userId: data._id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        profilePic: data.profilePic,
        safeRooms: data.safeRooms,
        favorites: data.favorites,
        createdAt: data.createdAt,
      });
      toast({
        title: "Logged in successfully",
        description: `${data.firstName} ${data.lastName}`,
      });
    } catch (error) {
      console.error("Error logging in:", error);
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
