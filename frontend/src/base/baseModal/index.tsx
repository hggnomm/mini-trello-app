import type { ReactNode } from "react";
import Modal from "react-modal";
import { cn } from "../../utils/cn";
import "../../style/modal.scss";

type BaseModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  overlayClassName?: string;
  closeTimeoutMS?: number;
};

const BaseModal = ({
  isOpen,
  onClose,
  children,
  className,
  overlayClassName,
  closeTimeoutMS = 150,
}: BaseModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      overlayClassName={cn("app-modal__overlay", overlayClassName)}
      className={cn("app-modal__content", className)}
      closeTimeoutMS={closeTimeoutMS}
    >
      {children}
    </Modal>
  );
};

export default BaseModal;
