import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import type { FamilyMember } from '../../types/family'
import type { Database } from '../../types/database'
import styles from './AddMemberModal.module.css'

interface AddUnionModalProps {
  isOpen: boolean
  onClose: () => void
  members: FamilyMember[]
}

const AddUnionModal = ({ isOpen, onClose, members }: AddUnionModalProps) => {
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState({
    partenaireAId: '',
    partenaireBId: '',
    typeRelation: 'mariage' as 'mariage' | 'divorce' | 'union_libre',
    notes: '',
  })

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const payload: Database['public']['Tables']['family_unions']['Insert'] = {
        partenaire_a_id: data.partenaireAId,
        partenaire_b_id: data.partenaireBId,
        type_relation: data.typeRelation,
        notes: data.notes || null,
      }

      const { error } = await supabase.from('family_unions').insert(payload)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['family-tree'] })
      onClose()
      setFormData({
        partenaireAId: '',
        partenaireBId: '',
        typeRelation: 'mariage',
        notes: '',
      })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.partenaireAId === formData.partenaireBId) {
      alert('Un membre ne peut pas être en union avec lui-même')
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
          <h2 className={styles.title}>Ajouter une union</h2>
          <button className={styles.closeBtn} onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label>Premier membre *</label>
            <select
              required
              value={formData.partenaireAId}
              onChange={(e) => setFormData({ ...formData, partenaireAId: e.target.value })}
            >
              <option value="">Sélectionner un membre</option>
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.prenom} {member.nom}
                  {member.surnom ? ` (${member.surnom})` : ''}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label>Deuxième membre *</label>
            <select
              required
              value={formData.partenaireBId}
              onChange={(e) => setFormData({ ...formData, partenaireBId: e.target.value })}
            >
              <option value="">Sélectionner un membre</option>
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.prenom} {member.nom}
                  {member.surnom ? ` (${member.surnom})` : ''}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label>Type d'union</label>
            <select
              value={formData.typeRelation}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  typeRelation: e.target.value as 'mariage' | 'divorce' | 'union_libre',
                })
              }
            >
              <option value="mariage">Mariage</option>
              <option value="union_libre">Union libre</option>
              <option value="divorce">Divorce / Séparation</option>
            </select>
          </div>

          <div className={styles.field}>
            <label>Notes</label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
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

export default AddUnionModal
