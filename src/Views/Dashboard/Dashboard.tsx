import React from 'react'
import Header from '../../Components/Header/Header'
import Batting from '../Batting/Batting'
import Bowling from '../Bowling/Bowling'
import Extras from '../Extras/Extras'
import Score from '../Score/Score'
import Statistics from '../Statistics/Statistics'
import Wickets from '../Wickets/Wickets'
import useFunctions from '../../hooks/useFunctions';
import Timeline from '../Timeline/Timeline'

const Dashboard = () => {
    const { getStatistics, getCurrentInning, getBattingData, getBowlingData } = useFunctions();
    console.log('getStatistics in dashboard:', getStatistics)
    console.log('getCurrentInning in dashboard:', getCurrentInning)
    console.log('getBattingData in dashboard:', getBattingData)
    console.log('getBowlingData in dashboard:', getBowlingData)
    //console.log('getAllData in dashboard:', getAllData)
    // const dashboardAllData = useSelector((state: any) => state)
    // console.log('dashboardAllData:',dashboardAllData);
    return (
        <>
            <Header />
            <div className="px-5 py-3">
                <div className="grid grid-cols-5 gap-4">
                    <div className="col-span-3 relative p-2 border bg-gray-100">
                        <Batting />
                    </div>
                    <div className="col-span-2 relative p-2 border bg-gray-100">
                        <Bowling />
                    </div>

                </div>

                <div className="grid grid-cols-5 gap-4 mt-4">
                    <div className="col-span-3">
                        <div className="grid grid-cols-3 gap-4">
                            <div className=' relative p-2 border bg-gray-100'>
                                <Score />
                            </div>
                            <div className=' relative p-2 border bg-gray-100'>
                                <Extras />
                            </div>
                            <div className=' relative p-2 border bg-gray-100'>
                                <Wickets />
                            </div>
                            
                        </div>
                        <div className="grid grid-cols gap-4 mt-4">
                                <div className="col-span-1 relative p-2 border bg-gray-100">
                                    <Timeline />
                                </div>
                            </div>
                    </div>
                    <div className="col-span-2 relative p-2 border bg-gray-100">
                        <Statistics />
                    </div>
                </div>
                
            </div>

        </>
    )
}

export default Dashboard