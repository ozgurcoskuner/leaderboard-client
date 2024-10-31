import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

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
      {leaderboardData && <p>{JSON.stringify(leaderboardData, null, 2)}</p>}
    </div>
  );
});

export default Leaderboard;
