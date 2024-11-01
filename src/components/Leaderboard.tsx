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
  LEADERBOARD_UPDATE_EVENT,
  REGISTER_PLAYER_EVENT,
} from "../constants";
import { LeaderboardData } from "./types";
import StarIcon from "../icons/Star";
const Leaderboard: React.FC = React.memo(() => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardData[]>([]);
  const [selectedPlayerId] = useState("123");

  useEffect(() => {
    const socket = io(import.meta.env.VITE_SERVER_URL);

    socket.on(CONNECT_EVENT, () => {
      socket.emit(REGISTER_PLAYER_EVENT, selectedPlayerId);
    });

    socket.on(LEADERBOARD_DATA_EVENT, (data: LeaderboardData[]) => {
      setLeaderboardData(data);
    });
    socket.on(LEADERBOARD_UPDATE_EVENT, () => {
      socket.emit(REGISTER_PLAYER_EVENT, selectedPlayerId);
    });

    return () => {
      socket.off(LEADERBOARD_DATA_EVENT);
      socket.off(LEADERBOARD_UPDATE_EVENT);
      socket.disconnect();
    };
  }, [selectedPlayerId]);

  const dailyDiffCell = (props: GridCellProps) => {
    const dailyDiff: number = props.dataItem.dailyDiff;
    const style = {
      color: dailyDiff > 0 ? "green" : dailyDiff < 0 ? "red" : "yellow",
    };

    return <td style={style}>{Math.abs(dailyDiff)}</td>;
  };

  const rankCell = (props: GridCellProps) => {
    const playerId: string = props.dataItem.playerId;
    const rank: number = props.dataItem.rank;
    const isSelectedPlayer = playerId == selectedPlayerId;

    return (
      <td className="rank-cell">
        {isSelectedPlayer ? (
          <span>
            {rank}. <StarIcon />
          </span>
        ) : (
          rank + "."
        )}
      </td>
    );
  };

  return (
    <Grid data={leaderboardData}>
      <Column field="rank" title="Rank" cell={rankCell} />
      <Column field="username" title="Username" />
      <Column field="country" title="Country" />
      <Column field="weeklyMoney" title="Money" />
      <Column field="dailyDiff" title="Daily Diff" cell={dailyDiffCell} />
    </Grid>
  );
});

export default Leaderboard;
