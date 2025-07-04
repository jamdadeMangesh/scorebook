import React, { useEffect, useState } from "react";
import Button from "../../Components/Button/Button";
import useFunctions from "../../hooks/useFunctions";
import { useDispatch } from "react-redux";
import { add_wicket } from "../../store/Slice/MatchSlice";
import ConfettiExplosion from 'react-confetti-explosion';
import Confetti from "../../Components/Confetti/Confetti";

const Wickets = () => {
    //const for all wicketType
    const wicketType = ['Bowled', 'Caught', 'Stumped', 'RunOut', 'Retired'];

    const [wickets, setWickets] = useState("");
    const [isExploding, setIsExploding] = useState(false);

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
        setWickets(str);
    };

    const addWicket = () => {
        setIsExploding(true);
        dispatch(
            add_wicket({
                currentInning: getCurrentInning,
                wicketType: wickets,
                batsmanId: getBatsmanOnStrike(),
                bowlerId: getBowlerOnStrike(),
            })
        );
        setWickets('')
    };

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
            {isExploding && <Confetti />}
        </>
    );
};

export default Wickets;
