import { useEffect } from "react";
import { Match, Statistics } from "../interfaces/MatchData";
import { useSelector } from "react-redux";

const useFunctions = () => {
    //get all statistics
    const getStatistics: Statistics = useSelector(
        (state: any) => state?.statistics
    );

    //get current inning
    const getCurrentInning = useSelector((state: any) => state.inningNumber);

    //get batting data
    const getBattingData = useSelector((state: any) => state.batting, {
        devModeChecks: { stabilityCheck: "never" },
    });

    //get bowler data
    const getBowlingData = useSelector((state: any) => state.bowling, {
        devModeChecks: { stabilityCheck: "never" },
    });

    //get batter id whose on strike
    const getBatsmanOnStrike = () => {
        return getBattingData[getCurrentInning]?.battingData?.find(
            (value: any) => value.onStrike === true
        )?.id;
    };

    //get bowler id whose on strike
    const getBowlerOnStrike = () => {
        return getBowlingData[getCurrentInning]?.bowlingData?.find(
            (value: any) => value.currentBowler === true
        )?.id;
    };

    //get currentInning batting data
    const getCurrentInningBattingData = () => {
        return getBattingData[getCurrentInning]?.battingData;
    };

    //get currentMatchId

    const getCurrntMatchId = useSelector((state: any) => state?.id);

    const isNoBattingdata =
        getBattingData[getCurrentInning]?.battingData?.length === 0;

    return {
        getStatistics,
        getCurrentInning,
        getBattingData,
        getBowlingData,
        getBatsmanOnStrike,
        getBowlerOnStrike,
        getCurrentInningBattingData,
        isNoBattingdata,
        getCurrntMatchId
    };
};

export default useFunctions;
