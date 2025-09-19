document.addEventListener("DOMContentLoaded", function () {
  const searchButton = document.getElementById("search-btn");
  const usernameInput = document.getElementById("user-input");
  const easyLevel = document.getElementById("easy-level");
  const mediumLevel = document.getElementById("medium-level");
  const hardLevel = document.getElementById("hard-level");
  const circles = {
    easy: document.querySelector(".circle.easy"),
    medium: document.querySelector(".circle.medium"),
    hard: document.querySelector(".circle.hard"),
  };
  const cardStatsContainer = document.querySelector(".stats-card");

  function validateUsername(username) {
    if (username.trim() === "") {
      alert("Username should not be empty");
      return false;
    }
    const Regex = /^[a-zA-Z0-9_-]{3,20}$/;
    const isMatching = Regex.test(username);
    if (!isMatching) {
      alert("Invalid Username");
    }
    return isMatching;
  }

  function animateCircle(circle, percent, color) {
    let current = 0;
    const step = () => {
      if (current <= percent) {
        circle.style.background = `conic-gradient(${color} ${current}%, #283a2e 0%)`;
        current++;
        requestAnimationFrame(step);
      }
    };
    step();
  }

  async function fetchUserDetail(username) {
    try {
      searchButton.textContent = "Searching...";
      searchButton.disabled = true;

      const url = `https://leetcode-api-faisalshohag.vercel.app/${username}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Unable to fetch user details");
      }

      const data = await response.json();
      if (data.status === "error") {
        cardStatsContainer.innerHTML = `<p>No data found for <b>${username}</b></p>`;
        return;
      }

      // update text
      easyLevel.textContent = data.easySolved;
      mediumLevel.textContent = data.mediumSolved;
      hardLevel.textContent = data.hardSolved;

      // percentages
      const easyPercent = Math.round((data.easySolved / data.totalEasy) * 100);
      const mediumPercent = Math.round((data.mediumSolved / data.totalMedium) * 100);
      const hardPercent = Math.round((data.hardSolved / data.totalHard) * 100);

      // animate circles
      animateCircle(circles.easy, easyPercent, "#00ff88");
      animateCircle(circles.medium, mediumPercent, "#ffcc00");
      animateCircle(circles.hard, hardPercent, "#ff4444");

      // fill stats card
      cardStatsContainer.innerHTML = `
        <div class="stats-card-inner">
          <h3>${username}'s Stats</h3>
          <div class="stat-row"><span>Total Solved</span><span>${data.totalSolved}</span></div>
          <div class="stat-row"><span>Easy</span><span>${data.easySolved}/${data.totalEasy}</span></div>
          <div class="stat-row"><span>Medium</span><span>${data.mediumSolved}/${data.totalMedium}</span></div>
          <div class="stat-row"><span>Hard</span><span>${data.hardSolved}/${data.totalHard}</span></div>
          <div class="stat-row"><span>Total Questions</span><span>${data.totalQuestions}</span></div>
          <div class="stat-row"><span>Ranking</span><span>${data.ranking}</span></div>
        </div>
      `;
    } catch (error) {
      console.error(error);
      cardStatsContainer.innerHTML = `<p>⚠️ Error fetching data</p>`;
    } finally {
      searchButton.textContent = "Search";
      searchButton.disabled = false;
    }
  }

  searchButton.addEventListener("click", function () {
    const username = usernameInput.value;
    if (validateUsername(username)) {
      fetchUserDetail(username);
    }
  });
});
