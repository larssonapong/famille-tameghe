import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Tree, {
  type RawNodeDatum,
  type CustomNodeElementProps,
  type TreeNodeDatum,
} from 'react-d3-tree'
import type { FamilyMember, FamilyTreePayload } from '../../types/family'
import styles from './FamilyTreeCanvas.module.css'

type GenerationFilter = 'all' | number

type FamilyNodeDatum = RawNodeDatum & {
  member: FamilyMember
  partner?: FamilyMember
  unionId?: string
  unionType?: string
  isUnionNode?: boolean
}

interface FamilyTreeCanvasProps {
  data: FamilyTreePayload
  generationFilter: GenerationFilter
  onSelectMember?: (member: FamilyMember, isPartnerOf?: FamilyMember) => void
}

const defaultTranslate = { x: 0, y: 120 }

const fallbackColors = ['#d1a347', '#1d7c83', '#e06a4e', '#b498e6', '#2f4c3a']

function FamilyTreeCanvas({
  data,
  generationFilter,
  onSelectMember,
}: FamilyTreeCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 960, height: 640 })

  useEffect(() => {
    const resize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        })
      }
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  const treeData = useMemo(() => {
    return buildTreeData(data, generationFilter)
  }, [data, generationFilter])

  const renderNode = useCallback(
    ({ nodeDatum }: CustomNodeElementProps) => {
      const familyNode = nodeDatum as TreeNodeDatum & {
        member: FamilyMember
        partner?: FamilyMember
        unionId?: string
        unionType?: string
        isUnionNode?: boolean
      }
      const member = familyNode.member
      const partner = familyNode.partner
      if (!member) return null

      const ageLabel = buildAgeLabel(member.dateNaissance, member.dateDeces)
      const frameColor =
        member.cadreCouleur ??
        fallbackColors[member.generationIndex ? member.generationIndex % fallbackColors.length : 0]

      const handleSelect = () => onSelectMember?.(member)

      const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          handleSelect()
        }
      }

      const cardHeight = 170
      const cardWidth = 240
      const gap = 50
      const leftX = -(cardWidth + gap / 2)
      const rightX = gap / 2
      const cardY = -cardHeight / 2

      return (
        <g>
          <foreignObject width={cardWidth} height={cardHeight} x={leftX} y={cardY}>
            <div
              role="button"
              tabIndex={0}
              className={styles.nodeCard}
              style={{ borderColor: frameColor }}
              onClick={handleSelect}
              onKeyDown={handleKeyDown}
              aria-label={`Voir ${member.prenom} ${member.nom}`}
            >
              <div className={styles.nodeHeading}>
                <div>
                  <div className={styles.nodeName}>
                    {member.prenom} {member.nom}
                  </div>
                  {member.surnom ? <p className={styles.nodeSurnom}>{member.surnom}</p> : null}
                </div>
                {member.isFamilyHead ? (
                  <span className={styles.nodeBadge}>Chef de famille</span>
                ) : (
                  <span className={styles.nodeBadgeMuted}>{member.genre === 'homme' ? 'Homme' : 'Femme'}</span>
                )}
              </div>
              <div className={styles.nodeMeta}>
                <span>{ageLabel}</span>
                {member.dateNaissance && (
                  <span>
                    {formatDate(member.dateNaissance)}
                    {member.dateDeces ? ` — ${formatDate(member.dateDeces)}` : ''}
                  </span>
                )}
              </div>
            </div>
          </foreignObject>
          {partner ? (
            <>
              <line
                x1={-4}
                y1={0}
                x2={4}
                y2={0}
                className={styles.unionLine}
                aria-hidden="true"
              />
              <foreignObject width={cardWidth} height={cardHeight} x={rightX} y={cardY}>
                <div
                  role="button"
                  tabIndex={0}
                  className={styles.partnerCard}
                  onClick={() => onSelectMember?.(partner, member)}
                  onKeyDown={(event: React.KeyboardEvent<HTMLDivElement>) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      onSelectMember?.(partner, member)
                    }
                  }}
                  aria-label={`Voir ${partner.prenom} ${partner.nom}`}
                >
                  <div className={styles.nodeHeading}>
                    <div>
                      <div className={styles.partnerName}>
                        {partner.prenom} {partner.nom}
                      </div>
                      {partner.surnom ? <p className={styles.nodeSurnom}>{partner.surnom}</p> : null}
                    </div>
                    <span className={styles.nodeBadgeMuted}>
                      {partner.genre === 'homme' ? 'Homme' : 'Femme'}
                    </span>
                  </div>
                  <div className={styles.nodeMeta}>
                    <span>{buildAgeLabel(partner.dateNaissance, partner.dateDeces)}</span>
                    {partner.dateNaissance && (
                      <span>
                        {formatDate(partner.dateNaissance)}
                        {partner.dateDeces ? ` — ${formatDate(partner.dateDeces)}` : ''}
                      </span>
                    )}
                  </div>
                </div>
              </foreignObject>
            </>
          ) : null}
        </g>
      )
    },
    [onSelectMember],
  )

  return (
    <div className={styles.canvasContainer} ref={containerRef}>
      <Tree
        data={treeData}
        translate={{ x: dimensions.width / 2, y: defaultTranslate.y }}
        orientation="vertical"
        zoomable
        pathClassFunc={() => styles.treeLink}
        renderCustomNodeElement={renderNode}
        separation={{ siblings: 3.4, nonSiblings: 2.4 }}
        enableLegacyTransitions
        transitionDuration={400}
        nodeSize={{ x: 260, y: 250 }}
      />
    </div>
  )
}

function buildTreeData(
  payload: FamilyTreePayload,
  generationFilter: GenerationFilter,
): FamilyNodeDatum[] {
  const membersMap = new Map(payload.members.map((member) => [member.id, member]))
  const childrenByUnion = new Map<string, string[]>()
  const parentsByChild = new Map<string, string[]>()
  const unionsByMember = new Map<string, Array<{ unionId: string; partnerId: string; unionType: string }>>()

  payload.unions.forEach((union) => {
    if (!unionsByMember.has(union.partenaireAId)) {
      unionsByMember.set(union.partenaireAId, [])
    }
    unionsByMember.get(union.partenaireAId)!.push({
      unionId: union.id,
      partnerId: union.partenaireBId,
      unionType: union.typeRelation,
    })

    if (!unionsByMember.has(union.partenaireBId)) {
      unionsByMember.set(union.partenaireBId, [])
    }
    unionsByMember.get(union.partenaireBId)!.push({
      unionId: union.id,
      partnerId: union.partenaireAId,
      unionType: union.typeRelation,
    })
  })

  payload.relationships.forEach((relationship) => {
    if (!parentsByChild.has(relationship.childId)) {
      parentsByChild.set(relationship.childId, [])
    }
    parentsByChild.get(relationship.childId)!.push(relationship.parentId)

    const childParents = parentsByChild.get(relationship.childId)!
    if (childParents.length === 2) {
      const union = payload.unions.find(
        (u) =>
          (u.partenaireAId === childParents[0] && u.partenaireBId === childParents[1]) ||
          (u.partenaireAId === childParents[1] && u.partenaireBId === childParents[0]),
      )
      if (union) {
        if (!childrenByUnion.has(union.id)) {
          childrenByUnion.set(union.id, [])
        }
        childrenByUnion.get(union.id)!.push(relationship.childId)
      }
    }
  })

  const roots = payload.members.filter((member) => {
    const hasParent = parentsByChild.has(member.id)
    return !hasParent || member.isFamilyHead
  })

  const uniqueRoots = roots.length ? roots : payload.members.filter((member) => !parentsByChild.has(member.id))

  return uniqueRoots
    .map((member) =>
      buildNodeWithUnions(member.id, membersMap, childrenByUnion, unionsByMember, generationFilter, new Set()),
    )
    .filter((node): node is FamilyNodeDatum => Boolean(node))
}

function buildNodeWithUnions(
  memberId: string,
  membersMap: Map<string, FamilyMember>,
  childrenByUnion: Map<string, string[]>,
  unionsByMember: Map<string, Array<{ unionId: string; partnerId: string; unionType: string }>>,
  generationFilter: GenerationFilter,
  visited: Set<string>,
): FamilyNodeDatum | null {
  const member = membersMap.get(memberId)
  if (!member || visited.has(memberId)) return null

  if (generationFilter !== 'all' && member.generationIndex !== null && member.generationIndex !== undefined) {
    if (member.generationIndex > generationFilter) {
      return null
    }
  }

  visited.add(memberId)
  const unions = unionsByMember.get(member.id) ?? []

  if (unions.length === 0) {
    return {
      name: `${member.prenom} ${member.nom}`,
      member,
      attributes: buildAttributes(member),
      children: [],
    }
  }

  const unionNodes: FamilyNodeDatum[] = unions.map((union) => {
    const partner = membersMap.get(union.partnerId)
    const childrenIds = childrenByUnion.get(union.unionId) ?? []
    const childNodes = childrenIds
      .map((childId) =>
        buildNodeWithUnions(childId, membersMap, childrenByUnion, unionsByMember, generationFilter, new Set(visited)),
      )
      .filter((node): node is FamilyNodeDatum => Boolean(node))

    return {
      name: `${member.prenom} ${member.nom} & ${partner?.prenom ?? '?'} ${partner?.nom ?? '?'}`,
      member,
      partner,
      unionId: union.unionId,
      unionType: union.unionType,
      isUnionNode: true,
      attributes: buildAttributes(member),
      children: childNodes,
    }
  })

  if (unionNodes.length === 1) {
    return unionNodes[0]
  }

  return {
    name: `${member.prenom} ${member.nom}`,
    member,
    attributes: buildAttributes(member),
    children: unionNodes,
  }
}

function buildAttributes(member: FamilyMember): Record<string, string | number | boolean> {
  const attributes: Record<string, string | number | boolean> = {}
  if (member.generationIndex !== null && member.generationIndex !== undefined) {
    attributes['génération'] = member.generationIndex
  }
  if (member.isFamilyHead) {
    attributes['role'] = 'Chef de famille'
  }
  return attributes
}

function buildAgeLabel(birth?: string, death?: string | null) {
  if (!birth) return 'Âge inconnu'
  const birthDate = new Date(birth)
  const endDate = death ? new Date(death) : new Date()
  const age = Math.max(0, endDate.getFullYear() - birthDate.getFullYear())
  if (death) {
    return `${age} ans (†)`
  }
  return `${age} ans`
}

function formatDate(date?: string | null) {
  if (!date) return ''
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'short',
  })
}

export default FamilyTreeCanvas
