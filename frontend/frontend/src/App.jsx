import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "https://cloudvandana-salesforce-crud-6uw8.onrender.com";

const objects = [
  "Account",
  "Lead",
  "Contact",
  "Opportunity",
  "Case",
];

function App() {
  const [selectedObject, setSelectedObject] = useState("Account");

  const [records, setRecords] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [message, setMessage] = useState("");

  // Add form
  const [showAddForm, setShowAddForm] = useState(false);

  // Edit form
  const [showEditForm, setShowEditForm] = useState(false);

  // View
  const [showView, setShowView] = useState(false);

  const [selectedRecord, setSelectedRecord] = useState(null);

  // Form data
  const [formData, setFormData] = useState({
    Name: "",
    FirstName: "",
    LastName: "",
    Email: "",
    Phone: "",
    Industry: "",
  });


  // =====================================================
  // LOAD RECORDS
  // =====================================================

  const loadRecords = async () => {
    try {
      setLoading(true);
      setError("");
      setMessage("");

      const response = await fetch(
        `${API_URL}/api/objects/${selectedObject}?limit=20&offset=0`
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.detail ||
          result.error ||
          "Failed to load records"
        );
      }

      setRecords(result.data?.records || []);

    } catch (err) {
      setError(err.message);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };


  // =====================================================
  // LOAD WHEN OBJECT CHANGES
  // =====================================================

  useEffect(() => {
    loadRecords();
  }, [selectedObject]);


  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  // =====================================================
  // RESET FORM
  // =====================================================

  const resetForm = () => {
    setFormData({
      Name: "",
      FirstName: "",
      LastName: "",
      Email: "",
      Phone: "",
      Industry: "",
    });
  };


  // =====================================================
  // OPEN ADD FORM
  // =====================================================

  const handleAdd = () => {
    resetForm();

    setShowAddForm(true);
    setShowEditForm(false);
    setShowView(false);

    setError("");
    setMessage("");
  };


  // =====================================================
  // CREATE RECORD
  // =====================================================

  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setMessage("");

      const response = await fetch(
        `${API_URL}/api/objects/${selectedObject}`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            data: formData,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.detail ||
          result.error ||
          "Failed to create record"
        );
      }

      setMessage("Record added successfully.");

      setShowAddForm(false);

      resetForm();

      await loadRecords();

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  // =====================================================
  // VIEW RECORD
  // =====================================================

  const handleView = (record) => {
    setSelectedRecord(record);

    setShowView(true);

    setShowEditForm(false);
    setShowAddForm(false);

    setError("");
    setMessage("");
  };


  // =====================================================
  // OPEN EDIT FORM
  // =====================================================

  const handleEdit = (record) => {
    setSelectedRecord(record);

    setFormData({
      Name: record.Name || "",
      FirstName: record.FirstName || "",
      LastName: record.LastName || "",
      Email: record.Email || "",
      Phone: record.Phone || "",
      Industry: record.Industry || "",
    });

    setShowEditForm(true);

    setShowAddForm(false);
    setShowView(false);

    setError("");
    setMessage("");
  };


  // =====================================================
  // UPDATE RECORD
  // =====================================================

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!selectedRecord) {
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      const response = await fetch(
        `${API_URL}/api/objects/${selectedObject}/${selectedRecord.Id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            data: formData,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.detail ||
          result.error ||
          "Failed to update record"
        );
      }

      setMessage("Record updated successfully.");

      setShowEditForm(false);

      setSelectedRecord(null);

      resetForm();

      await loadRecords();

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  // =====================================================
  // DELETE RECORD
  // =====================================================

  const handleDelete = async (record) => {

    const confirmDelete = window.confirm(
      `Are you sure you want to delete this record?\n\n${
        record.Name || record.Id
      }`
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      const response = await fetch(
        `${API_URL}/api/objects/${selectedObject}/${record.Id}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.detail ||
          result.error ||
          "Failed to delete record"
        );
      }

      setMessage("Record deleted successfully.");

      await loadRecords();

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  // =====================================================
  // CANCEL
  // =====================================================

  const handleCancel = () => {
    setShowAddForm(false);
    setShowEditForm(false);
    setShowView(false);

    setSelectedRecord(null);

    resetForm();

    setError("");
  };


  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="app">

      {/* HEADER */}

      <header className="header">

        <h1>
          CloudVandana Salesforce CRUD
        </h1>

        <p>
          Salesforce Object Management Dashboard
        </p>

      </header>


      <main className="container">


        {/* TOOLBAR */}

        <div className="toolbar">

          <label>
            Select Object:
          </label>


          <select
            value={selectedObject}
            onChange={(e) => {
              setSelectedObject(e.target.value);

              setShowAddForm(false);
              setShowEditForm(false);
              setShowView(false);
            }}
          >

            {objects.map((object) => (

              <option
                key={object}
                value={object}
              >
                {object}
              </option>

            ))}

          </select>


          <button onClick={loadRecords}>
            Refresh
          </button>


          <button
            className="add-button"
            onClick={handleAdd}
          >
            + Add Record
          </button>

        </div>


        {/* SUCCESS MESSAGE */}

        {message && (
          <div className="success">
            {message}
          </div>
        )}


        {/* ERROR */}

        {error && (
          <div className="error">
            {error}
          </div>
        )}


        {/* =================================================
            ADD FORM
        ================================================= */}

        {showAddForm && (

          <div className="form-container">

            <h2>
              Add {selectedObject}
            </h2>


            <form onSubmit={handleCreate}>


              {/* NAME */}

              <div className="form-group">

                <label>
                  Name
                </label>

                <input
                  type="text"
                  name="Name"
                  value={formData.Name}
                  onChange={handleChange}
                  placeholder="Enter name"
                />

              </div>


              {/* FIRST NAME */}

              <div className="form-group">

                <label>
                  First Name
                </label>

                <input
                  type="text"
                  name="FirstName"
                  value={formData.FirstName}
                  onChange={handleChange}
                  placeholder="Enter first name"
                />

              </div>


              {/* LAST NAME */}

              <div className="form-group">

                <label>
                  Last Name
                </label>

                <input
                  type="text"
                  name="LastName"
                  value={formData.LastName}
                  onChange={handleChange}
                  placeholder="Enter last name"
                />

              </div>


              {/* EMAIL */}

              <div className="form-group">

                <label>
                  Email
                </label>

                <input
                  type="email"
                  name="Email"
                  value={formData.Email}
                  onChange={handleChange}
                  placeholder="Enter email"
                />

              </div>


              {/* PHONE */}

              <div className="form-group">

                <label>
                  Phone
                </label>

                <input
                  type="text"
                  name="Phone"
                  value={formData.Phone}
                  onChange={handleChange}
                  placeholder="Enter phone"
                />

              </div>


              {/* INDUSTRY */}

              <div className="form-group">

                <label>
                  Industry
                </label>

                <input
                  type="text"
                  name="Industry"
                  value={formData.Industry}
                  onChange={handleChange}
                  placeholder="Enter industry"
                />

              </div>


              {/* BUTTONS */}

              <div className="form-actions">

                <button
                  type="submit"
                  className="save-button"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Record"}
                </button>


                <button
                  type="button"
                  className="cancel-button"
                  onClick={handleCancel}
                >
                  Cancel
                </button>

              </div>

            </form>

          </div>

        )}


        {/* =================================================
            EDIT FORM
        ================================================= */}

        {showEditForm && selectedRecord && (

          <div className="edit-form">

            <h2>
              Edit {selectedObject}
            </h2>


            <form onSubmit={handleUpdate}>


              <div className="form-group">

                <label>
                  Name
                </label>

                <input
                  type="text"
                  name="Name"
                  value={formData.Name}
                  onChange={handleChange}
                />

              </div>


              <div className="form-group">

                <label>
                  First Name
                </label>

                <input
                  type="text"
                  name="FirstName"
                  value={formData.FirstName}
                  onChange={handleChange}
                />

              </div>


              <div className="form-group">

                <label>
                  Last Name
                </label>

                <input
                  type="text"
                  name="LastName"
                  value={formData.LastName}
                  onChange={handleChange}
                />

              </div>


              <div className="form-group">

                <label>
                  Email
                </label>

                <input
                  type="email"
                  name="Email"
                  value={formData.Email}
                  onChange={handleChange}
                />

              </div>


              <div className="form-group">

                <label>
                  Phone
                </label>

                <input
                  type="text"
                  name="Phone"
                  value={formData.Phone}
                  onChange={handleChange}
                />

              </div>


              <div className="form-group">

                <label>
                  Industry
                </label>

                <input
                  type="text"
                  name="Industry"
                  value={formData.Industry}
                  onChange={handleChange}
                />

              </div>


              <div className="form-actions">

                <button
                  type="submit"
                  className="save-button"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update Record"}
                </button>


                <button
                  type="button"
                  className="cancel-button"
                  onClick={handleCancel}
                >
                  Cancel
                </button>

              </div>

            </form>

          </div>

        )}


        {/* =================================================
            VIEW RECORD
        ================================================= */}

        {showView && selectedRecord && (

          <div className="view-card">

            <h2>
              {selectedObject} Details
            </h2>


            <div className="view-row">

              <div className="view-label">
                ID
              </div>

              <div className="view-value">
                {selectedRecord.Id || "-"}
              </div>

            </div>


            <div className="view-row">

              <div className="view-label">
                Name
              </div>

              <div className="view-value">
                {selectedRecord.Name || "-"}
              </div>

            </div>


            <div className="view-row">

              <div className="view-label">
                First Name
              </div>

              <div className="view-value">
                {selectedRecord.FirstName || "-"}
              </div>

            </div>


            <div className="view-row">

              <div className="view-label">
                Last Name
              </div>

              <div className="view-value">
                {selectedRecord.LastName || "-"}
              </div>

            </div>


            <div className="view-row">

              <div className="view-label">
                Email
              </div>

              <div className="view-value">
                {selectedRecord.Email || "-"}
              </div>

            </div>


            <div className="view-row">

              <div className="view-label">
                Phone
              </div>

              <div className="view-value">
                {selectedRecord.Phone || "-"}
              </div>

            </div>


            <div className="view-row">

              <div className="view-label">
                Industry
              </div>

              <div className="view-value">
                {selectedRecord.Industry || "-"}
              </div>

            </div>


            <div className="form-actions">

              <button
                className="cancel-button"
                onClick={handleCancel}
              >
                Close
              </button>

            </div>

          </div>

        )}


        {/* =================================================
            LOADING
        ================================================= */}

        {loading && !showAddForm && !showEditForm && (

          <div className="loading">
            Loading {selectedObject} records...
          </div>

        )}


        {/* =================================================
            TABLE
        ================================================= */}

        {!loading && !showAddForm && !showEditForm && (

          <div className="table-container">

            <table>

              <thead>

                <tr>

                  <th>
                    ID
                  </th>

                  <th>
                    Name
                  </th>

                  <th>
                    Email
                  </th>

                  <th>
                    Phone
                  </th>

                  <th>
                    Industry
                  </th>

                  <th>
                    Actions
                  </th>

                </tr>

              </thead>


              <tbody>

                {records.map((record) => (

                  <tr key={record.Id}>

                    <td>
                      {record.Id}
                    </td>


                    <td>

                      {record.Name ||
                        `${record.FirstName || ""} ${
                          record.LastName || ""
                        }`}

                    </td>


                    <td>
                      {record.Email || "-"}
                    </td>


                    <td>
                      {record.Phone || "-"}
                    </td>


                    <td>
                      {record.Industry || "-"}
                    </td>


                    <td>

                      <button
                        className="view"
                        onClick={() =>
                          handleView(record)
                        }
                      >
                        View
                      </button>


                      <button
                        className="edit"
                        onClick={() =>
                          handleEdit(record)
                        }
                      >
                        Edit
                      </button>


                      <button
                        className="delete"
                        onClick={() =>
                          handleDelete(record)
                        }
                      >
                        Delete
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>


            {/* NO RECORDS */}

            {records.length === 0 && (

              <div className="message">
                No records found.
              </div>

            )}

          </div>

        )}

      </main>

    </div>
  );
}

export default App;