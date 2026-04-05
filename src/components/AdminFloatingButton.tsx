import { Link } from "react-router-dom";
import { Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";

const AdminFloatingButton = () => {
  const { roles, isLoading } = useAuth();

  if (isLoading || !roles.includes("admin")) return null;

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="fixed bottom-20 right-6 z-50"
    >
      <Link to="/admin">
        <button className="h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl flex items-center justify-center transition-all hover:scale-110 group">
          <Settings className="h-6 w-6 group-hover:animate-spin" />
        </button>
      </Link>
      <span className="absolute -top-8 right-0 bg-popover text-popover-foreground text-xs px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap">
        Admin Panel
      </span>
    </motion.div>
  );
};

export default AdminFloatingButton;
