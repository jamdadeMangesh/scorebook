import React, { useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../Button/Button";
import { PiDotFill } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";
//import { reset, switch_inning } from "../../store/Slice/MatchSlice";
import { persistor } from "../../store/store";
import useFunctions from "../../hooks/useFunctions";
import { calculateOvers, Match } from "../../interfaces/MatchData";
import { save_inning, save_match } from "../../store/Slice/MatchSlice";
import {
	Dialog,
	DialogBackdrop,
	DialogPanel,
	DialogTitle,
} from "@headlessui/react";
import { HiOutlineExclamationTriangle } from "react-icons/hi2";
import { RiHome7Fill } from "react-icons/ri";
import Confirm from "../Confirm/Confirm";
import { useForm } from "react-hook-form";


const Header = () => {
	const storedData = JSON.parse(localStorage.getItem("MatchData") || "[]");

	const { getStatistics, getCurrentInning, getBattingData } =
		useFunctions();

	const getMatchData: Match = useSelector(
		(state: any) => state
	);

	const [openConfirmModal, setOpenConfirmModal] = useState(false);
	const [resetOpenConfirmModal, setResetOpenConfirmModal] = useState(false);
	const [endMatchOpenConfirmModal, setEndMatchOpenConfirmModal] = useState(false);

	const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();

	const currentInningScore = getBattingData[getCurrentInning]?.score;
	const totalWickets = getBattingData[getCurrentInning]?.wickets;
	// const getCurrentInningScore = () => {
	// 	if (getCurrentInning === "inning1") {
	// 		return getBattingData?.inning1?.score;
	// 		//return battingAllData[inningKey]?.find((value) => value.score)
	// 	}
	// };

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const onEndMatch = () => {
		setEndMatchOpenConfirmModal(true)
		//navigate("/");
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
		if (currentInningScore) {
			return (currentInningScore / overs).toFixed(2);
		}
		return 0

	};

	const saveInning = () => {
		dispatch(save_inning())
		setOpenConfirmModal(false);
	};
	// const switchInning = () => [
	// 	dispatch(
	// 		switch_inning({
	// 			matchId: getCurrntMatchId,
	// 			currentInning: getCurrentInning,
	// 		})
	// 	),
	// ];

	const submitSaveForm = (data) => {
		console.log('data;', data?.matchWonBy);
		console.log('getMatchData;', getMatchData);
		const saveMatchData = dispatch(save_match({ matchResult: data }))
		let matchList: Match[] = JSON.parse(localStorage.getItem('MatchData') || '[]');
		console.log('matchList:', matchList);
		matchList?.push(getMatchData);
		if (saveMatchData) {
			localStorage.setItem("MatchData", JSON.stringify(matchList));
		}
		setEndMatchOpenConfirmModal(false);
	}

	const EndMatch = (data) => {

		//setEndMatchOpenConfirmModal(false)
	}
	return (
		<>
			<div className="w-full bg-gray-200 flex px-5 py-3 items-center justify-between">
				<div className="text-xs flex items-center">
					<RiHome7Fill className="mr-2 text-xl text-blue-600 cursor-pointer hover:text-blue-800" onClick={() => navigate("/")} />

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
					<Button color="red" text="Reset" handleClick={() => setResetOpenConfirmModal(true)} />
					{/* <Button
					color="purple"
					text="Switch Innings"
					handleClick={switchInning}
					classes="ml-2"
				/> */}
					<Button
						color="purple"
						text={
							getCurrentInning === "inning1" ? "Save Inning 1" : "Save Inning 2"
						}
						handleClick={() => setOpenConfirmModal(true)}
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
			<Confirm
				openConfirmModal={resetOpenConfirmModal}
				setOpenConfirmModal={setResetOpenConfirmModal}
				title="Reset All Data?"
				description="Are you sure you want to reset all data? Once you reset, your all data will be lost. This action is irreversible."
				buttonTitle="Reset"
				onSubmitClick={resetStates}
			/>
			<Confirm
				openConfirmModal={openConfirmModal}
				setOpenConfirmModal={setOpenConfirmModal}
				title="Save Inning?"
				description="Are you sure you want to save your current inning? Once you save an inning, you will not able to update score."
				buttonTitle="Save Inning"
				onSubmitClick={saveInning}
			/>
			<Dialog
				open={endMatchOpenConfirmModal}
				onClose={setEndMatchOpenConfirmModal}
				className="relative z-10"
			>
				<DialogBackdrop
					transition
					className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
				/>

				<div className="fixed inset-0 z-10 w-screen overflow-y-auto">
					<div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
						<DialogPanel
							transition
							className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8  data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
						>
							<form onSubmit={handleSubmit(submitSaveForm)}>
								<div className="bg-white px-4 pb-8 pt-5 sm:p-8 sm:pb-8">
									<div className="flex text-xs  min-w-[100vh]">
										{/* <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10">
										<HiOutlineExclamationTriangle
											aria-hidden="true"
											className="size-6 text-red-600"
										/>
									</div> */}
										<div className="text-center sm:mt-0 sm:text-left min-w-[100vh]">
											<DialogTitle
												as="h3"
												className="text-sm font-semibold text-gray-900"
											>
												End & Save Match?
											</DialogTitle>
											<div className="mt-4">
												{/* <p className="text-sm text-gray-500">
												Are you sure you want to save your current inning? Once you save an inning, you will not able to update score.
											</p> */}

												<div className="grid gap-4 grid-cols-2">
													<div className="col-span-2 sm:col-span-1">
														<label htmlFor="matchWonBy" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Match won by</label>
														<select
															className={` ${errors.matchWonBy && 'focus:outline-none focus:border-red-700 bg-red-50 border border-red-500 text-red-900'}bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 py-1.5  dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`}
															id="tossWonBy"
															defaultValue=""
															{...register("matchWonBy", { required: true })}
														>
															<option value="">Select Option</option>
															{(getStatistics.team1 && getStatistics.team2) &&
																<>
																	<option value={getStatistics.team1}>{getStatistics.team1}</option>
																	<option value={getStatistics.team2}>{getStatistics.team2}</option>
																</>}
														</select>
														{errors.matchWonBy && <span className="mt-2 text-sm text-red-600 dark:text-red-500" >This is required!</span>}
													</div>
													<div className="col-span-2 sm:col-span-1">
														<label htmlFor="resultDescription" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Result Description</label>
														<input
															{...register("resultDescription",
																{ required: true }
															)}
															type="text"
															className={`${errors.resultDescription && 'focus:outline-none focus:border-red-700 bg-red-50 border border-red-500 text-red-900'} bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 py-1.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`}
															placeholder="Team 1 won by 15 runs"
														/>
														{errors.resultDescription && <span className="mt-2 text-sm text-red-600 dark:text-red-500">This is required!</span>}
													</div>

												</div>

											</div>
										</div>
									</div>
								</div>
								<div className="bg-gray-100 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
									<button
										type="submit"
										//onClick={EndMatch}
										className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
									>
										End & Save Match
									</button>
									<button
										type="button"
										data-autofocus
										onClick={() => setEndMatchOpenConfirmModal(false)}
										className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
									>
										Cancel
									</button>
								</div>
							</form>
						</DialogPanel>
					</div>
				</div>
			</Dialog>
		</>
	);
};

export default Header;
