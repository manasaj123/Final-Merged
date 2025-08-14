import React, { useState , useEffect} from "react";

import {Link} from "react-router-dom";
// Component to create new documents
function CreateDocument({ onCreate }) {
  const [formData, setFormData] = useState({
    billing_type: 'Advance invoice BR',
    billing_date: new Date().toISOString().split('T')[0],
    pricing_date: '',
    service_rendered_date: '',
    due_date: '',
    customer_name: '',
    customer_email: '',
    customer_address: '',
    notes: ''
  });

  const [items, setItems] = useState([]);
  const [currentItem, setCurrentItem] = useState({
    item_name: '',
    description: '',
    category: 'Product',
    quantity: 1,
    unit_price: 0,
    tax_rate: 0
  });
  
  const [documentId, setDocumentId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const billingTypes = [
    'Advance invoice BR',
    'Standard invoice',
    'Receipt',
    'Credit note',
    'Proforma invoice'
  ];

  const itemCategories = ['Product', 'Service', 'Discount', 'Tax'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleItemChange = (e) => {
    const { name, value } = e.target;
    setCurrentItem(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const createDocument = async () => {
    setIsSubmitting(true);
    try {
      // Convert empty string dates to null for optional fields
      const processedData = {
        ...formData,
        pricing_date: formData.pricing_date || null,
        service_rendered_date: formData.service_rendered_date || null,
        due_date: formData.due_date || null
      };
      
      const response = await axios.post(`${API}/billing-documents`, processedData);
      setDocumentId(response.data.id);
      alert('Document created successfully!');
    } catch (error) {
      console.error('Error creating document:', error);
      alert('Error creating document. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addItem = async () => {
    if (!documentId) {
      alert('Please create the document first.');
      return;
    }

    if (!currentItem.item_name || currentItem.unit_price <= 0) {
      alert('Please fill in item name and unit price.');
      return;
    }

    try {
      const response = await axios.post(
        `${API}/billing-documents/${documentId}/items`,
        currentItem
      );
      
      setItems(response.data.items);
      setCurrentItem({
        item_name: '',
        description: '',
        category: 'Product',
        quantity: 1,
        unit_price: 0,
        tax_rate: 0
      });
      alert('Item added successfully!');
    } catch (error) {
      console.error('Error adding item:', error);
      alert('Error adding item. Please try again.');
    }
  };

  const removeItem = async (itemId) => {
    if (!documentId) return;

    try {
      const response = await axios.delete(
        `${API}/billing-documents/${documentId}/items/${itemId}`
      );
      setItems(response.data.items);
      alert('Item removed successfully!');
    } catch (error) {
      console.error('Error removing item:', error);
      alert('Error removing item. Please try again.');
    }
  };

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.total_price, 0);
    const totalTax = items.reduce((sum, item) => sum + item.tax_amount, 0);
    const totalAmount = subtotal + totalTax;
    return { subtotal, totalTax, totalAmount };
  };

  const totals = calculateTotals();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Create Billing Document</h1>
            <Link to="/" className="text-blue-600 hover:text-blue-800">
              ← Back to Dashboard
            </Link>
          </div>

          {/* Document Information */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Document Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Billing Type
                </label>
                <select
                  name="billing_type"
                  value={formData.billing_type}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {billingTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Billing Date *
                </label>
                <input
                  type="date"
                  name="billing_date"
                  value={formData.billing_date}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pricing Date
                </label>
                <input
                  type="date"
                  name="pricing_date"
                  value={formData.pricing_date}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Rendered Date
                </label>
                <input
                  type="date"
                  name="service_rendered_date"
                  value={formData.service_rendered_date}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date
                </label>
                <input
                  type="date"
                  name="due_date"
                  value={formData.due_date}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Customer Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Name
                </label>
                <input
                  type="text"
                  name="customer_name"
                  value={formData.customer_name}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter customer name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Email
                </label>
                <input
                  type="email"
                  name="customer_email"
                  value={formData.customer_email}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter customer email"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Address
                </label>
                <textarea
                  name="customer_address"
                  value={formData.customer_address}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter customer address"
                />
              </div>
            </div>
          </div>

          {/* Create Document Button */}
          {!documentId && (
            <div className="mb-8">
              <button
                onClick={createDocument}
                disabled={isSubmitting}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Creating...' : 'Create Document'}
              </button>
            </div>
          )}

          {/* Items Section */}
          {documentId && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Add Items</h2>
              
              {/* Add Item Form */}
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Item Name *
                    </label>
                    <input
                      type="text"
                      name="item_name"
                      value={currentItem.item_name}
                      onChange={handleItemChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Item name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      name="category"
                      value={currentItem.category}
                      onChange={handleItemChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {itemCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantity
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      value={currentItem.quantity}
                      onChange={handleItemChange}
                      min="0.01"
                      step="0.01"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Unit Price *
                    </label>
                    <input
                      type="number"
                      name="unit_price"
                      value={currentItem.unit_price}
                      onChange={handleItemChange}
                      min="0"
                      step="0.01"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tax Rate (%)
                    </label>
                    <input
                      type="number"
                      name="tax_rate"
                      value={currentItem.tax_rate}
                      onChange={handleItemChange}
                      min="0"
                      step="0.01"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="flex items-end">
                    <button
                      onClick={addItem}
                      className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                    >
                      Add Item
                    </button>
                  </div>
                </div>
                
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    name="description"
                    value={currentItem.description}
                    onChange={handleItemChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Item description (optional)"
                  />
                </div>
              </div>

              {/* Items List */}
              {items.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 p-2 text-left">Item</th>
                        <th className="border border-gray-300 p-2 text-left">Category</th>
                        <th className="border border-gray-300 p-2 text-right">Qty</th>
                        <th className="border border-gray-300 p-2 text-right">Unit Price</th>
                        <th className="border border-gray-300 p-2 text-right">Total</th>
                        <th className="border border-gray-300 p-2 text-right">Tax Rate</th>
                        <th className="border border-gray-300 p-2 text-right">Tax Amount</th>
                        <th className="border border-gray-300 p-2 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, index) => (
                        <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="border border-gray-300 p-2">
                            <div>
                              <div className="font-medium">{item.item_name}</div>
                              {item.description && (
                                <div className="text-sm text-gray-600">{item.description}</div>
                              )}
                            </div>
                          </td>
                          <td className="border border-gray-300 p-2">{item.category}</td>
                          <td className="border border-gray-300 p-2 text-right">{item.quantity}</td>
                          <td className="border border-gray-300 p-2 text-right">{formatCurrency(item.unit_price)}</td>
                          <td className="border border-gray-300 p-2 text-right">{formatCurrency(item.total_price)}</td>
                          <td className="border border-gray-300 p-2 text-right">{item.tax_rate}%</td>
                          <td className="border border-gray-300 p-2 text-right">{formatCurrency(item.tax_amount)}</td>
                          <td className="border border-gray-300 p-2 text-center">
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Totals */}
              {items.length > 0 && (
                <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-end">
                    <div className="w-64">
                      <div className="flex justify-between py-1">
                        <span>Subtotal:</span>
                        <span>{formatCurrency(totals.subtotal)}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span>Total Tax:</span>
                        <span>{formatCurrency(totals.totalTax)}</span>
                      </div>
                      <div className="flex justify-between py-2 border-t border-gray-300 font-bold">
                        <span>Total Amount:</span>
                        <span>{formatCurrency(totals.totalAmount)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Notes */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows="3"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Add any additional notes..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};


// Component to display the list of documents

  const DocumentList = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
 
  useEffect(() => {
    fetchDocuments();
  }, []);
 
  const fetchDocuments = async () => {
    try {
      const response = await axios.get(`${API}/billing-documents`);
      setDocuments(response.data);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };
 
  const filteredDocuments = documents.filter(doc =>
    doc.customer_name?.toLowerCase().includes(filter.toLowerCase()) ||
    doc.document_number?.toLowerCase().includes(filter.toLowerCase()) ||
    doc.billing_type?.toLowerCase().includes(filter.toLowerCase())
  );
 
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading documents...</p>
        </div>
      </div>
    );
  }
 
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Billing Documents</h1>
            <Link
              to="/create"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Create New Document
            </Link>
          </div>
 
          {/* Search Filter */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search by customer name, document number, or billing type..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
 
          {/* Documents Table */}
          {filteredDocuments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No documents found. Create your first billing document!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-3 text-left">Document #</th>
                    <th className="border border-gray-300 p-3 text-left">Type</th>
                    <th className="border border-gray-300 p-3 text-left">Customer</th>
                    <th className="border border-gray-300 p-3 text-left">Date</th>
                    <th className="border border-gray-300 p-3 text-right">Total Amount</th>
                    <th className="border border-gray-300 p-3 text-center">Status</th>
                    <th className="border border-gray-300 p-3 text-center">Items</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocuments.map((doc, index) => (
                    <tr key={doc.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="border border-gray-300 p-3 font-mono text-sm">
                        {doc.document_number}
                      </td>
                      <td className="border border-gray-300 p-3">
                        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          {doc.billing_type}
                        </span>
                      </td>
                      <td className="border border-gray-300 p-3">
                        <div>
                          <div className="font-medium">{doc.customer_name || 'N/A'}</div>
                          {doc.customer_email && (
                            <div className="text-sm text-gray-600">{doc.customer_email}</div>
                          )}
                        </div>
                      </td>
                      <td className="border border-gray-300 p-3">{formatDate(doc.billing_date)}</td>
                      <td className="border border-gray-300 p-3 text-right font-medium">
                        {formatCurrency(doc.total_amount)}
                      </td>
                      <td className="border border-gray-300 p-3 text-center">
                        <span className={`inline-block px-2 py-1 rounded text-xs ${
                          doc.status === 'Draft' ? 'bg-yellow-100 text-yellow-800' :
                          doc.status === 'Pending' ? 'bg-orange-100 text-orange-800' :
                          doc.status === 'Processed' ? 'bg-blue-100 text-blue-800' :
                          doc.status === 'Completed' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {doc.status}
                        </span>
                      </td>
                      <td className="border border-gray-300 p-3 text-center">
                        <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                          {doc.items.length} items
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
 

// Main Billing Page
function BillingPage() {
  const [documents, setDocuments] = useState([]);

  const handleCreate = (newDoc) => {
    setDocuments([...documents, newDoc]);
  };

  const handleDelete = (id) => {
    setDocuments(documents.filter((doc) => doc.id !== id));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Billing Dashboard</h1>
      <CreateDocument onCreate={handleCreate} />
      <DocumentList documents={documents} onDelete={handleDelete} />
    </div>
  );
}

<nav style={{ padding: "10px", background: "#f0f0f0" }}>
          <ul style={{ display: "flex", gap: "15px", listStyle: "none" }}>
            <li><Link to="/">Dashboard</Link></li>
            <li><Link to="/documents">Documents</Link></li>
            <li><Link to="/create">Create Document</Link></li>
            <li><Link to="/invoice">Invoice</Link></li>
          </ul>
        </nav>


export default BillingPage;
