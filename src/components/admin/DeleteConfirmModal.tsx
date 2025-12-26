import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import styles from './DeleteConfirmModal.module.css'

type TableName = 'family_members' | 'family_relationships' | 'family_unions'

interface DeleteConfirmModalProps {
  targetId: string | null
  targetLabel: string
  table: TableName
  onClose: () => void
}

const DeleteConfirmModal = ({ targetId, targetLabel, table, onClose }: DeleteConfirmModalProps) => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from(table).delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['family-tree'] })
      onClose()
    },
  })

  const handleDelete = () => {
    if (targetId) {
      mutation.mutate(targetId)
    }
  }

  if (!targetId) return null

  return (
    <>
      <div className={styles.backdrop} onClick={onClose} />
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>Confirmer la suppression</h2>
        </div>

        <div className={styles.content}>
          <p>
            Êtes-vous sûr de vouloir supprimer <strong>{targetLabel || 'cet élément'}</strong> ?
          </p>
          <p className={styles.warning}>Cette action est irréversible.</p>

          {mutation.error && (
            <div className={styles.error}>
              Erreur lors de la suppression : {(mutation.error as Error).message}
            </div>
          )}
        </div>

        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onClose} disabled={mutation.isPending}>
            Annuler
          </button>
          <button className={styles.deleteBtn} onClick={handleDelete} disabled={mutation.isPending}>
            {mutation.isPending ? 'Suppression...' : 'Supprimer'}
          </button>
        </div>
      </div>
    </>
  )
}

export default DeleteConfirmModal
