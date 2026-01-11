import React, { useEffect, useState } from "react";
import Button from "../../Components/Button/Button";

import { useDispatch } from "react-redux";
import { recordBall } from "../../store/Slice/MatchSlice";
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
            recordBall({
                inning: getCurrentInning,
                ball: {
                    batRuns: score,
                    isLegal: true,
                },
            })
        );
        // dispatch(
        //     add_score({
        //         currentInning: getCurrentInning,
        //         score: score,
        //         onStrikeBatsmanId: getBatsmanOnStrike(),
        //         onStrikeBowlerId: getBowlerOnStrike(),
        //     })
        // );
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
                {scoreArray.map((item: number) => (
                    <div
                        key={item}
                        onClick={() => setScore(item)}
                        className={`${score === item &&
                            "bg-purple-700 text-white border-purple-700 hover:text-white"
                            } mr-1.5 mb-1.5 border-[2px] border-gray-400 w-[30px] h-[30px] flex justify-center items-center text-base font-bold rounded-full text-gray-400 cursor-pointer hover:border-purple-700 hover:text-purple-700`}
                    >
                        {item}
                    </div>
                ))}
            </div>
            {isExploding && <Confetti />}
        </>
    );
};

export default Score;
