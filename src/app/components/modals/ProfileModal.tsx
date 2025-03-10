'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';

import useProfileModal from '@/app/hooks/useProfileModal';

import Modal from './Modal';
import Input from '../inputs/Input';

enum STEPS {
  INFO,
  BIO,
}

const ProfileModal = () => {
  const router = useRouter();
  const profileModal = useProfileModal();
  const [isSending, setIsSending] = useState<boolean>(false);
  const [step, setStep] = useState<STEPS>(STEPS.INFO);
  const [formData, setFormData] = useState<FieldValues>({
    location: '',
    job: '',
    education: '',
    bio: '',
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      location: '',
      job: '',
      education: '',
      bio: '',
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsSending(true);
    axios
      .post('/api/profile/update', data)
      .then(() => {
        toast.success('Profile updated!');
        reset();
        profileModal.onClose();
        router.refresh();
      })
      .catch(() => {
        toast.error('Error updating profile');
      })
      .finally(() => {
        setIsSending(false);
      });
  };

  let bodyContent = (
    <div className="flex flex-col gap-4">
      <Input
        id="location"
        label="Location"
        register={register}
        errors={errors}
        disabled={isSending}
        required
      />
      <Input
        id="job"
        label="Job"
        register={register}
        errors={errors}
        disabled={isSending}
        required
      />
      <Input
        id="education"
        label="Education"
        type="education"
        register={register}
        errors={errors}
        disabled={isSending}
        required
      />
    </div>
  );

  if (step === STEPS.BIO) {
    bodyContent = (
      <textarea
        rows={5}
        placeholder={errors.bio ? 'Bio required...' : 'Bio'}
        className={`p-4 w-full resize-none dark:bg-[#3a3b3c]
        dark:text-neutral-400 border rounded-md 
        ${
          errors.bio
            ? 'border-red-500 focus:border-red-500 placeholder:text-red-500'
            : 'border-neutral-200 dark:border-0'
        }`}
        {...register('bio', { required: true })}
      ></textarea>
    );
  }

  const saveData = (data: FieldValues) => {
    setFormData((prevData) => {
      const updatedData = {
        ...prevData,
        ...data,
      };

      handleNext(updatedData);

      return updatedData;
    });
  };

  const handleNext = (data: FieldValues) => {
    if (step === STEPS.BIO) {
      onSubmit(data);

      setStep(STEPS.INFO);
    } else {
      setStep((s) => s + 1);
    }
  };

  return (
    <Modal
      disabled={isSending}
      isOpen={profileModal.isOpen}
      onClose={profileModal.onClose}
      onSubmit={handleSubmit(saveData)}
      actionLabel={`${step === STEPS.BIO ? 'Save changes' : 'Next'}`}
      title="Edit Profile"
      subtitle="Update your profile information"
      body={bodyContent}
    />
  );
};

export default ProfileModal;
