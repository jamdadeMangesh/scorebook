import React from "react";
import { PiDotFill } from "react-icons/pi";
import useFunctions from "../../hooks/useFunctions";
import { calculateOvers } from "../../interfaces/MatchData";

const Statistics = () => {
    const { getCurrentInning, getBattingData, getBowlingData } =
		useFunctions();

    const currentInningScore = getBattingData[getCurrentInning]?.score;
    const totalWickets = getBattingData[getCurrentInning]?.wickets;
    const overs = getBattingData[getCurrentInning]?.overs;
    const totalOvers: any = calculateOvers(overs);

    console.log('getBowlingData;', getBowlingData);

    const getMaximumRunsBatsman = () => {
        const moreRunsData = getBattingData[getCurrentInning]?.battingData?.reduce((maxBatsman, batsman) => {
            return batsman.runs > maxBatsman.runs ? batsman : maxBatsman;
         }, {runs : 0});

         return { 
            batsman: moreRunsData?.batsmanName,
            runs: moreRunsData?.runs
         }
    }

    const getMaximumWicketsBowler = () => {
        const moreWicketsData = getBowlingData[getCurrentInning]?.bowlingData?.reduce((maxWickets, bowler) => {
            return bowler.wicket > maxWickets.wicket ? bowler : maxWickets;
         }, {wicket : 0});

         return { 
            bowler: moreWicketsData?.bowlerName,
            wickets: moreWicketsData?.wicket
         }
    }

    console.log('bowler data;', getMaximumWicketsBowler());
    return (
        <>
            <div className="flex justify-between items-center border-b pb-2 border-gray-300 border-spacing-2">
                <div className="text-sm flex items-center">Statistics</div>
            </div>

            <div className="flex mt-4 gap-4 flex-wrap">
                <div className="mb-1 text-xs text-gray-600 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800">
                    <div className="px-3 py-2 bg-gray-200 border-b border-gray-200 rounded-t-lg dark:border-gray-600 dark:bg-gray-700">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                            Score
                        </h3>
                    </div>
                    <div className="px-3 py-2">
                        <p className=" flex items-center">
                            Score: {currentInningScore}/{totalWickets}{" "}
                            <span>
                                <PiDotFill />
                            </span>{" "}
                            {totalOvers} overs
                        </p>
                    </div>
                </div>
                <div className="mb-1 text-xs text-gray-600 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800">
                    <div className="px-3 py-2 bg-gray-200 border-b border-gray-200 rounded-t-lg dark:border-gray-600 dark:bg-gray-700">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                            Most Runs
                        </h3>
                    </div>
                    <div className="px-3 py-2">
                        <p>
                            {getMaximumRunsBatsman().batsman} :{" "}
                            <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-green-300 border border-green-300">
                                {getMaximumRunsBatsman().runs} Runs
                            </span>
                        </p>
                    </div>
                </div>
                <div className="mb-1 text-xs text-gray-600 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800">
                    <div className="px-3 py-2 bg-gray-200 border-b border-gray-200 rounded-t-lg dark:border-gray-600 dark:bg-gray-700">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                            Most Wickets
                        </h3>
                    </div>
                    <div className="px-3 py-2">
                        <p>
                            {getMaximumWicketsBowler().bowler} :{" "}
                            <span className="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-red-300 border border-red-300">
                                {getMaximumWicketsBowler().wickets} wickets
                            </span>
                        </p>
                    </div>
                </div>
                <div className="mb-1 text-xs text-gray-600 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800">
                    <div className="px-3 py-2 bg-gray-200 border-b border-gray-200 rounded-t-lg dark:border-gray-600 dark:bg-gray-700">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                            Most Catches
                        </h3>
                    </div>
                    <div className="px-3 py-2">
                        <p>
                            Mangesh Jamdade :{" "}
                            <span className="bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-yellow-300 border border-yellow-300">
                                3 Catches
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Statistics;
