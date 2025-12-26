import { createPortal } from 'react-dom'
import type { FamilyMember } from '../../types/family'
import styles from './MemberDetailsModal.module.css'

interface MemberDetailsModalProps {
  member: FamilyMember | null
  onClose: () => void
  partnerOf?: FamilyMember
}

const MemberDetailsModal = ({ member, onClose, partnerOf }: MemberDetailsModalProps) => {
  if (!member) return null

  return createPortal(
    <>
      <div className={styles.backdrop} onClick={onClose} />
      <div
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-label={`Détails pour ${member.prenom} ${member.nom}`}
      >
            <h2 className={styles.title}>
              {member.prenom} {member.nom}
            </h2>
            <p className={styles.subtitle}>
              {partnerOf
                ? `${member.genre === 'homme' ? 'Époux' : 'Épouse'} de ${partnerOf.prenom} ${partnerOf.nom}`
                : `${member.isFamilyHead ? 'Chef de famille' : 'Membre de la lignée'} · ${member.genre === 'homme' ? 'Homme' : 'Femme'}`}
            </p>
            <div className={styles.bio}>
              <p>
                {member.dateNaissance
                  ? `Né(e) le ${new Date(member.dateNaissance).toLocaleDateString('fr-FR')}`
                  : 'Date de naissance inconnue'}
              </p>
              {member.dateDeces ? (
                <p>Décédé(e) le {new Date(member.dateDeces).toLocaleDateString('fr-FR')}</p>
              ) : (
                <p>Encore parmi nous</p>
              )}
            </div>
            {member.bio ? <p className={styles.story}>{member.bio}</p> : null}
            <button className={styles.closeButton} onClick={onClose}>
              Fermer
            </button>
      </div>
    </>,
    document.body,
  )
}

export default MemberDetailsModal
