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

//save a match and create separate file for each match
app.post("/api/save-match", (req,res) => {
    const { matchData } = req.body;

    if(!matchData) {
        return res.status(400).json({
            message: "Matchdata is required to save match"
        }) 
    }

    const { team1, team2 } = matchData.statistics;
    const matchId = matchData.id;

    const matchFileName = `Match_${team1}_vs_${team2}_${matchId}`;
    const filePath = path.join(MATCH_DIR, `${matchFileName}.json`);

    try {
        fs.writeFileSync(filePath, JSON.stringify(matchData, null, 2));

        res.json({
            status: 200,
            message: `Match between ${team1} vs ${team2} saved successfully.`
        })    
    } catch (error) {
        console.error(error);
        res.json({
            status: 500,
            message: 'Failed to save match data'
        })
    }
});

//get all matches to show in table
app.get("/api/matches",  async(req,res) => {
    try {
        const files = await fs.promises.readdir(MATCH_DIR);

        const matches = await Promise.all(
            files.filter((file) => file.endsWith('.json'))
            .map(async (file) => {
                const filePath = path.join(MATCH_DIR, file);
                const data = JSON.parse(await fs.promises.readFile(filePath, "utf8"));

                return {
                    fileName: file,
                    matchId: data.id,
                    team1: data.statistics.team1,
                    team2: data.statistics.team2,
                    inning1Score: `${data.innings.inning1.totalRuns} / ${data.innings.inning1.wickets}`,
                    inning2Score: data.innings.inning2.completed ? `${data.innings.inning2.totalRuns} / ${data.innings.inning2.wickets}` : "-",
                    status: data.innings.inning2.completed ? "Completed" : "In Progress",
                    result: data.result?.description || '-',
                    //updatedAt: data.updatedAt || null
                }

            })
        );
        res.json({
            status: 200,
            message: "All matches fetched successfully",
            matches
        })
    } catch (error) {
        res.json({
            status: 500,
            message: 'Failed to fetch match data'
        })
    }
})

//points table
app.get("/api/points-table", async (req, res) => {
  try {
    const files = await fs.promises.readdir(MATCH_DIR);
    const table = {};

    for (const file of files) {
      if (!file.endsWith(".json")) continue;

      const data = JSON.parse(
        await fs.promises.readFile(path.join(MATCH_DIR, file), "utf8")
      );

      if (!data.result) continue; // skip incomplete matches

      const teams = [
        data.statistics.team1,
        data.statistics.team2,
      ];

      teams.forEach((team) => {
        if (!table[team]) {
          table[team] = {
            team,
            played: 0,
            wins: 0,
            losses: 0,
            points: 0,
            runsFor: 0,
            oversFaced: 0,
            runsAgainst: 0,
            oversBowled: 0,
            netRunRate: 0,
          };
        }
      });

      const t1 = data.statistics.team1;
      const t2 = data.statistics.team2;

      const i1 = data.innings.inning1;
      const i2 = data.innings.inning2;

      table[t1].played += 1;
      table[t2].played += 1;

      table[t1].runsFor += i1.totalRuns;
      table[t1].oversFaced += i1.balls.filter(b => b.isLegal).length / 6;
      table[t1].runsAgainst += i2.totalRuns;
      table[t1].oversBowled += i2.balls.filter(b => b.isLegal).length / 6;

      table[t2].runsFor += i2.totalRuns;
      table[t2].oversFaced += i2.balls.filter(b => b.isLegal).length / 6;
      table[t2].runsAgainst += i1.totalRuns;
      table[t2].oversBowled += i1.balls.filter(b => b.isLegal).length / 6;

      const winner = data.result.wonBy;

      table[winner].wins += 1;
      table[winner].points += 2;

      const loser = winner === t1 ? t2 : t1;
      table[loser].losses += 1;
    }

    Object.values(table).forEach((team) => {
      team.netRunRate =
        team.oversFaced && team.oversBowled
          ? (
              team.runsFor / team.oversFaced -
              team.runsAgainst / team.oversBowled
            ).toFixed(2)
          : "0.00";
    });

    res.status(200).json(Object.values(table));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to calculate points table" });
  }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})