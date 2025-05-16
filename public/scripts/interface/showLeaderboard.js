document.addEventListener("DOMContentLoaded", () => {
    const leaderboardModal = document.querySelector(".leaderboard-modal");
    const openBtn = document.getElementById("open-leaderboard");
    const closeBtn = document.getElementById("close-leaderboard");
    const tbody = document.querySelector(".leaderboard-table tbody");

    openBtn.addEventListener("click", async () => {
        leaderboardModal.showModal();
        tbody.innerHTML = `<tr><td colspan="3" class="center">Loading...</td></tr>`;
        try {
            const token = localStorage.getItem("token");
            const username = localStorage.getItem("username");
            const response = await fetch("/api/user/leaderboard", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const result = await response.json();

            if (result.success && Array.isArray(result.data)) {
                tbody.innerHTML = "";
                let userInTop10 = false;
                let userRank = null, userLevel = null, userExp = null;

                // Find the user's rank in the leaderboard (if present)
                result.data.forEach((user, idx) => {
                    if (user.username === username) {
                        userInTop10 = true;
                    }
                });

                // Render top 10
                result.data.forEach((user, idx) => {
                    const rank = idx + 1;
                    let medalClass = "";
                    let medalIcon = "";
                    if (rank === 1) { medalClass = "gold"; medalIcon = "🥇"; }
                    else if (rank === 2) { medalClass = "silver"; medalIcon = "🥈"; }
                    else if (rank === 3) { medalClass = "bronze"; medalIcon = "🥉"; }

                    const isCurrentUser = user.username === username;
                    const tr = document.createElement("tr");
                    tr.className = isCurrentUser ? "current-user" : "";
                    tr.innerHTML = `
                        <td class="rank center ${medalClass}">${medalIcon || rank}</td>
                        <td class="username">${user.username}</td>
                        <td class="stats center">Level ${user.level}&nbsp;&nbsp;${user.exp} XP</td>
                    `;
                    tbody.appendChild(tr);
                });

                // If user is not in top 10, fetch their rank and show at the bottom
                if (!userInTop10) {
                    // Fetch user's global rank
                    const userRankRes = await fetch("/api/user/rank", {
                        headers: { "Authorization": `Bearer ${token}` }
                    });
                    const userRankData = await userRankRes.json();
                    if (userRankData.success && userRankData.data) {
                        userRank = userRankData.data.rank;
                        userLevel = userRankData.data.level;
                        userExp = userRankData.data.exp;
                    }

                    // Separator row
                    const sep = document.createElement("tr");
                    sep.className = "separator-row";
                    sep.innerHTML = `<td colspan="3"></td>`;
                    tbody.appendChild(sep);

                    // User row
                    const tr = document.createElement("tr");
                    tr.className = "current-user";
                    tr.innerHTML = `
                        <td class="rank center">${userRank || "?"}</td>
                        <td class="username">${username}</td>
                        <td class="stats center">Level ${userLevel || "?"}&nbsp;&nbsp;${userExp || "?"} XP</td>
                    `;
                    tbody.appendChild(tr);
                }
            } else {
                tbody.innerHTML = `<tr><td colspan="3" class="center">No leaderboard data available.</td></tr>`;
            }
        } catch (err) {
            tbody.innerHTML = `<tr><td colspan="3" class="center">Failed to load leaderboard.</td></tr>`;
        }
    });

    closeBtn.addEventListener("click", () => leaderboardModal.close());
});