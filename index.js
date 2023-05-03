const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();

// Middleware to parse request body
app.use(bodyParser.json());

// Endpoint to fetch data with pagination and sorting
app.get('/data', (req, res) => {
  // Read parent.json file
  const parentData = JSON.parse(fs.readFileSync('Parent.json', 'utf8'));
  console.log('parentData :', parentData);
  const childData = JSON.parse(fs.readFileSync('Child.json', 'utf8'));
  console.log('childData :', childData);

  // Calculate total paid amount for each parent row
  const data = parentData.data.map(parent => {
    const totalPaidAmount = childData.data
    .filter(child => child.parentId === parent.id)
    .reduce((total, child) => total + child.paidAmount, 0);
    console.log('totalPaidAmount :', totalPaidAmount);
    return { ...parent, totalPaidAmount };
  });

  // Extract pagination and sorting parameters from request query string
  const page = req.query.page || 1;
  const pageSize = req.query.pageSize || 2;
  const sortDirection = req.query.sortDirection || 'asc';
  const sortField = req.query.sortField || 'id';

  // Sort data by the specified field and direction
  const sortedData = data.sort((a, b) => {
    if (sortDirection === 'asc') {
      return a[sortField] - b[sortField];
    } else {
      return b[sortField] - a[sortField];
    }
  });

  // Calculate start and end indices for the requested page
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  // Slice the sorted data to retrieve the requested page
  const pageData = sortedData.slice(startIndex, endIndex);

  // Create the HTML table
  let htmlTable = '<table>';
  htmlTable += '<tr><th>ID</th><th>Sender</th><th>Receiver</th><th>Total Amount</th><th>Total Paid Amount</th></tr>';
  pageData.forEach(row => {
    htmlTable += '<tr>';
    htmlTable += `<td>${row.id}</td>`;
    htmlTable += `<td>${row.sender}</td>`;
    htmlTable += `<td>${row.receiver}</td>`;
    htmlTable += `<td>${row.totalAmount}</td>`;
    htmlTable += `<td><a href="/childData/${row.id}">${row.totalPaidAmount}</a></td>`;
    htmlTable += '</tr>';
  });
  htmlTable += '</table>';

  // Add CSS styling to the table
  let css = '<style>table {border-collapse: collapse; width: 100%;} th, td {padding: 8px; text-align: left; border-bottom: 1px solid #ddd;} th {background-color: palevioletred; color: antiquewhite;}</style>';
  htmlTable = css + htmlTable;
  
  // Return the HTML table as the response
  res.send(htmlTable);
  // Return the page data and pagination metadata in the response



  res.json({
    data: table,
    page,
    pageSize,
    totalPages: Math.ceil(sortedData.length / pageSize),
    totalCount: sortedData.length,
    sortField,
    sortDirection,
  })

});
// Endpoint to fetch child data
app.get('/childData', (req, res) => {
  
    // Read parent.json file
  const parentData = JSON.parse(fs.readFileSync('Parent.json', 'utf8'));
  console.log('parentData :', parentData);

  // Read child.json file
  const childData = JSON.parse(fs.readFileSync('Child.json', 'utf8'));
  console.log('childData :', childData);

  // Join child data with parent data
  const joinedData = childData.data.map(child => {
    const parent = parentData.data.find(parent => parent.id === child.parentId);
    return {
      id: child.id,
      sender: parent.sender,
      receiver: parent.receiver,
      totalAmount: parent.totalAmount,
      paidAmount: child.paidAmount,
    };
  });

  // Sort data by id
  const sortedData = joinedData.sort((a, b) => a.id - b.id);

  // Build HTML table
  const tableRows = sortedData.map(row => {
    return `
      <tr>
        <td>${row.id}</td>
        <td>${row.sender}</td>
        <td>${row.receiver}</td>
        <td>${row.totalAmount}</td>
        <td>${row.paidAmount}</td>
      </tr>
    `;
  });

  const tableHtml = `
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Sender</th>
          <th>Receiver</th>
          <th>Total Amount</th>
          <th>Paid Amount</th>
        </tr>
      </thead>
      <tbody>
        ${tableRows.join('')}
      </tbody>
    </table>
  `;


  // Return the table HTML in the response
  res.send(tableHtml);
});

// Endpoint to fetch child data
app.get('/childData/:parentId', (req, res) => {
    const parentId = parseInt(req.params.parentId);
  
    // Read parent.json file
    const parentData = JSON.parse(fs.readFileSync('Parent.json', 'utf8'));
  
    // Read child.json file
    const childData = JSON.parse(fs.readFileSync('Child.json', 'utf8'));
  
    // Filter child data by parentId
    const filteredChildData = childData.data.filter(child => child.parentId === parentId);
  
    // Join child data with parent data
    const joinedData = filteredChildData.map(child => {
      const parent = parentData.data.find(parent => parent.id === child.parentId);
      return {
        id: child.id,
        sender: parent.sender,
        receiver: parent.receiver,
        totalAmount: parent.totalAmount,
        paidAmount: child.paidAmount,
      };
    });
  
    // Sort data by id
    const sortedData = joinedData.sort((a, b) => a.id - b.id);
  
    // Build HTML table
    const tableRows = sortedData.map(row => {
      return `
        <tr>
          <td>${row.id}</td>
          <td>${row.sender}</td>
          <td>${row.receiver}</td>
          <td>${row.totalAmount}</td>
          <td>${row.paidAmount}</td>
        </tr>
      `;
    });
  
    const tableHtml = `
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Sender</th>
            <th>Receiver</th>
            <th>Total Amount</th>
            <th>Paid Amount</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows.join('')}
        </tbody>
      </table>
    `;
  
    // Return the table HTML in the response
    res.send(tableHtml);
  });
  
// Start the server
app.listen(3000, (req,res) => {
  console.log('Server started on port 3000');    
});
