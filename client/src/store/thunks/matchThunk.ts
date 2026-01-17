import { createAsyncThunk } from "@reduxjs/toolkit";
import { Match } from "../../interfaces/MatchData";

export const saveMatch = createAsyncThunk<
  void, // return type
  Match, // argument type
  { rejectValue: string }
>("match/save", async (matchData, { rejectWithValue }) => {
  try {
    const res = await fetch("/api/save-match", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ matchData }),
    });

    if (!res.ok) {
      throw new Error("Failed to save match");
    }
  } catch (err) {
    return rejectWithValue("Save failed");
  }
});
