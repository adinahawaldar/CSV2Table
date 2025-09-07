 document.addEventListener('DOMContentLoaded', function() {
            const fileInput = document.getElementById('fileInput');
            const uploadArea = document.getElementById('uploadArea');
            const tableContainer = document.getElementById('tableContainer');
            const tableHeader = document.getElementById('tableHeader');
            const tableBody = document.getElementById('tableBody');
            const searchBox = document.getElementById('searchBox');
            const searchInput = document.getElementById('searchInput');
            
            let csvData = [];
            let headers = [];
            
            uploadArea.addEventListener('dragover', function(e) {
                e.preventDefault();
                this.style.borderColor = '#4361ee';
                this.style.backgroundColor = '#f8f9fa';
            });
            
            uploadArea.addEventListener('dragleave', function() {
                this.style.borderColor = '#e9ecef';
                this.style.backgroundColor = 'transparent';
            });
            
            uploadArea.addEventListener('drop', function(e) {
                e.preventDefault();
                this.style.borderColor = '#e9ecef';
                this.style.backgroundColor = 'transparent';
                
                if (e.dataTransfer.files.length) {
                    fileInput.files = e.dataTransfer.files;
                    handleFile(e.dataTransfer.files[0]);
                }
            });
            
            fileInput.addEventListener('change', function() {
                if (this.files.length) {
                    handleFile(this.files[0]);
                }
            });
            
            function handleFile(file) {
                if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
                    alert('Please upload a CSV file');
                    return;
                }
                
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    const text = e.target.result;
                    parseCSV(text);
                };
                
                reader.readAsText(file);
                
                uploadArea.querySelector('h3').textContent = file.name;
                uploadArea.querySelector('p').textContent = 'Click to choose a different file';
            }
            
            function parseCSV(text) {
                const lines = text.split('\n');
                headers = lines[0].split(',').map(header => header.trim());
                
                csvData = [];
                for (let i = 1; i < lines.length; i++) {
                    if (lines[i].trim() === '') continue;
                    
                    const values = lines[i].split(',').map(value => value.trim());
                    const row = {};
                    
                    headers.forEach((header, index) => {
                        row[header] = values[index] || '';
                    });
                    
                    csvData.push(row);
                }
                
                renderTable();
            }
            
            function renderTable() {
                tableHeader.innerHTML = '';
                tableBody.innerHTML = '';
                
                headers.forEach(header => {
                    const th = document.createElement('th');
                    th.textContent = header;
                    th.addEventListener('click', () => sortTable(header));
                    tableHeader.appendChild(th);
                });
                
                csvData.forEach(row => {
                    const tr = document.createElement('tr');
                    
                    headers.forEach(header => {
                        const td = document.createElement('td');
                        td.textContent = row[header];
                        tr.appendChild(td);
                    });
                    
                    tableBody.appendChild(tr);
                });
                
                tableContainer.style.display = 'block';
                searchBox.style.display = 'block';
                
                tableContainer.scrollIntoView({ behavior: 'smooth' });
            }
            
            function sortTable(column) {
                csvData.sort((a, b) => {
                    if (a[column] < b[column]) return -1;
                    if (a[column] > b[column]) return 1;
                    return 0;
                });
                
                renderTable();
            }
            
            // Search functionality
            searchInput.addEventListener('input', function() {
                const searchText = this.value.toLowerCase();
                
                const rows = tableBody.getElementsByTagName('tr');
                
                for (let i = 0; i < rows.length; i++) {
                    const cells = rows[i].getElementsByTagName('td');
                    let found = false;
                    
                    for (let j = 0; j < cells.length; j++) {
                        if (cells[j].textContent.toLowerCase().includes(searchText)) {
                            found = true;
                            break;
                        }
                    }
                    
                    rows[i].style.display = found ? '' : 'none';
                }
            });
        });