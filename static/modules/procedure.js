// ============================================================
//  FORENSIC AUTOPSY ASSISTANT – Guided Procedure Module
// ============================================================

const Procedure = (() => {
    let currentEntry = null;
    let currentStepIdx = 0;
    let completedSteps = new Set();

    function load(entry) {
        currentEntry = entry;
        currentStepIdx = 0;
        completedSteps = new Set();
    }

    function clear() {
        currentEntry = null;
        currentStepIdx = 0;
        completedSteps = new Set();
    }

    function getCurrent() { return currentEntry; }
    function getCurrentStepIdx() { return currentStepIdx; }
    function getSteps() { return currentEntry ? (currentEntry.steps || []) : []; }

    function goNext() {
        const steps = getSteps();
        if (currentStepIdx < steps.length - 1) { currentStepIdx++; return true; }
        return false;
    }

    function goPrev() {
        if (currentStepIdx > 0) { currentStepIdx--; return true; }
        return false;
    }

    function toggleComplete(idx) {
        if (completedSteps.has(idx)) completedSteps.delete(idx);
        else completedSteps.add(idx);
    }

    function isCompleted(idx) { return completedSteps.has(idx); }

    function getProgress() {
        const total = getSteps().length;
        return total ? Math.round((completedSteps.size / total) * 100) : 0;
    }

    return {
        load, clear, getCurrent, getCurrentStepIdx,
        getSteps, goNext, goPrev, toggleComplete, isCompleted, getProgress,
    };
})();

window.Procedure = Procedure;
