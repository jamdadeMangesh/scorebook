import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { notify } from '../Toast/Toast';
import { IoRefreshCircle } from "react-icons/io5";
import Button from '../Button/Button';
import { getTeams, Team } from "../../api/teamApi";

const AddPlayer = () => {
    const [teams, setTeams] = useState<Team[]>([]);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const fetchTeams = async () => {
        try {
            const res = await getTeams();
            //const data = await res.json();
            setTeams(res.teams || []);
        } catch (error) {
            console.error(error);
            notify("Failed to fetch teams", "error");
        }
    }
    useEffect(() => {
        fetchTeams();
    }, []);

    console.log('teams:', teams);

    const submitForm = async (data: any) => {

        const res = await fetch('/api/add-players', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ teamName: data.teamName, playerName: data?.playerName })
        })

        const result = await res.json();

        if (result.status === 409) {
            notify(result.message, "error")
        } else if (result.status === 500) {
            notify(result.message, "error")
        } else if (result.status === 201) {
            notify(result.message, "success")
        }

        reset();
    };
    return (
        <>
            <div className="relative bg-white rounded-lg shadow-md dark:bg-gray-700 border text-xs">
                <div className="flex items-center justify-between px-3 py-2  border-b rounded-t dark:border-gray-600">
                    <div className="text-md font-semibold  text-gray-900 dark:text-white">
                        Add New Player
                    </div>
                    <Button
                        color="green"
                        text="Refresh"
                        handleClick={() => fetchTeams()}
                        classes="ml-2"
                    />
                </div>

                <form onSubmit={handleSubmit(submitForm)}>
                    <div className="grid gap-4 grid-cols-2 p-4 md:p-5">
                        <div className="col-span-2 sm:col-span-1">
                            <label
                                htmlFor="playerName"
                                className="block mb-2 font-medium text-gray-900 dark:text-white"
                            >
                                Player name
                            </label>
                            <input
                                {...register("playerName", { required: true })}
                                type="text"
                                className={`${errors.playerName &&
                                    "focus:outline-none focus:border-red-700 bg-red-50 border border-red-500 text-red-900"
                                    } bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 py-1.5`}
                                placeholder="Type team name"
                            />
                            {errors.playerName && (
                                <div className="mt-1 text-red-600 dark:text-red-500">
                                    This is required!
                                </div>
                            )}
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                            <label
                                htmlFor="wonBy"
                                className="block mb-2  font-medium text-gray-900 dark:text-white"
                            >
                                Select Team
                            </label>
                            <select
                                className={` ${errors.teamName &&
                                    "focus:outline-none focus:border-red-700 bg-red-50 border border-red-500 text-red-900"
                                    }bg-gray-50 border text-xs border-gray-300 text-gray-900 rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 py-1.5`}
                                id="teamName"
                                defaultValue=""
                                //name="exampleRequired"
                                {...register("teamName", { required: true })}
                            >
                                <option value="" disabled>
                                    Select Option
                                </option>
                                {teams.map((team: any) => (
                                    <option key={team} value={team}>{team}</option>
                                ))}
                            </select>
                            {errors.teamName && (
                                <span className="mt-1 text-red-600 dark:text-red-500">
                                    This is required!
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-3 border-t rounded-t dark:border-gray-600">
                        <button
                            type="submit"
                            className="text-white text-xs inline-flex items-center  bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-normal rounded-lg px-2 py-1 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                            Add new player
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default AddPlayer