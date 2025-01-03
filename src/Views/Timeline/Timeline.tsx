import React from "react";
import useFunctions from "../../hooks/useFunctions";
import { getBackgroundClass } from "../../interfaces/MatchData";

const Timeline = () => {
    const { getStatistics, getCurrentInning, getBattingData } = useFunctions();
    return (
        <>
            <div className="flex justify-between items-center border-b pb-2 border-gray-300 border-spacing-2">
                <div className="text-sm flex items-center">
                    <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 ml-2 rounded border border-green-300">
                        {getStatistics?.teamBatting}
                    </span>
                    Timeline
                </div>
            </div>
            <div className="flex mt-5 text-xs text-gray-600 flex-wrap">
                {getBattingData[getCurrentInning]?.timeline?.scoreTimeline?.map(
                    (item, index) => (
                        <div
                            key={index}
                            className={`${getBackgroundClass(
                                item
                            )} rounded-full text-white mr-1 mb-1 w-[30px] h-[30px] flex items-center justify-center`}
                        >
                            <span className="text-[10px] font-medium">{item}</span>
                        </div>
                    )
                )}
            </div>
        </>
    );
};

export default Timeline;
