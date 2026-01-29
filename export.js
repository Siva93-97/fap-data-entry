class ExportManager {
    // Create family data worksheet
    createFamilyWorksheet(families, student) {
        const headers = [
            'Family_ID',
            'Student_Name',
            'Student_Roll',
            'Head_Name',
            'Contact_Number',
            'Total_Members',
            'Family_Type',
            'Special_Groups',
            'SES_Status',
            'Employment_Status',
            'House_Type',
            'Ownership',
            'Num_Rooms',
            'Separate_Kitchen',
            'Fuel_Type',
            'Ventilation',
            'Natural_Lighting',
            'Overcrowding',
            'Water_Source',
            'Water_Treatment',
            'Water_Storage',
            'Toilet_Facility',
            'Waste_Disposal',
            'Drainage_System',
            'Vector_Breeding',
            'Domestic_Animals',
            'First_Contact',
            'Distance_Health',
            'Health_Insurance',
            'Health_Expenditure',
            'Dietary_Pattern',
            'Meals_Per_Day',
            'Fruit_Vegetable',
            'Junk_Food',
            'Tobacco_Use',
            'Alcohol_Consumption',
            'Other_Substance',
            'Physical_Activity',
            'Activity_Duration',
            'Sedentary_Lifestyle',
            'Screen_Time',
            'Health_Improvement',
            'Compliance',
            'Knowledge_Improvement',
            'Behavioral_Changes',
            'Financial_Barrier',
            'Transportation_Barrier',
            'Cultural_Barrier',
            'Cultural_Specify',
            'Language_Barrier',
            'Awareness_Lack',
            'Health_Priorities',
            'Family_Strengths',
            'Areas_Attention',
            'Additional_Comments',
            'Hypertension_Count',
            'Diabetes_Count',
            'Heart_Disease_Count',
            'Respiratory_Disease_Count',
            'Tuberculosis_Count',
            'Cancer_Count',
            'Mental_Health_Count',
            'Disability_Count',
            'Others_Disease_Count'
        ];

        const rows = families.map((family, index) => {
            const diseaseCounts = this.countDiseases(family);
            return [
                family.familyId || index + 1,
                student.name || '',
                student.roll || '',
                family.headName || '',
                family.contactNumber || '',
                family.totalMembers || '',
                family.familyType || '',
                (family.specialGroups || []).join('; '),
                family.sesStatus || '',
                family.employmentStatus || '',
                family.houseType || '',
                family.ownership || '',
                family.numRooms || '',
                family.separateKitchen || '',
                family.fuelType || '',
                family.ventilation || '',
                family.naturalLighting || '',
                family.overcrowding || '',
                family.waterSource || '',
                (family.waterTreatment || []).join('; '),
                family.waterStorage || '',
                family.toiletFacility || '',
                family.wasteDisposal || '',
                family.drainageSystem || '',
                family.vectorBreeding || '',
                family.domesticAnimals || '',
                family.firstContact || '',
                family.distanceToHealth || '',
                family.healthInsurance || '',
                family.healthExpenditure || '',
                family.dietaryPattern || '',
                family.mealsPerDay || '',
                family.fruitVegetable || '',
                family.junkFood || '',
                family.tobaccoUse || '',
                family.alcoholConsumption || '',
                family.otherSubstance || '',
                family.physicalActivity || '',
                family.activityDuration || '',
                family.sedentaryLifestyle || '',
                family.screenTime || '',
                family.healthImprovement || '',
                family.compliance || '',
                family.knowledgeImprovement || '',
                family.behavioralChanges || '',
                family.financialBarrier || '',
                family.transportationBarrier || '',
                family.culturalBarrier || '',
                family.culturalSpecify || '',
                family.languageBarrier || '',
                family.awarenessLack || '',
                family.healthPriorities || '',
                family.familyStrengths || '',
                family.areasAttention || '',
                family.additionalComments || '',
                diseaseCounts.hypertension,
                diseaseCounts.diabetes,
                diseaseCounts.heartDisease,
                diseaseCounts.respiratoryDisease,
                diseaseCounts.tuberculosis,
                diseaseCounts.cancer,
                diseaseCounts.mentalHealth,
                diseaseCounts.disability,
                diseaseCounts.others
            ];
        });

        return { headers, rows };
    }

    // Create individual data worksheet
    createIndividualWorksheet(families, student) {
        const headers = [
            'Family_ID',
            'Student_Name',
            'Student_Roll',
            'Member_Name',
            'Age',
            'Sex',
            'Education',
            'Occupation',
            'Special_Group',
            'Hypertension',
            'Diabetes_Mellitus',
            'Heart_Disease',
            'Respiratory_Disease',
            'Tuberculosis',
            'Cancer',
            'Mental_Health_Disorder',
            'Disability',
            'Disability_Type',
            'Others',
            'Others_Specify'
        ];

        const rows = [];

        families.forEach((family, familyIndex) => {
            if (family.members && family.members.length > 0) {
                family.members.forEach(member => {
                    rows.push([
                        family.familyId || familyIndex + 1,
                        student.name || '',
                        student.roll || '',
                        member.name || '',
                        member.age || '',
                        member.sex || '',
                        member.education || '',
                        member.occupation || '',
                        member.specialGroup || '',
                        this.boolToYesNo(member.diseases?.hypertension),
                        this.boolToYesNo(member.diseases?.diabetes),
                        this.boolToYesNo(member.diseases?.heartDisease),
                        this.boolToYesNo(member.diseases?.respiratoryDisease),
                        this.boolToYesNo(member.diseases?.tuberculosis),
                        this.boolToYesNo(member.diseases?.cancer),
                        this.boolToYesNo(member.diseases?.mentalHealth),
                        this.boolToYesNo(member.diseases?.disability),
                        member.disabilityType || '',
                        this.boolToYesNo(member.diseases?.others),
                        member.othersSpecify || ''
                    ]);
                });
            }
        });

        return { headers, rows };
    }

    // Count diseases in family
    countDiseases(family) {
        const counts = {
            hypertension: 0,
            diabetes: 0,
            heartDisease: 0,
            respiratoryDisease: 0,
            tuberculosis: 0,
            cancer: 0,
            mentalHealth: 0,
            disability: 0,
            others: 0
        };

        if (family.members && family.members.length > 0) {
            family.members.forEach(member => {
                if (member.diseases) {
                    if (member.diseases.hypertension) counts.hypertension++;
                    if (member.diseases.diabetes) counts.diabetes++;
                    if (member.diseases.heartDisease) counts.heartDisease++;
                    if (member.diseases.respiratoryDisease) counts.respiratoryDisease++;
                    if (member.diseases.tuberculosis) counts.tuberculosis++;
                    if (member.diseases.cancer) counts.cancer++;
                    if (member.diseases.mentalHealth) counts.mentalHealth++;
                    if (member.diseases.disability) counts.disability++;
                    if (member.diseases.others) counts.others++;
                }
            });
        }

        return counts;
    }

    // Boolean to Yes/No
    boolToYesNo(value) {
        return value ? 'Yes' : 'No';
    }

    // Export family data to Excel
    exportFamilyToExcel(roll) {
        const data = storage.getAllData();
        const { headers, rows } = this.createFamilyWorksheet(data.families, data.student);

        const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
        
        // Set column widths
        const colWidths = headers.map(() => 15);
        worksheet['!cols'] = colWidths;

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Family Data');
        XLSX.writeFile(workbook, `Family_Data_${roll}.xlsx`);
    }

    // Export individual data to Excel
    exportIndividualToExcel(roll) {
        const data = storage.getAllData();
        const { headers, rows } = this.createIndividualWorksheet(data.families, data.student);

        const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
        
        // Set column widths
        const colWidths = headers.map(() => 15);
        worksheet['!cols'] = colWidths;

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Individual Data');
        XLSX.writeFile(workbook, `Individual_Data_${roll}.xlsx`);
    }

    // Import family data from Excel
    importFamilyFromExcel(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const workbook = XLSX.read(e.target.result, { type: 'binary' });
                    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                    const data = XLSX.utils.sheet_to_json(worksheet);

                    if (data.length === 0) {
                        reject('No data found in the file');
                        return;
                    }

                    // Group data by Family_ID
                    const familiesMap = {};
                    data.forEach(row => {
                        const familyId = row.Family_ID || row.family_id;
                        if (!familiesMap[familyId]) {
                            familiesMap[familyId] = {
                                familyId: familyId,
                                headName: row.Head_Name || row.head_name || '',
                                contactNumber: row.Contact_Number || row.contact_number || '',
                                totalMembers: row.Total_Members || row.total_members || '',
                                familyType: row.Family_Type || row.family_type || '',
                                specialGroups: this.parseMultiValue(row.Special_Groups || row.special_groups),
                                sesStatus: row.SES_Status || row.ses_status || '',
                                employmentStatus: row.Employment_Status || row.employment_status || '',
                                houseType: row.House_Type || row.house_type || '',
                                ownership: row.Ownership || row.ownership || '',
                                numRooms: row.Num_Rooms || row.num_rooms || '',
                                separateKitchen: row.Separate_Kitchen || row.separate_kitchen || '',
                                fuelType: row.Fuel_Type || row.fuel_type || '',
                                ventilation: row.Ventilation || row.ventilation || '',
                                naturalLighting: row.Natural_Lighting || row.natural_lighting || '',
                                overcrowding: row.Overcrowding || row.overcrowding || '',
                                waterSource: row.Water_Source || row.water_source || '',
                                waterTreatment: this.parseMultiValue(row.Water_Treatment || row.water_treatment),
                                waterStorage: row.Water_Storage || row.water_storage || '',
                                toiletFacility: row.Toilet_Facility || row.toilet_facility || '',
                                wasteDisposal: row.Waste_Disposal || row.waste_disposal || '',
                                drainageSystem: row.Drainage_System || row.drainage_system || '',
                                vectorBreeding: row.Vector_Breeding || row.vector_breeding || '',
                                domesticAnimals: row.Domestic_Animals || row.domestic_animals || '',
                                firstContact: row.First_Contact || row.first_contact || '',
                                distanceToHealth: row.Distance_Health || row.distance_health || '',
                                healthInsurance: row.Health_Insurance || row.health_insurance || '',
                                healthExpenditure: row.Health_Expenditure || row.health_expenditure || '',
                                dietaryPattern: row.Dietary_Pattern || row.dietary_pattern || '',
                                mealsPerDay: row.Meals_Per_Day || row.meals_per_day || '',
                                fruitVegetable: row.Fruit_Vegetable || row.fruit_vegetable || '',
                                junkFood: row.Junk_Food || row.junk_food || '',
                                tobaccoUse: row.Tobacco_Use || row.tobacco_use || '',
                                alcoholConsumption: row.Alcohol_Consumption || row.alcohol_consumption || '',
                                otherSubstance: row.Other_Substance || row.other_substance || '',
                                physicalActivity: row.Physical_Activity || row.physical_activity || '',
                                activityDuration: row.Activity_Duration || row.activity_duration || '',
                                sedentaryLifestyle: row.Sedentary_Lifestyle || row.sedentary_lifestyle || '',
                                screenTime: row.Screen_Time || row.screen_time || '',
                                healthImprovement: row.Health_Improvement || row.health_improvement || '',
                                compliance: row.Compliance || row.compliance || '',
                                knowledgeImprovement: row.Knowledge_Improvement || row.knowledge_improvement || '',
                                behavioralChanges: row.Behavioral_Changes || row.behavioral_changes || '',
                                financialBarrier: row.Financial_Barrier || row.financial_barrier || '',
                                transportationBarrier: row.Transportation_Barrier || row.transportation_barrier || '',
                                culturalBarrier: row.Cultural_Barrier || row.cultural_barrier || '',
                                culturalSpecify: row.Cultural_Specify || row.cultural_specify || '',
                                languageBarrier: row.Language_Barrier || row.language_barrier || '',
                                awarenessLack: row.Awareness_Lack || row.awareness_lack || '',
                                healthPriorities: row.Health_Priorities || row.health_priorities || '',
                                familyStrengths: row.Family_Strengths || row.family_strengths || '',
                                areasAttention: row.Areas_Attention || row.areas_attention || '',
                                additionalComments: row.Additional_Comments || row.additional_comments || '',
                                members: []
                            };
                        }
                    });

                    resolve(Object.values(familiesMap));
                } catch (error) {
                    reject('Error parsing Excel file: ' + error.message);
                }
            };
            reader.onerror = () => reject('Error reading file');
            reader.readAsBinaryString(file);
        });
    }

    // Import individual data from Excel
    importIndividualFromExcel(file, existingFamilies) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const workbook = XLSX.read(e.target.result, { type: 'binary' });
                    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                    const data = XLSX.utils.sheet_to_json(worksheet);

                    if (data.length === 0) {
                        reject('No data found in the file');
                        return;
                    }

                    // Initialize members array for each family if not exists
                    const familiesMap = {};
                    existingFamilies.forEach(family => {
                        familiesMap[family.familyId] = family;
                        if (!family.members) {
                            family.members = [];
                        }
                    });

                    // Group data by Family_ID
                    data.forEach(row => {
                        const familyId = row.Family_ID || row.family_id;
                        
                        if (!familiesMap[familyId]) {
                            familiesMap[familyId] = {
                                familyId: familyId,
                                members: []
                            };
                        }

                        const member = {
                            name: row.Member_Name || row.member_name || '',
                            age: row.Age || row.age || '',
                            sex: row.Sex || row.sex || '',
                            relation: row.Relation_to_Head || row.relation_to_head || '',
                            education: row.Education || row.education || '',
                            occupation: row.Occupation || row.occupation || '',
                            specialGroup: row.Special_Group || row.special_group || '',
                            diseases: {
                                hypertension: this.yesNoToBool(row.Hypertension || row.hypertension),
                                diabetes: this.yesNoToBool(row.Diabetes_Mellitus || row.diabetes_mellitus),
                                heartDisease: this.yesNoToBool(row.Heart_Disease || row.heart_disease),
                                respiratoryDisease: this.yesNoToBool(row.Respiratory_Disease || row.respiratory_disease),
                                tuberculosis: this.yesNoToBool(row.Tuberculosis || row.tuberculosis),
                                cancer: this.yesNoToBool(row.Cancer || row.cancer),
                                mentalHealth: this.yesNoToBool(row.Mental_Health_Disorder || row.mental_health_disorder),
                                disability: this.yesNoToBool(row.Disability || row.disability),
                                others: this.yesNoToBool(row.Others || row.others)
                            },
                            disabilityType: row.Disability_Type || row.disability_type || '',
                            othersSpecify: row.Others_Specify || row.others_specify || ''
                        };

                        familiesMap[familyId].members.push(member);
                    });

                    resolve(Object.values(familiesMap));
                } catch (error) {
                    reject('Error parsing Excel file: ' + error.message);
                }
            };
            reader.onerror = () => reject('Error reading file');
            reader.readAsBinaryString(file);
        });
    }

    // Parse multi-value field (separated by ;)
    parseMultiValue(value) {
        if (!value || typeof value !== 'string') return [];
        return value.split(';').map(v => v.trim()).filter(v => v);
    }

    // Convert Yes/No to Boolean
    yesNoToBool(value) {
        if (typeof value === 'string') {
            return value.toLowerCase().trim() === 'yes';
        }
        return Boolean(value);
    }

    // Create combined worksheet for viewing
    createCombinedWorksheet(families, student) {
        return this.createFamilyWorksheet(families, student);
    }

    // Export family data (creates Excel file)
    exportFamilyData(families, student, familyIndex) {
        try {
            const roll = String(student?.roll || '1').padStart(3, '0');
            const name = (student?.name || 'Export').replace(/\s+/g, '_');
            const fileName = `${roll}_${name}_FF_${new Date().getTime()}.xlsx`;

            const { headers, rows } = this.createFamilyWorksheet(families, student || {});

            const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
            
            // Set column widths
            const colWidths = headers.map(() => 15);
            worksheet['!cols'] = colWidths;

            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Family Data');
            XLSX.writeFile(workbook, fileName);
        } catch (error) {
            console.error('Error exporting family data:', error);
            throw error;
        }
    }

    // Export individual data (creates Excel file)
    exportIndividualData(families, student, familyIndex) {
        try {
            const roll = String(student?.roll || '1').padStart(3, '0');
            const name = (student?.name || 'Export').replace(/\s+/g, '_');
            const fileName = `${roll}_${name}_MF_${new Date().getTime()}.xlsx`;

            const { headers, rows } = this.createIndividualWorksheet(families, student || {});

            const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
            
            // Set column widths
            const colWidths = headers.map(() => 15);
            worksheet['!cols'] = colWidths;

            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Individual Data');
            XLSX.writeFile(workbook, fileName);
        } catch (error) {
            console.error('Error exporting individual data:', error);
            throw error;
        }
    }
}