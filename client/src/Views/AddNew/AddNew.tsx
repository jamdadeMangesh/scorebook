import React from 'react'
import { useNavigate } from 'react-router-dom';
import Button from '../../Components/Button/Button';
import AddTeam from '../../Components/AddTeam/AddTeam';
import AddPlayer from '../../Components/AddPlayer/AddPlayer';
import AllTeamPlayers from '../../Components/AllTeamPlayers/AllTeamPlayers';

const AddNew = () => {
    const navigate = useNavigate();
    return (
        <>
            <div className="w-full bg-gray-200 flex px-5 py-3 items-center justify-between">
                <div className="text-sm font-medium flex items-center">
                    Add New Team & Players
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
                    <div className="col-span-1"><AddTeam /></div>
                    <div className="col-span-1"><AddPlayer /></div>
                </div>
                <div>
                    <AllTeamPlayers />
                </div>
            </div>
        </>
    )
}

export default AddNew