import React, { useReducer } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../Button/Button";
import { PiDotFill } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";
import { reset, switch_inning } from "../../store/Slice/MatchSlice";
import { persistor } from "../../store/store";
import useFunctions from "../../hooks/useFunctions";
import { calculateOvers } from "../../interfaces/MatchData";

const Header = () => {
	const storedData = JSON.parse(localStorage.getItem("MatchData") || "[]");
	//console.log(storedData);

	const { getStatistics, getCurrentInning, getBattingData, getCurrntMatchId } =
		useFunctions();

	const currentInningScore = getBattingData[getCurrentInning]?.score;
	const totalWickets = getBattingData[getCurrentInning]?.wickets;
	const getCurrentInningScore = () => {
		if (getCurrentInning === "inning1") {
			return getBattingData?.inning1?.score;
			//return battingAllData[inningKey]?.find((value) => value.score)
		}
	};

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const onEndMatch = () => {
		navigate("/");
	};
	const resetStates = () => {
		persistor.purge();
		// persistor.pause();
		// persistor.flush().then(() => {
		//     return persistor.purge();
		// });
		//dispatch(reset());
		navigate("/");
	};

	//calculate run rate
	const calculateRunRate = (totalBalls: number) => {
		const overs: any = calculateOvers(totalBalls);
		return (currentInningScore / overs).toFixed(2) || 0.0;
	};

	const switchInning = () => [
		dispatch(
			switch_inning({
				matchId: getCurrntMatchId,
				currentInning: getCurrentInning,
			})
		),
	];
	return (
		<div className="w-full bg-gray-200 flex px-5 py-3 items-center justify-between">
			<div className="text-xs flex items-center">
				{getStatistics?.remarks}
				<span>
					<PiDotFill />
				</span>
				<span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-green-300 border border-green-300">
					{getStatistics?.team1}
				</span>
				vs
				<span className="bg-green-100 text-green-800 text-xs font-medium ml-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-green-300 border border-green-300">
					{getStatistics?.team2}
				</span>
				<span>
					<PiDotFill />
				</span>
				Toss won by{" "}
				<span className="bg-green-100 text-green-800 text-xs font-medium ml-2 mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-green-300 border border-green-300">
					{getStatistics?.tossWonBy}
				</span>
				<span>
					<PiDotFill />
				</span>
				{/* Batting Team : <span className="bg-green-100 text-green-800 text-sm font-medium me-2 px-2.5 py-0.5 ml-2 rounded dark:bg-gray-700 dark:text-green-300 border border-green-300">
                    {statistics?.teamBatting}</span>

                <span><PiDotFill /></span> */}
				Bowling Team :{" "}
				<span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 ml-2 rounded dark:bg-gray-700 dark:text-green-300 border border-green-300">
					{getStatistics?.teamBowling}
				</span>
				<span>
					<PiDotFill />
				</span>
				{getCurrentInning}
				<div className="flex items-center text-sm font-semibold bg-green-600 rounded-sm px-4 py-1 shadow-md text-white ml-2">
					Score: {currentInningScore}/{totalWickets}{" "}
					<span>
						<PiDotFill />
					</span>{" "}
					{calculateOvers(getBattingData[getCurrentInning]?.overs)} overs{" "}
					<span>
						<PiDotFill />
					</span>{" "}
					RR: {calculateRunRate(getBattingData[getCurrentInning]?.overs)}
				</div>
			</div>

			<div className="">
				<Button color="red" text="Reset" handleClick={() => resetStates()} />
				<Button
					color="purple"
					text="Switch Innings"
					handleClick={switchInning}
					classes="ml-2"
				/>
				<Button color="blue" text="Save Match" classes="ml-2" />
				<Button
					color="red"
					text="End Match"
					classes="ml-2"
					handleClick={() => onEndMatch()}
				/>
			</div>
		</div>
	);
};

export default Header;
