const Company = require('../models/Company');

exports.getCompanies = async (req, res) => {
  try {
    const companies = await Company.find({ status: 'ACTIVE' });
    res.json({ success: true, data: companies });
  } catch (error) { res.status(500).json({ success: false, message: 'Server Error' }); }
};

exports.getCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ success: false, message: 'Company not found' });
    res.json({ success: true, data: company });
  } catch (error) { res.status(500).json({ success: false, message: 'Server Error' }); }
};

exports.searchCompanies = async (req, res) => {
  try {
    const { q } = req.query;
    const regex = new RegExp(q, 'i');
    const companies = await Company.find({
      status: 'ACTIVE',
      $or: [{ name: regex }, { symbol: regex }, { sector: regex }]
    });
    res.json({ success: true, data: companies });
  } catch (error) { res.status(500).json({ success: false, message: 'Server Error' }); }
};

// Admin routes
exports.getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find();
    res.json({ success: true, data: companies });
  } catch (error) { res.status(500).json({ success: false, message: 'Server Error' }); }
};

exports.createCompany = async (req, res) => {
  try {
    const company = await Company.create(req.body);
    res.status(201).json({ success: true, data: company });
  } catch (error) { res.status(500).json({ success: false, message: 'Server Error' }); }
};

exports.updateCompany = async (req, res) => {
  try {
    const company = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!company) return res.status(404).json({ success: false, message: 'Company not found' });
    res.json({ success: true, data: company });
  } catch (error) { res.status(500).json({ success: false, message: 'Server Error' }); }
};

exports.deleteCompany = async (req, res) => {
  try {
    const company = await Company.findByIdAndDelete(req.params.id);
    if (!company) return res.status(404).json({ success: false, message: 'Company not found' });
    res.json({ success: true, message: 'Company removed' });
  } catch (error) { res.status(500).json({ success: false, message: 'Server Error' }); }
};