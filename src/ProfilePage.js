import React, { useState, useEffect } from "react";
import { auth, db } from "./firebaseConfig";
import { updateProfile, sendPasswordResetEmail } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";

// Define an array of default profile picture URLs (ensure these images exist in public/images)
const defaultProfilePics = [
  "/images/default1.png",
  "/images/default2.png",
  "/images/default3.png",
  "/images/default4.png",
  "/images/default5.png",
];

const ProfilePage = () => {
  const user = auth.currentUser;
  const [profileData, setProfileData] = useState({
    name: "",
    phone: "",
    birthDate: "",
    interests: "",
    photoURL: "",
  });
  const [message, setMessage] = useState("");

  // Load user profile data on mount
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.displayName || "",
        phone: "",
        birthDate: "",
        interests: "",
        photoURL: user.photoURL || "",
      });
      // Fetch additional data from Firestore (e.g., phone, birthDate, interests)
      const fetchProfile = async () => {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfileData((prev) => ({
            ...prev,
            phone: docSnap.data().phone || "",
            birthDate: docSnap.data().birthDate || "",
            interests: docSnap.data().interests || "",
          }));
        }
      };
      fetchProfile();
    }
  }, [user]);

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  // When a file is selected, store it and create a temporary preview URL
  const handlePicChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileData({ ...profileData, photoURL: URL.createObjectURL(file) });
    }
  };

  // When a default image is clicked, update photoURL accordingly
  const handleDefaultPicSelect = (url) => {
    setProfileData({ ...profileData, photoURL: url });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      let finalPhotoURL = profileData.photoURL;

      // Update Firebase Auth profile with the new name and photo URL
      await updateProfile(user, {
        displayName: profileData.name,
        photoURL: finalPhotoURL,
      });

      // Update Firestore with additional fields
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        phone: profileData.phone,
        birthDate: profileData.birthDate,
        interests: profileData.interests,
        photoURL: finalPhotoURL,
      });

      setMessage("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile: ", error);
      setMessage(error.message);
    }
  };

  const handlePasswordReset = async () => {
    setMessage("");
    try {
      await sendPasswordResetEmail(auth, user.email);
      setMessage("Password reset email sent!");
    } catch (error) {
      console.error("Error sending password reset email: ", error);
      setMessage(error.message);
    }
  };

  return (
    <div className="bg-[#fdf7ee] min-h-screen py-10">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-[#003049] mb-6 text-center">
          Manage Your Profile
        </h1>
        {message && <p className="text-center text-green-600 mb-4">{message}</p>}
        <form onSubmit={handleSave}>
          <div className="flex flex-col items-center">
            <img
              src={profileData.photoURL || "https://via.placeholder.com/150"}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover mb-4"
            />
            <input type="file" onChange={handlePicChange} className="mb-4" />
            <div className="grid grid-cols-5 gap-4 mb-4">
              {defaultProfilePics.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Default ${index + 1}`}
                  className={`w-16 h-16 rounded-full object-cover cursor-pointer border-2 ${
                    profileData.photoURL === url ? "border-[#ff7b54]" : "border-transparent"
                  }`}
                  onClick={() => handleDefaultPicSelect(url)}
                />
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-[#003049] font-semibold mb-1">
              Name:
            </label>
            <input
              type="text"
              name="name"
              value={profileData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-[#003049] font-semibold mb-1">
              Phone Number:
            </label>
            <input
              type="text"
              name="phone"
              value={profileData.phone}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-[#003049] font-semibold mb-1">
              Birth Date:
            </label>
            <input
              type="date"
              name="birthDate"
              value={profileData.birthDate}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-[#003049] font-semibold mb-1">
              Interests:
            </label>
            <textarea
              name="interests"
              value={profileData.interests}
              onChange={handleChange}
              rows="3"
              className="w-full border border-gray-300 p-2 rounded"
              placeholder="List your interests separated by commas..."
            ></textarea>
          </div>
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={handlePasswordReset}
              className="text-[#ff7b54] underline"
            >
              Reset Password
            </button>
            <button
              type="submit"
              className="bg-[#003049] text-white px-6 py-2 rounded-full hover:bg-[#00263c] transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
