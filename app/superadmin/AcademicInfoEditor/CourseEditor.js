'use client';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import FormSelectField from '@/components/form/FormSelectField';
import FormTextField from '@/components/form/FormTextField';

const FormSchema = z.object({
  degree: z.string().min(1, { message: 'Please select a degree type.' }),
  semester: z.string().min(1, { message: 'Please select a semester.' }),
  faculty: z.string().min(1, { message: 'Please select a faculty.' }),
  department: z.string().min(1, { message: 'Please select a department.' }),
  courseCode: z.string().min(1, { message: 'Please enter a course code.' }),
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
});

export default function CourseEditor() {
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      degree: '',
      semester: '',
      faculty: '',
      department: '',
      batch: '',
      courseCode: '',
    },
  });

  const degrees = ['Bachelors', 'Masters', 'Ph.D'];

  const degreeData = {
    label: 'Degree Type',
    name: 'degree',
    placeholder: 'Select a degree type',
    arr: degrees,
  };

  return (
    <div>
      <h1 className="text-center font-bold text-2xl py-2">Academic Information Editor</h1>
      <Form {...form}>
        <FormSelectField data={degreeData} formControl={form.control} name="degree" label="Degree" />
        {/* <FormSelectField formControl={form.control} name="semester" label="Semester" />
        <FormSelectField formControl={form.control} name="faculty" label="Faculty" />
        <FormSelectField formControl={form.control} name="department" label="Department" />
        <FormTextField formControl={form.control} name="batch" label="Batch" />
        <FormTextField formControl={form.control} name="courseCode" label="Course Code" /> */}
        <Button type="submit" className="w-full mt-4">
          Save
        </Button>
      </Form>
    </div>
  );
}
