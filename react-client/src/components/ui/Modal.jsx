// Modal.jsx
import styled from "styled-components";

const Modal = ({ isOpen, closeModal, onCloseItem = null, children }) => {
  // 만약 isOpen이 false이면 null을 반환하여 모달을 렌더링하지 않음
  return (
    isOpen && (
      <ModalWrapper
        onClick={() => {
          closeModal();
          onCloseItem && onCloseItem();
        }}
        className="modal-overlay">
        <ModalBox onClick={(e) => e.stopPropagation()} className="modal">
          {children}
        </ModalBox>
      </ModalWrapper>
    )
  );
};

const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);

  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalBox = styled.div`
  position: relative;
  border-radius: 8px;
  background: white;
`;

export default Modal;
