'use client';

import { FC, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from './ui/button';
import { addFriendValidator } from '@/lib/validations/add-friend';

type FormData = z.infer<typeof addFriendValidator>;

export const AddFriendButton: FC = () => {
  const [showSuccessState, setShowSuccessState] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(addFriendValidator),
  });

  const addFriend = async (email: string) => {
    try {
      const valitedEmail = addFriendValidator.parse({ email });

      await axios.post('/api/friends', { email: valitedEmail });

      setShowSuccessState(true);
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError('email', { message: error.message });
        return;
      }

      if (error instanceof AxiosError) {
        setError('email', { message: error.response?.data });
        return;
      }

      setError('email', { message: 'An error occurred' });
    }
  };

  const onSubmit = ({ email }: FormData) => {
    addFriend(email);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-sm">
      <label htmlFor="email" className="bock text-sm font-medium leading-6 text-gray-900">
        Add a friend by email
      </label>
      <div className="mt-2 flex gap-4">
        <input
          {...register('email')}
          id="email"
          type="text"
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder="you@example.com"
        />
        <Button>Add</Button>
      </div>
    </form>
  );
};
