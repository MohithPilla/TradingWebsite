const Notification = require('../models/Notification');

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id }).sort('-createdAt');
    res.json({ success: true, data: notifications });
  } catch (error) { res.status(500).json({ success: false, message: 'Server Error' }); }
};

exports.markAsRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ success: true, message: 'Marked as read' });
  } catch (error) { res.status(500).json({ success: false, message: 'Server Error' }); }
};

exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.user.id }, { isRead: true });
    res.json({ success: true, message: 'All marked as read' });
  } catch (error) { res.status(500).json({ success: false, message: 'Server Error' }); }
};