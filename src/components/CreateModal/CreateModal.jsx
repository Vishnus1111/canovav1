import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { formAPI } from '../../services/api';
import styles from './CreateModal.module.css';

function CreateModal({ type, onClose }) {
  const [projectName, setProjectName] = useState('');
  const [formName, setFormName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    // Validation
    if (!formName.trim()) {
      toast.error('Form name is required!');
      return;
    }

    if (type === 'project' && !projectName.trim()) {
      toast.error('Project name is required!');
      return;
    }

    setIsLoading(true);

    try {
      // Get user ID from localStorage (you might store it differently)
      const userId = localStorage.getItem('userId') || localStorage.getItem('user_id');
      
      // Prepare form data for backend
      const formData = {
        projectName: type === 'project' ? projectName.trim() : 'Default Project',
        formName: formName.trim(),
        type: type || 'form',
        pages: [
          {
            id: '1',
            title: 'Page 1',
            blocks: []
          }
        ], // Start with one empty page
        conditions: {},
        userId: userId || null // Handle case where user might not be logged in
      };

      console.log('Sending form data:', formData); // For debugging

      // Call backend API to create form
      const response = await formAPI.createForm(formData);
      
      toast.success(`${type === 'project' ? 'Project' : 'Form'} created successfully!`);
      
      // Close modal
      onClose();

      // Navigate to form page with the link returned from backend
      // Extract the link ID from the response (e.g., "/form/project-name-abc123" -> "project-name-abc123")
      const linkId = response.link.replace('/form/', '');
      
      navigate(`/form/${linkId}`, {
        state: {
          projectName: formData.projectName,
          formName: formData.formName,
          type: formData.type,
          isNewForm: true
        }
      });

    } catch (error) {
      console.error('Error creating form:', error);
      
      // Better error handling
      let errorMessage = 'Failed to create form. Please try again.';
      
      if (error.error) {
        errorMessage = error.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className={styles.overlay}>
        <div className={styles.modal}>
          <div className={styles.header}>
            <img src={require("../../assets/others/createprojectcubesmall.png")} className={styles.icon} alt="icon" />
            <span onClick={onClose} className={styles.close}>×</span>
          </div>
          <h3>Create {type === 'project' ? 'Project' : 'Form'}</h3>
          <p>Provide your {type} name and start with your journey</p>

          {type === 'project' && (
            <>
              <h6>Name</h6>
              <input
                type="text"
                placeholder="Project Name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className={styles.input}
              />
            </>
          )}

          <h6>Name</h6>
          <input
            type="text"
            placeholder="Form Name"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            className={styles.input}
          />

          <button 
            className={styles.createBtn} 
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? 'Creating...' : 'Create'}
          </button>
        </div>
      </div>
    </>
  );
}

export default CreateModal;
