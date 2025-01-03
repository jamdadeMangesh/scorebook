import React, { useState } from "react";
import Button from "../../Components/Button/Button";
import {
    TbHexagonNumber0,
    TbHexagonNumber0Filled,
    TbHexagonNumber1,
    TbHexagonNumber1Filled,
    TbHexagonNumber2,
    TbHexagonNumber2Filled,
    TbHexagonNumber3,
    TbHexagonNumber3Filled,
    TbHexagonNumber4,
    TbHexagonNumber4Filled,
    TbHexagonNumber5,
    TbHexagonNumber5Filled,
    TbHexagonNumber6,
    TbHexagonNumber6Filled,
    TbHexagonNumber7,
    TbHexagonNumber7Filled,
    TbHexagonNumber8,
    TbHexagonNumber8Filled,
    TbHexagonNumber9,
    TbHexagonNumber9Filled,
} from "react-icons/tb";
import { useDispatch } from "react-redux";
import { add_score } from "../../store/Slice/MatchSlice";
import useFunctions from "../../hooks/useFunctions";

const Score = () => {
    const [score, setScore] = useState<any>(null);

    const dispatch = useDispatch();

    const { getCurrentInning, getBatsmanOnStrike, getBowlerOnStrike, isNoBattingdata } = useFunctions();

  
    console.log("getBowlerOnStrike:", getBowlerOnStrike());
    //add score to redux toolkit
    const addScore = () => {
        dispatch(
            add_score({
                currentInning: getCurrentInning,
                score: score,
                onStrikeBatsmanId: getBatsmanOnStrike(),
                onStrikeBowlerId: getBowlerOnStrike(),
            })
        );
        setScore(null)
    };

    return (
        <>
            <div className="flex justify-between items-center border-b pb-2 border-gray-300 border-spacing-2">
                <div className="text-sm flex items-center">Score</div>
                {!isNoBattingdata && (
                    <Button
                        color="purple"
                        text="Add Score"
                        classes="ml-2"
                        handleClick={addScore}
                    />
                )}
            </div>
            <div className="flex mt-4 text-3xl text-gray-600 flex-wrap">
                <div className="mr-1.5 mb-1.5">
                    {score === 0 ? (
                        <TbHexagonNumber0Filled className="cursor-pointer text-purple-700" />
                    ) : (
                        <TbHexagonNumber0
                            onClick={() => setScore(0)}
                            className="cursor-pointer text-gray-400 hover:text-purple-700"
                        />
                    )}
                </div>
                <div className="mr-1.5">
                    {score === 1 ? (
                        <TbHexagonNumber1Filled className="cursor-pointer text-purple-700" />
                    ) : (
                        <TbHexagonNumber1
                            onClick={() => setScore(1)}
                            className="cursor-pointer text-gray-400 hover:text-purple-700"
                        />
                    )}
                </div>
                <div className="mr-1.5">
                    {score === 2 ? (
                        <TbHexagonNumber2Filled className="cursor-pointer text-purple-700" />
                    ) : (
                        <TbHexagonNumber2
                            onClick={() => setScore(2)}
                            className="cursor-pointer text-gray-400 hover:text-purple-700"
                        />
                    )}
                </div>
                <div className="mr-1.5">
                    {score === 3 ? (
                        <TbHexagonNumber3Filled className="cursor-pointer text-purple-700" />
                    ) : (
                        <TbHexagonNumber3
                            onClick={() => setScore(3)}
                            className="cursor-pointer text-gray-400 hover:text-purple-700"
                        />
                    )}
                </div>
                <div className="mr-1.5">
                    {score === 4 ? (
                        <TbHexagonNumber4Filled className="cursor-pointer text-purple-700" />
                    ) : (
                        <TbHexagonNumber4
                            onClick={() => setScore(4)}
                            className="cursor-pointer text-gray-400 hover:text-purple-700"
                        />
                    )}
                </div>
                <div className="mr-1.5">
                    {score === 5 ? (
                        <TbHexagonNumber5Filled className="cursor-pointer text-purple-700" />
                    ) : (
                        <TbHexagonNumber5
                            onClick={() => setScore(5)}
                            className="cursor-pointer text-gray-400 hover:text-purple-700"
                        />
                    )}
                </div>
                <div className="mr-1.5">
                    {score === 6 ? (
                        <TbHexagonNumber6Filled className="cursor-pointer text-purple-700" />
                    ) : (
                        <TbHexagonNumber6
                            onClick={() => setScore(6)}
                            className="cursor-pointer text-gray-400 hover:text-purple-700"
                        />
                    )}
                </div>
                <div className="mr-1.5">
                    {score === 7 ? (
                        <TbHexagonNumber7Filled className="cursor-pointer text-purple-700" />
                    ) : (
                        <TbHexagonNumber7
                            onClick={() => setScore(7)}
                            className="cursor-pointer text-gray-400 hover:text-purple-700"
                        />
                    )}
                </div>
                <div className="mr-1.5">
                    {score === 8 ? (
                        <TbHexagonNumber8Filled className="cursor-pointer text-purple-700" />
                    ) : (
                        <TbHexagonNumber8
                            onClick={() => setScore(8)}
                            className="cursor-pointer text-gray-400 hover:text-purple-700"
                        />
                    )}
                </div>
                <div className="mr-1.5">
                    {score === 9 ? (
                        <TbHexagonNumber9Filled className="cursor-pointer text-blue-700" />
                    ) : (
                        <TbHexagonNumber9
                            onClick={() => setScore(9)}
                            className="cursor-pointer text-gray-400 hover:text-blue-700"
                        />
                    )}
                </div>
            </div>
        </>
    );
};

export default Score;
