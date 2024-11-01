import { createPortal } from 'react-dom';

import ModalWrapper from './ModalWrapper';

import { useModalStore } from 'stores/useModalStore';
import type { ModalName } from 'types/modal';

const ModalRenderer = () => {
  const { closeModal, openedModals } = useModalStore();
  const element = document.getElementById('modal') as Element;

  const renderModal = Object.entries(openedModals).map(([modalName, modal]) => {
    const ModalComponent = modal.component;

    return (
      <ModalWrapper
        key={modalName}
        onClose={() => {
          closeModal(modalName as ModalName);
        }}
      >
        <ModalComponent
          onClose={() => {
            closeModal(modalName as ModalName);
          }}
        />
      </ModalWrapper>
    );
  });

  return createPortal(<>{renderModal}</>, element);
};

export default ModalRenderer;
