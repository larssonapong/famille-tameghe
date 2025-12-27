export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      family_members: {
        Row: {
          id: string
          prenom: string
          nom: string
          surnom: string | null
          genre: 'homme' | 'femme'
          date_naissance: string | null
          date_deces: string | null
          cadre_couleur: string | null
          generation_index: number | null
          is_family_head: boolean
          bio: string | null
          profile_image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          prenom: string
          nom: string
          surnom?: string | null
          genre: 'homme' | 'femme'
          date_naissance?: string | null
          date_deces?: string | null
          cadre_couleur?: string | null
          generation_index?: number | null
          is_family_head?: boolean
          bio?: string | null
          profile_image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          prenom?: string
          nom?: string
          surnom?: string | null
          genre?: 'homme' | 'femme'
          date_naissance?: string | null
          date_deces?: string | null
          cadre_couleur?: string | null
          generation_index?: number | null
          is_family_head?: boolean
          bio?: string | null
          profile_image_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      family_relationships: {
        Row: {
          id: string
          parent_id: string
          child_id: string
          type_relation: 'biologique' | 'adoption' | 'alliance'
          created_at: string
        }
        Insert: {
          id?: string
          parent_id: string
          child_id: string
          type_relation: 'biologique' | 'adoption' | 'alliance'
          created_at?: string
        }
        Update: {
          id?: string
          parent_id?: string
          child_id?: string
          type_relation?: 'biologique' | 'adoption' | 'alliance'
          created_at?: string
        }
      }
      family_unions: {
        Row: {
          id: string
          partenaire_a_id: string
          partenaire_b_id: string
          type_relation: 'mariage' | 'divorce' | 'union_libre'
          date_debut: string | null
          date_fin: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          partenaire_a_id: string
          partenaire_b_id: string
          type_relation: 'mariage' | 'divorce' | 'union_libre'
          date_debut?: string | null
          date_fin?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          partenaire_a_id?: string
          partenaire_b_id?: string
          type_relation?: 'mariage' | 'divorce' | 'union_libre'
          date_debut?: string | null
          date_fin?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      admin_users: {
        Row: {
          id: string
          email: string
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
