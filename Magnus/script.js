// Handle sidebar submenu toggle
document.addEventListener("DOMContentLoaded", function () {
  const employeeMenu = document.getElementById("employee-menu");
  if (employeeMenu) {
    employeeMenu.addEventListener("click", function () {
      const submenu = this.querySelector(".submenu");
      submenu.classList.toggle("show");
    });
  }

  // Handle form submission for Create Employee
  const employeeForm = document.getElementById("employeeForm");
  if (employeeForm) {
    employeeForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const formData = new FormData(employeeForm);
      const data = {};
      formData.forEach((value, key) => {
        if (key === "skills") {
          if (!data.skills) data.skills = [];
          data.skills.push(value);
        } else {
          data[key] = value;
        }
      });

      const response = await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      if (result.success) {
        alert('Employee saved successfully');
        employeeForm.reset();
      } else {
        alert('Failed to save employee');
      }
    });
  }

  // Load employee data in Search page
  const employeeTable = document.getElementById("employeeTableBody");
  if (employeeTable) {
    loadEmployees();

    // Search on button click
    window.searchEmployees = async function () {
      const name = document.getElementById("searchName").value;
      const mobile = document.getElementById("searchMobile").value;
      loadEmployees(name, mobile);
    };

    // Clear search
    window.clearSearch = function () {
      document.getElementById("searchName").value = '';
      document.getElementById("searchMobile").value = '';
      loadEmployees();
    };
  }

  // Load employee list
  async function loadEmployees(name = '', mobile = '') {
    const url = new URL('/api/employees', window.location.origin);
    if (name) url.searchParams.append('name', name);
    if (mobile) url.searchParams.append('mobile', mobile);
    const res = await fetch(url);
    const employees = await res.json();

    const tbody = document.getElementById("employeeTableBody");
    tbody.innerHTML = '';

    employees.forEach(emp => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td><input type="text" value="${emp.firstName}" /></td>
        <td><input type="text" value="${emp.lastName}" /></td>
        <td><input type="text" value="${emp.mobile}" /></td>
        <td><input type="text" value="${emp.email}" /></td>
        <td><input type="text" value="${emp.gender}" /></td>
        <td><input type="text" value="${emp.dob}" /></td>
        <td><input type="text" value="${emp.country}" /></td>
        <td><input type="text" value="${emp.city}" /></td>
        <td>
          <button class="btn btn-success" onclick="updateEmployee('${emp._id}', this)">Edit</button>
          <button class="btn btn-danger" onclick="deleteEmployee('${emp._id}')">Delete</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  // Update employee
  window.updateEmployee = async function (id, btn) {
    const tr = btn.closest("tr");
    const inputs = tr.querySelectorAll("input");

    const updatedData = {
      firstName: inputs[0].value,
      lastName: inputs[1].value,
      mobile: inputs[2].value,
      email: inputs[3].value,
      gender: inputs[4].value,
      dob: inputs[5].value,
      country: inputs[6].value,
      city: inputs[7].value
    };

    const res = await fetch(`/api/employees/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData)
    });

    const result = await res.json();
    if (result.success) {
      alert('Employee updated');
    } else {
      alert('Update failed');
    }
  };

  // Delete employee
  window.deleteEmployee = async function (id) {
    if (!confirm('Are you sure you want to delete this employee?')) return;

    const res = await fetch(`/api/employees/${id}`, {
      method: 'DELETE'
    });

    const result = await res.json();
    if (result.success) {
      alert('Employee deleted');
      loadEmployees();
    } else {
      alert('Delete failed');
    }
  };
});
function toggleSubmenu(id) {
  const submenu = document.getElementById(id);
  if (submenu.style.display === "block") {
    submenu.style.display = "none";
  } else {
    submenu.style.display = "block";
  }
}
function toggleSubmenu(id) {
  const submenu = document.getElementById(id);
  submenu.style.display = submenu.style.display === "block" ? "none" : "block";
}

// Load employees from MongoDB
async function loadEmployees() {
  const res = await fetch('/api/employees');
  const data = await res.json();
  const tbody = document.getElementById('employeeData');
  tbody.innerHTML = '';

  data.forEach(emp => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${emp.firstName}</td>
      <td>${emp.lastName}</td>
      <td>${emp.mobile}</td>
      <td>${emp.email}</td>
      <td>${emp.gender}</td>
      <td>${emp.dob}</td>
      <td>${emp.country}</td>
      <td>${emp.city}</td>
      <td>
        <button class="btn green" onclick="editEmployee('${emp._id}')">Edit</button>
        <button class="btn red" onclick="deleteEmployee('${emp._id}')">Delete</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

function clearSearch() {
  document.getElementById("searchName").value = "";
  document.getElementById("searchMobile").value = "";
  loadEmployees();
}

async function deleteEmployee(id) {
  if (confirm("Are you sure you want to delete this employee?")) {
    await fetch(`/api/employees/${id}`, { method: 'DELETE' });
    loadEmployees();
  }
}

window.onload = () => {
  if (document.getElementById('employeeData')) {
    loadEmployees();
  }
};
document.addEventListener('DOMContentLoaded', () => {
  fetchEmployees();

  // Load employees from backend
  function fetchEmployees() {
    fetch('/api/employees')
      .then(res => res.json())
      .then(data => renderTable(data));
  }

  function renderTable(employees) {
    const tableBody = document.getElementById('employeeTableBody');
    tableBody.innerHTML = '';

    employees.forEach(emp => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td><input value="${emp.firstName}" class="edit-input" disabled></td>
        <td><input value="${emp.lastName}" class="edit-input" disabled></td>
        <td><input value="${emp.mobile}" class="edit-input" disabled></td>
        <td><input value="${emp.email}" class="edit-input" disabled></td>
        <td>${emp.gender}</td>
        <td>${emp.dob}</td>
        <td><input value="${emp.country}" class="edit-input" disabled></td>
        <td><input value="${emp.city}" class="edit-input" disabled></td>
        <td>
          <button class="edit-btn btn btn-success">Edit</button>
          <button class="save-btn btn btn-primary" style="display:none;">Save</button>
          <button class="delete-btn btn btn-danger">Delete</button>
        </td>
      `;

      // Edit Handler
      row.querySelector('.edit-btn').addEventListener('click', () => {
        row.querySelectorAll('.edit-input').forEach(input => input.disabled = false);
        row.querySelector('.edit-btn').style.display = 'none';
        row.querySelector('.save-btn').style.display = 'inline-block';
      });

      // Save Handler
      row.querySelector('.save-btn').addEventListener('click', () => {
        const updatedData = {
          firstName: row.children[0].querySelector('input').value,
          lastName: row.children[1].querySelector('input').value,
          mobile: row.children[2].querySelector('input').value,
          email: row.children[3].querySelector('input').value,
          country: row.children[6].querySelector('input').value,
          city: row.children[7].querySelector('input').value,
        };

        fetch(`/api/employees/${emp._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedData)
        })
        .then(res => res.json())
        .then(() => fetchEmployees());
      });

      // Delete Handler
      row.querySelector('.delete-btn').addEventListener('click', () => {
        fetch(`/api/employees/${emp._id}`, {
          method: 'DELETE'
        })
        .then(res => res.json())
        .then(() => fetchEmployees());
      });

      tableBody.appendChild(row);
    });
  }
});

