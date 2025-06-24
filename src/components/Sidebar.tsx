import { usePageStore } from '../store/usePageStore';
import { useLocation, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { buildExpandedState } from '../utils/treeUtils';
import type { Page } from '../store/usePageStore';
import TitleModal from './TitleModal';

type ModalState = {
  mode: 'add' | 'edit' | 'subpage' | null;
  parentId?: string;
  pageId?: string;
  initialTitle?: string;
};

export default function Sidebar() {
  const { pages, addPage, addSubPage, updatePageTitle } = usePageStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [modal, setModal] = useState<ModalState>({ mode: null });
  const [expandedPages, setExpandedPages] = useState<Record<string, boolean>>({});

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
              className={clsx('truncate flex-1', { 'font-semibold': isActive })}
              onClick={() => navigate(`/page/${page.id}`)}
            >
              {page.title}
            </div>
          </div>

          <div className="ml-2 flex gap-1 opacity-0 group-hover:opacity-100">
            <button
              className="text-xs text-gray-500 hover:text-blue-500"
              onClick={() =>
                setModal({ mode: 'edit', pageId: page.id, initialTitle: page.title })
              }
              title="Edit"
            >
              ✏️
            </button>
            <button
              onClick={() => setModal({ mode: 'subpage', parentId: page.id })}
              className="text-xs text-gray-500 hover:text-green-600"
              title="Add Subpage"
            >
              ➕
            </button>
          </div>
        </div>

        {hasChildren && isExpanded && page.children && (
          <div className="ml-4 border-l border-gray-300 pl-2">
            {page.children.map(renderPage)}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-64 bg-gray-100 h-full p-4 border-r overflow-y-auto">
      <h2 className="text-lg font-bold mb-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <img src="/Orbit.png" alt="Orbit Logo" className="h-10 w-auto" />
          <span>Orbit Pages</span>
        </div>
        <button
          className="text-blue-500 text-sm border border-blue-300 rounded px-2 py-0.5 hover:bg-blue-100"
          onClick={() => setModal({ mode: 'add' })}
        >
          + New
        </button>
      </h2>
      <div className="space-y-2">{pages.map(renderPage)}</div>

      {modal.mode && (
        <TitleModal
          open={true}
          title={
            modal.mode === 'edit'
              ? 'Edit Page Title'
              : modal.mode === 'add'
                ? 'New Page Title'
                : 'New Subpage Title'
          }
          initialValue={modal.initialTitle || ''}
          onClose={() => setModal({ mode: null })}
          onSave={(title) => {
            if (modal.mode === 'add') {
              const newId = addPage(title);
              navigate(`/page/${newId}`);
            } else if (modal.mode === 'subpage' && modal.parentId) {
              const newId = addSubPage(modal.parentId, title);
              setExpandedPages((prev) => ({ ...prev, [modal.parentId!]: true }));
              navigate(`/page/${newId}`);
            } else if (modal.mode === 'edit' && modal.pageId) {
              updatePageTitle(modal.pageId, title);
            }
            setModal({ mode: null });
          }}
        />
      )}
    </div>
  );
}
