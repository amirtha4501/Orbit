import { useEffect, useRef, useState } from 'react';

export default function TitleModal({
  open,
  title = 'Enter Title',
  initialValue = '',
  onClose,
  onSave,
}: {
  open: boolean;
  title?: string;
  initialValue?: string;
  onClose: () => void;
  onSave: (title: string) => void;
}) {
  const [input, setInput] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setInput(initialValue);
      inputRef.current?.focus();
    }
  }, [open, initialValue]);

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input.trim()) onSave(input.trim());
    else if (e.key === 'Escape') onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <div className="bg-white p-4 rounded shadow-md w-80 space-y-3 transform transition-all duration-300 scale-95 opacity-0 animate-fadeIn">
        <h3 className="text-lg font-semibold">{title}</h3>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onKeyDown={handleKey}
          onChange={(e) => setInput(e.target.value)}
          className="border w-full px-2 py-1 rounded"
          placeholder="Title"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1 border rounded text-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={() => input.trim() && onSave(input.trim())}
            disabled={!input.trim()}
            className="px-3 py-1 bg-blue-500 text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
