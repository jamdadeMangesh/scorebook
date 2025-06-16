import React, { useState } from "react";
import Button from "../../Components/Button/Button";
import { IoIosClose } from "react-icons/io";
import useFunctions from "../../hooks/useFunctions";
import { useDispatch } from "react-redux";
import { add_extras } from "../../store/Slice/MatchSlice";
import { IExtrasTRuns } from "../../interfaces/MatchData";

const Extras = () => {
	const { getCurrentInning, isNoBattingdata, getBatsmanOnStrike, getBowlerOnStrike, isNoBowligdata } = useFunctions();
	const dispatch = useDispatch()
	const [extras, setExtras] = useState("");
	const [extrasRuns, setExtrasRuns] = useState<IExtrasTRuns>({
		Type: "",
		Runs: 0,
		selected: "",
	});
	const [showPopOver, setShowPopOver] = useState(false);

	const onExtrasClick = (str: string) => {
		setShowPopOver(true);
		setExtras(str);
	};

	const extraTypeMapping = [
		[
			["Wide", "wide"],
			["No Ball", "noBall"],
			["Byes", "byes"],
			["Leg Byes", "legByes"],
		],
	];
	//const extrasRuns = ['+1','+2','+3','+4', '+5', '+6','+7', '+8']

	const extraTypes = {
		wide: [
			["Wd", 1],
			["1 + Wd", 2],
			["2 + Wd", 3],
			["3 + Wd", 4],
			["4 + Wd", 5],
		],
		noBall: [
			["NB", 1],
			["1 NB", 2],
			["2 NB", 3],
			["3 NB", 4],
			["4 NB", 5],
			["5 NB", 6],
			["6 NB", 7],
			["7 NB", 8],
			["8 NB", 9],
		],
		byes: [
			["1 B", 1],
			["2 B", 2],
			["3 B", 3],
			["4 B", 4],
		],
		legByes: [
			["1 LB", 1],
			["2 LB", 2],
			["3 LB", 3],
			["4 LB", 4],
		],
	};

	const closePopover = () => {
		setShowPopOver(false);
		setExtras('');
		setExtrasRuns({
			Type: "",
			Runs: 0,
			selected: "",
		})
	}

	const addExtras = () => {
		dispatch(add_extras({ currentInning: getCurrentInning, extrasRuns: extrasRuns, batsmanId: getBatsmanOnStrike(), bowlerId: getBowlerOnStrike() }))
		setShowPopOver(false);
		setExtras('');
		setExtrasRuns({
			Type: "",
			Runs: 0,
			selected: "",
		})
	}

	return (
		<>
			<div className="flex justify-between items-center border-b pb-2 border-gray-300 border-spacing-2">
				<div className="text-sm flex items-center">Extras</div>
				{!isNoBattingdata && extrasRuns.selected !== "" && !isNoBowligdata && (
					<Button color="blue" text="Add Extras" classes="ml-2" handleClick={addExtras} />
				)}
			</div>
			<div className="flex mt-5 text-sm text-gray-600 flex-wrap">
				{extraTypeMapping[0].map(([type, value]: any) => (
					<span
						key={type}
						className={`${extras === value
							? "text-white bg-blue-500"
							: "text-blue-600 bg-blue-100"
							}  cursor-pointer text-xs font-medium mb-2 me-2 px-2.5 py-0.5 rounded border border-blue-300`}
						onClick={() => onExtrasClick(value)}
					>
						{type}
					</span>
				))}
				{/* <div
                    className={` ${extras === "Wide" ? "text-white bg-blue-600" : "text-blue-600"
                        } px-4 py-1.5 mr-2 mb-2 border cursor-pointer rounded-sm border-blue-600  hover:bg-blue-600 hover:text-white`}
                    onClick={() => onExtrasClick("wide")}
                >
                    Wide
                </div>
                <div
                    className={` ${extras === "No Ball" ? "text-white bg-blue-600" : "text-blue-600"
                        } px-4 py-1.5 mr-2 mb-2 border cursor-pointer rounded-sm border-blue-600  hover:bg-blue-600 hover:text-white`}
                    onClick={() => onExtrasClick("noBall")}
                >
                    No Ball
                </div>
                <div
                    className={` ${extras === "Byes" ? "text-white bg-blue-600" : "text-blue-600"
                        } px-4 py-1.5 mr-2 mb-2 border cursor-pointer rounded-sm border-blue-600  hover:bg-blue-600 hover:text-white`}
                    onClick={() => onExtrasClick("byes")}
                >
                    Byes
                </div>
                <div
                    className={` ${extras === "Leg Byes" ? "text-white bg-blue-600" : "text-blue-600"
                        } px-4 py-1.5 mr-2 mb-2 border cursor-pointer rounded-sm border-blue-600  hover:bg-blue-600 hover:text-white`}
                    onClick={() => onExtrasClick("legByes")}
                >
                    Leg Byes
                </div> */}

				{showPopOver && (
					<div className="relative block w-full mt-4">
						<p>Select one option</p>
						<IoIosClose
							className="absolute z-10 right-2 top-0 text-lg cursor-pointer"
							onClick={() => closePopover()}
						/>
						<div className="my-2.5">
							{/* <span
                                //key={type}
                                //className={`${wickets === type ? "text-white bg-red-500" : "text-red-600"} bg-red-100 text-red-800 cursor-pointer text-sm font-medium mb-2 me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-red-300 border border-red-300`}
                                className="text-white bg-gray-500 text-yellow- bg-gray-100 text-gray- cursor-pointer text-sm font-medium mb-2 me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300 border border-gray-300"
                            //onClick={() => onWicketsClick(type)}
                            >
                                Wide
                            </span> */}
							{extraTypes[extras].map(([type, value]: any) => (
								<span
									key={type}
									className={` ${extrasRuns.selected === type
										? "bg-gray-800 text-white"
										: "text-gray-800 bg-gray-100"
										} inline-block bg-gray-100  cursor-pointer text-xs font-medium mb-2 me-2 px-2.5 py-0.5 rounded   border border-gray-300`}
									onClick={() =>
										setExtrasRuns({
											Type: extras,
											Runs: value,
											selected: type,
										})
									}
								>
									{type}
								</span>
							))}
						</div>
					</div>
				)}
			</div>
		</>
	);
};

export default Extras;
