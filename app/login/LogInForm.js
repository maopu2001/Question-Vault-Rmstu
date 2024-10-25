'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Button } from '../../components/ui/button';
import { Form } from '../../components/ui/form';
import FormTextField from '../../components/form/FormTextField';
import Link from 'next/link';
import Loading from '../../components/ui/Loading';
import { useEffect, useState } from 'react';
import ForgotPassword from './ForgotPassword';

const FormSchema = z.object({
  usernameEmail: z.string().min(1, { message: 'Please enter your username or email.' }).max(100, {
    message: 'Username length can not be more than 100 characters.',
  }),
  password: z.string().min(2, { message: 'Password must be at least 8 characters long.' }),
});

export default function test() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      usernameEmail: '',
      password: '',
    },
  });

  const usernameEmailData = {
    label: 'Username or Email',
    name: 'usernameEmail',
    placeholder: 'Enter Your Username or Email Here',
    type: 'text',
  };

  const passwordData = {
    label: 'Password',
    name: 'password',
    placeholder: 'Enter your password',
    type: 'password',
  };

  const onSubmit = async (data) => {
    console.log(data);
    setIsLoading(true);
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const error = await res.json();
      setIsLoading(false);
      toast({
        title: 'Login Failed',
        description: error.message,
        className: 'bg-red-500 text-white',
      });
      return;
    }

    setIsLoading(false);
    toast({
      title: 'User Logged In Successfully',
      className: 'bg-green-500 text-white',
    });

    form.reset();
    window.location.href = '/dashboard';
  };

  return (
    <Form {...form}>
      {isLoading && <Loading />}
      <h1 className="text-2xl font-bold pt-3 uppercase">Log In</h1>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-1/2 min-w-96 space-y-2 my-3">
        <FormTextField formControl={form.control} data={usernameEmailData} />
        <FormTextField formControl={form.control} data={passwordData} />
        <Button className="bg-primary-800 hover:bg-primary-600 w-full" type="submit">
          Log In
        </Button>
      </form>
      <ForgotPassword />
      <p className="text-sm">
        New User?{' '}
        <Link href="/signup" className="font-bold">
          Sign Up
        </Link>
      </p>
    </Form>
  );
}
