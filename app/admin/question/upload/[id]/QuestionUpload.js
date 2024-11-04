'use client';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import React, { useEffect, useReducer, useState } from 'react';
import UploadBox from './UploadBox';
import Loading from '@/components/ui/Loading';
import { Separator } from '@/components/ui/separator';
import PreviewImage from '@/components/PreviewImage';
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';
import DeleteQuestion from './DeleteQuestion';
import convertUSTtoBST from '@/lib/convertUSTtoBST';

export default function QuestionUpload({ id }) {
  const [isLoading, setIsLoading] = useState(true);
  const [totalPage, setTotalPage] = useState(1);
  const [upload, setUpload] = useState(0);
  const [uploadFinished, setUploadFinished] = useState(0);
  const [quesInfo, setQuesInfo] = useState(null);
  const [preview, setPreview] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchQuesInfo = async () => {
      try {
        const res = await fetch(`/api/admin/question/info?id=${id}`);

        if (res.status === 400) {
          const resData = await res.json();
          setIsLoading(false);
          toast({
            title: resData.message,
            className: 'bg-red-500 text-white',
          });
          router.push('/admin/question/info');
        }
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

  const previewImg = (quesId, pageNo) => {
    setPreview({ quesId, pageNo });
  };

  useEffect(() => {
    if (uploadFinished === totalPage && uploadFinished !== 0 && totalPage !== 0) {
      setIsLoading(false);
      setTotalPage(0);
      window.location.reload();
    }
  }, [uploadFinished]);

  return (
    <div className="w-5/6 flex flex-col items-center justify-center gap-2 mx-auto">
      {isLoading && <Loading />}
      {preview && <PreviewImage data={preview} setPreview={setPreview} />}
      <div>
        <h1 className="text-center text-2xl font-bold mb-2">Question's Information</h1>
        <table>
          <tbody>
            {quesInfo &&
              Object.keys(quesInfo).map((item, i) => {
                if (
                  item === 'createdAt' ||
                  item === 'updatedAt' ||
                  item === 'createdBy' ||
                  item === 'fileList' ||
                  item === '_id' ||
                  item === '__v'
                )
                  return null;
                return (
                  <tr key={i}>
                    <td className="capitalize font-semibold pr-2">{item}</td>
                    <td className="w-3 font-semibold">:</td>
                    <td> {quesInfo[item] && quesInfo[item]}</td>
                  </tr>
                );
              })}
            {quesInfo && (
              <React.Fragment>
                <tr>
                  <td className="capitalize font-semibold pr-2" valign="top">
                    Created By
                  </td>
                  <td className="w-3 font-semibold" valign="top">
                    :
                  </td>
                  <td>
                    {' '}
                    {quesInfo.createdBy.name} <br />
                    Department: {quesInfo.createdBy.department} <br />
                    Session: {quesInfo.createdBy.session}
                    <br />
                    Degree: {quesInfo.createdBy.degree}
                  </td>
                </tr>
                <tr>
                  <td className="capitalize font-semibold pr-2" valign="top">
                    Created At
                  </td>
                  <td className="w-3 font-semibold" valign="top">
                    :
                  </td>
                  <td>{convertUSTtoBST(quesInfo?.createdAt)}</td>
                </tr>
                <tr>
                  <td className="capitalize font-semibold pr-2" valign="top">
                    Updated At
                  </td>
                  <td className="w-3 font-semibold" valign="top">
                    :
                  </td>
                  <td>{convertUSTtoBST(quesInfo?.updatedAt)}</td>
                </tr>
              </React.Fragment>
            )}

            {quesInfo && quesInfo.fileList && quesInfo.fileList.length > 0 && (
              <tr>
                <td className="capitalize font-semibold pr-2">Pages</td>
                <td className="w-3 font-semibold">:</td>
                <td>
                  {quesInfo.fileList
                    .sort((x, y) => x.pageNo - y.pageNo) //to sort the fileList in accending order
                    .map((item, i) => {
                      return (
                        <Button
                          className="mx-1 rounded-full bg-primary-500"
                          onClick={() => previewImg(quesInfo._id, item.pageNo)}
                          key={i}
                        >
                          {item.pageNo}
                        </Button>
                      );
                    })}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="w-full flex mt-2">
        <DeleteQuestion quesId={id} />
      </div>
      {quesInfo && (
        <div className="w-full">
          <Separator />
          <h1 className="text-center text-2xl font-bold my-2">
            {quesInfo.fileList.length > 0 && 'Start Editing'}
            {quesInfo.fileList.length === 0 && 'Start Uploading'}
          </h1>
          <Separator />
        </div>
      )}
      <div className="my-2 flex text-xl items-center justify-center gap-2 w-fill">
        <Label htmlFor="select">Total No of Page</Label>
        <Select id="select" onValueChange={setTotalPage} defaultValue={totalPage}>
          <SelectTrigger className="w-36">
            <SelectValue />
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
              key={pageNo}
              setUploadFinished={setUploadFinished}
            />
          );
        })}
      </div>
      {totalPage > 0 && (
        <Button
          onClick={() => {
            setUpload(totalPage);
            setIsLoading(true);
          }}
          className="w-1/2 min-w-[300px] my-2"
        >
          Upload
        </Button>
      )}
    </div>
  );
}
