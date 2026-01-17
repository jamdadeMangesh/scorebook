import { useEffect } from "react";
import { Match, Statistics } from "../interfaces/MatchData";
import { useSelector } from "react-redux";

const useFunctions = () => {
  //get all data
  const getAllData = useSelector((state: any) => state);

  //get all statistics
  const getStatistics: Statistics = useSelector(
    (state: any) => state?.statistics
  );

  //get current inning
  const getCurrentInning = useSelector((state: any) => state.inningNumber);

  console.log("getCurrentInning:", getCurrentInning);

  //get batting data
  const getBattingData = useSelector(
    (state: any) => state.innings[getCurrentInning]?.battingData,
    {
      devModeChecks: { stabilityCheck: "never" },
    }
  );

  //get current inning battingData
  const getCurrentInningData = useSelector(
    (state: any) => state.innings[getCurrentInning]
  );

  //get bowler data
  const getBowlingData = useSelector(
    (state: any) => state.innings[getCurrentInning]?.bowlingData,
    {
      devModeChecks: { stabilityCheck: "never" },
    }
  );

  //get batter id whose on strike
  const getBatsmanOnStrike = () => {
    return getBattingData?.find((value: any) => value.onStrike === true)?.id;
  };

  //get bowler id whose on strike
  const getBowlerOnStrike = () => {
    return getBowlingData.find((value: any) => value.currentBowler === true)
      ?.id;
  };

  //is match started
  const isMatchStarted = useSelector((state: any) => state.isMatchStarted);

  //is match completed
  const isMatchComplted = useSelector((state: any) => state.isMatchComplted);

  //get currentMatchId

  const getCurrntMatchId = useSelector((state: any) => state?.id);

  const isNoBattingdata =
    getBattingData[getCurrentInning]?.battingData?.length === 0;

  const isNoBowligdata =
    getBowlingData[getCurrentInning]?.bowlingData?.length === 0;

  //get current batting team
  const getCurrentBattingTeam = () => {
    return getCurrentInning === "inning1"
      ? getStatistics.teamBatting
      : getStatistics.teamBattingSecond;
  };

  //get current batting team
  const getCurrentBowlingTeam = () => {
    return getCurrentInning === "inning1"
      ? getStatistics.teamBowling
      : getStatistics.teamBowlingSecond;
  };

  return {
    getAllData,
    getStatistics,
    getCurrentInning,
    getBattingData,
    getBowlingData,
    getBatsmanOnStrike,
    getBowlerOnStrike,
    getCurrentInningData,
    isNoBattingdata,
    isNoBowligdata,
    getCurrntMatchId,
    getCurrentBattingTeam,
    getCurrentBowlingTeam,
    isMatchStarted,
    isMatchComplted,
  };
};

export default useFunctions;
