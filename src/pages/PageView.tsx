import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Editor from '../components/Editor';
import { loadPageContent, savePageContent } from '../utils/storage';

export default function PageView() {
  const { id } = useParams();
  const [content, setContent] = useState('');

  // Load from localStorage
  useEffect(() => {
    if (id) {
      const stored = loadPageContent(id);
      setContent(stored || `<p>Start writing for page ${id}...</p>`);
    }
  }, [id]);

  // Save to localStorage when content changes
  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    if (id) savePageContent(id, newContent);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-700">Editing Page {id}</h1>
      <Editor content={content} onChange={handleContentChange} />
      <div className="text-sm text-gray-500">Changes are saved locally.</div>
    </div>
  );
}
