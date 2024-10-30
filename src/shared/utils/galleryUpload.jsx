import React, { useState, useRef } from "react";
import axios from "axios";

const FileUploader = ({
  initialFiles = [],
  onFilesUpload,
  typeOfFilesAllowed = "images/*",
}) => {
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null); // Use ref to access the input
  const [uploadedFiles, setUploadedFiles] = useState(initialFiles); // For uploaded files (URLs)
  const [loading, setLoading] = useState(false);
  // Handle file selection and add them to state
  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files); // Convert FileList to array
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  // Handle file deletion
  const handleDelete = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);

    // Clear the file input field if all files are deleted
    if (updatedFiles.length === 0 && fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  // Handle uploaded file deletion (for existing uploaded files)
  const handleDeleteUploaded = (index) => {
    const updatedUploadedFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(updatedUploadedFiles);

    onFilesUpload(updatedUploadedFiles); // Notify parent of changes
  };

  // Handle form submission or upload logic (stubbed)
  const handleUpload = async () => {
    if (files?.length > 0) {
      const formDataNew = new FormData();
      // Loop through each file and append it separately to FormData
      files.forEach((file) => {
        formDataNew.append("files", file); // Append each file individually
      });
      setLoading(true);
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
          const uploadedUrls = response.data.data;
          setUploadedFiles((prev) => [...prev, ...uploadedUrls]);
          onFilesUpload([...uploadedFiles, ...uploadedUrls]); // Notify parent with updated file URLs
          setFiles([]); // Clear new files

          // Clear file input
          if (fileInputRef.current) {
            fileInputRef.current.value = null;
          }
        }
      } catch (err) {
        console.error("Error uploading file", err);
      } finally {
        setLoading(false); // Set loading to false once the upload is complete
      }
    }
    // Here you can call an API or perform the upload to S3 or another server
  };

  return (
    <div className="file-uploader">
      <input
        ref={fileInputRef} // Set the ref to access the input
        type="file"
        multiple
        accept={typeOfFilesAllowed}
        onChange={handleFileChange}
        className="my-2 p-2"
      />

      {files.length > 0 && (
        <div className="file-list">
          <h3>New Files:</h3>
          <ul className="flex gap-2">
            {files.map((file, index) => (
              <li
                key={index}
                className="border p-3 my-2 flex items-center flex-col gap-2"
              >
                {/* Check if the file is an image, video, or PDF */}
                {file.type.startsWith("image/") ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="h-20 w-20 object-cover rounded"
                  />
                ) : file.type.startsWith("video/") ? (
                  <video
                    controls
                    className="h-20 w-20 object-cover rounded"
                    src={URL.createObjectURL(file)}
                  />
                ) : file.type === "application/pdf" ? (
                  <embed
                    src={URL.createObjectURL(file)}
                    type="application/pdf"
                    className="h-20 w-20 object-cover rounded"
                    title={file.name}
                  />
                ) : null}
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => handleDelete(index)}
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
            disabled={loading} // Disable the button during upload
          >
            {loading ? "Uploading..." : "Upload All Files"}
          </button>
        </div>
      )}
      {/* Display already uploaded files */}
      {uploadedFiles.length > 0 && (
        <div className="uploaded-file-list">
          <h3>Uploaded Files:</h3>
          <ul className="flex gap-2">
            {uploadedFiles.map((fileUrl, index) => (
              <li
                key={index}
                className="border p-3 my-2 flex items-center flex-col gap-2"
              >
                {/* Check if the uploaded file is an image, video, or PDF */}
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
                    title={`uploaded-${index}`}
                  />
                ) : (
                  <img
                    src={fileUrl}
                    alt={`uploaded-${index}`}
                    className="h-20 w-20 object-cover rounded"
                  />
                )}
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

export default FileUploader;
