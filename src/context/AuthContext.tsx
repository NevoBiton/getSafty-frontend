import { toast } from "@/components/ui/use-toast";
import { formatJWTTokenToUser } from "@/lib/utils";
import api from "@/services/api.services";
import { SwatchBook } from "lucide-react";
import { createContext, useEffect, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

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
  userRooms: IRoom[] | null;
  setUserRooms: React.Dispatch<React.SetStateAction<IRoom[]>>; // Correctly typed
  favRooms: IRoom[] | null;
  setFavRooms: any;
}

export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [userRooms, setUserRooms] = useState<IRoom[] | null>(null);
  const [favRooms, setFavRooms] = useState<IRoom[] | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && loggedInUser === null) {
      login(token);
    }
  }, []);

  async function fetchRooms(userId: string) {
    try {
      const { data } = await api.get(`/room/user/${userId}`);
      const { userRooms } = data;
      setUserRooms(userRooms);
    } catch (error) {
      console.log(error);
    }
  }

  const login = async (token: string) => {
    localStorage.setItem("token", token);
    try {
      const { userId }: any = formatJWTTokenToUser(token);
      const { data } = await api.get(`/auth/${userId}`);
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
      fetchRooms(userId);
      getFavById(userId);
      toast({
        title: "Logged in successfully",
        description: `${user.firstName} ${user.lastName}`,
      });
    } catch (error) {
      toast({
        title: "Failed to Login",
        description: "Please check your credentials and try again.",
      });
      logout(); // Log out user if there's an error fetching data
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setLoggedInUser(null);
    navigate("/");
  };

  const getFavById = async (userId: string) => {
    try {
      if (!userId) return;
      const { data } = await api.get(`/room/user/fav/${userId}`);
      const { favRooms } = data;

      setFavRooms(favRooms);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        loggedInUser,
        login,
        logout,
        userRooms,
        setUserRooms,
        favRooms,
        setFavRooms,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
