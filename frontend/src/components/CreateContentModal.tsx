import React, { useState, useCallback } from 'react';
import { X, Upload, Link2 } from 'lucide-react';
import axios from 'axios';
import { config } from '@/config';
import { redirect } from 'react-router';

const FileUploader = ({
  isModalOpen,
  setModalOpen,
  theme = 'dark', // Add theme prop with default dark
}: {
  isModalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  theme?: 'light' | 'dark';
}) => {
  const [files, setFiles] = useState<
    { name: string; size: number; progress: number }[]
  >([]);
  const [isDragging, setIsDragging] = useState(false);
  const [link, setLink] = useState('');

  // Theme-based color classes
  const themeClasses = {
    modal: {
      dark: 'bg-black/50 backdrop-blur-sm',
      light: 'bg-gray-100/50 backdrop-blur-sm',
    },
    container: {
      dark: 'bg-gray-900 border-gray-800 text-white',
      light: 'bg-white border-gray-200 text-gray-900',
    },
    dropzone: {
      dark: `border-gray-700 ${
        isDragging ? 'border-purple-500 bg-gray-800' : ''
      }`,
      light: `border-gray-300 ${
        isDragging ? 'border-purple-500 bg-gray-50' : ''
      }`,
    },
    fileItem: {
      dark: 'bg-gray-800',
      light: 'bg-gray-100',
    },
    text: {
      dark: 'text-gray-300',
      light: 'text-gray-600',
    },
    progressBg: {
      dark: 'bg-gray-700',
      light: 'bg-gray-200',
    },
  };

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const newFiles = Array.from(e.dataTransfer.files) as File[];
    setFiles((prev) => [
      ...prev,
      ...newFiles.map((file) => ({
        name: file.name,
        size: file.size,
        progress: 0,
      })),
    ]);

    // Simulate upload progress

    newFiles.forEach((file) => {
      simulateUpload(file.name);
    });
  }, []);

  const simulateUpload = (fileName) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setFiles((prev) =>
        prev.map((file) =>
          file.name === fileName
            ? { ...file, progress: Math.min(progress, 100) }
            : file
        )
      );
      if (progress >= 100) clearInterval(interval);
    }, 300);
  };

  const handleFileInput = (e) => {
    const newFiles = Array.from(e.target.files) as File[];
    setFiles((prev) => [
      ...prev,
      ...newFiles.map((file) => ({
        name: file.name,
        size: file.size,
        progress: 0,
        file: file,
      })),
    ]);

    newFiles.forEach((file) => {
      simulateUpload(file.name);
    });
  };

  const removeFile = (fileName) => {
    setFiles((prev) => prev.filter((file) => file.name !== fileName));
  };
  const addContent = async () => {
    try {
      if (link) {
        // Handle link submission
        await axios.post(
          `${config.BACKEND_URL}/user/content`,
          {
            input: link,
            isLink: true,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
      } else if (files.length > 0) {
        console.log(files);
        // Handle file submission
        const formData = new FormData();
        files.forEach((fileObj) => {
          if (fileObj.file) {
            formData.append('files', fileObj.file);
          }
        });
        formData.append('isLink', false);
        console.log(formData);
        await axios.post(`${config.BACKEND_URL}/user/content`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total ?? 1)
            );
            setFiles((prev) => prev.map((file) => ({ ...file, progress })));
          },
        });
      }

      // Handle success
      setModalOpen(false);
      window.location.href = '/dashboard'; // Using window.location instead of redirect
    } catch (error) {
      console.error('Error adding content:', error);
      // Handle error (you might want to show an error message to the user)
    }
  };
  return (
    <div
      className={`
        fixed inset-0 z-50 flex items-center justify-center 
        ${themeClasses.modal[theme]} 
      `}
    >
      <div
        className={`
          w-full max-w-md rounded-xl p-6 border 
          ${themeClasses.container[theme]} 
        `}
      >
        <h2
          className={`
            text-lg font-semibold mb-4 
            ${theme === 'dark' ? 'text-white' : 'text-gray-900'}
          `}
        >
          Upload files
        </h2>

        {/* Drop zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            border-2 border-dashed rounded-xl p-8
            ${themeClasses.dropzone[theme]} ${link ? 'bg-gray-400' : ''}
            transition-colors duration-200
          `}
        >
          <div className="flex flex-col items-center text-center">
            <Upload
              className={`
                w-8 h-8 mb-2 
                ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}
              `}
            />
            <p
              className={`
                text-sm mb-2 
                ${themeClasses.text[theme]}
              `}
            >
              Drag and drop files here, or{' '}
              <label
                className={`
                  ${
                    link
                      ? 'text-black cursor-not-allowed'
                      : 'text-purple-500 hover:text-purple-400 cursor-pointer'
                  }
                  ${theme === 'light' && !link ? 'text-purple-600' : ''}
                `}
              >
                browse
                <input
                  type="file"
                  multiple
                  className="hidden"
                  disabled={!!link}
                  onChange={handleFileInput}
                />
              </label>
            </p>
            <p
              className={`
                text-xs 
                ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}
              `}
            >
              Supports all files up to 50MB
            </p>
          </div>
        </div>

        {/* File list */}
        {!link && files.length > 0 && (
          <div className="mt-4 space-y-3">
            <div
              className={`
                text-sm 
                ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}
              `}
            >
              Uploading files
            </div>
            {files.map((file) => (
              <div
                key={file.name}
                className={`
                  relative rounded-lg p-3 
                  ${themeClasses.fileItem[theme]}
                `}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`
                        w-8 h-8 rounded flex items-center justify-center
                        ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}
                      `}
                    >
                      <Upload
                        className={`
                          w-4 h-4 
                          ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                          }
                        `}
                      />
                    </div>
                    <div>
                      <div
                        className={`
                          text-sm font-medium
                          ${theme === 'dark' ? 'text-white' : 'text-gray-900'}
                        `}
                      >
                        {file.name}
                      </div>
                      <div
                        className={`
                          text-xs 
                          ${
                            theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                          }
                        `}
                      >
                        {(file.size / 1024).toFixed(1)}KB
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(file.name)}
                    className={`
                      text-gray-500 hover:text-gray-300
                      ${theme === 'dark' ? 'hover:text-gray-400' : ''}
                    `}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                {/* Progress bar */}
                <div
                  className={`
                  h-1 rounded-full overflow-hidden 
                  ${themeClasses.progressBg[theme]}
                `}
                >
                  <div
                    className="h-full bg-purple-500 transition-all duration-300"
                    style={{ width: `${file.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Import from link */}

        <div className="mt-4 pt-4 border-t">
          <div
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg border ${
              files.length > 0 ? 'cursor-not-allowed bg-gray-600' : ''
            }`}
          >
            <Link2
              className={`w-4 h-4 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}
            />

            <input
              type="text"
              placeholder="Add link to upload"
              value={link}
              disabled={files.length > 0}
              onChange={(e) => setLink(e.target.value)}
              className={`flex-1 bg-transparent border-none focus:outline-none text-sm ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-900'
              } `}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 flex justify-end space-x-3">
          <button
            className={`px-4 py-2 text-sm ${
              theme === 'dark'
                ? 'text-gray-400 hover:text-white'
                : 'text-gray-600 hover:text-gray-800'
            } transition-colors`}
            onClick={() => setModalOpen(!isModalOpen)}
          >
            Cancel
          </button>
          <button
            onClick={addContent}
            className="px-4 py-2 text-sm bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileUploader;
