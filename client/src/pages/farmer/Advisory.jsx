import Layout from '../../components/Layout.jsx';

const ADVISORIES = [
  {
    id: 1,
    icon: '🐄',
    title: 'FMD Prevention',
    severity: 'high',
    content: 'Foot-and-Mouth Disease (FMD) spreads rapidly. Vaccinate all cattle and buffalo every 6 months with the recommended polyvalent FMD vaccine. Quarantine new animals for 21 days. Disinfect farm entry/exit points. Report any animals showing blisters, excessive salivation, or lameness immediately.',
    tags: ['Cattle', 'Buffalo', 'Vaccination'],
  },
  {
    id: 2,
    icon: '🐑',
    title: 'PPR in Small Ruminants',
    severity: 'high',
    content: 'Peste des Petits Ruminants (PPR) is highly contagious in goats and sheep. Watch for: fever, nasal discharge, mouth ulcers, severe diarrhea, and pneumonia. Vaccinate all small ruminants annually. Isolate affected animals immediately and report to your nearest animal health center.',
    tags: ['Sheep', 'Goat', 'Critical'],
  },
  {
    id: 3,
    icon: '🦠',
    title: 'Lumpy Skin Disease - Early Warning',
    severity: 'medium',
    content: 'Lumpy Skin Disease (LSD) affects cattle with skin nodules, fever, and nasal discharge. It spreads through insects. Vaccinate cattle with LSD vaccine. Use insect repellents and mosquito nets on animals. Report animals with skin lumps or nodules to your vet immediately.',
    tags: ['Cattle', 'Seasonal', 'Monsoon'],
  },
  {
    id: 4,
    icon: '⚠️',
    title: 'Anthrax Emergency Protocol',
    severity: 'critical',
    content: 'CRITICAL: Anthrax causes sudden death. DO NOT open carcasses of animals that died suddenly — this releases dangerous spores. Bury carcasses deep or burn them. Alert the veterinary department immediately. Annual vaccination with anthrax spore vaccine is mandatory in endemic areas. This is also a human health risk (zoonotic).',
    tags: ['Zoonotic', 'Emergency', 'All Species'],
  },
  {
    id: 5,
    icon: '🛡️',
    title: 'General Biosecurity Tips',
    severity: 'low',
    content: 'Keep animal shelters clean and well-ventilated. Separate sick animals from healthy ones immediately. Wash hands after handling animals. Clean and disinfect equipment regularly. Restrict visitors to your farm. Keep records of vaccinations and treatments. Early reporting saves lives and prevents outbreaks.',
    tags: ['All Species', 'Prevention'],
  },
];

const SEVERITY_COLORS = {
  critical: '#C62828',
  high: '#E65100',
  medium: '#F57F17',
  low: '#2E7D32',
};

export default function Advisory() {
  return (
    <Layout title="Health Advisories">
      <div className="page-content">
        <div className="advisory-header">
          <p className="advisory-intro">
            Important disease prevention guidelines and alerts for livestock farmers in Gujarat.
          </p>
        </div>

        <div className="advisory-list">
          {ADVISORIES.map((adv) => (
            <div
              key={adv.id}
              className="advisory-card card"
              style={{ borderLeft: '4px solid ' + SEVERITY_COLORS[adv.severity] }}
            >
              <div className="advisory-card-header">
                <span className="advisory-icon">{adv.icon}</span>
                <div className="advisory-card-title-group">
                  <h3 className="advisory-card-title">{adv.title}</h3>
                  <span className="advisory-severity" style={{ color: SEVERITY_COLORS[adv.severity] }}>
                    {adv.severity.toUpperCase()}
                  </span>
                </div>
              </div>
              <p className="advisory-content">{adv.content}</p>
              <div className="advisory-tags">
                {adv.tags.map((tag) => (
                  <span key={tag} className="advisory-tag">{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="advisory-footer card">
          <strong>📞 Emergency Contact</strong>
          <p>If you suspect a disease outbreak, contact your nearest Veterinary Dispensary or call the Animal Husbandry helpline immediately. Early action prevents spread and saves animals.</p>
        </div>
      </div>
    </Layout>
  );
}