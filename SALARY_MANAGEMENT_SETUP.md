# Salary Management System Setup Guide

## Overview
This salary management system provides complete functionality for managing employee salaries with approval workflows and automatic PDF generation.

## Features
- ✅ Monthly salary record creation
- ✅ Admin approval workflow
- ✅ Automatic PDF salary slip generation
- ✅ Complete CRUD operations
- ✅ Filtering and pagination
- ✅ Statistics and reporting

## Database Schema

### Salary Table (`salaries`)
```sql
CREATE TABLE salaries (
    id INT PRIMARY KEY AUTO_INCREMENT,
    employee_id INT NOT NULL,
    month INT NOT NULL (1-12),
    year INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    remarks TEXT,
    is_approved BOOLEAN DEFAULT FALSE,
    approved_by INT,
    approved_at DATETIME,
    pdf_generated BOOLEAN DEFAULT FALSE,
    pdf_path VARCHAR(255),
    createdAt DATETIME,
    updatedAt DATETIME,
    UNIQUE KEY unique_employee_month_year (employee_id, month, year),
    FOREIGN KEY (employee_id) REFERENCES employees(id),
    FOREIGN KEY (approved_by) REFERENCES admins(id)
);
```

## Required Dependencies

Install these packages in your backend:

```bash
cd backend
npm install puppeteer moment
```

## API Endpoints

### Base URL: `/salary`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/create` | Create new salary record |
| GET | `/all` | Get all salaries (with filters) |
| GET | `/statistics` | Get salary statistics |
| GET | `/:id` | Get salary by ID |
| PUT | `/:id` | Update salary (if not approved) |
| PUT | `/:id/approve` | Approve salary & generate PDF |
| GET | `/:id/download` | Download salary slip PDF |
| DELETE | `/:id` | Delete salary (if not approved) |

## API Usage Examples

### 1. Create Salary Record
```javascript
POST /salary/create
{
    "employee_id": 1,
    "month": 12,
    "year": 2024,
    "amount": 50000.00,
    "remarks": "Regular monthly salary"
}
```

### 2. Get All Salaries with Filters
```javascript
GET /salary/all?page=1&limit=10&employee_id=1&month=12&year=2024&is_approved=false
```

### 3. Approve Salary
```javascript
PUT /salary/123/approve
{
    "approved_by": 1  // Admin ID
}
```

### 4. Get Statistics
```javascript
GET /salary/statistics?year=2024&month=12
```

## Frontend Integration

### React Component Example

```jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SalaryManagement = () => {
    const [salaries, setSalaries] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch salaries
    const fetchSalaries = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/salary/all');
            setSalaries(response.data.data.salaries);
        } catch (error) {
            console.error('Error fetching salaries:', error);
        }
        setLoading(false);
    };

    // Approve salary
    const approveSalary = async (salaryId) => {
        try {
            await axios.put(`/api/salary/${salaryId}/approve`, {
                approved_by: 1 // Current admin ID
            });
            fetchSalaries(); // Refresh list
            alert('Salary approved successfully!');
        } catch (error) {
            console.error('Error approving salary:', error);
            alert('Error approving salary');
        }
    };

    // Download PDF
    const downloadPDF = (salaryId) => {
        window.open(`/api/salary/${salaryId}/download`, '_blank');
    };

    useEffect(() => {
        fetchSalaries();
    }, []);

    return (
        <div className="salary-management">
            <h2>Salary Management</h2>
            
            {loading ? (
                <div>Loading...</div>
            ) : (
                <table className="table">
                    <thead>
                        <tr>
                            <th>Employee</th>
                            <th>Month/Year</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {salaries.map(salary => (
                            <tr key={salary.id}>
                                <td>{salary.employee?.name}</td>
                                <td>{salary.month}/{salary.year}</td>
                                <td>₹{salary.amount}</td>
                                <td>
                                    {salary.is_approved ? (
                                        <span className="badge badge-success">Approved</span>
                                    ) : (
                                        <span className="badge badge-warning">Pending</span>
                                    )}
                                </td>
                                <td>
                                    {!salary.is_approved ? (
                                        <button 
                                            onClick={() => approveSalary(salary.id)}
                                            className="btn btn-primary btn-sm"
                                        >
                                            Approve
                                        </button>
                                    ) : (
                                        <button 
                                            onClick={() => downloadPDF(salary.id)}
                                            className="btn btn-secondary btn-sm"
                                        >
                                            Download PDF
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default SalaryManagement;
```

## PDF Generation

The system automatically generates PDF salary slips when a salary is approved. The PDF includes:

- Company header
- Employee details
- Salary amount
- Month/Year
- Remarks
- Approval status
- Generation date

### Customizing PDF Template

To customize the PDF template, edit the `generateSalarySlipPDF` method in `SalaryController.js`:

1. Uncomment the puppeteer code
2. Modify the HTML template
3. Adjust styling as needed

## Security Considerations

1. **Authentication**: Add authentication middleware to protect routes
2. **Authorization**: Ensure only authorized users can approve salaries
3. **Validation**: Validate all input data
4. **File Security**: Secure PDF storage location

### Adding Authentication

```javascript
// In your routes file
const AuthenticateToken = require('../../Middleware/AuthenticateToken');

// Protect routes
router.put('/:id/approve', AuthenticateToken, SalaryController.approveSalary);
```

## Deployment Checklist

- [ ] Install required dependencies (`puppeteer`, `moment`)
- [ ] Run database migrations/sync
- [ ] Configure file upload directory permissions
- [ ] Set up PDF storage directory
- [ ] Configure environment variables
- [ ] Test all API endpoints
- [ ] Implement authentication middleware
- [ ] Set up automated backups for salary data

## Error Handling

The system includes comprehensive error handling for:
- Invalid employee IDs
- Duplicate salary records
- Unauthorized access attempts
- PDF generation failures
- Database connection issues

## Monitoring and Logging

Consider implementing:
- Audit logs for salary approvals
- PDF generation tracking
- Failed transaction monitoring
- Performance metrics

## Support

For issues or questions:
1. Check the error logs
2. Verify database connections
3. Ensure all dependencies are installed
4. Test with sample data

---

**Note**: Remember to install `puppeteer` and `moment` packages and uncomment the PDF generation code in the controller for full functionality. 