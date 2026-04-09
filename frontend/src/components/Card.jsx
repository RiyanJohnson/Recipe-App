// components/Card.jsx
function Card({ title, children }) {
  return (
    <div className="card">
      <div style={{ marginBottom: "10px", fontWeight: "bold" }}>
        {title}
      </div>
      {children}
    </div>
  );
}

export default Card;