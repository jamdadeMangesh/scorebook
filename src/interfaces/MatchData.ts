export interface BattingData {
  id: string;
  batsmanName: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  eights: number;
  strikeRate: number;
  out: string;
  bowler: string;
  onStrike: boolean;
}

export interface BowlingData {
  id: string;
  bowlerName: string;
  overs: number;
  maiden: number;
  runs: number;
  wicket: number;
  economyRate: number;
  extras: number;
  totalRuns: number;
  totalWicket: number;
  currentBowler: boolean;
}

export interface Extras {
  wides: number;
  noBalls: number;
  byes: number;
  legByes: number;
}

export interface Inning {
  id: string;
  isCurrentInning: boolean;
  score: number;
  wickets: number;
  overs: number;
  battingFirstTeamName: string;
  bowlingFirstTeamName: string;
  extras?: Extras;
  batting?: BattingData[];
  bowling?: BowlingData[];
  firstInning: boolean;
}

// export interface Match {
//     id?: string;
//     statistics: {
//         team1: string;
//         team2: string;
//         tossWonBy: string;
//         batFirst: string;
//         playersCount: number;
//         remarks: string;
//     },
//     // innings: {
//     //     [id: string]: Inning
//     // }
//     innings: Inning[]
// }
export interface Statistics {
  team1: string;
  team2: string;
  tossWonBy: string;
  playersCount: number;
  remarks: string;
  teamBatting: string;
  teamBowling: string;
  teamBattingSecond: string;
  teamBowlingSecond: string;
  isFirstInningCompleteed: boolean;
}

export interface Match {
  id: string;
  statistics: Statistics;
  inningNumber: string;
  result: {
    wonBy: string;
    resultDescription: string;
  };
  batting?: {
    inning1: {
      battingData?: BattingData[] | undefined;
      score: number;
      overs: number;
      wickets: number;
      extras?: Extras;
      timeline: {
        scoreTimeline: string[];
      };
    };
    inning2: {
      battingData?: BattingData[] | undefined;
      score: number;
      overs: number;
      wickets: number;
      extras?: Extras;
      timeline: {
        scoreTimeline: string[];
      };
    };
    // inning: string;
    // battingData?: BattingData[] | undefined;
    // extras?: Extras;
  };
  bowling: {
    inning1: {
      bowlingData?: BowlingData[] | undefined;
      extras?: Extras;
    };
    inning2: {
      bowlingData?: BowlingData[] | undefined;
      extras?: Extras;
    };

    // inning: string;
    // bowlingData?: BowlingData[] | undefined;
    // extras?: Extras;
  };
  //innings: Inning[];
}

// export interface Inning {
//     id: string;
//     isCurrentInning: boolean;
//     score: number;
//     wickets: number;
//     overs: number;
//     battingFirstTeamName: string;
//     bowlingFirstTeamName?: string;
//     extras?: {
//         wides: number;
//         noBalls: number;
//         byes: number;
//         legByes: number;
//     }
//     batting?:Batsman[];
//     bowling?:Bowler[];
// }

export interface IExtrasTRuns {
  Type: string;
  Runs: number;
  selected: string;
}
export const scoreMapping: { [key: number]: keyof BattingData } = {
  4: "fours",
  6: "sixes",
  8: "eights",
};

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
