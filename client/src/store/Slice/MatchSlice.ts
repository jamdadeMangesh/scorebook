import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  Match,
  BattingData,
  BowlingData,
  calculateStrikerate,
  InningKey,
  Ball,
} from "../../interfaces/MatchData";

const createEmptyInning = () => ({
  battingData: [],
  bowlingData: [],
  balls: [],
  totalRuns: 0,
  wickets: 0,
  completed: false,
});

const initialStatistics = {
  team1: "",
  team2: "",
  tossWonBy: "",
  electedTo: "",
  remarks: "",
  teamBatting: "",
  teamBowling: "",
  teamBattingSecond: "",
  teamBowlingSecond: "",
  isFirstInningCompleteed: false,
};

const initialState: Match = {
  id: "",
  inningNumber: "inning1",
  statistics: initialStatistics,
  isMatchStarted: false,
  isMatchCompleted: false,
  innings: {
    inning1: createEmptyInning(),
    inning2: createEmptyInning(),
  },
};

export const matchSlice = createSlice({
  name: "match",
  initialState: initialState,
  reducers: {
    add_statistics: (state: Match, action) => {
      state.statistics = action.payload;
    },
    setMatchStarted: (state: Match, action) => {
      state.isMatchStarted = action.payload;
    },
    setMatchCompleted: (state: Match, action) => {
      state.isMatchCompleted = action.payload;
    },
    setMatchTeams: (
      state,
      action: PayloadAction<{ team1: string; team2: string }>
    ) => {
      state.statistics.team1 = action.payload.team1;
      state.statistics.team2 = action.payload.team2;
    },

    setToss: (
      state,
      action: PayloadAction<{
        tossWonBy: string;
        electedTo: string;
      }>
    ) => {
      const { tossWonBy, electedTo } = action.payload;

      state.statistics.tossWonBy = tossWonBy;
      state.statistics.electedTo = electedTo;

      const otherTeam =
        tossWonBy === state.statistics.team1
          ? state.statistics.team2
          : state.statistics.team1;

      if (electedTo === "Batting") {
        state.statistics.teamBatting = tossWonBy;
        state.statistics.teamBowling = otherTeam;
      } else {
        state.statistics.teamBowling = tossWonBy;
        state.statistics.teamBatting = otherTeam;
      }

      state.statistics.teamBattingSecond = state.statistics.teamBowling;
      state.statistics.teamBowlingSecond = state.statistics.teamBatting;
    },

    set_inning: (
      state: Match,
      action: PayloadAction<{ matchId: string; inningNum: any }>
    ) => {
      const { matchId, inningNum } = action.payload;
      state.id = matchId;
      state.inningNumber = inningNum;
    },

    setMatch: (state, action: PayloadAction<{ matchId: string }>) => {
      state.id = action.payload.matchId;
    },

    addBatsman: (
      state,
      action: PayloadAction<{ inning: InningKey; batsman: BattingData }>
    ) => {
      state.innings[action.payload.inning].battingData.push(
        action.payload.batsman
      );
    },

    addBowler: (
      state,
      action: PayloadAction<{ inning: InningKey; bowler: BowlingData }>
    ) => {
      state.innings[action.payload.inning].bowlingData.push(
        action.payload.bowler
      );
    },

    switchStrike: (
      state,
      action: PayloadAction<{ inning: InningKey; batsmanId: string }>
    ) => {
      const batters = state.innings[action.payload.inning].battingData;

      batters.forEach((b) => (b.onStrike = b.id === action.payload.batsmanId));
    },

    switchBowler: (
      state,
      action: PayloadAction<{ inning: InningKey; bowlerId: string }>
    ) => {
      const bowlers = state.innings[action.payload.inning].bowlingData;
      bowlers.forEach(
        (b) => (b.currentBowler = b.id === action.payload.bowlerId)
      );
    },

    recordBall: (
      state,
      action: PayloadAction<{ inning: InningKey; ball: Ball }>
    ) => {
      const inning = state.innings[action.payload.inning];
      const { ball } = action.payload;

      inning.balls.push(ball);

      const striker: any = inning.battingData.find((b) => b.onStrike);
      const bowler = inning.bowlingData.find((b) => b.currentBowler);

      // ✅ Handle run-out completed runs
      if (ball.wicket?.type === "RunOut" && ball.wicket.completedRuns) {
        inning.totalRuns += ball.wicket.completedRuns;
      } else {
        // 1️⃣ TEAM RUNS (always increase)
        inning.totalRuns += ball.batRuns;
      }

      // 2️⃣ LEGAL BALL HANDLING
      if (ball.isLegal) {
        striker && (striker.balls += 1);
        bowler && (bowler.balls += 1);
      }

      const isExtra = Boolean(ball.extras);
      const extraType = ball.extras?.type;

      const isByeOrLegBye = extraType === "byes" || extraType === "legByes";

      // 3️⃣ BATSMAN RUNS (ONLY if NOT extras)
      if (striker && !isExtra) {
        striker.runs += ball.batRuns;
        striker.strikeRate = calculateStrikerate(striker.runs, striker.balls);

        if (ball.batRuns === 4) striker.fours += 1;
        if (ball.batRuns === 6) striker.sixes += 1;
        if (ball.batRuns === 8) striker.eights += 1;
      }

      // 4️⃣ BOWLER RUNS
      if (bowler) {
        // Bowler conceded runs except byes/leg-byes
        if (!isByeOrLegBye) {
          bowler.runs += ball.batRuns;
        }

        if (ball.extras) {
          inning.totalRuns += ball.extras.runs;
          if (!isByeOrLegBye && bowler) {
            bowler.extras += ball.extras.runs;
          }
        }
        if (ball.wicket?.type === "RunOut" && ball.wicket.completedRuns) {
          bowler.runs += ball.wicket.completedRuns;
        }
      }

      // 5️⃣ WICKET HANDLING
      if (ball.wicket) {
        inning.wickets += 1;

        if (striker && bowler) {
          striker.out = ball.wicket.type;
          //striker.bowler = bowler.bowlerName;
          // if(ball.wicket.type === "RunOut") {
          //   striker.bowler = "-"
          // } else {
          //   striker.bowler =  bowler.bowlerName;
          // }

          striker.bowler =
            ball.wicket.type === "RunOut" ? "-" : bowler.bowlerName;
          striker.onStrike = false;
        }

        // Bowler wicket only for valid types
        if (bowler && ball.wicket.type !== "RunOut") {
          bowler.wickets += 1;
        }
      }

      // 6️⃣ STRIKE CHANGE ON ODD RUNS (LEGAL ONLY)
      if (ball.isLegal && ball.batRuns % 2 === 1) {
        const activeBatters = inning.battingData.filter((b) => b.out === "-");
        if (activeBatters.length === 2) {
          activeBatters.forEach((b) => (b.onStrike = !b.onStrike));
        }
      }

      // 7️⃣ END OF OVER LOGIC
      if (
        ball.isLegal &&
        inning.balls.filter((b) => b.isLegal).length % 6 === 0
      ) {
        const activeBatters = inning.battingData.filter((b) => b.out === "-");
        if (activeBatters.length === 2) {
          activeBatters.forEach((b) => (b.onStrike = !b.onStrike));
        }

        // force UI to select next bowler
        inning.bowlingData.forEach((b) => (b.currentBowler = false));
      }
    },

    completeInning: (state) => {
      //   state.innings[state.inningNumber].completed = true;
      //   state.inningNumber =
      //     state.inningNumber === "inning1" ? "inning2" : "inning1";
      state.innings[state.inningNumber].completed = true;

      if (state.inningNumber === "inning1") {
        state.statistics.isFirstInningCompleteed = true;
        state.inningNumber = "inning2";
      }
    },

    endMatch: (
      state,
      action: PayloadAction<{ wonBy: string; description: string }>
    ) => {
      state.result = action.payload;
      state.innings.inning2.completed = true;
    },

    resetMatch: () => initialState,
  },
});

export const {
  add_statistics,
  setMatchStarted,
  setMatchCompleted,
  set_inning,
  setMatchTeams,
  setToss,
  setMatch,
  addBatsman,
  addBowler,
  recordBall,
  switchBowler,
  switchStrike,
  completeInning,
  resetMatch,
  endMatch,
} = matchSlice.actions;
export const matchReducer = matchSlice.reducer;
