import { useState } from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

function App() {
  const [distance, setDistance] = useState("");
  const [health, setHealth] = useState(0);
  const [data, setData] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [monthlyData, setMonthlyData] = useState(Array(12).fill(0));
  const [streak, setStreak] = useState(0);
  const [lastDate, setLastDate] = useState(null);
  const [showBadges, setShowBadges] = useState(false);

  const calculate = () => {
    const km = parseFloat(distance);

    if (isNaN(km) || km <= 0) {
      alert("Enter valid number");
      return;
    }

    const emission = km * 0.21;
    setData([...data, Number(emission.toFixed(2))]);

    const newHealth = health + km * 0.1;
    setHealth(newHealth);

    // monthly tracking
    const month = new Date(date).getMonth();
    const updated = [...monthlyData];
    updated[month] += emission;
    setMonthlyData(updated);

    // streak system
    const currentDate = new Date(date);

    if (lastDate) {
      const diff = (currentDate - lastDate) / (1000 * 60 * 60 * 24);

      if (diff === 1) setStreak(streak + 1);
      else if (diff > 1) setStreak(1);
    } else {
      setStreak(1);
    }

    setLastDate(currentDate);
    setDistance("");
  };

  // 🏆 BADGES SYSTEM
  const badges = [
    { name: "Starter 🌱", desc: "First steps taken", unlocked: health >= 5, img: "/badge1.png" },
    { name: "Consistent 🔥", desc: "3 day streak", unlocked: streak >= 3, img: "/badge2.png" },
    { name: "Eco Hero 🌍", desc: "20+ impact", unlocked: health >= 20, img: "/badge3.png" },
    { name: "Impact Legend 🏆", desc: "50+ impact", unlocked: health >= 50, img: "/badge4.png" },
    { name: "Next Level 🚀", desc: "100+ impact", unlocked: health >= 100, img: "/badge5.png" },
    { name: "Mythical 👑", desc: "300+ impact", unlocked: health >= 300, img: "/badge6.png" },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.overlay}>
        <div style={styles.wrapper}>

          {/* NAV */}
          <div style={styles.nav}>
            <img src="/logo192.png" style={styles.logo} alt="logo" />
            <h2>EcoTrack</h2>
          </div>

          {/* INPUT CARD */}
          <div style={styles.card}>
            <h1>Track Your Impact 🌱</h1>

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={styles.input}
            />

            <input
              type="number"
              placeholder="Distance (km)"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              style={styles.input}
            />

            <button onClick={calculate} style={styles.button}>
              Add Entry
            </button>

            {health > 0 && (
              <>
                <h2>{health.toFixed(1)} pts</h2>
                <p>🔥 Streak: {streak} days</p>
              </>
            )}

            <button
              onClick={() => setShowBadges(!showBadges)}
              style={styles.badgeButton}
            >
              View Badges 🏆
            </button>
          </div>

          {/* BADGES PANEL */}
          {showBadges && (
            <div style={styles.card}>
              <h3>🏆 Achievements</h3>

              <div style={styles.badgeGrid}>
                {badges.map((b, i) => (
                  <div
                    key={i}
                    style={{
                      textAlign: "center",
                      opacity: b.unlocked ? 1 : 0.3,
                    }}
                  >
                    <img src={b.img} style={{ width: "70px" }} alt="" />
                    <p>{b.name}</p>
                    <small>{b.desc}</small>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DAILY CHART */}
          {data.length > 0 && (
            <div style={styles.chartCard}>
              <h3>📊 Daily Emissions</h3>
              <Bar
                data={{
                  labels: data.map((_, i) => `Day ${i + 1}`),
                  datasets: [
                    {
                      label: "CO₂",
                      data: data,
                      backgroundColor: "#00ff99",
                    },
                  ],
                }}
              />
            </div>
          )}

          {/* MONTHLY CHART */}
          {monthlyData.some(v => v > 0) && (
            <div style={styles.chartCard}>
              <h3>🌍 Monthly Impact</h3>
              <Bar
                data={{
                  labels: [
                    "Jan","Feb","Mar","Apr","May","Jun",
                    "Jul","Aug","Sep","Oct","Nov","Dec"
                  ],
                  datasets: [
                    {
                      label: "Monthly CO₂",
                      data: monthlyData,
                      backgroundColor: "#2196F3",
                    },
                  ],
                }}
              />
            </div>
          )}

          {/* FOOTER */}
          <p style={styles.footer}>Made by: Hsu Yamone Minn</p>

        </div>
      </div>
    </div>
  );
}

/* STYLES */
const styles = {
  container: {
    minHeight: "100vh",
    backgroundImage: "url(/bg.jpg)",
    backgroundSize: "cover",
  },

  overlay: {
    minHeight: "100vh",
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: "30px",
  },

  wrapper: {
    maxWidth: "900px",
    margin: "auto",
  },

  nav: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: "white",
  },

  logo: { width: "40px" },

  card: {
    marginTop: "20px",
    background: "rgba(255,255,255,0.08)",
    padding: "20px",
    borderRadius: "12px",
    color: "white",
  },

  input: {
    width: "100%",
    padding: "10px",
    marginTop: "10px",
  },

  button: {
    width: "100%",
    padding: "10px",
    marginTop: "10px",
    background: "#00ff99",
    border: "none",
  },

  badgeButton: {
    marginTop: "10px",
    padding: "8px",
    background: "#ffaa00",
    border: "none",
    cursor: "pointer",
  },

  badgeGrid: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
  },

  chartCard: {
    marginTop: "20px",
    background: "rgba(255,255,255,0.08)",
    padding: "20px",
    borderRadius: "12px",
  },

  footer: {
    marginTop: "40px",
    fontSize: "12px",
    color: "#aaa",
    textAlign: "right",
  },
};

export default App;