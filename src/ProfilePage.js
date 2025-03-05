import React, { useState, useEffect } from "react";
import { auth, db } from "./firebaseConfig";
import { updateProfile, sendPasswordResetEmail } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const ProfilePage = () => {
  const user = auth.currentUser;
  const [profileData, setProfileData] = useState({
    name: "",
    phone: "",
    photoURL: "",
  });
  const [profilePic, setProfilePic] = useState(null);
  const [message, setMessage] = useState("");
  
  // Initialize Firebase Storage
  const storage = getStorage();

  // Load user profile data on mount
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.displayName || "",
        phone: "",
        photoURL: user.photoURL || "",
      });
      // Fetch additional data from Firestore (e.g., phone number)
      const fetchProfile = async () => {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfileData((prev) => ({
            ...prev,
            phone: docSnap.data().phone || "",
          }));
        }
      };
      fetchProfile();
    }
  }, [user]);

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  // When a file is selected, store it in state and show a preview URL
  const handlePicChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePic(file);
      setProfileData({ ...profileData, photoURL: URL.createObjectURL(file) });
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      let downloadURL = profileData.photoURL;

      // If a new profile picture was selected, upload it to Firebase Storage
      if (profilePic) {
        const storageRef = ref(storage, `profileImages/${user.uid}/${profilePic.name}`);
        await uploadBytes(storageRef, profilePic);
        downloadURL = await getDownloadURL(storageRef);
      }

      // Update Firebase Auth profile with the new name and photo URL
      await updateProfile(user, {
        displayName: profileData.name,
        photoURL: downloadURL,
      });

      // Update Firestore with additional fields (e.g., phone number and photo URL)
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        phone: profileData.phone,
        photoURL: downloadURL,
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
