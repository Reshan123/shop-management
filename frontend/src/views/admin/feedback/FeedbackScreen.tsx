import React, { useState, useMemo } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Container,
  Modal,
  Box,
  TextField,
  TextareaAutosize,
  InputLabel,
  Typography,
} from "@mui/material";
import { useFeedback } from "../../../hooks/useFeedback";
import { Feedback } from "../../../context/feedbackContext";

const FeedbackScreen = () => {
  const { feedbacks, addFeedback, updateFeedback, deleteFeedback } =
    useFeedback();
  const [open, setOpen] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentFeedback, setCurrentFeedback] = useState<Feedback>({
    _id: "",
    userId: {
      _id: "",
      email: "",
    },
    name: "",
    email: "",
    rating: 1,
    comment: "",
    date: "",
    reply: "",
  });

  // Filter feedbacks based on search term
  const filteredFeedbacks = useMemo(() => {
    return feedbacks.filter(
      (feedback) =>
        feedback.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.reply?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.rating.toString().includes(searchTerm.toLowerCase())
    );
  }, [feedbacks, searchTerm]);

  const handleOpen = () => {
    setIsUpdate(false);
    setCurrentFeedback({
      _id: "",
      userId: {
        _id: "",
        email: "",
      },
      name: "",
      email: "",
      rating: 1,
      comment: "",
      date: "",
      reply: "",
    });
    setOpen(true);
  };

  const handleUpdateOpen = (feedback: Feedback) => {
    setIsUpdate(true);
    setCurrentFeedback(feedback);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentFeedback({ ...currentFeedback, [name]: value });
  };

  const handleSave = async () => {
    if (isUpdate) {
      const result = await updateFeedback(currentFeedback);
      if (result) {
        handleClose();
        alert("Feedback reply updated successfully");
      } else {
        alert("Failed to update feedback reply");
      }
    } else {
      const result = await addFeedback(currentFeedback);
      if (result) {
        handleClose();
      } else {
        alert("Failed to add feedback");
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <Container maxWidth="lg" sx={{ marginTop: 5 }} className="no-print">
        <Paper
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 5,
            backgroundColor: "inherit",
            border: "none",
            boxShadow: "none",
          }}
        >
          <Button variant="contained" color="primary" onClick={handleOpen}>
            Add Feedback
          </Button>
          <TextField
            label="Search feedback"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ width: "300px" }}
          />
          <Button variant="contained" color="inherit" onClick={handlePrint}>
            Print Report
          </Button>
        </Paper>
        <TableContainer component={Paper} sx={{ marginBottom: 5 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Comment</TableCell>
                <TableCell>Reply</TableCell>
                <TableCell className="no-print">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredFeedbacks.map((feedback) => (
                <TableRow key={feedback._id}>
                  <TableCell>{feedback.name}</TableCell>
                  <TableCell>{feedback.email}</TableCell>
                  <TableCell>{feedback.rating}</TableCell>
                  <TableCell>
                    {new Date(feedback.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{feedback.comment}</TableCell>
                  <TableCell>{feedback.reply}</TableCell>
                  <TableCell
                    className="no-print"
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "stretch",
                      gap: 2,
                    }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleUpdateOpen(feedback)}
                    >
                      Update
                    </Button>
                    <Button
                      variant="contained"
                      sx={{ backgroundColor: "red" }}
                      onClick={() => {
                        if (
                          window.confirm(
                            "Are you sure you want to delete this feedback?"
                          )
                        ) {
                          deleteFeedback(feedback._id);
                        }
                      }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>

      {/* Printable table */}
      <div className="print-only">
        <Typography variant="h5" gutterBottom>
          Feedback Report
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Comment</TableCell>
              <TableCell>Reply</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredFeedbacks.map((feedback) => (
              <TableRow key={feedback._id}>
                <TableCell>{feedback.name}</TableCell>
                <TableCell>{feedback.email}</TableCell>
                <TableCell>{feedback.rating}</TableCell>
                <TableCell>
                  {new Date(feedback.date).toLocaleDateString()}
                </TableCell>
                <TableCell>{feedback.comment}</TableCell>
                <TableCell>{feedback.reply}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <h2>{isUpdate ? "Update Feedback" : "Add Feedback"}</h2>
          <TextField
            label="Name"
            name="name"
            value={currentFeedback.name}
            onChange={handleChange}
            fullWidth
            disabled={isUpdate}
            margin="normal"
          />
          <TextField
            label="Email"
            name="email"
            value={currentFeedback.email}
            onChange={handleChange}
            fullWidth
            disabled={isUpdate}
            margin="normal"
          />
          <TextField
            label="Rating"
            name="rating"
            type="number"
            inputProps={{ min: 1, max: 5 }}
            value={currentFeedback.rating}
            onChange={handleChange}
            fullWidth
            disabled={isUpdate}
            margin="normal"
          />
          <InputLabel htmlFor="comment">Comment</InputLabel>
          <TextareaAutosize
            name="comment"
            value={currentFeedback.comment}
            disabled={isUpdate}
            onChange={(e) =>
              setCurrentFeedback({
                ...currentFeedback,
                comment: e.target.value,
              })
            }
            minRows={5}
            style={{ width: "100%", border: "1px solid #ccc", padding: 10 }}
          />
          <TextField
            label="Reply"
            name="reply"
            value={currentFeedback.reply}
            onChange={(e) =>
              setCurrentFeedback({
                ...currentFeedback,
                reply: e.target.value,
              })
            }
            fullWidth
            margin="normal"
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 2,
            }}
          >
            <Button variant="contained" color="primary" onClick={handleSave}>
              Save
            </Button>
            <Button variant="contained" color="inherit" onClick={handleClose}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default FeedbackScreen;
