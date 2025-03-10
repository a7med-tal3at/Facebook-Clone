'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';

import useAvatarModal from '@/app/hooks/useAvatarModal';

import Modal from './Modal';
import ImageUpload from '../inputs/ImageUpload';

const AvatarModal = () => {
  const router = useRouter();
  const avatarModal = useAvatarModal();
  const [isSending, setIsSending] = useState<boolean>(false);
  const { handleSubmit, watch, setValue, reset } = useForm<FieldValues>({
    defaultValues: {
      image: '',
    },
  });

  const image = watch('image');

  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsSending(true);

    axios
      .post('/api/profile/image', data)
      .then(() => {
        toast.success('Profile picture updated');

        reset();

        avatarModal.onClose();

        router.refresh();
      })
      .catch(() => {
        toast.error('Error updating profile picture');
      })
      .finally(() => {
        setIsSending(false);
      });
  };

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <ImageUpload value={image} onChange={(value) => setCustomValue('image', value)} />
    </div>
  );

  return (
    <Modal
      disabled={isSending}
      isOpen={avatarModal.isOpen}
      onClose={avatarModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      actionLabel="Update"
      title="Update Profile Picture"
      subtitle="Show yourself off to the world!"
      body={bodyContent}
    />
  );
};

export default AvatarModal;
