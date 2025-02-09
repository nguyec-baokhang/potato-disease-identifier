import React, { useState, useCallback } from 'react';

export default function UploadFile(){
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState('');
    const [prediction,setPrediction] = useState('')
    
  
    const handleDrag = useCallback((e) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === 'dragenter' || e.type === 'dragover') {
        setIsDragging(true);
      } else if (e.type === 'dragleave') {
        setIsDragging(false);
      }
    }, []);
  
    const handleDrop = useCallback((e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
  
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
    }, []);
  
    const handleFileInput = useCallback((e) => {
        const selectedFile = e.target.files[0]; 
        if (selectedFile) {
          setFile(selectedFile);

          if (selectedFile.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
              setPreview(reader.result);
            };
            reader.readAsDataURL(selectedFile);
          } else {
            setPreview('');
          }

        }
    }, []);
  
    const removeFile = useCallback(() => {
        setFile(null);
        setPreview(null);   
    }, []);

    const handleSubmit = async () => {
        if (!file) {
          setUploadStatus('Please select a file first');
          return;
        }
    
        try {
          setIsUploading(true);
          setUploadStatus('Uploading...');
    
          const formData = new FormData();
          formData.append('file', file); 
    
          const response = await fetch('http://13.210.228.174:80/predict', { 
            method: 'POST',
            body: formData,
            headers: {
              'Accept': 'application/json',
            }
          });
    
          if (!response.ok) {
            throw new Error(`Upload failed with status: ${response.status}`);
          }
    
          const data = await response.json();
          setPrediction(data);
          setUploadStatus('Analysis complete!');
          
        } catch (error) {
          console.error('Prediction error:', error);
          setUploadStatus(`Analysis failed: ${error.message}`);
        } finally {
          setIsUploading(false);
        }
      };

  
    return (
      <div className="w-full max-w-2xl mx-auto p-4">
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${isDragging 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
            }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => document.getElementById('fileInput').click()}
        >
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileInput}
          />
          
          {preview ? (
          <div className="mb-4">
            <img 
              src={preview} 
              alt="Preview" 
              className="max-h-48 mx-auto rounded-lg"
            />
          </div>
            ) : (
            <svg 
                className="w-12 h-12 mx-auto mb-4 text-gray-400"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
            >
                <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
            </svg>
            )}
          
          <div className="space-y-2">
            <p className="text-lg font-medium text-gray-700">
              Drop files here or click to upload
            </p>
            <p className="text-sm text-gray-500">
              Support for jpg files
            </p>
          </div>
        </div>
  
    
        {file && (
        <div className="mt-6 space-y-2">
            <p className="font-medium text-gray-700">Uploaded Files:</p>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">{file.name}</span>
                    <span className="text-xs text-gray-400">
                    ({(file.size / 1024).toFixed(2)} KB)
                    </span>
                </div>
                <button
                    onClick={(e) => {
                    e.stopPropagation();
                    removeFile();
                    }}
                    className="text-sm text-red-500 hover:text-red-700"
                >
                    Remove
                </button>
            </div>

            <div className="mt-4">
            <button
              onClick={handleSubmit}
              disabled={isUploading}
              className={`w-full py-2 px-4 rounded-lg text-white font-medium
                ${isUploading 
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-blue-500 hover:bg-blue-600'
                }`}
            >
              {isUploading ? 'Analyzing...' : 'Analyze Leaf'}
            </button>
            
            {uploadStatus && (
              <p className={`mt-2 text-sm ${
                uploadStatus.includes('failed') 
                  ? 'text-red-500' 
                  : uploadStatus.includes('successful') 
                    ? 'text-green-500' 
                    : 'text-gray-500'
              }`}>
                {uploadStatus}
              </p>
            )}

            {prediction && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-medium text-gray-700 mb-2">Analysis Result:</h3>
              <div className="bg-white p-4 rounded border">
                <p className="text-lg font-medium text-gray-800">
                  Condition: <span className="text-blue-600">{prediction.class}</span>
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Confidence: {(prediction.confidence * 100).toFixed(2)}%
                </p>
              </div>
            </div>
            )}      
            
          </div>
            
        </div>
        )}
      </div>
    );
};
