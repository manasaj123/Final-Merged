import React, { useState } from "react";

const MaterialMaster = () => {
  const [form, setForm] = useState({
    // --- Basic Data ---
    companyCode: "",
    code: "",
    description: "",
    baseUOM: "",
    materialGroup: "",
    industry: "",
    type: "",
    division: "",
    validFrom: "",
    ean: "",
    grossWeight: "",
    netWeight: "",
    unitWeight: "",

    // --- Warehouse & Inventory ---
    issueUnit: "",
    shelfLife: "",
    minShelfLife: "",
    storageBin: "",
    pickingArea: "",
    maxBinQty: "",
    minBinQty: "",
    replacementQty: "",

    // --- Batch Management ---
    batch: false,
    batchNumber: "",
    batchStrategy: "",

    // --- Quality Management ---
    qmAuthorization: "",
    qmProcurement: "",
    qmControlKey: "",
    certificateType: "",
    qmSystem: "",

    // --- Procurement & MRP ---
    mrpType: "",
    mrpController: "",
    reorderPoint: "",
    lotSize: "",
    procurementType: "",
    grTime: "",
    schedMarginKey: "",
    consumptionMode: "",
    availabilityCheck: "",
    sloc: "",
    mrpIndicator: "",
    prodSchedProfile: "",
    setupTime: "",
    processingTime: "",
    tempCondition: "",
    containerReq: "",

    // --- Pricing ---
    movingAvgPrice: "",
    standardPrice: "",
  });

  const [materials, setMaterials] = useState([]);
  const [activeTab, setActiveTab] = useState("basic");

  const handleSubmit = (e) => {
    e.preventDefault();
    setMaterials([...materials, form]);
    setForm({
      companyCode: "",
      code: "",
      description: "",
      baseUOM: "",
      materialGroup: "",
      industry: "",
      type: "",
      division: "",
      validFrom: "",
      ean: "",
      grossWeight: "",
      netWeight: "",
      unitWeight: "",
      issueUnit: "",
      shelfLife: "",
      minShelfLife: "",
      storageBin: "",
      pickingArea: "",
      maxBinQty: "",
      minBinQty: "",
      replacementQty: "",
      batch: false,
      batchNumber: "",
      batchStrategy: "",
      qmAuthorization: "",
      qmProcurement: "",
      qmControlKey: "",
      certificateType: "",
      qmSystem: "",
      mrpType: "",
      mrpController: "",
      reorderPoint: "",
      lotSize: "",
      procurementType: "",
      grTime: "",
      schedMarginKey: "",
      consumptionMode: "",
      availabilityCheck: "",
      sloc: "",
      mrpIndicator: "",
      prodSchedProfile: "",
      setupTime: "",
      processingTime: "",
      tempCondition: "",
      containerReq: "",
      movingAvgPrice: "",
      standardPrice: "",
    });
  };

  // Helper to render input
  const Input = ({ label, type = "text", name }) => (
    <div>
      <label className="block text-sm font-medium">{label}</label>
      <input
        type={type}
        value={form[name]}
        onChange={(e) => setForm({ ...form, [name]: e.target.value })}
        className="border p-2 w-full rounded"
      />
    </div>
  );

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Material Master</h2>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {["basic", "warehouse", "batch", "qm", "mrp", "pricing"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded ${
              activeTab === tab ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mb-6">
        {activeTab === "basic" && (
          <>
            <Input label="Company Code" name="companyCode" />
            <Input label="Material Code" name="code" />
            <Input label="Description" name="description" />
            <Input label="Base UOM" name="baseUOM" />
            <Input label="Material Group" name="materialGroup" />
            <Input label="Industry Sector" name="industry" />
            <Input label="Material Type" name="type" />
            <Input label="Division" name="division" />
            <Input label="Valid From" type="date" name="validFrom" />
            <Input label="EAN" name="ean" />
            <Input label="Gross Weight" name="grossWeight" />
            <Input label="Net Weight" name="netWeight" />
            <Input label="Unit Weight" name="unitWeight" />
          </>
        )}

        {activeTab === "warehouse" && (
          <>
            <Input label="Unit of Issue" name="issueUnit" />
            <Input label="Max Shelf Life" name="shelfLife" />
            <Input label="Min Shelf Life" name="minShelfLife" />
            <Input label="Storage Bin" name="storageBin" />
            <Input label="Picking Area" name="pickingArea" />
            <Input label="Max Bin Quantity" name="maxBinQty" />
            <Input label="Min Bin Quantity" name="minBinQty" />
            <Input label="Replacement Quantity" name="replacementQty" />
          </>
        )}

        {activeTab === "batch" && (
          <>
            <label className="col-span-2 flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.batch}
                onChange={(e) => setForm({ ...form, batch: e.target.checked })}
              />
              Batch Management
            </label>
            <Input label="Batch Number" name="batchNumber" />
            <Input label="Batch Strategy" name="batchStrategy" />
          </>
        )}

        {activeTab === "qm" && (
          <>
            <Input label="QM Authorization" name="qmAuthorization" />
            <Input label="QM Procurement" name="qmProcurement" />
            <Input label="QM Control Key" name="qmControlKey" />
            <Input label="Certificate Type" name="certificateType" />
            <Input label="QM System" name="qmSystem" />
          </>
        )}

        {activeTab === "mrp" && (
          <>
            <Input label="MRP Type" name="mrpType" />
            <Input label="MRP Controller" name="mrpController" />
            <Input label="Reorder Point" name="reorderPoint" />
            <Input label="Lot Size" name="lotSize" />
            <Input label="Procurement Type" name="procurementType" />
            <Input label="GR Processing Time" name="grTime" />
            <Input label="Scheduling Margin Key" name="schedMarginKey" />
            <Input label="Consumption Mode" name="consumptionMode" />
            <Input label="Availability Check" name="availabilityCheck" />
            <Input label="Storage Location" name="sloc" />
            <Input label="MRP Indicator" name="mrpIndicator" />
            <Input label="Prod. Scheduling Profile" name="prodSchedProfile" />
            <Input label="Setup Time" name="setupTime" />
            <Input label="Processing Time" name="processingTime" />
            <Input label="Temperature Condition" name="tempCondition" />
            <Input label="Container Requirement" name="containerReq" />
          </>
        )}

        {activeTab === "pricing" && (
          <>
            <Input label="Moving Average Price" name="movingAvgPrice" />
            <Input label="Standard Price" name="standardPrice" />
          </>
        )}

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded col-span-2"
        >
          Save Material
        </button>
      </form>

      {/* Material List */}
      <h3 className="font-bold mb-2">Materials List</h3>
      <ul>
        {materials.map((m, i) => (
          <li key={i} className="border p-2 mb-2">
            <strong>{m.code}</strong> - {m.description} | Price: {m.standardPrice || m.movingAvgPrice}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MaterialMaster;
