export type InningKey = "inning1" | "inning2";

export type ExtraType = "wide" | "noBall" | "byes" | "legByes";

export type WicketType =
  | "bowled"
  | "caught"
  | "runOut"
  | "stumped"
  | "lbw"
  | "retired";

export interface Ball {
  runs: number;
  isLegal: boolean;
  extras?: {
    type: ExtraType;
    runs: number;
  };
  wicket?: {
    type: WicketType;
    batsmanId: string;
    bowlerId: string;
  };
}

export interface BattingData {
  id: string;
  batsmanName: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  eights: number;
  strikeRate: number;
  onStrike: boolean;
  out?: string;
  bowler?: string;
}

export interface BowlingData {
  id: string;
  bowlerName: string;
  balls: number;
  runs: number;
  wickets: number;
  extras: number;
  currentBowler: boolean;
}

export interface Inning {
  battingData: BattingData[];
  bowlingData: BowlingData[];
  balls: Ball[];
  totalRuns: number;
  wickets: number;
  completed: boolean;
}

export interface Match {
  id: string;
  inningNumber: InningKey;
  statistics: Statistics;
  innings: {
    inning1: Inning;
    inning2: Inning;
  };
  result?: {
    wonBy: string;
    description: string;
  };
}

// export interface BattingData {
//   id: string;
//   batsmanName: string;
//   runs: number;
//   balls: number;
//   fours: number;
//   sixes: number;
//   eights: number;
//   strikeRate: number;
//   out: string;
//   bowler: string;
//   onStrike: boolean;
// }

// export interface BowlingData {
//   id: string;
//   bowlerName: string;
//   overs: number;
//   maiden: number;
//   runs: number;
//   wicket: number;
//   economyRate: number;
//   extras: number;
//   totalRuns: number;
//   totalWicket: number;
//   currentBowler: boolean;
// }

// export interface Extras {
//   wides: number;
//   noBalls: number;
//   byes: number;
//   legByes: number;
// }

// export interface Inning {
//   id: string;
//   isCurrentInning: boolean;
//   score: number;
//   wickets: number;
//   overs: number;
//   battingFirstTeamName: string;
//   bowlingFirstTeamName: string;
//   extras?: Extras;
//   batting?: BattingData[];
//   bowling?: BowlingData[];
//   firstInning: boolean;
// }

export interface Statistics {
  team1: string;
  team2: string;
  tossWonBy: string;
  electedTo: string;
  remarks: string;
  teamBatting: string;
  teamBowling: string;
  teamBattingSecond: string;
  teamBowlingSecond: string;
  isFirstInningCompleteed: boolean;
}

// export interface Match {
//   id: string;
//   statistics: Statistics;
//   inningNumber: string;
//   result: {
//     wonBy: string;
//     resultDescription: string;
//   };
//   batting?: {
//     inning1: {
//       battingData?: BattingData[] | undefined;
//       score: number;
//       overs: number;
//       wickets: number;
//       extras?: Extras;
//       timeline: {
//         scoreTimeline: string[];
//       };
//     };
//     inning2: {
//       battingData?: BattingData[] | undefined;
//       score: number;
//       overs: number;
//       wickets: number;
//       extras?: Extras;
//       timeline: {
//         scoreTimeline: string[];
//       };
//     };
//     // inning: string;
//     // battingData?: BattingData[] | undefined;
//     // extras?: Extras;
//   };
//   bowling: {
//     inning1: {
//       bowlingData?: BowlingData[] | undefined;
//       extras?: Extras;
//     };
//     inning2: {
//       bowlingData?: BowlingData[] | undefined;
//       extras?: Extras;
//     };
//   };
//   //innings: Inning[];
// }
// export interface IExtrasTRuns {
//   Type: string;
//   Runs: number;
//   selected: string;
// }
// export const scoreMapping: { [key: number]: keyof BattingData } = {
//   4: "fours",
//   6: "sixes",
//   8: "eights",
// };

export const calculateStrikerate = (runs: number, balls: number) => {
  return ((runs / balls) * 100).toFixed(2);
};

//calculate overs
export const calculateOvers = (totalBalls: number) => {
  const overs = Math.floor(totalBalls / 6);
  const remainingBalls = totalBalls % 6;
  return overs + "." + remainingBalls;
};

export const filteredTimeline = (type: string, runs: number) => {
  switch (type) {
    case "wide":
      return runs + "WD";
    case "noBall":
      return runs + "NB";
    case "byes":
      return runs + "B";
    case "legByes":
      return runs + "LB";
  }
};

export const getBackgroundClass = (value: any) => {
  if (
    value === 0 ||
    value === 1 ||
    value === 2 ||
    value === 3 ||
    value === 5 ||
    value === 7 ||
    value === 9
  ) {
    return "bg-gray-500";
  } else if (value === 4 || value === 6 || value === 8) {
    return "bg-green-500";
  } else if (
    typeof value === "string" &&
    (value.includes("WD") || value.includes("NB") || value.includes("B"))
  ) {
    return "bg-purple-500";
  } else if (typeof value === "string" && value.includes("W")) {
    return "bg-red-500";
  }
};
