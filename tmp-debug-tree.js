const payload = {
  members: [
    { id: '476ebcc8-8985-403c-b9b4-e47f6c2e5ec3', prenom: 'Lydie', nom: 'Amafo', surnom: '( ntiah )', genre: 'femme', cadreCouleur: '#ff0000', generationIndex: 0, isFamilyHead: false },
    { id: '1b4db06a-dce4-491d-a7e3-ef5f1d1d7e7a', prenom: 'Monique', nom: 'Djuine', surnom: '( ntiah )', genre: 'femme', cadreCouleur: '#d14747', generationIndex: 0 },
    { id: '6c972d98-070e-48ba-b99f-63178afb5401', prenom: 'Jacob', nom: 'Tameghe', surnom: '( Nieh pong gong )', genre: 'homme', cadreCouleur: '#ffaa00', generationIndex: 0, isFamilyHead: false },
    { id: '022fd893-c844-4ba1-940d-adaaa4c8d0b1', prenom: 'Albert Fredy', nom: 'Atala', genre: 'homme', cadreCouleur: '#00ffff', generationIndex: 1 },
    { id: '950b073a-bed7-4196-beaf-56dfa486709f', prenom: 'Innocent', nom: 'Soh Kachie', genre: 'homme', cadreCouleur: '#00ffff', generationIndex: 1 },
    { id: '14ebf88f-839e-4adb-983a-b5382d665d47', prenom: 'Blandine', nom: 'Tameghe', genre: 'femme', cadreCouleur: '#00ffff', generationIndex: 1 },
    { id: '479f461b-b349-4432-a949-d095adbc3e45', prenom: 'Aimee', nom: 'Ngmafochand', genre: 'femme', cadreCouleur: '#ff00d0', generationIndex: 1 },
    { id: '3071cf18-50e8-4847-9730-14a377b573f4', prenom: 'Angele', nom: 'Makegne', genre: 'femme', cadreCouleur: '#ff00d0', generationIndex: 1 },
    { id: 'dd9c29cc-47fc-475b-a67c-089641fa2361', prenom: 'gaele', nom: 'Atala', genre: 'femme', cadreCouleur: '#ff00d0', generationIndex: 1 },
    { id: '9ee27ce9-e6d8-4163-8e0e-f1cc4a495658', prenom: 'mbasso', nom: 'Mbasso', genre: 'homme', cadreCouleur: '#0033ff', generationIndex: 1 },
    { id: '7f1bbd40-cee7-46b3-9160-f2b15eea80f2', prenom: 'soh', nom: 'Soh ', genre: 'homme', cadreCouleur: '#0033ff', generationIndex: 1 },
    { id: '0e51fbe3-b03f-4d49-9297-159f24274a28', prenom: 'Martin', nom: 'Ngoungeu', genre: 'homme', cadreCouleur: '#0033ff', generationIndex: 1 },
    { id: '2c06ec9f-771a-4be0-8e34-29fee20c2b96', prenom: 'Nicole', nom: 'Tameghe', genre: 'femme', cadreCouleur: '#00ffff', generationIndex: 1 },
    { id: '91273c16-a8e9-4c6c-b069-894e653d68cd', prenom: 'Yvonne', nom: 'Kengne', genre: 'femme', cadreCouleur: '#00ffff', generationIndex: 1 },
    { id: '8055e763-92d3-4d95-a02c-944a76f6c1fb', prenom: 'Bernard', nom: 'Signe', genre: 'homme', cadreCouleur: '#00ffff', generationIndex: 1 },
    { id: '284ff354-0ca8-4c54-9aa7-703c090877bf', prenom: 'Fernan', nom: 'Apong Tameghe', genre: 'homme', cadreCouleur: '#0fffff', generationIndex: 1, isFamilyHead: true },
    { id: 'ae9108b6-d2f9-4d12-a5a1-c90f0fbd122e', prenom: 'Simone', nom: 'Ngussi Tameghe', genre: 'femme', cadreCouleur: '#00ffff', generationIndex: 1 },
    { id: '3bf6b45d-d101-41d1-b03a-ce5606cdab09', prenom: 'Simone Merveille', nom: 'Tchoutchoua Mbasso ', genre: 'femme', cadreCouleur: '#ff0000', generationIndex: 2 },
    { id: 'ae941597-d64d-45dc-a1c8-cc2838b399af', prenom: 'Celesta Victoire', nom: 'Adabou Mbasso ', genre: 'femme', cadreCouleur: '#ff0000', generationIndex: 2 },
    { id: '20517a79-d110-4b26-a9bd-1eb605d6ff76', prenom: 'Tresor', nom: 'Tameghe Mbasso', genre: 'homme', cadreCouleur: '#ff0000', generationIndex: 2 },
    { id: '5033c615-08cf-475c-b77a-4ab97ef1d815', prenom: 'Maurice Romuald', nom: 'Suffo Mbasso ', genre: 'homme', cadreCouleur: '#ff0000', generationIndex: 2 },
  ],
  relationships: [
    ['6c972d98-070e-48ba-b99f-63178afb5401', '950b073a-bed7-4196-beaf-56dfa486709f'],
    ['1b4db06a-dce4-491d-a7e3-ef5f1d1d7e7a', '950b073a-bed7-4196-beaf-56dfa486709f'],
    ['6c972d98-070e-48ba-b99f-63178afb5401', '284ff354-0ca8-4c54-9aa7-703c090877bf'],
    ['1b4db06a-dce4-491d-a7e3-ef5f1d1d7e7a', '284ff354-0ca8-4c54-9aa7-703c090877bf'],
    ['6c972d98-070e-48ba-b99f-63178afb5401', 'ae9108b6-d2f9-4d12-a5a1-c90f0fbd122e'],
    ['1b4db06a-dce4-491d-a7e3-ef5f1d1d7e7a', 'ae9108b6-d2f9-4d12-a5a1-c90f0fbd122e'],
    ['6c972d98-070e-48ba-b99f-63178afb5401', '2c06ec9f-771a-4be0-8e34-29fee20c2b96'],
    ['1b4db06a-dce4-491d-a7e3-ef5f1d1d7e7a', '2c06ec9f-771a-4be0-8e34-29fee20c2b96'],
    ['6c972d98-070e-48ba-b99f-63178afb5401', '14ebf88f-839e-4adb-983a-b5382d665d47'],
    ['6c972d98-070e-48ba-b99f-63178afb5401', '022fd893-c844-4ba1-940d-adaaa4c8d0b1'],
    ['1b4db06a-dce4-491d-a7e3-ef5f1d1d7e7a', '14ebf88f-839e-4adb-983a-b5382d665d47'],
    ['1b4db06a-dce4-491d-a7e3-ef5f1d1d7e7a', '022fd893-c844-4ba1-940d-adaaa4c8d0b1'],
    ['9ee27ce9-e6d8-4163-8e0e-f1cc4a495658', '3bf6b45d-d101-41d1-b03a-ce5606cdab09'],
    ['9ee27ce9-e6d8-4163-8e0e-f1cc4a495658', '5033c615-08cf-475c-b77a-4ab97ef1d815'],
    ['9ee27ce9-e6d8-4163-8e0e-f1cc4a495658', '20517a79-d110-4b26-a9bd-1eb605d6ff76'],
    ['9ee27ce9-e6d8-4163-8e0e-f1cc4a495658', 'ae941597-d64d-45dc-a1c8-cc2838b399af'],
    ['ae9108b6-d2f9-4d12-a5a1-c90f0fbd122e', '3bf6b45d-d101-41d1-b03a-ce5606cdab09'],
    ['ae9108b6-d2f9-4d12-a5a1-c90f0fbd122e', '5033c615-08cf-475c-b77a-4ab97ef1d815'],
    ['ae9108b6-d2f9-4d12-a5a1-c90f0fbd122e', '20517a79-d110-4b26-a9bd-1eb605d6ff76'],
    ['ae9108b6-d2f9-4d12-a5a1-c90f0fbd122e', 'ae941597-d64d-45dc-a1c8-cc2838b399af'],
  ].map(([parentId, childId], idx) => ({ id: `rel-${idx}`, parentId, childId, typeRelation: 'biologique' })),
  unions: [
    ['9dff5f6f-92fb-49ec-926f-e95b7c62c935', '6c972d98-070e-48ba-b99f-63178afb5401', '476ebcc8-8985-403c-b9b4-e47f6c2e5ec3'],
    ['bede189e-f9b3-40d3-b53f-92a597e78945', '6c972d98-070e-48ba-b99f-63178afb5401', '1b4db06a-dce4-491d-a7e3-ef5f1d1d7e7a'],
    ['e29fba85-23fc-4376-a0b7-e5360ffca3b4', '950b073a-bed7-4196-beaf-56dfa486709f', '3071cf18-50e8-4847-9730-14a377b573f4'],
    ['0f0fa755-72ac-411a-a1e6-dec9b3bad873', '284ff354-0ca8-4c54-9aa7-703c090877bf', '479f461b-b349-4432-a949-d095adbc3e45'],
    ['e7846b1b-9243-4541-9f6c-68683e3fdda7', '022fd893-c844-4ba1-940d-adaaa4c8d0b1', 'dd9c29cc-47fc-475b-a67c-089641fa2361'],
    ['a6aac7e3-d120-453c-9da5-6c1444db0dee', 'ae9108b6-d2f9-4d12-a5a1-c90f0fbd122e', '9ee27ce9-e6d8-4163-8e0e-f1cc4a495658'],
    ['5efae0f5-230c-4b41-937f-84ebdd5ef840', '2c06ec9f-771a-4be0-8e34-29fee20c2b96', '7f1bbd40-cee7-46b3-9160-f2b15eea80f2'],
    ['46f787e2-58c1-43ee-b265-15f06a6cce17', '14ebf88f-839e-4adb-983a-b5382d665d47', '0e51fbe3-b03f-4d49-9297-159f24274a28'],
    ['cc0f3959-3b6c-435d-aaf6-ce00166252d3', '7f1bbd40-cee7-46b3-9160-f2b15eea80f2', '2c06ec9f-771a-4be0-8e34-29fee20c2b96'],
  ].map(([id, partenaireAId, partenaireBId]) => ({ id, partenaireAId, partenaireBId, typeRelation: 'mariage' })),
}

function buildTreeData(payload, generationFilter) {
  const membersMap = new Map(payload.members.map((member) => [member.id, member]))
  const childrenByUnion = new Map()
  const parentsByChild = new Map()
  const unionsByMember = new Map()

  const unionKeyMap = new Map()

  const toUnionKey = (parentA, parentB) => {
    const [first, second] = [parentA, parentB].sort()
    return `${first}::${second}`
  }

  payload.unions.forEach((union) => {
    unionKeyMap.set(toUnionKey(union.partenaireAId, union.partenaireBId), union.id)
    if (!unionsByMember.has(union.partenaireAId)) {
      unionsByMember.set(union.partenaireAId, [])
    }
    unionsByMember.get(union.partenaireAId).push({
      unionId: union.id,
      partnerId: union.partenaireBId,
      unionType: union.typeRelation,
    })

    if (!unionsByMember.has(union.partenaireBId)) {
      unionsByMember.set(union.partenaireBId, [])
    }
    unionsByMember.get(union.partenaireBId).push({
      unionId: union.id,
      partnerId: union.partenaireAId,
      unionType: union.typeRelation,
    })
  })

  payload.relationships.forEach((relationship) => {
    if (!parentsByChild.has(relationship.childId)) {
      parentsByChild.set(relationship.childId, [])
    }
    parentsByChild.get(relationship.childId).push(relationship.parentId)
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
        childrenByUnion.get(unionId).push(childId)
      }
    }
  })

  console.log(
    'childrenByUnion final:',
    [...childrenByUnion.entries()].map(([unionId, children]) => ({ unionId, children })),
  )

  const roots = payload.members.filter((member) => {
    const hasParent = parentsByChild.has(member.id)
    return !hasParent || member.isFamilyHead
  })

  const uniqueRoots = roots.length ? roots : payload.members.filter((member) => !parentsByChild.has(member.id))

  return uniqueRoots
    .map((member) =>
      buildNodeWithUnions(member.id, membersMap, childrenByUnion, unionsByMember, generationFilter, new Set()),
    )
    .filter(Boolean)
}

function buildNodeWithUnions(
  memberId,
  membersMap,
  childrenByUnion,
  unionsByMember,
  generationFilter,
  visited,
) {
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
      attributes: {},
      children: [],
    }
  }

  const unionNodes = unions.map((union) => {
    const partner = membersMap.get(union.partnerId)
    const childrenIds = childrenByUnion.get(union.unionId) ?? []
    const childNodes = childrenIds
      .map((childId) =>
        buildNodeWithUnions(childId, membersMap, childrenByUnion, unionsByMember, generationFilter, new Set(visited)),
      )
      .filter(Boolean)

    return {
      name: `${member.nom} ${member.prenom} & ${partner?.nom ?? '?'} ${partner?.prenom ?? '?'}`,
      member,
      partner,
      unionId: union.unionId,
      unionType: union.unionType,
      isUnionNode: true,
      attributes: {},
      children: childNodes,
    }
  })

  if (unionNodes.length === 1) {
    return unionNodes[0]
  }

  return {
    name: `${member.nom} ${member.prenom}`,
    member,
    attributes: {},
    children: unionNodes,
  }
}

const treeData = buildTreeData(payload, 'all')
console.log('treeData length:', treeData.length)
console.log('Tree root name:', treeData[0]?.name)
console.log('Root descendant count:', countDescendants(treeData[0]))
console.log('Root children labels:', treeData[0]?.children?.map((child) => child.name))

function countDescendants(node) {
  if (!node) return 0
  const children = node.children ?? []
  if (!children.length) {
    return 1
  }
  return 1 + children.reduce((sum, child) => sum + countDescendants(child), 0)
}

function* childrenByUnionEntries(payloadData) {
  const membersMap = new Map(payloadData.members.map((member) => [member.id, member]))
  const childrenByUnion = new Map()
  const parentsByChild = new Map()
  const unionKeyMap = new Map()

  const toUnionKey = (parentA, parentB) => {
    const [first, second] = [parentA, parentB].sort()
    return `${first}::${second}`
  }

  payloadData.unions.forEach((union) => {
    unionKeyMap.set(toUnionKey(union.partenaireAId, union.partenaireBId), union.id)
  })

  payloadData.relationships.forEach((relationship) => {
    if (!parentsByChild.has(relationship.childId)) {
      parentsByChild.set(relationship.childId, [])
    }
    parentsByChild.get(relationship.childId).push(relationship.parentId)
  })

  parentsByChild.forEach((parentIds, childId) => {
    const uniqueParents = Array.from(new Set(parentIds))
    if (uniqueParents.length < 2) return
    for (let i = 0; i < uniqueParents.length - 1; i += 1) {
      for (let j = i + 1; j < uniqueParents.length; j += 1) {
        const key = toUnionKey(uniqueParents[i], uniqueParents[j])
        const unionId = unionKeyMap.get(key)
        if (!unionId) continue
        if (!childrenByUnion.has(unionId)) {
          childrenByUnion.set(unionId, [])
        }
        childrenByUnion.get(unionId).push(childId)
      }
    }
  })

  for (const [unionId, children] of childrenByUnion.entries()) {
    const union = payloadData.unions.find((u) => u.id === unionId)
    const parentA = membersMap.get(union.partenaireAId)
    const parentB = membersMap.get(union.partenaireBId)
    yield {
      unionId,
      parents: `${parentA?.nom ?? '?'} ${parentA?.prenom ?? '?'} & ${parentB?.nom ?? '?'} ${parentB?.prenom ?? '?'}`,
      childCount: children.length,
    }
  }
}
