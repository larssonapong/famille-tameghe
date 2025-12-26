import styles from './GenerationLegend.module.css'

const legendItems = [
  {
    label: 'Chef de famille',
    color: '#d1a347',
    description: 'Ancêtres fondateurs et gardiens de la mémoire',
  },
  {
    label: 'Oncles & tantes',
    color: '#1d7c83',
    description: 'Deuxième génération, relais des traditions',
  },
  {
    label: 'Petits-enfants',
    color: '#e06a4e',
    description: 'Génération actuelle dispersée dans le monde',
  },
  {
    label: 'Arrière-petits-enfants',
    color: '#b498e6',
    description: 'Jeunes pousses, futur de la lignée',
  },
]

const GenerationLegend = () => {
  return (
    <div className={styles.legend}>
      <p className={styles.legendTitle}>Couleurs des cadres</p>
      <div className={styles.legendItems}>
        {legendItems.map((item) => (
          <div key={item.label} className={styles.legendItem}>
            <span
              className={styles.swatch}
              style={{ backgroundColor: item.color, boxShadow: `0 0 0 1px ${item.color}` }}
            />
            <div>
              <p className={styles.label}>{item.label}</p>
              <p className={styles.description}>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default GenerationLegend
