import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import type { FamilyMember } from '../../types/family'
import type { Database } from '../../types/database'
import styles from './AddMemberModal.module.css'

interface AddRelationModalProps {
  isOpen: boolean
  onClose: () => void
  members: FamilyMember[]
}

const relationOptions: { value: Database['public']['Tables']['family_relationships']['Insert']['type_relation']; label: string }[] =
  [
    { value: 'biologique', label: 'Biologique' },
    { value: 'adoption', label: 'Adoptif' },
    { value: 'alliance', label: 'Alliance' },
  ]

const AddRelationModal = ({ isOpen, onClose, members }: AddRelationModalProps) => {
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState({
    parentAId: '',
    parentBId: '',
    childId: '',
    typeRelation: relationOptions[0].value,
  })

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const parents = [data.parentAId, data.parentBId].filter(Boolean)
      if (parents.length === 0) {
        throw new Error('Sélectionnez au moins un parent')
      }

      const payload: Database['public']['Tables']['family_relationships']['Insert'][] = parents.map((parentId) => ({
        parent_id: parentId,
        child_id: data.childId,
        type_relation: data.typeRelation,
      }))

      const { error } = await supabase.from('family_relationships').insert(payload)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['family-tree'] })
      onClose()
      setFormData({
        parentAId: '',
        parentBId: '',
        childId: '',
        typeRelation: 'biologique',
      })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const parents = [formData.parentAId, formData.parentBId]
    if (parents.includes('')) {
      alert('Sélectionnez les deux parents')
      return
    }

    if (formData.parentAId === formData.parentBId) {
      alert('Les parents doivent être deux personnes différentes')
      return
    }

    if (parents.some((parentId) => parentId === formData.childId)) {
      alert('Un membre ne peut pas être son propre parent')
      return
    }
    mutation.mutate(formData)
  }

  if (!isOpen) return null

  return (
    <>
      <div className={styles.backdrop} onClick={onClose} />
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>Ajouter une relation parent-enfant</h2>
          <button className={styles.closeBtn} onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.row}>
            <div className={styles.field}>
              <label>Parent 1 *</label>
              <select
                required
                value={formData.parentAId}
                onChange={(e) => setFormData({ ...formData, parentAId: e.target.value })}
              >
                <option value="">Sélectionner un parent</option>
                {members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.prenom} {member.nom}
                    {member.surnom ? ` (${member.surnom})` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <label>Parent 2 *</label>
              <select
                required
                value={formData.parentBId}
                onChange={(e) => setFormData({ ...formData, parentBId: e.target.value })}
              >
                <option value="">Sélectionner un parent</option>
                {members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.prenom} {member.nom}
                    {member.surnom ? ` (${member.surnom})` : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.field}>
            <label>Enfant *</label>
            <select
              required
              value={formData.childId}
              onChange={(e) => setFormData({ ...formData, childId: e.target.value })}
            >
              <option value="">Sélectionner un enfant</option>
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.prenom} {member.nom}
                  {member.surnom ? ` (${member.surnom})` : ''}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label>Type de relation *</label>
            <select
              value={formData.typeRelation}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  typeRelation: e.target.value as (typeof relationOptions)[number]['value'],
                })
              }
            >
              {relationOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {mutation.error && (
            <div className={styles.error}>
              Erreur lors de l'ajout : {(mutation.error as Error).message}
            </div>
          )}

          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className={styles.submitBtn} disabled={mutation.isPending}>
              {mutation.isPending ? 'Ajout...' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

export default AddRelationModal
