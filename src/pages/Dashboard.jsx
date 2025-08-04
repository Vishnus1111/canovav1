import React from 'react';
import Home from './home/Home';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  return (
    <div className={styles.dashboardContainer}>
      
      <div className={styles.mainContent}>
        <Home />
      </div>
    </div>
  );
};

export default Dashboard;
