import React, { useState, useEffect } from 'react';
import axios from 'axios';


const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Materials = () => {
  const [materials, setMaterials] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const response = await axios.get(`${API}/materials`);
      setMaterials(response.data);
    } catch (error) {
      console.error('Error fetching materials:', error);
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

  const getItemCategoryBadge = (category) => {
    const categoryClasses = {
      standard: 'bg-blue-100 text-blue-800',
      service: 'bg-green-100 text-green-800',
      stock: 'bg-purple-100 text-purple-800',
      consignment: 'bg-yellow-100 text-yellow-800',
      subcontracting: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryClasses[category] || 'bg-gray-100 text-gray-800'}`}>
        {category.charAt(0).toUpperCase() + category.slice(1)}
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
          <h1 className="text-3xl font-bold text-gray-900">Material Management</h1>
          <p className="text-gray-600">Manage material master data</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-sap"
        >
          Create Material
        </button>
      </div>

      {/* Materials Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full data-grid">
          <thead>
            <tr>
              <th>Material Number</th>
              <th>Description</th>
              <th>Material Group</th>
              <th>Base Unit</th>
              <th>Plant</th>
              <th>Purchasing Group</th>
              <th>Item Category</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {materials.map((material) => (
              <tr key={material.id}>
                <td className="font-medium">{material.material_number}</td>
                <td>{material.description}</td>
                <td>{material.material_group}</td>
                <td>{material.base_unit}</td>
                <td>{material.plant}</td>
                <td>{material.purchasing_group}</td>
                <td>{getItemCategoryBadge(material.item_category)}</td>
                <td>{formatDate(material.created_at)}</td>
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
        {materials.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No materials found</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-4 btn-sap"
            >
              Create Your First Material
            </button>
          </div>
        )}
      </div>

      {/* Create Material Modal */}
      {showCreateModal && (
        <CreateMaterialModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchMaterials();
          }}
        />
      )}
    </div>
  );
};

const CreateMaterialModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    material_number: '',
    description: '',
    material_group: '',
    base_unit: 'PC',
    plant: '1AC',
    storage_location: '',
    purchasing_group: 'A01',
    item_category: 'standard'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/materials`, formData);
      onSuccess();
    } catch (error) {
      console.error('Error creating material:', error);
      alert('Error creating material');
    }
  };

  const generateMaterialNumber = () => {
    const timestamp = Date.now().toString().slice(-6);
    setFormData(prev => ({...prev, material_number: `100${timestamp}`}));
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content w-full max-w-4xl">
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Create Material</h2>
          </div>

          <div className="p-6 space-y-6">
            {/* Basic Data */}
            <div className="form-section">
              <div className="form-section-header">
                Basic Data
              </div>
              <div className="form-section-content">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Material Number</label>
                    <div className="flex">
                      <input
                        type="text"
                        className="form-input"
                        value={formData.material_number}
                        onChange={(e) => setFormData({...formData, material_number: e.target.value})}
                        required
                        placeholder="Enter material number"
                      />
                      <button
                        type="button"
                        onClick={generateMaterialNumber}
                        className="ml-2 btn-secondary text-sm"
                      >
                        Generate
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="form-label">Description</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      required
                      placeholder="Material description"
                    />
                  </div>
                  <div>
                    <label className="form-label">Material Group</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.material_group}
                      onChange={(e) => setFormData({...formData, material_group: e.target.value})}
                      required
                      placeholder="e.g., 1200"
                    />
                  </div>
                  <div>
                    <label className="form-label">Base Unit of Measure</label>
                    <select
                      className="form-input"
                      value={formData.base_unit}
                      onChange={(e) => setFormData({...formData, base_unit: e.target.value})}
                    >
                      <option value="PC">PC - Pieces</option>
                      <option value="KG">KG - Kilograms</option>
                      <option value="L">L - Liters</option>
                      <option value="M">M - Meters</option>
                      <option value="SET">SET - Set</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Plant and Storage Data */}
            <div className="form-section">
              <div className="form-section-header">
                Plant/Storage View
              </div>
              <div className="form-section-content">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="form-label">Plant</label>
                    <select
                      className="form-input"
                      value={formData.plant}
                      onChange={(e) => setFormData({...formData, plant: e.target.value})}
                    >
                      <option value="1AC">1AC - Main Plant</option>
                      <option value="2AD">2AD - Secondary Plant</option>
                      <option value="9AB0">9AB0 - Distribution Center</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Storage Location</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.storage_location}
                      onChange={(e) => setFormData({...formData, storage_location: e.target.value})}
                      placeholder="Optional storage location"
                    />
                  </div>
                  <div>
                    <label className="form-label">Item Category</label>
                    <select
                      className="form-input"
                      value={formData.item_category}
                      onChange={(e) => setFormData({...formData, item_category: e.target.value})}
                    >
                      <option value="standard">Standard</option>
                      <option value="service">Service</option>
                      <option value="stock">Stock</option>
                      <option value="consignment">Consignment</option>
                      <option value="subcontracting">Subcontracting</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Purchasing Data */}
            <div className="form-section">
              <div className="form-section-header">
                Purchasing Data
              </div>
              <div className="form-section-content">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Purchasing Group</label>
                    <select
                      className="form-input"
                      value={formData.purchasing_group}
                      onChange={(e) => setFormData({...formData, purchasing_group: e.target.value})}
                    >
                      <option value="A01">A01 - General Purchasing</option>
                      <option value="A02">A02 - Raw Materials</option>
                      <option value="A03">A03 - Services</option>
                      <option value="P001">P001 - Production Materials</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Additional Info</label>
                    <div className="p-3 bg-gray-50 rounded border text-sm text-gray-600">
                      <p>• Material will be available for purchase requisitions</p>
                      <p>• Purchasing group determines approval workflow</p>
                      <p>• Item category affects procurement process</p>
                    </div>
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
              Create Material
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Materials;