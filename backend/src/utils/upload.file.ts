import axios from 'axios';

import FormData from 'form-data';
import config from '../config/server.config';

// Function to upload files
export async function upload(file: any): Promise<string> {
  console.log('upload', file);
  try {
    // Step 1: Get the upload URL from Uploadthing
    const uploadSessionResponse = await axios.post(
      'http://localhost:3000/api/uploadthing/fileUploader',
      {
        files: [file.type.split('/')[0]], // e.g., "image", "video", "audio"
      },
      {
        headers: {
          Authorization: `Bearer ${config.UPLOADTHING_TOKEN}`, // Pass the token in the Authorization header
        },
      }
    );

    const { presignedUrl, fileKey } = uploadSessionResponse.data.files[0];

    // Step 2: Upload the file to the presigned URL
    const formData = new FormData();
    formData.append('file', file);

    await axios.post(presignedUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Step 3: Construct and return the file URL
    const fileUrl = `https://uploadthing.com/file/${fileKey}`;
    return fileUrl;
  } catch (error) {
    console.error('Upload failed:', error);
    throw new Error('Failed to upload the file');
  }
}
