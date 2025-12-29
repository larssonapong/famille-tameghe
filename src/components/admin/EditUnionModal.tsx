import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import type { FamilyMember, FamilyUnion } from '../../types/family'
import styles from './AddMemberModal.module.css'

interface EditUnionModalProps {
  isOpen: boolean
  union: FamilyUnion | null
  members: FamilyMember[]
  onClose: () => void
}

const EditUnionModal = ({ isOpen, union, members, onClose }: EditUnionModalProps) => {
  const queryClient = useQueryClient()
  const sortedMembers = useMemo(() => {
    return [...members].sort((a, b) => {
      const nameA = `${a.nom} ${a.prenom}`.trim().toLocaleLowerCase()
      const nameB = `${b.nom} ${b.prenom}`.trim().toLocaleLowerCase()
      return nameA.localeCompare(nameB)
    })
  }, [members])

  const [formData, setFormData] = useState({
    partenaireAId: '',
    partenaireBId: '',
    typeRelation: 'mariage' as 'mariage' | 'divorce' | 'union_libre',
    notes: '',
  })

  useEffect(() => {
    if (union) {
      setFormData({
        partenaireAId: union.partenaireAId,
        partenaireBId: union.partenaireBId,
        typeRelation: union.typeRelation,
        notes: union.notes ?? '',
      })
    }
  }, [union])

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (!union) return
      const { error } = await supabase
        .from('family_unions')
        .update({
          partenaire_a_id: data.partenaireAId,
          partenaire_b_id: data.partenaireBId,
          type_relation: data.typeRelation,
          notes: data.notes || null,
        })
        .eq('id', union.id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['family-tree'] })
      handleClose()
    },
  })

  const handleClose = () => {
    onClose()
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!union) return
    if (!formData.partenaireAId || !formData.partenaireBId) {
      alert('Sélectionnez les deux membres')
      return
    }
    if (formData.partenaireAId === formData.partenaireBId) {
      alert('Un membre ne peut pas être en union avec lui-même')
      return
    }
    mutation.mutate(formData)
  }

  if (!isOpen || !union) return null

  return (
    <>
      <div className={styles.backdrop} onClick={handleClose} />
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>Modifier l’union</h2>
          <button className={styles.closeBtn} onClick={handleClose}>
            ×
          </button>
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
              {sortedMembers.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.nom} {member.prenom}
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
              {sortedMembers.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.nom} {member.prenom}
                  {member.surnom ? ` (${member.surnom})` : ''}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label>Type d’union *</label>
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

          {mutation.error ? (
            <div className={styles.error}>Erreur lors de la mise à jour : {(mutation.error as Error).message}</div>
          ) : null}

          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={handleClose} disabled={mutation.isPending}>
              Annuler
            </button>
            <button type="submit" className={styles.submitBtn} disabled={mutation.isPending}>
              {mutation.isPending ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

export default EditUnionModal
