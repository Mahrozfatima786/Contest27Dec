import React, { useState } from "react";
import axios from "axios";
import "./App.css"; 

interface PostOffice {
  Name: string;
  BranchType: string;
  DeliveryStatus: string;
  District: string;
  Division: string;
}

interface ApiResponse {
  Message: string;
  Status: string;
  PostOffice: PostOffice[] | null;
}

const App: React.FC = () => {
  const [pincode, setPincode] = useState("");
  const [data, setData] = useState<PostOffice[]>([]);
  const [filteredData, setFilteredData] = useState<PostOffice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filterText, setFilterText] = useState("");
  const [showResults, setShowResults] = useState(false);

  const handleLookup = async () => {
    setError("");
    if (pincode.length !== 6 || !/^\d{6}$/.test(pincode)) {
      setError("Pincode must be 6 digits!");
      return;
    }
    setLoading(true);
    setShowResults(false);
    try {
      const response = await axios.get<ApiResponse[]>(
        `https://api.postalpincode.in/pincode/${pincode}`
      );
      const resData = response.data[0];
      if (resData.Status === "Success" && resData.PostOffice) {
        setData(resData.PostOffice);
        setFilteredData(resData.PostOffice);
        setShowResults(true);
      } else {
        setError(resData.Message || "No data found");
        setData([]);
        setFilteredData([]);
        setShowResults(true);
      }
    } catch (err) {
      setError("Error fetching data");
      setData([]);
      setFilteredData([]);
      setShowResults(true);
    }
    setLoading(false);
  };

  const handleFilter = (text: string) => {
    setFilterText(text);
    const filtered = data.filter((post) =>
      post.Name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredData(filtered);
  };

  return (
    <div style={{ padding: "20px", gap: "50px" }}>
      {!showResults && (
        <div>
          <h3 style={{ textAlign: "justify"}}>Enter Pincode</h3>
          <input
            type="text"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            placeholder="Pincode"
            maxLength={6}
            style={{ padding: "8px", width: "200px", marginRight: "10px" }}
          />
          <div style={{ marginTop:" 10px" ,
    textAlign: "justify"

          }}>
    <button
  onClick={handleLookup}
  style={{
    padding: "8px 16px",
    backgroundColor: "black",  
    color: "white",            
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  }}
>
  Lookup
</button>
</div>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      )}

      {showResults && (
        <div style={{ flex: 1 }}>
          <h3>Pincode: {pincode}</h3>
          {loading && <p>Loading...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}

          {!loading && !error && (
            <>
              <p>Message: Number of pincode(s) found: {filteredData.length}</p>
              <input
                type="text"
                placeholder="Filter"
                value={filterText}
                onChange={(e) => handleFilter(e.target.value)}
                style={{
                  padding: "6px",
                  marginBottom: "10px",
                  width: "100%",
                }}
              />

              {filteredData.length === 0 ? (
                <p>Couldn’t find the postal data you’re looking for…</p>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "10px",
                  }}
                >
                  {filteredData.map((post, index) => (
                    <div
                      key={index}
                      style={{
                        border: "1px solid #ccc",
                        padding: "10px",
                        borderRadius: "5px",
                      }}
                    >
                      <p><strong>Name:</strong> {post.Name}</p>
                      <p><strong>Branch Type:</strong> {post.BranchType}</p>
                      <p><strong>Delivery Status:</strong> {post.DeliveryStatus}</p>
                      <p><strong>District:</strong> {post.District}</p>
                      <p><strong>Division:</strong> {post.Division}</p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
