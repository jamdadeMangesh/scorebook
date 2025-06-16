import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import InfoModal from "../InfoModal/InfoModal";
//import image2 from "../../assets/cricket-bg.jpg";

var image1 = require('../../assets/cricket-bg.jpg');

export const Home = () => {
    const [openModal, setOpenModal] = useState(false);
    const navigate = useNavigate();
    const allData = useSelector((state) => state);
    console.log("All Data home:", allData);
    return (
        <div style={{backgroundImage: `url(${image1})`}} className="h-screen relative bg-gray-100 p-5 flex justify-center items-center bg-center bg-no-repeat bg-[url('../../assets/cricket-bg.jpg'})]">
            <div className="h-screen w-screen absolute bg-black opacity-80 top-0 left-0"></div>
            <div className="z-50 md:inset-0 max-h-full">
                <div className="relative p-4 w-full max-w-md max-h-full">
                    <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                ScoreBook
                            </h3>
                        </div>

                        <div className="p-4 md:p-5">
                            <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
                                Check with one of our previous matches or create a new one.
                            </p>
                            <div className="grid grid-cols-2 gap-4 mt-4">
                                <div
                                    className="flex items-center justify-center p-3 text-sm font-bold text-white rounded-lg bg-blue-500 hover:bg-blue-600 group hover:shadow cursor-pointer"
                                    onClick={() => setOpenModal(true)}
                                >
                                    New Match
                                </div>
                                <div
                                    className="flex items-center justify-center p-3 text-sm font-bold text-white rounded-lg bg-blue-500 hover:bg-blue-600 group hover:shadow cursor-pointer"
                                    onClick={() => navigate("/dashboard")}
                                >
                                    Current Match
                                </div>
                                <div className="flex items-center justify-center p-3 text-sm font-bold text-white rounded-lg bg-blue-500 hover:bg-blue-600 group hover:shadow ">
                                    Previous Matches
                                </div>
                                <div className="flex items-center justify-center p-3 text-sm font-bold text-white rounded-lg bg-blue-500 hover:bg-blue-600 group hover:shadow ">
                                    Settings
                                </div>
                                {/* <div className="flex items-center justify-center p-3 text-base font-bold text-white rounded-lg bg-blue-500 hover:bg-blue-600 group hover:shadow dark:bg-blue-500 dark:hover:bg-blue-700 dark:text-white">4</div> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {openModal && (
                <InfoModal showModal={openModal} setShowModal={setOpenModal} />
            )}
        </div>
    );
};
