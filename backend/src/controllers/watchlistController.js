const Watchlist = require('../models/Watchlist');

exports.getWatchlist = async (req, res) => {
  try {
    let watchlist = await Watchlist.findOne({ userId: req.user.id }).populate('companyIds');
    if (!watchlist) {
      watchlist = await Watchlist.create({ userId: req.user.id, companyIds: [] });
    }
    res.json({ success: true, data: watchlist.companyIds });
  } catch (error) { res.status(500).json({ success: false, message: 'Server Error' }); }
};

exports.addToWatchlist = async (req, res) => {
  try {
    let watchlist = await Watchlist.findOne({ userId: req.user.id });
    if (!watchlist) {
      watchlist = await Watchlist.create({ userId: req.user.id, companyIds: [] });
    }
    if (!watchlist.companyIds.includes(req.params.companyId)) {
      watchlist.companyIds.push(req.params.companyId);
      await watchlist.save();
    }
    res.json({ success: true, message: 'Added to watchlist' });
  } catch (error) { res.status(500).json({ success: false, message: 'Server Error' }); }
};

exports.removeFromWatchlist = async (req, res) => {
  try {
    const watchlist = await Watchlist.findOne({ userId: req.user.id });
    if (watchlist) {
      watchlist.companyIds = watchlist.companyIds.filter(id => id.toString() !== req.params.companyId);
      await watchlist.save();
    }
    res.json({ success: true, message: 'Removed from watchlist' });
  } catch (error) { res.status(500).json({ success: false, message: 'Server Error' }); }
};