'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';

import useCoverModal from '@/app/hooks/useCoverModal';

import Modal from './Modal';
import ImageUpload from '../inputs/ImageUpload';

const CoverModal = () => {
  const router = useRouter();
  const coverModal = useCoverModal();
  const [isSending, setIsSending] = useState<boolean>(false);
  const { handleSubmit, watch, setValue, reset } = useForm<FieldValues>({
    defaultValues: {
      cover: '',
    },
  });

  const cover = watch('cover');

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
      .post('/api/profile/cover', data)
      .then(() => {
        toast.success('Cover updated');

        reset();

        coverModal.onClose();

        router.refresh();
      })
      .catch(() => {
        toast.error('Error updating cover image');
      })
      .finally(() => {
        setIsSending(false);
      });
  };

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <ImageUpload value={cover} onChange={(value) => setCustomValue('cover', value)} />
    </div>
  );

  return (
    <Modal
      disabled={isSending}
      isOpen={coverModal.isOpen}
      onClose={coverModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      actionLabel="Update"
      title="Update Cover Photo"
      subtitle="Customize your profile with a cover photo that fits you."
      body={bodyContent}
    />
  );
};

export default CoverModal;
