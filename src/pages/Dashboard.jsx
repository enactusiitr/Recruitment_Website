import { useState, useEffect } from "react";
import iitLogo from "../assets/IITR-Logo.png";

/* ================= SAMPLE DATA ================= */

const notices = Array.from({ length: 14 }, (_, i) => ({
  id: i + 1,
  club: i % 3 === 0 ? "COGNIZANCE" : i % 3 === 1 ? "CULTURAL COUNCIL" : "SDS LABS",
  type: i % 2 === 0 ? "Event" : "Recruitment",
  title: `Sample Notice ${i + 1}`,
  message: "Registration is open for interested students.",
  date: "21 Mar 2025",
  color:
    i % 3 === 0 ? "#2563eb" : i % 3 === 1 ? "#ec4899" : "#10b981",
}));

/* ================= CONSTANTS ================= */

const ITEMS_PER_PAGE = 4;
const TABS = ["Notices", "Events", "Recruitments", "Clubs"];

/* ================= COMPONENT ================= */

function Dashboard() {
  const [activeTab, setActiveTab] = useState("Notices");
  const [selectedClub, setSelectedClub] = useState("All Clubs");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedNotice, setSelectedNotice] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const userRole = "admin";

  const clubs = ["All Clubs", ...new Set(notices.map(n => n.club))];

  /* -------- FILTERING -------- */

  const clubFiltered =
    selectedClub === "All Clubs"
      ? notices
      : notices.filter(n => n.club === selectedClub);

  const tabFiltered = clubFiltered.filter(n => {
    if (activeTab === "Events") return n.type === "Event";
    if (activeTab === "Recruitments") return n.type === "Recruitment";
    if (activeTab === "Notices") return true;
    return false;
  });

  /* -------- PAGINATION -------- */

  const totalPages = Math.ceil(tabFiltered.length / ITEMS_PER_PAGE);

  const currentNotices = tabFiltered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, selectedClub]);

  /* ESC close modal */
  useEffect(() => {
    const esc = e => e.key === "Escape" && setSelectedNotice(null);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, []);

  /* ================= JSX ================= */

  return (
    <div style={page}>
      {/* HEADER */}
      <header style={header}>
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <img src={iitLogo} alt="IIT Roorkee" style={logo} />
          <div>
            <div style={{ fontWeight: 700 }}>
              IIT Roorkee Club Recruitment Website
            </div>
            <div style={{ fontSize: 12 }}>Enactus • IIT Roorkee</div>
          </div>
        </div>
        <div>
          <button style={loginBtn}>LOG IN</button>
          <button style={signupBtn}>SIGN UP</button>
        </div>
      </header>

      {/* CONTENT */}
      <main style={container}>
        {/* STICKY CONTROLS */}
        <div style={stickyBar}>
          <div style={controlsRow}>
            <div style={tabs}>
              {TABS.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    ...tabBtn,
                    borderBottom:
                      activeTab === tab
                        ? "3px solid #0fd1a6"
                        : "3px solid transparent",
                    color: activeTab === tab ? "#0fd1a6" : "#374151",
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab !== "Clubs" && (
              <>
                <select
                  style={filter}
                  value={selectedClub}
                  onChange={e => setSelectedClub(e.target.value)}
                >
                  {clubs.map(c => (
                    <option key={c}>{c}</option>
                  ))}
                </select>

                <button
                  style={addNoticeBtn}
                  //onClick={() => alert("Add Notice clicked")}
                  onClick={() => setShowAddModal(true)}

                >
                  + Add Notice
                </button>
              </>
            )}
          </div>
        </div>

        {/* NOTICES */}
        {activeTab !== "Clubs" &&
          currentNotices.map(n => (
            <article key={n.id} style={compactCard}>
              <div style={row}>
                <span
                  style={{
                    ...badge,
                    color: n.color,
                    borderColor: n.color,
                  }}
                >
                  {n.club}
                </span>

                <span style={typeBadge(n.type)}>{n.type}</span>

                <span style={date}>{n.date}</span>
              </div>

              <div style={contentRow}>
                <div style={textBlock}>
                  <strong>{n.title}</strong>
                  <span style={desc}> — {n.message}</span>
                </div>

                <button style={link} onClick={() => setSelectedNotice(n)}>
                  View →
                </button>
              </div>
            </article>
          ))}

        {/* PAGINATION */}
        {activeTab !== "Clubs" && totalPages > 1 && (
          <>
            <div style={pageInfo}>
              Page {currentPage} of {totalPages}
            </div>
            <div style={pagination}>
              <button
                style={pageBtn}
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
              >
                ‹
              </button>

              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  style={{
                    ...pageBtn,
                    background:
                      currentPage === i + 1 ? "#0fd1a6" : "#fff",
                    color:
                      currentPage === i + 1 ? "#fff" : "#000",
                  }}
                >
                  {i + 1}
                </button>
              ))}

              <button
                style={pageBtn}
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
              >
                ›
              </button>
            </div>
          </>
        )}
      </main>

      {/* MODAL */}
      {selectedNotice && (
        <div style={overlay} onClick={() => setSelectedNotice(null)}>
          <div style={modal} onClick={e => e.stopPropagation()}>
            <h2>{selectedNotice.title}</h2>
            <p>{selectedNotice.message}</p>
            <button style={cta}>APPLY / REGISTER</button>
          </div>
        </div>
      )}
      {showAddModal && (
  <div style={overlay} onClick={() => setShowAddModal(false)}>
    <div style={modal} onClick={e => e.stopPropagation()}>
      <h2>Add Notice</h2>

      <input style={input} placeholder="Title" />
      <textarea style={textarea} placeholder="Message" />

      <button style={cta}>SUBMIT</button>
    </div>
  </div>
)}

    </div>
  );
}


/* ================= STYLES ================= */

const page = { background: "#f3f2f0", minHeight: "100vh" };

const header = {
  background: "#f6c85f",
  margin: 20,
  padding: "18px 30px",
  borderRadius: 12,
  display: "flex",
  justifyContent: "space-between",
};

const logo = { height: 48, background: "#fff", padding: 6 };

const loginBtn = { marginRight: 10 };
const signupBtn = {
  background: "#0fd1a6",
  border: "none",
  padding: "8px 14px",
  fontWeight: 700,
};

const container = { maxWidth: 1100, margin: "0 auto", padding: 20 };

const stickyBar = { position: "sticky", top: 0, background: "#f3f2f0" };

const controlsRow = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  marginBottom: 10,
};

const tabs = {
  display: "flex",
  gap: 20,
  borderBottom: "1px solid #e5e7eb",
};

const tabBtn = {
  background: "none",
  border: "none",
  fontWeight: 700,
  cursor: "pointer",
};

const filter = { padding: 8, borderRadius: 8 };

const addNoticeBtn = {
  marginLeft: "auto",
  background: "#0fd1a6",
  border: "none",
  padding: "8px 14px",
  fontWeight: 700,
  borderRadius: 8,
  cursor: "pointer",
};

const compactCard = {
  background: "#fff",
  padding: "14px 18px",
  marginBottom: 14,
  borderRadius: 12,
  borderLeft: "5px solid #f6c85f",
};

const row = {
  display: "flex",
  gap: 10,
  alignItems: "center",
  marginBottom: 6,
  fontSize: 13,
};

const contentRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 12,
};

const textBlock = {
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  flex: 1,
};

const desc = { color: "#6b7280", fontWeight: 400 };

const date = { marginLeft: "auto", fontSize: 12, color: "#6b7280" };

const badge = {
  padding: "4px 10px",
  border: "1px solid",
  borderRadius: 999,
  fontWeight: 700,
};

const typeBadge = type => ({
  padding: "4px 10px",
  borderRadius: 999,
  background: type === "Recruitment" ? "#dcfce7" : "#eef2ff",
  fontWeight: 600,
});

const link = {
  background: "none",
  border: "none",
  color: "#2563eb",
  fontWeight: 600,
  cursor: "pointer",
};

const pagination = {
  display: "flex",
  justifyContent: "center",
  gap: 8,
  marginTop: 20,
};

const pageBtn = {
  padding: "6px 12px",
  borderRadius: 6,
  border: "1px solid #ddd",
};

const pageInfo = {
  textAlign: "center",
  marginTop: 12,
  color: "#6b7280",
};

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const modal = {
  background: "#fff",
  padding: 24,
  borderRadius: 14,
  width: 400,
};

const cta = {
  background: "#f6c85f",
  border: "none",
  padding: "10px 16px",
  marginTop: 12,
  fontWeight: 700,
  borderRadius: 8,
};

const input = {
  width: "100%",
  padding: 10,
  marginTop: 10,
  borderRadius: 6,
  border: "1px solid #ddd",
};

const textarea = {
  ...input,
  height: 80,
};

export default Dashboard;
