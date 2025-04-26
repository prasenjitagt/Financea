async function handleExport() {
    // const workbook = new ExcelJS.Workbook();
    // const worksheet = workbook.addWorksheet("Clients");

    // console.log(rowSelection);

    // worksheet.columns = [
    //   { header: "Client Name", key: "clientName" },
    //   { header: "Status", key: "status" },
    //   { header: "Mobile", key: "mobile" },
    //   { header: "Email", key: "email" },
    //   { header: "Website", key: "website" },
    //   { header: "Country", key: "country" },
    //   { header: "Service Charge", key: "serviceCharge" },
    //   { header: "Currency", key: "currency" },
    //   { header: "Created At", key: "createdAt" },
    // ];

    // const filteredClients = selectedClientIds.length > 0
    //   ? clients.filter(client => selectedClientIds.includes(client._id))
    //   : clients;

    // filteredClients.forEach(client => {
    //   const currency = client.country === "India" ? "INR" : "USD"; // Check country and set currency

    //   worksheet.addRow({
    //     clientName: client.clientName,
    //     status: client.isClientActive ? "Active" : "Inactive",
    //     mobile: client.mobile,
    //     email: client.email,
    //     website: client.website,
    //     country: client.country,
    //     serviceCharge: client.serviceCharge,
    //     currency: currency, // Use the determined currency
    //     createdAt: new Date(client.createdAt).toLocaleDateString(),
    //   });
    // });

    // const buffer = await workbook.xlsx.writeBuffer();
    // const blob = new Blob([buffer], { type: "application/octet-stream" });
    // saveAs(blob, "clients.xlsx");




}