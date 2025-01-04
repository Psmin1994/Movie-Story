import React from "react";
import styled from "styled-components";
import Modal from "components/ui/Modal";

const PhotoModal = (props) => {
  const { isOpen, closeModal, src, alt } = props;

  return (
    <Modal isOpen={isOpen} closeModal={closeModal}>
      <Wrapper>
        <Photo src={src} alt={alt} />
      </Wrapper>
    </Modal>
  );
};

const Wrapper = styled.div`
  padding: 24px;
`;

const Photo = styled.img`
  width: 776px;
`;

export default PhotoModal;
