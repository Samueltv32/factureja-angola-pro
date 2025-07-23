
import React from 'react';
import { InvoiceData } from '@/contexts/InvoiceContext';
import { usePagination } from '@/hooks/usePagination';
import PaginationControls from '@/components/PaginationControls';
import ClassicTemplate from './ClassicTemplate';
import ModernTemplate from './ModernTemplate';
import MinimalTemplate from './MinimalTemplate';

interface PaginatedTemplateWrapperProps {
  data: InvoiceData;
  showPagination?: boolean;
}

const PaginatedTemplateWrapper: React.FC<PaginatedTemplateWrapperProps> = ({ 
  data, 
  showPagination = true 
}) => {
  // Calculate items per page based on template
  const getItemsPerPage = (template: string) => {
    switch (template) {
      case 'classic':
        return 12; // Classic template with full A4 layout
      case 'modern':
        return 10; // Modern template with more spacing  
      case 'minimal':
        return 15; // Minimal template is most compact
      default:
        return 12;
    }
  };

  const itemsPerPage = getItemsPerPage(data.selectedTemplate);
  
  const {
    currentPage,
    totalPages,
    hasMultiplePages,
    nextPage,
    prevPage,
    goToPage,
    getCurrentPageItems,
    isFirstPage,
    isLastPage,
    allPages
  } = usePagination(data.items, {
    itemsPerPage,
    reservedSpace: 200
  });

  const renderTemplate = (pageItems: any[], pageNumber: number, isVisible: boolean = true) => {
    const pageData = {
      ...data,
      items: pageItems,
      currentPage: pageNumber,
      totalPages,
      hasMultiplePages
    };

    const commonProps = {
      data: pageData,
      className: `${isVisible ? 'block' : 'hidden print:block'}`
    };

    switch (data.selectedTemplate) {
      case 'classic':
        return <ClassicTemplate key={pageNumber} {...commonProps} />;
      case 'modern':
        return <ModernTemplate key={pageNumber} {...commonProps} />;
      case 'minimal':
        return <MinimalTemplate key={pageNumber} {...commonProps} />;
      default:
        return <ClassicTemplate key={pageNumber} {...commonProps} />;
    }
  };

  return (
    <div className="relative">
      {/* Screen view - show only current page */}
      <div className="screen-view print:hidden">
        <div className="a4-page">
          {renderTemplate(getCurrentPageItems(), currentPage)}
        </div>
      </div>

      {/* Print view - show all pages */}
      <div className="print-view hidden print:block">
        {allPages.map((pageItems, index) => (
          <div key={index} className={`a4-page ${index > 0 ? 'print-page-break' : ''}`}>
            {renderTemplate(pageItems, index + 1)}
          </div>
        ))}
      </div>

      {/* Pagination controls */}
      {showPagination && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPrevPage={prevPage}
          onNextPage={nextPage}
          onGoToPage={goToPage}
          isFirstPage={isFirstPage}
          isLastPage={isLastPage}
          hasMultiplePages={hasMultiplePages}
        />
      )}
    </div>
  );
};

export default PaginatedTemplateWrapper;
