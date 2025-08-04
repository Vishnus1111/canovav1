import React, { useState } from 'react';
import styles from './Home.module.css';
import CreateModal from '../../components/CreateModal/CreateModal.jsx'; // Adjust the import path as necessary
import Sidebar from '../../components/Sidebar/Sidebar.jsx';
import projecticon from "../../assets/projects.png";
import penicon from "../../assets/pen.png";

function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); // "project" or "form"

  const handleOpenModal = (type) => {
    setModalType(type);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setModalType("");
  };

  return (
    <div className={styles.container}>
      <Sidebar /> {/* Your sidebar component */}
      <div className={`${styles.content} ${modalOpen ? styles.blur : ""}`}>
        <h1 className={styles.heading}>Welcome to CANOVA</h1>
        <hr className={styles.divider} />
        <div className={styles.actions}>
          <button onClick={() => handleOpenModal("project")}><img src={projecticon}></img>
          <span className='head'>Start from scratch</span><span>Create your first Project now</span></button>
          <button onClick={() => handleOpenModal("form")}><img src={penicon}></img>
          <span className='head'>Create form</span><span>Create your First Form now</span></button>
        </div>
        <div className={styles.recentWorks}>

        </div>
        {/* Recent and Shared Works */}
      </div>
      {modalOpen && (
        <CreateModal type={modalType} onClose={handleCloseModal} />
      )}
    </div>
  );
}

export default Home;
