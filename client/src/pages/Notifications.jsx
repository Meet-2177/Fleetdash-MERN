import { useEffect, useState } from "react";
import {
  Box,
  Card,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import toast from "react-hot-toast";
import PageHeader from "../components/common/PageHeader";
import TableSkeleton from "../components/common/TableSkeleton";
import EmptyState from "../components/common/EmptyState";
import ConfirmDialog from "../components/common/ConfirmDialog";
import useRoleAccess from "../hooks/useRoleAccess";
import {
  getNotifications,
  markAsRead,
  deleteNotification,
  createNotification,
} from "../services/notificationService";
import { NOTIFICATION_TYPES } from "../utils/constants";
import { formatDateTime } from "../utils/formatters";

const Notifications = () => {
  const { canCreate, canDelete } = useRoleAccess("notifications");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ title: "", message: "", type: "System" });

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await getNotifications();
      setNotifications(data.notifications || []);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleMarkRead = async (id) => {
    try {
      await markAsRead(id);
      fetchData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleCreate = async () => {
    setSubmitting(true);
    try {
      await createNotification(form);
      toast.success("Notification created");
      setDialogOpen(false);
      setForm({ title: "", message: "", type: "System" });
      fetchData();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setSubmitting(true);
    try {
      await deleteNotification(selected._id);
      toast.success("Notification deleted");
      setDeleteOpen(false);
      fetchData();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box>
      <PageHeader
        title="Notifications"
        subtitle="System alerts and updates"
        actionLabel={canCreate ? "Create Notification" : undefined}
        onAction={canCreate ? () => setDialogOpen(true) : undefined}
        actionIcon={<AddIcon />}
      />

      {loading ? (
        <TableSkeleton cols={1} rows={5} />
      ) : notifications.length === 0 ? (
        <Card><EmptyState title="No notifications" /></Card>
      ) : (
        <Card>
          <List disablePadding>
            {notifications.map((n) => (
              <ListItem
                key={n._id}
                divider
                sx={{
                  bgcolor: n.isRead ? "transparent" : "action.hover",
                  py: 2,
                }}
                secondaryAction={
                  <Box>
                    {!n.isRead && (
                      <IconButton edge="end" onClick={() => handleMarkRead(n._id)} color="primary">
                        <MarkEmailReadIcon />
                      </IconButton>
                    )}
                    {canDelete && (
                      <IconButton edge="end" color="error" onClick={() => { setSelected(n); setDeleteOpen(true); }}>
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Box>
                }
              >
                <ListItemText
                  primary={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography fontWeight={n.isRead ? 400 : 600}>{n.title}</Typography>
                      <Chip label={n.type} size="small" variant="outlined" />
                      {!n.isRead && <Chip label="New" size="small" color="error" />}
                    </Box>
                  }
                  secondary={
                    <>
                      <Typography variant="body2" color="text.secondary">{n.message}</Typography>
                      <Typography variant="caption" color="text.disabled">{formatDateTime(n.createdAt)}</Typography>
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Card>
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create Notification</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <TextField fullWidth label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Message" multiline rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth select label="Type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                {NOTIFICATION_TYPES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate} disabled={submitting}>
            {submitting ? "Creating..." : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={deleteOpen}
        title="Delete Notification"
        message="Are you sure you want to delete this notification?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
        loading={submitting}
      />
    </Box>
  );
};

export default Notifications;
