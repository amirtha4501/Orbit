import type { Page } from "../store/usePageStore";

export const buildExpandedState = (pages: Page[]): Record<string, boolean> => {
  const state: Record<string, boolean> = {};
  const traverse = (nodes: Page[]) => {
    for (const node of nodes) {
      state[node.id] = true;
      if (node.children) traverse(node.children);
    }
  };
  traverse(pages);
  return state;
};