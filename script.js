async function fetchCSV(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
    }
    const text = await response.text();
    return text.trim().split('\n').map(row => row.split(','));
}

function parseCSVData(csvData) {
    const headers = csvData[0];
    const rows = csvData.slice(1).filter(row => row.length === headers.length).map(row => {
        let obj = {};
        headers.forEach((header, i) => {
            obj[header.trim()] = row[i].trim();
        });
        return obj;
    });
    return rows;
}

async function createChart() {
    try {
        const peacekeeperURL = "https://raw.githubusercontent.com/Active5850/tarkov_event_arms_race/main/peacekeeper_count.csv";
        const praporURL = "https://raw.githubusercontent.com/Active5850/tarkov_event_arms_race/main/prapor_count.csv";

        const peacekeeperCSV = await fetchCSV(peacekeeperURL);
        const praporCSV = await fetchCSV(praporURL);

        const peacekeeperData = parseCSVData(peacekeeperCSV);
        const praporData = parseCSVData(praporCSV);

        const peacekeeperTotal = peacekeeperData[peacekeeperData.length - 1].Count;
        const praporTotal = praporData[praporData.length - 1].Count;

        const ctx = document.getElementById('myChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [
                    {
                        label: `Peacekeeper`,
                        data: peacekeeperData.map(row => ({ x: luxon.DateTime.fromSeconds(parseInt(row["Timestamp"], 10)).toJSDate(), y: parseInt(row["Count"], 10) })),
                        borderColor: '#3cba9f',
                        borderWidth: 2,
                        fill: false,
                    },
                    {
                        label: `Prapor`,
                        data: praporData.map(row => ({ x: luxon.DateTime.fromSeconds(parseInt(row["Timestamp"], 10)).toJSDate(), y: parseInt(row["Count"], 10) })),
                        borderColor: '#8e5ea2',
                        borderWidth: 2,
                        fill: false,
                    }
                ]
            },
            options: {
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'day'
                        },
                        title: {
                            display: true,
                            text: 'Time',
                            color: '#ffffff'
                        },
                        ticks: {
                            color: '#ffffff'
                        },
                        grid: {
                            color: '#888888'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Count',
                            color: '#ffffff'
                        },
                        ticks: {
                            color: '#ffffff'
                        },
                        grid: {
                            color: '#888888'
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: '#ffffff',
                            boxWidth: 0,
                            padding: 20
                        },
                        position: 'top',
                        align: 'end'
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error creating chart:', error);
    }
}

document.addEventListener('DOMContentLoaded', createChart);