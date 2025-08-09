import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import styles from './Projects.module.css'; // You'll create this
import API_BASE_URL from '../../config';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/projects`)
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching projects:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.content}>
        <h2 className={styles.heading}>Your Projects</h2>
        {loading ? (
          <p className={styles.message}>Loading projects...</p>
        ) : projects.length === 0 ? (
          <p className={styles.message}>No projects found.</p>
        ) : (
          <ul className={styles.projectList}>
            {projects.map((project) => (
              <li key={project._id} className={styles.projectItem}>
                {project.projectName}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Projects;
