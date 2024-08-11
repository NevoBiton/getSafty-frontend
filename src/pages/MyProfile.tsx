import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext"; // Adjust the path based on your project structure
import api from "@/services/api.services";

function MyProfile() {
  const authContext = useContext(AuthContext);

  const [rooms, setRooms] = useState();

  useEffect(() => {}, []);

  if (!authContext) {
    return <div>Error: AuthContext is not available.</div>;
  }

  const { loggedInUser } = authContext;

  if (!loggedInUser) {
    return <div>Please log in to view your profile.</div>;
  }

  return (
    <div className="profile-container">
      <h2>My Profile</h2>
      <div className="profile-info">
        <img
          src={loggedInUser.profilePic}
          alt={`${loggedInUser.firstName} ${loggedInUser.lastName}`}
          className="profile-pic"
        />
        <p>
          <strong>Name:</strong>{" "}
          {`${loggedInUser.firstName} ${loggedInUser.lastName}`}
        </p>
        <p>
          <strong>Email:</strong> {loggedInUser.email}
        </p>
        <p>
          <strong>Phone:</strong> {loggedInUser.phoneNumber}
        </p>
        <h3>Safe Rooms:</h3>
        <ul>
          {loggedInUser.safeRooms.map((room) => (
            <li key={room._id}>
              {room.title} - {room.address.street}, {room.address.city}
            </li>
          ))}
        </ul>
        <h3>Favorites:</h3>
        <ul>
          {loggedInUser.favorites.map((room) => (
            <li key={room._id}>
              {room.title} - {room.address.street}, {room.address.city}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default MyProfile;
