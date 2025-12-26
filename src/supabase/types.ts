export interface Database {
  public: {
    Tables: {
      members: {
        Row: {
          id: string
          prenom: string
          nom: string
          surnom: string | null
          date_naissance: string | null
          date_deces: string | null
          genre: 'homme' | 'femme'
          photo_url: string | null
          bio: string | null
          cadre_couleur: string | null
          generation_index: number | null
          is_family_head: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          prenom: string
          nom: string
          surnom?: string | null
          date_naissance?: string | null
          date_deces?: string | null
          genre: 'homme' | 'femme'
          photo_url?: string | null
          bio?: string | null
          cadre_couleur?: string | null
          generation_index?: number | null
          is_family_head?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['members']['Insert']>
        Relationships: []
      }
      relationships: {
        Row: {
          id: string
          parent_id: string
          enfant_id: string
          type_relation: 'biologique' | 'adoptif' | 'alliance'
          created_at: string
        }
        Insert: {
          id?: string
          parent_id: string
          enfant_id: string
          type_relation: 'biologique' | 'adoptif' | 'alliance'
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['relationships']['Insert']>
        Relationships: []
      }
      unions: {
        Row: {
          id: string
          partenaire_a_id: string
          partenaire_b_id: string
          date_debut: string | null
          date_fin: string | null
          type_relation: 'mariage' | 'concubinage' | 'divorce' | 'separation'
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          partenaire_a_id: string
          partenaire_b_id: string
          date_debut?: string | null
          date_fin?: string | null
          type_relation: 'mariage' | 'concubinage' | 'divorce' | 'separation'
          notes?: string | null
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['unions']['Insert']>
        Relationships: []
      }
    }
  }
}
