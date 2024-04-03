"use client";
import { useState, useEffect } from 'react';

export const Heading = () => {
  const [storedInitialData, setStoredInitialDataId] = useState(localStorage.getItem('initialData'));

  // Sử dụng useEffect để cập nhật storedInitialDataId khi dữ liệu thay đổi
  useEffect(() => {
    const updateStoredInitialDataId = () => {
      setStoredInitialDataId(localStorage.getItem('initialData'));
    };

    // Lắng nghe sự thay đổi của dữ liệu
    window.addEventListener('storage', updateStoredInitialDataId);

    // Xóa lắng nghe khi component bị unmounted
    return () => {
      window.removeEventListener('storage', updateStoredInitialDataId);
    };
  }, []); // Chỉ gọi effect này một lần sau khi component được rendered

  return (
    <div>
      <h1>Stored Initial Data: {storedInitialData} </h1>
    </div>
  );
}
