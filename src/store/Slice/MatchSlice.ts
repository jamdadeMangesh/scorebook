import { createSlice, current, PayloadAction } from "@reduxjs/toolkit";
import {
  Match,
  Inning,
  BattingData,
  Extras,
  BowlingData,
  scoreMapping,
  calculateStrikerate,
  IExtrasTRuns,
  filteredTimeline,
} from "../../interfaces/MatchData";
import useFunctions from "../../hooks/useFunctions";

const initialState: Match = {
  id: "",
  statistics: {
    team1: "",
    team2: "",
    tossWonBy: "",
    playersCount: 0,
    remarks: "",
    teamBatting: "",
    teamBowling: "",
    teamBattingSecond: "",
    teamBowlingSecond: "",
    isFirstInningCompleteed: false,
  },
  inningNumber: "",
  result: {
    wonBy: "",
    resultDescription: "",
  },
  batting: {
    inning1: {
      battingData: [],
      score: 0,
      overs: 0,
      wickets: 0,
      extras: {
        wides: 0,
        noBalls: 0,
        byes: 0,
        legByes: 0,
      },
      timeline: {
        scoreTimeline: [],
      },
    },
    inning2: {
      battingData: [],
      score: 0,
      overs: 0,
      wickets: 0,
      extras: {
        wides: 0,
        noBalls: 0,
        byes: 0,
        legByes: 0,
      },
      timeline: {
        scoreTimeline: [],
      },
    },
    // inning: "",
    // battingData:
    // [
    //     {
    //         id: "",
    //         batsmanName: "",
    //         runs: 0,
    //         balls: 0,
    //         fours: 0,
    //         sixes: 0,
    //         eights: 0,
    //         strikeRate: 0,
    //         out: "",
    //         bowler: "",
    //     }
    // ],
    // extras: {
    //     wides: 0,
    //     noBalls: 0,
    //     byes: 0,
    //     legByes: 0,
    // }
  },
  bowling: {
    inning1: {
      bowlingData: [],
      extras: {
        wides: 0,
        noBalls: 0,
        byes: 0,
        legByes: 0,
      },
    },
    inning2: {
      bowlingData: [],
      extras: {
        wides: 0,
        noBalls: 0,
        byes: 0,
        legByes: 0,
      },
    },
    // inning: "",
    // bowlingData: [
    //     {
    //         id: "",
    //         bowlerName: "",
    //         overs: 0,
    //         maiden: 0,
    //         runs: 0,
    //         wicket: 0,
    //         economyRate: 0,
    //         extras: 0,
    //         totalRuns: 0,
    //         totalWicket: 0,
    //     }
    // ],
    // extras: {
    //     wides: 0,
    //     noBalls: 0,
    //     byes: 0,
    //     legByes: 0,
    // }
  },
  // innings: [
  //     {
  //         id: "",  // Unique identifier for each inning
  //         isCurrentInning: true,
  //         score: 0,
  //         wickets: 0,
  //         overs: 0,
  //         battingFirstTeamName: "",
  //         bowlingFirstTeamName: "",
  //         firstInning: true,
  //         extras: {
  //             wides: 0,
  //             noBalls: 0,
  //             byes: 0,
  //             legByes: 0,
  //         },
  //         batting:  [
  //             {
  //                 id: "",
  //                 batsmanName: "",
  //                 runs: 0,
  //                 balls: 0,
  //                 fours: 0,
  //                 sixes: 0,
  //                 eights: 0,
  //                 strikeRate: 0,
  //                 out: "",
  //                 bowler: "",
  //             }
  //         ],
  //         bowling: []
  //     },
  // {
  //     id: "",  // Second inning
  //     isCurrentInning: false,
  //     score: 0,
  //     wickets: 0,
  //     overs: 0,
  //     battingFirstTeamName: "",
  //     bowlingFirstTeamName: "",
  //     firstInning: false,
  //     extras: {
  //         wides: 0,
  //         noBalls: 0,
  //         byes: 0,
  //         legByes: 0,
  //     },
  //     batting: [],
  //     bowling: []
  // }
  //],
};

export const matchSlice = createSlice({
  name: "match",
  initialState: initialState,
  reducers: {
    add_statistics: (state: Match, action) => {
      state.statistics = action.payload;
    },
    set_inning: (
      state: Match,
      action: PayloadAction<{ matchId: string; inningNum: string }>
    ) => {
      const { matchId, inningNum } = action.payload;
      state.id = matchId;
      state.inningNumber = inningNum;
    },
    add_batsman: (
      state: Match,
      action: PayloadAction<{
        currentInning: string;
        batsmanData: BattingData;
        extras?: Extras;
      }>
    ) => {
      const { currentInning, batsmanData, extras } = action.payload;
      const inningKey = currentInning === "inning1" ? "inning1" : "inning2";
      const batterInfo = state!.batting![inningKey].battingData;

      if (batterInfo) {
        batterInfo?.push(batsmanData);
      }
      // if(currentInning === 'Inning1') {
      //     state!.batting!.inning1.battingData?.push(batsmanData);
      // } else {
      //     state!.batting!.inning2.battingData?.push(batsmanData);
      // }
      // state!.batting!.${currentInning} = currentInning;
      // state?.batting?.battingData?.push(batsmanData);

      // state.batting.extras = extras;
      // const getInnings = state.innings.find((value) => value.id === inningId);

      // if(getInnings){

      //     getInnings?.batting?.push(action.payload.batsmanData)

      //     //state.innings.push(batsmanData);
      // }
    },
    add_bowler: (
      state: Match,
      action: PayloadAction<{ currentInning: string; bowlerData: BowlingData }>
    ) => {
      const { currentInning, bowlerData } = action.payload;
      const inningKey = currentInning === "inning1" ? "inning1" : "inning2";
      const bowlerInfo = state!.bowling![inningKey].bowlingData;
      if (bowlerInfo) {
        bowlerInfo?.push(bowlerData);
      }
      // if(currentInning === 'Inning1') {
      //     state!.bowling!.inning1.bowlingData?.push(bowlerData);
      // } else {
      //     state!.bowling!.inning2.bowlingData?.push(bowlerData);
      // }
      // state.bowling.inning = currentInning;
      // state!.bowling!.bowlingData!.push(bowlerData);
    },
    switch_strike: (
      state: Match,
      action: PayloadAction<{ currentInning: string; batterId: string }>
    ) => {
      const { currentInning, batterId } = action.payload;
      const inningKey = currentInning === "inning1" ? "inning1" : "inning2";
      const battingInfo = state!.batting![inningKey].battingData;
      const changeStrikeForOnStrikeBatter = battingInfo?.find(
        (value) => value.onStrike === true
      );
      if (changeStrikeForOnStrikeBatter) {
        changeStrikeForOnStrikeBatter.onStrike = false;
      }
      const changeStrikeData = battingInfo?.find(
        (value) => value.onStrike === false && value.id === batterId
      );

      if (changeStrikeData) {
        changeStrikeData.onStrike = true;
      }
      // if(currentInning === "Inning1") {
      //     const changeStrikeForOnStrikeBatter = state!.batting!.inning1.battingData?.find((value) => value.onStrike === true);
      //     if(changeStrikeForOnStrikeBatter) {
      //         changeStrikeForOnStrikeBatter.onStrike = false;
      //     }
      //     const changeStrikeData = state!.batting!.inning1.battingData?.find((value) => value.onStrike === false && value.id === batterId);

      //     if(changeStrikeData) {
      //         changeStrikeData.onStrike = true;
      //     }
      // }
      // else {
      //     const changeStrikeForOnStrikeBatter = state!.batting!.inning2.battingData?.find((value) => value.onStrike === true);
      //     if(changeStrikeForOnStrikeBatter) {
      //         changeStrikeForOnStrikeBatter.onStrike = false;
      //     }
      //     const changeStrikeData = state!.batting!.inning2.battingData?.find((value) => value.onStrike === false && value.id === batterId);

      //     if(changeStrikeData) {
      //         changeStrikeData.onStrike = true;
      //     }
      // }
    },
    switch_bowler: (
      state: Match,
      action: PayloadAction<{ currentInning: string; bowlerId: string }>
    ) => {
      const { currentInning, bowlerId } = action.payload;
      const inningKey = currentInning === "inning1" ? "inning1" : "inning2";
      const bowlingInfo = state!.bowling![inningKey].bowlingData;
      const changeStrikeForOnStrikeBatter = bowlingInfo?.find(
        (value) => value.currentBowler === true
      );
      if (changeStrikeForOnStrikeBatter) {
        changeStrikeForOnStrikeBatter.currentBowler = false;
      }
      const changeStrikeData = bowlingInfo?.find(
        (value) => value.currentBowler === false && value.id === bowlerId
      );

      if (changeStrikeData) {
        changeStrikeData.currentBowler = true;
      }
    },
    add_score: (
      state: Match,
      action: PayloadAction<{
        currentInning?: string;
        score?: any;
        onStrikeBatsmanId?: string;
        onStrikeBowlerId?: string;
      }>
    ) => {
      const { currentInning, score, onStrikeBatsmanId, onStrikeBowlerId } =
        action.payload;

      const inningKey = currentInning === "inning1" ? "inning1" : "inning2";
      const addingScore = state!.batting![inningKey];

      //adding score to total runs
      if (addingScore) {
        addingScore.score += score;

        //add 1 ball to overs
        addingScore.overs += 1;

        //add runs to score timeline
        addingScore?.timeline.scoreTimeline?.push(score);
      }

      //adding score to batter
      const addingScoreToBatter = state!.batting![inningKey].battingData;
      const addScoreToStrikerBatsman: any = addingScoreToBatter?.find(
        (value) => value.id === onStrikeBatsmanId
      );

      if (addScoreToStrikerBatsman) {
        addScoreToStrikerBatsman.runs += score;

        //adding balls to batter
        addScoreToStrikerBatsman.balls += 1;
        addScoreToStrikerBatsman.strikeRate = calculateStrikerate(
          addScoreToStrikerBatsman.runs,
          addScoreToStrikerBatsman.balls
        );
      }

      //add 4,6,8 count to batsman
      const scoreKey: any = scoreMapping[score];
      if (scoreKey && addScoreToStrikerBatsman) {
        addScoreToStrikerBatsman![scoreKey] += 1;
      }

      /*ADD SCORE TO BOWLER */

      //adding score to batter
      const addingScoreToBowler = state!.bowling![inningKey].bowlingData;
      const addScoreToStrikerBowler: any = addingScoreToBowler?.find(
        (value) => value.id === onStrikeBowlerId
      );
      if (addScoreToStrikerBowler) {
        addScoreToStrikerBowler.runs += score;

        //adding balls to batter
        addScoreToStrikerBowler.overs += 1;
      }
      // if(addScoreToStrikerBatsman ) {
      //     addScoreToStrikerBatsman![scoreMapping]  += 1;
      // } else if(score === 6) {
      //     addScoreToStrikerBatsman!.sixes += 1;
      // } else if(score === 8) {
      //     addScoreToStrikerBatsman!.eights += 1;
      // }

      //calculate overs

      // const addScoreToBatter = battingInfo?.find((value) => value.id === onStrikeBatsmanId);
      // if(addScoreToBatter) {
      //     addScoreToBatter[runs] = 1;
      // }
    },
    add_wicket: (
      state: Match | any,
      action: PayloadAction<{
        currentInning: string;
        wicketType: any;
        bowlerId: string;
        batsmanId: string;
      }>
    ) => {
      const { wicketType, currentInning, bowlerId, batsmanId } = action.payload;

      //adding wicket to batter
      const getCurrentInningBattingData =
        state!.batting![currentInning]?.battingData;
      const addWicketToStrikerBatsman = getCurrentInningBattingData?.find(
        (value: Match) => value.id === batsmanId
      );

      //adding wicket to bowler
      const getCurrentInningBowlinggData =
        state!.bowling![currentInning]?.bowlingData;
      const addWicketToStrikerBowler = getCurrentInningBowlinggData?.find(
        (value: Match) => value.id === bowlerId
      );

      const addingWickets = state!.batting![currentInning];

      //add wicket data to out batsman
      if (addWicketToStrikerBatsman) {
        addWicketToStrikerBatsman.out = wicketType;
        addWicketToStrikerBatsman.onStrike = false;
        addWicketToStrikerBatsman.bowler = addWicketToStrikerBowler?.bowlerName;
        addWicketToStrikerBatsman.balls += 1;
      }

      //add wicket data to out bowler
      if (addWicketToStrikerBowler) {
        addWicketToStrikerBowler.wicket += 1;
        addWicketToStrikerBowler.overs += 1;
      }

      //add wicket count in total score
      if (addingWickets) {
        addingWickets.overs += 1;
        addingWickets.wickets += 1;
        addingWickets?.timeline.scoreTimeline?.push("W");
      }
    },
    add_extras: (
      state: any,
      action: PayloadAction<{
        currentInning: string;
        extrasRuns: IExtrasTRuns;
        batsmanId: string;
        bowlerId: string;
      }>
    ) => {
      const { currentInning, extrasRuns, batsmanId, bowlerId } = action.payload;

      //get current inning batting data
      const getCurrentInningBattingData =
        state!.batting![currentInning]?.battingData;

      const addExtrasToStrikerBatsman = getCurrentInningBattingData?.find(
        (value: Match) => value.id === batsmanId
      );

      //get current inning bowling data
      const getCurrentInningBowlinggData =
        state!.bowling![currentInning]?.bowlingData;

      const addExtrasToStrikerBowler = getCurrentInningBowlinggData?.find(
        (value: Match) => value.id === bowlerId
      );

      //total score
      const addingScore = state!.batting![currentInning];

      switch (extrasRuns.Type) {
        case "wide":
        case "noBall":
          //adding score to total runs
          if (addingScore && addExtrasToStrikerBowler) {
            addingScore!.score += extrasRuns.Runs;
            addExtrasToStrikerBowler!.extras += extrasRuns.Runs;
            //add runs to score timeline
            addingScore?.timeline!.scoreTimeline?.push(
              filteredTimeline(extrasRuns.Type, extrasRuns.Runs)
            );
          }
          break;
        case "byes":
        case "legByes":
          if (addingScore && addExtrasToStrikerBowler) {
            addingScore!.overs += 1;
            addingScore!.score += extrasRuns.Runs;
            //addExtrasToStrikerBowler.extras += extrasRuns.Runs;
            addExtrasToStrikerBatsman!.balls += 1;
            addExtrasToStrikerBowler!.overs += 1;
            addingScore?.timeline!.scoreTimeline?.push(
              filteredTimeline(extrasRuns.Type, extrasRuns.Runs)
            );
          }
      }
    },
    switch_inning: (
      state: Match,
      action: PayloadAction<{ matchId: string; currentInning: string }>
    ) => {
      const { matchId, currentInning } = action.payload;
      state.inningNumber = currentInning === "inning1" ? "inning2" : "inning1";
    },
    save_inning: (state: Match) => {
      state.statistics.isFirstInningCompleteed = true;
    },
    save_match: (state: Match, action: PayloadAction<{ matchResult: any }>) => {
      const { matchResult } = action.payload;
      state.result.wonBy = matchResult?.matchWonBy;
      state.result.resultDescription = matchResult?.resultDescription;
    },
    reset: (state: any) => {
      //state.innings.remove();
      state.statistics = [];
      delete state.inning;
      //return initialState
      // state.initialState= [],
      // state.statistics = [],
      //state.innings = []
    },
  },
});

export const {
  add_statistics,
  set_inning,
  reset,
  add_batsman,
  add_bowler,
  switch_strike,
  add_score,
  switch_bowler,
  add_wicket,
  add_extras,
  switch_inning,
  save_inning,
  save_match,
} = matchSlice.actions;
export const matchReducer = matchSlice.reducer;
