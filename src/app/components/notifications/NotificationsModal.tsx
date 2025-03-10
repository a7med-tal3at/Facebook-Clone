'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

import { Notifications } from '@/app/types';

import useNotificationsModal from '@/app/hooks/useNotificationsModal';
import Notification from './Notification';

interface NotificationsModalProps {
  isOpen: boolean;
  notifications: Notifications | null;
}

const NotificationsModal: React.FC<NotificationsModalProps> = ({ isOpen, notifications }) => {
  const router = useRouter();
  const notificationsModal = useNotificationsModal();
  const modalRef = useRef<HTMLUListElement>(null);
  useEffect(() => {
    if (isOpen) {
      const handleClickOutside = (event: MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
          notificationsModal.onClose();
        }
      };

      document.addEventListener('click', handleClickOutside);
      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    }
  }, [isOpen, notificationsModal]);

  const handleClearAll = async () => {
    await axios
      .post(`/api/notification/clear`)
      .then(() => {
        toast.success('Notifications cleared');

        router.refresh();
      })
      .catch(() => {
        toast.error('Error clearing notifications');
      });
  };

  return (
    <>
      {isOpen && (
        <ul
          ref={modalRef}
          onClick={(e) => e.stopPropagation()}
          className="absolute top-[48px] -right-16 sm:right-0
          flex flex-col gap-2 p-2 w-screen sm:w-[360px]
          bg-white dark:bg-[#242526] text-black dark:text-[#e4e6eb]
          border border-x-0 sm:border-x dark:border-[#393b3d] border-neutral-300
          md:rounded-md shadow-2xl"
        >
          {notifications && notifications.length > 0 ? (
            notifications.map((notification) => (
              <Notification key={notification.id} notification={notification} />
            ))
          ) : (
            <li
              className="p-3 text-center
              border border-neutral-300 dark:border-[#393b3d]
              rounded-md shadow-md"
            >
              No notifications
            </li>
          )}

          {notifications && notifications.length > 0 && (
            <>
              <hr className="border-neutral-300 dark:border-[#393a3b]" />
              <li
                role="button"
                onClick={handleClearAll}
                className="text-sm text-neutral-500 dark:text-neutral-400 hover:underline"
              >
                Clear All
              </li>
            </>
          )}
        </ul>
      )}
    </>
  );
};

export default NotificationsModal;
