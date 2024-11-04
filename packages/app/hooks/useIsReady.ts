import { useEffect, useState } from "react";

const useIsReady = () => {
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    setTimeout(() => setIsReady(true), 500);
  }, []);
  return isReady;
};

export default useIsReady;
