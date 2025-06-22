import { usePageStore } from '../store/usePageStore';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { buildExpandedState } from '../utils/treeUtils';
import type { Page } from '../store/usePageStore';
import TitleModal from './TitleModal';

export default function Sidebar() {
  const { pages, addPage, addSubPage, updatePageTitle } = usePageStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [expandedPages, setExpandedPages] = useState<Record<string, boolean>>({});
  const [showModalForParent, setShowModalForParent] = useState<string | null>(null);

  useEffect(() => {
    setExpandedPages(buildExpandedState(pages));
  }, [pages]);

  const toggleExpand = (id: string) => {
    setExpandedPages((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const renderPage = (page: Page) => {
    const isActive = location.pathname === `/page/${page.id}`;
    const isExpanded = expandedPages[page.id] ?? true;
    const hasChildren = page.children && page.children.length > 0;

    return (
      <div key={page.id} className="ml-2 space-y-1">
        <div
          className={clsx(
            'group flex items-center justify-between px-2 py-1 hover:bg-blue-100 rounded cursor-pointer',
            isActive && 'bg-blue-200 font-semibold'
          )}
        >
          <div className="flex items-center gap-1 flex-1">
            {hasChildren && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpand(page.id);
                }}
                className="text-gray-500 hover:text-black"
                title={isExpanded ? 'Collapse' : 'Expand'}
              >
                {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
            )}

            <div
              className={clsx('truncate flex-1', isActive && 'font-semibold')}
              onClick={() => navigate(`/page/${page.id}`)}
            >
              {page.title}
            </div>
          </div>

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
              onClick={() => setShowModalForParent(page.id)}
              className="text-xs text-gray-500 hover:text-green-600"
              title="Add Subpage"
            >
              ➕
            </button>
          </div>
          {showModalForParent && (
            <TitleModal
              open={true}
              title="New Subpage Title"
              onClose={() => setShowModalForParent(null)}
              onSave={(title) => {
                const newId = addSubPage(showModalForParent, title);
                setExpandedPages((prev) => ({ ...prev, [showModalForParent]: true }));
                setShowModalForParent(null);
                setTimeout(() => navigate(`/page/${newId}`), 100);
              }}
            />
          )}
        </div>

        {/* Render children if expanded */}
        {hasChildren && isExpanded && page.children && (
          <div className="ml-4 border-l border-gray-300 pl-2">
            {page.children.map(renderPage)}
          </div>
        )}
      </div>
    );
  };

  const handleAdd = () => {
    const title = prompt('Enter new page title:');
    if (title) {
      const newId = addPage(title);
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
