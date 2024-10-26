'use client';
import Loading from '@/components/ui/Loading';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEffect, useState } from 'react';
import UserInfoTable from './UserInfoTable';
import UserTab from './UserTab';
import QuestionTab from './QuestionTab';
import MyQuestions from '@/components/MyQuestions';

export default function SuperAdminDashboard() {
  const [tab, setTab] = useState('user');

  return (
    <div>
      <h1 className="text-2xl font-bold py-3 text-center w-full h-full">Super Admin Dashboard</h1>
      <Tabs defaultValue="user" className="flex flex-col w-full">
        <TabsList className="w-fit mx-auto bg-primary-200 rounded-xl border-1 shadow-lg *:rounded-xl">
          <TabsTrigger
            className="data-[state=active]:bg-primary-500 data-[state=active]:text-white"
            value="user"
            onClick={() => setTab('user')}
          >
            User List
          </TabsTrigger>
          <TabsTrigger
            className="data-[state=active]:bg-primary-500 data-[state=active]:text-white"
            value="ques"
            onClick={() => setTab('ques')}
          >
            Question List
          </TabsTrigger>
          <TabsTrigger
            className="data-[state=active]:bg-primary-500 data-[state=active]:text-white"
            value="myques"
            onClick={() => setTab('myques')}
          >
            My Questions
          </TabsTrigger>
        </TabsList>
        <TabsContent value="user">
          <UserTab />
        </TabsContent>
        <TabsContent value="ques">
          <QuestionTab />
        </TabsContent>
        <TabsContent value="myques">
          <MyQuestions />
        </TabsContent>
      </Tabs>
    </div>
  );
}
