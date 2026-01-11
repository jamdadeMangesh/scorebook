import { useEffect, useRef } from "react";
import useFunctions from "./useFunctions";
import { notify } from "../Components/Toast/Toast";

const AUTO_SAVE_INTERVAL = 1 * 60 * 1000; // 3 minutes;

const useAutoSaveMatch = () => {
  const { getAllData } = useFunctions();
  const lastSaveRef = useRef<number>(Date.now());

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await fetch("/api/save-match", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ matchData: getAllData }),
        });

        lastSaveRef.current = Date.now();

        notify("Auto-saved match", "success");
      } catch (error) {
        notify("Auto-saved failed", "error");
      }
    }, AUTO_SAVE_INTERVAL);

    return () => clearInterval(interval);
  }, [getAllData]);
};

export default useAutoSaveMatch;
