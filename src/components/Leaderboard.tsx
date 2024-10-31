import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Grid, GridColumn as Column } from "@progress/kendo-react-grid";

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

  return (
    <div>
      <Grid data={leaderboardData}>
        <Column field="rank" title="Rank" />
        <Column field="playerId" title="ID" />
        <Column field="username" title="Username" />
        <Column field="country" title="Country" />
        <Column field="weeklyMoney" title="Money" />
        <Column field="dailyDiff" title="Daily Diff" />
      </Grid>
    </div>
  );
});

export default Leaderboard;
