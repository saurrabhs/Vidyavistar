import React, { useState, useContext } from "react";
import { AuthContext } from "./AuthContext";
import { motion } from "framer-motion";
import axios from "axios";

const defaultProfilePics = [
  "/images/default1.png",
  "/images/default2.png",
  "/images/default3.png",
  "/images/default4.png",
  "/images/default5.png",
];

const academicYears = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
const genderOptions = ["Male", "Female", "Other", "Prefer not to say"];

const ProfilePage = () => {
  const { currentUser, updateProfile } = useContext(AuthContext);
  const [message, setMessage] = useState("");
  const [profileData, setProfileData] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    phone: currentUser?.phone || "",
    birthDate: currentUser?.birthDate || "",
    interests: currentUser?.interests || "",
    profilePicture: currentUser?.profilePicture || defaultProfilePics[0],
    education: currentUser?.education || "",
    skills: currentUser?.skills || "",
    languages: currentUser?.languages || "",
    location: currentUser?.location || "",
    bio: currentUser?.bio || "",
    socialLinks: currentUser?.socialLinks || { linkedin: "", github: "" },
    gender: currentUser?.gender || "",
    academicYear: currentUser?.academicYear || ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setProfileData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setProfileData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handlePicChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("profilePicture", file);

      try {
        const response = await axios.post("http://localhost:4000/api/users/upload-profile-picture", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        setProfileData(prev => ({ ...prev, profilePicture: response.data.profilePicture }));
        setMessage("Profile picture updated successfully!");
      } catch (error) {
        setMessage("Failed to upload profile picture");
      }
    }
  };

  const handleDefaultPicSelect = async (url) => {
    try {
      await axios.post("http://localhost:4000/api/users/update-profile-picture", { profilePicture: url });
      setProfileData(prev => ({ ...prev, profilePicture: url }));
      setMessage("Profile picture updated successfully!");
    } catch (error) {
      setMessage("Failed to update profile picture");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await updateProfile(profileData);
      setMessage("Profile updated successfully!");
    } catch (error) {
      setMessage("Failed to update profile");
    }
  };

  return (
    <div className="bg-[#fdf7ee] dark:bg-gray-900 dark:text-white min-h-screen py-10 transition-colors duration-300">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-[#003049] dark:text-white mb-6 text-center">Profile Settings</h1>
        {message && (
          <div className={`text-center mb-4 p-3 rounded ${
            message.includes("Failed") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
          }`}>
            {message}
          </div>
        )}
        
        <form onSubmit={handleSave} className="space-y-6">
          {/* Profile Picture Section */}
          <div className="flex flex-col items-center mb-8">
            <img
              src={profileData.profilePicture.startsWith("/images") 
                ? profileData.profilePicture 
                : `http://localhost:4000${profileData.profilePicture}`}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover mb-4"
            />
            <input
              type="file"
              onChange={handlePicChange}
              className="mb-4 text-sm"
              accept="image/*"
            />
            <div className="grid grid-cols-5 gap-4 mb-4">
              {defaultProfilePics.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Default ${index + 1}`}
                  className={`w-16 h-16 rounded-full object-cover cursor-pointer border-2 ${
                    profileData.profilePicture === url ? "border-[#ff7b54]" : "border-transparent"
                  }`}
                  onClick={() => handleDefaultPicSelect(url)}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-[#003049] dark:text-white">Basic Information</h2>
              
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={profileData.email}
                  disabled
                  className="w-full p-2 border rounded bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Gender</label>
                <select
                  name="gender"
                  value={profileData.gender}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select Gender</option>
                  {genderOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Birth Date</label>
                <input
                  type="date"
                  name="birthDate"
                  value={profileData.birthDate}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>

            {/* Academic Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-[#003049] dark:text-white">Academic Information</h2>
              
              <div>
                <label className="block text-sm font-medium mb-1">Academic Year</label>
                <select
                  name="academicYear"
                  value={profileData.academicYear}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select Year</option>
                  {academicYears.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Education</label>
                <textarea
                  name="education"
                  value={profileData.education}
                  onChange={handleChange}
                  rows="2"
                  className="w-full p-2 border rounded"
                  placeholder="Your educational background..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Skills</label>
                <textarea
                  name="skills"
                  value={profileData.skills}
                  onChange={handleChange}
                  rows="2"
                  className="w-full p-2 border rounded"
                  placeholder="Your technical skills..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Languages</label>
                <input
                  type="text"
                  name="languages"
                  value={profileData.languages}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  placeholder="Languages you know..."
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4 mt-6">
            <h2 className="text-xl font-semibold text-[#003049] dark:text-white">Additional Information</h2>
            
            <div>
              <label className="block text-sm font-medium mb-1">Bio</label>
              <textarea
                name="bio"
                value={profileData.bio}
                onChange={handleChange}
                rows="3"
                className="w-full p-2 border rounded"
                placeholder="Tell us about yourself..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <input
                type="text"
                name="location"
                value={profileData.location}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="Your city and state..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Interests</label>
              <textarea
                name="interests"
                value={profileData.interests}
                onChange={handleChange}
                rows="2"
                className="w-full p-2 border rounded"
                placeholder="Your interests and hobbies..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">LinkedIn Profile</label>
                <input
                  type="url"
                  name="socialLinks.linkedin"
                  value={profileData.socialLinks.linkedin}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  placeholder="LinkedIn URL..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">GitHub Profile</label>
                <input
                  type="url"
                  name="socialLinks.github"
                  value={profileData.socialLinks.github}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  placeholder="GitHub URL..."
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6">
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
