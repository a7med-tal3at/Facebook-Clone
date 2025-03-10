'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';

import usePostModal from '@/app/hooks/usePostModal';

import Modal from './Modal';
import ImageUpload from '../inputs/ImageUpload';

const PostModal = () => {
  const router = useRouter();
  const postModal = usePostModal();
  const [image, setImage] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<FieldValues>({
    defaultValues: {
      content: '',
      postImage: '',
    },
  });

  const postImage = watch('postImage');
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
      .post('/api/post', data)
      .then(() => {
        toast.success('Post created');

        reset();

        postModal.onClose();

        router.refresh();
      })
      .catch(() => {
        toast.error('Error creating post');
      })
      .finally(() => {
        setIsSending(false);
      });
  };

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <textarea
        rows={5}
        disabled={isSending}
        maxLength={240}
        placeholder="What's on your mind?"
        className={`p-4 dark:bg-[#3a3b3c] dark:text-neutral-400
        border dark:border-0 resize-none
        ${
          errors.content
            ? 'border-red-500 focus:border-red-500 placeholder:text-red-500'
            : 'border-neutral-200'
        }`}
        {...register('content', { required: true })}
      ></textarea>
      {image === false ? (
        <button onClick={() => setImage(true)}>Add image</button>
      ) : (
        <ImageUpload value={postImage} onChange={(value) => setCustomValue('postImage', value)} />
      )}
    </div>
  );

  return (
    <Modal
      disabled={isSending}
      isOpen={postModal.isOpen}
      onClose={postModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      actionLabel="Submit"
      title="Create post"
      subtitle="Share your thoughts with your friends."
      body={bodyContent}
    />
  );
};

export default PostModal;
