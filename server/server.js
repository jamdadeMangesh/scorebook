const express = require('express');
const cors = require('cors');
const fs = require('fs');
const fsp = require('fs').promises;
const path = require('path');
const { v4: uuid } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

const MATCH_DIR = path.join(__dirname, 'data/matches');
const TEAM_DIR = path.join(__dirname, 'data/teams');

//ensure folder exists
//if(!fs.existsSync(MATCH_DIR && TEAM_DIR))

app.get("/getDetails", (req,res) => {
    res.json({
        status: "ok",
        message: "Backend is running"
    })
})


//create new team
app.post("/api/add-team", (req,res) => {
    const { teamName } = req.body;
    
    if(!teamName) {
        return res.status(400).json({
            message: "Teamname is empty"
        })
    }

    const safeFileName = teamName.replace(/[^a-z0-9_-]/gi, '_');
    const filePath = path.join(TEAM_DIR , `${safeFileName}.json`);

    //preent overwrite
    if(fs.existsSync(filePath)) {
        return res.json({
            status: 409,
            message: "Team already exists"
        })
    }

    //initial data when file is created
    const initialData = {
        teamName,
        players:[],
        createdAt: new Date().toISOString()
    };

    fs.writeFile(filePath, JSON.stringify(initialData, null ,2), (err) => {
        if(err) {
            return res.json({
                status: 500,
                message: "Failed to create team file"
            })
        }

        res.json({
            status: 201,
            message: 'Team created successfully'
        })
    })
});

//get teams
app.get('/api/get-teams', async (req,res) => {
    try{
        const files = await fsp.readdir(TEAM_DIR);
        const teams = [];

        for(const file of files) {
            if(file.endsWith('.json')){
                const content = await fsp.readFile(path.join(TEAM_DIR, file), 'utf-8');
                const teamData = JSON.parse(content);
                teams.push(teamData.teamName);
            }
        }

        console.log('teams:', teams);

        res.json({teams});
    }
    catch(err) {
        console.error(err);
        res.json({
            status: 500,
            message: 'Failed to fetch teams'
        })
    }
})

//add player into team
app.post('/api/add-players', async(req,res) => {
    const {teamName, playerName} = req.body;
    
    if(!teamName || !playerName) {
        return res.status(400).json({
            message: "Team name and player name is required"
        })
    }

    const safeFileName = teamName.replace(/[^a-z0-9_-]/gi, '_');
    const filePath = path.join(TEAM_DIR , `${safeFileName}.json`);

    try {
        await fsp.access(filePath);

        const teamDataRaw = await fsp.readFile(filePath, 'utf-8');
        const teamData = JSON.parse(teamDataRaw);

         // ensure players array exists
        if (!Array.isArray(teamData.players)) {
            teamData.players = [];
        }

        const exists = teamData.players.some(p => p.name.toLowerCase() === playerName.toLowerCase());
        
        if(exists) {
            return res.json({
                status: 409,
                message: 'Player already exists in this team'
            })
        }

        teamData.players.push(({
            id: uuid(),
            name: playerName,
            addedAt: new Date().toISOString()
        }))
        await fsp.writeFile(filePath, JSON.stringify(teamData,null,2));

        console.log('teamData:', teamData)

        res.json({
            status: 201,
            message: `${playerName} added successfully in ${teamName}`
        });
    } catch (error) {
        if(error.code === 'ENOENT'){
            return res.json({
                status: 401,
                message: 'Team not found'
            })
        }
        res.json({
            status: 500,
            message: "Failed to add player"
        })
    }
})

//get team with players

app.get('/api/get-team-players', async(req,res) => {
    try {
        const files = await fsp.readdir(TEAM_DIR);
        const teams = [];

        for(const file of files) {
            if(!file.endsWith('.json')) continue;

            const filePath = path.join(TEAM_DIR, file);
            const content = await fsp.readFile(filePath, 'utf-8');
            const teamData = JSON.parse(content)

            if (!Array.isArray(teamData.players)) {
                teamData.players = [];
            }

            teams.push({
                teamName: teamData.teamName,
                players: Array.isArray(teamData.players) ? teamData.players : [],
                createdAt: teamData.createdAt
            })
        }
        res.json(teams);
    } catch (error) {
        console.error(error);
        res.json({
            status: 500,
            message: 'Failed to fetch teams with players'
        })
    }
})

//delete player

app.delete('/api/delete-player', async(req,res) => {
    const {teamName, playerId} = req.body;
    console.log('teanmane:', teamName)
    console.log('playerId:', playerId)

     if(!teamName || !playerId) {
        return res.status(400).json({
            message: "Team name and player id is required"
        })
    }

    const safeFileName = teamName.replace(/[^a-z0-9_-]/gi, '_');
    const filePath = path.join(TEAM_DIR , `${safeFileName}.json`);

    try {
        await fsp.access(filePath);

        const raw= await fsp.readFile(filePath, 'utf-8');
        const teamData = JSON.parse(raw);

        const initialLength = teamData.players.length;

        teamData.players = teamData.players.filter(player => player.id !== playerId);

        if(teamData.players.length === initialLength) {
            return res.json({
                status: 404,
                message: 'Player not found'
            })
        }

        await fsp.writeFile(
            filePath,
            JSON.stringify(teamData, null,2)
        )

        res.json({
            status: 200,
            message: "Player deleted successfully"
        })
    } catch (error) {
        console.error(error);
       res.json({
            status: 500,
            message: 'Failed to delete players'
        })
    }

})

//get single team with players

app.get('/api/get-single-team-players', async(req,res) => {
    const { teamName } = req.query;

    if(!teamName) {
        return res.status(400).json({
            message: "Team name is required"
        })
    }

   


    try {
         const safeFileName = teamName.replace(/[^a-z0-9_-]/gi, '_');
        const filePath = path.join(TEAM_DIR , `${safeFileName}.json`);

         await fsp.access(filePath);
        //const teams = [];

        
        const content = await fsp.readFile(filePath, 'utf-8');
        const teamData = JSON.parse(content)

        if (!Array.isArray(teamData.players)) {
            teamData.players = [];
        }

        res.json({
            teamName: teamData.teamName,
            players: Array.isArray(teamData.players) ? teamData.players : [],
            createdAt: teamData.createdAt
        })
        
        //res.json(teams);
    } catch (error) {
        console.error(error);
        res.json({
            status: 500,
            message: 'Failed to fetch teams with players'
        })
    }
})
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})