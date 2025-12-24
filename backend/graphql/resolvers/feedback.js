import Feedback from '../../models/feedback.js';
import { getComplaint, transformFeedback } from '../../helpers/common.js';
import { errorNames } from '../../helpers/errorConstants.js';


export default {
    createFeedback: async (args, req) => {
        console.log('createFeedback called with args:', args);
        console.log('req.isAuth:', req.isAuth, 'req.isDeanAuth:', req.isDeanAuth, 'req.userId:', req.userId);
        if (!req.isAuth) {
            console.log('Unauthorized: req.isAuth false');
            throw new Error(errorNames.UNAUTHORIZED_CLIENT);
        }
        try {
            let req_complaint = await getComplaint(args.feedbackInput.complaint_id, 'Resolved');
            console.log('Found complaint:', req_complaint?._id?.toString());
            if (!req_complaint) {
                console.log('Complaint not resolved or not found');
                throw new Error(errorNames.UNRESOLVED_COMPLAINT);
            }
            console.log('Complaint complainee:', req_complaint.complainee);
            console.log('Request userId:', req.userId);

            // Optional bypass for debugging. Set SKIP_FEEDBACK_AUTH=true in backend .env to skip complainee check.
            if (process.env.SKIP_FEEDBACK_AUTH !== 'true') {
                if (req_complaint.complainee.toString() !== req.userId) {
                    console.log('User mismatch: complainee !== req.userId');
                    throw new Error(errorNames.FEEDBACK_UNAUTH);
                }
            } else {
                console.log('SKIP_FEEDBACK_AUTH enabled, skipping complainee ownership check');
            }

            let exist_feedback = await Feedback.findOne({
                complaint: args.feedbackInput.complaint_id,
                feedbacker: req.userId
            });
            console.log('exist_feedback:', !!exist_feedback);
            if (exist_feedback) {
                throw new Error(errorNames.FEEDBACK_EXIST);
            }

            const feedback = new Feedback({
                feedback_text: args.feedbackInput.feedback_text,
                createdAt: new Date(),
                complaint: args.feedbackInput.complaint_id,
                feedbacker: req.userId
            });
            let result = await feedback.save();
            console.log('Feedback saved:', result._id);
            return transformFeedback(result);
        } catch (err) {
            console.log('Feedback creation error:', err.message);
            throw err;
        }
    },


    getFeedback: async ({ complaintId }, req) => {
        console.log('getFeedback called with complaintId:', complaintId);
        console.log('req.isAuth:', req.isAuth, 'req.isDeanAuth:', req.isDeanAuth, 'req.userId:', req.userId);
        if (!req.isAuth) {
            console.log('getFeedback: unauthorized (not authenticated)');
            throw new Error(errorNames.UNAUTHORIZED_CLIENT);
        }
        try {
            let req_complaint = await getComplaint(complaintId, 'Resolved');
            console.log('getFeedback: found complaint:', req_complaint?._id?.toString());
            if (!req_complaint) {
                console.log('getFeedback: complaint not resolved or not found');
                throw new Error(errorNames.UNRESOLVED_COMPLAINT);
            }
            if (!req.isDeanAuth) {
                console.log('getFeedback: requester is not dean');
                throw new Error(errorNames.FEEDBACK_UNAUTH);
            }

            let feedback = await Feedback.findOne({
                complaint: complaintId
            });
            console.log('getFeedback: feedback found:', !!feedback);
            return transformFeedback(feedback);
        } catch (err) {
            console.log('getFeedback error:', err.message);
            throw err;
        }
    }
};