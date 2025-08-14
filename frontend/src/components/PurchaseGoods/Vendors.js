import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Vendors = () => {
  const [vendors, setVendors] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const response = await axios.get(`${API}/vendors`);
      setVendors(response.data);
    } catch (error) {
      console.error('Error fetching vendors:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vendor Management</h1>
          <p className="text-gray-600">Manage vendor master data</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-sap"
        >
          Create Vendor
        </button>
      </div>

      {/* Vendors Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full data-grid">
          <thead>
            <tr>
              <th>Vendor Code</th>
              <th>Name</th>
              <th>City</th>
              <th>Country</th>
              <th>Payment Terms</th>
              <th>Currency</th>
              <th>Telephone</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((vendor) => (
              <tr key={vendor.id}>
                <td className="font-medium">{vendor.vendor_code}</td>
                <td>{vendor.name}</td>
                <td>{vendor.city}</td>
                <td>{vendor.country}</td>
                <td>{vendor.payment_terms} Days</td>
                <td>{vendor.currency}</td>
                <td>{vendor.telephone || '-'}</td>
                <td>{formatDate(vendor.created_at)}</td>
                <td>
                  <button className="text-blue-600 hover:text-blue-800 text-sm mr-2">
                    View
                  </button>
                  <button className="text-green-600 hover:text-green-800 text-sm">
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {vendors.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No vendors found</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-4 btn-sap"
            >
              Create Your First Vendor
            </button>
          </div>
        )}
      </div>

      {/* Create Vendor Modal */}
      {showCreateModal && (
        <CreateVendorModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchVendors();
          }}
        />
      )}
    </div>
  );
};

const CreateVendorModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    vendor_code: '',
    name: '',
    title: '',
    street_address: '',
    postal_code: '',
    city: '',
    country: 'DE',
    region: '',
    telephone: '',
    email: '',
    payment_terms: '30',
    currency: 'EUR'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/vendors`, formData);
      onSuccess();
    } catch (error) {
      console.error('Error creating vendor:', error);
      alert('Error creating vendor');
    }
  };

  const generateVendorCode = () => {
    const timestamp = Date.now().toString().slice(-6);
    setFormData(prev => ({...prev, vendor_code: `V${timestamp}`}));
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content w-full max-w-4xl">
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Create Vendor</h2>
          </div>

          <div className="p-6 space-y-6">
            {/* General Data */}
            <div className="form-section">
              <div className="form-section-header">
                General Data
              </div>
              <div className="form-section-content">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Vendor Code</label>
                    <div className="flex">
                      <input
                        type="text"
                        className="form-input"
                        value={formData.vendor_code}
                        onChange={(e) => setFormData({...formData, vendor_code: e.target.value})}
                        required
                        placeholder="Enter vendor code"
                      />
                      <button
                        type="button"
                        onClick={generateVendorCode}
                        className="ml-2 btn-secondary text-sm"
                      >
                        Generate
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                      placeholder="Company name"
                    />
                  </div>
                  <div>
                    <label className="form-label">Title</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="Optional title"
                    />
                  </div>
                  <div>
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-input"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="contact@vendor.com"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="form-section">
              <div className="form-section-header">
                Address Information
              </div>
              <div className="form-section-content">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="form-label">Street Address</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.street_address}
                      onChange={(e) => setFormData({...formData, street_address: e.target.value})}
                      required
                      placeholder="Street and house number"
                    />
                  </div>
                  <div>
                    <label className="form-label">Postal Code</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.postal_code}
                      onChange={(e) => setFormData({...formData, postal_code: e.target.value})}
                      required
                      placeholder="12345"
                    />
                  </div>
                  <div>
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      required
                      placeholder="City name"
                    />
                  </div>
                  <div>
                    <label className="form-label">Country</label>
                    <select
                      className="form-input"
                      value={formData.country}
                      onChange={(e) => setFormData({...formData, country: e.target.value})}
                    >
                      <option value="DE">DE - Germany</option>
                      <option value="US">US - United States</option>
                      <option value="GB">GB - United Kingdom</option>
                      <option value="FR">FR - France</option>
                      <option value="IT">IT - Italy</option>
                      <option value="ES">ES - Spain</option>
                      <option value="NL">NL - Netherlands</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Region</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.region}
                      onChange={(e) => setFormData({...formData, region: e.target.value})}
                      placeholder="State/Region"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Contact and Payment Information */}
            <div className="form-section">
              <div className="form-section-header">
                Contact and Payment Terms
              </div>
              <div className="form-section-content">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="form-label">Telephone</label>
                    <input
                      type="tel"
                      className="form-input"
                      value={formData.telephone}
                      onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                      placeholder="+49 123 456789"
                    />
                  </div>
                  <div>
                    <label className="form-label">Payment Terms (Days)</label>
                    <select
                      className="form-input"
                      value={formData.payment_terms}
                      onChange={(e) => setFormData({...formData, payment_terms: e.target.value})}
                    >
                      <option value="0">0 - Immediate</option>
                      <option value="7">7 - Net 7 days</option>
                      <option value="14">14 - Net 14 days</option>
                      <option value="30">30 - Net 30 days</option>
                      <option value="60">60 - Net 60 days</option>
                      <option value="90">90 - Net 90 days</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Currency</label>
                    <select
                      className="form-input"
                      value={formData.currency}
                      onChange={(e) => setFormData({...formData, currency: e.target.value})}
                    >
                      <option value="EUR">EUR - Euro</option>
                      <option value="USD">USD - US Dollar</option>
                      <option value="GBP">GBP - British Pound</option>
                      <option value="JPY">JPY - Japanese Yen</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-sap"
            >
              Create Vendor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Vendors;