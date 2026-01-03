import { apiRequest } from "./apiClient";

/* ===== Types ===== */
export interface Player {
  id: string;
  name: string;
  addedAt: string;
}

export interface Team {
  teamName: string;
  players: Player[];
  createdAt: string;
}

/* ===== API Calls ===== */

export const getTeams = () => {
  return apiRequest<{ teams: Team[] }>("/get-teams");
};

export const addTeam = (teamName: string) => {
  return apiRequest("/add-team", {
    method: "POST",
    body: { teamName },
  });
};

export const addPlayer = (teamName: string, playerName: string) => {
  return apiRequest("/add-players", {
    method: "POST",
    body: { teamName, playerName },
  });
};

export const deletePlayer = (teamName: string, playerId: string) => {
  return apiRequest("/delete-player", {
    method: "POST",
    body: { teamName, playerId },
  });
};

export const getSingleTeamPlayers = (teamName: string) => {
  return apiRequest<{ teams: Team[] }>(
    `/get-single-team-players?teamName=${teamName}`
  );
};
