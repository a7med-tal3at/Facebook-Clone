'use client';

import { useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';

import useThemeModal from '@/app/hooks/useThemeModal';

import Modal from './Modal';
import setTheme from '@/app/lib/theme';

const ThemeModal = () => {
  const themeModal = useThemeModal();
  const themeRef = useRef<string | null>(null);
  useEffect(() => {
    themeRef.current = localStorage.getItem('theme');
  }, []);

  const { register, handleSubmit } = useForm<FieldValues>({
    defaultValues: {
      theme: themeRef.current || 'auto',
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    if (data.theme === 'light') {
      toast.success('Theme set to light');
      localStorage.setItem('theme', 'light');
    } else if (data.theme === 'dark') {
      toast.success('Theme set to dark');
      localStorage.setItem('theme', 'dark');
    } else if (data.theme === 'auto') {
      toast.success('Theme set to automatic');
      localStorage.removeItem('theme');
    }

    themeModal.onClose();
    setTheme();
  };

  const bodyContent = (
    <div className="grid grid-cols-2 gap-4 text-neutral-500 dark:text-neutral-400">
      <label className="" htmlFor="light">
        Light:
      </label>
      <input type="radio" className="w-10" id="light" {...register('theme')} value="light" />

      <label className="" htmlFor="dark">
        Dark:
      </label>
      <input type="radio" className="w-10" id="dark" {...register('theme')} value="dark" />

      <label className="" htmlFor="auto">
        Automatic:
      </label>
      <input type="radio" className="w-10" id="auto" {...register('theme')} value="auto" />
    </div>
  );

  return (
    <Modal
      isOpen={themeModal.isOpen}
      onClose={themeModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      actionLabel="Update theme"
      title="Theme"
      subtitle="Customize your experience"
      body={bodyContent}
    />
  );
};

export default ThemeModal;
