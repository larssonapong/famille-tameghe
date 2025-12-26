import { useMemo, useState } from 'react'
import WelcomeLoader from '../components/loader/WelcomeLoader'
import FamilyTreeCanvas from '../components/tree/FamilyTreeCanvas'
import MemberDetailsModal from '../components/tree/MemberDetailsModal'
import { useFamilyTreeData } from '../hooks/useFamilyTreeData'
import type { FamilyMember, FamilyTreePayload } from '../types/family'

const FamilyTreePage = () => {
  const { data, isLoading, error } = useFamilyTreeData()
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null)
  const [partnerContext, setPartnerContext] = useState<FamilyMember | undefined>(undefined)

  const treeData: FamilyTreePayload | null = useMemo(() => {
    if (!data) return null
    return data
  }, [data])

  const handleSelectMember = (member: FamilyMember, isPartnerOf?: FamilyMember) => {
    setSelectedMember(member)
    setPartnerContext(isPartnerOf)
  }

  return (
    <>
      <WelcomeLoader />

      <section className="heroSection">
        <p className="heroEyebrow">Chronique Bamougoum</p>
        <h1 className="heroTitle">Famille Tameghe</h1>
        <p className="heroSubtitle">
          Une passerelle vivante entre les ancêtres, les patriarches et les enfants éparpillés aux
          quatre coins du monde. Chaque lien, chaque union et chaque naissance trouve ici sa place.
        </p>
      </section>

      <section className="treeShell">
        <div className="treeShellHeading">
          <div>
            <h2>Arbre généalogique</h2>
            <p>
              Visualisez l’ensemble de la lignée. Cliquez sur un cadre pour afficher la fiche du
              membre sélectionné.
            </p>
          </div>
        </div>
        <div className="treeViewport treeViewportImmersive">
          {isLoading ? (
            <SkeletonTreeGrid />
          ) : error ? (
            <ErrorState message={error.message} />
          ) : treeData && treeData.members.length > 0 ? (
            <FamilyTreeCanvas data={treeData} generationFilter="all" onSelectMember={handleSelectMember} />
          ) : (
            <EmptyState />
          )}
        </div>
      </section>

      <MemberDetailsModal
        member={selectedMember}
        onClose={() => {
          setSelectedMember(null)
          setPartnerContext(undefined)
        }}
        partnerOf={partnerContext}
      />
    </>
  )
}

const SkeletonTreeGrid = () => (
  <div
    style={{
      height: '100%',
      display: 'grid',
      placeItems: 'center',
      color: 'rgba(31,42,36,0.6)',
      fontWeight: 600,
    }}
  >
    Chargement de l’arbre familial…
  </div>
)

const ErrorState = ({ message }: { message: string }) => (
  <div
    style={{
      height: '100%',
      display: 'grid',
      placeItems: 'center',
      color: '#b23b3b',
      fontWeight: 600,
      textAlign: 'center',
    }}
  >
    <div>
      <p>Impossible de récupérer les données.</p>
      <p>{message}</p>
    </div>
  </div>
)

const EmptyState = () => (
  <div
    style={{
      height: '100%',
      display: 'grid',
      placeItems: 'center',
      color: 'rgba(31,42,36,0.6)',
      fontWeight: 600,
      textAlign: 'center',
      padding: '2rem',
    }}
  >
    <div>
      <p style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Aucun membre dans l'arbre familial</p>
      <p style={{ fontWeight: 400, color: 'rgba(31,42,36,0.5)' }}>
        Connectez-vous au panneau d'administration pour ajouter des membres.
      </p>
    </div>
  </div>
)

export default FamilyTreePage
