import { useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import type { FamilyMember, FamilyUnion } from '../../types/family'
import styles from './MemberDetailsModal.module.css'

interface MemberDetailsModalProps {
  member: FamilyMember | null
  onClose: () => void
  unions?: Array<{
    partner: FamilyMember | null | undefined
    union: FamilyUnion
  }>
  isLineageMember?: boolean
}

const MemberDetailsModal = ({ member, onClose, unions, isLineageMember }: MemberDetailsModalProps) => {
  if (!member) return null
  const [isPhotoOpen, setIsPhotoOpen] = useState(false)

  const initials = `${member.nom?.[0] ?? ''}${member.prenom?.[0] ?? ''}`.trim().toUpperCase()
  const unionStatusParts = useMemo(() => {
    if (!unions?.length) return []

    const toTimestamp = (value?: string | null) => (value ? new Date(value).getTime() : Number.MAX_SAFE_INTEGER)

    return [...unions]
      .sort((a, b) => toTimestamp(a.union.dateDebut) - toTimestamp(b.union.dateDebut))
      .map(({ union, partner }) => {
        const partnerName = partner ? `${partner.nom} ${partner.prenom}` : 'Partenaire inconnu'
        switch (union.typeRelation) {
          case 'mariage':
            return `${member.genre === 'homme' ? 'Époux' : 'Épouse'} de ${partnerName}`
          case 'divorce':
            return `${member.genre === 'homme' ? 'Divorcé' : 'Divorcée'} avec ${partnerName}`
          case 'union_libre':
            return `En union libre avec ${partnerName}`
          default:
            return partnerName
        }
      })
  }, [member.genre, unions])

  const relationshipLabelBase = member.isFamilyHead ? 'Chef de famille' : isLineageMember ? 'Membre de la lignée' : ''
  const relationshipLabelParts = relationshipLabelBase ? [relationshipLabelBase, ...unionStatusParts] : unionStatusParts
  const relationshipLabel = relationshipLabelParts.filter(Boolean).join(' · ')

  const birthText = member.dateNaissance
    ? `Né(e) le ${new Date(member.dateNaissance).toLocaleDateString('fr-FR')}`
    : 'Date de naissance inconnue'

  const deathText = member.dateDeces
    ? `Décédé(e) le ${new Date(member.dateDeces).toLocaleDateString('fr-FR')}`
    : 'Encore parmi nous'

  return createPortal(
    <>
      <div className={styles.backdrop} onClick={onClose} />
      <div
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-label={`Détails pour ${member.nom} ${member.prenom}`}
      >
        <div className={styles.card}>
          <div className={styles.hero}>
            <div
              className={`${styles.avatar} ${member.photoUrl ? styles.avatarHasPhoto : ''}`}
              style={member.photoUrl ? { backgroundImage: `url(${member.photoUrl})` } : undefined}
              role={member.photoUrl ? 'button' : undefined}
              tabIndex={member.photoUrl ? 0 : undefined}
              onClick={() => {
                if (member.photoUrl) setIsPhotoOpen(true)
              }}
              onKeyDown={(event) => {
                if (!member.photoUrl) return
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  setIsPhotoOpen(true)
                }
              }}
              aria-label={member.photoUrl ? 'Agrandir la photo du membre' : undefined}
            >
              {!member.photoUrl && <span>{initials || '?'}</span>}
            </div>
          </div>
          <div className={styles.content}>
            <div className={styles.heading}>
              <h2 className={styles.title}>
                {member.nom} {member.prenom}
              </h2>
              <p className={styles.subtitle}>{relationshipLabel}</p>
            </div>

            <div className={styles.meta}>
              <div className={styles.metaCard}>
                <span className={styles.metaLabel}>Naissance</span>
                <p>{birthText}</p>
              </div>
              <div className={styles.metaCard}>
                <span className={styles.metaLabel}>Statut</span>
                <p>{deathText}</p>
              </div>
            </div>

            {member.bio ? <p className={styles.story}>{member.bio}</p> : null}

            <button className={styles.closeButton} onClick={onClose}>
              Fermer
            </button>
          </div>
        </div>
      </div>
      {member.photoUrl && isPhotoOpen ? (
        <div
          className={styles.photoViewerBackdrop}
          role="presentation"
          onClick={() => setIsPhotoOpen(false)}
          aria-hidden="true"
        >
          <div
            className={styles.photoViewer}
            role="dialog"
            aria-modal="true"
            aria-label={`Photo de ${member.nom} ${member.prenom}`}
            onClick={(event) => event.stopPropagation()}
          >
            <img src={member.photoUrl} alt={`${member.nom} ${member.prenom}`} />
            <button className={styles.photoViewerClose} onClick={() => setIsPhotoOpen(false)}>
              Fermer
            </button>
          </div>
        </div>
      ) : null}
    </>,
    document.body,
  )
}

export default MemberDetailsModal
