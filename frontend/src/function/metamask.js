import { toast } from "react-toastify";
import { ethers } from "ethers";

export default async function connectMetamask() {
  if (window.ethereum) {
    try {
      // Yêu cầu kết nối MetaMask
      await window.ethereum.request({ method: "eth_requestAccounts" });

      // Khởi tạo nhà cung cấp (provider)
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      // Lấy thông tin người dùng
      const signer = provider.getSigner();
      const address = await signer.getAddress();

      console.log("Connected address:", address);
      return { provider, signer, address };
    } catch (error) {
      toast.error("Error connecting MetaMask");
      console.error("Error connecting MetaMask:", error);
    }
  } else {
    toast.error("Please install metamask");
  }
}
