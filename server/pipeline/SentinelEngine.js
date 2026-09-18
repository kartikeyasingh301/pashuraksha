'use strict';

/**
 * Pashuraksha Sentinel Engine
 * Deterministic Intelligence augmentation for SIH 2026 Prototype
 */
function calculateRiskSignal(incident) {
  const syndrome = incident.syndrome || incident.disease || 'Unknown';
  let score = 40;
  let riskLevel = 'ROUTINE';
  let dna = { clinical: 40, temporal: 30, spatial: 20, preventive: 50, movement: 10, historical: 10 };
  let reasons = ["Routine surveillance baseline"];
  let actions = [{ action: "Monitor", reason: "Standard protocol", type: "VIEW" }];

  if (syndrome === 'FMD') {
    score = 84;
    riskLevel = 'HIGH';
    dna = { clinical: 90, temporal: 80, spatial: 88, preventive: 70, movement: 60, historical: 72 };
    reasons = [
      "Rapid reporting growth in affected villages",
      "Geographic clustering matches contagious transmission",
      "Compatible clinical symptoms (Blisters, Salivation)",
      "Vaccination gaps identified in target radius"
    ];
    actions = [
      { action: "Assign Field Investigation", reason: "Verify clinical signs and collect samples", type: "ASSIGN" },
      { action: "Issue Area Advisory", reason: "Alert farmers within 10km of cluster", type: "ADVISORY" },
      { action: "Deploy Ring Vaccination", reason: "Prevent outward spread from epicenters", type: "DISPATCH" }
    ];
  } else if (syndrome === 'PPR') {
    score = 92;
    riskLevel = 'CRITICAL';
    dna = { clinical: 95, temporal: 85, spatial: 90, preventive: 60, movement: 70, historical: 65 };
    reasons = [
      "High mortality reported in small ruminants",
      "Critical symptom combination (Diarrhea + Respiratory)",
      "Spreading fast across neighboring flocks"
    ];
    actions = [
      { action: "Immediate Quarantine", reason: "Stop movement of animals to local markets", type: "DISPATCH" },
      { action: "Collect Swabs", reason: "Send samples for RT-PCR confirmation", type: "ASSIGN" }
    ];
  } else if (syndrome === 'BQ' || syndrome === 'Anthrax') {
    score = 98;
    riskLevel = 'CRITICAL';
    dna = { clinical: 98, temporal: 90, spatial: 50, preventive: 80, movement: 20, historical: 85 };
    reasons = [
      "Sudden death reported",
      "Zoonotic potential (Anthrax)",
      "Requires immediate environmental containment"
    ];
    actions = [
      { action: "Dispatch Hazmat Response", reason: "Do not open carcasses", type: "DISPATCH" },
      { action: "Notify Public Health", reason: "Zoonotic exposure risk", type: "ESCALATE" }
    ];
  }

  // Calculate Operational Priority & SLA
  const timeBasis = incident.suspected_at || incident.detected_at || incident.created_at || new Date().toISOString();
  const hoursSince = (new Date() - new Date(timeBasis)) / 3600000;
  
  let slaTotal = 24;
  if (riskLevel === 'CRITICAL') slaTotal = 4;
  else if (riskLevel === 'HIGH') slaTotal = 12;

  let slaRemaining = slaTotal - hoursSince;
  
  let priority = score;
  if (slaRemaining < 2) priority += (2 - slaRemaining) * 5; 
  if (priority > 99) priority = 99;

  return {
    signal_score: Math.floor(priority),
    risk_level: riskLevel,
    outbreak_dna: dna,
    reasons,
    next_best_actions: actions,
    sla_hours_remaining: Math.max(-99, Math.floor(slaRemaining)),
    sla_state: slaRemaining < 0 ? 'BREACHED' : slaRemaining < (slaTotal * 0.25) ? 'AT RISK' : 'SAFE'
  };
}

function augmentWithSentinel(item) {
    if(!item) return item;
    return { ...item, sentinel: calculateRiskSignal(item) };
}

module.exports = { augmentWithSentinel };
