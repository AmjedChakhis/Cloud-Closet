import React, { useState, useEffect } from "react";
import { getStorage, ref, listAll, getMetadata } from "firebase/storage";

const StorageBar = ({ userId, shouldRerender }) => {
  const [totalStorage, setTotalStorage] = useState(1024 * 1024 * 1024); // Assuming 1GB total storage
  const [usedStorage, setUsedStorage] = useState(0);

  const storage = getStorage();

  const fetchUsedStorage = async () => {
    try {
      const storageRef = ref(storage, userId);
      const listResult = await listAll(storageRef);
      let totalSize = 0;

      for (const itemRef of listResult.items) {
        const metadata = await getMetadata(itemRef);
        totalSize += metadata.size;
      }

      setUsedStorage(totalSize);
    } catch (error) {
      console.error("Error fetching used storage:", error);
    }
  };

  useEffect(() => {
    fetchUsedStorage();
  }, [userId, shouldRerender]);

  const usedPercentage = (usedStorage / totalStorage) * 100;

  return (
    <div className="w-full p-4 bg-gray-800 rounded-lg shadow-md">
      <div className="flex justify-between mb-2   text-white">
        <span className="text-center">
          {(usedStorage / (1024 * 1024)).toFixed(2)} MB used of{" "}
          {(totalStorage / (1024 * 1024 * 1024)).toFixed(2)} GB
        </span>
      </div>
      <div className="relative w-full bg-gray-600 rounded-full h-6 overflow-hidden">
        <div
          className="bg-blue-500 h-full rounded-full transition-width duration-500"
          style={{ width: `${usedPercentage}%` }}
        ></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white text-sm font-semibold">
            {usedPercentage.toFixed(2)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default StorageBar;
