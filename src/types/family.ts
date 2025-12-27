export type Gender = 'homme' | 'femme'

export type RelationshipType = 'biologique' | 'adoption' | 'alliance'

export type UnionType = 'mariage' | 'union_libre' | 'divorce'

export interface FamilyMember {
  id: string
  prenom: string
  nom: string
  surnom?: string
  dateNaissance?: string
  dateDeces?: string | null
  genre: Gender
  photoUrl?: string | null
  photoPath?: string | null
  bio?: string
  cadreCouleur?: string
  generationIndex?: number
  isFamilyHead?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface FamilyRelationship {
  id: string
  parentId: string
  childId: string
  typeRelation: RelationshipType
  createdAt?: string
}

export interface FamilyUnion {
  id: string
  partenaireAId: string
  partenaireBId: string
  dateDebut?: string | null
  dateFin?: string | null
  typeRelation: UnionType
  notes?: string
  createdAt?: string
  updatedAt?: string
}

export interface FamilyTreePayload {
  members: FamilyMember[]
  relationships: FamilyRelationship[]
  unions: FamilyUnion[]
}
