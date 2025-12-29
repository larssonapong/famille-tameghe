import { useMemo, useState } from 'react'
import WelcomeLoader from '../components/loader/WelcomeLoader'
import FamilyTreeCanvas from '../components/tree/FamilyTreeCanvas'
import MemberDetailsModal from '../components/tree/MemberDetailsModal'
import { useFamilyTreeData } from '../hooks/useFamilyTreeData'
import type { FamilyMember, FamilyRelationship, FamilyTreePayload, FamilyUnion } from '../types/family'

const FamilyTreePage = () => {
  const { data, isLoading, error } = useFamilyTreeData()
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null)

  const treeData: FamilyTreePayload | null = useMemo(() => {
    if (!data) return null
    return data
  }, [data])

  const memberById = useMemo(() => {
    const map = new Map<string, FamilyMember>()
    data?.members.forEach((member) => map.set(member.id, member))
    return map
  }, [data?.members])

  const unionsByMember = useMemo(() => {
    const map = new Map<string, Array<{ union: FamilyUnion; partner: FamilyMember | null }>>()
    if (!data?.unions) return map

    data.unions.forEach((union) => {
      const partnerForA = memberById.get(union.partenaireBId) ?? null
      const partnerForB = memberById.get(union.partenaireAId) ?? null

      if (!map.has(union.partenaireAId)) map.set(union.partenaireAId, [])
      map.get(union.partenaireAId)!.push({ union, partner: partnerForA })

      if (!map.has(union.partenaireBId)) map.set(union.partenaireBId, [])
      map.get(union.partenaireBId)!.push({ union, partner: partnerForB })
    })

    return map
  }, [data?.unions, memberById])

  const selectedMemberUnions = selectedMember ? unionsByMember.get(selectedMember.id) ?? [] : undefined
  const lineageMemberIds = useMemo(() => {
    const ids = new Set<string>()
    data?.relationships.forEach((relationship: FamilyRelationship) => {
      ids.add(relationship.childId)
    })
    return ids
  }, [data?.relationships])
  const selectedMemberIsLineage = selectedMember ? lineageMemberIds.has(selectedMember.id) : false

  const handleSelectMember = (member: FamilyMember) => {
    setSelectedMember(member)
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
        }}
        unions={selectedMemberUnions}
        isLineageMember={selectedMemberIsLineage}
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
