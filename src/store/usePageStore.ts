import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

export type Page = {
  id: string;
  title: string;
  children?: Page[];
};

type PageStore = {
  pages: Page[];
  addPage: (title: string) => void;
  addSubPage: (parentId: string, title: string) => void;
  updatePageTitle: (id: string, title: string) => void;
};


export const usePageStore = create<PageStore>((set) => ({
  pages: [
    {
      id: '1',
      title: 'Getting Started',
    },
    {
      id: '2',
      title: 'Projects',
      children: [
        { id: '2-1', title: 'Project A' },
        { id: '2-2', title: 'Project B' },
      ],
    },
    {
      id: '3',
      title: 'Ideas',
    },
  ],
  addPage: (title: string) => {
    const id = uuidv4();
    set((state) => ({
      pages: [
        ...state.pages,
        {
          id,
          title,
        },
      ],
    }));
    return id;
  },
  updatePageTitle: (id, newTitle) =>
    set((state) => ({
      pages: state.pages.map((page) =>
        page.id === id
          ? { ...page, title: newTitle }
          : {
            ...page,
            children: page.children?.map((child) =>
              child.id === id ? { ...child, title: newTitle } : child
            ),
          }
      ),
    })),
  addSubPage: (parentId: string, title: string) => {
    const id = uuidv4();
    const newPage: Page = { id, title };

    const recursiveAdd = (pages: Page[]): Page[] =>
      pages.map((page) => {
        if (page.id === parentId) {
          return {
            ...page,
            children: [...(page.children || []), newPage],
          };
        }
        if (page.children) {
          return {
            ...page,
            children: recursiveAdd(page.children),
          };
        }
        return page;
      });

    set((state) => ({
      pages: recursiveAdd(state.pages),
    }));

    return id;
  },
}));
