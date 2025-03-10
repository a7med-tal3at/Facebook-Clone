'use client';

import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { signIn } from 'next-auth/react';
import { SubmitHandler, useForm, FieldValues } from 'react-hook-form';
import { toast } from 'react-hot-toast';

import useSignupModal from '../hooks/useSignupModal';
import { UserContext } from '../providers/UserProvider';
import setTheme from '../lib/theme';

import Button from '../components/common/Button';
import Input from '../components/inputs/Input';

const LoginClient = () => {
  useEffect(() => {
    setTheme();
  }, []);

  const { setUser } = useContext(UserContext);

  useEffect(() => {
    setUser({
      id: '',
      name: '',
      image: '',
    });
  }, [setUser]);

  const router = useRouter();

  const signupModal = useSignupModal();

  const [isSending, setIsSending] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (isSending) return;

    setIsSending(true);

    signIn('credentials', {
      ...data,
      redirect: false,
    })
      .then((res) => {
        if (res?.ok && !res?.error) {
          toast.success('Logged in successfully');

          router.refresh();
        } else {
          toast.error(res?.error || 'An error occurred');
        }
      })
      .finally(() => {
        setIsSending(false);
      });
  };

  const handleGuestLogin = async () => {
    if (isSending) return;

    setIsSending(true);

    signIn('credentials', {
      email: 'guest@mail.com',
      password: 'guest',
      redirect: false,
    })
      .then((res) => {
        if (res?.ok && !res?.error) {
          toast.success('Logged in successfully');

          router.refresh();
        } else {
          toast.error(res?.error || 'An error occurred');
        }
      })
      .finally(() => {
        setIsSending(false);
      });
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 xl:px-20">
      <div className="flex flex-col h-screen pt-6 md:pt-36 dark:bg-[#18191a]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:max-w-[1024px] mx-auto">
          <div className="flex flex-col items-center md:items-start md:pr-8">
            <h1 className="font-bold text-6xl md:pt-16 text-[#1a77f2]">facebook</h1>
            <p className="text-center md:text-start md:text-2xl">
              Connect with friends and the world around you on Facebook.
            </p>
          </div>

          <div
            className="flex flex-col gap-4 w-full max-w-[400px]
            p-4 mx-auto mt-8 md:mt-0 bg-white dark:bg-[#242526]
            shadow-xl rounded-xl"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <Input
                label="Email"
                id="email"
                type="email"
                register={register}
                disabled={isSending}
                errors={errors}
                required
              />
              <Input
                label="Password"
                type="password"
                id="password"
                errors={errors}
                register={register}
                disabled={isSending}
                required
              />
              <Button disabled={isSending} label="Log In" submit />
            </form>

            <hr className="dark:border-[#393a3b]" />

            <Button label="Create New Account" onClick={signupModal.onOpen} secondary />

            <button
              onClick={handleGuestLogin}
              className="bg-transparent text-neutral-500 dark:text-neutral-400 hover:underline"
            >
              Sign in as Guest
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginClient;
