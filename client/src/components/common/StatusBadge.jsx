import { Chip } from "@mui/material";
import { STATUS_COLORS } from "../../utils/constants";

const StatusBadge = ({ status }) => {
  if (!status) return "—";
  return (
    <Chip
      label={status}
      size="small"
      color={STATUS_COLORS[status] || "default"}
      variant="filled"
      sx={{ fontWeight: 600, borderRadius: 999, px: 0.5 }}
    />
  );
};

export default StatusBadge;
