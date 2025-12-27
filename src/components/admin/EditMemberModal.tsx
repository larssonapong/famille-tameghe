import { useState, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import type { FamilyMember } from '../../types/family'
import { uploadMemberPhoto, getPublicMemberPhotoUrl } from '../../utils/uploadMemberPhoto'
import styles from './AddMemberModal.module.css'

interface EditMemberModalProps {
  member: FamilyMember | null
  onClose: () => void
}

const EditMemberModal = ({ member, onClose }: EditMemberModalProps) => {
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    surnom: '',
    photoPath: '',
    genre: 'homme' as 'homme' | 'femme',
    dateNaissance: '',
    dateDeces: '',
    cadreCouleur: '#d1a347',
    generationIndex: 0,
    isFamilyHead: false,
    bio: '',
  })
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState('')

  useEffect(() => {
    if (photoPreview.startsWith('blob:')) {
      return () => URL.revokeObjectURL(photoPreview)
    }
  }, [photoPreview])

  useEffect(() => {
    if (member) {
      setFormData({
        prenom: member.prenom,
        nom: member.nom,
        surnom: member.surnom || '',
        photoPath: member.photoPath ?? '',
        genre: member.genre,
        dateNaissance: member.dateNaissance || '',
        dateDeces: member.dateDeces || '',
        cadreCouleur: member.cadreCouleur || '#d1a347',
        generationIndex: member.generationIndex ?? 0,
        isFamilyHead: member.isFamilyHead || false,
        bio: member.bio || '',
      })
      setPhotoFile(null)
      setPhotoPreview('')
    }
  }, [member])

  const mutation = useMutation({
    mutationFn: async ({
      values,
      file,
    }: {
      values: typeof formData
      file: File | null
    }) => {
      if (!member) return
      let nextPhotoPath: string | null = values.photoPath ? values.photoPath : null
      if (file) {
        nextPhotoPath = await uploadMemberPhoto(file)
      }
      const { error } = await supabase
        .from('family_members')
        .update({
          prenom: values.prenom,
          nom: values.nom,
          surnom: values.surnom || null,
          profile_image_url: nextPhotoPath,
          genre: values.genre,
          date_naissance: values.dateNaissance || null,
          date_deces: values.dateDeces || null,
          cadre_couleur: values.cadreCouleur,
          generation_index: values.generationIndex,
          is_family_head: values.isFamilyHead,
          bio: values.bio || null,
        })
        .eq('id', member.id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['family-tree'] })
      onClose()
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate({ values: formData, file: photoFile })
  }

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null
    setPhotoFile(file)
    if (photoPreview.startsWith('blob:')) {
      URL.revokeObjectURL(photoPreview)
    }
    setPhotoPreview(file ? URL.createObjectURL(file) : '')
  }

  const handleRemovePhoto = () => {
    if (photoPreview.startsWith('blob:')) {
      URL.revokeObjectURL(photoPreview)
    }
    setPhotoPreview('')
    setPhotoFile(null)
    setFormData((prev) => ({ ...prev, photoPath: '' }))
  }

  const currentPhotoUrl = photoPreview || getPublicMemberPhotoUrl(formData.photoPath)

  if (!member) return null

  return (
    <>
      <div className={styles.backdrop} onClick={onClose} />
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>Modifier le membre</h2>
          <button className={styles.closeBtn} onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.row}>
            <div className={styles.field}>
              <label>Nom *</label>
              <input
                type="text"
                required
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              />
            </div>
            <div className={styles.field}>
              <label>Prénom *</label>
              <input
                type="text"
                required
                value={formData.prenom}
                onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label>Surnom</label>
            <input
              type="text"
              value={formData.surnom}
              onChange={(e) => setFormData({ ...formData, surnom: e.target.value })}
            />
          </div>

          <div className={styles.field}>
            <label>Photo</label>
            <div className={styles.photoUpload}>
              <div
                className={styles.photoPreview}
                style={
                  currentPhotoUrl
                    ? { backgroundImage: `url(${currentPhotoUrl})` }
                    : undefined
                }
              >
                {!currentPhotoUrl && <span>?</span>}
              </div>
              <div className={styles.fileInputWrapper}>
                <label className={styles.fileLabel}>
                  Importer une photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                  />
                </label>
                <p className={styles.fieldHint}>PNG ou JPG · max 5Mo</p>
                {(formData.photoPath || photoPreview) && (
                  <button type="button" className={styles.removeChip} onClick={handleRemovePhoto}>
                    Supprimer la photo
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>Genre *</label>
              <select
                value={formData.genre}
                onChange={(e) => setFormData({ ...formData, genre: e.target.value as 'homme' | 'femme' })}
              >
                <option value="homme">Homme</option>
                <option value="femme">Femme</option>
              </select>
            </div>
            <div className={styles.field}>
              <label>Génération</label>
              <input
                type="number"
                min={0}
                value={formData.generationIndex}
                onChange={(e) => setFormData({ ...formData, generationIndex: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>Date de naissance</label>
              <input
                type="date"
                value={formData.dateNaissance}
                onChange={(e) => setFormData({ ...formData, dateNaissance: e.target.value })}
              />
            </div>
            <div className={styles.field}>
              <label>Date de décès</label>
              <input
                type="date"
                value={formData.dateDeces}
                onChange={(e) => setFormData({ ...formData, dateDeces: e.target.value })}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label>Couleur du cadre</label>
            <div className={styles.colorPicker}>
              <label className={styles.colorPreview} style={{ backgroundColor: formData.cadreCouleur }}>
                <input
                  type="color"
                  value={formData.cadreCouleur}
                  onChange={(e) => setFormData({ ...formData, cadreCouleur: e.target.value })}
                />
              </label>
              <span className={styles.colorValue}>{formData.cadreCouleur}</span>
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.checkbox}>
              <input
                type="checkbox"
                checked={formData.isFamilyHead}
                onChange={(e) => setFormData({ ...formData, isFamilyHead: e.target.checked })}
              />
              <span>Chef de famille</span>
            </label>
          </div>

          <div className={styles.field}>
            <label>Biographie</label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            />
          </div>

          {mutation.error && (
            <div className={styles.error}>
              Erreur lors de la modification : {(mutation.error as Error).message}
            </div>
          )}

          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className={styles.submitBtn} disabled={mutation.isPending}>
              {mutation.isPending ? 'Modification...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

export default EditMemberModal
