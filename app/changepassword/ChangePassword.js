'use client';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { Form } from '@/components/ui/form';
import Link from 'next/link';
import Loading from '@/components/ui/Loading';
import { useRouter } from 'next/navigation';
import FormTextField from '@/components/form/FormTextField';
import FormSelectField from '@/components/form/FormSelectField';

const FormSchema = z
  .object({
    password: z.string().min(8, { message: 'Password must be at least 8 characters long.' }),
    confirmPassword: z.string().min(1, { message: 'Please confirm your password.' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export default function ChangePassword() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const passwordData = {
    label: 'New Password',
    name: 'password',
    placeholder: 'Enter your new password',
    type: 'password',
  };

  const confirmPasswordData = {
    label: 'Confirm Password',
    name: 'confirmPassword',
    placeholder: 'Re-enter your new password',
    type: 'password',
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/auth/changepassword`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: data.password }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }
      const resData = await res.json();
      setIsLoading(false);
      toast({
        title: 'Password changed successfully',
        className: 'bg-green-500 text-white',
      });
      await fetch('/api/auth/logout');
      window.location.reload();
    } catch (error) {
      setIsLoading(false);
      toast({
        title: 'Failed to change Password',
        description: error.message || error,
        className: 'bg-red-500 text-white',
      });
    }
  };

  return (
    <div className="flex flex-col items-center w-4/5 mx-auto">
      {isLoading && <Loading />}
      <h1 className="text-center font-bold text-2xl py-2">Set Up New Password</h1>

      <Form {...form}>
        {isLoading && <Loading />}
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-1/2 min-w-96 space-y-2 my-3">
          <FormTextField formControl={form.control} data={passwordData} />
          <FormTextField formControl={form.control} data={confirmPasswordData} />
          <Button className="bg-primary-800 hover:bg-primary-600 w-full" type="submit">
            Change Password
          </Button>
        </form>
      </Form>
    </div>
  );
}
