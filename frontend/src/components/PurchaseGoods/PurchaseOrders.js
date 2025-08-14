import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const PurchaseOrders = () => {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [vendors, setVendors] = useState([]);
  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    fetchPurchaseOrders();
    fetchVendors();
    fetchMaterials();
  }, []);

  const fetchPurchaseOrders = async () => {
    try {
      const response = await axios.get(`${API}/purchase-orders`);
      setPurchaseOrders(response.data);
    } catch (error) {
      console.error('Error fetching purchase orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVendors = async () => {
    try {
      const response = await axios.get(`${API}/vendors`);
      setVendors(response.data);
    } catch (error) {
      console.error('Error fetching vendors:', error);
    }
  };

  const fetchMaterials = async () => {
    try {
      const response = await axios.get(`${API}/materials`);
      setMaterials(response.data);
    } catch (error) {
      console.error('Error fetching materials:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      draft: 'status-draft',
      submitted: 'status-submitted',
      approved: 'status-approved',
      rejected: 'status-rejected'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const calculateTotalValue = (items) => {
    return items.reduce((total, item) => total + (item.po_quantity * item.net_price), 0).toFixed(2);
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
          <h1 className="text-3xl font-bold text-gray-900">Purchase Orders</h1>
          <p className="text-gray-600">Manage purchase orders to vendors</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-sap"
        >
          Create Purchase Order
        </button>
      </div>

      {/* Purchase Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full data-grid">
          <thead>
            <tr>
              <th>PO Number</th>
              <th>Date</th>
              <th>Vendor</th>
              <th>Purchasing Org</th>
              <th>Items</th>
              <th>Total Value</th>
              <th>Currency</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {purchaseOrders.map((po) => (
              <tr key={po.id}>
                <td className="font-medium">{po.po_number}</td>
                <td>{formatDate(po.doc_date)}</td>
                <td>{po.vendor_name}</td>
                <td>{po.purchasing_organization}</td>
                <td>{po.items?.length || 0}</td>
                <td>{calculateTotalValue(po.items || [])}</td>
                <td>{po.currency}</td>
                <td>{getStatusBadge(po.status)}</td>
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
        {purchaseOrders.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No purchase orders found</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-4 btn-sap"
            >
              Create Your First Purchase Order
            </button>
          </div>
        )}
      </div>

      {/* Create Purchase Order Modal */}
      {showCreateModal && (
        <CreatePOModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchPurchaseOrders();
          }}
          vendors={vendors}
          materials={materials}
        />
      )}
    </div>
  );
};

const CreatePOModal = ({ onClose, onSuccess, vendors, materials }) => {
  const [formData, setFormData] = useState({
    vendor_code: '',
    purchasing_organization: 'P001',
    purchasing_group: 'A01',
    company_code: '1015',
    payment_terms: '30',
    incoterms: '',
    currency: 'EUR',
    exchange_rate: 1.0,
    language: 'EN',
    telephone: '',
    created_by: 'USER001',
    items: []
  });

  const [currentItem, setCurrentItem] = useState({
    item_number: 10,
    material_number: '',
    short_text: '',
    po_quantity: 1,
    unit: 'PC',
    delivery_date: '',
    net_price: 0,
    currency: 'EUR',
    plant: '1AC',
    storage_location: '',
    material_group: '',
    purchasing_group: 'A01',
    over_delivery_tolerance: 10.0,
    under_delivery_tolerance: 10.0,
    gr_processing_time: 0,
    item_category: 'standard'
  });

  const [showItemForm, setShowItemForm] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);

  const selectVendor = (vendorCode) => {
    const vendor = vendors.find(v => v.vendor_code === vendorCode);
    if (vendor) {
      setSelectedVendor(vendor);
      setFormData(prev => ({
        ...prev,
        vendor_code: vendor.vendor_code,
        currency: vendor.currency,
        payment_terms: vendor.payment_terms,
        telephone: vendor.telephone
      }));
    }
  };

  const selectMaterial = (materialNumber) => {
    const material = materials.find(m => m.material_number === materialNumber);
    if (material) {
      setCurrentItem(prev => ({
        ...prev,
        material_number: material.material_number,
        short_text: material.description,
        unit: material.base_unit,
        material_group: material.material_group,
        purchasing_group: material.purchasing_group,
        plant: material.plant,
        item_category: material.item_category
      }));
    }
  };

  const addItem = () => {
    const newItem = {
      ...currentItem,
      item_number: (formData.items.length + 1) * 10
    };
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
    setCurrentItem({
      item_number: 10,
      material_number: '',
      short_text: '',
      po_quantity: 1,
      unit: 'PC',
      delivery_date: '',
      net_price: 0,
      currency: 'EUR',
      plant: '1AC',
      storage_location: '',
      material_group: '',
      purchasing_group: 'A01',
      over_delivery_tolerance: 10.0,
      under_delivery_tolerance: 10.0,
      gr_processing_time: 0,
      item_category: 'standard'
    });
    setShowItemForm(false);
  };

  const removeItem = (index) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.vendor_code) {
      alert('Please select a vendor');
      return;
    }
    if (formData.items.length === 0) {
      alert('Please add at least one item');
      return;
    }

    try {
      await axios.post(`${API}/purchase-orders`, formData);
      onSuccess();
    } catch (error) {
      console.error('Error creating purchase order:', error);
      alert('Error creating purchase order');
    }
  };

  const calculateItemTotal = (item) => {
    return (item.po_quantity * item.net_price).toFixed(2);
  };

  const calculateTotalValue = () => {
    return formData.items.reduce((total, item) => total + (item.po_quantity * item.net_price), 0).toFixed(2);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content w-full max-w-7xl">
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Create Purchase Order</h2>
          </div>

          <div className="p-6 space-y-6">
            {/* Vendor Selection */}
            <div className="form-section">
              <div className="form-section-header">
                Vendor Selection
              </div>
              <div className="form-section-content">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Vendor</label>
                    <select
                      className="form-input"
                      value={formData.vendor_code}
                      onChange={(e) => selectVendor(e.target.value)}
                      required
                    >
                      <option value="">Select Vendor</option>
                      {vendors.map((vendor) => (
                        <option key={vendor.id} value={vendor.vendor_code}>
                          {vendor.vendor_code} - {vendor.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {selectedVendor && (
                    <div>
                      <label className="form-label">Vendor Details</label>
                      <div className="p-3 bg-gray-50 rounded border">
                        <p className="text-sm"><strong>Name:</strong> {selectedVendor.name}</p>
                        <p className="text-sm"><strong>Address:</strong> {selectedVendor.street_address}, {selectedVendor.city}</p>
                        <p className="text-sm"><strong>Country:</strong> {selectedVendor.country}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Organizational Data */}
            <div className="form-section">
              <div className="form-section-header">
                Organizational Data
              </div>
              <div className="form-section-content">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="form-label">Purchasing Organization</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.purchasing_organization}
                      onChange={(e) => setFormData({...formData, purchasing_organization: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Purchasing Group</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.purchasing_group}
                      onChange={(e) => setFormData({...formData, purchasing_group: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Company Code</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.company_code}
                      onChange={(e) => setFormData({...formData, company_code: e.target.value})}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="form-section">
              <div className="form-section-header">
                Terms and Conditions
              </div>
              <div className="form-section-content">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="form-label">Payment Terms</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.payment_terms}
                      onChange={(e) => setFormData({...formData, payment_terms: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="form-label">Incoterms</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.incoterms}
                      onChange={(e) => setFormData({...formData, incoterms: e.target.value})}
                    />
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
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Exchange Rate</label>
                    <input
                      type="number"
                      className="form-input"
                      value={formData.exchange_rate}
                      onChange={(e) => setFormData({...formData, exchange_rate: parseFloat(e.target.value)})}
                      step="0.000001"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Items Section */}
            <div className="form-section">
              <div className="form-section-header flex justify-between items-center">
                <span>Purchase Order Items (Total: {formData.currency} {calculateTotalValue()})</span>
                <button
                  type="button"
                  onClick={() => setShowItemForm(true)}
                  className="btn-sap text-xs"
                >
                  Add Item
                </button>
              </div>
              <div className="form-section-content">
                {formData.items.length > 0 ? (
                  <table className="w-full data-grid">
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Material</th>
                        <th>Short Text</th>
                        <th>Quantity</th>
                        <th>Unit</th>
                        <th>Net Price</th>
                        <th>Total</th>
                        <th>Delivery Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.items.map((item, index) => (
                        <tr key={index}>
                          <td>{item.item_number}</td>
                          <td>{item.material_number}</td>
                          <td>{item.short_text}</td>
                          <td>{item.po_quantity}</td>
                          <td>{item.unit}</td>
                          <td>{item.net_price}</td>
                          <td>{calculateItemTotal(item)}</td>
                          <td>{item.delivery_date}</td>
                          <td>
                            <button
                              type="button"
                              onClick={() => removeItem(index)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-gray-500 text-center py-4">No items added yet</p>
                )}
              </div>
            </div>

            {/* Add Item Form */}
            {showItemForm && (
              <div className="form-section">
                <div className="form-section-header">
                  Add Purchase Order Item
                </div>
                <div className="form-section-content">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">Material Number</label>
                      <select
                        className="form-input"
                        value={currentItem.material_number}
                        onChange={(e) => selectMaterial(e.target.value)}
                        required
                      >
                        <option value="">Select Material</option>
                        {materials.map((material) => (
                          <option key={material.id} value={material.material_number}>
                            {material.material_number} - {material.description}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="form-label">Short Text</label>
                      <input
                        type="text"
                        className="form-input"
                        value={currentItem.short_text}
                        onChange={(e) => setCurrentItem({...currentItem, short_text: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <label className="form-label">PO Quantity</label>
                      <input
                        type="number"
                        className="form-input"
                        value={currentItem.po_quantity}
                        onChange={(e) => setCurrentItem({...currentItem, po_quantity: parseFloat(e.target.value)})}
                        required
                        min="0.01"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <label className="form-label">Unit</label>
                      <select
                        className="form-input"
                        value={currentItem.unit}
                        onChange={(e) => setCurrentItem({...currentItem, unit: e.target.value})}
                      >
                        <option value="PC">PC - Pieces</option>
                        <option value="KG">KG - Kilograms</option>
                        <option value="L">L - Liters</option>
                        <option value="M">M - Meters</option>
                        <option value="SET">SET - Set</option>
                      </select>
                    </div>
                    <div>
                      <label className="form-label">Net Price</label>
                      <input
                        type="number"
                        className="form-input"
                        value={currentItem.net_price}
                        onChange={(e) => setCurrentItem({...currentItem, net_price: parseFloat(e.target.value)})}
                        required
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <label className="form-label">Delivery Date</label>
                      <input
                        type="date"
                        className="form-input"
                        value={currentItem.delivery_date}
                        onChange={(e) => setCurrentItem({...currentItem, delivery_date: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <label className="form-label">Plant</label>
                      <input
                        type="text"
                        className="form-input"
                        value={currentItem.plant}
                        onChange={(e) => setCurrentItem({...currentItem, plant: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <label className="form-label">Item Category</label>
                      <select
                        className="form-input"
                        value={currentItem.item_category}
                        onChange={(e) => setCurrentItem({...currentItem, item_category: e.target.value})}
                      >
                        <option value="standard">Standard</option>
                        <option value="service">Service</option>
                        <option value="stock">Stock</option>
                        <option value="consignment">Consignment</option>
                        <option value="subcontracting">Subcontracting</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 mt-4">
                    <button
                      type="button"
                      onClick={() => setShowItemForm(false)}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={addItem}
                      className="btn-sap"
                    >
                      Add Item
                    </button>
                  </div>
                </div>
              </div>
            )}
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
              Create Purchase Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PurchaseOrders;