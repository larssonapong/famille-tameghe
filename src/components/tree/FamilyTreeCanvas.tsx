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
  nodeKey: string
  hasCollapsedChildren?: boolean
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

  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!treeData.length) {
      setExpandedNodes(new Set())
      return
    }
    const rootKeys = treeData.map((node) => node.nodeKey)
    setExpandedNodes((prev) => {
      const next = new Set<string>(rootKeys)
      rootKeys.forEach((key) => {
        if (prev.has(key)) {
          next.add(key)
        }
      })
      return next
    })
  }, [treeData])

  const toggleNodeExpansion = useCallback((nodeKey: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev)
      if (next.has(nodeKey)) {
        next.delete(nodeKey)
      } else {
        next.add(nodeKey)
      }
      return next
    })
  }, [])

  const withCollapsedState = useCallback(
    (nodes: FamilyNodeDatum[]): FamilyNodeDatum[] =>
      nodes.map((node) => {
        const hasChildren = (node.children?.length ?? 0) > 0
        if (!hasChildren) {
          return { ...node, hasCollapsedChildren: false }
        }
        const isExpanded = expandedNodes.has(node.nodeKey)
        if (!isExpanded) {
          return {
            ...node,
            hasCollapsedChildren: true,
            children: [],
          }
        }
        return {
          ...node,
          hasCollapsedChildren: false,
          children: node.children ? withCollapsedState(node.children as FamilyNodeDatum[]) : [],
        }
      }),
    [expandedNodes],
  )

  const interactiveTreeData = useMemo(() => {
    if (!treeData.length) return treeData
    return withCollapsedState(treeData)
  }, [treeData, withCollapsedState])

  const renderNode = useCallback(
    ({ nodeDatum }: CustomNodeElementProps) => {
      const familyNode = nodeDatum as TreeNodeDatum & {
        member: FamilyMember
        partner?: FamilyMember
        unionId?: string
        unionType?: string
        isUnionNode?: boolean
        nodeKey: string
        hasCollapsedChildren?: boolean
      }
      const member = familyNode.member
      const partner = familyNode.partner
      if (!member) return null

      const hasVisibleChildren = Boolean(familyNode.children?.length)
      const hasHiddenChildren = Boolean(familyNode.hasCollapsedChildren)
      const canToggle = hasVisibleChildren || hasHiddenChildren
      const isExpanded = expandedNodes.has(familyNode.nodeKey)

      const ageLabel = buildAgeLabel(member.dateNaissance, member.dateDeces)
      const frameColor =
        member.cadreCouleur ??
        fallbackColors[member.generationIndex ? member.generationIndex % fallbackColors.length : 0]
      const partnerFrameColor =
        partner?.cadreCouleur ??
        fallbackColors[
          partner?.generationIndex ? partner.generationIndex % fallbackColors.length : 0
        ]

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

      const handleToggleClick = (event: React.MouseEvent) => {
        event.stopPropagation()
        if (canToggle) {
          toggleNodeExpansion(familyNode.nodeKey)
        }
      }

      return (
        <g>
          {canToggle ? (
            <foreignObject width={28} height={28} x={leftX - 36} y={-14}>
              <button
                type="button"
                className={`${styles.toggleButton} ${isExpanded ? styles.toggleExpanded : styles.toggleCollapsed}`}
                onClick={handleToggleClick}
                aria-label={isExpanded ? 'Réduire cette branche' : 'Déplier cette branche'}
              >
                <span>{isExpanded ? '−' : '+'}</span>
              </button>
            </foreignObject>
          ) : null}
          <foreignObject width={cardWidth} height={cardHeight} x={leftX} y={cardY}>
            <div
              role="button"
              tabIndex={0}
              className={styles.nodeCard}
              style={{ borderColor: frameColor }}
              onClick={handleSelect}
              onKeyDown={handleKeyDown}
              aria-label={`Voir ${member.nom} ${member.prenom}`}
            >
              <div className={styles.nodeHeading}>
                <div>
                  <div className={styles.nodeName}>
                    {member.nom} {member.prenom}
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
                  style={{ borderColor: partnerFrameColor }}
                  onClick={() => onSelectMember?.(partner, member)}
                  onKeyDown={(event: React.KeyboardEvent<HTMLDivElement>) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      onSelectMember?.(partner, member)
                    }
                  }}
                  aria-label={`Voir ${partner.nom} ${partner.prenom}`}
                >
                  <div className={styles.nodeHeading}>
                    <div>
                      <div className={styles.partnerName}>
                        {partner.nom} {partner.prenom}
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
    [onSelectMember, expandedNodes, toggleNodeExpansion],
  )

  return (
    <div className={styles.canvasContainer} ref={containerRef}>
      <Tree
        data={interactiveTreeData}
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

  const unionKeyMap = new Map<string, string>()

  const toUnionKey = (parentA: string, parentB: string) => {
    const [first, second] = [parentA, parentB].sort()
    return `${first}::${second}`
  }

  payload.unions.forEach((union) => {
    unionKeyMap.set(toUnionKey(union.partenaireAId, union.partenaireBId), union.id)
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
  })

  parentsByChild.forEach((parentIds, childId) => {
    const uniqueParents = Array.from(new Set(parentIds))
    if (uniqueParents.length < 2) {
      return
    }

    for (let i = 0; i < uniqueParents.length - 1; i += 1) {
      for (let j = i + 1; j < uniqueParents.length; j += 1) {
        const key = toUnionKey(uniqueParents[i], uniqueParents[j])
        const unionId = unionKeyMap.get(key)
        if (!unionId) continue
        if (!childrenByUnion.has(unionId)) {
          childrenByUnion.set(unionId, [])
        }
        childrenByUnion.get(unionId)!.push(childId)
      }
    }
  })

  const roots = payload.members.filter((member) => {
    const hasParent = parentsByChild.has(member.id)
    return !hasParent || member.isFamilyHead
  })

  const uniqueRoots = roots.length ? roots : payload.members.filter((member) => !parentsByChild.has(member.id))

  const rootNodes = uniqueRoots
    .map((member) =>
      buildNodeWithUnions(member.id, membersMap, childrenByUnion, unionsByMember, generationFilter, new Set()),
    )
    .filter((node): node is FamilyNodeDatum => Boolean(node))

  if (!rootNodes.length) {
    return []
  }

  const sortedRoots = rootNodes.sort((a, b) => compareRoots(a, b))
  const preferredRoot = sortedRoots[0]

  return [preferredRoot]
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
      name: `${member.nom} ${member.prenom}`,
      member,
      nodeKey: `member-${member.id}`,
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
      name: `${member.nom} ${member.prenom} & ${partner?.nom ?? '?'} ${partner?.prenom ?? '?'}`,
      member,
      partner,
      unionId: union.unionId,
      unionType: union.unionType,
      isUnionNode: true,
      nodeKey: `union-${union.unionId}-${member.id}`,
      attributes: buildAttributes(member),
      children: childNodes,
    }
  })

  if (unionNodes.length === 1) {
    return unionNodes[0]
  }

  return {
    name: `${member.nom} ${member.prenom}`,
    member,
    nodeKey: `member-${member.id}`,
    attributes: buildAttributes(member),
    children: unionNodes,
  }
}

function computeRootScore(node: FamilyNodeDatum): number {
  const descendantWeight = countDescendants(node)
  const generationPenalty = node.member?.generationIndex ?? 99
  const headBonus = node.member?.isFamilyHead ? descendantWeight * 10 : 0
  return descendantWeight * 100 - generationPenalty + headBonus
}

function compareRoots(a: FamilyNodeDatum, b: FamilyNodeDatum): number {
  const genA = a.member?.generationIndex ?? Number.POSITIVE_INFINITY
  const genB = b.member?.generationIndex ?? Number.POSITIVE_INFINITY
  if (genA !== genB) {
    return genA - genB
  }

  const headA = a.member?.isFamilyHead ? 1 : 0
  const headB = b.member?.isFamilyHead ? 1 : 0
  if (headA !== headB) {
    return headB - headA
  }

  const scoreDiff = computeRootScore(b) - computeRootScore(a)
  if (scoreDiff !== 0) {
    return scoreDiff
  }

  const nameA = `${a.member?.nom ?? ''} ${a.member?.prenom ?? ''}`
  const nameB = `${b.member?.nom ?? ''} ${b.member?.prenom ?? ''}`
  return nameA.localeCompare(nameB)
}

function countDescendants(node: FamilyNodeDatum): number {
  const children = node.children ?? []
  if (!children.length) return 1
  return 1 + children.reduce((sum, child) => sum + countDescendants(child as FamilyNodeDatum), 0)
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
