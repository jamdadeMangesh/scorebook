import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { notify } from "../Toast/Toast";

const AddTeam = () => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const dispatch = useDispatch();

    const submitForm = async (data: any) => {

        const res = await fetch('/api/add-team', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ teamName: data.teamName })
        })

        const result = await res.json();

        if (result.status === 409) {
            notify(result.message, "warn")
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
                <div className="flex items-center justify-between px-3 py-3  border-b rounded-t dark:border-gray-600">
                    <div className="text-md font-semibold  text-gray-900 dark:text-white">
                        Create New Team
                    </div>
                </div>

                <form onSubmit={handleSubmit(submitForm)}>
                    <div className="grid gap-4 grid-cols-2 p-4 md:p-5">
                        <div className="col-span-2 sm:col-span-1">
                            <label
                                htmlFor="teamName"
                                className="block mb-2 font-medium text-gray-900 dark:text-white"
                            >
                                Team
                            </label>
                            <input
                                {...register("teamName", { required: true })}
                                type="text"
                                className={`${errors.teamName &&
                                    "focus:outline-none focus:border-red-700 bg-red-50 border border-red-500 text-red-900"
                                    } bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 py-1.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`}
                                placeholder="Type team name"
                            />
                            {errors.teamName && (
                                <div className="mt-1 text-red-600 dark:text-red-500">
                                    This is required!
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-3 border-t rounded-t dark:border-gray-600">
                        <button
                            type="submit"
                            className="text-white text-xs inline-flex items-center  bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-normal rounded-lg px-2 py-1 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                            Create new team
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default AddTeam;
