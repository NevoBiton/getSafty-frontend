import { toast } from "@/components/ui/use-toast";
import { formatJWTTokenToUser } from "@/lib/utils";
import api from "@/services/api.services";
import { createContext, useEffect, useState, ReactNode } from "react";

interface IAddress {
  city: string;
  street: string;
  number: number;
  floor: number;
  appartment: number;
}

interface IRoom {
  roomId?: string;
  address: IAddress;
  description: string;
  image: string[];
  capacity: number;
  ownerId: string;
  availability: boolean;
  accessible: boolean;
  public: boolean;
  createdAt?: string;
}

interface User {
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

export interface IUserLoginData {
  email: FormDataEntryValue | null;
  password: FormDataEntryValue | null;
}

interface AuthContextProps {
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
        const userId = formatJWTTokenToUser(token);
        const { data } = await api.get(`/auth/${userId}`);
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
      const { userId }: any = formatJWTTokenToUser(token);
      const { data } = await api.get(`/auth/${userId}`);

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
