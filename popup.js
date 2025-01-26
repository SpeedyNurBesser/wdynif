function downloadCSV() {
    browser.storage.local.get('data').then(result => {
        const data = result.data || [];

        const csvRows = [];
        const headers = ['Timestamp', 'URL', 'Reason', 'Time Estimate', 'Tab']; 
        csvRows.push(headers.join(','));

        for (const row of data) {
            const values = [
                row.timestamp,
                row.url,
                sanitizeCSVValue(row.reason),
                row.duration,
                row.tab
            ];
            csvRows.push(values.join(','));
        }

        const csvFile = new Blob([csvRows.join('\n')], { type: 'text/csv' });

        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(csvFile);
        downloadLink.download = 'wdynif-data.csv';
        downloadLink.click();
    });
}


document.getElementById('downloadButton').addEventListener('click', downloadCSV);

function sanitizeCSVValue(value) {
    if (typeof value === 'string') {
        let escapedValue = value.replace(/"/g, '""');

        if (escapedValue.includes(',') || escapedValue.includes('\n') || escapedValue.startsWith('"') || escapedValue.endsWith('"')) {
            escapedValue = `"${escapedValue}"`;
        }

        return escapedValue;
    }

    // Wenn der Wert kein String ist, gebe ihn unverändert zurück
    return value;
}