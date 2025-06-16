import React from "react";
import Header from "../../Components/Header/Header";
import Batting from "../Batting/Batting";
import Bowling from "../Bowling/Bowling";
import Extras from "../Extras/Extras";
import Score from "../Score/Score";
import Statistics from "../Statistics/Statistics";
import Wickets from "../Wickets/Wickets";
import useFunctions from "../../hooks/useFunctions";
import Timeline from "../Timeline/Timeline";
import { useDispatch } from "react-redux";
import { switch_inning } from "../../store/Slice/MatchSlice";
import { ToastContainer, toast } from "react-toastify";

const Dashboard = () => {
    const { getStatistics, getCurrentInning, getCurrntMatchId, getBattingData } = useFunctions();
    const dispatch = useDispatch();

    const switchInning = () => {
        if (getStatistics.isFirstInningCompleteed) {
            dispatch(
                switch_inning({
                    matchId: getCurrntMatchId,
                    currentInning: getCurrentInning,
                })
            );
        } else {
            toast.warn("First inning is not completed!", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: false,
                progress: undefined,
                className:
                    "bg-gray-800 text-white text-xs py-2 px-2 min-h-[40px] w-[200px] justify-center",
                icon: false,
            });
        }
    };

    const calculateToWinRuns = () => {
        
        if(getCurrentInning === "inning2") {
            return getStatistics.teamBattingSecond +" needs "+ (getBattingData?.inning1?.score + 1) +" to win in "+ 7*6 + "  balls";
        }
    }

    return (
        <>
            <Header />
            <div className="px-5 py-3">
                <ul className="flex justify-between items-center flex-wrap text-xs font-medium text-center text-gray-500 border-gray-200">
                    <span className="inline-flex">
                        <li className="">
                            <button
                                aria-current="page"
                                className={`${getCurrentInning === "inning1" && "text-blue-600 bg-gray-100"
                                    } inline-block p-2 px-4  rounded-t-lg active`}
                                onClick={switchInning}
                            >
                                Inning 1
                            </button>
                        </li>
                        <li className="">
                            <button
                                className={`${getCurrentInning === "inning2" && "text-blue-600 bg-gray-100"
                                    } inline-block p-2 px-4  rounded-t-lg`}
                                onClick={switchInning}
                            >
                                Inning 2
                            </button>
                        </li>
                    </span>
                    <div className="text-sm -mt-3 text-black">{calculateToWinRuns()}</div>
                </ul>
                <div className="grid grid-cols-5 gap-4">
                    <div className="col-span-3 p-2 border bg-gray-100">
                        <Batting />
                    </div>
                    <div className="col-span-2 p-2 border bg-gray-100">
                        <Bowling />
                    </div>
                </div>

                <div className="grid grid-cols-5 gap-4 mt-4">
                    <div className="col-span-3">
                        <div className="grid grid-cols-3 gap-4">
                            <div className=" p-2 border bg-gray-100">
                                <Score />
                            </div>
                            <div className=" p-2 border bg-gray-100">
                                <Extras />
                            </div>
                            <div className=" p-2 border bg-gray-100">
                                <Wickets />
                            </div>
                        </div>
                        <div className="grid grid-cols gap-4 mt-4">
                            <div className="col-span-1 p-2 border bg-gray-100">
                                <Timeline />
                            </div>
                        </div>
                    </div>
                    <div className="col-span-2 p-2 border bg-gray-100">
                        <Statistics />
                    </div>
                </div>
            </div>
            <ToastContainer
                position="top-center"
                autoClose={4000}
                pauseOnHover={false}
                hideProgressBar={true}
                newestOnTop={false}
                closeOnClick={false}
                closeButton={false}
                className="px-2 py-2 h-[50px]"
            />
        </>
    );
};

export default Dashboard;
