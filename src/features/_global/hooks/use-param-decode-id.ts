// hooks/useDecodedId.ts
import { simpleDecode } from "@/core/libs";
import { useParams } from "react-router-dom";

export const useDecodedId = () => {
  const params = useParams();
  
  try {
    const decoded = simpleDecode(params.id || "");
    
    return Number(decoded);
  } catch (err) {
    
    return null;
  }
};
