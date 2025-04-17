import React from 'react';
import styled from 'styled-components';



const CustomPagination = ({ currentPage, totalPages, onPageChange}) => {
   const goToPage = (page) => {
      if (page >= 1 && page <= totalPages) {
         onPageChange(page);
      }
   };

   const getPageNumbers = () => {
      const pages = [];
      const windowSize = 4;

      let start = currentPage;
      let end = currentPage + windowSize - 1;

      if (end > totalPages) {
         end = totalPages;
         start = totalPages - windowSize + 1;
         if (start < 1) start = 1;
      }

      for (let i = start; i <= end; i++) {
         pages.push(i);
      }

    
      if (end < totalPages) {
         pages.push('...');
         pages.push(totalPages);
      }

      return pages;
   };




   const pageNumbers = getPageNumbers();

   return (
      <PaginationWrapper>
         <PageButton onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
            ←
         </PageButton>

         {pageNumbers.map((page, index) =>
            page === '...' ? (
               <Ellipsis key={`ellipsis-${index}`}>...</Ellipsis>
            ) : (
               <PageButton
                  key={page}
                  $active={page === currentPage}
                  onClick={() => goToPage(page)}
               >
                  {page}
               </PageButton>
            )
         )}

         <PageButton onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
            →
         </PageButton>
      </PaginationWrapper>
   );
};

export default CustomPagination;



const PaginationWrapper = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
`;

const PageButton = styled.button`
  padding: 8px 12px;
  border: 1px solid #ccc;
  background-color: ${(props) => (props.$active ? '#000' : '#fff')};
  color: ${(props) => (props.$active ? '#fff' : '#000')};
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  border-radius:4px;
  font-size: 14px;
  transition: all 0.2s ease-in-out;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};

  &:hover {
    background-color: ${(props) =>
      props.disabled ? '#fff' : props.$active ? '#000' : '#fff'};
  }
`;

const Ellipsis = styled.span`
  padding: 8px 12px;
  font-size: 14px;
  color: #888;
`;