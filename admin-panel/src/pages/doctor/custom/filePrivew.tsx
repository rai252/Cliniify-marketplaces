import React from 'react';
import { FaFilePdf, FaFileWord, FaFileImage, FaFile, FaEye, FaDownload } from 'react-icons/fa';
import { Badge } from '@/components/ui/badge';

interface FilePreviewProps {
  url: string;
  title: string;
  downloadName: string;
}

export const FilePreview: React.FC<FilePreviewProps> = ({ url, title, downloadName }) => {
  const fileType: string = url.split('.').pop()?.toLowerCase() || '';

  const getFileIcon = () => {
    switch (fileType) {
      case 'pdf': return <FaFilePdf className="text-red-500 text-4xl" />;
      case 'doc':
      case 'docx': return <FaFileWord className="text-blue-500 text-4xl" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif': return <FaFileImage className="text-green-500 text-4xl" />;
      default: return <FaFile className="text-gray-500 text-4xl" />;
    }
  };

  if (!url) {
    return (
      <div className="bg-gray-100 h-[100px] rounded-lg p-4 flex flex-col items-center justify-center">
        <h4 className="text-sm font-bold text-gray-700 mb-1">{title}</h4>
        <FaFile className="text-gray-400 text-4xl mb-2" />
        <Badge className="bg-red-600 rounded-md">
          File Not Uploaded
        </Badge>
      </div>
    );
  }

  return (
    <div className="bg-white h-[100px] rounded-md border border-md p-2">
      <h4 className="text-md font-bold text-gray-700 mb-2">{title}</h4>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {getFileIcon()}
          <span className="text-sm text-gray-500">{fileType.toUpperCase()}</span>
        </div>
        <div className="flex space-x-2">
          <a
            target='blank'
            href={url}
            download={downloadName}
            className="text-blue-500 hover:bg-green-100 p-2 rounded-full transition-colors"
            title="Download"
          >
            <FaEye />
          </a>
          <a
            target='blank'
            href={url}
            download={downloadName}
            className="text-green-500 hover:bg-green-100 p-2 rounded-full transition-colors"
            title="Download"
          >
            <FaDownload />
          </a>
        </div>
      </div>
    </div>
  );
};