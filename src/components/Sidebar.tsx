import { usePageStore } from '../store/usePageStore';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { useState } from 'react';

export default function Sidebar() {
  const { pages, addPage, addSubPage, updatePageTitle } = usePageStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');

  const renderPage = (page: any) => {
    const isActive = location.pathname === `/page/${page.id}`;
    return (
      <div key={page.id} className="ml-2 space-y-1">
        {editingId === page.id ? (
          <input
            type="text"
            className="px-2 py-1 border rounded w-full text-sm"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onBlur={() => {
              updatePageTitle(page.id, newTitle);
              setEditingId(null);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                updatePageTitle(page.id, newTitle);
                setEditingId(null);
              }
            }}
            autoFocus
          />
        ) : (
          <div
            className={clsx(
              'group flex items-center justify-between px-4 py-1 hover:bg-blue-100 rounded cursor-pointer',
              isActive && 'bg-blue-200 font-semibold'
            )}
          >
            <Link to={`/page/${page.id}`} className="flex-1 truncate">
              {page.title}
            </Link>
            <div className="ml-2 flex gap-1 opacity-0 group-hover:opacity-100">
              <button
                className="text-xs text-gray-500 hover:text-blue-500"
                onClick={() => {
                  setEditingId(page.id);
                  setNewTitle(page.title);
                }}
                title="Edit"
              >
                ✏️
              </button>
              <button
                className="text-xs text-gray-500 hover:text-green-600"
                onClick={() => {
                  const title = prompt('Subpage title?');
                  if (title) {
                    addSubPage(page.id, title);
                  }
                }}
                title="Add Subpage"
              >
                ➕
              </button>
            </div>
          </div>
        )}
        {page.children?.map(renderPage)}
      </div>
    );
  };


  const handleAdd = () => {
    const title = prompt('Enter new page title:');
    if (title) {
      const newId = crypto.randomUUID();
      addPage(title);
      setTimeout(() => {
        navigate(`/page/${newId}`);
      }, 100);
    }
  };

  return (
    <div className="w-64 bg-gray-100 h-full p-4 border-r overflow-y-auto">
      <h2 className="text-lg font-bold mb-4 flex justify-between items-center">
        Pages
        <button
          className="text-blue-500 text-sm border border-blue-300 rounded px-2 py-0.5 hover:bg-blue-100"
          onClick={handleAdd}
        >
          + New
        </button>
      </h2>
      <div className="space-y-2">{pages.map(renderPage)}</div>
    </div>
  );
}
