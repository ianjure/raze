document.addEventListener("DOMContentLoaded", async () => {
    const tbody = document.querySelector(".leaderboard-table tbody");
    if (!tbody) return;

    try {
        const token = localStorage.getItem("token");
        const response = await fetch("/api/user/leaderboard", {
            headers: { "Authorization": `Bearer ${token}` }
        });
        const result = await response.json();

        if (result.success && Array.isArray(result.data)) {
            tbody.innerHTML = "";
            result.data.forEach((user, idx) => {
                const rank = idx + 1;
                let medalClass = "";
                let medalIcon = "";
                if (rank === 1) { medalClass = "gold"; medalIcon = "🥇"; }
                else if (rank === 2) { medalClass = "silver"; medalIcon = "🥈"; }
                else if (rank === 3) { medalClass = "bronze"; medalIcon = "🥉"; }

                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td class="rank center ${medalClass}">${medalIcon || rank}</td>
                    <td class="username">${user.username}</td>
                    <td class="stats center">Level ${user.level}&nbsp;&nbsp;${user.exp} XP</td>
                `;
                tbody.appendChild(tr);
            });
        } else {
            tbody.innerHTML = `<tr><td colspan="3" class="center">No leaderboard data available.</td></tr>`;
        }
    } catch (err) {
        tbody.innerHTML = `<tr><td colspan="3" class="center">Failed to load leaderboard.</td></tr>`;
    }
});