import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, GitBranch, Heart, LogOut, Home } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useFamilyTreeData } from '../hooks/useFamilyTreeData'
import AddMemberModal from '../components/admin/AddMemberModal'
import EditMemberModal from '../components/admin/EditMemberModal'
import DeleteConfirmModal from '../components/admin/DeleteConfirmModal'
import AddRelationModal from '../components/admin/AddRelationModal'
import AddUnionModal from '../components/admin/AddUnionModal'
import styles from './AdminDashboardPage.module.css'

type TabType = 'members' | 'relationships' | 'unions'

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
  const { data, isLoading } = useFamilyTreeData()

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
            onClick={() => setActiveTab('members')}
          >
            <Users size={20} />
            <span>Membres</span>
          </button>
          <button
            className={`${styles.navItem} ${activeTab === 'relationships' ? styles.navItemActive : ''}`}
            onClick={() => setActiveTab('relationships')}
          >
            <GitBranch size={20} />
            <span>Relations</span>
          </button>
          <button
            className={`${styles.navItem} ${activeTab === 'unions' ? styles.navItemActive : ''}`}
            onClick={() => setActiveTab('unions')}
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
                <div className={styles.table}>
                  {activeTab === 'members' && data?.members.map((member) => (
                    <div key={member.id} className={styles.tableRow}>
                      <div className={styles.tableCell}>
                        <strong>{member.nom} {member.prenom}</strong>
                        {member.surnom && <span className={styles.tableMuted}> ({member.surnom})</span>}
                        {member.isFamilyHead && <span className={styles.tableBadge} style={{ marginLeft: '0.5rem' }}>Chef de famille</span>}
                      </div>
                      <div className={styles.tableCell}>
                        <span className={styles.tableBadge}>
                          Génération {member.generationIndex ?? 0}
                        </span>
                      </div>
                      <div className={styles.tableActions}>
                        <button className={styles.actionBtn} onClick={() => setEditingMember(member)}>Modifier</button>
                        <button className={styles.actionBtn} onClick={() => setDeletingMemberId(member.id)}>Supprimer</button>
                      </div>
                    </div>
                  ))}
                  {activeTab === 'relationships' && data?.relationships.map((rel) => {
                    const parent = data.members.find(m => m.id === rel.parentId)
                    const enfant = data.members.find(m => m.id === rel.childId)
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
                  {activeTab === 'unions' && data?.unions.map((union) => {
                    const membre1 = data.members.find(m => m.id === union.partenaireAId)
                    const membre2 = data.members.find(m => m.id === union.partenaireBId)
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
                          <button className={styles.actionBtn} onClick={() => setDeletingUnionId(union.id)}>Supprimer</button>
                        </div>
                      </div>
                    )
                  })}
                </div>
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
