import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, GitBranch, Heart, LogOut, Home } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useFamilyTreeData } from '../hooks/useFamilyTreeData'
import type { FamilyMember, FamilyUnion } from '../types/family'
import AddMemberModal from '../components/admin/AddMemberModal'
import EditMemberModal from '../components/admin/EditMemberModal'
import DeleteConfirmModal from '../components/admin/DeleteConfirmModal'
import AddRelationModal from '../components/admin/AddRelationModal'
import AddUnionModal from '../components/admin/AddUnionModal'
import EditUnionModal from '../components/admin/EditUnionModal'
import styles from './AdminDashboardPage.module.css'

type TabType = 'members' | 'relationships' | 'unions'
const PAGE_SIZE = 5

const AdminDashboardPage = () => {
  const { user, loading, signOut } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<TabType>('members')
  const [showAddMemberModal, setShowAddMemberModal] = useState(false)
  const [showAddRelationModal, setShowAddRelationModal] = useState(false)
  const [showAddUnionModal, setShowAddUnionModal] = useState(false)
  const [editingMember, setEditingMember] = useState<any>(null)
  const [deletingMemberId, setDeletingMemberId] = useState<string | null>(null)
  const [deletingRelationId, setDeletingRelationId] = useState<string | null>(null)
  const [deletingUnionId, setDeletingUnionId] = useState<string | null>(null)
  const [editingUnion, setEditingUnion] = useState<FamilyUnion | null>(null)
  const [pageByTab, setPageByTab] = useState<Record<TabType, number>>({
    members: 1,
    relationships: 1,
    unions: 1,
  })
  const [searchByTab, setSearchByTab] = useState<Record<TabType, string>>({
    members: '',
    relationships: '',
    unions: '',
  })
  const { data, isLoading } = useFamilyTreeData()

  const toTimestamp = (value?: string) => {
    if (!value) return 0
    const ms = Date.parse(value)
    return Number.isNaN(ms) ? 0 : ms
  }

  const membersFiltered = useMemo(() => {
    if (!data?.members) return []
    const query = searchByTab.members.trim().toLocaleLowerCase()
    if (!query) return data.members
    return data.members.filter((member) => {
      const fullName = `${member.nom} ${member.prenom}`.toLocaleLowerCase()
      const surnom = member.surnom?.toLocaleLowerCase() ?? ''
      const bio = member.bio?.toLocaleLowerCase() ?? ''
      const generation = String(member.generationIndex ?? '')
      return (
        fullName.includes(query) ||
        surnom.includes(query) ||
        bio.includes(query) ||
        generation.includes(query)
      )
    })
  }, [data?.members, searchByTab.members])

  const sortedMembers = useMemo(() => {
    if (!data?.members) return []
    return [...membersFiltered].sort((a, b) => {
      const diff = toTimestamp(b.updatedAt ?? b.createdAt) - toTimestamp(a.updatedAt ?? a.createdAt)
      if (diff !== 0) return diff
      return `${b.nom} ${b.prenom}`.localeCompare(`${a.nom} ${a.prenom}`)
    })
  }, [data?.members, membersFiltered])

  const relationshipsFiltered = useMemo(() => {
    if (!data?.relationships) return []
    const query = searchByTab.relationships.trim().toLocaleLowerCase()
    if (!query) return data.relationships
    return data.relationships.filter((relationship) => {
      const parent = data.members.find((member) => member.id === relationship.parentId)
      const child = data.members.find((member) => member.id === relationship.childId)
      return (
        (parent && `${parent.nom} ${parent.prenom}`.toLocaleLowerCase().includes(query)) ||
        (child && `${child.nom} ${child.prenom}`.toLocaleLowerCase().includes(query)) ||
        relationship.typeRelation.toLocaleLowerCase().includes(query)
      )
    })
  }, [data?.relationships, data?.members, searchByTab.relationships])

  const sortedRelationships = useMemo(() => {
    if (!data?.relationships) return []
    return [...relationshipsFiltered].sort(
      (a, b) => toTimestamp(b.createdAt) - toTimestamp(a.createdAt),
    )
  }, [data?.relationships, relationshipsFiltered])

  const unionsFiltered = useMemo(() => {
    if (!data?.unions) return []
    const query = searchByTab.unions.trim().toLocaleLowerCase()
    if (!query) return data.unions
    return data.unions.filter((union) => {
      const partenaireA = data.members.find((member) => member.id === union.partenaireAId)
      const partenaireB = data.members.find((member) => member.id === union.partenaireBId)
      return (
        (partenaireA && `${partenaireA.nom} ${partenaireA.prenom}`.toLocaleLowerCase().includes(query)) ||
        (partenaireB && `${partenaireB.nom} ${partenaireB.prenom}`.toLocaleLowerCase().includes(query)) ||
        (union.notes?.toLocaleLowerCase().includes(query) ?? false) ||
        union.typeRelation.toLocaleLowerCase().includes(query)
      )
    })
  }, [data?.unions, data?.members, searchByTab.unions])

  const sortedUnions = useMemo(() => {
    if (!data?.unions) return []
    return [...unionsFiltered].sort((a, b) => {
      const diff = toTimestamp(b.updatedAt ?? b.createdAt) - toTimestamp(a.updatedAt ?? a.createdAt)
      if (diff !== 0) return diff
      return (b.notes ?? '').localeCompare(a.notes ?? '')
    })
  }, [data?.unions, unionsFiltered])

  const memberById = useMemo(() => {
    const map = new Map<string, FamilyMember>()
    ;(data?.members ?? []).forEach((member) => map.set(member.id, member))
    return map
  }, [data?.members])

  const getTotalPages = (length: number) => Math.max(1, Math.ceil(length / PAGE_SIZE) || 1)

  const membersTotalPages = getTotalPages(sortedMembers.length)
  const relationshipsTotalPages = getTotalPages(sortedRelationships.length)
  const unionsTotalPages = getTotalPages(sortedUnions.length)

  const currentMembersPage = Math.min(pageByTab.members, membersTotalPages)
  const currentRelationshipsPage = Math.min(pageByTab.relationships, relationshipsTotalPages)
  const currentUnionsPage = Math.min(pageByTab.unions, unionsTotalPages)

  const paginate = <T,>(items: T[], page: number) => {
    const start = (page - 1) * PAGE_SIZE
    return items.slice(start, start + PAGE_SIZE)
  }

  const paginatedMembers = paginate(sortedMembers, currentMembersPage)
  const paginatedRelationships = paginate(sortedRelationships, currentRelationshipsPage)
  const paginatedUnions = paginate(sortedUnions, currentUnionsPage)

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab)
    setPageByTab((prev) => ({ ...prev, [tab]: 1 }))
  }

  const handleSearchChange = (tab: TabType, value: string) => {
    setSearchByTab((prev) => ({ ...prev, [tab]: value }))
    setPageByTab((prev) => ({ ...prev, [tab]: 1 }))
  }

  const handlePageChange = (tab: TabType, direction: 'prev' | 'next', totalPages: number) => {
    setPageByTab((prev) => {
      const safeCurrent = Math.min(prev[tab], totalPages)
      const nextPage =
        direction === 'prev'
          ? Math.max(1, safeCurrent - 1)
          : Math.min(totalPages, safeCurrent + 1)
      return { ...prev, [tab]: nextPage }
    })
  }

  const renderPagination = (tab: TabType, currentPage: number, totalPages: number) => {
    if (totalPages <= 1) return null
    return (
      <div className={styles.pagination}>
        <button
          type="button"
          className={styles.paginationButton}
          onClick={() => handlePageChange(tab, 'prev', totalPages)}
          disabled={currentPage === 1}
        >
          Précédent
        </button>
        <span className={styles.paginationInfo}>
          Page {currentPage} / {totalPages}
        </span>
        <button
          type="button"
          className={styles.paginationButton}
          onClick={() => handlePageChange(tab, 'next', totalPages)}
          disabled={currentPage === totalPages}
        >
          Suivant
        </button>
      </div>
    )
  }

  useEffect(() => {
    if (!loading && !user) {
      navigate('/admin', { replace: true })
    }
  }, [user, loading, navigate])

  const handleLogout = async () => {
    try {
      await signOut()
      navigate('/admin', { replace: true })
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  if (loading) {
    return <div className={styles.loading}>Chargement...</div>
  }

  if (!user) {
    return null
  }

  if (!data) {
    return <div className={styles.loading}>Impossible de charger les données.</div>
  }

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2 className={styles.sidebarTitle}>Admin</h2>
          <p className={styles.sidebarSubtitle}>Famille Tameghe</p>
        </div>

        <nav className={styles.nav}>
          <button
            className={`${styles.navItem} ${activeTab === 'members' ? styles.navItemActive : ''}`}
            onClick={() => handleTabChange('members')}
          >
            <Users size={20} />
            <span>Membres</span>
          </button>
          <button
            className={`${styles.navItem} ${activeTab === 'relationships' ? styles.navItemActive : ''}`}
            onClick={() => handleTabChange('relationships')}
          >
            <GitBranch size={20} />
            <span>Relations</span>
          </button>
          <button
            className={`${styles.navItem} ${activeTab === 'unions' ? styles.navItemActive : ''}`}
            onClick={() => handleTabChange('unions')}
          >
            <Heart size={20} />
            <span>Unions</span>
          </button>
        </nav>

        <div className={styles.sidebarFooter}>
          <button className={styles.navItem} onClick={() => navigate('/')}>
            <Home size={20} />
            <span>Retour au site</span>
          </button>
          <button className={styles.logoutButton} onClick={handleLogout}>
            <LogOut size={20} />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      <main className={styles.main}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>
              {activeTab === 'members' && 'Gestion des membres'}
              {activeTab === 'relationships' && 'Gestion des relations'}
              {activeTab === 'unions' && 'Gestion des unions'}
            </h1>
            <p className={styles.subtitle}>
              {activeTab === 'members' && 'Ajoutez, modifiez ou supprimez les membres de la famille'}
              {activeTab === 'relationships' && 'Gérez les liens parent-enfant'}
              {activeTab === 'unions' && 'Gérez les mariages et unions'}
            </p>
          </div>
        </header>

        <div className={styles.content}>
          {isLoading ? (
            <div className={styles.loading}>Chargement des données...</div>
          ) : (
            <>
              {activeTab === 'members' && (
                <div className={styles.stats}>
                  <div className={styles.statCard}>
                    <div className={styles.statValue}>{data?.members.length || 0}</div>
                    <div className={styles.statLabel}>Membres totaux</div>
                  </div>
                  <div className={styles.statCard}>
                    <div className={styles.statValue}>{data?.unions.length || 0}</div>
                    <div className={styles.statLabel}>Unions</div>
                  </div>
                  <div className={styles.statCard}>
                    <div className={styles.statValue}>{data?.relationships.length || 0}</div>
                    <div className={styles.statLabel}>Relations</div>
                  </div>
                </div>
              )}

              <div className={styles.panel}>
                <div className={styles.panelHeader}>
                  <h2 className={styles.panelTitle}>
                    {activeTab === 'members' && 'Liste des membres'}
                    {activeTab === 'relationships' && 'Liste des relations'}
                    {activeTab === 'unions' && 'Liste des unions'}
                  </h2>
                  <div className={styles.panelActions}>
                    <div className={styles.searchWrapper}>
                      <input
                        type="text"
                        className={styles.searchInput}
                        placeholder={
                          activeTab === 'members'
                            ? 'Rechercher un membre'
                            : activeTab === 'relationships'
                              ? 'Rechercher une relation'
                              : 'Rechercher une union'
                        }
                        value={searchByTab[activeTab]}
                        onChange={(event) => handleSearchChange(activeTab, event.target.value)}
                      />
                    </div>
                    <button
                      className={styles.addButton}
                      onClick={() => {
                        if (activeTab === 'members') setShowAddMemberModal(true)
                        if (activeTab === 'relationships') setShowAddRelationModal(true)
                        if (activeTab === 'unions') setShowAddUnionModal(true)
                      }}
                    >
                      + Ajouter
                    </button>
                  </div>
                </div>
                <div className={styles.table}>
                  {activeTab === 'members' &&
                    paginatedMembers.map((member) => (
                      <div key={member.id} className={styles.tableRow}>
                        <div className={styles.tableCell}>
                          <strong>
                            {member.nom} {member.prenom}
                          </strong>
                          {member.surnom && <span className={styles.tableMuted}> ({member.surnom})</span>}
                          {member.isFamilyHead ? (
                            <span className={styles.tableBadge} style={{ marginLeft: '0.5rem' }}>
                              Chef de famille
                            </span>
                          ) : null}
                        </div>
                        <div className={styles.tableCell}>
                          <span className={styles.tableBadge}>Génération {member.generationIndex ?? 0}</span>
                        </div>
                        <div className={styles.tableActions}>
                          <button className={styles.actionBtn} onClick={() => setEditingMember(member)}>
                            Modifier
                          </button>
                          <button className={styles.actionBtn} onClick={() => setDeletingMemberId(member.id)}>
                            Supprimer
                          </button>
                        </div>
                      </div>
                    ))}
                  {activeTab === 'relationships' && paginatedRelationships.map((rel) => {
                    const parent = memberById.get(rel.parentId)
                    const enfant = memberById.get(rel.childId)
                    return (
                      <div key={rel.id} className={styles.tableRow}>
                        <div className={styles.tableCell}>
                          <strong>{parent?.nom} {parent?.prenom}</strong>
                          <span className={styles.tableMuted}> → </span>
                          <strong>{enfant?.nom} {enfant?.prenom}</strong>
                        </div>
                        <div className={styles.tableCell}>
                          <span className={styles.tableBadge}>{rel.typeRelation}</span>
                        </div>
                        <div className={styles.tableActions}>
                          <button className={styles.actionBtn} onClick={() => setDeletingRelationId(rel.id)}>Supprimer</button>
                        </div>
                      </div>
                    )
                  })}
                  {activeTab === 'unions' && paginatedUnions.map((union) => {
                    const membre1 = memberById.get(union.partenaireAId)
                    const membre2 = memberById.get(union.partenaireBId)
                    return (
                      <div key={union.id} className={styles.tableRow}>
                        <div className={styles.tableCell}>
                          <strong>{membre1?.nom} {membre1?.prenom}</strong>
                          <span className={styles.tableMuted}> ♥ </span>
                          <strong>{membre2?.nom} {membre2?.prenom}</strong>
                        </div>
                        <div className={styles.tableCell}>
                          {union.dateDebut && <span className={styles.tableMuted}>Depuis {new Date(union.dateDebut).getFullYear()}</span>}
                        </div>
                        <div className={styles.tableActions}>
                          <button className={styles.actionBtn} onClick={() => setEditingUnion(union)}>
                            Modifier
                          </button>
                          <button className={styles.actionBtn} onClick={() => setDeletingUnionId(union.id)}>
                            Supprimer
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
                {activeTab === 'members' && renderPagination('members', currentMembersPage, membersTotalPages)}
                {activeTab === 'relationships' &&
                  renderPagination('relationships', currentRelationshipsPage, relationshipsTotalPages)}
                {activeTab === 'unions' && renderPagination('unions', currentUnionsPage, unionsTotalPages)}
              </div>
            </>
          )}
        </div>
      </main>

      <AddMemberModal 
        isOpen={showAddMemberModal} 
        onClose={() => setShowAddMemberModal(false)} 
      />

      <EditMemberModal 
        member={editingMember} 
        onClose={() => setEditingMember(null)} 
      />

      <DeleteConfirmModal 
        targetId={deletingMemberId}
        targetLabel={
          deletingMemberId 
            ? `${data?.members.find(m => m.id === deletingMemberId)?.nom ?? ''} ${data?.members.find(m => m.id === deletingMemberId)?.prenom ?? ''}`.trim() || 'ce membre'
            : ''
        }
        table="family_members"
        onClose={() => setDeletingMemberId(null)} 
      />

      <AddRelationModal 
        isOpen={showAddRelationModal}
        onClose={() => setShowAddRelationModal(false)}
        members={data?.members || []}
      />

      <AddUnionModal 
        isOpen={showAddUnionModal}
        onClose={() => setShowAddUnionModal(false)}
        members={data?.members || []}
      />

      <EditUnionModal
        isOpen={Boolean(editingUnion)}
        union={editingUnion}
        members={data?.members || []}
        onClose={() => setEditingUnion(null)}
      />

      <DeleteConfirmModal 
        targetId={deletingRelationId}
        targetLabel="cette relation"
        table="family_relationships"
        onClose={() => setDeletingRelationId(null)} 
      />

      <DeleteConfirmModal 
        targetId={deletingUnionId}
        targetLabel="cette union"
        table="family_unions"
        onClose={() => setDeletingUnionId(null)} 
      />
    </div>
  )
}

export default AdminDashboardPage
