import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { FamilyTreePayload } from '../types/family'

const FAMILY_TREE_QUERY_KEY = ['family-tree']

async function fetchFamilyTree(): Promise<FamilyTreePayload> {
  const { data: members, error: membersError } = await supabase
    .from('family_members')
    .select('*')
    .order('generation_index', { ascending: true })

  if (membersError) throw membersError

  const { data: relationships, error: relationshipsError } = await supabase
    .from('family_relationships')
    .select('*')

  if (relationshipsError) throw relationshipsError

  const { data: unions, error: unionsError } = await supabase
    .from('family_unions')
    .select('*')

  if (unionsError) throw unionsError

  return {
    members: (members || []).map((row) => ({
      id: row.id,
      prenom: row.prenom,
      nom: row.nom,
      surnom: row.surnom ?? undefined,
      dateNaissance: row.date_naissance ?? undefined,
      dateDeces: row.date_deces ?? undefined,
      genre: row.genre,
      bio: row.bio ?? undefined,
      cadreCouleur: row.cadre_couleur ?? undefined,
      generationIndex: row.generation_index ?? undefined,
      isFamilyHead: row.is_family_head ?? false,
    })),
    relationships: (relationships || []).map((row) => ({
      id: row.id,
      parentId: row.parent_id,
      childId: row.child_id,
      typeRelation: row.type_relation,
    })),
    unions: (unions || []).map((row) => ({
      id: row.id,
      partenaireAId: row.partenaire_a_id,
      partenaireBId: row.partenaire_b_id,
      dateDebut: row.date_debut ?? undefined,
      dateFin: row.date_fin ?? undefined,
      typeRelation: row.type_relation,
      notes: row.notes ?? undefined,
    })),
  }
}

export function useFamilyTreeData(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: FAMILY_TREE_QUERY_KEY,
    queryFn: fetchFamilyTree,
    staleTime: 1000 * 60 * 5,
    enabled: options?.enabled ?? true,
  })
}
