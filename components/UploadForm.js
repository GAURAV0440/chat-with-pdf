// components/UploadForm.js

import { useState, useRef } from 'react';
import styles from './UploadForm.module.css';

export default function UploadForm() {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (file) => {
    setFile(file);
    setMessage('');
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const removeFile = () => {
    setFile(null);
    setMessage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpload = async () => {
    if (!file) return alert('Please select a file.');

    setIsUploading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('✅ File uploaded and processed successfully!');
        // ✅ Save latest fileId for questions
        if (data.fileId) {
          localStorage.setItem('fileId', data.fileId);
        }
      } else {
        setMessage(`❌ ${data.error || 'Error processing the file.'}`);
      }
    } catch (error) {
      setMessage('❌ Error uploading the file.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.heading}>Upload PDF Document</h2>

      {!file ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`${styles.dropzone} ${dragActive ? styles.dropzoneActive : ''}`}
          onClick={() => fileInputRef.current?.click()}
        >
          <p>📄 Drop your PDF here</p>
          <p style={{ fontSize: '0.9rem', color: '#666' }}>or click to choose a file</p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </div>
      ) : (
        <div className={styles.filePreview}>
          <div>
            <p className={styles.fileInfo}>{file.name}</p>
            <p className={styles.fileSize}>
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
          <button onClick={removeFile} className={styles.removeBtn}>
            ✖ Remove
          </button>
        </div>
      )}

      {file && (
        <button
          onClick={handleUpload}
          disabled={isUploading}
          className={styles.uploadBtn}
        >
          {isUploading ? 'Uploading...' : 'Upload PDF'}
        </button>
      )}

      {message && (
        <p
          className={`${styles.message} ${
            message.startsWith('✅') ? styles.success : styles.error
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
