import React, { useState, useContext } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    IconButton,
    Typography,
    Box,
    CircularProgress,
    Container,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useMutation, useQuery, useLazyQuery } from '@apollo/client';
import { CREATE_FEEDBACK, GET_FEEDBACK } from '../../gql/queries/FEEDBACK';
import { LIST_COMPLAINTS_FEW } from '../../gql/queries/COMPLAINT';
import SnackBar from '../../snackbar/SnackBar';
import { AuthContext } from '../../App';

const ViewFeedback = ({ open, handleClose, complaintId, onFeedbackSubmit }) => {
    const [feedbackText, setFeedbackText] = useState('');
    const [severity, setSnackSeverity] = useState('');
    const [snackMessage, setSnackMessage] = useState('');
    const authContext = useContext(AuthContext);
    const isDean = authContext?.role === 'dean';

    // Dean mode: list resolved complaints and view feedback
    const { data: listData, loading: listLoading, error: listError } = useQuery(LIST_COMPLAINTS_FEW, {
        variables: { status: 'Resolved', userId: null },
        skip: !isDean,
    });

    const [selectedComplaintId, setSelectedComplaintId] = useState(null);
    const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
    const [getFeedback, { data: feedbackData, loading: feedbackLoading, error: feedbackError }] = useLazyQuery(GET_FEEDBACK);

    const [createFeedback, { loading }] = useMutation(CREATE_FEEDBACK, {
        onCompleted: (data) => {
            setSnackSeverity('');
            setSnackMessage('Feedback submitted successfully!');
            setSnackSeverity('success');
            setFeedbackText('');
            setTimeout(() => {
                handleClose();
                if (onFeedbackSubmit) {
                    onFeedbackSubmit();
                }
            }, 2000);
        },
        onError: (error) => {
            setSnackSeverity('');
            setSnackMessage(error.message || 'Error submitting feedback');
            setSnackSeverity('error');
        },
    });

    const handleSubmit = async () => {
        if (!feedbackText.trim()) {
            setSnackSeverity('');
            setSnackMessage('Please enter feedback text');
            setSnackSeverity('error');
            return;
        }

        try {
            await createFeedback({
                variables: {
                    feedbackInput: {
                        feedback_text: feedbackText,
                        complaint_id: complaintId,
                    },
                },
            });
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // If complaintId prop provided -> existing submit dialog for students
    if (complaintId) {
        return (
            <>
                {severity !== '' && (
                    <SnackBar message={snackMessage} severity={severity} />
                )}
                <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                    <DialogTitle
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        Give Feedback
                        <IconButton
                            edge="end"
                            color="inherit"
                            onClick={handleClose}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent>
                        <Box style={{ marginTop: '10px' }}>
                            <Typography variant="body2" color="textSecondary">
                                Please provide your feedback for this resolved complaint:
                            </Typography>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                placeholder="Enter your feedback here..."
                                value={feedbackText}
                                onChange={(e) => setFeedbackText(e.target.value)}
                                variant="outlined"
                                style={{ marginTop: '15px' }}
                                disabled={loading}
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} disabled={loading}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            variant="contained"
                            color="primary"
                            disabled={loading || !feedbackText.trim()}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Submit Feedback'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </>
        );
    }

    // Dean view: list resolved complaints and view feedback
    return (
        <>
            <Dialog open={feedbackDialogOpen} onClose={() => setFeedbackDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Feedback</DialogTitle>
                <DialogContent>
                    {feedbackLoading && <CircularProgress />}
                    {feedbackError && <Typography color="error">{feedbackError.message}</Typography>}
                    {feedbackData?.getFeedback && (
                        <Box>
                            <Typography variant="subtitle1">{feedbackData.getFeedback.feedback_text}</Typography>
                            <Typography variant="caption">By: {feedbackData.getFeedback.feedbacker?.name}</Typography>
                        </Box>
                    )}
                    {!feedbackData?.getFeedback && !feedbackLoading && (
                        <Typography>No feedback found for this complaint.</Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setFeedbackDialogOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>

            <Container style={{ marginTop: 24 }}>
                <Typography variant="h5" gutterBottom>Resolved Complaints</Typography>
                {listLoading && <CircularProgress />}
                {listError && <Typography color="error">{listError.message}</Typography>}
                {listData?.listComplaints?.length === 0 && <Typography>No resolved complaints.</Typography>}
                {listData?.listComplaints?.map((c) => (
                    <Box key={c._id} sx={{ mb: 2, p: 2, border: '1px solid #ddd' }}>
                        <Typography variant="h6">{c.complaint_category}</Typography>
                        <Typography variant="body2">Section - {c.section}</Typography>
                        <Button sx={{ mt: 1 }} variant="outlined" onClick={() => {
                            setSelectedComplaintId(c._id);
                            getFeedback({ variables: { complaintId: c._id } });
                            setFeedbackDialogOpen(true);
                        }}>View Feedback</Button>
                    </Box>
                ))}
            </Container>
        </>
    );
};

export default ViewFeedback;