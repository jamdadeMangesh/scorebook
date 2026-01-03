import React, { useEffect, useState } from 'react'
import { notify } from '../Toast/Toast'
import Button from '../Button/Button'
import { RiDeleteBinLine } from "react-icons/ri";
import Confirm from '../Confirm/Confirm';


const AllTeamPlayers = () => {
    const [teamsInfo, setTeamsInfo] = useState([]);
    const [openConfirmModal, setOpenConfirmModal] = useState(false);
    const [playerInfo, setPlayerInfo] = useState({ teamName: "", playerId: "" });

    const fetchAllTeams = async () => {
        try {
            const res = await fetch('/api/get-team-players');
            const data = await res.json();
            console.log('team data:', data)
            setTeamsInfo(data || {})
        } catch (error) {
            console.error(error);
            notify("Failed to fetch all teams info", "error");
        }
    }
    useEffect(() => {
        fetchAllTeams();
    }, [])

    const DeletePlayer = async (teamName: string, playerId: string) => {
        if (openConfirmModal) {
            const res = await fetch('/api/delete-player', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ teamName: teamName, playerId: playerId })
            })

            const result = await res.json();

            if (result.status === 200) {
                setOpenConfirmModal(false);
                notify(result.message, "success");
                fetchAllTeams();
            }
        }
    }
    console.log('teamsInfo:', teamsInfo);
    return (
        <>
            <div className="mt-4 bg-white rounded-lg shadow-md dark:bg-gray-700 border ">
                <div className="flex items-center justify-between px-3 py-3  border-b rounded-t dark:border-gray-600">
                    <div className="text-md font-semibold  text-gray-900 dark:text-white">
                        All Teams and players
                    </div>
                    <Button
                        color="green"
                        text="Refresh"
                        handleClick={() => fetchAllTeams()}
                        classes="ml-2"
                    />
                </div>
                <div className="border-b rounded-t dark:border-gray-600">
                    <div className="grid grid-cols-6">
                        {Object.values(teamsInfo).map((team: any) => (
                            <div className="col-span-1 border-r border-b px-3 py-3" key={team.teamName}>
                                <div className="flex items-center text-sm font-semibold bg-green-600 rounded-sm px-4 py-2 shadow-md text-white">
                                    {team.teamName}
                                </div>
                                {team.players.length > 0 ?
                                    team.players.map((player: any) => (
                                        <div className='border p-2 border-t-0 text-xs flex justify-between' key={player.id}>
                                            <div>{player.name}</div>
                                            <div><RiDeleteBinLine className='text-red-600 cursor-pointer' onClick={() => {
                                                setPlayerInfo({
                                                    teamName: team.teamName,
                                                    playerId: player.id
                                                });
                                                setOpenConfirmModal(true);
                                            }} /></div>
                                        </div>
                                    )) :
                                    <div className='text-xs text-center mt-2' >
                                        No Player added
                                    </div>}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Confirm
                openConfirmModal={openConfirmModal}
                setOpenConfirmModal={setOpenConfirmModal}
                title="Delete player?"
                description="Are you sure you want to delete this player from team?"
                buttonTitle="Delete Player"
                onSubmitClick={() => DeletePlayer(playerInfo.teamName, playerInfo.playerId)}
            />
        </>
    )
}

export default AllTeamPlayers