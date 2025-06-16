import React, { useState } from "react";
import { FaCircleCheck } from "react-icons/fa6";
import { PiDotFill } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";
import { BowlingData, calculateOvers } from "../../interfaces/MatchData";
import { nanoid } from "@reduxjs/toolkit";
import { add_bowler, switch_bowler } from "../../store/Slice/MatchSlice";
import useFunctions from "../../hooks/useFunctions";

const Bowling = () => {
	const [bowlerName, setBowlerName] = useState("");
	const currentInning = useSelector((state: any) => state.inningNumber);

	const dispatch = useDispatch();

	const { getStatistics, getCurrentInning, getBowlingData } = useFunctions();

	const getCurrentInningBowlingData = () => {
		return getBowlingData[getCurrentInning]?.bowlingData;
	};

	const addBowler = () => {
		const bowlerInfo: BowlingData = {
			id: nanoid(),
			bowlerName: bowlerName,
			overs: 0,
			maiden: 0,
			runs: 0,
			wicket: 0,
			economyRate: 0,
			extras: 0,
			totalRuns: 0,
			totalWicket: 0,
			currentBowler: getCurrentInningBowlingData()?.length === 0 ? true : false,
		};

		dispatch(
			add_bowler({ currentInning: currentInning, bowlerData: bowlerInfo })
		);
		setBowlerName("");
	};

	const changeBowler = (bowlerId: string) => {
		dispatch(
			switch_bowler({ currentInning: getCurrentInning, bowlerId: bowlerId })
		);
	};

	const calculateEconomyRate = (runs, overs) => {
		return (runs/overs).toFixed(2);
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
						<input
							type="text"
							value={bowlerName}
							name="price"
							id="price"
							className=" bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full px-1.5 py-1 mr-4"
							placeholder="Bowler name"
							onChange={(e) => setBowlerName(e.target.value)}
							required
						/>
						<FaCircleCheck
							className="absolute top-[5px] right-1 text-green-700 cursor-pointer"
							onClick={addBowler}
						/>
					</div>
				</div>
			</div>

			{getCurrentInningBowlingData()?.length > 0 ? (
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
									<th scope="col" className="w-[5%]">
										M
									</th>
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
								{getCurrentInningBowlingData()?.map((bowler: BowlingData) => (
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
										<td className="w-[10%]">{calculateOvers(bowler.overs)}</td>
										<td className="w-[10%]">{bowler.maiden}</td>
										<td className="w-[10%]">{bowler.runs}</td>
										<td className="w-[10%]">{bowler.wicket}</td>
										<td className="w-[10%]">{calculateEconomyRate(bowler.runs, calculateOvers(bowler.overs))}</td>
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
