export type InningKey = "inning1" | "inning2";

export type ExtraType = "wide" | "noBall" | "byes" | "legByes";

export type WicketType = "Bowled" | "Caught" | "RunOut" | "Stumped" | "Retired";

export interface Ball {
  batRuns: number;
  isLegal: boolean;
  extras?: {
    type: ExtraType;
    runs: number;
  };
  wicket?: {
    type: WicketType;
    batsmanId: string;
    bowlerId: string;
    completedRuns?: number;
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
  isMatchStarted: boolean;
  isMatchCompleted: boolean;
  innings: {
    inning1: Inning;
    inning2: Inning;
  };
  result?: {
    wonBy: string;
    description: string;
  };
}

export interface MatchRow {
  matches: SingleMatch[];
}
export interface SingleMatch {
  id: string;
  fileName: string;
  team1: string;
  team2: string;
  inning1Score: string;
  inning2Score: string;
  status: string;
  result: string;
}
export interface PointsRow {
  team: string;
  played: number;
  wins: number;
  losses: number;
  points: number;
  netRunRate: string;
}
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

export const getBackgroundClass = (
  value: any,
  isLegal: boolean,
  extraType: string
) => {
  // if (
  //   value === 0 ||
  //   value === 1 ||
  //   value === 2 ||
  //   value === 3 ||
  //   value === 5 ||
  //   value === 7 ||
  //   value === 9
  // ) {
  //   return "bg-gray-500";
  // } else
  if (value === 4 || value === 6 || value === 8) {
    return "bg-green-500";
  } else if (
    typeof value === "string" &&
    (value.includes("WD") || value.includes("NB") || value.includes("B"))
  ) {
    return "bg-purple-500";
  } else if (!isLegal && (extraType === "wide" || "noball")) {
    return "bg-purple-500";
  } else if (typeof value === "string" && value.includes("W")) {
    return "bg-red-500";
  } else {
    return "bg-gray-500";
  }
};
