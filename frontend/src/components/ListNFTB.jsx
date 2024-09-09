import React, { useState } from "react";

// Ví dụ dữ liệu NFT
const nftData = [
  { id: 1, name: "NFT 1", image: "https://via.placeholder.com/150" },
  { id: 2, name: "NFT 2", image: "https://via.placeholder.com/150" },
  { id: 3, name: "NFT 3", image: "https://via.placeholder.com/150" },
];

const ListNFTB = () => {
  const [showNFTList, setShowNFTList] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState(null);

  const handleInputClick = () => {
    setShowNFTList(!showNFTList);
  };

  const handleNFTSelect = (nft) => {
    setSelectedNFT(nft);
    setShowNFTList(false);
  };

  return (
    <div>
      <input
        type="text"
        readOnly
        onClick={handleInputClick}
        value={selectedNFT ? selectedNFT.name : "Select an NFT"}
      />
      {showNFTList && (
        <div className="nft-list">
          {nftData.map((nft) => (
            <div
              key={nft.id}
              className="nft-item"
              onClick={() => handleNFTSelect(nft)}
            >
              <img src={nft.image} alt={nft.name} />
              <span>{nft.name}</span>
            </div>
          ))}
        </div>
      )}
      <style jsx>{`
        .nft-list {
          border: 1px solid #ccc;
          border-radius: 4px;
          position: absolute;
          background: white;
          z-index: 1000;
          max-height: 200px;
          overflow-y: auto;
        }
        .nft-item {
          display: flex;
          align-items: center;
          padding: 8px;
          cursor: pointer;
        }
        .nft-item:hover {
          background-color: #f0f0f0;
        }
        .nft-item img {
          width: 50px;
          height: 50px;
          margin-right: 8px;
        }
      `}</style>
    </div>
  );
};

export default ListNFTB;
