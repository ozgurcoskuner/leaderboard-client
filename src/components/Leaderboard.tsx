import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import {
  Grid,
  GridCellProps,
  GridColumn as Column,
} from "@progress/kendo-react-grid";
import "@progress/kendo-theme-default/dist/all.css";
import {
  CONNECT_EVENT,
  LEADERBOARD_DATA_EVENT,
  REGISTER_PLAYER_EVENT,
} from "../constants";
import { LeaderboardData } from "./types";
const Leaderboard: React.FC = React.memo(() => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardData[]>([]);

  useEffect(() => {
    const socket = io("http://localhost:4000");

    socket.on(CONNECT_EVENT, () => {
      socket.emit(REGISTER_PLAYER_EVENT, "123");
    });

    socket.on(LEADERBOARD_DATA_EVENT, (data: LeaderboardData[]) => {
      setLeaderboardData(data);
    });

    return () => {
      socket.off(LEADERBOARD_DATA_EVENT);
      socket.disconnect();
    };
  }, []);

  const dailyDiffCell = (props: GridCellProps) => {
    const dailyDiff: number = props.dataItem.dailyDiff;
    const style = {
      color: dailyDiff > 0 ? "green" : dailyDiff < 0 ? "red" : "yellow",
    };

    return <td style={style}>{Math.abs(dailyDiff)}</td>;
  };

  return (
    <Grid data={leaderboardData}>
      <Column field="rank" title="Rank" />
      <Column field="username" title="Username" />
      <Column field="country" title="Country" />
      <Column field="weeklyMoney" title="Money" />
      <Column field="dailyDiff" title="Daily Diff" cell={dailyDiffCell} />
    </Grid>
  );
});

export default Leaderboard;
