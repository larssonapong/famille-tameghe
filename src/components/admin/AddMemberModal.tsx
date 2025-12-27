import { useEffect, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import type { Database } from '../../types/database'
import { uploadMemberPhoto } from '../../utils/uploadMemberPhoto'
import styles from './AddMemberModal.module.css'

interface AddMemberModalProps {
  isOpen: boolean
  onClose: () => void
}

const AddMemberModal = ({ isOpen, onClose }: AddMemberModalProps) => {
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    surnom: '',
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
    return () => {
      if (photoPreview.startsWith('blob:')) {
        URL.revokeObjectURL(photoPreview)
      }
    }
  }, [photoPreview])

  const mutation = useMutation({
    mutationFn: async ({
      values,
      file,
    }: {
      values: typeof formData
      file: File | null
    }) => {
      let photoPath: string | null = null
      if (file) {
        photoPath = await uploadMemberPhoto(file)
      }

      const payload: Database['public']['Tables']['family_members']['Insert'] = {
        prenom: values.prenom,
        nom: values.nom,
        surnom: values.surnom || null,
        profile_image_url: photoPath,
        genre: values.genre,
        date_naissance: values.dateNaissance || null,
        date_deces: values.dateDeces || null,
        cadre_couleur: values.cadreCouleur,
        generation_index: Number(values.generationIndex),
        is_family_head: values.isFamilyHead,
        bio: values.bio || null,
      }

      const { error } = await supabase.from('family_members').insert(payload)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['family-tree'] })
      onClose()
      setFormData({
        prenom: '',
        nom: '',
        surnom: '',
        genre: 'homme',
        dateNaissance: '',
        dateDeces: '',
        cadreCouleur: '#d1a347',
        generationIndex: 0,
        isFamilyHead: false,
        bio: '',
      })
      setPhotoFile(null)
      setPhotoPreview('')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate({ values: formData, file: photoFile })
  }

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    setPhotoFile(file ?? null)
    if (photoPreview.startsWith('blob:')) {
      URL.revokeObjectURL(photoPreview)
    }
    setPhotoPreview(file ? URL.createObjectURL(file) : '')
  }

  if (!isOpen) return null

  return (
    <>
      <div className={styles.backdrop} onClick={onClose} />
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>Ajouter un membre</h2>
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
                  photoPreview
                    ? { backgroundImage: `url(${photoPreview})` }
                    : undefined
                }
              >
                {!photoPreview && <span>?</span>}
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

export default AddMemberModal
