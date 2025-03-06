// AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/users/profile");
      setCurrentUser(response.data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    const response = await axios.post("http://localhost:5000/api/users/login", {
      email,
      password,
    });
    const { token, user } = response.data;
    localStorage.setItem("token", token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setCurrentUser(user);
    return user;
  };

  const register = async (name, email, password) => {
    const response = await axios.post("http://localhost:5000/api/users/register", {
      name,
      email,
      password,
    });
    const { token, user } = response.data;
    localStorage.setItem("token", token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setCurrentUser(user);
    return user;
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setCurrentUser(null);
  };

  const updateProfile = async (profileData) => {
    const response = await axios.put("http://localhost:5000/api/users/profile", profileData);
    setCurrentUser(response.data);
    return response.data;
  };

  const updateProfilePicture = async (file) => {
    const formData = new FormData();
    formData.append("profilePicture", file);
    const response = await axios.post(
      "http://localhost:5000/api/users/upload-profile-picture",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    setCurrentUser({ ...currentUser, profilePicture: response.data.profilePicture });
    return response.data;
  };

  const value = {
    currentUser,
    loading,
    login,
    register,
    logout,
    updateProfile,
    updateProfilePicture,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
