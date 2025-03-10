'use client';

import { useEffect, useState } from 'react';

import Button from '../common/Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  disabled?: boolean;
  actionLabel: string;
  title: string;
  subtitle: string;
  body: React.ReactNode;
  footer?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  actionLabel,
  disabled,
  title,
  subtitle,
  body,
  footer,
}) => {
  const [showModal, setShowModal] = useState(isOpen);

  useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div role="dialog" onClick={onClose} className="fixed z-50 w-screen h-screen bg-gray-500/50">
      <div
        onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
        className={`flex flex-col pb-4 mx-auto sm:mt-24
        h-screen w-screen sm:max-w-[400px] sm:h-min 
        bg-white dark:bg-[#242526] 
        sm:rounded shadow-xl duration-300
        ${showModal ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}
      >
        <div
          className="flex justify-between px-4 py-3
          border-b border-neutral-300 dark:border-[#393b3d]"
        >
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold text-black dark:text-[#e4e6eb]">{title}</h1>
            <h2 className="text-neutral-500 dark:text-neutral-400">{subtitle}</h2>
          </div>

          <button
            onClick={onClose}
            className="mb-auto text-4xl text-neutral-500 dark:text-neutral-400"
          >
            ×
          </button>
        </div>
        <div className="p-4">{body}</div>
        <div>{footer}</div>
        <Button label={actionLabel} disabled={disabled} onClick={onSubmit} secondary />
      </div>
    </div>
  );
};

export default Modal;
