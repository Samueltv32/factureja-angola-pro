
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Eye, EyeOff } from 'lucide-react';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPrevPage: () => void;
  onNextPage: () => void;
  onGoToPage: (page: number) => void;
  isFirstPage: boolean;
  isLastPage: boolean;
  hasMultiplePages: boolean;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  onPrevPage,
  onNextPage,
  onGoToPage,
  isFirstPage,
  isLastPage,
  hasMultiplePages
}) => {
  if (!hasMultiplePages) {
    return null;
  }

  return (
    <div className="pagination-controls print-hide">
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onPrevPage}
          disabled={isFirstPage}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <span className="text-sm text-gray-600 px-3">
          Página {currentPage} de {totalPages}
        </span>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onNextPage}
          disabled={isLastPage}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      {totalPages > 2 && (
        <div className="flex items-center space-x-1 mt-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => onGoToPage(page)}
              className="w-8 h-8 p-0"
            >
              {page}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaginationControls;
