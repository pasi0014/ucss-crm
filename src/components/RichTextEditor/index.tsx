import { Button } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface WysiwygEditorProps {
  initialContent: string;
  onSave: (content: string) => void;
}

const RichTextEditor: React.FC<WysiwygEditorProps> = ({ initialContent, onSave }) => {
  const [content, setContent] = useState<any>(null);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    onSave(newContent);
  };

  useEffect(() => {
    if (initialContent) {
      setContent(initialContent);
    }
  }, [initialContent]);

  return (
    <div className="w-full h-full">
      <ReactQuill value={content} onChange={handleContentChange} style={{ maxHeight: '100%' }} />
    </div>
  );
};

export default RichTextEditor;
