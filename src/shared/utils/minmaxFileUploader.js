import React, { useState, useRef } from "react";
import axios from "axios";

const MinMaxFileUploader = ({
  initialFiles = [], // Can be a string or an array
  onFilesUpload,
  typeOfFilesAllowed = "images/*",
  maxFiles = 1,
}) => {
  const [files, setFiles] = useState([]); // Store new files
  const fileInputRef = useRef(null); // Ref to the input field
  const [uploadedFiles, setUploadedFiles] = useState(
    maxFiles === 1 && typeof initialFiles === "string" ? [initialFiles] : initialFiles
  ); // Store uploaded file URLs, converted to array if single
  const [loading, setLoading] = useState(false); // Loading state for API call

  // Handle file selection
  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files); // Convert FileList to array
    setFiles(newFiles); // Set the new selected files
  };

  // Handle deleting newly selected files before upload
  const handleDelete = () => {
    setFiles([]); // Clear selected files

    // Reset the file input value
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  // Handle uploaded file deletion (for already uploaded files)
  const handleDeleteUploaded = (index) => {
    const updatedUploadedFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(updatedUploadedFiles); // Update the uploaded files

    // Notify parent component of changes
    onFilesUpload(maxFiles === 1 ? updatedUploadedFiles[0] : updatedUploadedFiles);

    // Clear the file input after deletion if necessary
    if (updatedUploadedFiles.length === 0 && fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  // Handle file upload
  const handleUpload = async () => {
    if (files.length > 0) {
      const formDataNew = new FormData();
      files.forEach((file) => {
        formDataNew.append("files", file);
      });

      setLoading(true); // Start loading
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_URL}/upload`,
          formDataNew,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response.data.success) {
          const uploadedUrls = response.data.data; // Assume API returns uploaded file URLs
          const updatedUploadedFiles = [...uploadedFiles, ...uploadedUrls];

          // If maxFiles is 1, store as a single string, otherwise store as an array
          if (maxFiles === 1) {
            setUploadedFiles([uploadedUrls[0]]); // Store single file as string
            onFilesUpload(uploadedUrls[0]); // Notify parent with single file URL
          } else {
            setUploadedFiles(updatedUploadedFiles); // Add uploaded files
            onFilesUpload(updatedUploadedFiles); // Notify parent with array of file URLs
          }

          setFiles([]); // Clear the files after successful upload
          fileInputRef.current.value = null; // Reset the file input
        }
      } catch (err) {
        console.error("Error uploading file", err);
      } finally {
        setLoading(false); // Stop loading
      }
    }
  };

  return (
    <div className="file-uploader">
      {/* Input field for file selection */}
      <input
        ref={fileInputRef}
        type="file"
        accept={typeOfFilesAllowed}
        onChange={handleFileChange}
        className="my-2 p-2"
        multiple={maxFiles > 1} // Allow multiple files if maxFiles > 1
      />

      {/* Display selected files (before upload) */}
      {files.length > 0 && (
        <div className="file-list">
          <h3>Selected Files:</h3>
          <ul className="flex gap-2">
            {files.map((file, index) => (
              <li
                key={index}
                className="border p-3 my-2 flex items-center flex-col gap-2"
              >
                {file.type.startsWith("image/") && (
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="h-20 w-20 object-cover rounded"
                  />
                )}
                {/* Show Delete button only before upload */}
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
          <button
            className={`bg-blue-500 text-white px-4 py-2 rounded mt-4 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleUpload}
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload File"}
          </button>
        </div>
      )}

      {/* Display already uploaded files */}
      {uploadedFiles.filter((fileUrl) => fileUrl !== "").length > 0 && (
  <div className="uploaded-file-list">
    <ul className="flex gap-2">
      {uploadedFiles
        .filter((fileUrl) => fileUrl !== "") // Filter out empty strings
        .map((fileUrl, index) => (
          <li
            key={index}
            className="border p-3 my-2 flex items-center flex-col gap-2"
          >
            {fileUrl.endsWith(".mp4") || fileUrl.endsWith(".mov") ? (
              <video
                controls
                className="h-20 w-20 object-cover rounded"
                src={fileUrl}
              />
            ) : fileUrl.endsWith(".pdf") ? (
              <embed
                src={fileUrl}
                type="application/pdf"
                className="h-20 w-20 object-cover rounded"
              />
            ) : (
              <img
                src={fileUrl}
                alt={`uploaded-${index}`}
                className="h-20 w-20 object-cover rounded"
              />
            )}
            {/* Only show Delete button for uploaded files */}
            <button
              className="bg-red-500 text-white px-2 py-1 rounded"
              onClick={() => handleDeleteUploaded(index)}
            >
              Delete
            </button>
          </li>
        ))}
    </ul>
  </div>
)}


    </div>
  );
};

export default MinMaxFileUploader;
