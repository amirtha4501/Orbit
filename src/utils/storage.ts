export function savePageContent(id: string, html: string) {
  localStorage.setItem(`doc-page-${id}`, html);
}

export function loadPageContent(id: string): string {
  return localStorage.getItem(`doc-page-${id}`) || '';
}
