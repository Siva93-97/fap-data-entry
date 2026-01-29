class DataStorage {
    constructor() {
        this.storageKey = 'fap_survey_data';
    }

    // Get all data
    getAllData() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : { student: {}, families: [] };
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return { student: {}, families: [] };
        }
    }

    // Get student data
    getStudentData() {
        const data = this.getAllData();
        return data.student || {};
    }

    // Save student data
    saveStudentData(student) {
        const data = this.getAllData();
        data.student = student;
        this.saveAllData(data);
    }

    // Get all families
    getFamilies() {
        const data = this.getAllData();
        return data.families || [];
    }

    // Get specific family
    getFamily(familyIndex) {
        const families = this.getFamilies();
        return families[familyIndex] || null;
    }

    // Save family
    saveFamily(familyIndex, familyData) {
        const data = this.getAllData();
        if (!data.families) {
            data.families = [];
        }
        data.families[familyIndex] = familyData;
        this.saveAllData(data);
    }

    // Save all data
    saveAllData(data) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(data));
        } catch (error) {
            console.error('Error writing to localStorage:', error);
            throw new Error('Failed to save data. Storage might be full.');
        }
    }

    // Clear all data
    clearAllData() {
        try {
            localStorage.removeItem(this.storageKey);
        } catch (error) {
            console.error('Error clearing localStorage:', error);
        }
    }

    // Check if family has data
    isFamilyStarted(familyIndex) {
        const family = this.getFamily(familyIndex);
        return family && family.headName;
    }

    // Get family member count
    getFamilyMemberCount(familyIndex) {
        const family = this.getFamily(familyIndex);
        if (!family || !family.members) return 0;
        return family.members.length;
    }

    // Export data as JSON
    exportDataAsJSON() {
        return JSON.stringify(this.getAllData(), null, 2);
    }

    // Import data from JSON
    importDataFromJSON(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            this.saveAllData(data);
            return true;
        } catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
    }

    // Initialize empty families structure
    initializeFamilies() {
        const data = this.getAllData();
        if (!data.families || data.families.length === 0) {
            data.families = Array.from({ length: 5 }, (_, i) => ({
                familyId: i + 1,
                headName: '',
                contactNumber: '',
                members: []
            }));
            this.saveAllData(data);
        }
    }

    // Delete family data
    deleteFamily(familyIndex) {
        const data = this.getAllData();
        if (data.families && data.families[familyIndex]) {
            data.families[familyIndex] = {
                familyId: familyIndex + 1,
                headName: '',
                contactNumber: '',
                members: []
            };
            this.saveAllData(data);
        }
    }

    // Clear student data
    clearStudentData() {
        const data = this.getAllData();
        data.student = {};
        this.saveAllData(data);
    }
}