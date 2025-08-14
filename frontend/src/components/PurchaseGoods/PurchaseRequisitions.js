import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const PurchaseRequisitions = () => {
  const [purchaseRequisitions, setPurchaseRequisitions] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    fetchPurchaseRequisitions();
    fetchMaterials();
  }, []);

  const fetchPurchaseRequisitions = async () => {
    try {
      const response = await axios.get(`${API}/purchase-requisitions`);
      setPurchaseRequisitions(response.data);
    } catch (error) {
      console.error('Error fetching purchase requisitions:', error);
    } finally {
      setLoading(false);
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
          <h1 className="text-3xl font-bold text-gray-900">Purchase Requisitions</h1>
          <p className="text-gray-600">Manage purchase requisition requests</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-sap"
        >
          Create Purchase Requisition
        </button>
      </div>

      {/* Purchase Requisitions Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full data-grid">
          <thead>
            <tr>
              <th>PR Number</th>
              <th>Type</th>
              <th>Date</th>
              <th>Purchasing Org</th>
              <th>Plant</th>
              <th>Items</th>
              <th>Status</th>
              <th>Created By</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {purchaseRequisitions.map((pr) => (
              <tr key={pr.id}>
                <td className="font-medium">{pr.pr_number}</td>
                <td>{pr.pr_type}</td>
                <td>{formatDate(pr.pr_date)}</td>
                <td>{pr.purchasing_organization}</td>
                <td>{pr.plant}</td>
                <td>{pr.items?.length || 0}</td>
                <td>{getStatusBadge(pr.status)}</td>
                <td>{pr.created_by}</td>
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
        {purchaseRequisitions.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No purchase requisitions found</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-4 btn-sap"
            >
              Create Your First Purchase Requisition
            </button>
          </div>
        )}
      </div>

      {/* Create Purchase Requisition Modal */}
      {showCreateModal && (
        <CreatePRModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchPurchaseRequisitions();
          }}
          materials={materials}
        />
      )}
    </div>
  );
};

const CreatePRModal = ({ onClose, onSuccess, materials }) => {
  const [formData, setFormData] = useState({
    pr_type: 'NB',
    language_key: 'EN',
    quotation_deadline: '',
    purchasing_organization: 'P001',
    purchasing_group: 'A01',
    plant: '1AC',
    storage_location: '',
    material_group: '',
    req_tracking_number: '',
    created_by: 'USER001',
    items: []
  });

  const [currentItem, setCurrentItem] = useState({
    item_number: 10,
    material_number: '',
    short_text: '',
    quantity: 1,
    unit: 'PC',
    delivery_date: '',
    plant: '1AC',
    storage_location: '',
    purchasing_group: 'A01',
    material_group: '',
    tracking_number: '',
    estimated_price: 0
  });

  const [showItemForm, setShowItemForm] = useState(false);

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
      quantity: 1,
      unit: 'PC',
      delivery_date: '',
      plant: '1AC',
      storage_location: '',
      purchasing_group: 'A01',
      material_group: '',
      tracking_number: '',
      estimated_price: 0
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
    if (formData.items.length === 0) {
      alert('Please add at least one item');
      return;
    }

    try {
      await axios.post(`${API}/purchase-requisitions`, formData);
      onSuccess();
    } catch (error) {
      console.error('Error creating purchase requisition:', error);
      alert('Error creating purchase requisition');
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
        plant: material.plant
      }));
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content w-full max-w-6xl">
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Create Purchase Requisition</h2>
          </div>

          <div className="p-6 space-y-6">
            {/* Header Information */}
            <div className="form-section">
              <div className="form-section-header">
                Initial Screen
              </div>
              <div className="form-section-content">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="form-label">RFQ Type</label>
                    <select
                      className="form-input"
                      value={formData.pr_type}
                      onChange={(e) => setFormData({...formData, pr_type: e.target.value})}
                    >
                      <option value="NB">NB - Standard</option>
                      <option value="AN">AN - Request for Quotation</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Language Key</label>
                    <select
                      className="form-input"
                      value={formData.language_key}
                      onChange={(e) => setFormData({...formData, language_key: e.target.value})}
                    >
                      <option value="EN">EN - English</option>
                      <option value="DE">DE - German</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Quotation Deadline</label>
                    <input
                      type="date"
                      className="form-input"
                      value={formData.quotation_deadline}
                      onChange={(e) => setFormData({...formData, quotation_deadline: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Organizational Data */}
            <div className="form-section">
              <div className="form-section-header">
                Organizational Data
              </div>
              <div className="form-section-content">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                </div>
              </div>
            </div>

            {/* Default Data for Items */}
            <div className="form-section">
              <div className="form-section-header">
                Default Data for Items
              </div>
              <div className="form-section-content">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="form-label">Plant</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.plant}
                      onChange={(e) => setFormData({...formData, plant: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Storage Location</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.storage_location}
                      onChange={(e) => setFormData({...formData, storage_location: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="form-label">Material Group</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.material_group}
                      onChange={(e) => setFormData({...formData, material_group: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Items Section */}
            <div className="form-section">
              <div className="form-section-header flex justify-between items-center">
                <span>RFQ Items</span>
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
                          <td>{item.quantity}</td>
                          <td>{item.unit}</td>
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
                  Add New Item
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
                      <label className="form-label">Quantity</label>
                      <input
                        type="number"
                        className="form-input"
                        value={currentItem.quantity}
                        onChange={(e) => setCurrentItem({...currentItem, quantity: parseFloat(e.target.value)})}
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
                      <label className="form-label">Estimated Price</label>
                      <input
                        type="number"
                        className="form-input"
                        value={currentItem.estimated_price}
                        onChange={(e) => setCurrentItem({...currentItem, estimated_price: parseFloat(e.target.value)})}
                        min="0"
                        step="0.01"
                      />
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
              Create Purchase Requisition
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PurchaseRequisitions;