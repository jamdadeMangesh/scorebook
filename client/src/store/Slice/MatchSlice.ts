import { createSlice, current, PayloadAction } from "@reduxjs/toolkit";
import {
  Match,
  //Inning,
  BattingData,
  //Extras,
  BowlingData,
  //scoreMapping,
  calculateStrikerate,
  //IExtrasTRuns,
  //filteredTimeline,
  //Statistics,
  InningKey,
  Ball,
} from "../../interfaces/MatchData";
import useFunctions from "../../hooks/useFunctions";

// const initialState: Match = {
//   id: "",
//   statistics: {
//     team1: "",
//     team2: "",
//     tossWonBy: "",
//     playersCount: 0,
//     remarks: "",
//     teamBatting: "",
//     teamBowling: "",
//     teamBattingSecond: "",
//     teamBowlingSecond: "",
//     isFirstInningCompleteed: false,
//   },
//   inningNumber: "",
//   result: {
//     wonBy: "",
//     resultDescription: "",
//   },
//   batting: {
//     inning1: {
//       battingData: [],
//       score: 0,
//       overs: 0,
//       wickets: 0,
//       extras: {
//         wides: 0,
//         noBalls: 0,
//         byes: 0,
//         legByes: 0,
//       },
//       timeline: {
//         scoreTimeline: [],
//       },
//     },
//     inning2: {
//       battingData: [],
//       score: 0,
//       overs: 0,
//       wickets: 0,
//       extras: {
//         wides: 0,
//         noBalls: 0,
//         byes: 0,
//         legByes: 0,
//       },
//       timeline: {
//         scoreTimeline: [],
//       },
//     },
//     // inning: "",
//     // battingData:
//     // [
//     //     {
//     //         id: "",
//     //         batsmanName: "",
//     //         runs: 0,
//     //         balls: 0,
//     //         fours: 0,
//     //         sixes: 0,
//     //         eights: 0,
//     //         strikeRate: 0,
//     //         out: "",
//     //         bowler: "",
//     //     }
//     // ],
//     // extras: {
//     //     wides: 0,
//     //     noBalls: 0,
//     //     byes: 0,
//     //     legByes: 0,
//     // }
//   },
//   bowling: {
//     inning1: {
//       bowlingData: [],
//       extras: {
//         wides: 0,
//         noBalls: 0,
//         byes: 0,
//         legByes: 0,
//       },
//     },
//     inning2: {
//       bowlingData: [],
//       extras: {
//         wides: 0,
//         noBalls: 0,
//         byes: 0,
//         legByes: 0,
//       },
//     },
//   },
// };

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
      console.log("action.payload.inning", action.payload.inning);
      const batters = state.innings[action.payload.inning].battingData;

      batters.forEach((b) => (b.onStrike = b.id === action.payload.batsmanId));

      // const activeBatters = batters.filter((b) => b.out === "-");

      // if (activeBatters.length !== 2) return;

      // activeBatters[0].onStrike = !activeBatters[0].onStrike;
      // activeBatters[1].onStrike = !activeBatters[1].onStrike;
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

      console.log("ball:", ball);
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
    },

    resetMatch: () => initialState,
    // add_batsman: (
    //   state: Match,
    //   action: PayloadAction<{
    //     currentInning: string;
    //     batsmanData: BattingData;
    //     extras?: Extras;
    //   }>
    // ) => {
    //   const { currentInning, batsmanData, extras } = action.payload;
    //   const inningKey = currentInning === "inning1" ? "inning1" : "inning2";
    //   const batterInfo = state!.batting![inningKey].battingData;

    //   if (batterInfo) {
    //     batterInfo?.push(batsmanData);
    //   }
    // },
    // add_bowler: (
    //   state: Match,
    //   action: PayloadAction<{ currentInning: string; bowlerData: BowlingData }>
    // ) => {
    //   const { currentInning, bowlerData } = action.payload;
    //   const inningKey = currentInning === "inning1" ? "inning1" : "inning2";
    //   const bowlerInfo = state!.bowling![inningKey].bowlingData;
    //   if (bowlerInfo) {
    //     bowlerInfo?.push(bowlerData);
    //   }
    // },
    // switch_strike: (
    //   state: Match,
    //   action: PayloadAction<{ currentInning: string; batterId: string }>
    // ) => {
    //   const { currentInning, batterId } = action.payload;
    //   const inningKey = currentInning === "inning1" ? "inning1" : "inning2";
    //   const battingInfo = state!.batting![inningKey].battingData;
    //   const changeStrikeForOnStrikeBatter = battingInfo?.find(
    //     (value) => value.onStrike === true
    //   );
    //   if (changeStrikeForOnStrikeBatter) {
    //     changeStrikeForOnStrikeBatter.onStrike = false;
    //   }
    //   const changeStrikeData = battingInfo?.find(
    //     (value) => value.onStrike === false && value.id === batterId
    //   );

    //   if (changeStrikeData) {
    //     changeStrikeData.onStrike = true;
    //   }
    // },
    // switch_bowler: (
    //   state: Match,
    //   action: PayloadAction<{ currentInning: string; bowlerId: string }>
    // ) => {
    //   const { currentInning, bowlerId } = action.payload;
    //   const inningKey = currentInning === "inning1" ? "inning1" : "inning2";
    //   const bowlingInfo = state!.bowling![inningKey].bowlingData;
    //   const changeStrikeForOnStrikeBatter = bowlingInfo?.find(
    //     (value) => value.currentBowler === true
    //   );
    //   if (changeStrikeForOnStrikeBatter) {
    //     changeStrikeForOnStrikeBatter.currentBowler = false;
    //   }
    //   const changeStrikeData = bowlingInfo?.find(
    //     (value) => value.currentBowler === false && value.id === bowlerId
    //   );

    //   if (changeStrikeData) {
    //     changeStrikeData.currentBowler = true;
    //   }
    // },
    // add_score: (
    //   state: Match,
    //   action: PayloadAction<{
    //     currentInning?: string;
    //     score?: any;
    //     onStrikeBatsmanId?: string;
    //     onStrikeBowlerId?: string;
    //   }>
    // ) => {
    //   const { currentInning, score, onStrikeBatsmanId, onStrikeBowlerId } =
    //     action.payload;

    //   const inningKey = currentInning === "inning1" ? "inning1" : "inning2";
    //   const addingScore = state!.batting![inningKey];

    //   //adding score to total runs
    //   if (addingScore) {
    //     addingScore.score += score;

    //     //add 1 ball to overs
    //     addingScore.overs += 1;

    //     //add runs to score timeline
    //     addingScore?.timeline.scoreTimeline?.push(score);
    //   }

    //   //adding score to batter
    //   const addingScoreToBatter = state!.batting![inningKey].battingData;
    //   const addScoreToStrikerBatsman: any = addingScoreToBatter?.find(
    //     (value) => value.id === onStrikeBatsmanId
    //   );

    //   if (addScoreToStrikerBatsman) {
    //     addScoreToStrikerBatsman.runs += score;

    //     //adding balls to batter
    //     addScoreToStrikerBatsman.balls += 1;
    //     addScoreToStrikerBatsman.strikeRate = calculateStrikerate(
    //       addScoreToStrikerBatsman.runs,
    //       addScoreToStrikerBatsman.balls
    //     );
    //   }

    //   //add 4,6,8 count to batsman
    //   const scoreKey: any = scoreMapping[score];
    //   if (scoreKey && addScoreToStrikerBatsman) {
    //     addScoreToStrikerBatsman![scoreKey] += 1;
    //   }

    //   /*ADD SCORE TO BOWLER */

    //   //adding score to batter
    //   const addingScoreToBowler = state!.bowling![inningKey].bowlingData;
    //   const addScoreToStrikerBowler: any = addingScoreToBowler?.find(
    //     (value) => value.id === onStrikeBowlerId
    //   );
    //   if (addScoreToStrikerBowler) {
    //     addScoreToStrikerBowler.runs += score;

    //     //adding balls to batter
    //     addScoreToStrikerBowler.overs += 1;
    //   } },
    // add_wicket: (
    //   state: Match | any,
    //   action: PayloadAction<{
    //     currentInning: string;
    //     wicketType: any;
    //     bowlerId: string;
    //     batsmanId: string;
    //   }>
    // ) => {
    //   const { wicketType, currentInning, bowlerId, batsmanId } = action.payload;

    //   //adding wicket to batter
    //   const getCurrentInningBattingData =
    //     state!.batting![currentInning]?.battingData;
    //   const addWicketToStrikerBatsman = getCurrentInningBattingData?.find(
    //     (value: Match) => value.id === batsmanId
    //   );

    //   //adding wicket to bowler
    //   const getCurrentInningBowlinggData =
    //     state!.bowling![currentInning]?.bowlingData;
    //   const addWicketToStrikerBowler = getCurrentInningBowlinggData?.find(
    //     (value: Match) => value.id === bowlerId
    //   );

    //   const addingWickets = state!.batting![currentInning];

    //   //add wicket data to out batsman
    //   if (addWicketToStrikerBatsman) {
    //     addWicketToStrikerBatsman.out = wicketType;
    //     addWicketToStrikerBatsman.onStrike = false;
    //     addWicketToStrikerBatsman.bowler = addWicketToStrikerBowler?.bowlerName;
    //     addWicketToStrikerBatsman.balls += 1;
    //   }

    //   //add wicket data to out bowler
    //   if (addWicketToStrikerBowler) {
    //     addWicketToStrikerBowler.wicket += 1;
    //     addWicketToStrikerBowler.overs += 1;
    //   }

    //   //add wicket count in total score
    //   if (addingWickets) {
    //     addingWickets.overs += 1;
    //     addingWickets.wickets += 1;
    //     addingWickets?.timeline.scoreTimeline?.push("W");
    //   }
    // },
    // add_extras: (
    //   state: any,
    //   action: PayloadAction<{
    //     currentInning: string;
    //     extrasRuns: IExtrasTRuns;
    //     batsmanId: string;
    //     bowlerId: string;
    //   }>
    // ) => {
    //   const { currentInning, extrasRuns, batsmanId, bowlerId } = action.payload;

    //   //get current inning batting data
    //   const getCurrentInningBattingData =
    //     state!.batting![currentInning]?.battingData;

    //   const addExtrasToStrikerBatsman = getCurrentInningBattingData?.find(
    //     (value: Match) => value.id === batsmanId
    //   );

    //   //get current inning bowling data
    //   const getCurrentInningBowlinggData =
    //     state!.bowling![currentInning]?.bowlingData;

    //   const addExtrasToStrikerBowler = getCurrentInningBowlinggData?.find(
    //     (value: Match) => value.id === bowlerId
    //   );

    //   //total score
    //   const addingScore = state!.batting![currentInning];

    //   switch (extrasRuns.Type) {
    //     case "wide":
    //     case "noBall":
    //       //adding score to total runs
    //       if (addingScore && addExtrasToStrikerBowler) {
    //         addingScore!.score += extrasRuns.Runs;
    //         addExtrasToStrikerBowler!.extras += extrasRuns.Runs;
    //         //add runs to score timeline
    //         addingScore?.timeline!.scoreTimeline?.push(
    //           filteredTimeline(extrasRuns.Type, extrasRuns.Runs)
    //         );
    //       }
    //       break;
    //     case "byes":
    //     case "legByes":
    //       if (addingScore && addExtrasToStrikerBowler) {
    //         addingScore!.overs += 1;
    //         addingScore!.score += extrasRuns.Runs;
    //         //addExtrasToStrikerBowler.extras += extrasRuns.Runs;
    //         addExtrasToStrikerBatsman!.balls += 1;
    //         addExtrasToStrikerBowler!.overs += 1;
    //         addingScore?.timeline!.scoreTimeline?.push(
    //           filteredTimeline(extrasRuns.Type, extrasRuns.Runs)
    //         );
    //       }
    //   }
    // },
    // switch_inning: (
    //   state: Match,
    //   action: PayloadAction<{ matchId: string; currentInning: string }>
    // ) => {
    //   const { matchId, currentInning } = action.payload;
    //   state.inningNumber = currentInning === "inning1" ? "inning2" : "inning1";
    // },
    // save_inning: (state: Match) => {
    //   state.statistics.isFirstInningCompleteed = true;
    // },
    // save_match: (state: Match, action: PayloadAction<{ matchResult: any }>) => {
    //   const { matchResult } = action.payload;
    //   state.result.wonBy = matchResult?.matchWonBy;
    //   state.result.resultDescription = matchResult?.resultDescription;
    // },
    // reset: (state: any) => {
    //   //state.innings.remove();
    //   state.statistics = [];
    //   delete state.inning;
    //   //return initialState
    //   // state.initialState= [],
    //   // state.statistics = [],
    //   //state.innings = []
    // },
  },
});

export const {
  add_statistics,
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
  //reset,
  //add_batsman,
  //add_bowler,
  //switch_strike,
  //add_score,
  //switch_bowler,
  //add_wicket,
  //add_extras,
  //switch_inning,
  //save_inning,
  //save_match,
} = matchSlice.actions;
export const matchReducer = matchSlice.reducer;
