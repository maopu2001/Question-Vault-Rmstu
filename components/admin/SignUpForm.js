'use client';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Form } from '../ui/form';
import FormSelectField from '../form/FormSelectField';
import FormTextField from '../form/FormTextField';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import Loading from '../Loading';
import { useRouter } from 'next/navigation';

const FormSchema = z
  .object({
    name: z.string().min(1, { message: 'Please enter your full name.' }),
    username: z
      .string()
      .min(1, { message: 'Please enter a username.' })
      .max(100, {
        message: 'Username length can not be more than 100 characters.',
      })
      .regex(/^[a-z0-9_@]+$/, {
        message: 'Username can only contain lowercase letters, numbers, @ and underscores',
      }),
    email: z
      .string()
      .email({ message: 'Invalid email address.' })
      .min(1, { message: 'Please enter an email address.' }),
    degree: z.string().min(1, { message: 'Please select a degree type.' }),
    faculty: z.string().min(1, { message: 'Please select a faculty.' }),
    department: z.string().min(1, { message: 'Please select a department.' }),
    session: z
      .string()
      .min(1, { message: 'Please enter a session.' })
      .regex(/^\d{4}-\d{4}$/, { message: 'Session must be in the format YYYY-YYYY (e.g., 2020-2021).' })
      .refine(
        (val) => {
          const [year1, year2] = val.split('-').map(Number);
          return year2 === year1 + 1;
        },
        { message: 'The second year must be exactly one year after the first year.' }
      )
      .refine(
        (val) => {
          const [year1] = val.split('-').map(Number);
          return year1 >= 2015;
        },
        { message: 'Session cannot be before 2015-2016.' }
      )
      .refine(
        (val) => {
          const [year1] = val.split('-').map(Number);
          return year1 <= new Date().getFullYear();
        },
        { message: 'Session cannot be after the curernt year.' }
      ),
    password: z.string().min(8, { message: 'Password must be at least 8 characters long.' }),
    confirmPassword: z.string().min(1, { message: 'Please confirm your password.' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

const degrees = ['Bachelors', 'Masters', 'Ph.D'];

const faculties = ['Faculty of Engineering', 'Faculty of Biological Science', 'Faculty of Business Administration'];

const departments = {
  'Faculty of Engineering': ['Computer Science and Engineering'],
  'Faculty of Biological Science': ['Forestry and Environmental Science', 'Fisharies and Marine Resources Technology'],
  'Faculty of Business Administration': ['Management', 'Tourism and Hospitality Management'],
};

export default function SignUpForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [availableDepartments, setAvailableDepartments] = useState([]);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      username: '',
      email: '',
      degree: '',
      faculty: '',
      department: '',
      session: '',
      password: '',
      confirmPassword: '',
    },
  });

  const watchFaculty = form.watch('faculty');

  useEffect(() => {
    if (watchFaculty && departments[watchFaculty]) setAvailableDepartments(departments[watchFaculty]);
    else setAvailableDepartments([]);
  }, [watchFaculty]);

  const nameData = {
    label: 'Full Name',
    name: 'name',
    placeholder: 'Enter Your Full Name Here',
    type: 'text',
  };

  const usernameData = {
    label: 'Username',
    name: 'username',
    placeholder: 'Enter Your Username Here',
    type: 'text',
  };

  const emailData = {
    label: 'Email',
    name: 'email',
    placeholder: 'Enter Your Email Here',
    type: 'text',
  };

  const degreeData = {
    label: 'Degree Type',
    name: 'degree',
    placeholder: 'Select a degree type',
    arr: degrees,
  };

  const facultyData = {
    label: 'Faculty',
    name: 'faculty',
    placeholder: 'Select a faculty',
    arr: faculties,
  };

  const departmentData = {
    label: 'Department',
    name: 'department',
    placeholder: 'Select a department',
    arr: availableDepartments,
  };

  const sessionData = {
    label: 'Session',
    name: 'session',
    placeholder: 'Enter session (e.g., 2020-2021)',
    type: 'text',
  };

  const passwordData = {
    label: 'Password',
    name: 'password',
    placeholder: 'Enter your password',
    type: 'password',
  };

  const confirmPasswordData = {
    label: 'Confirm Password',
    name: 'confirmPassword',
    placeholder: 'Re-enter your password',
    type: 'password',
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    const res = await fetch('/api/admin/signup', {
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
        title: 'Signup Failed',
        description: error.message,
        className: 'bg-red-500 text-white',
      });
      return;
    }

    setIsLoading(false);
    toast({
      title: 'User Created Successfully',
      className: 'bg-green-500 text-white',
    });
    form.reset();
    router.push('/login');
  };

  return (
    <Form {...form}>
      {isLoading && <Loading />}
      <h1 className="text-2xl font-bold pt-3 uppercase">Sign Up</h1>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-1/2 min-w-96 space-y-2 my-3">
        <FormTextField formControl={form.control} data={nameData} />
        <FormTextField formControl={form.control} data={usernameData} />
        <FormTextField formControl={form.control} data={emailData} />
        <FormSelectField formControl={form.control} data={degreeData} />
        <FormSelectField formControl={form.control} data={facultyData} />
        <FormSelectField formControl={form.control} data={departmentData} />
        <FormTextField formControl={form.control} data={sessionData} />
        <FormTextField formControl={form.control} data={passwordData} />
        <FormTextField formControl={form.control} data={confirmPasswordData} />
        <Button className="bg-primary-800 hover:bg-primary-600 w-full" type="submit">
          Sign Up
        </Button>
      </form>
      <p className="text-sm">
        Already have an account?{' '}
        <Link href="/login" className="font-bold">
          Log In
        </Link>
      </p>
    </Form>
  );
}
