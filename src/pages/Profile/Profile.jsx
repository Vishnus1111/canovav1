import React, { useState } from 'react';
import ProfileSidebar from '../../components/ProfileSidebar/ProfileSidebar';
import styles from './Profile.module.css';

const Profile = () => {
  const [user, setUser] = useState({
    name: "Vishnu S",
    email: "vishnu@gmail.com",
    mobile: "",
    location: ""
  });

  const [isEditingMobile, setIsEditingMobile] = useState(false);
  const [isEditingLocation, setIsEditingLocation] = useState(false);

  const handleMobileChange = (e) => {
    setUser({ ...user, mobile: e.target.value });
  };

  const handleLocationChange = (e) => {
    setUser({ ...user, location: e.target.value });
  };

  return (
    <div className={styles.profile}>
      {/* Sidebar - ✅ pass user as prop */}
      <ProfileSidebar user={user} />

      {/* Profile Content */}
      <div className={styles.profileContent}>
        <h2>My Profile</h2>

        {/* Profile Header */}
        <div className={styles.profileHeader}>
          <div className={styles.avatar}>
            {user.name.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* Profile Info */}
        <div className={styles.infoContainer}>
          {/* Name */}
          <div className={styles.infoRow}>
            <span className={styles.label}>Name</span>
            <span className={styles.value}>{user.name}</span>
          </div>
          <hr className={styles.divider} />

          {/* Email */}
          <div className={styles.infoRow}>
            <span className={styles.label}>Email</span>
            <span className={styles.value}>{user.email}</span>
          </div>
          <hr className={styles.divider} />

          {/* Mobile */}
          <div className={styles.infoRow}>
            <span className={styles.label}>Mobile</span>
            {isEditingMobile ? (
              <input
                type="text"
                value={user.mobile}
                onChange={handleMobileChange}
                onBlur={() => setIsEditingMobile(false)}
                autoFocus
                className={styles.inputField}
              />
            ) : (
              <span
                className={`${styles.value} ${styles.editable}`}
                onDoubleClick={() => setIsEditingMobile(true)}
              >
                {user.mobile || "Double-click to add"}
              </span>
            )}
          </div>
          <hr className={styles.divider} />

          {/* Location */}
          <div className={styles.infoRow}>
            <span className={styles.label}>Location</span>
            {isEditingLocation ? (
              <input
                type="text"
                value={user.location}
                onChange={handleLocationChange}
                onBlur={() => setIsEditingLocation(false)}
                autoFocus
                className={styles.inputField}
              />
            ) : (
              <span
                className={`${styles.value} ${styles.editable}`}
                onDoubleClick={() => setIsEditingLocation(true)}
              >
                {user.location || "Double-click to add"}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
