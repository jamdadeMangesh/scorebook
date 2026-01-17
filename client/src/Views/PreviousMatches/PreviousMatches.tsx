import React, { useEffect, useState } from 'react'
import Button from '../../Components/Button/Button';
import { useNavigate } from 'react-router-dom';
import { MatchRow, PointsRow, SingleMatch } from '../../interfaces/MatchData';

const PreviousMatches = () => {
    const [matchData, setMatchData] = useState<SingleMatch[]>([]);
    const [pointsTable, setPointsTable] = useState<PointsRow[]>([]);

    const navigate = useNavigate();

    useEffect(() => {
        fetch("/api/matches")
            .then((res) => res.json())
            .then(data => setMatchData(data.matches))
    }, []);

    useEffect(() => {
        fetch("/api/points-table")
            .then((res) => res.json())
            .then(setPointsTable);
    }, []);

    return (
        <>
            <div className="w-full bg-gray-200 flex px-5 py-3 items-center justify-between">
                <div className="text-sm font-medium flex items-center">
                    Previous Matches
                </div>
                <Button
                    color="green"
                    text="Back to Dashboard"
                    classes="ml-2"
                    handleClick={() => navigate("/")}
                />
            </div>
            <div className="px-5 py-3">
                <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="col-span-1">
                        {matchData?.length > 0 ? (
                            <>
                                <div className="relative overflow-x-auto shadow-md sm:rounded-lg pt-2">
                                    <table className="w-full text-xs rtl:text-right text-gray-500 dark:text-gray-400">
                                        <thead className="text-xs text-white bg-gray-500 text-center">
                                            <tr>
                                                <th scope="col" className="px-3 py-2 w-[5%] text-left">
                                                    Teams
                                                </th>
                                                <th scope="col" className="w-[10%]">
                                                    1st Inning score
                                                </th>
                                                <th scope="col" className="w-[10%]">
                                                    2nd Inning score
                                                </th>
                                                <th scope="col" className="w-[5%]">
                                                    Status
                                                </th>
                                                <th scope="col" className="w-[15%]">
                                                    Result
                                                </th>
                                                <th scope="col" className="w-[5%]">
                                                    Action
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-[11px] text-center">
                                            {matchData.map(
                                                (match: SingleMatch) => (
                                                    <tr
                                                        className="bg-white border-b"
                                                        key={match.id}
                                                        aria-disabled
                                                    >
                                                        <td
                                                            scope="row"
                                                            className="text-left px-3 py-1.5 font-medium text-gray-900 whitespace-nowrap dark:text-white w-[5%]"
                                                        >
                                                            {match.team1} vs {match.team2}
                                                        </td>
                                                        <td className="w-[10%]">{match.inning1Score}</td>
                                                        <td className="w-[10%]">{match.inning2Score}</td>
                                                        <td className="w-[5%]">{match.status}</td>
                                                        <td className="w-[15%]">{match.result}</td>
                                                        <td className="w-[5%]">View</td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        ) : (
                            <div className="text-center p-4 text-xs">No match data</div>
                        )}
                    </div>
                    <div className="col-span-1">
                        {pointsTable?.length > 0 ? (
                            <>
                                <div className="relative overflow-x-auto shadow-md sm:rounded-lg pt-2">
                                    <table className="w-full text-xs rtl:text-right text-gray-500 dark:text-gray-400">
                                        <thead className="text-xs text-white bg-gray-500 text-center">
                                            <tr>
                                                <th scope="col" className="px-3 py-2 w-[5%] text-left">
                                                    Teams
                                                </th>
                                                <th scope="col" className="w-[10%]">
                                                    Played
                                                </th>
                                                <th scope="col" className="w-[10%]">
                                                    Won
                                                </th>
                                                <th scope="col" className="w-[5%]">
                                                    Loss
                                                </th>
                                                <th scope="col" className="w-[15%]">
                                                    NRR
                                                </th>
                                                <th scope="col" className="w-[5%]">
                                                    Points
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-[11px] text-center">
                                            {pointsTable
                                                .sort((a, b) => b.points - a.points) // max points first
                                                .map((point: PointsRow) => (
                                                    <tr
                                                        className="bg-white border-b"
                                                        key={point.team}
                                                        aria-disabled
                                                    >
                                                        <td
                                                            scope="row"
                                                            className="text-left px-3 py-1.5 font-medium text-gray-900 whitespace-nowrap dark:text-white w-[5%]"
                                                        >
                                                            {point.team}
                                                        </td>
                                                        <td className="w-[10%]">{point.played}</td>
                                                        <td className="w-[10%]">{point.wins}</td>
                                                        <td className="w-[5%]">{point.losses}</td>
                                                        <td className="w-[15%]">{point.netRunRate}</td>
                                                        <td className="w-[5%]">{point.points}</td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        ) : (
                            <div className="text-center p-4 text-xs">No points table data</div>
                        )}
                    </div>
                </div>
                <div>
                    Details
                </div>
            </div>
        </>
    )
}

export default PreviousMatches