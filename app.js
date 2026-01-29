class FAPSurveyApp {
    constructor(storage) {
        this.storage = storage;
        this.currentFamily = null;
        this.currentMemberCount = 0;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.showScreen('studentScreen');
        this.storage.initializeFamilies();
    }

    setupEventListeners() {
        // Student Form
        document.getElementById('studentForm').addEventListener('submit', (e) => this.handleStudentSubmit(e));
        document.getElementById('loadExistingBtn').addEventListener('click', () => this.loadExistingData());

        // Family Screen
        document.getElementById('logoutBtn').addEventListener('click', () => this.logout());
        document.getElementById('exportFamilyBtn').addEventListener('click', () => this.exportFamilyData());
        document.getElementById('exportIndividualBtn').addEventListener('click', () => this.exportIndividualData());
        document.getElementById('importFamilyBtn').addEventListener('click', () => document.getElementById('fileImportFamily').click());
        document.getElementById('importIndividualBtn').addEventListener('click', () => document.getElementById('fileImportIndividual').click());
        document.getElementById('viewCompileBtn').addEventListener('click', () => this.showCompileScreen());
        document.getElementById('clearAllBtn').addEventListener('click', () => this.clearAllData());

        // File inputs
        document.getElementById('fileImportFamily').addEventListener('change', (e) => this.handleImportFamily(e));
        document.getElementById('fileImportIndividual').addEventListener('change', (e) => this.handleImportIndividual(e));

        // Family Form
        document.getElementById('familyForm').addEventListener('submit', (e) => this.handleFamilySubmit(e));
        document.getElementById('backBtn').addEventListener('click', () => this.backToFamilies());
        document.getElementById('totalMembers').addEventListener('change', (e) => this.generateMemberEntries(parseInt(e.target.value) || 0));
        document.getElementById('viewDataBtn').addEventListener('click', () => this.viewFamilyData());

        // View Screen
        document.getElementById('backFromViewBtn').addEventListener('click', () => this.backToForm());

        // Compile Screen
        document.getElementById('backFromCompileBtn').addEventListener('click', () => this.backToFamilies());
        document.getElementById('downloadCompiledFamilyBtn').addEventListener('click', () => this.downloadCompiledFamilyData());
        document.getElementById('downloadCompiledIndividualBtn').addEventListener('click', () => this.downloadCompiledIndividualData());

        // Tab switching
        document.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', (e) => this.switchTab(e));
        });

        // Conditional visibility
        document.getElementById('physicalActivity').addEventListener('change', (e) => {
            document.getElementById('durationGroup').style.display = e.target.value === 'Yes' ? 'flex' : 'none';
        });

        document.getElementById('culturalBarrier').addEventListener('change', (e) => {
            document.getElementById('culturalSpecifyGroup').style.display = e.target.value === 'Present' ? 'flex' : 'none';
        });
    }

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
        document.getElementById(screenId).classList.add('active');
    }

    handleStudentSubmit(e) {
        e.preventDefault();
        const name = document.getElementById('studentName').value.trim();
        const roll = document.getElementById('rollNumber').value.trim();

        if (!name || !roll) {
            this.showMessage('Please fill in all fields', 'error');
            return;
        }

        const studentData = { name, roll };
        this.storage.saveStudentData(studentData);
        this.loadFamilyScreen();
    }

    loadExistingData() {
        const existingData = this.storage.getStudentData();
        if (existingData.name) {
            document.getElementById('studentName').value = existingData.name;
            document.getElementById('rollNumber').value = existingData.roll;
            this.showMessage('Existing data loaded', 'success');
        } else {
            this.showMessage('No existing data found', 'info');
        }
    }

    loadFamilyScreen() {
        const student = this.storage.getStudentData();
        document.getElementById('studentInfo').textContent = `${student.name} - Roll: ${student.roll}`;
        this.renderFamilyCards();
        this.showScreen('familyScreen');
    }

    renderFamilyCards() {
        const families = this.storage.getFamilies();
        const grid = document.getElementById('familiesGrid');
        grid.innerHTML = '';

        families.forEach((family, index) => {
            const card = document.createElement('div');
            card.className = 'family-card';
            
            const isStarted = this.storage.isFamilyStarted(index);
            const memberCount = this.storage.getFamilyMemberCount(index);
            
            if (isStarted) {
                card.classList.add('started');
            }

            const status = isStarted ? `${memberCount} members` : 'Not Started';

            card.innerHTML = `
                <h3>Family ${index + 1}</h3>
                <p>${status}</p>
                <div class="family-card-actions">
                    <button class="card-action-btn" onclick="app.editFamily(${index})">Edit</button>
                    <button class="card-action-btn" onclick="app.viewFamily(${index})">View</button>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    editFamily(index) {
        this.currentFamily = index;
        const family = this.storage.getFamily(index);
        this.populateFamilyForm(family, index);
        document.getElementById('familyTitle').textContent = `Family ${index + 1}`;
        document.getElementById('familyProgress').textContent = `${index + 1}/5`;
        this.showScreen('familyFormScreen');
    }

    viewFamily(index) {
        this.currentFamily = index;
        const family = this.storage.getFamily(index);
        this.showFamilyData(family, index);
    }

    populateFamilyForm(family, index) {
        if (!family || !family.headName) {
            document.getElementById('familyForm').reset();
            document.getElementById('membersList').innerHTML = '';
            this.currentMemberCount = 0;
            return;
        }

        document.getElementById('headName').value = family.headName || '';
        document.getElementById('contactNumber').value = family.contactNumber || '';
        document.getElementById('totalMembers').value = family.totalMembers || '';
        document.getElementById('familyType').value = family.familyType || '';
        
        document.querySelectorAll('input[name="specialGroups"]').forEach(cb => {
            cb.checked = (family.specialGroups || []).includes(cb.value);
        });

        document.getElementById('sesStatus').value = family.sesStatus || '';
        document.getElementById('employmentStatus').value = family.employmentStatus || '';

        document.getElementById('houseType').value = family.houseType || '';
        document.getElementById('ownership').value = family.ownership || '';
        document.getElementById('numRooms').value = family.numRooms || '';
        document.getElementById('separateKitchen').value = family.separateKitchen || '';
        document.getElementById('fuelType').value = family.fuelType || '';
        document.getElementById('ventilation').value = family.ventilation || '';
        document.getElementById('naturalLighting').value = family.naturalLighting || '';
        document.getElementById('overcrowding').value = family.overcrowding || '';

        document.getElementById('waterSource').value = family.waterSource || '';
        document.querySelectorAll('input[name="waterTreatment"]').forEach(cb => {
            cb.checked = (family.waterTreatment || []).includes(cb.value);
        });
        document.getElementById('waterStorage').value = family.waterStorage || '';

        document.getElementById('toiletFacility').value = family.toiletFacility || '';
        document.getElementById('wasteDisposal').value = family.wasteDisposal || '';
        document.getElementById('drainageSystem').value = family.drainageSystem || '';
        document.getElementById('vectorBreeding').value = family.vectorBreeding || '';
        document.getElementById('domesticAnimals').value = family.domesticAnimals || '';

        document.getElementById('firstContact').value = family.firstContact || '';
        document.getElementById('distanceToHealth').value = family.distanceToHealth || '';
        document.getElementById('healthInsurance').value = family.healthInsurance || '';
        document.getElementById('healthExpenditure').value = family.healthExpenditure || '';

        document.getElementById('dietaryPattern').value = family.dietaryPattern || '';
        document.getElementById('mealsPerDay').value = family.mealsPerDay || '';
        document.getElementById('fruitVegetable').value = family.fruitVegetable || '';
        document.getElementById('junkFood').value = family.junkFood || '';

        document.getElementById('tobaccoUse').value = family.tobaccoUse || '';
        document.getElementById('alcoholConsumption').value = family.alcoholConsumption || '';
        document.getElementById('otherSubstance').value = family.otherSubstance || '';

        document.getElementById('physicalActivity').value = family.physicalActivity || '';
        if (family.physicalActivity === 'Yes') {
            document.getElementById('durationGroup').style.display = 'flex';
            document.getElementById('activityDuration').value = family.activityDuration || '';
        } else {
            document.getElementById('durationGroup').style.display = 'none';
        }
        document.getElementById('sedentaryLifestyle').value = family.sedentaryLifestyle || '';
        document.getElementById('screenTime').value = family.screenTime || '';

        document.getElementById('financialBarrier').value = family.financialBarrier || '';
        document.getElementById('transportationBarrier').value = family.transportationBarrier || '';
        document.getElementById('culturalBarrier').value = family.culturalBarrier || '';
        if (family.culturalBarrier === 'Present') {
            document.getElementById('culturalSpecifyGroup').style.display = 'flex';
            document.getElementById('culturalSpecify').value = family.culturalSpecify || '';
        } else {
            document.getElementById('culturalSpecifyGroup').style.display = 'none';
        }
        document.getElementById('languageBarrier').value = family.languageBarrier || '';
        document.getElementById('awarenessLack').value = family.awarenessLack || '';

        document.getElementById('healthImprovement').value = family.healthImprovement || '';
        document.getElementById('compliance').value = family.compliance || '';
        document.getElementById('knowledgeImprovement').value = family.knowledgeImprovement || '';
        document.getElementById('behavioralChanges').value = family.behavioralChanges || '';

        document.getElementById('healthPriorities').value = family.healthPriorities || '';
        document.getElementById('familyStrengths').value = family.familyStrengths || '';
        document.getElementById('areasAttention').value = family.areasAttention || '';
        document.getElementById('additionalComments').value = family.additionalComments || '';

        if (family.members && family.members.length > 0) {
            this.renderMembers(family.members);
        }
    }

    renderMembers(members) {
        const membersList = document.getElementById('membersList');
        membersList.innerHTML = '';
        this.currentMemberCount = members.length;

        members.forEach((member, index) => {
            const memberEl = this.createMemberElement(member, index);
            membersList.appendChild(memberEl);
        });
    }

    createMemberElement(member = null, memberIndex = null) {
        const div = document.createElement('div');
        div.className = 'member-entry';

        const memberNum = memberIndex !== null ? memberIndex + 1 : this.currentMemberCount + 1;

        // Build HTML: Name, Age, Sex, Education, Occupation, Health checkboxes
        const educationOptions = ['No formal', 'Primary', 'Secondary', 'Higher Secondary', 'Graduate', 'Postgraduate'];

        let educationHtml = `<select class="member-education" required>`;
        educationHtml += `<option value="">Select...</option>`;
        educationOptions.forEach(opt => {
            const sel = member && member.education === opt ? 'selected' : '';
            educationHtml += `<option value="${opt}" ${sel}>${opt}</option>`;
        });
        educationHtml += `</select>`;

        let html = `
            <div class="member-header">
                <h4>Member ${memberNum}</h4>
            </div>
            <div class="member-fields">
                <div class="form-group">
                    <label>Name *</label>
                    <input type="text" class="member-name" value="${member?.name || ''}" required>
                </div>
                <div class="form-group">
                    <label>Age *</label>
                    <input type="number" class="member-age" value="${member?.age || ''}" required>
                </div>
                <div class="form-group">
                    <label>Sex *</label>
                    <select class="member-sex" required>
                        <option value="">Select...</option>
                        <option value="Male" ${member?.sex === 'Male' ? 'selected' : ''}>Male</option>
                        <option value="Female" ${member?.sex === 'Female' ? 'selected' : ''}>Female</option>
                        <option value="Other" ${member?.sex === 'Other' ? 'selected' : ''}>Other</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Education *</label>
                    ${educationHtml}
                </div>
                <div class="form-group">
                    <label>Occupation *</label>
                    <input type="text" class="member-occupation" value="${member?.occupation || ''}" required>
                </div>
                </div>

                <div class="form-group">
                    <label>Health Status (Yes/No)</label>
                    <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:8px;">
                        <label><input type="checkbox" class="disease-hypertension" ${member?.diseases?.hypertension ? 'checked' : ''}> Hypertension</label>
                        <label><input type="checkbox" class="disease-diabetes" ${member?.diseases?.diabetes ? 'checked' : ''}> Diabetes</label>
                        <label><input type="checkbox" class="disease-heart" ${member?.diseases?.heartDisease ? 'checked' : ''}> Heart Disease</label>
                        <label><input type="checkbox" class="disease-resp" ${member?.diseases?.respiratoryDisease ? 'checked' : ''}> Respiratory</label>
                        <label><input type="checkbox" class="disease-tb" ${member?.diseases?.tuberculosis ? 'checked' : ''}> Tuberculosis</label>
                        <label><input type="checkbox" class="disease-cancer" ${member?.diseases?.cancer ? 'checked' : ''}> Cancer</label>
                        <label><input type="checkbox" class="disease-mental" ${member?.diseases?.mentalHealth ? 'checked' : ''}> Mental Health</label>
                        <label><input type="checkbox" class="disease-disability" ${member?.diseases?.disability ? 'checked' : ''}> Disability</label>
                        <label><input type="checkbox" class="disease-others" ${member?.diseases?.others ? 'checked' : ''}> Others</label>
                    </div>
                </div>

                <div class="form-group disability-type-field" style="display:${member?.disabilityType ? 'block' : 'none'};">
                    <label>Disability Type</label>
                    <input type="text" class="member-disabilityType" value="${member?.disabilityType || ''}">
                </div>

                <div class="form-group others-specify-field" style="display:${member?.othersSpecify ? 'block' : 'none'};">
                    <label>Others (specify)</label>
                    <input type="text" class="member-othersSpecify" value="${member?.othersSpecify || ''}">
                </div>

            </div>
        `;

        div.innerHTML = html;

        // Attach listeners to show/hide disability/others fields
        const disChk = div.querySelector('.disease-disability');
        const othersChk = div.querySelector('.disease-others');
        const disField = div.querySelector('.disability-type-field');
        const othersField = div.querySelector('.others-specify-field');

        if (disChk) {
            disChk.addEventListener('change', () => {
                disField.style.display = disChk.checked ? 'block' : 'none';
            });
        }
        if (othersChk) {
            othersChk.addEventListener('change', () => {
                othersField.style.display = othersChk.checked ? 'block' : 'none';
            });
        }

        return div;
    }

    generateMemberEntries(count) {
        const membersList = document.getElementById('membersList');
        membersList.innerHTML = '';
        this.currentMemberCount = count;

        if (count <= 0) {
            return;
        }

        for (let i = 0; i < count; i++) {
            const memberEl = this.createMemberElement(null, i);
            membersList.appendChild(memberEl);
        }
    }

    addMember() {
        const membersList = document.getElementById('membersList');
        const memberEl = this.createMemberElement();
        membersList.appendChild(memberEl);
        this.currentMemberCount++;
    }

    removeMember(btn) {
        btn.closest('.member-entry').remove();
        this.currentMemberCount--;
    }

    handleFamilySubmit(e) {
        e.preventDefault();
        const headName = document.getElementById('headName').value.trim();
        const contactNumber = document.getElementById('contactNumber').value.trim();

        if (!headName || !contactNumber) {
            this.showMessage('Head name and contact number are required', 'error');
            return;
        }

        if (contactNumber.length !== 10 || !/^\d+$/.test(contactNumber)) {
            this.showMessage('Contact number must be 10 digits', 'error');
            return;
        }
        
        // Get barrier values BEFORE form reset
        const financialBarrier = document.getElementById('financialBarrier').value;
        const transportationBarrier = document.getElementById('transportationBarrier').value;
        const culturalBarrier = document.getElementById('culturalBarrier').value;
        const culturalSpecify = document.getElementById('culturalSpecify').value;
        const languageBarrier = document.getElementById('languageBarrier').value;
        const awarenessLack = document.getElementById('awarenessLack').value;

        const membersList = Array.from(document.querySelectorAll('.member-entry')).map(entry => ({
            name: entry.querySelector('.member-name').value,
            age: entry.querySelector('.member-age').value,
            sex: entry.querySelector('.member-sex').value,
            education: entry.querySelector('.member-education') ? entry.querySelector('.member-education').value : '',
            occupation: entry.querySelector('.member-occupation') ? entry.querySelector('.member-occupation').value : '',
            diseases: {
                hypertension: !!entry.querySelector('.disease-hypertension') && entry.querySelector('.disease-hypertension').checked,
                diabetes: !!entry.querySelector('.disease-diabetes') && entry.querySelector('.disease-diabetes').checked,
                heartDisease: !!entry.querySelector('.disease-heart') && entry.querySelector('.disease-heart').checked,
                respiratoryDisease: !!entry.querySelector('.disease-resp') && entry.querySelector('.disease-resp').checked,
                tuberculosis: !!entry.querySelector('.disease-tb') && entry.querySelector('.disease-tb').checked,
                cancer: !!entry.querySelector('.disease-cancer') && entry.querySelector('.disease-cancer').checked,
                mentalHealth: !!entry.querySelector('.disease-mental') && entry.querySelector('.disease-mental').checked,
                disability: !!entry.querySelector('.disease-disability') && entry.querySelector('.disease-disability').checked,
                others: !!entry.querySelector('.disease-others') && entry.querySelector('.disease-others').checked
            },
            disabilityType: entry.querySelector('.member-disabilityType') ? entry.querySelector('.member-disabilityType').value : '',
            othersSpecify: entry.querySelector('.member-othersSpecify') ? entry.querySelector('.member-othersSpecify').value : ''
        }));

        if (membersList.length === 0) {
            this.showMessage('At least 1 family member is required', 'error');
            return;
        }

        // Validate that required member fields are filled
        const expectedCount = parseInt(document.getElementById('totalMembers').value) || 0;
        if (membersList.length !== expectedCount) {
            this.showMessage(`Expected ${expectedCount} members, but found ${membersList.length}`, 'error');
            return;
        }

        for (let index = 0; index < membersList.length; index++) {
            const member = membersList[index];
            const { name, age, sex, education, occupation } = member;
            if (!name || !age || !sex || !education || !occupation) {
                this.showMessage(`Member ${index + 1}: Name, age, sex, education, and occupation are all required`, 'error');
                return;
            }
        }

        const specialGroups = [];
        document.querySelectorAll('input[name="specialGroups"]:checked').forEach(cb => {
            specialGroups.push(cb.value);
        });

        const waterTreatment = [];
        document.querySelectorAll('input[name="waterTreatment"]:checked').forEach(cb => {
            waterTreatment.push(cb.value);
        });

        const familyData = {
            familyId: this.currentFamily + 1,
            headName,
            contactNumber,
            totalMembers: parseInt(document.getElementById('totalMembers').value) || 0,
            familyType: document.getElementById('familyType').value,
            specialGroups,
            sesStatus: document.getElementById('sesStatus').value,
            employmentStatus: document.getElementById('employmentStatus').value,
            houseType: document.getElementById('houseType').value,
            ownership: document.getElementById('ownership').value,
            numRooms: parseInt(document.getElementById('numRooms').value) || 0,
            separateKitchen: document.getElementById('separateKitchen').value,
            fuelType: document.getElementById('fuelType').value,
            ventilation: document.getElementById('ventilation').value,
            naturalLighting: document.getElementById('naturalLighting').value,
            overcrowding: document.getElementById('overcrowding').value,
            waterSource: document.getElementById('waterSource').value,
            waterTreatment,
            waterStorage: document.getElementById('waterStorage').value,
            toiletFacility: document.getElementById('toiletFacility').value,
            wasteDisposal: document.getElementById('wasteDisposal').value,
            drainageSystem: document.getElementById('drainageSystem').value,
            vectorBreeding: document.getElementById('vectorBreeding').value,
            domesticAnimals: document.getElementById('domesticAnimals').value,
            firstContact: document.getElementById('firstContact').value,
            distanceToHealth: document.getElementById('distanceToHealth').value,
            healthInsurance: document.getElementById('healthInsurance').value,
            healthExpenditure: parseInt(document.getElementById('healthExpenditure').value) || 0,
            dietaryPattern: document.getElementById('dietaryPattern').value,
            mealsPerDay: parseInt(document.getElementById('mealsPerDay').value) || 0,
            fruitVegetable: document.getElementById('fruitVegetable').value,
            junkFood: document.getElementById('junkFood').value,
            tobaccoUse: document.getElementById('tobaccoUse').value,
            alcoholConsumption: document.getElementById('alcoholConsumption').value,
            otherSubstance: document.getElementById('otherSubstance').value,
            physicalActivity: document.getElementById('physicalActivity').value,
            activityDuration: parseInt(document.getElementById('activityDuration').value) || 0,
            sedentaryLifestyle: document.getElementById('sedentaryLifestyle').value,
            screenTime: document.getElementById('screenTime').value,
            healthImprovement: document.getElementById('healthImprovement').value,
            compliance: document.getElementById('compliance').value,
            knowledgeImprovement: document.getElementById('knowledgeImprovement').value,
            behavioralChanges: document.getElementById('behavioralChanges').value,
            financialBarrier,
            transportationBarrier,
            culturalBarrier,
            culturalSpecify,
            languageBarrier,
            awarenessLack,
            healthPriorities: document.getElementById('healthPriorities').value,
            familyStrengths: document.getElementById('familyStrengths').value,
            areasAttention: document.getElementById('areasAttention').value,
            additionalComments: document.getElementById('additionalComments').value,
            members: membersList
        };

        this.storage.saveFamily(this.currentFamily, familyData);
        this.showMessage('Family data saved successfully', 'success');
        this.backToFamilies();
    }

    backToFamilies() {
        this.loadFamilyScreen();
    }

    viewFamilyData() {
        const family = this.storage.getFamily(this.currentFamily);
        this.showFamilyData(family, this.currentFamily);
    }

    showFamilyData(family, index) {
        const viewContent = document.getElementById('viewContent');
        let html = `<h3>${family.headName} (Family ${family.familyId})</h3>`;
        html += `<p><strong>Contact:</strong> ${family.contactNumber}</p>`;
        html += `<p><strong>Total Members:</strong> ${family.totalMembers}</p>`;
        html += `<p><strong>Family Type:</strong> ${family.familyType}</p>`;
        html += `<hr/>`;
        
        if (family.members && family.members.length > 0) {
            html += `<h4>Family Members</h4>`;
            html += `<table class="data-table"><thead><tr><th>Name</th><th>Age</th><th>Sex</th><th>Education</th><th>Occupation</th><th>Health</th></tr></thead><tbody>`;
            family.members.forEach(member => {
                const healthList = [];
                if (member.diseases) {
                    if (member.diseases.hypertension) healthList.push('Hypertension');
                    if (member.diseases.diabetes) healthList.push('Diabetes');
                    if (member.diseases.heartDisease) healthList.push('Heart');
                    if (member.diseases.respiratoryDisease) healthList.push('Respiratory');
                    if (member.diseases.tuberculosis) healthList.push('TB');
                    if (member.diseases.cancer) healthList.push('Cancer');
                    if (member.diseases.mentalHealth) healthList.push('Mental');
                    if (member.diseases.disability) healthList.push('Disability');
                    if (member.diseases.others) healthList.push(member.othersSpecify || 'Others');
                }
                html += `<tr><td>${member.name}</td><td>${member.age}</td><td>${member.sex}</td><td>${member.education || ''}</td><td>${member.occupation || ''}</td><td>${healthList.join(', ')}</td></tr>`;
            });
            html += `</tbody></table>`;
        }
        
        viewContent.innerHTML = html;
        this.showScreen('viewScreen');
    }

    backToForm() {
        this.showScreen('familyFormScreen');
    }

    logout() {
        if (confirm('Are you sure you want to change student?')) {
            this.storage.clearStudentData();
            document.getElementById('studentForm').reset();
            this.showScreen('studentScreen');
        }
    }

    exportFamilyData() {
        const student = this.storage.getStudentData();
        const families = this.storage.getFamilies();
        const manager = new ExportManager();
        manager.exportFamilyData(families, student, null);
        this.showMessage('Family data exported successfully', 'success');
    }

    exportIndividualData() {
        const student = this.storage.getStudentData();
        const families = this.storage.getFamilies();
        const manager = new ExportManager();
        manager.exportIndividualData(families, student, null);
        this.showMessage('Individual data exported successfully', 'success');
    }

    handleImportFamily(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const workbook = XLSX.read(event.target.result, { type: 'binary' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const data = XLSX.utils.sheet_to_json(worksheet);
                
                data.forEach((row, index) => {
                    const familyData = {
                        familyId: row['Family ID'] || (index + 1),
                        headName: row['Head of Family'] || '',
                        contactNumber: row['Contact Number'] || '',
                        totalMembers: row['Total Members'] || 0,
                        familyType: row['Family Type'] || '',
                        members: []
                    };
                    this.storage.saveFamily(index, familyData);
                });
                
                this.showMessage('Family data imported successfully', 'success');
                this.renderFamilyCards();
            } catch (error) {
                this.showMessage('Error importing family data: ' + error.message, 'error');
            }
        };
        reader.readAsBinaryString(file);
        e.target.value = '';
    }

    handleImportIndividual(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const workbook = XLSX.read(event.target.result, { type: 'binary' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const data = XLSX.utils.sheet_to_json(worksheet);
                
                data.forEach((row) => {
                    const yes = (v) => String(v || '').toLowerCase().trim() === 'yes';
                    const familyIndex = (row['Family ID'] || 1) - 1;
                    const family = this.storage.getFamily(familyIndex) || { members: [] };
                    if (!family.members) family.members = [];

                    family.members.push({
                        name: row['Name'] || '',
                        age: row['Age'] || '',
                        sex: row['Sex'] || '',
                        education: row['Education'] || '',
                        occupation: row['Occupation'] || '',
                        diseases: {
                            hypertension: yes(row['Hypertension']),
                            diabetes: yes(row['Diabetes_Mellitus'] || row['Diabetes']),
                            heartDisease: yes(row['Heart_Disease'] || row['Heart']),
                            respiratoryDisease: yes(row['Respiratory_Disease'] || row['Respiratory']),
                            tuberculosis: yes(row['Tuberculosis'] || row['TB']),
                            cancer: yes(row['Cancer']),
                            mentalHealth: yes(row['Mental_Health_Disorder'] || row['Mental_Health']),
                            disability: yes(row['Disability']),
                            others: yes(row['Others'])
                        },
                        disabilityType: row['Disability_Type'] || '',
                        othersSpecify: row['Others_Specify'] || ''
                    });

                    this.storage.saveFamily(familyIndex, family);
                });
                
                this.showMessage('Individual data imported successfully', 'success');
                this.renderFamilyCards();
            } catch (error) {
                this.showMessage('Error importing individual data: ' + error.message, 'error');
            }
        };
        reader.readAsBinaryString(file);
        e.target.value = '';
    }

    showCompileScreen() {
        const families = this.storage.getFamilies();
        
        let familyTable = `<table class="data-table"><thead><tr><th>Family ID</th><th>Head Name</th><th>Contact</th><th>Total Members</th><th>Type</th></tr></thead><tbody>`;
        families.forEach((family, index) => {
            if (family && family.headName) {
                familyTable += `<tr><td>${family.familyId || (index + 1)}</td><td>${family.headName}</td><td>${family.contactNumber}</td><td>${family.totalMembers}</td><td>${family.familyType}</td></tr>`;
            }
        });
        familyTable += `</tbody></table>`;
        document.getElementById('familyDataTable').innerHTML = familyTable;
        
        let individualTable = `<table class="data-table"><thead><tr><th>Family ID</th><th>Member Name</th><th>Age</th><th>Sex</th><th>Education</th><th>Occupation</th><th>Health</th></tr></thead><tbody>`;
        families.forEach((family, index) => {
            if (family && family.members) {
                family.members.forEach(member => {
                    const healthList = [];
                    if (member.diseases) {
                        if (member.diseases.hypertension) healthList.push('Hypertension');
                        if (member.diseases.diabetes) healthList.push('Diabetes');
                        if (member.diseases.heartDisease) healthList.push('Heart');
                        if (member.diseases.respiratoryDisease) healthList.push('Respiratory');
                        if (member.diseases.tuberculosis) healthList.push('TB');
                        if (member.diseases.cancer) healthList.push('Cancer');
                        if (member.diseases.mentalHealth) healthList.push('Mental');
                        if (member.diseases.disability) healthList.push('Disability');
                        if (member.diseases.others) healthList.push(member.othersSpecify || 'Others');
                    }
                    individualTable += `<tr><td>${family.familyId || (index + 1)}</td><td>${member.name}</td><td>${member.age}</td><td>${member.sex}</td><td>${member.education || ''}</td><td>${member.occupation || ''}</td><td>${healthList.join(', ')}</td></tr>`;
                });
            }
        });
        individualTable += `</tbody></table>`;
        document.getElementById('individualDataTable').innerHTML = individualTable;
        
        this.showScreen('compileScreen');
    }

    downloadCompiledFamilyData() {
        const families = this.storage.getFamilies();
        const manager = new ExportManager();
        manager.exportFamilyData(families, 'Compiled');
        this.showMessage('Family data downloaded successfully', 'success');
    }

    downloadCompiledIndividualData() {
        const families = this.storage.getFamilies();
        const manager = new ExportManager();
        manager.exportIndividualData(families, 'Compiled');
        this.showMessage('Individual data downloaded successfully', 'success');
    }

    switchTab(e) {
        const tabName = e.target.getAttribute('data-tab');
        document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        
        e.target.classList.add('active');
        document.getElementById(tabName).classList.add('active');
    }

    clearAllData() {
        if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
            this.storage.clearAllData();
            this.showMessage('All data cleared successfully', 'success');
            this.renderFamilyCards();
        }
    }

    showMessage(message, type = 'info') {
        const messageBox = document.getElementById('messageBox');
        const messageEl = document.createElement('div');
        messageEl.className = `message ${type}`;
        messageEl.innerHTML = `${message} <span class="message-close">×</span>`;
        
        messageEl.querySelector('.message-close').addEventListener('click', () => {
            messageEl.remove();
        });
        
        messageBox.appendChild(messageEl);
        
        setTimeout(() => {
            messageEl.remove();
        }, 4000);
    }
}
