import React, { useEffect, useState } from "react";
import { FaCircleCheck } from "react-icons/fa6";
import { PiDotFill } from "react-icons/pi";
import { BattingData } from "../../interfaces/MatchData";
import { nanoid } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { addBatsman, switchStrike } from "../../store/Slice/MatchSlice";
import useFunctions from "../../hooks/useFunctions";
import { getSingleTeamPlayers } from "../../api/teamApi";

const Batting = () => {
    const [batterName, setBatterName] = useState("");
    const [battingTeamPlayers, setBattingTeamPlayers] = useState<any[]>([]);
    const dispatch = useDispatch();

    const { getStatistics, getCurrentInning, getBattingData, getCurrentBattingTeam } = useFunctions();


    useEffect(() => {
        const getBattingTeamPlayers = async () => {
            if (getCurrentBattingTeam) {
                const res = await getSingleTeamPlayers(getCurrentBattingTeam());
                setBattingTeamPlayers(res.players || [])
            }
        }
        getBattingTeamPlayers()
    }, []);

    const onClickAddBatsman = () => {
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
                getBattingData?.length === 0 ? true : false,
        };


        dispatch(addBatsman({ inning: getCurrentInning, batsman: batterInfo }));

        setBatterName("");
    };

    const changeStrike = (batterId: string) => {
        dispatch(switchStrike({ inning: getCurrentInning, batsmanId: batterId }));
    };

    return (
        <>
            <div className="flex justify-between items-center border-b pb-2 border-gray-300 border-spacing-2">
                <div className="text-xs flex items-center">
                    <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-green-300 border border-green-300">
                        {getCurrentInning === "inning1" ? getStatistics?.teamBatting : getStatistics?.teamBattingSecond}
                    </span>
                    <span>
                        <PiDotFill />
                    </span>{" "}
                    Batting
                </div>
                <div className="flex flex-0 items-center">
                    <div className="relative">
                        <select
                            className="bg-gray-50 w-56 border text-xs border-gray-300 text-gray-900 rounded-lg focus:ring-primary-500 focus:border-primary-500 block px-2.5 py-1"
                            id="teamName"
                            value={batterName}
                            onChange={(e) => setBatterName(e.target.value)}
                        //name="exampleRequired"
                        >
                            <option value="" disabled>
                                Select Player
                            </option>
                            {battingTeamPlayers?.map((player: any) => (
                                <option key={player.id} value={player.name}>{player.name}</option>
                            ))}
                        </select>
                        <FaCircleCheck
                            className="absolute top-[5px] right-5 text-green-700 cursor-pointer"
                            onClick={onClickAddBatsman}
                        />
                    </div>
                </div>
            </div>

            {getBattingData?.length > 0 ? (
                <>
                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg pt-2">
                        <table className="w-full text-xs rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-white bg-gray-500 text-center">
                                <tr>
                                    <th scope="col" className="px-3 py-2 w-[30%] text-left">
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
                                    <th scope="col" className="w-[15%]">
                                        Out
                                    </th>
                                    <th scope="col" className="w-[15%]">
                                        Bowler
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="text-[11px] text-center">
                                {getBattingData.map(
                                    (batter: BattingData) => (
                                        <tr
                                            className={` ${batter.out !== '-' ? "bg-red-100 cursor-none pointer-events-none" : "bg-white "} border-b dark:border-gray-700 disabled:bg-black`}
                                            key={batter.id}
                                            aria-disabled
                                        >
                                            <th
                                                scope="row"
                                                className="text-left px-3 py-1.5 font-medium text-gray-900 whitespace-nowrap dark:text-white w-[30%]"
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
                                            <td className="w-[10%]">{batter.strikeRate}</td>
                                            <td className="w-[15%]">{batter.out}</td>
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
                <div className="text-center p-4 text-xs">Add new batsman</div>
            )}
        </>
    );
};

export default Batting;
