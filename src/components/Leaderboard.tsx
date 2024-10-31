import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import {
  Grid,
  GridCellProps,
  GridColumn as Column,
} from "@progress/kendo-react-grid";
import "@progress/kendo-theme-default/dist/all.css";
const Leaderboard: React.FC = React.memo(() => {
  const [leaderboardData, setLeaderboardData] = useState(null);

  useEffect(() => {
    const socket = io("http://localhost:4000");

    socket.on("connect", () => {
      console.log("Connecttt");
      socket.emit("registerPlayer", "123");
    });

    socket.on("leaderboardDataEvent", (data) => {
      setLeaderboardData(data);
    });

    return () => {
      socket.off("LEADERBOARD_DATA_EVENT");
      socket.disconnect();
    };
  }, []);

  const dailyDiffCell = (props: GridCellProps) => {
    const dailyDiff = props.dataItem.dailyDiff;
    const style = {
      color: dailyDiff > 0 ? "green" : dailyDiff < 0 ? "red" : "yellow",
    };

    return <td style={style}>{Math.abs(dailyDiff)}</td>;
  };

  return (
    <div>
      <Grid data={leaderboardData}>
        <Column field="rank" title="Rank" />
        <Column field="playerId" title="ID" />
        <Column field="username" title="Username" />
        <Column field="country" title="Country" />
        <Column field="weeklyMoney" title="Money" />
        <Column field="dailyDiff" title="Daily Diff" cell={dailyDiffCell} />
      </Grid>
    </div>
  );
});

export default Leaderboard;
