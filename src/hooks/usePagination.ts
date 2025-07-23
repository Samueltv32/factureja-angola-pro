
import { useState, useEffect, useCallback } from 'react';
import { InvoiceItem } from '@/contexts/InvoiceContext';

interface PaginationOptions {
  itemsPerPage: number;
  reservedSpace: number; // Space reserved for header, footer, etc.
}

export const usePagination = (items: InvoiceItem[], options: PaginationOptions) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pages, setPages] = useState<InvoiceItem[][]>([]);

  const createPages = useCallback(() => {
    if (!items.length) {
      setPages([]);
      return;
    }

    const itemsPerPage = options.itemsPerPage;
    const newPages: InvoiceItem[][] = [];
    
    for (let i = 0; i < items.length; i += itemsPerPage) {
      const pageItems = items.slice(i, i + itemsPerPage);
      newPages.push(pageItems);
    }

    setPages(newPages);
    
    // Reset to first page if current page doesn't exist
    if (currentPage > newPages.length) {
      setCurrentPage(1);
    }
  }, [items, options.itemsPerPage, currentPage]);

  useEffect(() => {
    createPages();
  }, [createPages]);

  const totalPages = pages.length;
  const hasMultiplePages = totalPages > 1;

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getCurrentPageItems = () => {
    return pages[currentPage - 1] || [];
  };

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  return {
    currentPage,
    totalPages,
    hasMultiplePages,
    nextPage,
    prevPage,
    goToPage,
    getCurrentPageItems,
    isFirstPage,
    isLastPage,
    allPages: pages
  };
};
