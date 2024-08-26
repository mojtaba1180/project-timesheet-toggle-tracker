import React from "react";

import { formatDate } from "../utils/format-date";

interface TimeEntry {
  Description: string;
  StartDate: string;
  StartTime: string;
  EndDate: string;
  EndTime: string;
  Duration: string;
  IsBillable: boolean;
  ProjectName: string;
  TagNames: string[];
}

const secondsToTime = (secs: number): string => {
  const hours = Math.floor(secs / 3600);
  const minutes = Math.floor((secs % 3600) / 60);
  const seconds = secs % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0",
  )}:${String(seconds).padStart(2, "0")}`;
};

const timeToSeconds = (time: string): number => {
  const [hours, minutes, seconds] = time.split(":").map(Number);
  return hours * 3600 + minutes * 60 + seconds;
};

const groupDataByDate = (data: TimeEntry[]): { [key: string]: TimeEntry[] } => {
  return data.reduce((acc, item) => {
    if (!acc[item.StartDate]) {
      acc[item.StartDate] = [];
    }
    acc[item.StartDate].push(item);
    return acc;
  }, {} as { [key: string]: TimeEntry[] });
};

const calculateTotalTime = (groupedData: {
  [key: string]: TimeEntry[];
}): { [key: string]: number } => {
  const totalTimes: { [key: string]: number } = {};
  for (const [date, items] of Object.entries(groupedData)) {
    const totalSeconds = items.reduce(
      (total, item) => total + timeToSeconds(item.Duration),
      0,
    );
    totalTimes[date] = totalSeconds;
  }
  return totalTimes;
};

const TimeTrackingTable: React.FC<{
  TimeEntries: TimeEntry[];
}> = ({ TimeEntries }) => {
  const data: TimeEntry[] = TimeEntries;
  const groupedData = groupDataByDate(data);
  const totalTimes = calculateTotalTime(groupedData);

  const totalDays = Object.keys(groupedData).length;
  const totalDuration = Object.values(totalTimes).reduce(
    (total, time) => total + time,
    0,
  );

  return (
    <div className='container mx-auto p-8'>
      <h1 className='text-3xl font-bold mb-5'>Salmej Time Sheet</h1>
      <div className='grid grid-cols-2 my-3 bg-red-300 text-2xl'>
        <div className='px-4 py-2 font-bold'>
          مجموع کارکرد ماه: {totalDays} روز
        </div>
        <div className='px-4 py-2 font-bold'>
          مجموع زمان ماه: {secondsToTime(totalDuration)} ساعت
        </div>
      </div>

      <table className='table-auto w-full bg-white rounded-lg shadow-md'>
        <thead className='bg-gray-200 sticky'>
          <tr className='sticky top-0 bg-white shadow-sm border-b'>
            <th className='px-4 py-2'>تاریخ</th>
            <th className='px-4 py-2'>مجموع زمان روز</th>
            <th className='px-4 py-2'>توضیحات</th>
            <th className='px-4 py-2'>زمان شروع</th>
            <th className='px-4 py-2'>زمان پایان</th>
            <th className='px-4 py-2'>پروژه</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(groupedData).map(([date, items]) => (
            <React.Fragment key={date}>
              <tr className='bg-gray-100'>
                <td className='px-4 py-2 font-bold'>{formatDate(date)}</td>
                <td className='px-4 py-2 font-bold'>
                  {secondsToTime(totalTimes[date])}
                </td>
                <td colSpan={4}></td>
              </tr>
              {items.map((item, index) => (
                <tr key={index} className='bg-white border-b'>
                  <td className='px-4 py-2'></td>
                  <td className='px-4 py-2'></td>
                  <td className='px-4 py-2'>{item.Description}</td>
                  <td className='px-4 py-2'>{item.StartTime}</td>
                  <td className='px-4 py-2'>{item.EndTime}</td>
                  <td className='px-4 py-2'>{item.ProjectName}</td>
                </tr>
              ))}
            </React.Fragment>
          ))}
          <tr className='bg-gray-100'>
            <td className='px-4 py-2 font-bold'>Total Days: {totalDays}</td>
            <td className='px-4 py-2 font-bold'>
              Total Time: {secondsToTime(totalDuration)}
            </td>
            <td colSpan={4}></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default TimeTrackingTable;
