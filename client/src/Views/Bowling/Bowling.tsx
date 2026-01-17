import React, { useEffect, useState } from "react";
import { FaCircleCheck } from "react-icons/fa6";
import { PiDotFill } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";
import { BowlingData, calculateOvers } from "../../interfaces/MatchData";
import { nanoid } from "@reduxjs/toolkit";
import { addBowler, switchBowler } from "../../store/Slice/MatchSlice";
import useFunctions from "../../hooks/useFunctions";
import { getSingleTeamPlayers, Team } from "../../api/teamApi";

const Bowling = () => {
	const [bowlerName, setBowlerName] = useState("");
	const [bowlingTeamPlayers, setBowlingTeamPlayers] = useState<Team[]>([]);
	const currentInning = useSelector((state: any) => state.inningNumber);

	const dispatch = useDispatch();

	const { getStatistics, getCurrentInning, getBowlingData, getCurrentBowlingTeam, getCurrentInningData } = useFunctions();

	// const getCurrentInningBowlingData = () => {
	// 	return getBowlingData[getCurrentInning]?.bowlingData;
	// };



	const onClickAddBowler = () => {
		const bowlerInfo: BowlingData = {
			id: nanoid(),
			bowlerName: bowlerName,
			balls: 0,
			//overs: 0,
			//maiden: 0,
			runs: 0,
			wickets: 0,
			//economyRate: 0,
			extras: 0,
			//totalRuns: 0,
			//totalWicket: 0,
			currentBowler: getBowlingData?.length === 0 ? true : false,
		};

		dispatch(addBowler({ inning: getCurrentInning, bowler: bowlerInfo }));
		setBowlerName("");
	};


	useEffect(() => {
		const getBowlingTeamPlayers = async () => {
			if (getCurrentBowlingTeam) {
				const res = await getSingleTeamPlayers(getCurrentBowlingTeam());
				setBowlingTeamPlayers(res.players || [])
			}
		}
		getBowlingTeamPlayers()
	}, []);


	const changeBowler = (bowlerId: string) => {
		dispatch(
			switchBowler({ inning: getCurrentInning, bowlerId: bowlerId })
		);
	};

	const calculateEconomyRate = (runs: any, overs: any) => {
		return (runs / overs).toFixed(2);
	}
	return (
		<>
			<div className="flex justify-between items-center border-b pb-2 border-gray-300 border-spacing-2">
				<div className="text-xs flex items-center">
					<span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded border border-green-300">
						{getCurrentInning === "inning1" ? getStatistics?.teamBowling : getStatistics?.teamBowlingSecond}
					</span>
					<span>
						<PiDotFill />
					</span>{" "}
					Bowling
				</div>
				<div className="flex flex-0 items-center">
					<div className="relative">
						{/* <input
							type="text"
							value={bowlerName}
							name="price"
							id="price"
							className=" bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full px-1.5 py-1 mr-4"
							placeholder="Bowler name"
							onChange={(e) => setBowlerName(e.target.value)}
							required
						/> */}
						<select
							className="bg-gray-50 w-56 border text-xs border-gray-300 text-gray-900 rounded-lg focus:ring-primary-500 focus:border-primary-500 block px-2.5 py-1"
							id="teamName"
							value={bowlerName}
							onChange={(e) => setBowlerName(e.target.value)}
						>
							<option value="" disabled>
								Select Player
							</option>
							{bowlingTeamPlayers?.map((player: any) => (
								<option key={player.id} value={player.name}>{player.name}</option>
							))}
						</select>
						<FaCircleCheck
							className="absolute top-[5px] right-5 text-green-700 cursor-pointer"
							onClick={onClickAddBowler}
						/>
					</div>
				</div>
			</div>

			{getBowlingData?.length > 0 ? (
				<>
					<div className="relative overflow-x-auto shadow-md sm:rounded-lg pt-2">
						<table className="w-full text-xs rtl:text-right text-gray-500">
							<thead className="text-xs text-white bg-gray-500 text-center">
								<tr>
									<th scope="col" className="px-3 py-2 w-[40%] text-left">
										Bowler name
									</th>
									<th scope="col" className="w-[5%]">
										O
									</th>
									{/* <th scope="col" className="w-[5%]">
										M
									</th> */}
									<th scope="col" className="w-[5%]">
										R
									</th>
									<th scope="col" className="w-[5%]">
										W
									</th>
									<th scope="col" className="w-[5%]">
										ER
									</th>
									<th scope="col" className="w-[10%]">
										Ext
									</th>
									<th scope="col" className="w-[10%]">
										Total
									</th>
								</tr>
							</thead>
							<tbody className="text-[11px] text-center">
								{getBowlingData?.map((bowler: BowlingData) => (
									<tr
										className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
										key={bowler.id}
									>
										<th
											scope="row"
											className="text-left px-3 py-1.5 font-medium text-gray-900 whitespace-nowrap dark:text-white w-[20%] "
										>
											<span className="flex items-center">
												<span
													className=" cursor-pointer"
													onClick={() => changeBowler(bowler.id)}
												>
													{bowler.bowlerName}
												</span>
												{bowler.currentBowler && (
													<span className="inline-flex ml-2 items-center bg-green-100 text-green-800 text-[10px] font-medium px-2 py-0.2 rounded-full">
														<span className="w-1 h-1 me-1 bg-green-500 rounded-full"></span>
														Strike
													</span>
												)}
											</span>
										</th>
										<td className="w-[10%]">{calculateOvers(bowler.balls)}</td>
										{/* <td className="w-[10%]">{bowler.maiden}</td> */}
										<td className="w-[10%]">{bowler.runs}</td>
										<td className="w-[10%]">{bowler.wickets}</td>
										<td className="w-[10%]">{calculateEconomyRate(bowler.runs, calculateOvers(bowler.balls))}</td>
										<td className="w-[10%]">{bowler.extras}</td>
										<th scope="col" className="w-[10%]">
											{bowler.runs + bowler.extras}
										</th>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</>
			) : (
				<div className="text-center p-4 text-xs">Add new Bowler</div>
			)}
		</>
	);
};

export default Bowling;
