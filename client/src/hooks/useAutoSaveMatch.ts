import { useEffect, useRef } from "react";
import useFunctions from "./useFunctions";
import { notify } from "../Components/Toast/Toast";

const AUTO_SAVE_INTERVAL = 1 * 60 * 1000; // 3 minutes;

const useAutoSaveMatch = () => {
  const { getAllData, isMatchStarted } = useFunctions();
  const lastSaveRef = useRef<number>(Date.now());
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        if (isMatchStarted) {
          await fetch("/api/save-match", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ matchData: getAllData }),
          });

          lastSaveRef.current = Date.now();

          notify("Auto-saved match", "success");
        } else {
          notify("Please start match to auto save", "warn");
        }
      } catch (error) {
        notify("Auto-saved failed", "error");
      }
    }, AUTO_SAVE_INTERVAL);

    return () => clearInterval(interval);
  }, [getAllData, isMatchStarted]);
};

export default useAutoSaveMatch;
