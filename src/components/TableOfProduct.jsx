import React, { useState } from 'react';
import styled from 'styled-components';

const generateData = () =>
   Array.from({ length: 100 }, (_, i) => ({
      key: i.toString(),
      name: `Edward ${i}`,
      age: 32,
      address: `London Park no. ${i}`,
   }));

const TableOfProduct = () => {
   const [data, setData] = useState(generateData());
   const [editingKey, setEditingKey] = useState(null);
   const [editedRow, setEditedRow] = useState({});
   const [currentPage, setCurrentPage] = useState(1);
   const [itemsPerPage, setItemsPerPage] = useState(10);

   const totalPages = Math.ceil(data.length / itemsPerPage);
   const startIdx = (currentPage - 1) * itemsPerPage;
   const currentData = data.slice(startIdx, startIdx + itemsPerPage);

   const isEditing = (record) => record.key === editingKey;

   const edit = (record) => {
      setEditingKey(record.key);
      setEditedRow({ ...record });
   };

   const cancel = () => {
      setEditingKey(null);
      setEditedRow({});
   };

   const save = (key) => {
      const updatedData = data.map((item) =>
         item.key === key ? { ...editedRow } : item
      );
      setData(updatedData);
      setEditingKey(null);
      setEditedRow({});
   };

   const handleChange = (e) => {
      const { name, value } = e.target;
      setEditedRow((prev) => ({ ...prev, [name]: value }));
   };

   const goToPage = (page) => setCurrentPage(page);
   const goToPrevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
   const goToNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

   const renderPagination = () => {
      const visiblePages = [];

      if (totalPages <= 5) {
         for (let i = 1; i <= totalPages; i++) visiblePages.push(i);
      } else {
         visiblePages.push(1);
         if (currentPage > 3) visiblePages.push('...');
         const start = Math.max(2, currentPage - 1);
         const end = Math.min(totalPages - 1, currentPage + 1);
         for (let i = start; i <= end; i++) visiblePages.push(i);
         if (currentPage < totalPages - 2) visiblePages.push('...');
         visiblePages.push(totalPages);
      }

      return visiblePages.map((page, idx) =>
         page === '...' ? (
            <Ellipsis key={`ellipsis-${idx}`}>...</Ellipsis>
         ) : (
            <PageButton key={page} onClick={() => goToPage(page)} active={currentPage === page}>
               {page}
            </PageButton>
         )
      );
   };

   const handlePageSizeChange = (e) => {
      setItemsPerPage(Number(e.target.value));
      setCurrentPage(1); 
   };

   return (
      <Container>
         <StyledTable>
            <thead>
               <tr>
                  <Th width="25%">Prodcut Image</Th>
                  <Th width="15%">Price</Th>
                  <Th width="40%">Category</Th>
                  <Th >Operation</Th>
               </tr>
            </thead>
            <tbody>
               {currentData.map((record) => {
                  const editable = isEditing(record);
                  return (
                     <tr key={record.key}>
                        <Td>
                           {editable ? (
                              <Input name="name" value={editedRow.name} onChange={handleChange} />
                           ) : (
                              record.name
                           )}
                        </Td>
                        <Td>
                           {editable ? (
                              <Input name="age" type="number" value={editedRow.age} onChange={handleChange} />
                           ) : (
                              record.age
                           )}
                        </Td>
                        <Td>
                           {editable ? (
                              <Input name="address" value={editedRow.address} onChange={handleChange} />
                           ) : (
                              record.address
                           )}
                        </Td>
                        <Td>
                           {editable ? (
                              <>
                                 <Button onClick={() => save(record.key)}>Save</Button>
                                 <Button onClick={cancel}>Cancel</Button>
                              </>
                           ) : (
                              <Button onClick={() => edit(record)} disabled={editingKey !== null}>
                                 Edit
                              </Button>
                           )}
                        </Td>
                     </tr>
                  );
               })}
            </tbody>
         </StyledTable>

         <PaginationContainer>
            <NavButton onClick={goToPrevPage} disabled={currentPage === 1}>
               &lt;
            </NavButton>

            {renderPagination()}

            <NavButton onClick={goToNextPage} disabled={currentPage === totalPages}>
               &gt;
            </NavButton>

            <PageSizeSelect value={itemsPerPage} onChange={handlePageSizeChange}>
               {[5, 10, 20, 50].map((size) => (
                  <option key={size} value={size}>
                     {size} / page
                  </option>
               ))}
            </PageSizeSelect>
         </PaginationContainer>
      </Container>
   );
};

export default TableOfProduct;



const Container = styled.div`
  padding: 20px;
  background-color: white;
  color: black;
  font-family: Arial, sans-serif;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 16px;
`;

const Th = styled.th`
  background-color: white;
  color: black;
  border: 2px solid black;
  padding: 8px;
  text-align: left;
  width: ${(props) => props.width || 'auto'};
`;

const Td = styled.td`
  border: 2px solid black;
  padding: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 4px;
  border: 1px solid black;
  background-color: white;
  color: black;
`;

const Button = styled.button`
  margin-right: 6px;
  padding: 4px 10px;
  background-color: black;
  color: white;
  border: none;
  cursor: pointer;

  &:disabled {
    background-color: #ccc;
    color: #666;
    cursor: not-allowed;
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
`;

const PageButton = styled.button`
  padding: 6px 12px;
  border: 1px solid #d9d9d9;
  background-color: ${(props) => (props.active ? '#e6f0ff' : 'white')};
  color: ${(props) => (props.active ? '#1677ff' : '#000')};
  font-weight: ${(props) => (props.active ? 'bold' : 'normal')};
  border-radius: ${(props) => (props.active ? '6px' : '4px')};
  cursor: pointer;

  &:hover {
    background-color: #f2f2f2;
  }
`;

const NavButton = styled(PageButton)`
  font-weight: bold;
`;

const Ellipsis = styled.span`
  padding: 6px 12px;
  color: #888;
  user-select: none;
`;

const PageSizeSelect = styled.select`
  margin-left: 12px;
  padding: 6px;
  border-radius: 6px;
  border: 1px solid #d9d9d9;
  background-color: white;
  cursor: pointer;
  font-size: 14px;
`;
