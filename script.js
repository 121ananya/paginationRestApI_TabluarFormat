// import { get } from 'axios';

// window.onload = () => {
//     get('/parent')
//   .then(response => response.data)
//   .then(data => {
//     const tableData = document.getElementById('table-data');
//     console.log('tableData from script :', tableData);
//     console.log(' :', );
//     data.data.forEach(parent => {
//       const row = document.createElement('tr');
//       row.innerHTML = `
//         <td>${parent.id}</td>
//         <td>${parent.sender}</td>
//         <td>${parent.receiver}</td>
//         <td>${parent.totalAmount}</td>
//         <td>${parent.totalPaidAmount}</td>
//       `;
//       tableData.appendChild(row);
//     });
//   })
//   .catch(error => {
//     console.error(error);
//   })};

  
    //fetching on html
fetch("http://localhost:3000/data")
.then((objectData)=>{
      console.log('objectData :', objectData);
      let tableData = ""
      objectData.map((values)=>{
          tableData=`<h1>${values.id}</h1>`;
      });
      document.getElementById("table-data")= tableData;
})
.catch((error) => {
    console.error(error);
});
  