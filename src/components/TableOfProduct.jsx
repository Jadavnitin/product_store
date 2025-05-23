
import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fetchDefaultProducts, deleteProduct, updateProduct } from '../reducers/productSlice';
import Swal from 'sweetalert2';



const TableOfProduct = ({ externalData = [] }) => {
  const dispatch = useDispatch();
  const { items: data,status } = useSelector((state) => state.product);
  const searchWord = useSelector((state) => state.search.searchWord || "");
  
  const [modalOpen, setModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    dispatch(fetchDefaultProducts());
  }, [dispatch]);

  
  useEffect(() => {
    setCurrentPage(1);
  }, [searchWord]);


  const normalizedExternalData = externalData.map((item) => ({
    ...item,
    image: item.image || item.addImage || item.blobUrl || item.images?.[0] || null,
  }));

  const normalizedInternalData = (Array.isArray(data) ? data : []).map((item) => ({
    ...item,
    image: item.image || item.addImage || item.blobUrl || item.images?.[0] || null,
  }));


  const combinedData = [...normalizedInternalData, ...normalizedExternalData];


  const filteredData = combinedData.filter((product) =>
    product?.title?.toLowerCase().includes(searchWord.toLowerCase())
  );


  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const startIdx = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIdx, startIdx + itemsPerPage);

 
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteProduct(id));

        const newFilteredDataLength = filteredData.length - 1;
        const newTotalPages = Math.ceil(newFilteredDataLength / itemsPerPage);
        if (currentPage > newTotalPages) {
          setCurrentPage(newTotalPages > 0 ? newTotalPages : 1);
        }

        Swal.fire("Deleted!", "Your product has been removed.", "success");
      }
    });
  };
  
  
 
  
  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;

    const addPage = (pageNum) => {
      pages.push(
        <PageButton
          key={pageNum}
          onClick={() => setCurrentPage(pageNum)}
          $active={currentPage === pageNum}
        >
          {pageNum}
        </PageButton>
      );
    };

    pages.push(
      <ArrowButton
        key="prev"
        disabled={currentPage === 1}
        onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
      >
        &lt;
      </ArrowButton>
    );

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) addPage(i);
    } else {
      addPage(1);
      if (currentPage > 3) pages.push(<Dots key="dots-start">...</Dots>);
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) addPage(i);
      if (currentPage < totalPages - 2) pages.push(<Dots key="dots-end">...</Dots>);
      addPage(totalPages);
    }

    pages.push(
      <ArrowButton
        key="next"
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
      >
        &gt;
      </ArrowButton>
    );

    return pages;
  };

  const openModal = (product) => {
    setCurrentProduct(product);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentProduct(null);
  };
  const handleSave = () => {
    if (!currentProduct || !currentProduct.id) return;

    dispatch(updateProduct(currentProduct)); 
    setModalOpen(false);
    setCurrentProduct(null);
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentProduct((prev) => ({
          ...prev,
          image: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Container>
      <TableWrapper>
        <div className='table-div'>
        <StyledTable>
          <thead>
            <tr>
              <Th>Image</Th>
              <Th>Title</Th>
              <Th>Category</Th>
              <Th>Price</Th>
              <Th>Action</Th>
            </tr>
          </thead>
          <tbody>
            {status === "loading" ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
                  <Loader />
                </td>
              </tr>
            ) : status === "failed" ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "20px", color: "red" }}>
                  Failed to load products.
                </td>
              </tr>
            ) : currentData.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
                  No Products Found
                </td>
              </tr>
            ) : (
              currentData.map((item) => (
                <tr key={item.id}>
                  <Td>
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        width="50"
                        height="50"
                        style={{ objectFit: "cover", borderRadius: "4px" }}
                      />
                    ) : (
                      <span>No Image</span>
                    )}
                  </Td>
                  <Td>{item.title}</Td>
                  <Td>{item.brand}</Td>
                  <Td>${item.price}</Td>
                  <Td>
                    <Icon type="edit" onClick={() => openModal(item)}>
                      <FontAwesomeIcon icon={faEdit} />
                    </Icon>
                    <Icon type="delete" onClick={() => handleDelete(item.id)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </Icon>
                  </Td>
                </tr>
              ))
            )}
          </tbody>
        </StyledTable>
        </div>
        <Footer>
          <PaginationContainer>{renderPagination()}</PaginationContainer>
          <PageSizeWrapper>
            <span>{itemsPerPage} / page</span>
            <PageSizeSelect
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(+e.target.value);
                setCurrentPage(1);
              }}
            >
              {[5, 10, 20].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </PageSizeSelect>
          </PageSizeWrapper>
        </Footer>
      </TableWrapper>

      {modalOpen && (
        <ModalOverlay>
          <ModalContent>
            <h3>Edit Product</h3>
            <label>Title:</label>
            <input
              value={currentProduct.title}
              onChange={(e) =>
                setCurrentProduct({ ...currentProduct, title: e.target.value })
              }
            />
            <label>Category:</label>
            <input
              value={currentProduct.category || currentProduct.brand}
              onChange={(e) =>
                setCurrentProduct({ ...currentProduct, category: e.target.value })
              }
            />
            <label>Price:</label>
            <input
              type="number"
              value={currentProduct.price}
              onChange={(e) =>
                setCurrentProduct({ ...currentProduct, price: +e.target.value })
              }
            />
            <label>Image:</label>
            <input type="file" onChange={handleImageChange} />
            {currentProduct.image && (
              <div style={{ marginTop: "8px" }}>
                <img src={currentProduct.image} alt="preview" width="100" />
              </div>
            )}
            <ModalActions>
              <Button onClick={handleSave}>Update</Button>
              <Button onClick={closeModal}>Cancel</Button>
            </ModalActions>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default TableOfProduct;



const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  border-radius: 8px;
  max-height:450px;
  overflow-y: scroll;

  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f0f0f0;
    border-radius: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #c0c0c0; 
    border-radius: 8px;
    border: 2px solid #f0f0f0;
  }

 
  -webkit-overflow-scrolling: touch;

  @media (max-width: 633px) {
    padding-bottom: 4px; 
  }

`;



const spin = keyframes`
   0% { transform: rotate(0deg); }
   100% { transform: rotate(360deg); }
`;

const Loader = styled.div`
   border: 4px solid #f3f3f3;
   border-top: 4px solid #000000;
   border-radius: 50%;
   width: 40px;
   height: 40px;
   animation: ${spin} 1s linear infinite;
   margin: auto;
`;



const Container = styled.div`
padding: 20px;
background: white;

`;


const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  
  @media (max-width: 633px) {
    min-width: 633px; 
  }
`;

const Th = styled.th`
   padding: 10px;
   text-align: left;
   border-bottom: 1px solid #ddd;
`;

const Td = styled.td`
   padding: 10px;
   border-bottom: 1px solid #f0f0f0;
`;


const Icon = styled.span`
  margin: 0 0.5rem;
  transition: color 0.3s ease, transform 0.2s ease;
  font-size: 1.2rem;
  color: ${({ type }) => (type === 'edit' ? '#0056b3' : '#c82333')}; 
  
  &:hover {
    cursor: pointer;
    transform: scale(1.1);
  }
`;


const Footer = styled.div`
   display: flex;
   justify-content: space-between;
   align-items: center;
   margin-top: 20px;
   padding-top: 10px;
   border-top: 1px solid #ddd;
   
    @media (max-width: 633px) {
    min-width: 600px; 
  }
`;

const PaginationContainer = styled.div`
   display: flex;
   flex-wrap: wrap;
   gap: 8px;
   align-items: center;
`;

const PageButton = styled.button`
   padding: 8px 14px;
   border: 1px solid ${(props) => (props.$active ? '#1677ff' : '#ccc')};
   background: ${(props) => (props.$active ? '#e6f0ff' : props.$disabled ? '#f5f5f5' : 'white')};
   color: ${(props) => (props.$active ? '#1677ff' : props.$disabled ? '#999' : 'black')};
   border-radius: 6px;
   font-weight: ${(props) => (props.$active ? 'bold' : 'normal')};
   cursor: ${(props) => (props.$disabled ? 'not-allowed' : 'pointer')};
`;

const ArrowButton = styled.button`
   padding: 8px 12px;
   background: white;
   border: 1px solid #ccc;
   color: #666;
   border-radius: 6px;
   cursor: pointer;
   &:disabled {
      color: #ccc;
      cursor: not-allowed;
   }
`;

const Dots = styled.span`
   padding: 8px 10px;
   color: #aaa;
`;

const PageSizeWrapper = styled.div`
   display: flex;
   align-items: center;
   gap: 8px;
   font-weight: 500;
`;

const PageSizeSelect = styled.select`
   padding: 6px 14px;
   border-radius: 6px;
   border: 1px solid #ccc;
   background: white;
   font-weight: 500;
`;

const ModalOverlay = styled.div`
   position: fixed;
   top: 0;
   left: 0;
   width: 100vw;
   height: 100vh;
   background: rgba(0, 0, 0, 0.5);
   display: flex;
   justify-content: center;
   align-items: center;
`;

const ModalContent = styled.div`
   background: white;
   padding: 2rem;
   width: 80%;
   max-width: 500px;
   border-radius: 16px;
   input {
      width: 100%;
      margin: 8px 0 16px;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 6px;
   }
`;

const ModalActions = styled.div`
   display: flex;
   justify-content: space-between;
   margin-top: 20px;
`;

const Button = styled.button`
   padding: 8px 16px;
   background-color: #111;
   color: white;
   border: none;
   border-radius: 6px;
   cursor: pointer;
`;
