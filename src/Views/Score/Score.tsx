import React, { useEffect, useState } from "react";
import Button from "../../Components/Button/Button";

import { useDispatch } from "react-redux";
import { add_score } from "../../store/Slice/MatchSlice";
import useFunctions from "../../hooks/useFunctions";
import Confetti from "../../Components/Confetti/Confetti";

const Score = () => {
    const [score, setScore] = useState<any>(null);
    const [isExploding, setIsExploding] = useState(false);

    const dispatch = useDispatch();

    const {
        getCurrentInning,
        getBatsmanOnStrike,
        getBowlerOnStrike,
        isNoBattingdata,
        isNoBowligdata,
    } = useFunctions();

    useEffect(() => {
        if (isExploding) {
            setTimeout(() => {
                setIsExploding(false);
            }, 2000);
        }
    }, [isExploding]);

    const scoreArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

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
        if (score >= 6) {
            setIsExploding(true);
        }
        setScore(null);
    };

    return (
        <>
            <div className="flex justify-between items-center border-b pb-2 border-gray-300 border-spacing-2">
                <div className="text-sm flex items-center">Score</div>
                {!isNoBattingdata && !isNoBowligdata && score !== null && (
                    <Button
                        color="purple"
                        text="Add Score"
                        classes="ml-2"
                        handleClick={addScore}
                    />
                )}
            </div>
            <div className="flex mt-4 text-3xl text-gray-600 flex-wrap">
                { scoreArray.map((item: number) => (
                    <div key={item} onClick={() => setScore(item)} className={`${score === item && "bg-purple-700 text-white border-purple-700 hover:text-white"} mr-1.5 mb-1.5 border-[2px] border-gray-400 w-[30px] h-[30px] flex justify-center items-center text-base font-bold rounded-full text-gray-400 cursor-pointer hover:border-purple-700 hover:text-purple-700`}>
                        {item}
                    </div>
                ))}
                {/* <div className={`${score === 1 && "bg-purple-700 text-white border-purple-700"} mr-1.5 mb-1.5 border-[2px] border-gray-400 w-[30px] h-[30px] flex justify-center items-center text-base font-bold rounded-full text-gray-400 cursor-pointer hover:border-purple-700 hover:text-purple-700`}>
                    1
                    {score === 0 ? (
                        <TbHexagonNumber0Filled className="cursor-pointer text-purple-700" />
                    ) : (
                        <TbHexagonNumber0
                            onClick={() => setScore(0)}
                            className="cursor-pointer text-gray-400 hover:text-purple-700"
                        />
                    )}
                </div> */}
                {/* <div className="mr-1.5">
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
                </div> */}
            </div>
            {isExploding && <Confetti />}
        </>
    );
};

export default Score;
