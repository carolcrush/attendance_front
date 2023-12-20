import React, { useState, useEffect } from 'react';

// 時刻をフォーマットして返す関数
const getFormattedTime = () => {
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  return `${padZero(month)}/${padZero(day)}　${padZero(hours)}:${padZero(
    minutes,
  )}:${padZero(seconds)}`;
};

// ゼロパディングを行う関数
const padZero = (value: number) => {
  return value < 10 ? `0${value}` : value;
};

export const Time = () => {
  const [currentTime, setCurrentTime] = useState(getFormattedTime);

  // ページが読み込まれたときと1秒ごとに現在時刻を更新
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(getFormattedTime());
    }, 1000);

    // コンポーネントがアンマウントされたときにクリーンアップ
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <h1>{currentTime}</h1>
    </div>
  );
};
