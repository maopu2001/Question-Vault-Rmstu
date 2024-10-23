'use client';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEffect, useReducer, useState } from 'react';
import UploadBox from './UploadBox';
import Loading from '@/components/ui/Loading';
import { Separator } from '@/components/ui/separator';

export default function QuestionUpload({ id }) {
  const [isLoading, setIsLoading] = useState(true);
  const [totalPage, setTotalPage] = useState(1);
  const [upload, setUpload] = useState(false);
  const [quesInfo, setQuesInfo] = useState(null);

  useEffect(() => {
    const fetchQuesInfo = async () => {
      try {
        const res = await fetch(`/api/admin/question/info?id=${id}`);
        if (!res.ok) {
          const resData = await res.json();
          throw new Error(resData.message);
        }
        const resData = await res.json();

        setQuesInfo(resData.quesInfo);
        setIsLoading(false);
      } catch (error) {
        console.error(error.message);
        setIsLoading(false);
      }
    };
    fetchQuesInfo();
  }, []);

  return (
    <div className="w-5/6 flex flex-col items-center justify-center gap-2 mx-auto">
      {isLoading && <Loading />}
      <div>
        <h1 className="text-center text-2xl font-bold mb-2">Question's Information</h1>
        <table>
          <tbody>
            {quesInfo &&
              Object.keys(quesInfo).map((item, i) => {
                if (item === 'fileList' || item === '_id' || item === '__v') return null;
                return (
                  <tr key={i}>
                    <td className="capitalize font-semibold pr-2">{item}</td>
                    <td className="w-3 font-semibold">:</td>
                    <td> {quesInfo[item] && quesInfo[item]}</td>
                  </tr>
                );
              })}
            {quesInfo && quesInfo.fileList && quesInfo.fileList.length > 0 && (
              <tr>
                <td className="capitalize font-semibold pr-2">Pages</td>
                <td className="w-3 font-semibold">:</td>
                <td>
                  {quesInfo.fileList.map((item, i) => {
                    if (i === quesInfo.fileList.length - 1) return `${item.pageNo}.`;
                    return `${item.pageNo}, `;
                  })}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {quesInfo && (
        <h1 className="text-center text-2xl font-bold mb-2">
          {quesInfo.fileList.length > 0 && 'Editing...'}
          {quesInfo.fileList.length === 0 && 'Creating...'}
        </h1>
      )}
      <Separator />
      <div className="my-2 flex text-xl items-center justify-center gap-2 w-fill">
        <Label htmlFor="select">Total No of Page</Label>
        <Select id="select" onValueChange={setTotalPage}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Total No of Page" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={1}>1</SelectItem>
            <SelectItem value={2}>2</SelectItem>
            <SelectItem value={3}>3</SelectItem>
            <SelectItem value={4}>4</SelectItem>
            <SelectItem value={5}>5</SelectItem>
            <SelectItem value={6}>6</SelectItem>
            <SelectItem value={7}>7</SelectItem>
            <SelectItem value={8}>8</SelectItem>
            <SelectItem value={9}>9</SelectItem>
            <SelectItem value={10}>10</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Separator />
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
        {Array.from({ length: totalPage }, (_, i) => i + 1).map((pageNo) => {
          return (
            <UploadBox
              pageNo={pageNo}
              upload={upload}
              setUpload={setUpload}
              id={id}
              setQuesInfo={setQuesInfo}
              key={pageNo}
            />
          );
        })}
      </div>
      <Button onClick={() => setUpload(true)} className="w-1/2 min-w-[300px] my-2">
        Upload
      </Button>
    </div>
  );
}
