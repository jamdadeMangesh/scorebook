import React, { useState } from "react";
import Button from "../../Components/Button/Button";
import { FaCircleCheck } from "react-icons/fa6";
import { PiDotFill } from "react-icons/pi";
import { BattingData } from "../../interfaces/MatchData";
import { nanoid } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { add_batsman, switch_strike } from "../../store/Slice/MatchSlice";
import useFunctions from "../../hooks/useFunctions";

const Batting = () => {
    const [batterName, setBatterName] = useState("");
    const dispatch = useDispatch();

    const { getStatistics, getCurrentInning, getBattingData } = useFunctions();
    // const battingAllData = useSelector((state: any) => state.batting, {
    //     devModeChecks: { stabilityCheck: "never" },
    // });

    //const currentInningId = allState.find((values) => values.firstInning ? values.id : null);
    //const currentInningId = Object.fromEntries(allState).filter((value: any) => value.entries ? value.id : null);
    //console.log('currentInningId:', currentInningId?.id);

    const getCurrentInningBattingData = () => {
        return getBattingData[getCurrentInning]?.battingData
        // return getCurrentInning === "inning1"
        //     ? getBattingData?.inning1
        //     : getBattingData?.inning2;
        // if (getCurrentInning === "Inning1") {
        //     return getBattingData?.inning1
        // }
        // else {
        //     return getBattingData?.inning2
        // }
    };

    const addBatsman = () => {
        //console.log('battername:', batterName);

        const batterInfo: BattingData = {
            id: nanoid(),
            batsmanName: batterName,
            runs: 0,
            balls: 0,
            fours: 0,
            sixes: 0,
            eights: 0,
            strikeRate: 0,
            out: "-",
            bowler: "-",
            onStrike:
                getCurrentInningBattingData()?.length === 0 ? true : false,
        };
        //console.log("BatterInfo:", batterInfo);
        // const battingExtras: Extras = {
        //     wides: 0,
        //     noBalls: 0,
        //     byes: 0,
        //     legByes: 0
        // }
        dispatch(
            add_batsman({ currentInning: getCurrentInning, batsmanData: batterInfo })
        );
        setBatterName("");
    };

    const changeStrike = (batterId: string) => {
        //currentInning
        dispatch(
            switch_strike({ currentInning: getCurrentInning, batterId: batterId })
        );
    };

    return (
        <>
            <div className="flex justify-between items-center border-b pb-2 border-gray-300 border-spacing-2">
                <div className="text-xs flex items-center">
                    <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-green-300 border border-green-300">
                        {getStatistics?.teamBatting}
                    </span>
                    <span>
                        <PiDotFill />
                    </span>{" "}
                    Batting
                </div>
                <div className="flex flex-0 items-center">
                    <div className="relative">
                        <input
                            type="text"
                            value={batterName}
                            name="price"
                            id="price"
                            className=" bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full px-1.5 py-1 mr-4"
                            placeholder="Player name"
                            onChange={(e) => setBatterName(e.target.value)}
                            required
                        />
                        <FaCircleCheck
                            className="absolute top-[5px] right-1 text-green-700 cursor-pointer"
                            onClick={addBatsman}
                        />
                    </div>
                    {/* <button className="text-white inline-flex items-center  bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-xs px-3 py-2 ml-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Switch Batsman</button> */}
                    {/* <Button color="purple" text="Switch Batsman" classes="ml-2" /> */}
                </div>
            </div>

            {getCurrentInningBattingData()?.length > 0 ? (
                <>
                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg pt-2">
                        <table className="w-full text-xs rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-white bg-gray-500 text-center">
                                <tr>
                                    <th scope="col" className="px-3 py-2 w-[40%] text-left">
                                        Batter name
                                    </th>
                                    <th scope="col" className="w-[5%]">
                                        R
                                    </th>
                                    <th scope="col" className="w-[5%]">
                                        B
                                    </th>
                                    <th scope="col" className="w-[5%]">
                                        4s
                                    </th>
                                    <th scope="col" className="w-[5%]">
                                        6s
                                    </th>
                                    <th scope="col" className="w-[5%]">
                                        8s
                                    </th>
                                    <th scope="col" className="w-[5%]">
                                        SR
                                    </th>
                                    <th scope="col" className="w-[10%]">
                                        Out
                                    </th>
                                    <th scope="col" className="w-[10%]">
                                        Bowler
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="text-[11px] text-center">
                                {getCurrentInningBattingData().map(
                                    (batter: BattingData) => (
                                        <tr
                                            className={` ${batter.out !== '-' ? "bg-red-200 cursor-none pointer-events-none" : "bg-white "} border-b dark:border-gray-700`}
                                            key={batter.id}
                                        >
                                            <th
                                                scope="row"
                                                className="text-left px-3 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white w-[40%]"
                                            >
                                                <span className="flex items-center">
                                                    <span
                                                        className=" cursor-pointer"
                                                        onClick={() => changeStrike(batter.id)}
                                                    >
                                                        {batter.batsmanName}
                                                    </span>
                                                    {batter.onStrike && (
                                                        <span className="inline-flex ml-2 items-center bg-green-100 text-green-800 text-[10px] font-medium px-2 py-0.2 rounded-full ">
                                                            <span className="w-1 h-1 me-1 bg-green-500 rounded-full"></span>
                                                            Strike
                                                        </span>
                                                    )}
                                                </span>
                                            </th>
                                            <td className="w-[5%]">{batter.runs}</td>
                                            <td className="w-[5%]">{batter.balls}</td>
                                            <td className="w-[5%]">{batter.fours}</td>
                                            <td className="w-[5%]">{batter.sixes}</td>
                                            <td className="w-[5%]">{batter.eights}</td>
                                            <td className="w-[5%]">{batter.strikeRate}</td>
                                            <td className="w-[10%]">{batter.out}</td>
                                            <th scope="col" className="w-[10%]">
                                                {batter.bowler}
                                            </th>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            ) : (
                <div className="text-center p-4">Add new batsman</div>
            )}
        </>
    );
};

export default Batting;
