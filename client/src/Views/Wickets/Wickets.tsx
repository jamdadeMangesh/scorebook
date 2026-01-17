import React, { useEffect, useState } from "react";
import Button from "../../Components/Button/Button";
import useFunctions from "../../hooks/useFunctions";
import { useDispatch } from "react-redux";
import { recordBall } from "../../store/Slice/MatchSlice";
import Confetti from "../../Components/Confetti/Confetti";
import { IoIosClose } from "react-icons/io";

const Wickets = () => {
    //const for all wicketType
    const wicketType = ['Bowled', 'Caught', 'Stumped', 'RunOut', 'Retired'];

    const [wickets, setWickets] = useState("");
    const [isExploding, setIsExploding] = useState(false);
    const [showPopOver, setShowPopOver] = useState(false);
    const [runoutRuns, setRunoutRuns] = useState({
        Type: "RunOut",
        Runs: 0,
        selected: "",
    });

    useEffect(() => {
        if (isExploding) {
            setTimeout(() => {
                setIsExploding(false);
            }, 2000);
        }
    }, [isExploding])

    const { getCurrentInning, getBowlerOnStrike, getBatsmanOnStrike, isNoBattingdata, isNoBowligdata } =
        useFunctions();
    const dispatch = useDispatch();

    const onWicketsClick = (str: string) => {
        setShowPopOver(false);
        if (str === "RunOut") {
            setShowPopOver(true);
        }
        setWickets(str);
    };


    const runoutTypes = [
        { "name": "Rn", "value": 0 },
        { "name": "1 + Rn", "value": 1 },
        { "name": "2 + Rn", "value": 2 },
        { "name": "3 + Rn", "value": 3 },
        { "name": "4 + Rn", "value": 4 }
    ]

    const addWicket = () => {
        setIsExploding(true);

        if (wickets === 'Bowled' || wickets === 'Stumped' || wickets === 'Caught') {
            dispatch(recordBall({
                inning: getCurrentInning,
                ball: {
                    batRuns: 0,
                    isLegal: true,
                    wicket: {
                        type: wickets,
                        batsmanId: getBatsmanOnStrike(),
                        bowlerId: getBowlerOnStrike(),
                        completedRuns: 0
                    }
                }
            }))
        } else if (wickets === 'RunOut') {
            dispatch(recordBall({
                inning: getCurrentInning,
                ball: {
                    batRuns: 0,
                    isLegal: true,
                    wicket: {
                        type: wickets,
                        batsmanId: getBatsmanOnStrike(),
                        bowlerId: getBowlerOnStrike(),
                        completedRuns: runoutRuns.Runs
                    }
                }
            }))
        }

        setWickets('')
    };

    const closePopover = () => {
        setShowPopOver(false);
        setWickets('');
        setRunoutRuns({
            Type: "",
            Runs: 0,
            selected: "",
        })
    }

    return (
        <>
            <div className="flex justify-between items-center border-b pb-2 border-gray-300 border-spacing-2">
                <div className="text-sm flex items-center">Wicket</div>
                {!isNoBattingdata && !isNoBowligdata && wickets !== '' && <Button
                    color="red"
                    text="Add Wicket"
                    classes="ml-2"
                    handleClick={addWicket}
                />}
            </div>
            <div className="flex mt-5 text-xs text-gray-600 flex-wrap">

                {/* <div
                    className={` ${wickets === "Bowled" ? "text-white bg-red-500" : "text-red-600"
                        } px-4 py-1.5 mr-2 mb-2 border cursor-pointer rounded-xl border-red-500  hover:bg-red-500 hover:text-white`}
                    onClick={() => onWicketsClick("Bowled")}
                >
                    Bowled
                </div> */}
                {wicketType.map((type) => (
                    <span
                        key={type}
                        className={`${wickets === type ? "text-white bg-red-500" : "text-red-600"} bg-red-100 text-red-800 cursor-pointer text-xs font-medium mb-2 me-2 px-2.5 py-0.5 rounded border border-red-300`}
                        onClick={() => onWicketsClick(type)}>
                        {type}
                    </span>
                ))}

            </div>

            {showPopOver && (
                <div className="relative block w-full mt-4">
                    <p>Select one option</p>
                    <IoIosClose
                        className="absolute z-10 right-2 top-0 text-lg cursor-pointer"
                        onClick={() => closePopover()}
                    />
                    <div className="my-2.5">
                        {runoutTypes.map((item: any) => (
                            <span
                                key={item.type}
                                className={` ${item.name === runoutRuns.selected
                                    ? "bg-red-800 text-white"
                                    : "text-gray-800 bg-gray-100"
                                    } inline-block bg-gray-100  cursor-pointer text-xs font-medium mb-2 me-2 px-2.5 py-0.5 rounded   border border-gray-300`}
                                onClick={() =>
                                    setRunoutRuns({
                                        Type: "RunOut",
                                        Runs: item.value,
                                        selected: item.name,
                                    })
                                }
                            >
                                {item.name}
                            </span>
                        ))}
                    </div>
                </div>
            )}
            {isExploding && <Confetti />}
        </>
    );
};

export default Wickets;
