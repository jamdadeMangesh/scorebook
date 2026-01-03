import { nanoid } from "@reduxjs/toolkit";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Inning, Match } from "../../interfaces/MatchData";
import { add_statistics, set_inning } from "../../store/Slice/MatchSlice";
import { getTeams, Team } from "../../api/teamApi";
import { notify } from "../../Components/Toast/Toast";

interface InfoModalProps {
    showModal: boolean;
    setShowModal: (value: boolean) => void;
}

const InfoModal = ({ showModal, setShowModal }: InfoModalProps) => {
    const [teams, setTeams] = useState<Team[]>([]);
    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm();

    const team1Name = watch("team1");
    const team2Name = watch("team2");

    const fetchTeams = async () => {
        try {
            const res = await getTeams();
            setTeams(res.teams || []);
        } catch (error) {
            console.error(error);
            notify("Failed to fetch teams", "error");
        }
    }
    useEffect(() => {
        fetchTeams();
    }, []);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const submitForm = (data) => {
        reset();
        //   onFormSubmit(data);
        const matchData = {
            team1: data?.team1,
            team2: data?.team2,
            playersCount: data?.playersCount,
            tossWonBy: data?.wonBy,
            teamBatting: data?.teamBatting,
            teamBowling: data?.teamBowling,
            remarks: data?.remarks,
            teamBattingSecond: data?.teamBowling,
            teamBowlingSecond: data?.teamBatting,
            isFirstInningCompleteed: false,
        };

        //localStorage.setItem("MatchData", JSON.stringify(matchData));
        dispatch(add_statistics(matchData));
        navigate("/dashboard");

        const inningData = {
            isCurrentInning: true,
            score: 0,
            wickets: 0,
            overs: 0,
            battingFirstTeamName: data?.teamBatting,
            bowlingFirstTeamName: data?.teamBowling,
        };
        const newInning1: Inning = {
            id: nanoid(),
            firstInning: true,
            ...inningData,
        };
        const newInning2: Inning = {
            id: nanoid(),
            firstInning: false,
            ...inningData,
        };

        dispatch(set_inning({ matchId: nanoid(), inningNum: "inning1" }));
    };

    return (
        <div
            id="crud-modal"
            aria-hidden="true"
            className="fixed  z-50  md:inset-0  bg-black bg-opacity-25"
        >
            <div className="relative p-4 w-full max-w-md max-h-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                    <div className="flex items-center justify-between p-2 md:p-5 border-b rounded-t dark:border-gray-600">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Create New Match
                        </h3>
                        <button
                            type="button"
                            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-xs w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                            data-modal-toggle="crud-modal"
                            onClick={() => setShowModal(false)}
                        >
                            <svg
                                className="w-3 h-3"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 14 14"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                />
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit(submitForm)}>
                        <div className="grid gap-4 grid-cols-2 p-4 md:p-5">
                            <div className="col-span-2 sm:col-span-1">
                                <label
                                    htmlFor="team1"
                                    className="block mb-2 text-xs font-medium text-gray-900 dark:text-white"
                                >
                                    Team 1
                                </label>
                                <select
                                    className={` ${errors.team1 &&
                                        "focus:outline-none focus:border-red-700 bg-red-50 border border-red-500 text-red-900"
                                        }bg-gray-50 border text-xs border-gray-300 text-gray-900 rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 py-1.5`}
                                    id="team1"
                                    defaultValue=""
                                    //name="exampleRequired"
                                    {...register("team1", { required: true })}
                                >
                                    <option value="" disabled>
                                        Select Option
                                    </option>
                                    {teams.map((team: any) => (
                                        <option key={team} value={team}>{team}</option>
                                    ))}
                                </select>
                                {/* <input
                                    {...register("team1", { required: true })}
                                    type="text"
                                    className={`${errors.team1 &&
                                        "focus:outline-none focus:border-red-700 bg-red-50 border border-red-500 text-red-900"
                                        } bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 py-1.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`}
                                    placeholder="Type team 1 name"
                                /> */}
                                {errors.team1 && (
                                    <span className="mt-2 text-xs text-red-600 dark:text-red-500">
                                        This is required!
                                    </span>
                                )}
                            </div>
                            <div className="col-span-2 sm:col-span-1">
                                <label
                                    htmlFor="team2"
                                    className="block mb-2 text-xs font-medium text-gray-900 dark:text-white"
                                >
                                    Team 2
                                </label>
                                {/* <input
                                    {...register("team2", { required: true })}
                                    type="text"
                                    className={`${errors.team2 &&
                                        "focus:outline-none focus:border-red-700 bg-red-50 border border-red-500 text-red-900"
                                        } bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 py-1.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`}
                                    placeholder="Type team 2 name"
                                />
                                {errors.team2 && (
                                    <span className="mt-2 text-xs text-red-600 dark:text-red-500">
                                        This is required!
                                    </span>
                                )} */}
                                <select
                                    className={` ${errors.team2 &&
                                        "focus:outline-none focus:border-red-700 bg-red-50 border border-red-500 text-red-900"
                                        }bg-gray-50 border text-xs border-gray-300 text-gray-900 rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 py-1.5`}
                                    id="team1"
                                    defaultValue=""
                                    //name="exampleRequired"
                                    {...register("team2", { required: true })}
                                >
                                    <option value="" disabled>
                                        Select Option
                                    </option>
                                    {teams.map((team: any) => (
                                        <option key={team} value={team}>{team}</option>
                                    ))}
                                </select>
                                {errors.team2 && (
                                    <span className="mt-2 text-xs text-red-600 dark:text-red-500">
                                        This is required!
                                    </span>
                                )}
                            </div>
                            {/* <div className="col-span-2 sm:col-span-1">
                                <label
                                    htmlFor="playersCount"
                                    className="block mb-2 text-xs font-medium text-gray-900 dark:text-white"
                                >
                                    Players per team
                                </label>
                                <input
                                    {...register("playersCount", { required: true })}
                                    type="number"
                                    className={`${errors.playersCount &&
                                        "focus:outline-none focus:border-red-700 bg-red-50 border border-red-500 text-red-900"
                                        } bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 py-1.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`}
                                    placeholder="Player's count"
                                />
                                {errors.playersCount && (
                                    <span className="mt-2 text-xs text-red-600 dark:text-red-500">
                                        This is required!
                                    </span>
                                )}
                            </div> */}
                            <div className="col-span-2 sm:col-span-1">
                                <label
                                    htmlFor="wonBy"
                                    className="block mb-2 text-xs font-medium text-gray-900 dark:text-white"
                                >
                                    Toss won by
                                </label>
                                <select
                                    //                                    disabled={team1Name || team2Name }
                                    className={` ${errors.wonBy &&
                                        "focus:outline-none focus:border-red-700 bg-red-50 border border-red-500 text-red-900"
                                        }bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 py-1.5  dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`}
                                    id="tossWonBy"
                                    defaultValue=""
                                    //name="exampleRequired"
                                    {...register("wonBy", { required: true })}
                                >
                                    <option value="" selected>
                                        Select Option
                                    </option>
                                    {team1Name && team2Name && (
                                        <>
                                            <option value={team1Name}>{team1Name}</option>
                                            <option value={team2Name}>{team2Name}</option>
                                        </>
                                    )}
                                </select>
                                {errors.wonBy && (
                                    <span className="mt-2 text-xs text-red-600 dark:text-red-500">
                                        This is required!
                                    </span>
                                )}
                            </div>

                            <div className="col-span-2 sm:col-span-1">
                                <label
                                    htmlFor="teamBatting"
                                    className="block mb-2 text-xs font-medium text-gray-900 dark:text-white"
                                >
                                    Which team is batting
                                </label>
                                <select
                                    className={` ${errors.teamBatting &&
                                        "focus:outline-none focus:border-red-700 bg-red-50 border border-red-500 text-red-900"
                                        }bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 py-1.5  dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`}
                                    id="teamBatting"
                                    defaultValue=""
                                    //name="exampleRequired"
                                    {...register("teamBatting", { required: true })}
                                >
                                    <option value="" selected>
                                        Select Option
                                    </option>
                                    {team1Name && team2Name && (
                                        <>
                                            <option value={team1Name}>{team1Name}</option>
                                            <option value={team2Name}>{team2Name}</option>
                                        </>
                                    )}
                                </select>
                                {errors.teamBatting && (
                                    <span className="mt-2 text-xs text-red-600 dark:text-red-500">
                                        This is required!
                                    </span>
                                )}
                            </div>
                            <div className="col-span-2 sm:col-span-1">
                                <label
                                    htmlFor="teamBowling"
                                    className="block mb-2 text-xs font-medium text-gray-900 dark:text-white"
                                >
                                    Which team is bowling
                                </label>
                                <select
                                    className={` ${errors.teamBowling &&
                                        "focus:outline-none focus:border-red-700 bg-red-50 border border-red-500 text-red-900"
                                        }bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 py-1.5  dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`}
                                    id="teamBowling"
                                    defaultValue=""
                                    //name="exampleRequired"
                                    {...register("teamBowling", { required: true })}
                                >
                                    <option value="" selected>
                                        Select Option
                                    </option>
                                    {team1Name && team2Name && (
                                        <>
                                            <option value={team1Name}>{team1Name}</option>
                                            <option value={team2Name}>{team2Name}</option>
                                        </>
                                    )}
                                </select>
                                {errors.teamBowling && (
                                    <span className="mt-2 text-xs text-red-600 dark:text-red-500">
                                        This is required!
                                    </span>
                                )}
                            </div>
                            <div className="col-span-2">
                                <label
                                    htmlFor="description"
                                    className="block mb-2 text-xs font-medium text-gray-900 dark:text-white"
                                >
                                    Remarks
                                </label>
                                <textarea
                                    id="remarks"
                                    className="block p-2.5 py-1.5  w-full text-xs text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    {...register("remarks")}
                                    placeholder="Write remarks here"
                                ></textarea>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-4 md:p-5 border-t rounded-t dark:border-gray-600">
                            <button
                                type="submit"
                                className="text-white inline-flex items-center  bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-xs px-5 py-2 text-center "
                            >
                                Create new match
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default InfoModal;
