import React from "react";
import styled from "styled-components";
import Portal from "components/ui/Portal";
import PhotoModal from "./PhotoModal";
import useModal from "hooks/useModal";

const StillCutItem = (props) => {
  const { src, alt } = props;

  const { isOpen, openModal, closeModal } = useModal();

  return (
    <>
      <ItemWrapper onClick={openModal}>
        <StillCut key={src} src={src} alt={alt} />
      </ItemWrapper>
      <Portal>
        <PhotoModal isOpen={isOpen} closeModal={closeModal} src={src} alt={alt}></PhotoModal>
      </Portal>
    </>
  );
};

const ItemWrapper = styled.div`
  text-align: center;
`;

const StillCut = styled.img`
  margin: 0 auto;
  width: 316px;
  height: 222px;

  border-radius: 10px;
  object-fit: cover;
`;

export default StillCutItem;
